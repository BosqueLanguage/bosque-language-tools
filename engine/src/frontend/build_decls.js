class SourceInfo {
    constructor(line, column, cpos, span) {
        this.line = line;
        this.column = column;
        this.pos = cpos;
        this.span = span;
    }
    static implicitSourceInfo() {
        return new SourceInfo(-1, -1, -1, -1);
    }
    static computeInfoSpan(start, end) {
        return new SourceInfo(start.line, start.column, start.pos, (start.pos - end.pos) + end.span);
    }
}
class CodeFormatter {
    constructor() {
        this.level = 0;
    }
    indentPush() {
        this.level++;
    }
    indentPop() {
        this.level--;
    }
    indent(code) {
        return "    ".repeat(this.level) + code;
    }
}
function isBuildLevelEnabled(check, enabled) {
    if (enabled === "safety") {
        return true;
    }
    if (enabled === "spec") {
        return check === "spec" || check === "debug" || check === "test" || check === "release";
    }
    else if (enabled === "debug") {
        return check === "debug" || check === "test" || check === "release";
    }
    else if (enabled === "test") {
        return check === "test" || check === "release";
    }
    else {
        return check === "release";
    }
}
class PackageConfig {
    constructor(macrodefs, src) {
        this.macrodefs = macrodefs;
        this.src = src;
    }
    jemit() {
        return { macrodefs: this.macrodefs, src: this.src };
    }
    static jparse(jobj) {
        return new PackageConfig(jobj.macrodefs, jobj.src);
    }
}
export { isBuildLevelEnabled, CodeFormatter, SourceInfo, PackageConfig, };
//# sourceMappingURL=build_decls.js.map