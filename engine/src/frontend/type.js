import { SourceInfo } from "./build_decls.js";
import { TemplateTermDecl, TemplateTermDeclExtraTag } from "./assembly.js";
class FullyQualifiedNamespace {
    constructor(ns) {
        this.ns = ns;
    }
    emit() {
        if (this.ns.length === 0) {
            return "";
        }
        else if (this.ns[0] === "Core") {
            return this.ns.slice(1).join("::");
        }
        else {
            return this.ns.join("::");
        }
    }
    static areSame(ns1, ns2) {
        if (ns1.ns.length !== ns2.ns.length) {
            return false;
        }
        for (let i = 0; i < ns1.ns.length; ++i) {
            if (ns1.ns[i] !== ns2.ns[i]) {
                return false;
            }
        }
        return true;
    }
}
class TemplateConstraintScope {
    constructor() {
        this.constraints = [];
    }
    pushConstraintDeclsScope(constraints) {
        this.constraints.push([...constraints]);
    }
    pushConstraintRestrictionScope(trestrict) {
        //cases of {when T: U numeric}
        const nrestrict = (trestrict.clauses.map((tc) => {
            const btt = this.resolveConstraint(tc.t.name);
            const tcsub = tc.subtype || btt.tconstraint;
            let tcextra = [...tc.extraTags];
            if (!tcextra.includes(TemplateTermDeclExtraTag.KeyType) && btt.extraTags.includes(TemplateTermDeclExtraTag.KeyType)) {
                tcextra.push(TemplateTermDeclExtraTag.KeyType);
            }
            if (!tcextra.includes(TemplateTermDeclExtraTag.Numeric) && btt.extraTags.includes(TemplateTermDeclExtraTag.Numeric)) {
                tcextra.push(TemplateTermDeclExtraTag.Numeric);
            }
            return new TemplateTermDecl(tc.t.name, tcsub, tcextra);
        }));
        //since this is appended at end it overrides any prior constraints on the same term, which is the intended semantics for when clause restrictions
        this.constraints.push(nrestrict);
    }
    popConstraintScope() {
        this.constraints.pop();
    }
    resolveConstraint(name) {
        for (let i = this.constraints.length - 1; i >= 0; --i) {
            const res = this.constraints[i].find((cc) => cc.name === name);
            if (res !== undefined) {
                return res;
            }
        }
        return undefined;
    }
}
class TemplateNameMapper {
    constructor(mapper) {
        this.mapper = mapper;
    }
    static generateTemplateMappingForTypeDecl(t) {
        let pmap = new Map();
        if (t.decl.isSpecialResultEntity()) {
            pmap.set("T", t.alltermargs[0]);
            pmap.set("E", t.alltermargs[1]);
        }
        else if (t.decl.isSpecialAPIResultEntity()) {
            pmap.set("T", t.alltermargs[0]);
            pmap.set("E", t.alltermargs[1]);
        }
        else {
            for (let j = 0; j < t.decl.terms.length; ++j) {
                pmap.set(t.decl.terms[j].name, t.alltermargs[j]);
            }
        }
        return TemplateNameMapper.createInitialMapping(pmap);
    }
    static identicalMappings(m1, m2) {
        if (m1.mapper.length !== m2.mapper.length) {
            return false;
        }
        for (let i = 0; i < m1.mapper.length; ++i) {
            if (m1.mapper[i].size !== m2.mapper[i].size) {
                return false;
            }
            const mm1 = [...m1.mapper[i]].sort((a, b) => a[0].localeCompare(b[0]));
            const mm2 = [...m2.mapper[i]].sort((a, b) => a[0].localeCompare(b[0]));
            for (let j = 0; j < mm1.length; ++j) {
                if (mm1[j][0] !== mm2[j][0] || mm1[j][1].tkeystr !== mm2[j][1].tkeystr) {
                    return false;
                }
            }
        }
        return true;
    }
    static createEmpty() {
        return new TemplateNameMapper([]);
    }
    static createInitialMapping(mapping) {
        return new TemplateNameMapper([mapping]);
    }
    static merge(m1, m2) {
        return new TemplateNameMapper([...m1.mapper, ...m2.mapper]);
    }
    static tryMerge(m1, m2) {
        if (m1 === undefined && m2 === undefined) {
            return undefined;
        }
        else if (m1 === undefined) {
            return m2;
        }
        else if (m2 === undefined) {
            return m1;
        }
        else {
            return new TemplateNameMapper([...m1.mapper, ...m2.mapper]);
        }
    }
    resolveTemplateMapping(ttype) {
        for (let i = this.mapper.length - 1; i >= 0; --i) {
            const res = this.mapper[i].get(ttype.name);
            if (res !== undefined) {
                if (res instanceof TemplateTypeSignature) {
                    ttype = res;
                }
                else {
                    return res;
                }
            }
        }
        return ttype;
    }
    computeBindingSet() {
        let allterms = [];
        for (let i = this.mapper.length - 1; i >= 0; --i) {
            allterms.push(...this.mapper[i].keys());
        }
        return allterms.map((tt) => [tt, this.resolveTemplateMapping(new TemplateTypeSignature(SourceInfo.implicitSourceInfo(), tt))]);
    }
}
class TypeSignature {
    constructor(sinfo, tkeystr) {
        this.sinfo = sinfo;
        this.tkeystr = tkeystr;
    }
}
class ErrorTypeSignature extends TypeSignature {
    constructor(sinfo, completionNamespace) {
        super(sinfo, "^error^");
        this.completionNamespace = completionNamespace;
    }
    remapTemplateBindings(mapper) {
        return this;
    }
    gatherTemplateBindings(tnames) {
        ;
    }
    emit() {
        return this.tkeystr;
    }
}
class VoidTypeSignature extends TypeSignature {
    constructor(sinfo) {
        super(sinfo, "Void");
    }
    remapTemplateBindings(mapper) {
        return this;
    }
    gatherTemplateBindings(tnames) {
        ;
    }
    emit() {
        return "Void";
    }
}
class AutoTypeSignature extends TypeSignature {
    constructor(sinfo) {
        super(sinfo, "^auto^");
    }
    remapTemplateBindings(mapper) {
        return this;
    }
    gatherTemplateBindings(tnames) {
        ;
    }
    emit() {
        return "^auto^";
    }
}
class TemplateTypeSignature extends TypeSignature {
    constructor(sinfo, name) {
        super(sinfo, name);
        this.name = name;
    }
    remapTemplateBindings(mapper) {
        return mapper.resolveTemplateMapping(this);
    }
    gatherTemplateBindings(tnames) {
        tnames.add(this.name);
    }
    emit() {
        return this.name;
    }
}
class NominalTypeSignature extends TypeSignature {
    static computeTKeyStr(decl, alltermargs) {
        const tscope = alltermargs.length !== 0 ? ("<" + alltermargs.map((tt) => tt.tkeystr).join(", ") + ">") : "";
        if (decl.isSpecialResultEntity()) {
            return `Result${tscope}::${decl.name}`;
        }
        else if (decl.isSpecialAPIResultEntity()) {
            return `APIResult${tscope}::${decl.name}`;
        }
        else {
            let nscope;
            if (decl.ns.ns[0] === "Core") {
                nscope = decl.ns.ns.slice(1).join("::");
            }
            else {
                nscope = decl.ns.ns.join("::");
            }
            return nscope + (nscope !== "" ? "::" : "") + decl.name + tscope;
        }
    }
    constructor(sinfo, altns, decl, alltermargs) {
        super(sinfo, NominalTypeSignature.computeTKeyStr(decl, alltermargs));
        this.decl = decl;
        this.alltermargs = alltermargs;
        this.altns = altns;
    }
    remapTemplateBindings(mapper) {
        const rtall = this.alltermargs.map((tt) => tt.remapTemplateBindings(mapper));
        return new NominalTypeSignature(this.sinfo, this.altns, this.decl, rtall);
    }
    gatherTemplateBindings(tnames) {
        this.alltermargs.forEach((tt) => tt.gatherTemplateBindings(tnames));
    }
    emit() {
        const tscope = this.alltermargs.length !== 0 ? ("<" + this.alltermargs.map((tt) => tt.emit()).join(", ") + ">") : "";
        if (this.decl.isSpecialResultEntity()) {
            return `Result${tscope}::${this.decl.name}`;
        }
        else if (this.decl.isSpecialAPIResultEntity()) {
            return `APIResult${tscope}::${this.decl.name}`;
        }
        else {
            let nscope;
            if (this.decl.ns.ns[0] === "Core") {
                nscope = this.decl.ns.ns.slice(1).join("::");
            }
            else {
                nscope = this.altns !== undefined ? this.altns.ns.join("::") : this.decl.ns.ns.join("::");
            }
            return nscope + (nscope !== "" ? "::" : "") + this.decl.name + tscope;
        }
    }
}
class EListTypeSignature extends TypeSignature {
    constructor(sinfo, entries) {
        super(sinfo, "(|" + entries.map((tt) => tt.tkeystr).join(", ") + "|)");
        this.entries = entries;
    }
    remapTemplateBindings(mapper) {
        return new EListTypeSignature(this.sinfo, this.entries.map((tt) => tt.remapTemplateBindings(mapper)));
    }
    gatherTemplateBindings(tnames) {
        this.entries.forEach((tt) => tt.gatherTemplateBindings(tnames));
    }
    emit() {
        return `(|${this.entries.map((tt) => tt.emit()).join(", ")}|)`;
    }
}
class DashResultTypeSignature extends TypeSignature {
    constructor(sinfo, entries) {
        super(sinfo, "DashResult<" + entries.map((tt) => tt.tkeystr).join(", ") + ">");
        this.entries = entries;
    }
    remapTemplateBindings(mapper) {
        return new DashResultTypeSignature(this.sinfo, this.entries.map((tt) => tt.remapTemplateBindings(mapper)));
    }
    gatherTemplateBindings(tnames) {
        this.entries.forEach((tt) => tt.gatherTemplateBindings(tnames));
    }
    emit() {
        return `DashResult<${this.entries.map((tt) => tt.emit()).join(", ")}>`;
    }
}
class LambdaParameterSignature {
    ;
    constructor(name, type, pkind, isRestParam) {
        this.name = name;
        this.type = type;
        this.pkind = pkind;
        this.isRestParam = isRestParam;
    }
    emit() {
        return `${(this.pkind ? this.pkind + " " : "")}${this.isRestParam ? "..." : ""}${this.type.emit()}`;
    }
}
class LambdaTypeSignature extends TypeSignature {
    constructor(sinfo, recursive, name, params, resultType) {
        super(sinfo, `${recursive === "yes" ? "rec " : ""}${name}(${params.map((pp) => pp.emit()).join(", ")}): ${resultType.tkeystr}`);
        this.recursive = recursive;
        this.name = name;
        this.params = params;
        this.resultType = resultType;
    }
    remapTemplateBindings(mapper) {
        const rbparams = this.params.map((pp) => new LambdaParameterSignature(pp.name, pp.type.remapTemplateBindings(mapper), pp.pkind, pp.isRestParam));
        return new LambdaTypeSignature(this.sinfo, this.recursive, this.name, rbparams, this.resultType.remapTemplateBindings(mapper));
    }
    gatherTemplateBindings(tnames) {
        this.params.forEach((pp) => pp.type.gatherTemplateBindings(tnames));
        this.resultType.gatherTemplateBindings(tnames);
    }
    emit() {
        let recstr = "";
        if (this.recursive === "yes") {
            recstr = "recursive ";
        }
        else if (this.recursive === "cond") {
            recstr = "recursive? ";
        }
        return `${recstr}${this.name}(${this.params.map((pp) => pp.emit()).join(", ")}) -> ${this.resultType.emit()}`;
    }
}
class FormatStringTypeSignature extends TypeSignature {
    static buildkstr(oftype, rtype, terms) {
        if (terms.length === 0) {
            return `F${oftype}<${rtype.emit()}>`;
        }
        else {
            const aargs = terms.map((tt) => {
                if (tt.argname === "_") {
                    return tt.argtype.emit();
                }
                else {
                    return tt.argname + ": " + tt.argtype.emit();
                }
            }).join(", ");
            return `F${oftype}<${rtype.emit()}${aargs.length !== 0 ? `, ${aargs}` : ""}>`;
        }
    }
    constructor(sinfo, oftype, rtype, terms) {
        super(sinfo, FormatStringTypeSignature.buildkstr(oftype, rtype, terms));
        this.oftype = oftype;
        this.rtype = rtype;
        this.terms = terms;
    }
    remapTemplateBindings(mapper) {
        const ttrmp = this.terms.map((tt) => { return { argname: tt.argname, argtype: tt.argtype.remapTemplateBindings(mapper) }; });
        return new FormatStringTypeSignature(this.sinfo, this.oftype, this.rtype.remapTemplateBindings(mapper), ttrmp);
    }
    gatherTemplateBindings(tnames) {
        this.terms.forEach((tt) => tt.argtype.gatherTemplateBindings(tnames));
    }
    emit() {
        return this.tkeystr;
    }
}
class FormatPathTypeSignature extends TypeSignature {
    static buildkstr(oftype, rtype, terms) {
        if (terms.length === 0) {
            return `F${oftype}<${rtype.emit()}>`;
        }
        else {
            const aargs = terms.map((tt) => {
                if (tt.argname === "_") {
                    return tt.argtype.emit();
                }
                else {
                    return tt.argname + ": " + tt.argtype.emit();
                }
            }).join(", ");
            return `F${oftype}<${rtype.emit()}${aargs.length !== 0 ? `, ${aargs}` : ""}>`;
        }
    }
    constructor(sinfo, oftype, rtype, terms) {
        super(sinfo, FormatPathTypeSignature.buildkstr(oftype, rtype, terms));
        this.oftype = oftype;
        this.rtype = rtype;
        this.terms = terms;
    }
    remapTemplateBindings(mapper) {
        const ttrmp = this.terms.map((tt) => { return { argname: tt.argname, argtype: tt.argtype.remapTemplateBindings(mapper) }; });
        return new FormatPathTypeSignature(this.sinfo, this.oftype, this.rtype.remapTemplateBindings(mapper), ttrmp);
    }
    gatherTemplateBindings(tnames) {
        this.terms.forEach((tt) => tt.argtype.gatherTemplateBindings(tnames));
    }
    emit() {
        return this.tkeystr;
    }
}
export { FullyQualifiedNamespace, TemplateConstraintScope, TemplateNameMapper, TypeSignature, ErrorTypeSignature, VoidTypeSignature, AutoTypeSignature, TemplateTypeSignature, NominalTypeSignature, EListTypeSignature, DashResultTypeSignature, LambdaParameterSignature, LambdaTypeSignature, FormatStringTypeSignature, FormatPathTypeSignature };
//# sourceMappingURL=type.js.map