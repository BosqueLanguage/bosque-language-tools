import assert from "node:assert";
import { SourceInfo } from "./build_decls.js";
import { AutoTypeSignature, VoidTypeSignature } from "./type.js";
function isDeclAssignable(declkind) {
    return declkind === "var" || declkind === "out" || declkind === "out?" || declkind === "inout";
}
class VariableDefinitionInfo {
    constructor(vkind, name) {
        this.vkind = vkind;
        this.name = name;
    }
}
class BlockScopeInfo {
    constructor() {
        this.locals = [];
    }
    lookupVariableInfo(name) {
        return this.locals.find((nn) => nn.name === name);
    }
}
class ParserScopeInfo {
    constructor(args, boundtemplates, rtype) {
        this.args = args;
        this.boundtemplates = boundtemplates;
        this.resultingType = rtype;
        this.blockscope = [new BlockScopeInfo()];
    }
    pushBlockScope() {
        this.blockscope.push(new BlockScopeInfo());
    }
    popBlockScope() {
        this.blockscope.pop();
    }
    checkCanDeclareLocalVar(name) {
        if (name === "_" || name === "this" || name === "self" || name.startsWith("$")) {
            return false;
        }
        const islocalredecl = this.blockscope.some((bs) => bs.lookupVariableInfo(name) !== undefined);
        const isargredecl = this.args.some((arg) => arg.name === name);
        return !islocalredecl && !isargredecl;
    }
    checkCanAssignVariable(name) {
        if (name === "_" || name === "this" || name === "self" || name.startsWith("$")) {
            return false;
        }
        //can't assign to a binder (so dont even check there) and can't assign to any lambda captures so no need to check there either
        for (let i = this.blockscope.length - 1; i >= 0; --i) {
            const vinfo = this.blockscope[i].lookupVariableInfo(name);
            if (vinfo !== undefined) {
                return isDeclAssignable(vinfo.vkind);
            }
        }
        const argi = this.args.find((arg) => arg.name === name);
        return argi !== undefined && isDeclAssignable(argi.vkind);
    }
    isDefinedVariable_helper(name) {
        for (let i = this.blockscope.length - 1; i >= 0; --i) {
            const vv = this.blockscope[i].lookupVariableInfo(name);
            if (vv !== undefined) {
                return true;
            }
        }
        if (this.args.some((arg) => arg.name === name)) {
            return true;
        }
        return false;
    }
}
class StandardScopeInfo extends ParserScopeInfo {
    constructor(args, boundtemplates, rtype) {
        super(args, boundtemplates, rtype);
    }
    isDefinedVariable(srcname) {
        return this.isDefinedVariable_helper(srcname);
    }
}
class LambdaScopeInfo extends ParserScopeInfo {
    constructor(args, boundtemplates, rtype, enclosing) {
        super(args, boundtemplates, rtype);
        this.enclosing = enclosing;
    }
    isDefinedVariable(srcname) {
        const tdef = this.isDefinedVariable_helper(srcname);
        if (tdef) {
            return true;
        }
        else {
            return this.enclosing.isDefinedVariable(srcname);
        }
    }
}
class ParserEnvironment {
    constructor(assembly, currentFile, currentNamespace) {
        this.assembly = assembly;
        this.currentFile = currentFile;
        this.currentNamespace = currentNamespace;
        this.scope = undefined;
        this.SpecialVoidSignature = new VoidTypeSignature(SourceInfo.implicitSourceInfo());
        this.SpecialAutoSignature = new AutoTypeSignature(SourceInfo.implicitSourceInfo());
    }
    getScope() {
        assert(this.scope !== undefined);
        return this.scope;
    }
    pushBlockScope() {
        assert(this.scope !== undefined);
        this.scope.blockscope.push(new BlockScopeInfo());
    }
    popBlockScope() {
        assert(this.scope !== undefined);
        this.scope.blockscope.pop();
    }
    identifierResolvesAsVariable(srcname) {
        assert(this.scope !== undefined);
        return srcname.startsWith("$") || this.scope.isDefinedVariable(srcname);
    }
    addVariable(name, vkind, ignoreok) {
        assert(this.scope !== undefined);
        if (name === "_") {
            return ignoreok;
        }
        else {
            if (!this.scope.checkCanDeclareLocalVar(name)) {
                return false;
            }
            this.scope.blockscope[this.scope.blockscope.length - 1].locals.push(new VariableDefinitionInfo(vkind, name));
            return true;
        }
    }
    assignVariable(srcname) {
        assert(this.scope !== undefined);
        if (srcname === "_") {
            return true;
        }
        else {
            return this.scope.checkCanAssignVariable(srcname);
        }
    }
    isTemplateNameDefined(name) {
        assert(this.scope !== undefined);
        return this.scope.boundtemplates.has(name);
    }
    pushLambdaScope(args, rtype) {
        assert(this.scope !== undefined);
        this.scope = new LambdaScopeInfo(args, this.scope.boundtemplates, rtype, this.scope);
    }
    popLambdaScope() {
        assert(this.scope !== undefined);
        assert(this.scope instanceof LambdaScopeInfo);
        this.scope = this.scope.enclosing;
    }
    pushStandardFunctionScope(args, terms, rtype) {
        assert(this.scope === undefined);
        this.scope = new StandardScopeInfo(args, terms, rtype);
    }
    popStandardFunctionScope() {
        assert(this.scope !== undefined);
        assert(this.scope instanceof StandardScopeInfo);
        this.scope = undefined;
    }
}
export { VariableDefinitionInfo, BlockScopeInfo, ParserScopeInfo, StandardScopeInfo, LambdaScopeInfo, ParserEnvironment };
//# sourceMappingURL=parser_env.js.map