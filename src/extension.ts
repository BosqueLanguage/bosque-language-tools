import { spawn } from "node:child_process";
import * as path from "node:path";
import * as vscode from "vscode";

type IDEOpErrorInfo = {
	filename: string;
	line: number;
	msg: string;
};

const diagnosticsSource = "Bosque checker";
const bosqueFilePattern = "**/*.{bsq,bsqtest}";
const ideOpsPath = path.resolve(__dirname, "../engine/src/cmd/ideops.js");

export function activate(context: vscode.ExtensionContext) {
	const diagnostics = vscode.languages.createDiagnosticCollection("bosque");

	context.subscriptions.push(
		diagnostics,
		vscode.workspace.onDidSaveTextDocument((document) => void runBosqueCheck(document, diagnostics)),
	);
}

export function deactivate() {}

function isBosqueDocument(document: vscode.TextDocument): boolean {
	return document.languageId === "bosque" && document.uri.scheme === "file";
}

async function runBosqueCheck(document: vscode.TextDocument, diagnostics: vscode.DiagnosticCollection): Promise<void> {
	if (!isBosqueDocument(document)) {
		return;
	}

	const bosqueFiles = await getBosqueWorkspaceFiles(document);
	const [errors, crash] = await runIDETypeCheck(bosqueFiles.map((uri) => uri.fsPath));

	if (crash !== undefined) {
		diagnostics.clear();
		void vscode.window.showErrorMessage(`Bosque checker crashed for ${path.basename(document.uri.fsPath)}: ${crash}`);
		return;
	}

	diagnostics.clear();
	diagnostics.set(await createDiagnostics(bosqueFiles, errors, document));
}

function createDiagnostic(document: vscode.TextDocument, error: IDEOpErrorInfo): vscode.Diagnostic {
	const range = createDiagnosticRange(document, error.line);
	const diagnostic = new vscode.Diagnostic(range, error.msg, vscode.DiagnosticSeverity.Error);

	diagnostic.source = diagnosticsSource;

	return diagnostic;
}

function createDiagnosticRange(document: vscode.TextDocument, lineNumber: number): vscode.Range {
	if (document.lineCount === 0) {
		return new vscode.Range(0, 0, 0, 0);
	}

	const lineIndex = Math.min(Math.max(lineNumber - 1, 0), document.lineCount - 1);
	const line = document.lineAt(lineIndex);

	return line.range.isEmpty
		? new vscode.Range(line.range.start, line.range.start)
		: line.range;
}

async function getBosqueWorkspaceFiles(document: vscode.TextDocument): Promise<vscode.Uri[]> {
	const workspaceFiles = await vscode.workspace.findFiles(bosqueFilePattern);

	if (workspaceFiles.some((uri) => normalizeFsPath(uri.fsPath) === normalizeFsPath(document.uri.fsPath))) {
		return workspaceFiles;
	}

	return [...workspaceFiles, document.uri];
}

async function runIDETypeCheck(filePaths: string[]): Promise<[IDEOpErrorInfo[], string | undefined]> {
	return new Promise((resolve) => {
		const child = spawn('node', [ideOpsPath, ...filePaths], { shell: true });
		let stdout = "";
		let stderr = "";
		let settled = false;

		child.stdout.on("data", (chunk: Buffer | string) => {
			stdout += chunk.toString();
		});

		child.stderr.on("data", (chunk: Buffer | string) => {
			stderr += chunk.toString();
		});

		child.once("error", (error) => {
			if (!settled) {
				settled = true;
				resolve([[], `Failed to launch Bosque checker: ${error.message}`]);
			}
		});

		child.once("close", (code) => {
			if (settled) {
				return;
			}

			settled = true;

			if (code !== 0) {
				const message = stderr.trim();
				resolve([[], message.length !== 0 ? message : `Bosque checker exited with code ${code ?? "unknown"}`]);
				return;
			}

			try {
				const parsed = JSON.parse(stdout) as unknown;

				if (!Array.isArray(parsed)) {
					resolve([[], "Bosque checker returned a non-array JSON payload"]);
					return;
				}

				resolve([parsed as IDEOpErrorInfo[], undefined]);
			}
			catch (error) {
				resolve([[], `Failed to parse Bosque checker output: ${error instanceof Error ? error.message : String(error)}`]);
			}
		});
	});
}

async function createDiagnostics(
	bosqueFiles: readonly vscode.Uri[],
	errors: readonly IDEOpErrorInfo[],
	activeDocument: vscode.TextDocument,
): Promise<Array<[vscode.Uri, readonly vscode.Diagnostic[]]>> {
	const errorsByPath = new Map<string, IDEOpErrorInfo[]>();
	const urisByPath = new Map<string, vscode.Uri>(bosqueFiles.map((uri) => [normalizeFsPath(uri.fsPath), uri]));
	const diagnosticsByPath = new Map<string, [vscode.Uri, readonly vscode.Diagnostic[]]>(
		bosqueFiles.map((uri) => [normalizeFsPath(uri.fsPath), [uri, [] as readonly vscode.Diagnostic[]]]),
	);

	for (const error of errors) {
		const errorUri = urisByPath.get(normalizeFsPath(error.filename)) ?? vscode.Uri.file(error.filename);
		const errorPath = normalizeFsPath(errorUri.fsPath);
		const fileErrors = errorsByPath.get(errorPath);

		if (fileErrors !== undefined) {
			fileErrors.push(error);
		}
		else {
			errorsByPath.set(errorPath, [error]);
		}
	}

	const errorEntries = await Promise.all(
		Array.from(errorsByPath.entries()).map(async ([errorPath, fileErrors]) => {
			const uri = urisByPath.get(errorPath) ?? vscode.Uri.file(fileErrors[0].filename);
			const document = normalizeFsPath(uri.fsPath) === normalizeFsPath(activeDocument.uri.fsPath)
				? activeDocument
				: await vscode.workspace.openTextDocument(uri);

			return [errorPath, [uri, fileErrors.map((error) => createDiagnostic(document, error))] as [vscode.Uri, readonly vscode.Diagnostic[]]] as const;
		}),
	);

	for (const [errorPath, entry] of errorEntries) {
		diagnosticsByPath.set(errorPath, entry);
	}

	return Array.from(diagnosticsByPath.values());
}

function normalizeFsPath(filePath: string): string {
	const normalized = path.normalize(filePath);
	return process.platform === "win32" ? normalized.toLowerCase() : normalized;
}
