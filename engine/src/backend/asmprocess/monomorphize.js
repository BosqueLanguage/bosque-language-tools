import assert from "node:assert";
import { AbstractCollectionTypeDecl, APIDeniedTypeDecl, APIErrorTypeDecl, APIFlaggedTypeDecl, APIRejectedTypeDecl, APIResultTypeDecl, APISuccessTypeDecl, ConceptTypeDecl, DatatypeMemberEntityTypeDecl, DatatypeTypeDecl, EntityTypeDecl, EnumTypeDecl, EventListTypeDecl, FailTypeDecl, ListTypeDecl, MapEntryTypeDecl, MapTypeDecl, OkTypeDecl, OptionTypeDecl, PrimitiveEntityTypeDecl, QueueTypeDecl, ResultTypeDecl, SetTypeDecl, SomeTypeDecl, StackTypeDecl, TaskActionDecl, TaskDecl, TaskMethodDecl, TypedeclTypeDecl } from "../../frontend/assembly.js";
import { computeInvokeKeyForLambdaFunction, computeInvokeKeyForNamespaceFunction, computeInvokeKeyForTypeFunction, computeInvokeKeyForTypeMethod, computeResolveKeyForInvoke, InvokeInstantiationInfo, LambdaInstantiationInfo, NamespaceInstantiationInfo, TypeInstantiationInfo } from "./instantiations.js";
import { AutoTypeSignature, DashResultTypeSignature, EListTypeSignature, FormatPathTypeSignature, FormatStringTypeSignature, LambdaTypeSignature, NominalTypeSignature, TemplateNameMapper, TemplateTypeSignature, VoidTypeSignature } from "../../frontend/type.js";
import { AbstractBodyImplementation, AccessVariableExpression, BuiltinBodyImplementation, ChkLogicExpressionTag, ConstructorLambdaExpression, ExpressionBodyImplementation, ExpressionTag, FormatStringArgComponent, HoleBodyImplementation, PostfixOpTag, PredicateUFBodyImplementation, RValueExpressionTag, StandardBodyImplementation, StatementTag, StdArgumentValue, ITestType, ITestTypeGuard, ITestBinderGuard } from "../../frontend/body.js";
import { SourceInfo } from "../../frontend/build_decls.js";
class PendingNamespaceFunction {
    constructor(namespace, func, instantiation, lambdas, fkey) {
        this.namespace = namespace;
        this.function = func;
        this.instantiation = instantiation;
        this.lambdas = lambdas;
        this.fkey = fkey;
    }
}
class PendingTypeFunction {
    constructor(type, func, instantiation, lambdas, fkey) {
        this.type = type;
        this.function = func;
        this.instantiation = instantiation;
        this.lambdas = lambdas;
        this.fkey = fkey;
        ;
    }
}
class PendingTypeMethod {
    constructor(type, mthd, instantiation, lambdas, mkey, prepostikey) {
        this.type = type;
        this.method = mthd;
        this.instantiation = instantiation;
        this.lambdas = lambdas;
        this.mkey = mkey;
        this.prepostikey = prepostikey;
    }
}
class PendingNominalTypeDecl {
    constructor(tkeystr, tsig, type, instantiation) {
        this.type = type;
        this.tsig = tsig;
        this.instantiation = instantiation;
        this.tkey = tkeystr;
    }
}
class ScopeUseFrame {
    constructor() {
        this.capturedVars = [];
        this.capturedLambdas = [];
        this.capturedTemplateNames = [];
    }
}
class Monomorphizer {
    constructor(assembly, wellknowntypes) {
        this.lambdaCtr = 0;
        this.lambdaScopes = [];
        this.lambdamap = new Map();
        this.callinstmap = new Map();
        this.pendingNominalTypeDecls = [];
        this.pendingNamespaceFunctions = [];
        this.pendingTypeFunctions = [];
        this.pendingTypeMethods = [];
        //TODO -- pendingLambdas
        this.completedInstantiations = new Set();
        this.completedNamespaceFunctions = new Set();
        this.completedTypeFunctions = new Set();
        this.completedMemberMethods = new Set();
        this.currentMapping = undefined;
        this.currentLambdaMapping = undefined;
        this.currentNSInstantiation = undefined;
        this.assembly = assembly;
        this.instantiation = [];
        this.wellknowntypes = wellknowntypes;
    }
    /*
    private getFreshLambdaKey(): string {
        return `lambda_${this.lambdaCtr++}`;
    }
    */
    getWellKnownType(name) {
        assert(this.wellknowntypes.has(name), `Well known type ${name} not found`);
        return this.wellknowntypes.get(name);
    }
    isAlreadySeenType(tkey) {
        return this.completedInstantiations.has(tkey) || this.pendingNominalTypeDecls.some((pntd) => pntd.tkey === tkey);
    }
    isAlreadySeenNamespaceFunction(fkey) {
        return this.completedNamespaceFunctions.has(fkey) || this.pendingNamespaceFunctions.some((pnf) => pnf.fkey === fkey);
    }
    isAlreadySeenTypeFunction(tkey) {
        return this.completedTypeFunctions.has(tkey) || this.pendingTypeFunctions.some((ptf) => ptf.fkey === tkey);
    }
    isAlreadySeenMemberMethod(mkey) {
        return this.completedMemberMethods.has(mkey) || this.pendingTypeMethods.some((ptm) => ptm.mkey === mkey);
    }
    //Given a type signature -- instantiate it and all sub-component types
    instantiateTypeSignature(type, mapping) {
        if (type instanceof VoidTypeSignature) {
            return;
        }
        if (this.lambdaScopes.length > 0) {
            let tnames = new Set();
            type.gatherTemplateBindings(tnames);
            const sscope = this.lambdaScopes[this.lambdaScopes.length - 1];
            tnames.forEach((tn) => {
                if (!sscope.capturedTemplateNames.includes(tn)) {
                    sscope.capturedTemplateNames.push(tn);
                }
            });
        }
        const rt = mapping !== undefined ? type.remapTemplateBindings(mapping) : type;
        if (this.isAlreadySeenType(rt.tkeystr)) {
            return;
        }
        else if (rt instanceof NominalTypeSignature) {
            rt.alltermargs.forEach((tt) => this.instantiateTypeSignature(tt, mapping));
            this.pendingNominalTypeDecls.push(new PendingNominalTypeDecl(rt.tkeystr, rt, rt.decl, rt.alltermargs));
        }
        else if (rt instanceof EListTypeSignature) {
            rt.entries.forEach((tt) => this.instantiateTypeSignature(tt, mapping));
            this.currentNSInstantiation.elists.set(rt.tkeystr, rt);
        }
        else if (rt instanceof DashResultTypeSignature) {
            rt.entries.forEach((tt) => this.instantiateTypeSignature(tt, mapping));
        }
        else if (rt instanceof LambdaTypeSignature) {
            rt.params.forEach((param) => this.instantiateTypeSignature(param.type, mapping));
            this.instantiateTypeSignature(rt.resultType, mapping);
        }
        else if (rt instanceof FormatStringTypeSignature) {
            rt.terms.forEach((tt) => this.instantiateTypeSignature(tt.argtype, mapping));
            this.instantiateTypeSignature(rt.rtype, mapping);
        }
        else if (rt instanceof FormatPathTypeSignature) {
            rt.terms.forEach((tt) => this.instantiateTypeSignature(tt.argtype, mapping));
            this.instantiateTypeSignature(rt.rtype, mapping);
        }
        else {
            //Lambda parameter packs are only introduced in monomorphize to we should not get them here
            assert(false, "Unknown TypeSignature type -- " + rt.tkeystr);
        }
    }
    //Given a namespace function -- instantiate it
    instantiateNamespaceFunction(ns, fdecl, terms, lambdas) {
        const fkey = computeInvokeKeyForNamespaceFunction(ns, fdecl, terms, lambdas);
        if (this.isAlreadySeenNamespaceFunction(fkey)) {
            return;
        }
        this.pendingNamespaceFunctions.push(new PendingNamespaceFunction(ns, fdecl, terms, lambdas, fkey));
    }
    //Given a type function -- instantiate it
    instantiateTypeFunction(enclosingType, fdecl, terms, lambdas) {
        const fkey = computeInvokeKeyForTypeFunction(enclosingType, fdecl, terms, lambdas);
        if (this.isAlreadySeenTypeFunction(fkey)) {
            return;
        }
        this.pendingTypeFunctions.push(new PendingTypeFunction(enclosingType, fdecl, terms, lambdas, fkey));
    }
    //Given a type method -- instantiate it
    instantiateSpecificResolvedMemberMethod(enclosingType, mdecl, terms, lambdas, prepostikey) {
        const mkey = computeInvokeKeyForTypeMethod(enclosingType, mdecl, terms, lambdas);
        if (this.isAlreadySeenMemberMethod(mkey)) {
            return;
        }
        this.pendingTypeMethods.push(new PendingTypeMethod(enclosingType, mdecl, terms, lambdas, mkey, prepostikey));
    }
    instantiateStringFormatsList(formats) {
        for (let i = 0; i < formats.length; ++i) {
            const fc = formats[i];
            if (fc instanceof FormatStringArgComponent && !(fc.argType instanceof AutoTypeSignature)) {
                this.instantiateTypeSignature(fc.argType, this.currentMapping);
            }
        }
    }
    processITestAsBoolean(src, tt) {
        this.instantiateTypeSignature(src, this.currentMapping);
        if (tt instanceof ITestType) {
            this.instantiateTypeSignature(tt.ttype, this.currentMapping);
        }
        else {
            ; //any needed instantiations will happen in the specific type processing (e.g. Option<T> will also force processing Some<T> and None)
        }
    }
    processITestAsConvert(src, tt) {
        this.instantiateTypeSignature(src, this.currentMapping);
        if (tt instanceof ITestType) {
            this.instantiateTypeSignature(tt.ttype, this.currentMapping);
        }
        else {
            ; //any needed instantiations will happen in the specific type processing (e.g. Option<T> will also force processing Some<T> and None)
        }
    }
    instantiateITestGuardExpression(exp) {
        switch (exp.tag) {
            case ExpressionTag.CallRefVariableExpression: {
                this.instantiateCallRefVariableExpression(exp);
            }
            case ExpressionTag.CallRefThisExpression: {
                this.instantiateCallRefThisExpression(exp);
            }
            case ExpressionTag.CallRefSelfExpression: {
                this.instantiateCallRefSelfExpression(exp);
            }
            case ExpressionTag.CallTaskActionExpression: {
                this.instantiateCallTaskActionExpression(exp);
            }
            default: {
                const ttag = exp.tag;
                if (ttag === ExpressionTag.CallNamespaceFunctionExpression) {
                    this.instantiateCallNamespaceFunctionExpression(exp);
                }
                else if (ttag === ExpressionTag.CallTypeFunctionExpression) {
                    this.instantiateCallTypeFunctionExpression(exp);
                }
                else if (ttag === ExpressionTag.LambdaInvokeExpression) {
                    this.instantiateLambdaInvokeExpression(exp);
                }
                else if (ttag === ExpressionTag.PostfixOpExpression) {
                    this.instantiatePostfixOp(exp);
                }
                else if (ttag === ExpressionTag.PrefixNotOpExpression) {
                    this.instantiateITestGuardExpression(exp.exp);
                }
                else if (ttag === ExpressionTag.LogicAndExpression) {
                    exp.exps.forEach((e) => this.instantiateITestGuardExpression(e));
                }
                else {
                    this.instantiateExpression(exp);
                }
            }
        }
    }
    instantiateITestGuard(tt) {
        this.instantiateITestGuardExpression(tt.exp);
        if (tt instanceof ITestTypeGuard) {
            this.processITestAsBoolean(tt.exp.getType(), tt.itest);
        }
        if (tt instanceof ITestBinderGuard) {
            this.processITestAsConvert(tt.exp.getType(), tt.itest);
        }
    }
    instantiateITestGuardSet(tt) {
        tt.guards.forEach((guard) => this.instantiateITestGuard(guard));
    }
    instantiateArgumentList(args, pnames, shuffleinfo) {
        let linfos = [];
        for (let i = 0; i < shuffleinfo.length; ++i) {
            const [idx, _] = shuffleinfo[i];
            const arg = args[idx];
            if (arg instanceof StdArgumentValue) {
                if (!(arg.exp.getType() instanceof LambdaTypeSignature)) {
                    this.instantiateExpression(arg.exp);
                }
                else {
                    if (arg.exp instanceof AccessVariableExpression) {
                        const lkey = this.currentLambdaMapping.get(arg.exp.srcname);
                        linfos.push({ pname: pnames[idx], psigkey: lkey });
                    }
                    if (arg.exp instanceof ConstructorLambdaExpression) {
                        const lkey = this.instantiateConstructorLambdaExpression(arg.exp);
                        linfos.push({ pname: pnames[idx], psigkey: lkey });
                    }
                }
            }
        }
        return linfos;
    }
    instantiateConstructorArgumentList(args) {
        args.forEach((arg) => {
            if (arg instanceof StdArgumentValue) {
                this.instantiateExpression(arg.exp);
            }
        });
    }
    instantiateLiteralTypeDeclValueExpression(exp) {
        this.instantiateTypeSignature(exp.constype, this.currentMapping);
        this.instantiateExpression(exp.value);
    }
    instantiateLiteralTypedStringExpression(exp) {
        this.instantiateTypeSignature(exp.constype, this.currentMapping);
    }
    instantiateLiteralTypedCStringExpression(exp) {
        this.instantiateTypeSignature(exp.constype, this.currentMapping);
    }
    instantiateLiteralTypedFormatStringExpression(exp) {
        this.instantiateTypeSignature(exp.constype, this.currentMapping);
        this.instantiateStringFormatsList(exp.fmts);
    }
    instantiateLiteralTypedFormatCStringExpression(exp) {
        this.instantiateTypeSignature(exp.constype, this.currentMapping);
        this.instantiateStringFormatsList(exp.fmts);
    }
    instantiateAccessEnvValueExpression(exp) {
        if (exp.optoftype !== undefined) {
            this.instantiateTypeSignature(exp.optoftype, this.currentMapping);
        }
    }
    instantiateTaskAccessInfoExpression(exp) {
        return;
    }
    instantiateNamespaceConstExpression(exp) {
        return;
    }
    instantiateAccessStaticFieldExpression(exp) {
        this.instantiateTypeSignature(exp.stype, this.currentMapping);
        this.instantiateTypeSignature(exp.resolvedDeclType, this.currentMapping);
    }
    instantiateAccessEnumExpression(exp) {
        this.instantiateTypeSignature(exp.stype, this.currentMapping);
    }
    instantiateAccessVariableExpression(exp) {
        if (exp.isCaptured) {
            if (!(exp.getType() instanceof LambdaTypeSignature)) {
                if (this.lambdaScopes[this.lambdaScopes.length - 1].capturedVars.find((ctn) => ctn[0] === exp.srcname) === undefined) {
                    this.lambdaScopes[this.lambdaScopes.length - 1].capturedVars.push([exp.srcname, exp.getType(), exp.ocapture]);
                }
            }
            else {
                if (this.lambdaScopes[this.lambdaScopes.length - 1].capturedLambdas.find((ctl) => ctl.pname === exp.srcname) === undefined) {
                    const ll = this.currentLambdaMapping.get(exp.srcname);
                    this.lambdaScopes[this.lambdaScopes.length - 1].capturedLambdas.push({ pname: exp.srcname, psigkey: ll, rpos: exp.ocapture });
                }
            }
        }
        return;
    }
    instantiateCollectionConstructor(decl, t, args) {
        if (decl instanceof ListTypeDecl) {
            ; //Nothing additional to do
        }
        else if (decl instanceof StackTypeDecl) {
            assert(false, "Not Implemented");
        }
        else if (decl instanceof QueueTypeDecl) {
            assert(false, "Not Implemented");
        }
        else if (decl instanceof SetTypeDecl) {
            assert(false, "Not Implemented");
        }
        else {
            const medecl = this.assembly.getCoreNamespace().typedecls.find((td) => td.name === "MapEntry");
            const metdecl = new NominalTypeSignature(t.sinfo, undefined, medecl, [t.alltermargs[0], t.alltermargs[1]]);
            this.instantiateTypeSignature(metdecl, this.currentMapping);
        }
    }
    instantiateConstructorPrimaryExpression(exp) {
        this.instantiateTypeSignature(exp.ctype, this.currentMapping);
        if (exp.elemtype !== undefined) {
            this.instantiateTypeSignature(exp.elemtype, this.currentMapping);
        }
        for (let i = 0; i < exp.shuffleinfo.length; ++i) {
            if (exp.shuffleinfo[i][1] !== undefined) {
                this.instantiateTypeSignature(exp.shuffleinfo[i][1], this.currentMapping);
            }
            this.instantiateTypeSignature(exp.shuffleinfo[i][3], this.currentMapping);
        }
        this.instantiateConstructorArgumentList(exp.args.args);
        const decl = exp.ctype.decl;
        if (decl instanceof AbstractCollectionTypeDecl) {
            this.instantiateCollectionConstructor(decl, exp.ctype, exp.args.args);
        }
    }
    instantiateConstructorEListExpression(exp) {
        for (let i = 0; i < exp.args.args.length; ++i) {
            const sarg = exp.args.args[i];
            if (sarg instanceof StdArgumentValue) {
                this.instantiateExpression(sarg.exp);
            }
        }
    }
    instantiateConstructorLambdaExpression(exp) {
        this.lambdaScopes.push(new ScopeUseFrame());
        const olcons = this.lambdamap;
        const nlcons = new Map();
        this.lambdamap = nlcons;
        const ominvmap = this.callinstmap;
        const nlinvmap = new Map();
        this.callinstmap = nlinvmap;
        this.instantiateBodyImplementation(exp.invoke.body);
        this.lambdamap = olcons;
        this.callinstmap = ominvmap;
        const linfo = this.lambdaScopes.pop();
        if (this.lambdaScopes.length !== 0) {
            const lcaptures = exp.lcaptures;
            const pscope = this.lambdaScopes[this.lambdaScopes.length - 1];
            const nvcaptures = linfo.capturedVars.filter((cv) => lcaptures.some((lc) => lc.vname === cv[0] && lc.ocapture === "outer") && !pscope.capturedVars.some((ov) => ov[0] === cv[0]));
            pscope.capturedVars.push(...nvcaptures);
            const nlcaptures = linfo.capturedLambdas.filter((lv) => lcaptures.some((lc) => lc.vname === lv.pname && lc.ocapture === "outer") && !pscope.capturedLambdas.some((ov) => ov.pname === lv.pname));
            pscope.capturedLambdas.push(...nlcaptures);
            pscope.capturedTemplateNames.push(...linfo.capturedTemplateNames);
        }
        if (linfo.capturedTemplateNames.length === 0 && linfo.capturedLambdas.length === 0) {
            const psigkey = `fn_${exp.monomorphizedUID}`;
            const linst = new LambdaInstantiationInfo(psigkey, undefined, nlcons, nlinvmap, [...linfo.capturedVars], [], [], exp.getType(), exp.invoke);
            this.lambdamap.set(exp.monomorphizedUID, psigkey);
            this.currentNSInstantiation.lambdas.set(psigkey, linst);
            return psigkey;
        }
        else {
            const tbinds = linfo.capturedTemplateNames.map((ctn) => this.currentMapping.resolveTemplateMapping(new TemplateTypeSignature(exp.sinfo, ctn)));
            const psigkey = computeInvokeKeyForLambdaFunction(`fn_${exp.monomorphizedUID}`, exp.sinfo.line, tbinds, linfo.capturedLambdas);
            let binds = undefined;
            if (tbinds.length !== 0) {
                let tmap = new Map();
                for (let i = 0; i < linfo.capturedTemplateNames.length; ++i) {
                    tmap.set(linfo.capturedTemplateNames[i], tbinds[i]);
                }
                binds = TemplateNameMapper.createInitialMapping(tmap);
            }
            const linst = new LambdaInstantiationInfo(psigkey, binds, nlcons, nlinvmap, [...linfo.capturedVars], linfo.capturedLambdas, linfo.capturedTemplateNames, exp.getType(), exp.invoke);
            this.lambdamap.set(exp.monomorphizedUID, psigkey);
            this.currentNSInstantiation.lambdas.set(psigkey, linst);
            return psigkey;
        }
    }
    instantiateLambdaInvokeExpression(exp) {
        this.instantiateTypeSignature(exp.lambda, this.currentMapping);
        this.instantiateArgumentList(exp.args.args, exp.lambda.params.map((p) => p.name || "_"), exp.arginfo.map((ai, ii) => [ii, ai]));
        for (let i = 0; i < exp.arginfo.length; ++i) {
            this.instantiateTypeSignature(exp.arginfo[i], this.currentMapping);
        }
        if (exp.restinfo !== undefined) {
            const rparamtype = (this.currentMapping !== undefined ? exp.resttype.remapTemplateBindings(this.currentMapping) : exp.resttype);
            let rargs = [];
            for (let i = 0; i < exp.restinfo.length; ++i) {
                this.instantiateTypeSignature(exp.restinfo[i][2], this.currentMapping);
                rargs.push(exp.args.args[exp.restinfo[i][0]]);
            }
            this.instantiateCollectionConstructor(rparamtype.decl, rparamtype, rargs);
        }
        const psigkey = this.currentLambdaMapping.get(exp.name);
        this.callinstmap.set(exp.monoinvid, psigkey);
        if (exp.isCapturedLambda) {
            this.lambdaScopes[this.lambdaScopes.length - 1].capturedLambdas.push({ pname: exp.name, psigkey: psigkey, rpos: exp.ocapture });
        }
    }
    instantiateSpecialConstructorExpression(exp) {
        this.instantiateTypeSignature(exp.constype, this.currentMapping);
        this.instantiateExpression(exp.arg);
    }
    instantiateCallNamespaceFunctionExpression(exp) {
        for (let i = 0; i < exp.terms.length; ++i) {
            this.instantiateTypeSignature(exp.terms[i], this.currentMapping);
        }
        const nns = this.assembly.resolveNamespaceDecl(exp.ns.ns);
        const nfd = exp.resolvedFunction;
        const lambdas = this.instantiateArgumentList(exp.args.args, nfd.params.map((p) => p.name || "_"), exp.shuffleinfo);
        for (let i = 0; i < exp.shuffleinfo.length; ++i) {
            this.instantiateTypeSignature(exp.shuffleinfo[i][1], this.currentMapping);
        }
        if (exp.restinfo !== undefined) {
            const rparamtype = (this.currentMapping !== undefined ? exp.resttype.remapTemplateBindings(this.currentMapping) : exp.resttype);
            let rargs = [];
            for (let i = 0; i < exp.restinfo.length; ++i) {
                this.instantiateTypeSignature(exp.restinfo[i][2], this.currentMapping);
                rargs.push(exp.args.args[exp.restinfo[i][0]]);
            }
            this.instantiateCollectionConstructor(rparamtype.decl, rparamtype, rargs);
        }
        const tterms = this.currentMapping !== undefined ? exp.terms.map((t) => t.remapTemplateBindings(this.currentMapping)) : exp.terms;
        this.callinstmap.set(exp.monoinvid, computeInvokeKeyForNamespaceFunction(nns, nfd, tterms, lambdas));
        this.instantiateNamespaceFunction(nns, nfd, tterms, lambdas);
    }
    instantiateCallTypeFunctionExpression(exp) {
        this.instantiateTypeSignature(exp.ttype, this.currentMapping);
        this.instantiateTypeSignature(exp.resolvedDeclType, this.currentMapping);
        for (let i = 0; i < exp.terms.length; ++i) {
            this.instantiateTypeSignature(exp.terms[i], this.currentMapping);
        }
        for (let i = 0; i < exp.shuffleinfo.length; ++i) {
            this.instantiateTypeSignature(exp.shuffleinfo[i][1], this.currentMapping);
        }
        if (exp.restinfo !== undefined) {
            const rparamtype = (this.currentMapping !== undefined ? exp.resttype.remapTemplateBindings(this.currentMapping) : exp.resttype);
            let rargs = [];
            for (let i = 0; i < exp.restinfo.length; ++i) {
                this.instantiateTypeSignature(exp.restinfo[i][2], this.currentMapping);
                rargs.push(exp.args.args[exp.restinfo[i][0]]);
            }
            this.instantiateCollectionConstructor(rparamtype.decl, rparamtype, rargs);
        }
        if (!exp.isSpecialCall) {
            const fdecl = exp.resolvedFunction;
            const lambdas = this.instantiateArgumentList(exp.args.args, fdecl.params.map((p) => p.name || "_"), exp.shuffleinfo);
            const enclosingType = this.currentMapping !== undefined ? exp.resolvedDeclType.remapTemplateBindings(this.currentMapping) : exp.resolvedDeclType;
            const tterms = this.currentMapping !== undefined ? exp.terms.map((t) => t.remapTemplateBindings(this.currentMapping)) : exp.terms;
            this.callinstmap.set(exp.monoinvid, computeInvokeKeyForTypeFunction(enclosingType, fdecl, tterms, lambdas));
            this.instantiateTypeFunction(enclosingType, fdecl, exp.terms, lambdas);
        }
    }
    instantiateParseAsTypeExpression(exp) {
        this.instantiateTypeSignature(exp.ttype, this.currentMapping);
        this.instantiateExpression(exp.exp);
    }
    instantiateInterpolateFormatExpression(exp) {
        if (exp.decloftype !== undefined) {
            this.instantiateTypeSignature(exp.decloftype, this.currentMapping);
        }
        this.instantiateExpression(exp.fmtString);
        for (let i = 0; i < exp.args.length; ++i) {
            this.instantiateExpression(exp.args[i].exp);
        }
        if (exp.actualoftype !== undefined) {
            this.instantiateTypeSignature(exp.actualoftype, this.currentMapping);
        }
    }
    instantiatePostfixAccessFromName(exp) {
        this.instantiateTypeSignature(exp.declaredInType, this.currentMapping);
    }
    instantiatePostfixProjectFromNames(exp) {
        assert(false, "Not Implemented -- instantiatePostfixProjectFromNames");
    }
    instantiatePostfixAccessFromIndex(exp) {
        //no need to do anything extra here
    }
    instantiatePostfixIsTest(exp) {
        this.processITestAsBoolean(exp.getRcvrType(), exp.ttest);
    }
    instantiatePostfixAsConvert(exp) {
        this.processITestAsConvert(exp.getRcvrType(), exp.ttest);
    }
    instantiatePostfixAssignFields(exp) {
        /*
        for(let i = 0; i < exp.updates.length; ++i) {
            this.instantiateExpression(exp.updates[i][1]);
        }

        this.instantiateTypeSignature(exp.updatetype as TypeSignature, this.currentMapping);

        for(let i = 0; i < exp.updateinfo.length; ++i) {
            this.instantiateTypeSignature(exp.updateinfo[i].fieldtype, this.currentMapping);
            this.instantiateTypeSignature(exp.updateinfo[i].etype, this.currentMapping);
        }
        */
        assert(false, "Not Implemented -- instantiatePostfixAssignFields");
    }
    instantiatePostfixSliceOperator(exp) {
        assert(false, "Not Implemented -- instantiatePostfixSliceOperator");
    }
    instantiatePostfixInvoke(exp) {
        if (exp.specificResolve !== undefined) {
            this.instantiateTypeSignature(exp.specificResolve, this.currentMapping);
        }
        this.instantiateTypeSignature(exp.resolvedDeclType, this.currentMapping);
        if (exp.resolvedImplType !== undefined) {
            this.instantiateTypeSignature(exp.resolvedImplType, this.currentMapping);
        }
        const mdd = exp.resolvedMethodDecl;
        const lambdas = this.instantiateArgumentList(exp.args.args, mdd.params.map((p) => p.name || "_"), exp.shuffleinfo);
        for (let i = 0; i < exp.terms.length; ++i) {
            this.instantiateTypeSignature(exp.terms[i], this.currentMapping);
        }
        for (let i = 0; i < exp.shuffleinfo.length; ++i) {
            this.instantiateTypeSignature(exp.shuffleinfo[i][1], this.currentMapping);
        }
        if (exp.restinfo !== undefined) {
            const rparamtype = (this.currentMapping !== undefined ? exp.resttype.remapTemplateBindings(this.currentMapping) : exp.resttype);
            let rargs = [];
            for (let i = 0; i < exp.restinfo.length; ++i) {
                this.instantiateTypeSignature(exp.restinfo[i][2], this.currentMapping);
                rargs.push(exp.args.args[exp.restinfo[i][0]]);
            }
            this.instantiateCollectionConstructor(rparamtype.decl, rparamtype, rargs);
        }
        const prepostikey = computeInvokeKeyForTypeMethod(exp.resolvedDeclType, mdd, exp.terms, lambdas);
        //if the decl is not the same as the impl (and the decls has pre/post conditions), then we need to instantiate the decl as well to ensure the pre/post conditions are compiled
        if (exp.resolvedImplType !== undefined && exp.resolvedDeclType !== undefined && exp.resolvedDeclType.tkeystr !== exp.resolvedImplType.tkeystr) {
            const rmd = exp.resolvedMethodDecl;
            if (rmd.preconditions.length !== 0 || rmd.postconditions.length !== 0) {
                assert(false, "Not Implemented -- instantiatePostfixInvoke for decl/impl mismatch with pre/post conditions -- abstract or virtual");
            }
        }
        if (exp.resolvedMethodImpl !== undefined) {
            const mdecl = this.currentMapping !== undefined ? exp.resolvedImplType.remapTemplateBindings(this.currentMapping) : exp.resolvedDeclType;
            const tterms = this.currentMapping !== undefined ? exp.terms.map((t) => t.remapTemplateBindings(this.currentMapping)) : exp.terms;
            this.callinstmap.set(exp.monoinvid, computeInvokeKeyForTypeMethod(mdecl, mdd, tterms, lambdas));
            this.instantiateSpecificResolvedMemberMethod(mdecl, mdd, tterms, lambdas, prepostikey);
        }
        else {
            assert(false, "Not Implemented -- instantiatePostfixInvoke for virtual");
        }
    }
    instantiatePostfixOp(exp) {
        this.instantiateExpression(exp.rootExp);
        for (let i = 0; i < exp.ops.length; ++i) {
            const op = exp.ops[i];
            this.instantiateTypeSignature(op.getType(), this.currentMapping);
            this.instantiateTypeSignature(op.getRcvrType(), this.currentMapping);
            switch (op.tag) {
                case PostfixOpTag.PostfixAccessFromName: {
                    this.instantiatePostfixAccessFromName(op);
                    break;
                }
                case PostfixOpTag.PostfixProjectFromNames: {
                    this.instantiatePostfixProjectFromNames(op);
                    break;
                }
                case PostfixOpTag.PostfixAccessFromIndex: {
                    this.instantiatePostfixAccessFromIndex(op);
                    break;
                }
                case PostfixOpTag.PostfixIsTest: {
                    this.instantiatePostfixIsTest(op);
                    break;
                }
                case PostfixOpTag.PostfixAsConvert: {
                    this.instantiatePostfixAsConvert(op);
                    break;
                }
                case PostfixOpTag.PostfixAssignFields: {
                    this.instantiatePostfixAssignFields(op);
                    break;
                }
                case PostfixOpTag.PostfixSliceOperator: {
                    this.instantiatePostfixSliceOperator(op);
                    break;
                }
                case PostfixOpTag.PostfixInvoke: {
                    this.instantiatePostfixInvoke(op);
                    break;
                }
                default: {
                    assert(false, "Unknown PostfixOpTag -- " + op.tag);
                }
            }
        }
    }
    instantiatePrefixNotOpExpression(exp) {
        this.instantiateExpression(exp.exp);
    }
    instantiatePrefixNegateOrPlusOpExpression(exp) {
        this.instantiateExpression(exp.exp);
    }
    instantiateBinaryNumericArgs(lhs, rhs) {
        this.instantiateExpression(lhs);
        this.instantiateExpression(rhs);
    }
    instantiateBinAddExpression(exp) {
        this.instantiateBinaryNumericArgs(exp.lhs, exp.rhs);
    }
    instantiateBinSubExpression(exp) {
        this.instantiateBinaryNumericArgs(exp.lhs, exp.rhs);
    }
    instantiateBinMultExpression(exp) {
        this.instantiateBinaryNumericArgs(exp.lhs, exp.rhs);
    }
    instantiateBinDivExpression(exp) {
        this.instantiateBinaryNumericArgs(exp.lhs, exp.rhs);
    }
    instantiateBinKeyEqExpression(exp) {
        this.instantiateExpression(exp.lhs);
        this.instantiateExpression(exp.rhs);
    }
    instantiateBinKeyNeqExpression(exp) {
        this.instantiateExpression(exp.lhs);
        this.instantiateExpression(exp.rhs);
    }
    instantiateKeyCompareEqExpression(exp) {
        this.instantiateTypeSignature(exp.ktype, this.currentMapping);
        this.instantiateExpression(exp.lhs);
        this.instantiateExpression(exp.rhs);
    }
    instantiateKeyCompareLessExpression(exp) {
        this.instantiateTypeSignature(exp.ktype, this.currentMapping);
        this.instantiateExpression(exp.lhs);
        this.instantiateExpression(exp.rhs);
    }
    instantiateNumericEqExpression(exp) {
        this.instantiateBinaryNumericArgs(exp.lhs, exp.rhs);
    }
    instantiateNumericNeqExpression(exp) {
        this.instantiateBinaryNumericArgs(exp.lhs, exp.rhs);
    }
    instantiateNumericLessExpression(exp) {
        this.instantiateBinaryNumericArgs(exp.lhs, exp.rhs);
    }
    instantiateNumericLessEqExpression(exp) {
        this.instantiateBinaryNumericArgs(exp.lhs, exp.rhs);
    }
    instantiateNumericGreaterExpression(exp) {
        this.instantiateBinaryNumericArgs(exp.lhs, exp.rhs);
    }
    instantiateNumericGreaterEqExpression(exp) {
        this.instantiateBinaryNumericArgs(exp.lhs, exp.rhs);
    }
    instantiateLogicAndExpression(exp) {
        exp.exps.forEach((e) => this.instantiateExpression(e));
    }
    instantiateLogicOrExpression(exp) {
        exp.exps.forEach((e) => this.instantiateExpression(e));
    }
    instantiateHoleExpression(exp) {
        if (exp.explicittype !== undefined) {
            this.instantiateTypeSignature(exp.explicittype, this.currentMapping);
        }
        if (exp.samplesfile !== undefined) {
            this.instantiateExpression(exp.samplesfile);
        }
    }
    instantiateMapEntryConstructorExpression(exp) {
        this.instantiateExpression(exp.kexp);
        this.instantiateExpression(exp.vexp);
    }
    // Add our rope instantiation here, check if we are cstring or string and go lookup ns to find the constructor for the correct size
    instantiateExpression(exp) {
        this.instantiateTypeSignature(exp.getType(), this.currentMapping);
        switch (exp.tag) {
            case ExpressionTag.LiteralNoneExpression:
            case ExpressionTag.LiteralBoolExpression:
            case ExpressionTag.LiteralNatExpression:
            case ExpressionTag.LiteralIntExpression:
            case ExpressionTag.LiteralChkNatExpression:
            case ExpressionTag.LiteralChkIntExpression:
            case ExpressionTag.LiteralRationalExpression:
            case ExpressionTag.LiteralFloatExpression:
            case ExpressionTag.LiteralDecimalExpression:
            case ExpressionTag.LiteralDecimalDegreeExpression:
            case ExpressionTag.LiteralLatLongCoordinateExpression:
            case ExpressionTag.LiteralComplexNumberExpression:
            case ExpressionTag.LiteralByteBufferExpression:
            case ExpressionTag.LiteralUUIDv4Expression:
            case ExpressionTag.LiteralUUIDv7Expression:
            case ExpressionTag.LiteralSHAContentHashExpression:
            case ExpressionTag.LiteralTZDateTimeExpression:
            case ExpressionTag.LiteralTAITimeExpression:
            case ExpressionTag.LiteralPlainDateExpression:
            case ExpressionTag.LiteralPlainTimeExpression:
            case ExpressionTag.LiteralLogicalTimeExpression:
            case ExpressionTag.LiteralISOTimeStampExpression:
            case ExpressionTag.LiteralDeltaDateTimeExpression:
            case ExpressionTag.LiteralDeltaISOTimeStampExpression:
            case ExpressionTag.LiteralDeltaSecondsExpression:
            case ExpressionTag.LiteralDeltaLogicalExpression:
            case ExpressionTag.LiteralUnicodeRegexExpression:
            case ExpressionTag.LiteralCRegexExpression:
            case ExpressionTag.LiteralByteExpression:
            case ExpressionTag.LiteralCCharExpression:
            case ExpressionTag.LiteralUnicodeCharExpression:
            case ExpressionTag.LiteralStringExpression:
            case ExpressionTag.LiteralCStringExpression: {
                break; //nothing to do
            }
            case ExpressionTag.LiteralFormatStringExpression: {
                this.instantiateStringFormatsList(exp.fmts);
                break;
            }
            case ExpressionTag.LiteralFormatCStringExpression: {
                this.instantiateStringFormatsList(exp.fmts);
                break;
            }
            case ExpressionTag.LiteralPathExpression:
            case ExpressionTag.LiteralPathFragmentExpression:
            case ExpressionTag.LiteralGlobExpression: {
                break; //nothing to do
            }
            case ExpressionTag.LiteralTypeDeclValueExpression: {
                this.instantiateLiteralTypeDeclValueExpression(exp);
                break;
            }
            case ExpressionTag.LiteralTypedStringExpression: {
                this.instantiateLiteralTypedStringExpression(exp);
                break;
            }
            case ExpressionTag.LiteralTypedCStringExpression: {
                this.instantiateLiteralTypedCStringExpression(exp);
                break;
            }
            case ExpressionTag.LiteralTypedFormatStringExpression: {
                this.instantiateLiteralTypedFormatStringExpression(exp);
                break;
            }
            case ExpressionTag.LiteralTypedFormatCStringExpression: {
                this.instantiateLiteralTypedFormatCStringExpression(exp);
                break;
            }
            case ExpressionTag.AccessEnvValueExpression: {
                this.instantiateAccessEnvValueExpression(exp);
                break;
            }
            case ExpressionTag.TaskAccessIDExpression: {
                this.instantiateTaskAccessInfoExpression(exp);
                break;
            }
            case ExpressionTag.AccessNamespaceConstantExpression: {
                this.instantiateNamespaceConstExpression(exp);
                break;
            }
            case ExpressionTag.AccessEnumExpression: {
                this.instantiateAccessEnumExpression(exp);
                break;
            }
            case ExpressionTag.AccessStaticFieldExpression: {
                this.instantiateAccessStaticFieldExpression(exp);
                break;
            }
            case ExpressionTag.AccessVariableExpression: {
                this.instantiateAccessVariableExpression(exp);
                break;
            }
            case ExpressionTag.ConstructorPrimaryExpression: {
                this.instantiateConstructorPrimaryExpression(exp);
                break;
            }
            case ExpressionTag.ConstructorEListExpression: {
                this.instantiateConstructorEListExpression(exp);
                break;
            }
            case ExpressionTag.ConstructorLambdaExpression: {
                this.instantiateConstructorLambdaExpression(exp);
                break;
            }
            case ExpressionTag.LambdaInvokeExpression: {
                this.instantiateLambdaInvokeExpression(exp);
                break;
            }
            case ExpressionTag.SpecialConstructorExpression: {
                this.instantiateSpecialConstructorExpression(exp);
                break;
            }
            case ExpressionTag.CallNamespaceFunctionExpression: {
                this.instantiateCallNamespaceFunctionExpression(exp);
                break;
            }
            case ExpressionTag.CallTypeFunctionExpression: {
                this.instantiateCallTypeFunctionExpression(exp);
                break;
            }
            case ExpressionTag.ParseAsTypeExpression: {
                this.instantiateParseAsTypeExpression(exp);
                break;
            }
            case ExpressionTag.InterpolateFormatExpression: {
                this.instantiateInterpolateFormatExpression(exp);
                break;
            }
            case ExpressionTag.PostfixOpExpression: {
                this.instantiatePostfixOp(exp);
                break;
            }
            case ExpressionTag.PrefixNotOpExpression: {
                this.instantiatePrefixNotOpExpression(exp);
                break;
            }
            case ExpressionTag.PrefixNegateOrPlusOpExpression: {
                this.instantiatePrefixNegateOrPlusOpExpression(exp);
                break;
            }
            case ExpressionTag.BinAddExpression: {
                this.instantiateBinAddExpression(exp);
                break;
            }
            case ExpressionTag.BinSubExpression: {
                this.instantiateBinSubExpression(exp);
                break;
            }
            case ExpressionTag.BinMultExpression: {
                this.instantiateBinMultExpression(exp);
                break;
            }
            case ExpressionTag.BinDivExpression: {
                this.instantiateBinDivExpression(exp);
                break;
            }
            case ExpressionTag.BinKeyEqExpression: {
                this.instantiateBinKeyEqExpression(exp);
                break;
            }
            case ExpressionTag.BinKeyNeqExpression: {
                this.instantiateBinKeyNeqExpression(exp);
                break;
            }
            case ExpressionTag.KeyCompareEqExpression: {
                this.instantiateKeyCompareEqExpression(exp);
                break;
            }
            case ExpressionTag.KeyCompareLessExpression: {
                this.instantiateKeyCompareLessExpression(exp);
                break;
            }
            case ExpressionTag.NumericEqExpression: {
                this.instantiateNumericEqExpression(exp);
                break;
            }
            case ExpressionTag.NumericNeqExpression: {
                this.instantiateNumericNeqExpression(exp);
                break;
            }
            case ExpressionTag.NumericLessExpression: {
                this.instantiateNumericLessExpression(exp);
                break;
            }
            case ExpressionTag.NumericLessEqExpression: {
                this.instantiateNumericLessEqExpression(exp);
                break;
            }
            case ExpressionTag.NumericGreaterExpression: {
                this.instantiateNumericGreaterExpression(exp);
                break;
            }
            case ExpressionTag.NumericGreaterEqExpression: {
                this.instantiateNumericGreaterEqExpression(exp);
                break;
            }
            case ExpressionTag.LogicAndExpression: {
                this.instantiateLogicAndExpression(exp);
                break;
            }
            case ExpressionTag.LogicOrExpression: {
                this.instantiateLogicOrExpression(exp);
                break;
            }
            case ExpressionTag.HoleExpression: {
                this.instantiateHoleExpression(exp);
                break;
            }
            case ExpressionTag.MapEntryConstructorExpression: {
                this.instantiateMapEntryConstructorExpression(exp);
                break;
            }
            default: {
                ; //handled by the type signature instantiation on exp type
            }
        }
    }
    instantiateCallRefInvokeExpression(exp) {
        this.instantiateExpression(exp.rcvr);
        if (exp.specificResolve !== undefined) {
            this.instantiateTypeSignature(exp.specificResolve, this.currentMapping);
        }
        this.instantiateTypeSignature(exp.resolvedDeclType, this.currentMapping);
        if (exp.resolvedImplType !== undefined) {
            this.instantiateTypeSignature(exp.resolvedImplType, this.currentMapping);
        }
        const mdd = exp.resolvedMethodDecl;
        const lambdas = this.instantiateArgumentList(exp.args.args, mdd.params.map((p) => p.name || "_"), exp.shuffleinfo);
        for (let i = 0; i < exp.terms.length; ++i) {
            this.instantiateTypeSignature(exp.terms[i], this.currentMapping);
        }
        for (let i = 0; i < exp.shuffleinfo.length; ++i) {
            this.instantiateTypeSignature(exp.shuffleinfo[i][1], this.currentMapping);
        }
        if (exp.restinfo !== undefined) {
            const rparamtype = (this.currentMapping !== undefined ? exp.resttype.remapTemplateBindings(this.currentMapping) : exp.resttype);
            let rargs = [];
            for (let i = 0; i < exp.restinfo.length; ++i) {
                this.instantiateTypeSignature(exp.restinfo[i][2], this.currentMapping);
                rargs.push(exp.args.args[exp.restinfo[i][0]]);
            }
            this.instantiateCollectionConstructor(rparamtype.decl, rparamtype, rargs);
        }
        const prepostikey = computeInvokeKeyForTypeMethod(exp.resolvedDeclType, mdd, exp.terms, lambdas);
        //if the decl is not the same as the impl (and the decls has pre/post conditions), then we need to instantiate the decl as well to ensure the pre/post conditions are compiled
        if (exp.resolvedImplType !== undefined && exp.resolvedDeclType !== undefined && exp.resolvedDeclType.tkeystr !== exp.resolvedImplType.tkeystr) {
            const rmd = exp.resolvedMethodDecl;
            if (rmd.preconditions.length !== 0 || rmd.postconditions.length !== 0) {
                assert(false, "Not Implemented -- instantiatePostfixInvoke for decl/impl mismatch with pre/post conditions -- abstract or virtual");
            }
        }
        if (exp.resolvedMethodImpl !== undefined) {
            const mdecl = this.currentMapping !== undefined ? exp.resolvedImplType.remapTemplateBindings(this.currentMapping) : exp.resolvedDeclType;
            const tterms = this.currentMapping !== undefined ? exp.terms.map((t) => t.remapTemplateBindings(this.currentMapping)) : exp.terms;
            this.callinstmap.set(exp.monoinvid, computeInvokeKeyForTypeMethod(mdecl, mdd, tterms, lambdas));
            this.instantiateSpecificResolvedMemberMethod(mdecl, mdd, tterms, lambdas, prepostikey);
        }
        else {
            assert(false, "Not Implemented -- instantiatePostfixInvoke for virtual");
        }
    }
    instantiateCallRefVariableExpression(exp) {
        this.instantiateCallRefInvokeExpression(exp);
    }
    instantiateCallRefThisExpression(exp) {
        this.instantiateCallRefInvokeExpression(exp);
    }
    instantiateCallRefSelfExpression(exp) {
        this.instantiateCallRefInvokeExpression(exp);
    }
    instantiateCallTaskActionExpression(exp) {
        assert(false, "Not Implemented -- instantiateCallTaskActionExpression");
    }
    instantiateTaskRunExpression(exp) {
        assert(false, "Not Implemented -- instantiateTaskRunExpression");
    }
    instantiateTaskMultiExpression(exp) {
        assert(false, "Not Implemented -- instantiateTaskMultiExpression");
    }
    instantiateTaskDashExpression(exp) {
        assert(false, "Not Implemented -- instantiateTaskDashExpression");
    }
    instantiateTaskAllExpression(exp) {
        assert(false, "Not Implemented -- instantiateTaskAllExpression");
    }
    instantiateTaskRaceExpression(exp) {
        assert(false, "Not Implemented -- instantiateTaskRaceExpression");
    }
    instantiateAPIInvokeExpression(exp) {
        assert(false, "Not Implemented");
    }
    instantiateAgentInvokeExpression(exp) {
        assert(false, "Not Implemented");
    }
    instantiateChkLogicExpression(exp) {
        if (exp.tag === ChkLogicExpressionTag.ChkLogicBaseExpression) {
            return this.instantiateExpression(exp.exp);
        }
        else {
            const iiexp = exp;
            this.instantiateITestGuardSet(iiexp.lhs);
            for (let i = 0; i < iiexp.bbinds.length; ++i) {
                const bb = iiexp.bbinds[i];
                if (bb.ttrue !== undefined) {
                    this.instantiateTypeSignature(bb.ttrue, this.currentMapping);
                }
                if (bb.tfalse !== undefined) {
                    this.instantiateTypeSignature(bb.tfalse, this.currentMapping);
                }
            }
            this.instantiateExpression(iiexp.rhs);
        }
    }
    instantiateConditionalValueExpression(exp) {
        this.instantiateITestGuardSet(exp.guardset);
        for (let i = 0; i < exp.bbinds.length; ++i) {
            const bb = exp.bbinds[i];
            if (bb.ttrue !== undefined) {
                this.instantiateTypeSignature(bb.ttrue, this.currentMapping);
            }
            if (bb.tfalse !== undefined) {
                this.instantiateTypeSignature(bb.tfalse, this.currentMapping);
            }
        }
        this.instantiateExpression(exp.trueValue);
        this.instantiateExpression(exp.falseValue);
    }
    instantiateBaseRValueExpression(exp) {
        const ttag = exp.tag;
        switch (ttag) {
            case ExpressionTag.CallRefVariableExpression: {
                this.instantiateCallRefVariableExpression(exp);
                break;
            }
            case ExpressionTag.CallRefThisExpression: {
                this.instantiateCallRefThisExpression(exp);
                break;
            }
            case ExpressionTag.CallRefSelfExpression: {
                this.instantiateCallRefSelfExpression(exp);
                break;
            }
            case ExpressionTag.CallTaskActionExpression: {
                this.instantiateCallTaskActionExpression(exp);
                break;
            }
            case ExpressionTag.TaskRunExpression: {
                this.instantiateTaskRunExpression(exp);
                break;
            }
            case ExpressionTag.TaskMultiExpression: {
                this.instantiateTaskMultiExpression(exp);
                break;
            }
            case ExpressionTag.TaskDashExpression: {
                this.instantiateTaskDashExpression(exp);
                break;
            }
            case ExpressionTag.TaskAllExpression: {
                this.instantiateTaskAllExpression(exp);
                break;
            }
            case ExpressionTag.TaskRaceExpression: {
                this.instantiateTaskRaceExpression(exp);
                break;
            }
            case ExpressionTag.APIInvokeExpression: {
                this.instantiateAPIInvokeExpression(exp);
                break;
            }
            case ExpressionTag.AgentInvokeExpression: {
                this.instantiateAgentInvokeExpression(exp);
                break;
            }
            default: {
                this.instantiateExpression(exp);
                break;
            }
        }
    }
    instantiateExpressionRHS(exp) {
        const ttag = exp.tag;
        if (ttag === RValueExpressionTag.BaseExpression) {
            this.instantiateBaseRValueExpression(exp.exp);
        }
        else if (ttag === RValueExpressionTag.ShortCircuitAssignRHSExpressionFail) {
            assert(false, "Not Implemented -- checkShortCircuitAssignRHSFailExpression");
        }
        else if (ttag === RValueExpressionTag.ShortCircuitAssignRHSExpressionReturn) {
            assert(false, "Not Implemented -- checkShortCircuitAssignRHSReturnExpression");
        }
        else if (ttag === RValueExpressionTag.ConditionalValueExpression) {
            this.instantiateConditionalValueExpression(exp);
        }
        else {
            assert(false, "Unknown RValueExpression kind");
        }
        this.instantiateTypeSignature(exp.rtype, this.currentMapping);
    }
    instantiateEmptyStatement(stmt) {
        return;
    }
    instantiateVariableDeclarationStatement(stmt) {
        this.instantiateTypeSignature(stmt.vtype, this.currentMapping);
    }
    instantiateVariableMultiDeclarationStatement(stmt) {
        for (let i = 0; i < stmt.decls.length; ++i) {
            this.instantiateTypeSignature(stmt.decls[i].vtype, this.currentMapping);
        }
    }
    instantiateVariableInitializationStatement(stmt) {
        this.instantiateTypeSignature(stmt.actualtype, this.currentMapping);
        this.instantiateExpressionRHS(stmt.exp);
    }
    instantiateVariableMultiInitializationStatement(stmt) {
        /*
        for(let i = 0; i < stmt.decls.length; ++i) {
            if(!(stmt.decls[i].vtype instanceof AutoTypeSignature)) {
                this.instantiateTypeSignature(stmt.decls[i].vtype, this.currentMapping);
            }
            this.instantiateTypeSignature(stmt.actualtypes[i], this.currentMapping);
        }

        if(Array.isArray(stmt.exp)) {
            for(let i = 0; i < stmt.exp.length; ++i) {
                this.instantiateExpression(stmt.exp[i]);
            }
        }
        else {
            this.instantiateExpressionRHS(stmt.exp);
        }
        */
        assert(false, "Not Implemented -- instantiateVariableMultiInitializationStatement");
    }
    instantiateVariableAssignmentStatement(stmt) {
        this.instantiateTypeSignature(stmt.vtype, this.currentMapping);
        this.instantiateExpressionRHS(stmt.exp);
    }
    instantiateVariableMultiAssignmentStatement(stmt) {
        /*
        if(Array.isArray(stmt.exp)) {
            for(let i = 0; i < stmt.exp.length; ++i) {
                this.instantiateExpression(stmt.exp[i]);
            }
        }
        else {
            this.instantiateExpressionRHS(stmt.exp);
        }
        */
        assert(false, "Not Implemented -- instantiateVariableMultiAssignmentStatement");
    }
    instantiateReturnVoidStatement(stmt) {
        return;
    }
    instantiateReturnSingleStatement(stmt) {
        this.instantiateExpressionRHS(stmt.value);
        this.instantiateTypeSignature(stmt.rtype, this.currentMapping);
    }
    instantiateReturnMultiStatement(stmt) {
        /*
        for(let i = 0; i < stmt.value.length; ++i) {
            this.instantiateExpression(stmt.value[i]);
        }

        for(let i = 0; i < stmt.rtypes.length; ++i) {
           this.instantiateTypeSignature(stmt.rtypes[i], this.currentMapping);
        }

        this.instantiateTypeSignature(new EListTypeSignature(stmt.sinfo, stmt.rtypes), this.currentMapping);
        */
        assert(false, "Not Implemented -- instantiateReturnMultiStatement");
    }
    instantiateIfStatement(stmt) {
        this.instantiateITestGuardSet(stmt.cond);
        for (let i = 0; i < stmt.bbinds.length; ++i) {
            const bb = stmt.bbinds[i];
            if (bb.ttrue !== undefined) {
                this.instantiateTypeSignature(bb.ttrue, this.currentMapping);
            }
            if (bb.tfalse !== undefined) {
                this.instantiateTypeSignature(bb.tfalse, this.currentMapping);
            }
        }
        this.instantiateBlockStatement(stmt.trueBlock);
    }
    instantiateIfElseStatement(stmt) {
        this.instantiateITestGuardSet(stmt.cond);
        for (let i = 0; i < stmt.bbinds.length; ++i) {
            const bb = stmt.bbinds[i];
            if (bb.ttrue !== undefined) {
                this.instantiateTypeSignature(bb.ttrue, this.currentMapping);
            }
            if (bb.tfalse !== undefined) {
                this.instantiateTypeSignature(bb.tfalse, this.currentMapping);
            }
        }
        this.instantiateBlockStatement(stmt.trueBlock);
        this.instantiateBlockStatement(stmt.falseBlock);
    }
    instantiateIfElifElseStatement(stmt) {
        for (let i = 0; i < stmt.condflow.length; ++i) {
            this.instantiateExpression(stmt.condflow[i].cond);
            this.instantiateBlockStatement(stmt.condflow[i].block);
        }
        this.instantiateBlockStatement(stmt.elseflow);
    }
    instantiateSwitchStatement(stmt) {
        /*
        this.instantiateExpression(stmt.sval);
        
        for (let i = 0; i < stmt.switchflow.length; ++i) {
            this.instantiateBlockStatement(stmt.switchflow[i].value);

            if(stmt.switchflow[i].lval !== undefined) {
                const slitexp = (stmt.switchflow[i].lval as LiteralExpressionValue).exp;
                this.instantiateExpression(slitexp);
            }
        }
        */
        assert(false, "Not Implemented -- instantiateSwitchStatement");
    }
    instantiateMatchStatement(stmt) {
        this.instantiateExpression(stmt.sval);
        for (let i = 0; i < stmt.matchflow.length; ++i) {
            this.instantiateBlockStatement(stmt.matchflow[i].value);
            if (stmt.matchflow[i].mtype !== undefined) {
                const mtype = stmt.matchflow[i].mtype;
                this.instantiateTypeSignature(mtype, this.currentMapping);
            }
        }
        if (stmt.implicitFinalType !== undefined) {
            this.instantiateTypeSignature(stmt.implicitFinalType, this.currentMapping);
        }
    }
    instantiateDispatchPatternStatement(stmt) {
        assert(false, "Not implemented -- DispatchPatternStatement");
    }
    instantiateDispatchTaskStatement(stmt) {
        assert(false, "Not implemented -- DispatchTaskStatement");
    }
    instantiateAbortStatement(stmt) {
        return;
    }
    instantiateAssertStatement(stmt) {
        this.instantiateChkLogicExpression(stmt.cond);
    }
    instantiateValidateStatement(stmt) {
        this.instantiateChkLogicExpression(stmt.cond);
    }
    instantiateDebugStatement(stmt) {
        this.instantiateExpression(stmt.value);
    }
    instantiateVoidRefCallStatement(stmt) {
        this.instantiateExpression(stmt.exp);
    }
    instantiateUpdateStatement(stmt) {
        this.instantiateExpression(stmt.vexp);
        for (let i = 0; i < stmt.updates.length; ++i) {
            this.instantiateExpression(stmt.updates[i][1]);
        }
        this.instantiateTypeSignature(stmt.updatetype, this.currentMapping);
        for (let i = 0; i < stmt.updateinfo.length; ++i) {
            this.instantiateTypeSignature(stmt.updateinfo[i].fieldtype, this.currentMapping);
            this.instantiateTypeSignature(stmt.updateinfo[i].etype, this.currentMapping);
        }
    }
    instantiateVarUpdateStatement(stmt) {
        this.instantiateUpdateStatement(stmt);
    }
    instantiateThisUpdateStatement(stmt) {
        this.instantiateUpdateStatement(stmt);
    }
    instantiateSelfUpdateStatement(stmt) {
        assert(false, "Not implemented -- SelfUpdateStatement");
    }
    instantiateHoleStatement(stmt) {
        assert(false, "Not implemented -- HoleStatement");
    }
    instantiateTaskStatusStatement(stmt) {
        assert(false, "Not implemented -- TaskStatusStatement");
    }
    instantiateTaskCheckAndHandleTerminationStatement(stmt) {
        assert(false, "Not implemented -- TaskCheckAndHandleTerminationStatement");
    }
    instantiateTaskYieldStatement(stmt) {
        assert(false, "Not implemented -- TaskYieldStatement");
    }
    instantiateBlockStatement(stmt) {
        for (let i = 0; i < stmt.statements.length; ++i) {
            this.instantiateStatement(stmt.statements[i]);
        }
    }
    instantiateStatement(stmt) {
        switch (stmt.tag) {
            case StatementTag.EmptyStatement: {
                this.instantiateEmptyStatement(stmt);
                break;
            }
            case StatementTag.VariableDeclarationStatement: {
                this.instantiateVariableDeclarationStatement(stmt);
                break;
            }
            case StatementTag.VariableMultiDeclarationStatement: {
                this.instantiateVariableMultiDeclarationStatement(stmt);
                break;
            }
            case StatementTag.VariableInitializationStatement: {
                this.instantiateVariableInitializationStatement(stmt);
                break;
            }
            case StatementTag.VariableMultiInitializationStatement: {
                this.instantiateVariableMultiInitializationStatement(stmt);
                break;
            }
            case StatementTag.VariableAssignmentStatement: {
                this.instantiateVariableAssignmentStatement(stmt);
                break;
            }
            case StatementTag.VariableMultiAssignmentStatement: {
                this.instantiateVariableMultiAssignmentStatement(stmt);
                break;
            }
            case StatementTag.ReturnVoidStatement: {
                this.instantiateReturnVoidStatement(stmt);
                break;
            }
            case StatementTag.ReturnSingleStatement: {
                this.instantiateReturnSingleStatement(stmt);
                break;
            }
            case StatementTag.ReturnMultiStatement: {
                this.instantiateReturnMultiStatement(stmt);
                break;
            }
            case StatementTag.IfStatement: {
                this.instantiateIfStatement(stmt);
                break;
            }
            case StatementTag.IfElseStatement: {
                this.instantiateIfElseStatement(stmt);
                break;
            }
            case StatementTag.IfElifElseStatement: {
                this.instantiateIfElifElseStatement(stmt);
                break;
            }
            case StatementTag.SwitchStatement: {
                this.instantiateSwitchStatement(stmt);
                break;
            }
            case StatementTag.MatchStatement: {
                this.instantiateMatchStatement(stmt);
                break;
            }
            case StatementTag.DispatchPatternStatement: {
                this.instantiateDispatchPatternStatement(stmt);
                break;
            }
            case StatementTag.DispatchTaskStatement: {
                this.instantiateDispatchTaskStatement(stmt);
                break;
            }
            case StatementTag.AbortStatement: {
                this.instantiateAbortStatement(stmt);
                break;
            }
            case StatementTag.AssertStatement: {
                this.instantiateAssertStatement(stmt);
                break;
            }
            case StatementTag.ValidateStatement: {
                this.instantiateValidateStatement(stmt);
                break;
            }
            case StatementTag.DebugStatement: {
                this.instantiateDebugStatement(stmt);
                break;
            }
            case StatementTag.VoidRefCallStatement: {
                this.instantiateVoidRefCallStatement(stmt);
                break;
            }
            case StatementTag.VarUpdateStatement: {
                this.instantiateVarUpdateStatement(stmt);
                break;
            }
            case StatementTag.ThisUpdateStatement: {
                this.instantiateThisUpdateStatement(stmt);
                break;
            }
            case StatementTag.SelfUpdateStatement: {
                this.instantiateSelfUpdateStatement(stmt);
                break;
            }
            case StatementTag.HoleStatement: {
                this.instantiateHoleStatement(stmt);
                break;
            }
            case StatementTag.TaskStatusStatement: {
                this.instantiateTaskStatusStatement(stmt);
                break;
            }
            case StatementTag.TaskCheckAndHandleTerminationStatement: {
                this.instantiateTaskCheckAndHandleTerminationStatement(stmt);
                break;
            }
            case StatementTag.TaskYieldStatement: {
                this.instantiateTaskYieldStatement(stmt);
                break;
            }
            case StatementTag.BlockStatement: {
                this.instantiateBlockStatement(stmt);
                break;
            }
            default: {
                assert(false, `Unknown statement kind -- ${stmt.tag}`);
            }
        }
    }
    instantiateBodyImplementation(body) {
        if ((body instanceof AbstractBodyImplementation) || (body instanceof PredicateUFBodyImplementation) || (body instanceof BuiltinBodyImplementation)) {
            return;
        }
        if (body instanceof HoleBodyImplementation) {
            if (body.samplesfile !== undefined) {
                this.instantiateExpression(body.samplesfile);
            }
        }
        else if (body instanceof ExpressionBodyImplementation) {
            this.instantiateExpression(body.exp);
        }
        else {
            assert(body instanceof StandardBodyImplementation);
            for (let i = 0; i < body.statements.length; ++i) {
                this.instantiateStatement(body.statements[i]);
            }
        }
    }
    instantiateRequires(requires) {
        for (let i = 0; i < requires.length; ++i) {
            const precond = requires[i];
            this.instantiateChkLogicExpression(precond.exp);
        }
    }
    instantiateEnsures(eventtype, ensures) {
        if (eventtype !== undefined) {
            this.instantiateTypeSignature(eventtype, this.currentMapping);
        }
        for (let i = 0; i < ensures.length; ++i) {
            const postcond = ensures[i];
            this.instantiateChkLogicExpression(postcond.exp);
        }
    }
    instantiateInvariants(invariants) {
        for (let i = 0; i < invariants.length; ++i) {
            const inv = invariants[i];
            this.instantiateChkLogicExpression(inv.exp);
        }
    }
    instantiateValidates(validates) {
        for (let i = 0; i < validates.length; ++i) {
            const validate = validates[i];
            this.instantiateChkLogicExpression(validate.exp);
        }
    }
    instantiateExplicitInvokeDeclSignature(idecl) {
        for (let i = 0; i < idecl.params.length; ++i) {
            const p = idecl.params[i];
            this.instantiateTypeSignature(p.type, this.currentMapping);
            if (p.optDefaultValue !== undefined) {
                this.instantiateExpression(p.optDefaultValue);
            }
        }
        this.instantiateTypeSignature(idecl.resultType, this.currentMapping);
    }
    instantiateExplicitInvokeDeclMetaData(idecl, eventtype) {
        this.instantiateRequires(idecl.preconditions);
        this.instantiateEnsures(eventtype, idecl.postconditions);
    }
    instantiateNamespaceFunctionDecl(ns, fdecl) {
        this.instantiateNamespaceDeclaration(ns);
        this.currentMapping = undefined;
        this.lambdamap = new Map();
        this.callinstmap = new Map();
        if (fdecl.function.terms.length !== 0) {
            let tmap = new Map();
            fdecl.function.terms.forEach((t, ii) => {
                tmap.set(t.name, fdecl.instantiation[ii]);
            });
            this.currentMapping = TemplateNameMapper.createInitialMapping(tmap);
        }
        this.currentLambdaMapping = new Map();
        for (let i = 0; i < fdecl.lambdas.length; ++i) {
            this.currentLambdaMapping.set(fdecl.lambdas[i].pname, fdecl.lambdas[i].psigkey);
        }
        this.instantiateExplicitInvokeDeclSignature(fdecl.function);
        this.instantiateExplicitInvokeDeclMetaData(fdecl.function, undefined);
        this.instantiateBodyImplementation(fdecl.function.body);
        const cnns = this.currentNSInstantiation;
        const rkey = computeResolveKeyForInvoke(fdecl.function.name, fdecl.function.terms.length, fdecl.function.params.some((p) => p.pkind !== undefined), fdecl.function.params.some((p) => p.type instanceof LambdaTypeSignature));
        fdecl.function.resolvename = rkey;
        if (!cnns.functionbinds.has(rkey)) {
            cnns.functionbinds.set(rkey, []);
        }
        const ikey = computeInvokeKeyForNamespaceFunction(ns, fdecl.function, fdecl.instantiation, fdecl.lambdas);
        cnns.functionbinds.get(rkey).push(new InvokeInstantiationInfo(ikey, this.currentMapping, fdecl.lambdas, this.lambdamap, this.callinstmap, undefined));
        this.currentMapping = undefined;
        this.currentLambdaMapping = undefined;
        this.lambdamap = new Map();
        this.callinstmap = new Map();
    }
    instantiateTypeFunctionDecl(tdecl, fdecl) {
        const nskey = tdecl.ns.emit();
        this.currentNSInstantiation = this.instantiation.find((nsi) => nsi.ns.emit() === nskey);
        const typeinst = this.currentNSInstantiation.typebinds.get(tdecl.name).find((ti) => ti.tkey === fdecl.type.tkeystr);
        this.currentMapping = undefined;
        this.lambdamap = new Map();
        this.callinstmap = new Map();
        if (fdecl.function.terms.length === 0) {
            this.currentMapping = typeinst.binds;
        }
        else {
            let tmap = new Map();
            fdecl.function.terms.forEach((t, ii) => {
                tmap.set(t.name, fdecl.instantiation[ii]);
            });
            this.currentMapping = TemplateNameMapper.tryMerge(typeinst.binds, TemplateNameMapper.createInitialMapping(tmap));
        }
        this.currentLambdaMapping = new Map();
        for (let i = 0; i < fdecl.lambdas.length; ++i) {
            this.currentLambdaMapping.set(fdecl.lambdas[i].pname, fdecl.lambdas[i].psigkey);
        }
        this.instantiateExplicitInvokeDeclSignature(fdecl.function);
        this.instantiateExplicitInvokeDeclMetaData(fdecl.function, undefined);
        this.instantiateBodyImplementation(fdecl.function.body);
        const rkey = computeResolveKeyForInvoke(fdecl.function.name, fdecl.function.terms.length, fdecl.function.params.some((p) => p.pkind !== undefined), fdecl.function.params.some((p) => p.type instanceof LambdaTypeSignature));
        fdecl.function.resolvename = rkey;
        if (!typeinst.functionbinds.has(rkey)) {
            typeinst.functionbinds.set(rkey, []);
        }
        const ikey = computeInvokeKeyForTypeFunction(fdecl.type, fdecl.function, fdecl.instantiation, fdecl.lambdas);
        typeinst.functionbinds.get(rkey).push(new InvokeInstantiationInfo(ikey, this.currentMapping, fdecl.lambdas, this.lambdamap, this.callinstmap, undefined));
        this.currentMapping = undefined;
        this.currentLambdaMapping = undefined;
        this.lambdamap = new Map();
        this.callinstmap = new Map();
    }
    instantiateMethodDecl(tdecl, mdecl) {
        const nskey = tdecl.ns.emit();
        this.currentNSInstantiation = this.instantiation.find((nsi) => nsi.ns.emit() === nskey);
        const typeinst = this.currentNSInstantiation.typebinds.get(tdecl.name).find((ti) => ti.tkey === mdecl.type.tkeystr);
        this.currentMapping = undefined;
        this.lambdamap = new Map();
        this.callinstmap = new Map();
        if (mdecl.method.terms.length === 0) {
            this.currentMapping = typeinst.binds;
        }
        else {
            let tmap = new Map();
            mdecl.method.terms.forEach((t, ii) => {
                tmap.set(t.name, mdecl.instantiation[ii]);
            });
            this.currentMapping = TemplateNameMapper.tryMerge(typeinst.binds, TemplateNameMapper.createInitialMapping(tmap));
        }
        this.currentLambdaMapping = new Map();
        for (let i = 0; i < mdecl.lambdas.length; ++i) {
            this.currentLambdaMapping.set(mdecl.lambdas[i].pname, mdecl.lambdas[i].psigkey);
        }
        this.instantiateExplicitInvokeDeclSignature(mdecl.method);
        this.instantiateExplicitInvokeDeclMetaData(mdecl.method, undefined);
        this.instantiateBodyImplementation(mdecl.method.body);
        const rkey = computeResolveKeyForInvoke(mdecl.method.name, mdecl.method.terms.length, mdecl.method.params.some((p) => p.pkind !== undefined), mdecl.method.params.some((p) => p.type instanceof LambdaTypeSignature));
        mdecl.method.resolvename = rkey;
        if (!typeinst.methodbinds.has(rkey)) {
            typeinst.methodbinds.set(rkey, []);
        }
        const ikey = computeInvokeKeyForTypeMethod(mdecl.type, mdecl.method, mdecl.instantiation, mdecl.lambdas);
        typeinst.methodbinds.get(rkey).push(new InvokeInstantiationInfo(ikey, this.currentMapping, mdecl.lambdas, this.lambdamap, this.callinstmap, mdecl.prepostikey));
        this.currentMapping = undefined;
        this.currentLambdaMapping = undefined;
        this.lambdamap = new Map();
        this.callinstmap = new Map();
    }
    instantiateTaskMethodDecl(tdecl, mdecl) {
        assert(false, "Not implemented -- instantiateTaskMethodDecl");
    }
    instantiateTaskActionDecl(tdecl, mdecl) {
        assert(false, "Not implemented -- instantiateTaskActionDecl");
    }
    instantiateConstMemberDecls(tdecl, mdecls) {
        for (let i = 0; i < mdecls.length; ++i) {
            const m = mdecls[i];
            this.instantiateTypeSignature(m.declaredType, this.currentMapping);
            this.instantiateExpression(m.value);
        }
    }
    instantiateMemberFieldDecls(fdecls) {
        for (let i = 0; i < fdecls.length; ++i) {
            const f = fdecls[i];
            this.instantiateTypeSignature(f.declaredType, this.currentMapping);
            if (f.defaultValue !== undefined) {
                this.instantiateExpression(f.defaultValue);
            }
        }
    }
    instantiateProvides(provides) {
        for (let i = 0; i < provides.length; ++i) {
            const p = provides[i];
            this.instantiateTypeSignature(p, this.currentMapping);
        }
    }
    instantiateAbstractNominalTypeDeclHelper(pdecl, terms, optfdecls, optreqtypes) {
        this.currentMapping = undefined;
        if (terms.length !== 0) {
            let tmap = new Map();
            terms.forEach((t, ii) => {
                tmap.set(t, pdecl.instantiation[ii]);
            });
            this.currentMapping = TemplateNameMapper.createInitialMapping(tmap);
        }
        this.instantiateProvides(pdecl.type.provides);
        if (optreqtypes !== undefined) {
            for (let i = 0; i < optreqtypes.length; ++i) {
                this.instantiateTypeSignature(optreqtypes[i], this.currentMapping);
            }
        }
        this.lambdamap = new Map();
        this.callinstmap = new Map();
        //make sure all of the invariants on this typecheck
        this.instantiateInvariants(pdecl.type.invariants);
        this.instantiateValidates(pdecl.type.validates);
        this.instantiateConstMemberDecls(pdecl.type, pdecl.type.consts);
        if (optfdecls !== undefined) {
            this.instantiateMemberFieldDecls(optfdecls);
        }
        const cnns = this.currentNSInstantiation;
        if (!cnns.typebinds.has(pdecl.type.name)) {
            cnns.typebinds.set(pdecl.type.name, []);
        }
        const bbl = cnns.typebinds.get(pdecl.type.name);
        if (terms.length === 0) {
            bbl.push(new TypeInstantiationInfo(pdecl.tkey, pdecl.tsig, undefined, new Map(), new Map(), this.lambdamap, this.callinstmap));
        }
        else {
            bbl.push(new TypeInstantiationInfo(pdecl.tkey, pdecl.tsig, this.currentMapping, new Map(), new Map(), this.lambdamap, this.callinstmap));
            this.currentMapping = undefined;
        }
        this.lambdamap = new Map();
        this.callinstmap = new Map();
    }
    instantiateEnumTypeDecl(pdecl) {
        this.instantiateAbstractNominalTypeDeclHelper(pdecl, [], undefined, undefined);
    }
    instantiateTypedeclTypeDecl(tdecl, pdecl) {
        this.instantiateAbstractNominalTypeDeclHelper(pdecl, [], undefined, [tdecl.valuetype]);
        if (tdecl.optofexp !== undefined) {
            this.instantiateExpression(tdecl.optofexp);
        }
    }
    instantiateInteralSimpleTypeDeclHelper(pdecl, terms, optreqtypes) {
        this.instantiateAbstractNominalTypeDeclHelper(pdecl, terms, undefined, optreqtypes);
    }
    instantiatePrimitiveEntityTypeDecl(pdecl) {
        this.instantiateInteralSimpleTypeDeclHelper(pdecl, [], undefined);
    }
    instantiateOkTypeDecl(pdecl) {
        const stypes = [
            new NominalTypeSignature(pdecl.type.sinfo, undefined, this.assembly.getCoreNamespace().typedecls.find((td) => td.name === "Result"), pdecl.instantiation),
        ];
        this.instantiateInteralSimpleTypeDeclHelper(pdecl, ["T", "E"], stypes);
    }
    instantiateFailTypeDecl(pdecl) {
        const stypes = [
            new NominalTypeSignature(pdecl.type.sinfo, undefined, this.assembly.getCoreNamespace().typedecls.find((td) => td.name === "Result"), pdecl.instantiation),
        ];
        this.instantiateInteralSimpleTypeDeclHelper(pdecl, ["T", "E"], stypes);
    }
    instantiateAPIErrorTypeDecl(pdecl) {
        const stypes = [
            new NominalTypeSignature(pdecl.type.sinfo, undefined, this.assembly.getCoreNamespace().typedecls.find((td) => td.name === "APIResult"), pdecl.instantiation),
        ];
        this.instantiateInteralSimpleTypeDeclHelper(pdecl, ["T", "E"], stypes);
    }
    instantiateAPIRejectedTypeDecl(pdecl) {
        const stypes = [
            new NominalTypeSignature(pdecl.type.sinfo, undefined, this.assembly.getCoreNamespace().typedecls.find((td) => td.name === "APIResult"), pdecl.instantiation),
        ];
        this.instantiateInteralSimpleTypeDeclHelper(pdecl, ["T", "E"], stypes);
    }
    instantiateAPIDeniedTypeDecl(pdecl) {
        const stypes = [
            new NominalTypeSignature(pdecl.type.sinfo, undefined, this.assembly.getCoreNamespace().typedecls.find((td) => td.name === "APIResult"), pdecl.instantiation),
        ];
        this.instantiateInteralSimpleTypeDeclHelper(pdecl, ["T", "E"], stypes);
    }
    instantiateAPIFlaggedTypeDecl(pdecl) {
        const stypes = [
            new NominalTypeSignature(pdecl.type.sinfo, undefined, this.assembly.getCoreNamespace().typedecls.find((td) => td.name === "APIResult"), pdecl.instantiation),
        ];
        this.instantiateInteralSimpleTypeDeclHelper(pdecl, ["T", "E"], stypes);
    }
    instantiateAPISuccessTypeDecl(pdecl) {
        const stypes = [
            new NominalTypeSignature(pdecl.type.sinfo, undefined, this.assembly.getCoreNamespace().typedecls.find((td) => td.name === "APIResult"), pdecl.instantiation),
        ];
        this.instantiateInteralSimpleTypeDeclHelper(pdecl, ["T", "E"], stypes);
    }
    instantiateSomeTypeDecl(pdecl) {
        this.instantiateInteralSimpleTypeDeclHelper(pdecl, ["T"], undefined);
    }
    instantiateMapEntryTypeDecl(pdecl) {
        this.instantiateInteralSimpleTypeDeclHelper(pdecl, ["K", "V"], undefined);
    }
    instantiateListTypeDecl(pdecl) {
        this.instantiateInteralSimpleTypeDeclHelper(pdecl, ["T"], undefined);
    }
    instantiateStackTypeDecl(pdecl) {
        this.instantiateInteralSimpleTypeDeclHelper(pdecl, ["T"], undefined);
    }
    instantiateQueueTypeDecl(pdecl) {
        this.instantiateInteralSimpleTypeDeclHelper(pdecl, ["T"], undefined);
    }
    instantiateSetTypeDecl(pdecl) {
        this.instantiateInteralSimpleTypeDeclHelper(pdecl, ["T"], undefined);
    }
    instantiateMapTypeDecl(tdecl, pdecl) {
        const metype = [
            new NominalTypeSignature(tdecl.sinfo, undefined, this.assembly.getCoreNamespace().typedecls.find((td) => td.name === "MapEntry"), pdecl.instantiation)
        ];
        this.instantiateInteralSimpleTypeDeclHelper(pdecl, ["K", "V"], metype);
    }
    instantiateEventListTypeDecl(pdecl) {
        this.instantiateInteralSimpleTypeDeclHelper(pdecl, ["T"], undefined);
    }
    instantiateEntityTypeDecl(tdecl, pdecl) {
        this.instantiateAbstractNominalTypeDeclHelper(pdecl, tdecl.terms.map((tt) => tt.name), tdecl.fields, undefined);
    }
    instantiateOptionTypeDecl(tdecl, pdecl) {
        const stypes = [
            this.getWellKnownType("None"),
            new NominalTypeSignature(tdecl.sinfo, undefined, this.assembly.getCoreNamespace().typedecls.find((td) => td.name === "Some"), pdecl.instantiation)
        ];
        this.instantiateInteralSimpleTypeDeclHelper(pdecl, ["T"], stypes);
    }
    instantiateResultTypeDecl(tdecl, pdecl) {
        const stypes = [
            new NominalTypeSignature(tdecl.sinfo, undefined, tdecl.nestedEntityDecls[0], pdecl.instantiation),
            new NominalTypeSignature(tdecl.sinfo, undefined, tdecl.nestedEntityDecls[1], pdecl.instantiation)
        ];
        this.instantiateInteralSimpleTypeDeclHelper(pdecl, ["T", "E"], stypes);
    }
    instantiateAPIResultTypeDecl(tdecl, pdecl) {
        const stypes = [
            new NominalTypeSignature(tdecl.sinfo, undefined, tdecl.nestedEntityDecls[0], pdecl.instantiation),
            new NominalTypeSignature(tdecl.sinfo, undefined, tdecl.nestedEntityDecls[1], pdecl.instantiation),
            new NominalTypeSignature(tdecl.sinfo, undefined, tdecl.nestedEntityDecls[2], pdecl.instantiation),
            new NominalTypeSignature(tdecl.sinfo, undefined, tdecl.nestedEntityDecls[3], pdecl.instantiation),
            new NominalTypeSignature(tdecl.sinfo, undefined, tdecl.nestedEntityDecls[4], pdecl.instantiation)
        ];
        this.instantiateInteralSimpleTypeDeclHelper(pdecl, ["T", "E"], stypes);
    }
    instantiateConceptTypeDecl(tdecl, pdecl) {
        this.instantiateAbstractNominalTypeDeclHelper(pdecl, tdecl.terms.map((tt) => tt.name), tdecl.fields, undefined);
    }
    instantiateDatatypeMemberEntityTypeDecl(tdecl, pdecl) {
        this.instantiateAbstractNominalTypeDeclHelper(pdecl, tdecl.terms.map((tt) => tt.name), tdecl.fields, undefined);
    }
    instantiateDatatypeTypeDecl(tdecl, pdecl) {
        const stypes = tdecl.associatedMemberEntityDecls.map((dd) => new NominalTypeSignature(tdecl.sinfo, undefined, dd, pdecl.instantiation));
        this.instantiateAbstractNominalTypeDeclHelper(pdecl, tdecl.terms.map((tt) => tt.name), tdecl.fields, stypes);
    }
    instantiateConfigsurationParameters(tconfig) {
        assert(false, "Not implemented -- instantiateEnvironmentVariableInformation");
    }
    instantiatestatusinfo(status) {
        assert(false, "Not implemented -- instantiateStatusInformation");
    }
    instantiateenvreqs(envreqs) {
        assert(false, "Not implemented -- instantiateEnvironmentRequirements");
    }
    instantiateresourcereqs(resourcereqs) {
        assert(false, "Not implemented -- instantiateResourceRequirements");
    }
    instantiateeventinfo(eventinfo) {
        assert(false, "Not implemented -- instantiateEventInformation");
    }
    instantiateAPIDecl(adecl) {
        assert(false, "Not implemented -- checkAPIDecl");
    }
    instantiateAgentDecl(adecl) {
        assert(false, "Not implemented -- checkAgentDecl");
    }
    instantiateTaskDecl(tdecl, pdecl) {
        this.currentMapping = undefined;
        if (tdecl.terms.length !== 0) {
            let tmap = new Map();
            tdecl.terms.forEach((t, ii) => {
                tmap.set(tdecl.name, pdecl.instantiation[ii]);
            });
            this.currentMapping = TemplateNameMapper.createInitialMapping(tmap);
        }
        this.instantiateProvides(pdecl.type.provides);
        this.lambdamap = new Map();
        this.callinstmap = new Map();
        //make sure all of the invariants on this typecheck
        this.instantiateInvariants(pdecl.type.invariants);
        this.instantiateValidates(pdecl.type.validates);
        this.instantiateConstMemberDecls(pdecl.type, pdecl.type.consts);
        this.instantiateMemberFieldDecls(tdecl.fields);
        this.instantiateConfigsurationParameters(tdecl.configs);
        this.instantiatestatusinfo(tdecl.statusinfo);
        this.instantiateenvreqs(tdecl.envreqs);
        this.instantiateresourcereqs(tdecl.resourcereqs);
        this.instantiateeventinfo(tdecl.eventinfo);
        const cnns = this.currentNSInstantiation;
        if (!cnns.typebinds.has(pdecl.type.name)) {
            cnns.typebinds.set(pdecl.type.name, []);
        }
        const bbl = cnns.typebinds.get(pdecl.type.name);
        if (tdecl.terms.length === 0) {
            bbl.push(new TypeInstantiationInfo(pdecl.tkey, pdecl.tsig, undefined, new Map(), new Map(), this.lambdamap, this.callinstmap));
        }
        else {
            bbl.push(new TypeInstantiationInfo(pdecl.tkey, pdecl.tsig, this.currentMapping, new Map(), new Map(), this.lambdamap, this.callinstmap));
            this.currentMapping = undefined;
        }
        this.lambdamap = new Map();
        this.callinstmap = new Map();
    }
    instantiateNamespaceConstDecls(ns, cdecls) {
        this.instantiateNamespaceDeclaration(ns);
        this.lambdamap = new Map();
        this.callinstmap = new Map();
        for (let i = 0; i < cdecls.length; ++i) {
            const m = cdecls[i];
            this.instantiateTypeSignature(m.declaredType, this.currentMapping);
            this.instantiateExpression(m.value);
        }
        this.lambdamap.forEach((value, key) => {
            this.currentNSInstantiation.lambdacons.set(key, value);
        });
        this.currentNSInstantiation.monoinvids.forEach((value, key) => {
            this.currentNSInstantiation.monoinvids.set(key, value);
        });
        this.lambdamap = new Map();
        this.callinstmap = new Map();
    }
    instantiateNamespaceTypeDecl(ns, pdecl) {
        this.instantiateNamespaceDeclaration(ns);
        const tt = pdecl.type;
        if (tt instanceof EnumTypeDecl) {
            this.instantiateEnumTypeDecl(pdecl);
        }
        else if (tt instanceof TypedeclTypeDecl) {
            this.instantiateTypedeclTypeDecl(tt, pdecl);
        }
        else if (tt instanceof PrimitiveEntityTypeDecl) {
            this.instantiatePrimitiveEntityTypeDecl(pdecl);
        }
        else if (tt instanceof OkTypeDecl) {
            this.instantiateOkTypeDecl(pdecl);
        }
        else if (tt instanceof FailTypeDecl) {
            this.instantiateFailTypeDecl(pdecl);
        }
        else if (tt instanceof APIErrorTypeDecl) {
            this.instantiateAPIErrorTypeDecl(pdecl);
        }
        else if (tt instanceof APIRejectedTypeDecl) {
            this.instantiateAPIRejectedTypeDecl(pdecl);
        }
        else if (tt instanceof APIDeniedTypeDecl) {
            this.instantiateAPIDeniedTypeDecl(pdecl);
        }
        else if (tt instanceof APIFlaggedTypeDecl) {
            this.instantiateAPIFlaggedTypeDecl(pdecl);
        }
        else if (tt instanceof APISuccessTypeDecl) {
            this.instantiateAPISuccessTypeDecl(pdecl);
        }
        else if (tt instanceof SomeTypeDecl) {
            this.instantiateSomeTypeDecl(pdecl);
        }
        else if (tt instanceof MapEntryTypeDecl) {
            this.instantiateMapEntryTypeDecl(pdecl);
        }
        else if (tt instanceof ListTypeDecl) {
            this.instantiateListTypeDecl(pdecl);
        }
        else if (tt instanceof StackTypeDecl) {
            this.instantiateStackTypeDecl(pdecl);
        }
        else if (tt instanceof QueueTypeDecl) {
            this.instantiateQueueTypeDecl(pdecl);
        }
        else if (tt instanceof SetTypeDecl) {
            this.instantiateSetTypeDecl(pdecl);
        }
        else if (tt instanceof MapTypeDecl) {
            this.instantiateMapTypeDecl(tt, pdecl);
        }
        else if (tt instanceof EventListTypeDecl) {
            this.instantiateEventListTypeDecl(pdecl);
        }
        else if (tt instanceof EntityTypeDecl) {
            this.instantiateEntityTypeDecl(tt, pdecl);
        }
        else if (tt instanceof OptionTypeDecl) {
            this.instantiateOptionTypeDecl(tt, pdecl);
        }
        else if (tt instanceof ResultTypeDecl) {
            this.instantiateResultTypeDecl(tt, pdecl);
        }
        else if (tt instanceof APIResultTypeDecl) {
            this.instantiateAPIResultTypeDecl(tt, pdecl);
        }
        else if (tt instanceof ConceptTypeDecl) {
            this.instantiateConceptTypeDecl(tt, pdecl);
            if (tt.terms.length === 0) {
                const ttsig = new NominalTypeSignature(SourceInfo.implicitSourceInfo(), undefined, tt, []);
                const ntpt = ns.typedecls.filter((tt) => tt.terms.length === 0 && tt.saturatedProvides.some((sp) => sp.tkeystr === ttsig.tkeystr));
                for (let i = 0; i < ntpt.length; ++i) {
                    const nnsig = new NominalTypeSignature(SourceInfo.implicitSourceInfo(), undefined, ntpt[i], []);
                    this.instantiateTypeSignature(nnsig, undefined);
                }
            }
        }
        else if (tt instanceof DatatypeMemberEntityTypeDecl) {
            this.instantiateDatatypeMemberEntityTypeDecl(tt, pdecl);
        }
        else if (tt instanceof DatatypeTypeDecl) {
            this.instantiateDatatypeTypeDecl(tt, pdecl);
        }
        else {
            assert(false, "Unknown type decl kind");
        }
    }
    instantiateNamespaceDeclaration(decl) {
        const nskey = decl.fullnamespace.emit();
        const nns = this.instantiation.find((nsi) => nsi.ns.emit() === nskey);
        if (nns !== undefined) {
            this.currentNSInstantiation = nns;
        }
        else {
            this.currentNSInstantiation = new NamespaceInstantiationInfo(decl.fullnamespace);
            this.instantiation.push(this.currentNSInstantiation);
        }
    }
    shouldInstantiateAsRootType(tdecl) {
        return tdecl.terms.length === 0 && tdecl.attributes.find((attr) => attr.name === "public") !== undefined;
    }
    shouldInstantiateAsRootInvoke(idecl) {
        return idecl.terms.length === 0 && idecl.attributes.find((attr) => attr.name === "public") !== undefined;
    }
    instantiateRootNamespaceDeclaration(decl) {
        this.instantiateNamespaceConstDecls(decl, decl.consts);
        for (let i = 0; i < decl.functions.length; ++i) {
            if (this.shouldInstantiateAsRootInvoke(decl.functions[i])) {
                const ikey = computeInvokeKeyForNamespaceFunction(decl, decl.functions[i], [], []);
                this.pendingNamespaceFunctions.push(new PendingNamespaceFunction(decl, decl.functions[i], [], [], ikey));
            }
        }
        for (let i = 0; i < decl.typedecls.length; ++i) {
            if (this.shouldInstantiateAsRootType(decl.typedecls[i])) {
                const tsig = new NominalTypeSignature(SourceInfo.implicitSourceInfo(), undefined, decl.typedecls[i], []);
                this.pendingNominalTypeDecls.push(new PendingNominalTypeDecl(tsig.tkeystr, tsig, decl.typedecls[i], []));
            }
        }
        for (let i = 0; i < decl.apis.length; ++i) {
            this.instantiateAPIDecl(decl.apis[i]);
        }
        for (let i = 0; i < decl.agents.length; ++i) {
            this.instantiateAgentDecl(decl.agents[i]);
        }
        for (let i = 0; i < decl.tasks.length; ++i) {
            if (this.shouldInstantiateAsRootType(decl.typedecls[i])) {
                const tsig = new NominalTypeSignature(SourceInfo.implicitSourceInfo(), undefined, decl.typedecls[i], []);
                this.pendingNominalTypeDecls.push(new PendingNominalTypeDecl(tsig.tkeystr, tsig, decl.typedecls[i], []));
            }
        }
        for (let i = 0; i < decl.subns.length; ++i) {
            this.instantiateRootNamespaceDeclaration(decl.subns[i]);
        }
    }
    shouldInstantiateAsRootInvokeForTest(idecl) {
        return idecl.terms.length === 0 && (idecl.fkind === "chktest" || idecl.fkind === "errtest" || idecl.fkind === "example");
    }
    instantiateRootNamespaceDeclarationForTest(decl) {
        for (let i = 0; i < decl.functions.length; ++i) {
            if (this.shouldInstantiateAsRootInvokeForTest(decl.functions[i])) {
                const ikey = computeInvokeKeyForNamespaceFunction(decl, decl.functions[i], [], []);
                this.pendingNamespaceFunctions.push(new PendingNamespaceFunction(decl, decl.functions[i], [], [], ikey));
            }
        }
        for (let i = 0; i < decl.subns.length; ++i) {
            this.instantiateRootNamespaceDeclarationForTest(decl.subns[i]);
        }
    }
    hasPendingWork() {
        if (this.pendingNominalTypeDecls.length !== 0) {
            return true;
        }
        return this.pendingNamespaceFunctions.length !== 0 || this.pendingTypeFunctions.length !== 0 || this.pendingTypeMethods.length !== 0;
    }
    static loadWellKnownType(assembly, name, wellknownTypes) {
        const ccore = assembly.getCoreNamespace();
        const tdecl = ccore.typedecls.find((td) => td.name === name);
        assert(tdecl !== undefined, "Failed to find well known type");
        wellknownTypes.set(name, new NominalTypeSignature(tdecl.sinfo, undefined, tdecl, []));
    }
    static computeInstantiations(assembly, istesting, roonts) {
        let wellknownTypes = new Map();
        wellknownTypes.set("Void", new VoidTypeSignature(SourceInfo.implicitSourceInfo()));
        Monomorphizer.loadWellKnownType(assembly, "None", wellknownTypes);
        Monomorphizer.loadWellKnownType(assembly, "Some", wellknownTypes);
        Monomorphizer.loadWellKnownType(assembly, "Bool", wellknownTypes);
        Monomorphizer.loadWellKnownType(assembly, "Int", wellknownTypes);
        Monomorphizer.loadWellKnownType(assembly, "Nat", wellknownTypes);
        Monomorphizer.loadWellKnownType(assembly, "ChkInt", wellknownTypes);
        Monomorphizer.loadWellKnownType(assembly, "ChkNat", wellknownTypes);
        Monomorphizer.loadWellKnownType(assembly, "Rational", wellknownTypes);
        Monomorphizer.loadWellKnownType(assembly, "Float", wellknownTypes);
        Monomorphizer.loadWellKnownType(assembly, "Decimal", wellknownTypes);
        Monomorphizer.loadWellKnownType(assembly, "DecimalDegree", wellknownTypes);
        Monomorphizer.loadWellKnownType(assembly, "LatLongCoordinate", wellknownTypes);
        Monomorphizer.loadWellKnownType(assembly, "Complex", wellknownTypes);
        Monomorphizer.loadWellKnownType(assembly, "String", wellknownTypes);
        Monomorphizer.loadWellKnownType(assembly, "CString", wellknownTypes);
        Monomorphizer.loadWellKnownType(assembly, "Regex", wellknownTypes);
        Monomorphizer.loadWellKnownType(assembly, "CRegex", wellknownTypes);
        let iim = new Monomorphizer(assembly, wellknownTypes);
        iim.instantiateTypeSignature(iim.getWellKnownType("None"), undefined);
        iim.instantiateTypeSignature(iim.getWellKnownType("Bool"), undefined);
        if (!istesting) {
            for (let i = 0; i < roonts.length; ++i) {
                const ns = assembly.getToplevelNamespace(roonts[i]);
                iim.instantiateRootNamespaceDeclaration(ns);
            }
        }
        else {
            for (let i = 0; i < roonts.length; ++i) {
                const ns = assembly.getToplevelNamespace(roonts[i]);
                iim.instantiateRootNamespaceDeclarationForTest(ns);
            }
        }
        while (iim.hasPendingWork()) {
            if (iim.pendingNominalTypeDecls.length !== 0) {
                const ntd = iim.pendingNominalTypeDecls[0];
                const ns = assembly.resolveNamespaceDecl(ntd.type.ns.ns);
                if (ntd.type instanceof TaskDecl) {
                    iim.instantiateTaskDecl(ntd.type, ntd);
                }
                else {
                    iim.instantiateNamespaceTypeDecl(ns, ntd);
                }
                iim.completedInstantiations.add(ntd.tkey);
                iim.pendingNominalTypeDecls.shift();
            }
            else {
                if (iim.pendingNamespaceFunctions.length !== 0) {
                    const nfd = iim.pendingNamespaceFunctions[0];
                    iim.instantiateNamespaceFunctionDecl(nfd.namespace, nfd);
                    iim.completedNamespaceFunctions.add(nfd.fkey);
                    iim.pendingNamespaceFunctions.shift();
                }
                else if (iim.pendingTypeFunctions.length !== 0) {
                    const tfd = iim.pendingTypeFunctions[0];
                    iim.instantiateTypeFunctionDecl(tfd.type.decl, tfd);
                    iim.completedTypeFunctions.add(tfd.fkey);
                    iim.pendingTypeFunctions.shift();
                }
                else {
                    const tmd = iim.pendingTypeMethods[0];
                    if (tmd.method instanceof TaskMethodDecl) {
                        iim.instantiateTaskMethodDecl(tmd.type.decl, tmd);
                    }
                    else if (tmd.method instanceof TaskActionDecl) {
                        iim.instantiateTaskActionDecl(tmd.type.decl, tmd);
                    }
                    else {
                        iim.instantiateMethodDecl(tmd.type.decl, tmd);
                    }
                    iim.completedMemberMethods.add(tmd.mkey);
                    iim.pendingTypeMethods.shift();
                }
            }
        }
        return iim.instantiation;
    }
    static computeExecutableInstantiations(assembly, roonts) {
        return Monomorphizer.computeInstantiations(assembly, false, roonts);
    }
    static computeTestInstantiations(assembly, roonts) {
        return Monomorphizer.computeInstantiations(assembly, true, roonts);
    }
}
export { Monomorphizer };
//# sourceMappingURL=monomorphize.js.map