import { IRLambdaParameterPackTypeSignature, IRNominalTypeSignature } from "./irtype.js";
class IRConditionDecl {
    constructor(file, sinfo, diagnosticTag, stmts, value) {
        this.file = file;
        this.sinfo = sinfo;
        this.diagnosticTag = diagnosticTag;
        this.stmts = stmts;
        this.value = value;
    }
}
class IRPreConditionDecl extends IRConditionDecl {
    constructor(file, sinfo, tag, ikey, requiresidx, issoft, stmts, value) {
        super(file, sinfo, tag, stmts, value);
        this.ikey = ikey;
        this.requiresidx = requiresidx;
        this.issoft = issoft;
    }
}
class IRPostConditionDecl extends IRConditionDecl {
    constructor(file, sinfo, tag, ikey, ensuresidx, issoft, stmts, value) {
        super(file, sinfo, tag, stmts, value);
        this.ikey = ikey;
        this.ensuresidx = ensuresidx;
        this.issoft = issoft;
    }
}
class IRInvariantDecl extends IRConditionDecl {
    constructor(file, sinfo, tag, tkey, invariantidx, stmts, value) {
        super(file, sinfo, tag, stmts, value);
        this.tkey = tkey;
        this.invariantidx = invariantidx;
    }
}
class IRValidateDecl extends IRConditionDecl {
    constructor(file, sinfo, tag, tkey, validateidx, stmts, value) {
        super(file, sinfo, tag, stmts, value);
        this.tkey = tkey;
        this.validateidx = validateidx;
    }
}
class IRDeclarationDocString {
    constructor(text) {
        this.text = text;
    }
}
class IRDeclarationMetaTag {
    constructor(name, tags) {
        this.name = name;
        this.tags = tags;
    }
}
class IRConstantDecl {
    constructor(ckey, declaredType, stmts, value, docstr) {
        this.ckey = ckey;
        this.declaredType = declaredType;
        this.stmts = stmts;
        this.value = value;
        this.docstr = docstr;
    }
}
class IRInvokeParameterDecl {
    constructor(name, type, pkind, skind, defaultValue) {
        this.name = name;
        this.type = type;
        this.pkind = pkind;
        this.skind = skind;
        this.defaultValue = defaultValue;
    }
}
class IRInvokeMetaDecl {
    constructor(ikey, recursive, params, resultType, preconditions, postconditions, docstr, file, sinfo) {
        this.ikey = ikey;
        this.recursive = recursive;
        this.params = params;
        this.resultType = resultType;
        this.preconditions = preconditions;
        this.postconditions = postconditions;
        this.docstr = docstr;
        this.file = file;
        this.sinfo = sinfo;
    }
}
class IRTestAssociation {
    constructor(file, ns, ontype, onmember) {
        this.file = file;
        this.ns = ns;
        this.ontype = ontype;
        this.onmember = onmember;
    }
    isMatchWith(tmatch) {
        if (tmatch.file !== undefined && this.file !== tmatch.file) {
            return false;
        }
        if (tmatch.ns !== undefined && this.ns !== tmatch.ns) {
            return false;
        }
        if (tmatch.ontype !== undefined && this.ontype !== tmatch.ontype) {
            return false;
        }
        if (tmatch.onmember !== undefined && this.onmember !== tmatch.onmember) {
            return false;
        }
        return true;
    }
}
class IRPredicateDecl extends IRInvokeMetaDecl {
    constructor(ikey, recursive, params, resultType, preconditions, postconditions, docstr, file, sinfo) {
        super(ikey, recursive, params, resultType, preconditions, postconditions, docstr, file, sinfo);
    }
}
class IRTestDecl extends IRInvokeMetaDecl {
    constructor(ikey, recursive, params, resultType, preconditions, postconditions, docstr, file, sinfo, testkind, association, body) {
        super(ikey, recursive, params, resultType, preconditions, postconditions, docstr, file, sinfo);
        this.testkind = testkind;
        this.association = association;
        this.body = body;
    }
}
class IRExampleDecl extends IRInvokeMetaDecl {
    constructor(ikey, recursive, params, resultType, preconditions, postconditions, docstr, file, sinfo, association, body) {
        super(ikey, recursive, params, resultType, preconditions, postconditions, docstr, file, sinfo);
        this.association = association;
        this.body = body;
    }
}
class IRInvokeDecl extends IRInvokeMetaDecl {
    constructor(ikey, recursive, params, resultType, preconditions, postconditions, docstr, file, sinfo, body) {
        super(ikey, recursive, params, resultType, preconditions, postconditions, docstr, file, sinfo);
        this.body = body;
    }
}
class IRTaskActionDecl extends IRInvokeMetaDecl {
    constructor(ikey, recursive, params, resultType, preconditions, postconditions, docstr, file, sinfo, body) {
        super(ikey, recursive, params, resultType, preconditions, postconditions, docstr, file, sinfo);
        this.body = body;
    }
}
class IRMemberFieldDecl {
    constructor(fkey, enclosingType, fname, declaredType, defaultValue, docstr, metatags) {
        this.fkey = fkey;
        this.enclosingType = enclosingType;
        this.fname = fname;
        this.declaredType = declaredType;
        this.defaultValue = defaultValue;
        this.docstr = docstr;
        this.metatags = metatags;
    }
}
class IRAbstractNominalTypeDecl {
    constructor(tkey, invariants, validates, fields, etag, saturatedProvides, saturatedBFieldInfo, allInvariants, allValidates, docstr, metatags, file, sinfo) {
        this.tkey = tkey;
        this.invariants = invariants;
        this.validates = validates;
        this.fields = fields;
        this.etag = etag;
        this.saturatedProvides = saturatedProvides;
        this.saturatedBFieldInfo = saturatedBFieldInfo;
        this.allInvariants = allInvariants;
        this.allValidates = allValidates;
        this.docstr = docstr;
        this.metatags = metatags;
        //TODO vtable info here
        this.file = file;
        this.sinfo = sinfo;
    }
}
class IRAbstractEntityTypeDecl extends IRAbstractNominalTypeDecl {
    constructor(tkey, invariants, validates, fields, etag, saturatedProvides, saturatedBFieldInfo, allInvariants, allValidates, docstr, metatags, file, sinfo) {
        super(tkey, invariants, validates, fields, etag, saturatedProvides, saturatedBFieldInfo, allInvariants, allValidates, docstr, metatags, file, sinfo);
    }
    static emitBAPI() {
        return "Not Implemented: BAPI emission for abstract entities!";
    }
}
class IREnumTypeDecl extends IRAbstractEntityTypeDecl {
    constructor(tkey, docstr, file, sinfo, members) {
        super(tkey, [], [], [], "std", [], [], [], [], docstr, [], file, sinfo);
        this.members = members;
    }
    getDeclDependencyTypes(alltypes) {
        return [];
    }
}
class IRTypedeclTypeDecl extends IRAbstractEntityTypeDecl {
    constructor(tkey, invariants, validates, saturatedProvides, allInvariants, allValidates, docstr, metatags, file, sinfo, valuetype, iskeytype, isnumerictype) {
        super(tkey, invariants, validates, [], "std", saturatedProvides, [], allInvariants, allValidates, docstr, metatags, file, sinfo);
        this.valuetype = valuetype;
        this.iskeytype = iskeytype;
        this.isnumerictype = isnumerictype;
    }
    getDeclDependencyTypes(alltypes) {
        return [];
    }
}
class IRTypedeclCStringDecl extends IRTypedeclTypeDecl {
    constructor(tkey, invariants, validates, saturatedProvides, allInvariants, allValidates, docstr, metatags, file, sinfo, rngchk, rechk) {
        super(tkey, invariants, validates, saturatedProvides, allInvariants, allValidates, docstr, [], file, sinfo, new IRNominalTypeSignature("CString"), true, false);
        this.rngchk = rngchk;
        this.rechk = rechk;
    }
}
class IRTypedeclStringDecl extends IRTypedeclTypeDecl {
    constructor(tkey, invariants, validates, saturatedProvides, allInvariants, allValidates, docstr, metatags, file, sinfo, rngchk, rechk) {
        super(tkey, invariants, validates, saturatedProvides, allInvariants, allValidates, docstr, [], file, sinfo, new IRNominalTypeSignature("String"), true, false);
        this.rngchk = rngchk;
        this.rechk = rechk;
    }
}
//TODO: Path typedecl
class IRInternalEntityTypeDecl extends IRAbstractEntityTypeDecl {
    constructor(tkey, saturatedProvides, docstr, metatags, file, sinfo) {
        super(tkey, [], [], [], "std", saturatedProvides, [], [], [], docstr, metatags, file, sinfo);
    }
}
class IRPrimitiveEntityTypeDecl extends IRInternalEntityTypeDecl {
    constructor(tkey, docstr, file, sinfo) {
        super(tkey, [], docstr, [], file, sinfo);
    }
    getDeclDependencyTypes(alltypes) {
        return [];
    }
}
class IRConstructableTypeDecl extends IRInternalEntityTypeDecl {
    constructor(tkey, saturatedProvides, docstr, file, sinfo) {
        super(tkey, saturatedProvides, docstr, [], file, sinfo);
    }
}
class IROkTypeDecl extends IRConstructableTypeDecl {
    constructor(tkey, saturatedProvides, docstr, file, sinfo, ttype, etype) {
        super(tkey, saturatedProvides, docstr, file, sinfo);
        this.ttype = ttype;
        this.etype = etype;
    }
    getDeclDependencyTypes(alltypes) {
        return [this.ttype, this.etype];
    }
}
class IRFailTypeDecl extends IRConstructableTypeDecl {
    constructor(tkey, saturatedProvides, docstr, file, sinfo, ttype, etype) {
        super(tkey, saturatedProvides, docstr, file, sinfo);
        this.ttype = ttype;
        this.etype = etype;
    }
    getDeclDependencyTypes(alltypes) {
        return [this.ttype, this.etype];
    }
}
class IRAPIErrorTypeDecl extends IRConstructableTypeDecl {
    constructor(tkey, saturatedProvides, docstr, file, sinfo, ttype, etype) {
        super(tkey, saturatedProvides, docstr, file, sinfo);
        this.ttype = ttype;
        this.etype = etype;
    }
    getDeclDependencyTypes(alltypes) {
        return [this.ttype, this.etype];
    }
}
class IRAPIRejectedTypeDecl extends IRConstructableTypeDecl {
    constructor(tkey, saturatedProvides, docstr, file, sinfo, ttype, etype) {
        super(tkey, saturatedProvides, docstr, file, sinfo);
        this.ttype = ttype;
        this.etype = etype;
    }
    getDeclDependencyTypes(alltypes) {
        return [this.ttype, this.etype];
    }
}
class IRAPIDeniedTypeDecl extends IRConstructableTypeDecl {
    constructor(tkey, saturatedProvides, docstr, file, sinfo, ttype, etype) {
        super(tkey, saturatedProvides, docstr, file, sinfo);
        this.ttype = ttype;
        this.etype = etype;
    }
    getDeclDependencyTypes(alltypes) {
        return [this.ttype, this.etype];
    }
}
class IRAPIFlaggedTypeDecl extends IRConstructableTypeDecl {
    constructor(tkey, saturatedProvides, docstr, file, sinfo, ttype, etype) {
        super(tkey, saturatedProvides, docstr, file, sinfo);
        this.ttype = ttype;
        this.etype = etype;
    }
    getDeclDependencyTypes(alltypes) {
        return [this.ttype, this.etype];
    }
}
class IRAPISuccessTypeDecl extends IRConstructableTypeDecl {
    constructor(tkey, saturatedProvides, docstr, file, sinfo, ttype, etype) {
        super(tkey, saturatedProvides, docstr, file, sinfo);
        this.ttype = ttype;
        this.etype = etype;
    }
    getDeclDependencyTypes(alltypes) {
        return [this.ttype, this.etype];
    }
}
class IRSomeTypeDecl extends IRConstructableTypeDecl {
    constructor(tkey, saturatedProvides, docstr, file, sinfo, ttype) {
        super(tkey, saturatedProvides, docstr, file, sinfo);
        this.ttype = ttype;
    }
    getDeclDependencyTypes(alltypes) {
        return [this.ttype];
    }
}
class IRMapEntryTypeDecl extends IRConstructableTypeDecl {
    constructor(tkey, saturatedProvides, docstr, file, sinfo, ktype, vtype) {
        super(tkey, saturatedProvides, docstr, file, sinfo);
        this.ktype = ktype;
        this.vtype = vtype;
    }
    getDeclDependencyTypes(alltypes) {
        return [this.ktype, this.vtype];
    }
}
class IRAbstractCollectionTypeDecl extends IRInternalEntityTypeDecl {
    constructor(tkey, docstr, file, sinfo, oftype) {
        super(tkey, [], docstr, [], file, sinfo);
        this.oftype = oftype;
    }
}
class IRListTypeDecl extends IRAbstractCollectionTypeDecl {
    constructor(tkey, docstr, file, sinfo, oftype) {
        super(tkey, docstr, file, sinfo, oftype);
    }
    getDeclDependencyTypes(alltypes) {
        return [this.oftype];
    }
}
class IRStackTypeDecl extends IRAbstractCollectionTypeDecl {
    constructor(tkey, docstr, file, sinfo, oftype) {
        super(tkey, docstr, file, sinfo, oftype);
    }
    getDeclDependencyTypes(alltypes) {
        return [this.oftype];
    }
}
class IRQueueTypeDecl extends IRAbstractCollectionTypeDecl {
    constructor(tkey, docstr, file, sinfo, oftype) {
        super(tkey, docstr, file, sinfo, oftype);
    }
    getDeclDependencyTypes(alltypes) {
        return [this.oftype];
    }
}
class IRSetTypeDecl extends IRAbstractCollectionTypeDecl {
    constructor(tkey, docstr, file, sinfo, oftype) {
        super(tkey, docstr, file, sinfo, oftype);
    }
    getDeclDependencyTypes(alltypes) {
        return [this.oftype];
    }
}
class IRMapTypeDecl extends IRAbstractCollectionTypeDecl {
    constructor(tkey, docstr, file, sinfo, oftype, ktype, vtype) {
        super(tkey, docstr, file, sinfo, oftype);
        this.ktype = ktype;
        this.vtype = vtype;
    }
    getDeclDependencyTypes(alltypes) {
        return [this.oftype, this.ktype, this.vtype];
    }
}
class IREventListTypeDecl extends IRInternalEntityTypeDecl {
    constructor(tkey, docstr, file, sinfo, etype) {
        super(tkey, [], docstr, [], file, sinfo);
        this.etype = etype;
    }
    getDeclDependencyTypes(alltypes) {
        return [this.etype];
    }
}
class IREntityTypeDecl extends IRAbstractEntityTypeDecl {
    constructor(tkey, invariants, validates, fields, etag, saturatedProvides, saturatedBFieldInfo, allInvariants, allValidates, docstr, metatags, file, sinfo) {
        super(tkey, invariants, validates, fields, etag, saturatedProvides, saturatedBFieldInfo, allInvariants, allValidates, docstr, metatags, file, sinfo);
    }
    getDeclDependencyTypes(alltypes) {
        const ffdecls = this.saturatedBFieldInfo.map((bf) => {
            const ctt = alltypes.get(bf.containingtype.tkeystr);
            const bfdecl = ctt.fields.find(f => f.fkey === bf.fkey);
            return bfdecl.declaredType;
        });
        return ffdecls;
    }
    emitBAPI() {
        const base = IRAbstractEntityTypeDecl.emitBAPI();
        return `'${this.tkey}'<IRAssembly::TypeKey> => IRAssembly::EntityTypeDecl{ ${base} }`;
    }
}
class IRAbstractConceptTypeDecl extends IRAbstractNominalTypeDecl {
    constructor(tkey, invariants, validates, fields, saturatedProvides, saturatedBFieldInfo, docstr, metatags, file, sinfo) {
        super(tkey, invariants, validates, fields, "std", saturatedProvides, saturatedBFieldInfo, [], [], docstr, metatags, file, sinfo);
    }
}
class IRInternalConceptTypeDecl extends IRAbstractConceptTypeDecl {
    constructor(tkey, docstr, metatags, file, sinfo) {
        super(tkey, [], [], [], [], [], docstr, metatags, file, sinfo);
    }
}
class IROptionTypeDecl extends IRInternalConceptTypeDecl {
    constructor(tkey, docstr, file, sinfo, ttype, sometype) {
        super(tkey, docstr, [], file, sinfo);
        this.ttype = ttype;
        this.sometype = sometype;
    }
    getDeclDependencyTypes(alltypes) {
        return [this.ttype, this.sometype];
    }
}
class IRResultTypeDecl extends IRInternalConceptTypeDecl {
    constructor(tkey, docstr, file, sinfo, ttype, etype, oktype, failtype) {
        super(tkey, docstr, [], file, sinfo);
        this.ttype = ttype;
        this.etype = etype;
        this.oktype = oktype;
        this.failtype = failtype;
    }
    getDeclDependencyTypes(alltypes) {
        return [this.ttype, this.etype, this.oktype, this.failtype];
    }
}
class IRAPIResultTypeDecl extends IRInternalConceptTypeDecl {
    constructor(tkey, docstr, file, sinfo, ttype, etype, errortype, rejectedtype, deniedtype, flaggedtype, successtype) {
        super(tkey, docstr, [], file, sinfo);
        this.ttype = ttype;
        this.etype = etype;
        this.errortype = errortype;
        this.rejectedtype = rejectedtype;
        this.deniedtype = deniedtype;
        this.flaggedtype = flaggedtype;
        this.successtype = successtype;
    }
    getDeclDependencyTypes(alltypes) {
        return [this.ttype, this.etype, this.errortype, this.rejectedtype, this.deniedtype, this.flaggedtype, this.successtype];
    }
}
class IRConceptTypeDecl extends IRAbstractConceptTypeDecl {
    constructor(tkey, invariants, validates, fields, saturatedProvides, saturatedBFieldInfo, docstr, metatags, file, sinfo) {
        super(tkey, invariants, validates, fields, saturatedProvides, saturatedBFieldInfo, docstr, metatags, file, sinfo);
    }
    getDeclDependencyTypes(alltypes) {
        const ffdecls = this.saturatedBFieldInfo.map(bf => {
            const ctt = alltypes.get(bf.containingtype.tkeystr);
            const bfdecl = ctt.fields.find(f => f.fkey === bf.fkey);
            return bfdecl.declaredType;
        });
        return [new IRNominalTypeSignature(this.tkey), ...ffdecls];
    }
}
class IRDatatypeMemberEntityTypeDecl extends IRAbstractEntityTypeDecl {
    constructor(tkey, invariants, validates, fields, etag, saturatedProvides, saturatedBFieldInfo, allInvariants, allValidates, docstr, metatags, file, sinfo) {
        super(tkey, invariants, validates, fields, etag, saturatedProvides, saturatedBFieldInfo, allInvariants, allValidates, docstr, metatags, file, sinfo);
    }
    getDeclDependencyTypes(alltypes) {
        const ffdecls = this.saturatedBFieldInfo.map(bf => {
            const ctt = alltypes.get(bf.containingtype.tkeystr);
            const bfdecl = ctt.fields.find(f => f.fkey === bf.fkey);
            return bfdecl.declaredType;
        });
        return ffdecls;
    }
}
class IRDatatypeTypeDecl extends IRAbstractConceptTypeDecl {
    constructor(tkey, invariants, validates, fields, saturatedProvides, saturatedBFieldInfo, docstr, metatags, file, sinfo, dataelems) {
        super(tkey, invariants, validates, fields, saturatedProvides, saturatedBFieldInfo, docstr, metatags, file, sinfo);
        this.dataelems = dataelems;
    }
    getDeclDependencyTypes(alltypes) {
        const ffdecls = this.saturatedBFieldInfo.map(bf => {
            const ctt = alltypes.get(bf.containingtype.tkeystr);
            const bfdecl = ctt.fields.find(f => f.fkey === bf.fkey);
            return bfdecl.declaredType;
        });
        return [new IRNominalTypeSignature(this.tkey), ...ffdecls];
    }
}
class IREnvironmentVariableInformation {
    constructor(evname, evtype, required, optdefault) {
        this.evname = evname;
        this.evtype = evtype;
        this.required = required;
        this.optdefault = optdefault;
    }
}
class IRResourceInformation {
}
class IRTaskConfiguration {
    constructor(timeout, retry, priority) {
        this.timeout = timeout;
        this.retry = retry;
        this.priority = priority;
    }
}
class IRAPIDecl {
    constructor(ikey, params, resultType, eventType, preconditions, postconditions, configs, statusinfo, envreqs, resourcereqs, body, docstr, metatags, file, sinfo) {
        this.ikey = ikey;
        this.params = params;
        this.resultType = resultType;
        this.eventType = eventType;
        this.preconditions = preconditions;
        this.postconditions = postconditions;
        this.configs = configs;
        this.statusinfo = statusinfo;
        this.envreqs = envreqs;
        this.resourcereqs = resourcereqs;
        this.body = body;
        this.docstr = docstr;
        this.metatags = metatags;
        this.file = file;
        this.sinfo = sinfo;
    }
}
class IRAgentDecl {
    constructor(ikey, params, resultType, eventType, preconditions, postconditions, configs, statusinfo, envreqs, resourcereqs, body, docstr, metatags, file, sinfo) {
        this.ikey = ikey;
        this.params = params;
        this.resultType = resultType;
        this.eventType = eventType;
        this.preconditions = preconditions;
        this.postconditions = postconditions;
        this.configs = configs;
        this.statusinfo = statusinfo;
        this.envreqs = envreqs;
        this.resourcereqs = resourcereqs;
        this.body = body;
        this.docstr = docstr;
        this.metatags = metatags;
        this.file = file;
        this.sinfo = sinfo;
    }
}
class IRTaskDecl {
    constructor(tkey, invariants, fields, docstr, metatags, file, sinfo, configs, statusinfo, envreqs, resourcereqs, eventinfo, imain, icleanup) {
        this.tkey = tkey;
        this.invariants = invariants;
        this.fields = fields;
        this.docstr = docstr;
        this.metatags = metatags;
        this.file = file;
        this.sinfo = sinfo;
        this.configs = configs;
        this.statusinfo = statusinfo;
        this.envreqs = envreqs;
        this.resourcereqs = resourcereqs;
        this.eventinfo = eventinfo;
        this.imain = imain;
        this.icleanup = icleanup;
    }
}
class IRLambdaParameterPackDecl {
    constructor(tkeystr, invtrgt, stdvalues, lambdavalues) {
        this.tkeystr = tkeystr;
        this.invtrgt = invtrgt;
        this.stdvalues = stdvalues;
        this.lambdavalues = lambdavalues;
    }
}
class IRAssembly {
    constructor() {
        this.cregexps = [];
        this.uregexps = [];
        this.constants = [];
        this.tests = [];
        this.examples = [];
        this.predicates = [];
        this.invokes = [];
        this.taskactions = [];
        this.primitives = [];
        this.constructables = [];
        this.collections = [];
        this.eventlists = [];
        this.enums = [];
        this.typedecls = [];
        this.cstringoftypedecls = [];
        this.stringoftypedecls = [];
        this.entities = [];
        this.datamembers = [];
        this.pconcepts = [];
        this.concepts = [];
        this.datatypes = [];
        this.apis = [];
        this.agents = [];
        this.tasks = [];
        this.alltypes = new Map();
        this.allinvokes = new Map();
        this.alllambdas = new Map();
        this.elists = [];
        this.dashtypes = [];
        this.formats = [];
        this.lpacksigs = [];
        this.formatcstrings = [];
        this.formatstrings = [];
        this.concretesubtypes = new Map();
        this.concretesupertypes = new Map();
        this.typedeporder = [];
        this.typedepcycles = [];
    }
    computeSubtypeInfo() {
        const alltl = [...this.alltypes.values()];
        for (let i = 0; i < alltl.length; i++) {
            const ctt = alltl[i];
            if (ctt instanceof IRAbstractConceptTypeDecl) {
                if (!this.concretesubtypes.has(ctt.tkey)) {
                    this.concretesubtypes.set(ctt.tkey, []);
                }
            }
            else {
                if (!this.concretesupertypes.has(ctt.tkey)) {
                    this.concretesupertypes.set(ctt.tkey, []);
                }
                let superl = this.concretesupertypes.get(ctt.tkey);
                const cctsig = new IRNominalTypeSignature(ctt.tkey);
                for (let j = 0; j < ctt.saturatedProvides.length; j++) {
                    const ssuper = ctt.saturatedProvides[j];
                    if (!this.concretesubtypes.has(ssuper.tkeystr)) {
                        this.concretesubtypes.set(ssuper.tkeystr, []);
                    }
                    this.concretesubtypes.get(ssuper.tkeystr).push(cctsig);
                    superl.push(ssuper);
                }
            }
        }
        for (const csubts of this.concretesubtypes.values()) {
            csubts.sort((a, b) => a.tkeystr.localeCompare(b.tkeystr));
        }
        for (const csupts of this.concretesupertypes.values()) {
            csupts.sort((a, b) => a.tkeystr.localeCompare(b.tkeystr));
        }
    }
    getTypeDependencyInfo(tsig) {
        let ttl = [];
        if (tsig instanceof IRLambdaParameterPackTypeSignature) {
            const lsdecl = this.alllambdas.get(tsig.tkeystr);
            ttl = [
                ...lsdecl.stdvalues.map((sv) => sv.vtype),
                ...lsdecl.lambdavalues.map((lv) => new IRLambdaParameterPackTypeSignature(lv.ltypekey))
            ];
        }
        else if (tsig instanceof IRNominalTypeSignature) {
            const ttdecl = this.alltypes.get(tsig.tkeystr);
            ttl = ttdecl.getDeclDependencyTypes(this.alltypes);
        }
        else {
            ttl = tsig.getDirectDependencyTypes();
        }
        //now make all the concrete subtypes explicit
        let allttl = [];
        for (let i = 0; i < ttl.length; i++) {
            allttl.push(ttl[i]);
            const csubts = this.concretesubtypes.get(ttl[i].tkeystr);
            if (csubts !== undefined) {
                for (let j = 0; j < csubts.length; j++) {
                    allttl.push(csubts[j]);
                }
            }
        }
        //now make the result unique
        let resl = [];
        for (let i = 0; i < allttl.length; i++) {
            if (resl.findIndex((t) => t.tkeystr === allttl[i].tkeystr) === -1) {
                resl.push(allttl[i]);
            }
        }
        return resl;
    }
    visitType(tsig, visited) {
        if (visited.has(tsig.tkeystr)) {
            return;
        }
        //If this is a SCC then we don't revisit this and we need to handle the cycle elsewhere
        visited.add(tsig.tkeystr);
        const deps = this.getTypeDependencyInfo(tsig);
        for (let i = 0; i < deps.length; i++) {
            this.visitType(deps[i], visited);
        }
        this.typedeporder.push(tsig);
    }
    computeAllTypes() {
        const allndecls = [...this.alltypes.values()].map(td => new IRNominalTypeSignature(td.tkey));
        const allsdtypes = [...this.elists, ...this.dashtypes, ...this.formats, ...this.lpacksigs];
        return [...allndecls, ...allsdtypes];
    }
    getTypesCount(visited) {
        const allpending = this.computeAllTypes().filter((t) => !visited.has(t.tkeystr));
        const ttcount = new Map();
        for (let i = 0; i < allpending.length; i++) {
            ttcount.set(allpending[i].tkeystr, 0);
        }
        for (let i = 0; i < allpending.length; i++) {
            const deps = this.getTypeDependencyInfo(allpending[i]);
            for (let j = 0; j < deps.length; j++) {
                if (allpending[i].tkeystr !== deps[j].tkeystr) {
                    const ccount = ttcount.get(deps[j].tkeystr);
                    ttcount.set(deps[j].tkeystr, ccount + 1);
                }
            }
        }
        return allpending.map((t) => [t, ttcount.get(t.tkeystr)]).sort((a, b) => a[1] - b[1]);
    }
    computeTypeDependencyInfo() {
        const visited = new Set();
        let toproc = this.getTypesCount(visited);
        while (toproc.length !== 0) {
            const nrval = toproc.shift();
            this.visitType(nrval[0], visited);
            if (nrval[1] !== 0) {
                toproc = this.getTypesCount(visited);
            }
        }
        let orderedtypes = [...this.typedeporder];
        while (orderedtypes.length !== 0) {
            const ctt = orderedtypes[0];
            const deps = this.getTypeDependencyInfo(ctt);
            let scc = [];
            let cycdeps = deps.filter((d) => orderedtypes.findIndex((t) => t.tkeystr === d.tkeystr) !== -1);
            if (cycdeps.length !== 0) {
                let foundmore = true;
                while (foundmore) {
                    foundmore = false;
                    const olen = cycdeps.length;
                    for (let i = 0; i < olen; ++i) {
                        const ndeps = this.getTypeDependencyInfo(cycdeps[i]);
                        for (let j = 0; j < ndeps.length; ++j) {
                            let orr = orderedtypes.findIndex((t) => t.tkeystr === ndeps[j].tkeystr) !== -1;
                            let nadd = cycdeps.findIndex((t) => t.tkeystr === ndeps[j].tkeystr) === -1;
                            if (orr && nadd) {
                                cycdeps.push(ndeps[j]);
                                foundmore = true;
                            }
                        }
                    }
                }
                scc.sort((a, b) => {
                    const apos = orderedtypes.findIndex((t) => t.tkeystr === a.tkeystr);
                    const bpos = orderedtypes.findIndex((t) => t.tkeystr === b.tkeystr);
                    return apos - bpos;
                });
                scc.push(...cycdeps);
            }
            if (scc.length === 0) {
                orderedtypes.shift();
            }
            else {
                orderedtypes = orderedtypes.filter((t) => !scc.find((st) => st.tkeystr === t.tkeystr));
                this.typedepcycles.push(scc);
            }
        }
    }
    emitBAPI() {
        return "IRAssembly::IRAssembly{\n"
            + `\tMap<IRAssembly::IREntityTypeDecl>{ ${this.entities.map(e => e.emitBAPI()).join()} }\n`
            + "}\n";
    }
}
export { IRPreConditionDecl, IRPostConditionDecl, IRInvariantDecl, IRValidateDecl, IRDeclarationDocString, IRDeclarationMetaTag, IRConstantDecl, IRInvokeParameterDecl, IRInvokeMetaDecl, IRTestAssociation, IRPredicateDecl, IRTestDecl, IRExampleDecl, IRInvokeDecl, IRTaskActionDecl, IRMemberFieldDecl, IRAbstractNominalTypeDecl, IRAbstractEntityTypeDecl, IREnumTypeDecl, IRTypedeclTypeDecl, IRTypedeclCStringDecl, IRTypedeclStringDecl, IRInternalEntityTypeDecl, IRPrimitiveEntityTypeDecl, IRConstructableTypeDecl, IROkTypeDecl, IRFailTypeDecl, IRAPIDeniedTypeDecl, IRAPIErrorTypeDecl, IRAPIRejectedTypeDecl, IRAPIFlaggedTypeDecl, IRAPISuccessTypeDecl, IRSomeTypeDecl, IRMapEntryTypeDecl, IRAbstractCollectionTypeDecl, IRListTypeDecl, IRStackTypeDecl, IRQueueTypeDecl, IRSetTypeDecl, IRMapTypeDecl, IREventListTypeDecl, IREntityTypeDecl, IRAbstractConceptTypeDecl, IRInternalConceptTypeDecl, IROptionTypeDecl, IRResultTypeDecl, IRAPIResultTypeDecl, IRConceptTypeDecl, IRDatatypeMemberEntityTypeDecl, IRDatatypeTypeDecl, IREnvironmentVariableInformation, IRResourceInformation, IRTaskConfiguration, IRAPIDecl, IRAgentDecl, IRTaskDecl, IRLambdaParameterPackDecl, IRAssembly };
//# sourceMappingURL=irassembly.js.map