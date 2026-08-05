import assert from "node:assert";
class VarInfo {
    constructor(srcname, decltype, vkind, mustDefined) {
        this.srcname = srcname;
        this.decltype = decltype;
        this.vkind = vkind;
        this.mustDefined = mustDefined;
    }
    clone() {
        return new VarInfo(this.srcname, this.decltype, this.vkind, this.mustDefined);
    }
    updateDefine() {
        return new VarInfo(this.srcname, this.decltype, this.vkind, true);
    }
}
class TypeInferContext {
    static asSimpleType(ctx) {
        if (ctx === undefined) {
            return undefined;
        }
        else {
            return ctx instanceof SimpleTypeInferContext ? ctx.ttype : undefined;
        }
    }
    static asEListOptions(ctx) {
        if (ctx === undefined) {
            return undefined;
        }
        else {
            return ctx instanceof EListStyleTypeInferContext ? ctx.elist : undefined;
        }
    }
}
class SimpleTypeInferContext extends TypeInferContext {
    constructor(ttype) {
        super();
        this.ttype = ttype;
    }
}
class EListStyleTypeInferContext extends TypeInferContext {
    constructor(elist) {
        super();
        this.elist = elist;
    }
}
class LocalScope {
    constructor(binderscope, locals, accessed) {
        this.binderscope = binderscope;
        this.locals = locals;
        this.accessed = accessed;
    }
    clone() {
        return new LocalScope(this.binderscope, [...this.locals.map((v) => v.clone())], new Set(this.accessed));
    }
    resolveLocalVarInfoFromSrcName(vname) {
        const vinfo = this.locals.find((v) => v.srcname === vname);
        if (vinfo !== undefined && this.binderscope) {
            this.accessed.add(vname);
        }
        return vinfo;
    }
    assignLocalVariable(vname) {
        const vidx = this.locals.findIndex((v) => v.srcname === vname);
        if (vidx === -1) {
            return [this, false];
        }
        else {
            let newlocals = [...this.locals];
            newlocals[vidx] = newlocals[vidx].updateDefine();
            return [new LocalScope(this.binderscope, newlocals, this.accessed), true];
        }
    }
    static mergeLocalScopes(origscope, allscopes, envs) {
        let locals = [];
        if (envs.length === 0) {
            for (let i = 0; i < origscope.locals.length; i++) {
                locals.push(new VarInfo(origscope.locals[i].srcname, origscope.locals[i].decltype, origscope.locals[i].vkind, origscope.locals[i].mustDefined));
            }
        }
        else {
            for (let i = 0; i < origscope.locals.length; i++) {
                const mdef = envs.every((e) => e.locals[i].mustDefined);
                locals.push(new VarInfo(envs[0].locals[i].srcname, envs[0].locals[i].decltype, envs[0].locals[i].vkind, mdef));
            }
        }
        let baccess = new Set(origscope.accessed);
        for (let i = 0; i < allscopes.length; i++) {
            baccess = new Set([...baccess, ...allscopes[i].accessed]);
        }
        return new LocalScope(origscope.binderscope, locals, baccess);
    }
}
class TypeResultWRefVarInfoResult {
    static checkRWVarConflicts(setcondout, setuncond, usemod) {
        //check for conflicts between setcondout/setuncond/usemod
        let assigned = new Set();
        for (let i = 0; i < setcondout.ttrue.length; i++) {
            if (assigned.has(setcondout.ttrue[i])) {
                return false;
            }
            assigned.add(setcondout.ttrue[i]);
        }
        for (let i = 0; i < setcondout.tfalse.length; i++) {
            if (assigned.has(setcondout.tfalse[i])) {
                return false;
            }
            assigned.add(setcondout.tfalse[i]);
        }
        for (let i = 0; i < setuncond.length; i++) {
            if (assigned.has(setuncond[i])) {
                return false;
            }
            assigned.add(setuncond[i]);
        }
        for (let i = 0; i < usemod.length; i++) {
            if (assigned.has(usemod[i])) {
                return false;
            }
            assigned.add(usemod[i]);
        }
        return true;
    }
    checkNewRWVarConflicts(assigned) {
        //check for conflicts between setcondout/setuncond/usemod
        for (let i = 0; i < this.setcondout.ttrue.length; i++) {
            if (assigned.has(this.setcondout.ttrue[i])) {
                return false;
            }
        }
        for (let i = 0; i < this.setcondout.tfalse.length; i++) {
            if (assigned.has(this.setcondout.tfalse[i])) {
                return false;
            }
        }
        for (let i = 0; i < this.setuncond.length; i++) {
            if (assigned.has(this.setuncond[i])) {
                return false;
            }
        }
        for (let i = 0; i < this.usemod.length; i++) {
            if (assigned.has(this.usemod[i])) {
                return false;
            }
        }
        return true;
    }
    constructor(tsig, alwaystrue, alwaysfalse, setcondout, setuncond, usemod, bbinds) {
        this.tsig = tsig;
        this.alwaystrue = alwaystrue;
        this.alwaysfalse = alwaysfalse;
        this.setcondout = setcondout;
        this.setuncond = setuncond;
        this.usemod = usemod;
        this.bbinds = bbinds;
    }
    static makeSimpleResult(tsig) {
        return new TypeResultWRefVarInfoResult(tsig, false, false, { ttrue: [], tfalse: [] }, [], [], []);
    }
    static makeGeneralResult(tsig, alwaystrue, alwaysfalse, setcondout, setuncond, usemod, bbinds) {
        if (!TypeResultWRefVarInfoResult.checkRWVarConflicts(setcondout, setuncond, usemod)) {
            return undefined;
        }
        return new TypeResultWRefVarInfoResult(tsig, alwaystrue, alwaysfalse, setcondout, setuncond, usemod, bbinds);
    }
    static andstates(results) {
        assert(results.length > 0);
        let hasconflicts = false;
        let assigned = new Set();
        let ttrue = new Set();
        let tfalse = new Set();
        let setuncond = new Set();
        let usemod = new Set();
        let bbinds = [];
        for (let i = 0; i < results.length; i++) {
            hasconflicts = hasconflicts || !results[i].checkNewRWVarConflicts(assigned);
            results[i].setcondout.ttrue.forEach((v) => ttrue.add(v));
            results[i].setcondout.tfalse.forEach((v) => assigned.add(v));
            results[i].setcondout.tfalse.forEach((v) => tfalse.add(v));
            results[i].setcondout.ttrue.forEach((v) => assigned.add(v));
            results[i].setuncond.forEach((v) => setuncond.add(v));
            results[i].setuncond.forEach((v) => assigned.add(v));
            results[i].usemod.forEach((v) => usemod.add(v));
            results[i].usemod.forEach((v) => assigned.add(v));
            bbinds.push(...results[i].bbinds);
        }
        const nstate = new TypeResultWRefVarInfoResult(results[0].tsig, results.every((r) => r.alwaystrue), results.some((r) => r.alwaysfalse), { ttrue: [...ttrue], tfalse: [...tfalse] }, [...setuncond], [...usemod], bbinds);
        return [hasconflicts, nstate];
    }
    extendEnvironmentWithVarAssignments(env) {
        let aenv = env;
        let tenv = env;
        let fenv = env;
        for (let i = 0; i < this.setcondout.ttrue.length; i++) {
            tenv = tenv.assignLocalVariable(this.setcondout.ttrue[i]);
        }
        for (let i = 0; i < this.setcondout.tfalse.length; i++) {
            fenv = fenv.assignLocalVariable(this.setcondout.tfalse[i]);
        }
        for (let i = 0; i < this.setuncond.length; i++) {
            aenv = aenv.assignLocalVariable(this.setuncond[i]);
            tenv = tenv.assignLocalVariable(this.setuncond[i]);
            fenv = fenv.assignLocalVariable(this.setuncond[i]);
        }
        return [aenv, tenv, fenv];
    }
}
class TypeEnvironment {
    constructor(declReturnType, inferReturn, isnormalflow, parent, lcaptures, args, locals) {
        this.declReturnType = declReturnType;
        this.inferReturn = inferReturn;
        this.isnormalflow = isnormalflow;
        this.parent = parent;
        this.lcaptures = lcaptures;
        this.args = args;
        this.locals = locals;
    }
    static createInitialStdEnv(declReturnType, inferReturn, args) {
        return new TypeEnvironment(declReturnType, inferReturn, true, undefined, [], args, [new LocalScope(false, [], new Set())]);
    }
    static createInitialLambdaEnv(declReturnType, inferReturn, args, enclosing) {
        return new TypeEnvironment(declReturnType, inferReturn, true, enclosing, [], args, [new LocalScope(false, [], new Set())]);
    }
    cloneEnvironment() {
        return new TypeEnvironment(this.declReturnType, this.inferReturn, this.isnormalflow, this.parent, [...this.lcaptures], [...this.args], [...this.locals].map((l) => l.clone()));
    }
    resolveLambdaCaptureVarInfoFromSrcName(vname) {
        const localdef = this.resolveLocalVarInfoFromSrcName(vname);
        if (localdef !== undefined) {
            return localdef;
        }
        if (this.parent === undefined) {
            return undefined;
        }
        const pcapture = this.parent.resolveLambdaCaptureVarInfoFromSrcName(vname);
        if (pcapture === undefined) {
            return undefined;
        }
        if (!this.lcaptures.some((c) => c.vname === pcapture.srcname)) {
            this.lcaptures.push({ vname: pcapture.srcname, vtype: pcapture.decltype });
        }
        return pcapture;
    }
    resolveOCaptureInfoFromSrcName(vname) {
        const pscope = this.parent;
        for (let i = pscope.locals.length - 1; i >= 0; i--) {
            const vinfo = pscope.locals[i].resolveLocalVarInfoFromSrcName(vname);
            if (vinfo !== undefined) {
                return "local";
            }
        }
        if (pscope.args.find((v) => v.srcname === vname) !== undefined) {
            return "param";
        }
        else {
            return "outer";
        }
    }
    resolveLocalVarInfoFromSrcName(vname) {
        for (let i = this.locals.length - 1; i >= 0; i--) {
            const vinfo = this.locals[i].resolveLocalVarInfoFromSrcName(vname);
            if (vinfo !== undefined) {
                return vinfo;
            }
        }
        return this.args.find((v) => v.srcname === vname);
    }
    isLocalVariableAParameter(vname) {
        return this.args.some((v) => v.srcname === vname);
    }
    addLocalVar(vname, vtype, vkind, mustDefined) {
        let newlocals = [...this.locals.slice(0, this.locals.length - 1), this.locals[this.locals.length - 1].clone()];
        newlocals[newlocals.length - 1].locals.push(new VarInfo(vname, vtype, vkind, mustDefined));
        return new TypeEnvironment(this.declReturnType, this.inferReturn, this.isnormalflow, this.parent, this.lcaptures, this.args, newlocals);
    }
    addLocalVarSet(vars, vkind) {
        let newlocals = [...this.locals.slice(0, this.locals.length - 1), this.locals[this.locals.length - 1].clone()];
        const newvars = vars.map((v) => new VarInfo(v.name, v.vtype, vkind, true));
        newlocals[newlocals.length - 1].locals.push(...newvars);
        return new TypeEnvironment(this.declReturnType, this.inferReturn, this.isnormalflow, this.parent, this.lcaptures, this.args, newlocals);
    }
    assignLocalVariable(vname) {
        let locals = [];
        let assigned = false;
        for (let i = this.locals.length - 1; i >= 0; i--) {
            if (assigned) {
                locals.unshift(this.locals[i]);
            }
            else {
                const [newframe, wasassigned] = this.locals[i].assignLocalVariable(vname);
                locals.unshift(newframe);
                assigned = wasassigned;
            }
            ;
        }
        return new TypeEnvironment(this.declReturnType, this.inferReturn, this.isnormalflow, this.parent, this.lcaptures, this.args, locals);
    }
    setDeadFlow() {
        return new TypeEnvironment(this.declReturnType, this.inferReturn, false, this.parent, this.lcaptures, this.args, this.locals);
    }
    setReturnFlow() {
        return new TypeEnvironment(this.declReturnType, this.inferReturn, false, this.parent, this.lcaptures, this.args, this.locals);
    }
    setYieldFlow() {
        return new TypeEnvironment(this.declReturnType, this.inferReturn, false, this.parent, this.lcaptures, this.args, this.locals);
    }
    pushNewLocalScope() {
        return new TypeEnvironment(this.declReturnType, this.inferReturn, this.isnormalflow, this.parent, this.lcaptures, this.args, [...this.locals, new LocalScope(false, [], new Set())]);
    }
    pushNewLocalBinderScope(binds) {
        return new TypeEnvironment(this.declReturnType, this.inferReturn, this.isnormalflow, this, this.lcaptures, this.args, [...this.locals, new LocalScope(true, binds, new Set())]);
    }
    popLocalScope() {
        assert(this.locals.length > 0);
        return [new TypeEnvironment(this.declReturnType, this.inferReturn, this.isnormalflow, this.parent, this.lcaptures, [...this.args], [...this.locals].slice(0, this.locals.length - 1)), this.locals[this.locals.length - 1]];
    }
    static mergeEnvironmentsSimple(origenv, ...envs) {
        let locals = [];
        const normalenvs = envs.filter((e) => e.isnormalflow);
        for (let i = 0; i < origenv.locals.length; i++) {
            locals.push(LocalScope.mergeLocalScopes(origenv.locals[i], envs.map((e) => e.locals[i]), normalenvs.map((e) => e.locals[i])));
        }
        let lcaptures = [...origenv.lcaptures];
        for (let i = 0; i < envs.length; i++) {
            for (let j = 0; j < envs[i].lcaptures.length; j++) {
                const cinfo = envs[i].lcaptures[j];
                if (!lcaptures.some((c) => c.vname === cinfo.vname)) {
                    lcaptures.push(cinfo);
                }
            }
        }
        const normalflow = envs.some((e) => e.isnormalflow);
        return new TypeEnvironment(origenv.declReturnType, origenv.inferReturn, normalflow, origenv.parent, lcaptures, [...origenv.args], locals);
    }
    generateBranchFlows(ttre) {
        let tenv = this.cloneEnvironment();
        let fenv = this.cloneEnvironment();
        for (let i = 0; i < ttre.bbinds.length; i++) {
            const bind = ttre.bbinds[i];
            if (bind.ttrue !== undefined) {
                tenv = tenv.addLocalVar(bind.bname, bind.ttrue, "let", true);
            }
            if (bind.tfalse !== undefined) {
                fenv = fenv.addLocalVar(bind.bname, bind.tfalse, "let", true);
            }
        }
        for (let i = 0; i < ttre.setcondout.ttrue.length; i++) {
            tenv = tenv.assignLocalVariable(ttre.setcondout.ttrue[i]);
        }
        for (let i = 0; i < ttre.setcondout.tfalse.length; i++) {
            fenv = fenv.assignLocalVariable(ttre.setcondout.tfalse[i]);
        }
        return [tenv, fenv];
    }
    updateUsedBindersFromOtherEnv(other) {
        [];
        for (let i = 0; i < other.locals.length; i++) {
            other.locals[i].accessed.forEach((v) => this.locals[i].accessed.add(v));
        }
    }
}
export { VarInfo, TypeInferContext, SimpleTypeInferContext, EListStyleTypeInferContext, TypeResultWRefVarInfoResult, TypeEnvironment };
//# sourceMappingURL=checker_environment.js.map