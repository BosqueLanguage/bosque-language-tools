import assert from "node:assert";
import { APIErrorTypeDecl, APIRejectedTypeDecl, APIResultTypeDecl, APISuccessTypeDecl, ConceptTypeDecl, DatatypeMemberEntityTypeDecl, DatatypeTypeDecl, EntityTypeDecl, EnumTypeDecl, FailTypeDecl, EventListTypeDecl, ListTypeDecl, MapEntryTypeDecl, MapTypeDecl, OkTypeDecl, OptionTypeDecl, PrimitiveEntityTypeDecl, QueueTypeDecl, ResultTypeDecl, SetTypeDecl, StackTypeDecl, TypedeclTypeDecl, WELL_KNOWN_EVENTS_VAR_NAME, WELL_KNOWN_RETURN_VAR_NAME, TemplateTermDeclExtraTag, SomeTypeDecl, MAX_SAFE_NAT, MIN_SAFE_INT, MAX_SAFE_INT, MAX_SAFE_CHK_NAT, MIN_SAFE_CHK_INT, MAX_SAFE_CHK_INT, APIDeniedTypeDecl, APIFlaggedTypeDecl, AbstractCollectionTypeDecl, ConstructableTypeDecl, InvokeParameterDecl, AbstractEntityTypeDecl } from "./assembly.js";
import { CodeFormatter, SourceInfo } from "./build_decls.js";
import { AutoTypeSignature, DashResultTypeSignature, EListTypeSignature, ErrorTypeSignature, FormatPathTypeSignature, FormatStringTypeSignature, LambdaParameterSignature, LambdaTypeSignature, NominalTypeSignature, TemplateConstraintScope, TemplateNameMapper, TemplateTypeSignature, VoidTypeSignature } from "./type.js";
import { AbstractBodyImplementation, AccessNamespaceConstantExpression, AccessVariableExpression, BuiltinBodyImplementation, ChkLogicExpressionTag, ConstructorLambdaExpression, ExpressionBodyImplementation, ExpressionTag, FormatStringTextComponent, HoleBodyImplementation, ITestSimpleGuard, LiteralRegexExpression, LiteralSimpleExpression, NamedArgumentValue, PassingArgumentValue, PositionalArgumentValue, PostfixOpTag, PredicateUFBodyImplementation, RValueExpressionTag, SpreadArgumentValue, StandardBodyImplementation, StatementTag, StdArgumentValue, SkipArgumentValue, ITestType, ITestNone, ITestSome, ITestOk, ITestFail, ITestTypeGuard, ITestBinderGuard, TypeTestBindInfo } from "./body.js";
import { SimpleTypeInferContext, TypeEnvironment, TypeResultWRefVarInfoResult, TypeInferContext, VarInfo, EListStyleTypeInferContext } from "./checker_environment.js";
import { TypeCheckerRelations } from "./checker_relations.js";
import { validateStringLiteral, validateCStringLiteral, loadConstAndValidateRESystem, accepts } from "@bosque/jsbrex";
class TypeError {
    constructor(file, line, msg) {
        this.file = file;
        this.line = line;
        this.msg = msg;
    }
}
const CLEAR_FILENAME = "[GLOBAL]";
class TypeChecker {
    constructor(constraints, relations) {
        this.file = CLEAR_FILENAME;
        this.errors = [];
        this.isTaskScope = false;
        this.envDecl = [];
        this.lambdaCtr = 0;
        this.invidCtr = 0;
        this.constraints = constraints;
        this.relations = relations;
    }
    reportError(sinfo, msg) {
        this.errors.push(new TypeError(this.file, sinfo.line, msg));
    }
    checkError(sinfo, cond, msg) {
        if (cond) {
            this.reportError(sinfo, msg);
        }
        return cond;
    }
    doRegexValidation(sinfo, ofexp, inns, input, literalstring) {
        try {
            const [pattern, pns] = this.relations.assembly.resolveConstantRegexExpressionValue(ofexp, inns);
            if (pattern === undefined) {
                this.reportError(sinfo, `Unable to resolve regex pattern -- ${ofexp.emit(true, new CodeFormatter())}`);
            }
            else {
                const isok = accepts(pattern, input, pns);
                this.checkError(sinfo, !isok, `Literal value "${literalstring}" does not match regex -- ${pattern}`);
            }
        }
        catch (e) {
            this.reportError(sinfo, `Invalid regex pattern -- ${e.msg}`);
        }
    }
    /*
    private doGlobValidation(sinfo: SourceInfo, ofexp: LiteralPathItemExpression | AccessNamespaceConstantExpression, inns: string, input: string, literalstring: string): void {
        return; //TODO: implement glob validation
    }
    */
    static safeTypePrint(tsig) {
        return tsig === undefined ? "[undef_type]" : tsig.emit();
    }
    getErrorList() {
        return this.errors;
    }
    getWellKnownType(name) {
        assert(this.relations.wellknowntypes.has(name), `Well known type ${name} not found`);
        return this.relations.wellknowntypes.get(name);
    }
    isVoidType(t) {
        return (t.tkeystr === "Void");
    }
    resolveSizeConstraints(tdecl, rlen) {
        assert(tdecl.optsizerng !== undefined, "size constraints should be defined to call resolveSizeConstraints");
        let min = 0n;
        if (tdecl.optsizerng.min !== undefined) {
            try {
                min = BigInt(tdecl.optsizerng.min.slice(0, -1)); //remove the 'n' at the end
            }
            catch {
                //just ignore the constraint and report error at definition
            }
        }
        let max = BigInt(rlen);
        if (tdecl.optsizerng.max !== undefined) {
            try {
                max = BigInt(tdecl.optsizerng.max.slice(0, -1)); //remove the 'n' at the end
            }
            catch {
                //just ignore the constraint and report error at definition
            }
        }
        return { min: min, max: max };
    }
    parseIntegerRangeBound(sinfo, literal, typeName, minSafe, maxSafe) {
        const numStr = literal.slice(0, -1);
        try {
            const val = BigInt(numStr);
            this.checkError(sinfo, val < minSafe || val > maxSafe, `Range bound ${literal} is outside safe ${typeName} range`);
            return { value: val, ok: true };
        }
        catch {
            this.reportError(sinfo, `Invalid ${typeName} range bound: ${literal}`);
            return { value: 0n, ok: false };
        }
    }
    parseRangeBound(sinfo, literal, typeName) {
        switch (typeName) {
            case "Int":
                return this.parseIntegerRangeBound(sinfo, literal, typeName, MIN_SAFE_INT, MAX_SAFE_INT);
            case "Nat":
                return this.parseIntegerRangeBound(sinfo, literal, typeName, 0n, MAX_SAFE_NAT);
            case "ChkInt":
                return this.parseIntegerRangeBound(sinfo, literal, typeName, MIN_SAFE_CHK_INT, MAX_SAFE_CHK_INT);
            case "ChkNat":
                return this.parseIntegerRangeBound(sinfo, literal, typeName, 0n, MAX_SAFE_CHK_NAT);
            case "Float":
            case "Decimal": {
                const numStr = literal.slice(0, -1);
                const val = Number.parseFloat(numStr);
                if (!Number.isFinite(val)) {
                    this.reportError(sinfo, `Invalid ${typeName} range bound: ${literal}`);
                    return { value: 0, ok: false };
                }
                return { value: val, ok: true };
            }
            case "Rational": {
                const body = literal.slice(0, -1);
                const slashIdx = body.indexOf("/");
                try {
                    const num = BigInt(slashIdx === -1 ? body : body.slice(0, slashIdx));
                    const den = slashIdx === -1 ? 1n : BigInt(body.slice(slashIdx + 1));
                    this.checkError(sinfo, num < MIN_SAFE_CHK_INT || num > MAX_SAFE_CHK_INT, `Rational numerator ${num} is outside safe ChkInt range`);
                    this.checkError(sinfo, den < 1n || den > MAX_SAFE_NAT, `Rational denominator ${den} must be in safe Nat range (>= 1)`);
                    const val = Number(num) / Number(den);
                    if (!Number.isFinite(val)) {
                        this.reportError(sinfo, `Rational range bound overflows: ${literal}`);
                        return { value: 0, ok: false };
                    }
                    return { value: val, ok: true };
                }
                catch {
                    this.reportError(sinfo, `Invalid Rational range bound: ${literal}`);
                    return { value: 0, ok: false };
                }
            }
            case "String":
            case "CString":
                return this.parseIntegerRangeBound(sinfo, literal, typeName, 0n, MAX_SAFE_NAT);
            default: {
                this.reportError(sinfo, `Range constraints not supported for type ${typeName}`);
                return { value: 0, ok: false };
            }
        }
    }
    checkTypeDeclOfStringRestrictions(sinfo, tdecl, value) {
        const vs = validateStringLiteral(value.slice(1, -1));
        this.checkError(sinfo, vs === null, `Invalid string literal value ${value}`);
        if (vs !== null && tdecl.optsizerng !== undefined) {
            const sbounds = this.resolveSizeConstraints(tdecl, vs.length);
            this.checkError(sinfo, BigInt(vs.length) < sbounds.min || BigInt(vs.length) > sbounds.max, `String literal length ${vs.length} out of bounds`);
        }
        if (vs !== null && tdecl.optofexp !== undefined) {
            const vexp = this.relations.assembly.resolveValidatorLiteral(tdecl.optofexp);
            if (vexp === undefined || vexp.tag !== ExpressionTag.LiteralUnicodeRegexExpression) {
                this.reportError(sinfo, `Unable to resolve regex validator`);
            }
            else {
                if (!(vexp instanceof LiteralRegexExpression) && !(vexp instanceof AccessNamespaceConstantExpression)) {
                    this.reportError(sinfo, `Invalid regex validator -- expected literal or namespace constant`);
                }
                else {
                    this.doRegexValidation(sinfo, vexp, tdecl.ns.emit(), vs, value.slice(1, -1));
                }
            }
        }
        return vs !== null ? vs : undefined;
    }
    checkTypeDeclOfCStringRestrictions(sinfo, tdecl, value) {
        const vs = validateCStringLiteral(value.slice(1, -1));
        this.checkError(sinfo, vs === null, `Invalid cstring literal value ${value}`);
        if (vs !== null && tdecl.optsizerng !== undefined) {
            const sbounds = this.resolveSizeConstraints(tdecl, vs.length);
            this.checkError(sinfo, BigInt(vs.length) < sbounds.min || BigInt(vs.length) > sbounds.max, `CString literal length ${vs.length} out of bounds`);
        }
        if (vs !== null && tdecl.optofexp !== undefined) {
            const vexp = this.relations.assembly.resolveValidatorLiteral(tdecl.optofexp);
            if (vexp === undefined || vexp.tag !== ExpressionTag.LiteralCRegexExpression) {
                this.reportError(sinfo, `Unable to resolve cregex validator`);
            }
            else {
                if (!(vexp instanceof LiteralRegexExpression) && !(vexp instanceof AccessNamespaceConstantExpression)) {
                    this.reportError(sinfo, `Invalid regex validator -- expected literal or namespace constant`);
                }
                else {
                    this.doRegexValidation(sinfo, vexp, tdecl.ns.emit(), vs, value.slice(1, -1));
                }
            }
        }
        return vs !== null ? vs : undefined;
    }
    /*
    private checkTypeDeclOfPathRestrictions(sinfo: SourceInfo, tdecl: TypedeclTypeDecl, value: string): string | undefined {
        //TODO: should validate with glob here!!!
        const vs = value;
                
        if(vs !== null && tdecl.optofexp !== undefined) {
            const vexp = this.relations.assembly.resolveValidatorLiteral(tdecl.optofexp);

            if(vexp === undefined || vexp.tag !== ExpressionTag.LiteralGlobExpression) {
                this.reportError(sinfo, `Unable to resolve glob validator`);
            }
            else {
                if(!(vexp instanceof LiteralPathItemExpression) && !(vexp instanceof AccessNamespaceConstantExpression)) {
                    this.reportError(sinfo, `Invalid glob validator -- expected literal or namespace constant`);
                }
                else {
                    this.doGlobValidation(sinfo, vexp, tdecl.ns.emit(), vs, value.slice(1, -1));
                }
            }
        }

        return vs !== null ? vs : undefined;
    }
    */
    processITest_None(src, isnot) {
        //!none === some
        if (isnot) {
            const rinfo = this.relations.splitOnSome(src, this.constraints);
            if (rinfo === undefined) {
                this.reportError(src.sinfo, `Unable to some-split type ${src.emit()}`);
                return { bindtrue: undefined, bindfalse: undefined };
            }
            else {
                return { bindtrue: rinfo.overlapSomeT, bindfalse: rinfo.hasnone ? this.getWellKnownType("None") : undefined };
            }
        }
        else {
            const rinfo = this.relations.splitOnNone(src, this.constraints);
            if (rinfo === undefined) {
                this.reportError(src.sinfo, `Unable to none-split type ${src.emit()}`);
                return { bindtrue: undefined, bindfalse: undefined };
            }
            else {
                return { bindtrue: rinfo.hasnone ? this.getWellKnownType("None") : undefined, bindfalse: rinfo.remainSomeT };
            }
        }
    }
    processITest_Some(src, isnot) {
        //!some === none
        if (isnot) {
            const rinfo = this.relations.splitOnNone(src, this.constraints);
            if (rinfo === undefined) {
                this.reportError(src.sinfo, `Unable to none-split type ${src.emit()}`);
                return { bindtrue: undefined, bindfalse: undefined };
            }
            else {
                return { bindtrue: rinfo.hasnone ? this.getWellKnownType("None") : undefined, bindfalse: rinfo.remainSomeT };
            }
        }
        else {
            const rinfo = this.relations.splitOnSome(src, this.constraints);
            if (rinfo === undefined) {
                this.reportError(src.sinfo, `Unable to some-split type ${src.emit()}`);
                return { bindtrue: undefined, bindfalse: undefined };
            }
            else {
                return { bindtrue: rinfo.overlapSomeT, bindfalse: rinfo.hasnone ? this.getWellKnownType("None") : undefined };
            }
        }
    }
    processITest_Ok(src, isnot) {
        //!ok === err
        if (isnot) {
            const rinfo = this.relations.splitOnErr(src, this.constraints);
            if (rinfo === undefined) {
                this.reportError(src.sinfo, `Unable to err-split type ${src.emit()}`);
                return { bindtrue: undefined, bindfalse: undefined };
            }
            else {
                return { bindtrue: rinfo.overlapErrE, bindfalse: rinfo.remainOkT };
            }
        }
        else {
            const rinfo = this.relations.splitOnOk(src, this.constraints);
            if (rinfo === undefined) {
                this.reportError(src.sinfo, `Unable to nothing-split type ${src.emit()}`);
                return { bindtrue: undefined, bindfalse: undefined };
            }
            else {
                return { bindtrue: rinfo.overlapOkT, bindfalse: rinfo.remainErrE };
            }
        }
    }
    processITest_Err(src, isnot) {
        //!err === ok
        if (isnot) {
            const rinfo = this.relations.splitOnOk(src, this.constraints);
            if (rinfo === undefined) {
                this.reportError(src.sinfo, `Unable to err-split type ${src.emit()}`);
                return { bindtrue: undefined, bindfalse: undefined };
            }
            else {
                return { bindtrue: rinfo.overlapOkT, bindfalse: rinfo.remainErrE };
            }
        }
        else {
            const rinfo = this.relations.splitOnErr(src, this.constraints);
            if (rinfo === undefined) {
                this.reportError(src.sinfo, `Unable to nothing-split type ${src.emit()}`);
                return { bindtrue: undefined, bindfalse: undefined };
            }
            else {
                return { bindtrue: rinfo.overlapErrE, bindfalse: rinfo.remainOkT };
            }
        }
    }
    processITest_Type(src, oftype) {
        const rinfo = this.relations.refineType(src, oftype, this.constraints);
        if (rinfo === undefined) {
            this.reportError(src.sinfo, `Unable to some-split type ${src.emit()}`);
            return { ttrue: [], tfalse: [] };
        }
        else {
            return { ttrue: rinfo.overlap, tfalse: rinfo.remain };
        }
    }
    processITestAsBoolean(sinfo, env, src, tt) {
        if (tt instanceof ITestType) {
            if (!this.checkTypeSignature(tt.ttype)) {
                return { ttrue: false, tfalse: false };
            }
            else {
                const tres = this.processITest_Type(src, tt.ttype);
                if (tt.isnot) {
                    return { ttrue: tres.tfalse.length !== 0, tfalse: tres.ttrue.length !== 0 };
                }
                else {
                    return { ttrue: tres.ttrue.length !== 0, tfalse: tres.tfalse.length !== 0 };
                }
            }
        }
        else {
            if (tt instanceof ITestNone) {
                const tres = this.processITest_None(src, tt.isnot);
                return { ttrue: tres.bindtrue !== undefined, tfalse: tres.bindfalse !== undefined };
            }
            else if (tt instanceof ITestSome) {
                const tres = this.processITest_Some(src, tt.isnot);
                return { ttrue: tres.bindtrue !== undefined, tfalse: tres.bindfalse !== undefined };
            }
            else if (tt instanceof ITestOk) {
                const tres = this.processITest_Ok(src, tt.isnot);
                return { ttrue: tres.bindtrue !== undefined, tfalse: tres.bindfalse !== undefined };
            }
            else {
                assert(tt instanceof ITestFail, "missing case in ITest");
                const tres = this.processITest_Err(src, tt.isnot);
                return { ttrue: tres.bindtrue !== undefined, tfalse: tres.bindfalse !== undefined };
            }
        }
    }
    processITestConvertLUB(sinfo, opts, lubtype) {
        const flowlub = this.relations.flowTypeLUB(sinfo, lubtype, opts, this.constraints);
        if (flowlub instanceof ErrorTypeSignature) {
            return lubtype;
        }
        else {
            return flowlub;
        }
    }
    processITestAsConvert(sinfo, env, src, tt) {
        if (tt instanceof ITestType) {
            if (!this.checkTypeSignature(tt.ttype)) {
                return { ttrue: undefined, tfalse: undefined };
            }
            else {
                const tres = this.processITest_Type(src, tt.ttype);
                if (tt.isnot) {
                    const ttrue = tres.tfalse.length !== 0 ? this.processITestConvertLUB(sinfo, tres.tfalse, src) : undefined; //negate takes the remain and lubs to the src
                    const tfalse = tres.ttrue.length !== 0 ? tt.ttype : undefined; //overlap and passes as the user spec type -- does not matter now but short circuiting return will use this
                    return { ttrue: ttrue, tfalse: tfalse };
                }
                else {
                    const ttrue = tres.ttrue.length !== 0 ? tt.ttype : undefined; //always cast to what the user asked for
                    const tfalse = tres.tfalse.length !== 0 ? this.processITestConvertLUB(sinfo, tres.tfalse, src) : undefined; //cast to the LUB of the remaining types (with src as a default option)
                    return { ttrue: ttrue, tfalse: tfalse };
                }
            }
        }
        else {
            if (tt instanceof ITestNone) {
                const tres = this.processITest_None(src, tt.isnot);
                return { ttrue: tres.bindtrue, tfalse: tres.bindfalse };
            }
            else if (tt instanceof ITestSome) {
                const tres = this.processITest_Some(src, tt.isnot);
                return { ttrue: tres.bindtrue, tfalse: tres.bindfalse };
            }
            else if (tt instanceof ITestOk) {
                const tres = this.processITest_Ok(src, tt.isnot);
                return { ttrue: tres.bindtrue, tfalse: tres.bindfalse };
            }
            else {
                assert(tt instanceof ITestFail, "missing case in ITest");
                const tres = this.processITest_Err(src, tt.isnot);
                return { ttrue: tres.bindtrue, tfalse: tres.bindfalse };
            }
        }
    }
    processITestGuardExpression(env, exp, andrefsok) {
        switch (exp.tag) {
            case ExpressionTag.CallRefVariableExpression: {
                return this.checkCallRefVariableExpression(env, exp);
            }
            case ExpressionTag.CallRefThisExpression: {
                return this.checkCallRefThisExpression(env, exp);
            }
            case ExpressionTag.CallRefSelfExpression: {
                return this.checkCallRefSelfExpression(env, exp);
            }
            case ExpressionTag.CallTaskActionExpression: {
                return this.checkCallTaskActionExpression(env, exp);
            }
            default: {
                const ttag = exp.tag;
                if (ttag === ExpressionTag.CallNamespaceFunctionExpression) {
                    return this.checkCallNamespaceFunctionExpression(env, exp, true);
                }
                else if (ttag === ExpressionTag.CallTypeFunctionExpression) {
                    return this.checkCallTypeFunctionExpression(env, exp, true);
                }
                else if (ttag === ExpressionTag.LambdaInvokeExpression) {
                    return this.checkLambdaInvokeExpression(env, exp, true);
                }
                else if (ttag === ExpressionTag.PostfixOpExpression) {
                    return this.checkPostfixOpMaybeRefs(env, exp, undefined);
                }
                else if (ttag === ExpressionTag.PrefixNotOpExpression) {
                    const ueexp = exp;
                    const tte = this.processITestGuardExpression(env, ueexp.exp, false);
                    assert(tte.bbinds.length === 0, "These should be set in the itest part (not the expression part) probably bad nesting");
                    ueexp.opertype = this.resolveUnderlyingType(tte.tsig);
                    ueexp.setType(tte.tsig);
                    return new TypeResultWRefVarInfoResult(tte.tsig, false, false, { ttrue: tte.setcondout.tfalse, tfalse: tte.setcondout.ttrue }, tte.setuncond, tte.usemod, []);
                }
                else if (ttag === ExpressionTag.LogicAndExpression) {
                    const aexps = exp.exps.map((e) => this.processITestGuardExpression(env, e, false));
                    this.checkError(exp.sinfo, !andrefsok, `Nested and-ref expressions are not allowed in guards`);
                    assert(aexps.every((a) => a.bbinds.length === 0), "These should be set in the itest part (not the expression part) probably bad nesting");
                    this.checkError(exp.sinfo, aexps.some((ee) => !this.relations.isBooleanType(ee.tsig)), "One or more sub-expressions in 'and' expression is not a Bool compatible type");
                    const oftype = aexps[0].tsig;
                    this.checkError(exp.sinfo, aexps.some((ee) => ee.tsig !== undefined && ee.tsig.tkeystr !== oftype.tkeystr), "Logic And expressions require all arguments to be of the same (Bool compatible) type");
                    const ft = aexps.every((ee) => this.relations.isBooleanType(ee.tsig) && ee.tsig.tkeystr === oftype.tkeystr) ? oftype : this.getWellKnownType("Bool");
                    exp.setType(ft);
                    const [hasconflicts, res] = TypeResultWRefVarInfoResult.andstates(aexps);
                    this.checkError(exp.sinfo, hasconflicts, "Cannot have multiple ref/mod uses of a variable in 'and' expression");
                    return res;
                }
                else {
                    return TypeResultWRefVarInfoResult.makeSimpleResult(this.checkExpression(env, exp, undefined));
                }
            }
        }
    }
    processITestGuard(sinfo, env, tt, gidx, andrefsok) {
        if (tt instanceof ITestSimpleGuard) {
            return this.processITestGuardExpression(env, tt.exp, andrefsok);
        }
        else if (tt instanceof ITestTypeGuard) {
            const evinfo = this.processITestGuardExpression(env, tt.exp, andrefsok);
            if (evinfo.tsig instanceof ErrorTypeSignature) {
                return TypeResultWRefVarInfoResult.makeSimpleResult(this.getWellKnownType("Bool"));
            }
            else {
                const splits = this.processITestAsBoolean(tt.exp.sinfo, env, evinfo.tsig, tt.itest);
                this.checkError(tt.exp.sinfo, !splits.ttrue, "Test is never true");
                this.checkError(tt.exp.sinfo, !splits.tfalse, "Test is never false");
                return new TypeResultWRefVarInfoResult(this.getWellKnownType("Bool"), false, false, evinfo.setcondout, evinfo.setuncond, evinfo.usemod, evinfo.bbinds);
            }
        }
        else if (tt instanceof ITestBinderGuard) {
            const evinfo = this.processITestGuardExpression(env, tt.exp, andrefsok);
            if (evinfo.tsig instanceof ErrorTypeSignature) {
                return TypeResultWRefVarInfoResult.makeSimpleResult(this.getWellKnownType("Bool"));
            }
            else {
                const splits = this.processITestAsConvert(tt.exp.sinfo, env, evinfo.tsig, tt.itest);
                this.checkError(tt.exp.sinfo, splits.ttrue === undefined, "Test is never true");
                this.checkError(tt.exp.sinfo, splits.tfalse === undefined, "Test is never false");
                const nbind = new TypeTestBindInfo(gidx, tt.bindinfo.srcname, splits.ttrue || evinfo.tsig, splits.tfalse || evinfo.tsig);
                return new TypeResultWRefVarInfoResult(this.getWellKnownType("Bool"), false, false, evinfo.setcondout, evinfo.setuncond, evinfo.usemod, [nbind, ...evinfo.bbinds]);
            }
        }
        else {
            assert(false, "Unknown ITestGuard type"); //TODO check and do binders here!!!
        }
    }
    processITestGuardSet(sinfo, env, tt) {
        const andrefsok = tt.guards.length === 1; //we don't want odd nested and-ref binds
        const grenvs = tt.guards.map((guard, ii) => this.processITestGuard(sinfo, env, guard, ii, andrefsok));
        this.checkError(sinfo, grenvs.some((grenv) => !this.relations.isBooleanType(grenv.tsig)), `Guard expression does not evaluate to boolean`);
        const [hasconflicts, res] = TypeResultWRefVarInfoResult.andstates(grenvs);
        this.checkError(sinfo, hasconflicts, "Cannot have multiple ref/mod uses of a variable in 'and' expression");
        return res;
    }
    checkTemplateInstantiationIsOkWithDecls(sinfo, targs, decls) {
        assert(targs.length === decls.length, "Template instantiation mismatch");
        for (let i = 0; i < targs.length; ++i) {
            const tdecl = decls[i];
            const targ = targs[i];
            if (this.checkError(sinfo, tdecl.tconstraint !== undefined && !this.relations.isSubtypeOf(targ, tdecl.tconstraint, this.constraints), `Template argument ${tdecl.name} is not a subtype of restriction`)) {
                return false;
            }
            if (tdecl.extraTags.length !== 0) {
                if (tdecl.extraTags.includes(TemplateTermDeclExtraTag.KeyType)) {
                    if (this.checkError(sinfo, !this.relations.isKeyType(targ, this.constraints), `Template argument ${tdecl.name} is not a keytype`)) {
                        return false;
                    }
                }
                if (tdecl.extraTags.includes(TemplateTermDeclExtraTag.Numeric)) {
                    if (this.checkError(sinfo, !this.relations.isNumericType(targ, this.constraints), `Template argument ${tdecl.name} is not a numeric type`)) {
                        return false;
                    }
                }
                if (tdecl.extraTags.includes(TemplateTermDeclExtraTag.Equiv)) {
                    if (this.checkError(sinfo, !this.relations.isEquivType(targ, this.constraints), `Template argument ${tdecl.name} is not an equiv type`)) {
                        return false;
                    }
                }
                if (tdecl.extraTags.includes(TemplateTermDeclExtraTag.Mergeable)) {
                    if (this.checkError(sinfo, !this.relations.isMergeableType(targ, this.constraints), `Template argument ${tdecl.name} is not a mergeable type`)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    checkTemplateTypesOnType(sinfo, terms) {
        let allnames = new Set();
        for (let i = 0; i < terms.length; ++i) {
            const terminfo = terms[i];
            this.checkError(sinfo, allnames.has(terminfo.name), `Template type ${terminfo.name} is already defined`);
            allnames.add(terminfo.name);
            if (terminfo.tconstraint !== undefined && this.checkTypeSignature(terminfo.tconstraint)) {
                this.checkError(sinfo, !this.relations.isValidTemplateRestrictionType(terminfo.tconstraint), `Template type ${terminfo.name} is not a valid template restriction type`);
            }
        }
    }
    checkTemplateTypesOnInvoke(sinfo, terms) {
        let allnames = new Set();
        for (let i = 0; i < terms.length; ++i) {
            const terminfo = terms[i];
            this.checkError(sinfo, allnames.has(terminfo.name), `Template type ${terminfo.name} is already defined`);
            allnames.add(terminfo.name);
            if (terminfo.tconstraint !== undefined && this.checkTypeSignature(terminfo.tconstraint)) {
                this.checkError(sinfo, !this.relations.isValidTemplateRestrictionType(terminfo.tconstraint), `Template type ${terminfo.name} is not a valid template restriction type`);
            }
        }
    }
    //Given a type signature -- check that is is well formed and report any issues
    checkTypeSignature(type) {
        if (type instanceof ErrorTypeSignature || type instanceof AutoTypeSignature) {
            return false;
        }
        else if (type instanceof VoidTypeSignature) {
            return true;
        }
        else if (type instanceof TemplateTypeSignature) {
            const resolved = this.constraints.resolveConstraint(type.name);
            if (resolved === undefined) {
                this.reportError(type.sinfo, `Template type ${type.name} is not defined`);
                return false;
            }
            return true;
        }
        else if (type instanceof NominalTypeSignature) {
            const typesok = type.alltermargs.every((targ) => this.checkTypeSignature(targ));
            if (!typesok) {
                return false;
            }
            if (type.decl.isSpecialResultEntity()) {
                if (type.alltermargs.length !== 2) {
                    this.reportError(type.sinfo, `Type ${type.decl.name} expected ${type.decl.terms.length} terms but got ${type.alltermargs.length}`);
                    return false;
                }
            }
            else if (type.decl.isSpecialAPIResultEntity()) {
                if (type.alltermargs.length !== 1) {
                    this.reportError(type.sinfo, `Type ${type.decl.name} expected ${type.decl.terms.length} terms but got ${type.alltermargs.length}`);
                    return false;
                }
            }
            else {
                if (type.alltermargs.length !== type.decl.terms.length) {
                    this.reportError(type.sinfo, `Type ${type.decl.name} expected ${type.decl.terms.length} terms but got ${type.alltermargs.length}`);
                    return false;
                }
                return this.checkTemplateInstantiationIsOkWithDecls(type.sinfo, type.alltermargs, type.decl.terms);
            }
            return true;
        }
        else if (type instanceof EListTypeSignature) {
            return type.entries.every((entry) => this.checkTypeSignature(entry));
        }
        else if (type instanceof DashResultTypeSignature) {
            return type.entries.every((entry) => this.checkTypeSignature(entry));
        }
        else if (type instanceof LambdaTypeSignature) {
            const oksig = type.params.every((pp) => this.checkTypeSignature(pp.type)) && this.checkTypeSignature(type.resultType);
            if (!oksig) {
                return false;
            }
            let refct = 0;
            for (let i = 0; i < type.params.length; ++i) {
                const pp = type.params[i];
                refct += pp.pkind !== undefined ? 1 : 0;
                if (pp.isRestParam && i !== type.params.length - 1) {
                    this.reportError(type.sinfo, `Rest parameter must be the last parameter in the lambda`);
                    return false;
                }
                this.checkError(pp.type.sinfo, pp.pkind === "ref" && !TypeChecker.isTypeUpdatable(pp.type)[0], `Ref parameter must be of an updatable type`);
            }
            if (type.name === "pred" && type.resultType.tkeystr !== "Bool") {
                this.reportError(type.sinfo, `Lambda pred must have a boolean return type`);
                return false;
            }
            return refct <= 1;
        }
        else if (type instanceof FormatStringTypeSignature) {
            return this.checkTypeSignature(type.rtype) && type.terms.every((farg) => this.checkTypeSignature(farg.argtype));
        }
        else if (type instanceof FormatPathTypeSignature) {
            return this.checkTypeSignature(type.rtype) && type.terms.every((farg) => this.checkTypeSignature(farg.argtype));
        }
        else {
            assert(false, "Unknown TypeSignature type");
        }
    }
    checkValueEq(lhsexp, lhs, rhsexp, rhs) {
        if (!(lhs instanceof NominalTypeSignature) || !(rhs instanceof NominalTypeSignature)) {
            return ["err", new ErrorTypeSignature(lhsexp.sinfo, undefined)];
        }
        if ((lhs.decl instanceof OptionTypeDecl) && (rhs.decl instanceof OptionTypeDecl)) {
            return ["err", new ErrorTypeSignature(lhsexp.sinfo, undefined)];
        }
        else if (lhs.decl instanceof OptionTypeDecl) {
            if (rhsexp.tag === ExpressionTag.LiteralNoneExpression) {
                return ["rhsnone", rhs];
            }
            else {
                if (!this.relations.isKeyType(rhs, this.constraints)) {
                    return ["err", new ErrorTypeSignature(rhsexp.sinfo, undefined)];
                }
                else {
                    return this.relations.areSameTypes(rhs, lhs.alltermargs[0]) ? ["rhskeyeqoption", rhs] : ["err", new ErrorTypeSignature(rhsexp.sinfo, undefined)];
                }
            }
        }
        else if (rhs.decl instanceof OptionTypeDecl) {
            if (lhsexp.tag === ExpressionTag.LiteralNoneExpression) {
                return ["lhsnone", lhs];
            }
            else {
                if (!this.relations.isKeyType(lhs, this.constraints)) {
                    return ["err", new ErrorTypeSignature(lhsexp.sinfo, undefined)];
                }
                else {
                    return this.relations.areSameTypes(lhs, rhs.alltermargs[0]) ? ["lhskeyeqoption", lhs] : ["err", new ErrorTypeSignature(lhsexp.sinfo, undefined)];
                }
            }
        }
        else if (lhs.decl instanceof SomeTypeDecl) {
            if (!this.relations.isKeyType(rhs, this.constraints)) {
                return ["err", new ErrorTypeSignature(rhsexp.sinfo, undefined)];
            }
            else {
                return this.relations.areSameTypes(rhs, lhs.alltermargs[0]) ? ["rhskeyeqsome", rhs] : ["err", new ErrorTypeSignature(rhsexp.sinfo, undefined)];
            }
        }
        else if (rhs.decl instanceof SomeTypeDecl) {
            if (!this.relations.isKeyType(lhs, this.constraints)) {
                return ["err", new ErrorTypeSignature(lhsexp.sinfo, undefined)];
            }
            else {
                return this.relations.areSameTypes(lhs, rhs.alltermargs[0]) ? ["lhskeyeqsome", lhs] : ["err", new ErrorTypeSignature(lhsexp.sinfo, undefined)];
            }
        }
        else {
            if (!this.relations.isKeyType(lhs, this.constraints) || !this.relations.isKeyType(rhs, this.constraints)) {
                return ["err", new ErrorTypeSignature(lhsexp.sinfo, undefined)];
            }
            return this.relations.areSameTypes(lhs, rhs) ? ["stricteq", lhs] : ["err", new ErrorTypeSignature(lhsexp.sinfo, undefined)];
        }
    }
    checkTemplateBindingsOnInvokeConstraints(sinfo, tmap, decl) {
        if (decl.termRestriction !== undefined) {
            assert(tmap !== undefined, "Template mapper must be defined");
            for (let i = 0; i < decl.termRestriction.clauses.length; ++i) {
                let cc = decl.termRestriction.clauses[i];
                let trefine = tmap.resolveTemplateMapping(cc.t);
                if (cc.subtype !== undefined && !this.relations.isSubtypeOf(trefine, cc.subtype.remapTemplateBindings(tmap), this.constraints)) {
                    this.reportError(sinfo, `Template argument ${decl.terms[i].name} is not a subtype of subtype restriction`);
                    return undefined;
                }
                if (cc.extraTags.length !== 0) {
                    if (cc.extraTags.includes(TemplateTermDeclExtraTag.KeyType)) {
                        if (this.checkError(sinfo, !this.relations.isKeyType(trefine, this.constraints), `Template argument ${cc.t.name} is not a keytype`)) {
                            return undefined;
                        }
                    }
                    if (cc.extraTags.includes(TemplateTermDeclExtraTag.Numeric)) {
                        if (this.checkError(sinfo, !this.relations.isNumericType(trefine, this.constraints), `Template argument ${cc.t.name} is not a numeric type`)) {
                            return undefined;
                        }
                    }
                    if (cc.extraTags.includes(TemplateTermDeclExtraTag.Equiv)) {
                        if (this.checkError(sinfo, !this.relations.isEquivType(trefine, this.constraints), `Template argument ${cc.t.name} is not an equiv type`)) {
                            return undefined;
                        }
                    }
                    if (cc.extraTags.includes(TemplateTermDeclExtraTag.Mergeable)) {
                        if (this.checkError(sinfo, !this.relations.isMergeableType(trefine, this.constraints), `Template argument ${cc.t.name} is not a mergeable type`)) {
                            return undefined;
                        }
                    }
                }
            }
        }
    }
    checkTemplateBindingsOnInvokeSig(sinfo, targs, decl) {
        if (targs.length !== decl.terms.length) {
            this.reportError(sinfo, `Invoke ${decl.name} expected ${decl.terms.length} terms but got ${targs.length}`);
            return undefined;
        }
        let tmap = new Map();
        for (let i = 0; i < targs.length; ++i) {
            const targ = targs[i];
            const tdecl = decl.terms[i];
            const trestrict = tdecl.tconstraint;
            if (trestrict !== undefined && !this.relations.isSubtypeOf(targ, trestrict, this.constraints)) {
                this.reportError(sinfo, `Template argument ${tdecl.name} is not a subtype of constraint type`);
                return undefined;
            }
            if (tdecl.extraTags.length !== 0) {
                if (tdecl.extraTags.includes(TemplateTermDeclExtraTag.KeyType)) {
                    if (this.checkError(sinfo, !this.relations.isKeyType(targ, this.constraints), `Template argument ${tdecl.name} is not a keytype`)) {
                        return undefined;
                    }
                }
                if (tdecl.extraTags.includes(TemplateTermDeclExtraTag.Numeric)) {
                    if (this.checkError(sinfo, !this.relations.isNumericType(targ, this.constraints), `Template argument ${tdecl.name} is not a numeric type`)) {
                        return undefined;
                    }
                }
                if (tdecl.extraTags.includes(TemplateTermDeclExtraTag.Equiv)) {
                    if (this.checkError(sinfo, !this.relations.isEquivType(targ, this.constraints), `Template argument ${tdecl.name} is not an equiv type`)) {
                        return undefined;
                    }
                }
                if (tdecl.extraTags.includes(TemplateTermDeclExtraTag.Mergeable)) {
                    if (this.checkError(sinfo, !this.relations.isMergeableType(targ, this.constraints), `Template argument ${tdecl.name} is not a mergeable type`)) {
                        return undefined;
                    }
                }
            }
            tmap.set(tdecl.name, targ);
        }
        return TemplateNameMapper.createInitialMapping(tmap);
    }
    checkTemplateBindingsOnConstructor(sinfo, targs, cdecl) {
        if (targs.length !== cdecl.terms.length) {
            this.reportError(sinfo, `Constructor ${cdecl.name} expected ${cdecl.terms.length} terms but got ${targs.length}`);
            return undefined;
        }
        let tmap = new Map();
        for (let i = 0; i < targs.length; ++i) {
            const targ = targs[i];
            const tdecl = cdecl.terms[i];
            const trestrict = tdecl.tconstraint;
            if (trestrict !== undefined && !this.relations.isSubtypeOf(targ, trestrict, this.constraints)) {
                this.reportError(sinfo, `Template argument ${tdecl.name} is not a subtype of constraint type`);
                return undefined;
            }
            if (tdecl.extraTags.length !== 0) {
                if (tdecl.extraTags.includes(TemplateTermDeclExtraTag.KeyType)) {
                    if (this.checkError(sinfo, !this.relations.isKeyType(targ, this.constraints), `Template argument ${tdecl.name} is not a keytype`)) {
                        return undefined;
                    }
                }
                if (tdecl.extraTags.includes(TemplateTermDeclExtraTag.Numeric)) {
                    if (this.checkError(sinfo, !this.relations.isNumericType(targ, this.constraints), `Template argument ${tdecl.name} is not a numeric type`)) {
                        return undefined;
                    }
                }
                if (tdecl.extraTags.includes(TemplateTermDeclExtraTag.Equiv)) {
                    if (this.checkError(sinfo, !this.relations.isEquivType(targ, this.constraints), `Template argument ${tdecl.name} is not an equiv type`)) {
                        return undefined;
                    }
                }
                if (tdecl.extraTags.includes(TemplateTermDeclExtraTag.Mergeable)) {
                    if (this.checkError(sinfo, !this.relations.isMergeableType(targ, this.constraints), `Template argument ${tdecl.name} is not a mergeable type`)) {
                        return undefined;
                    }
                }
            }
            tmap.set(tdecl.name, targ);
        }
        return TemplateNameMapper.createInitialMapping(tmap);
    }
    checkSingleParam(env, arg, paramname, paramtype, pkind, imapper) {
        if (arg instanceof SpreadArgumentValue) {
            this.reportError(arg.exp.sinfo, `Spread argument cannot be used except as part of rest args`);
        }
        if (arg instanceof NamedArgumentValue) {
            this.checkError(arg.exp.sinfo, arg.name !== paramname, `Named argument ${arg.name} does not match parameter name ${paramname}`);
        }
        if (pkind !== undefined) {
            this.checkError(arg.exp.sinfo, !(arg instanceof PassingArgumentValue), `Parameter ${paramname} is a special passing parameter and must be passed by reference`);
        }
        const ptype = paramtype.remapTemplateBindings(imapper);
        let argtype = new ErrorTypeSignature(arg.exp.sinfo, undefined);
        if (!(arg instanceof PassingArgumentValue)) {
            argtype = this.checkExpression(env, arg.exp, new SimpleTypeInferContext(ptype));
        }
        else {
            this.checkError(arg.exp.sinfo, pkind !== arg.kind, `Parameter ${paramname} passing kind does not match the passing kind of the argument`);
            this.checkError(arg.exp.sinfo, !(arg.exp instanceof AccessVariableExpression), `Reference parameter must be on an variable name`);
            if (arg.exp instanceof AccessVariableExpression) {
                const vname = arg.exp.srcname;
                const vinfo = env.resolveLocalVarInfoFromSrcName(vname);
                if (vinfo === undefined) {
                    this.reportError(arg.exp.sinfo, `Variable ${vname} is not declared`);
                }
                else {
                    const vtype = vinfo.decltype.remapTemplateBindings(imapper);
                    this.checkError(arg.exp.sinfo, vinfo !== undefined && !this.relations.areSameTypes(vtype, ptype), `Variable ${vname} is not declared`);
                    if (pkind === "out?") {
                        const badvkind = vinfo.vkind === "let" || vinfo.vkind === "ref";
                        this.checkError(arg.exp.sinfo, badvkind, `Variable ${vname} cannot be passed as out?`);
                    }
                    else if (pkind === "out") {
                        const badvkind = vinfo.vkind === "let" || vinfo.vkind === "ref";
                        this.checkError(arg.exp.sinfo, badvkind, `Variable ${vname} cannot be passed as out`);
                    }
                    else if (pkind === "inout") {
                        const badvkind = vinfo.vkind === "let" || vinfo.vkind === "ref";
                        this.checkError(arg.exp.sinfo, badvkind, `Variable ${vname} cannot be passed as inout`);
                        this.checkError(arg.exp.sinfo, !vinfo.mustDefined, `Variable ${vname} must be definitely assigned before it can be passed as inout`);
                    }
                    else {
                        //ref param
                        const badvkind = vinfo.vkind === "let";
                        this.checkError(arg.exp.sinfo, badvkind, `Variable ${vname} cannot be passed as ref`);
                        this.checkError(arg.exp.sinfo, !vinfo.mustDefined, `Variable ${vname} must be definitely assigned before it can be passed as ref`);
                        //check if an updatable type
                        this.checkError(arg.exp.sinfo, !TypeChecker.isTypeUpdatable(vtype)[0], `Variable ${vname} is not of an updatable type and cannot be passed as ref`);
                    }
                    argtype = vtype;
                }
                arg.exp.setType(argtype);
            }
        }
        this.checkError(arg.exp.sinfo, !(argtype instanceof ErrorTypeSignature) && !this.relations.isSubtypeOf(argtype, ptype, this.constraints), `Argument ${paramname} expected type ${ptype.emit()} but got ${argtype.emit()}`);
        return argtype;
    }
    checkRestParam(env, args, paramname, paramtype, imapper) {
        const ptype = paramtype.remapTemplateBindings(imapper);
        const etype = this.relations.getExpandoableOfType(ptype);
        if (etype === undefined) {
            this.reportError(args[args.length - 1].exp.sinfo, `Rest parameter ${paramname} must be of type Expandoable`);
            return [];
        }
        let rtypes = [];
        for (let i = 0; i < args.length; ++i) {
            const arg = args[i];
            if (arg instanceof PassingArgumentValue) {
                this.reportError(arg.exp.sinfo, `Rest args cannot be passed by special form`);
            }
            if (arg instanceof PositionalArgumentValue) {
                const argtype = this.checkExpression(env, arg.exp, new SimpleTypeInferContext(etype));
                rtypes.push([false, argtype]);
                this.checkError(arg.exp.sinfo, !(argtype instanceof ErrorTypeSignature) && !this.relations.isSubtypeOf(argtype, etype, this.constraints), `Rest argument ${i} expected type ${etype.emit()}`);
            }
            else {
                const argtype = this.checkExpression(env, arg.exp, undefined);
                rtypes.push([true, argtype]);
                const argetype = this.relations.getExpandoableOfType(argtype);
                this.checkError(arg.exp.sinfo, argetype === undefined || !this.relations.areSameTypes(argetype, etype), `Rest argument ${i} expected to be container of type ${etype.emit()}`);
            }
        }
        return rtypes;
    }
    checkArgumentList(sinfo, env, refok, args, params, imapper) {
        const nonrestparams = params.filter((p) => !p.isRestParam);
        const restparam = params.find((p) => p.isRestParam); //is only 1 at the end (from parser)
        let argsuffle = [];
        let argsuffleidx = [];
        for (let i = 0; i < nonrestparams.length; ++i) {
            argsuffle.push(undefined);
            argsuffleidx.push(-1);
        }
        //fill in all the parameter arg shuggle info
        let nstart = args.findIndex((arg) => arg instanceof NamedArgumentValue);
        if (nstart === -1) {
            nstart = args.length;
        }
        for (let i = 0; i < Math.min(nstart, nonrestparams.length); ++i) {
            if (args[i] instanceof StdArgumentValue) {
                const sarg = args[i];
                argsuffle[i] = sarg;
                argsuffleidx[i] = i;
                this.checkError(sarg.exp.sinfo, !refok && (sarg instanceof PassingArgumentValue), `Reference argument only allowed in top-level contexts`);
            }
        }
        //fill in all the named arguments
        let nlast = args.slice(nstart).findIndex((arg) => !(arg instanceof NamedArgumentValue));
        if (nlast === -1) {
            nlast = args.length;
        }
        for (let i = nstart; i < nlast; ++i) {
            const narg = args[i];
            const paramidx = params.findIndex((p) => p.name === narg.name);
            if (paramidx === -1) {
                this.reportError(narg.exp.sinfo, `Named argument ${narg.name} not found in parameter list`);
            }
            else if (params[paramidx].isRestParam) {
                this.reportError(narg.exp.sinfo, `Named argument ${narg.name} cannot be assigned to rest parameter`);
            }
            else if (argsuffleidx[paramidx] !== -1) {
                this.reportError(narg.exp.sinfo, `Named argument ${narg.name} already assigned to parameter`);
            }
            else {
                argsuffle[paramidx] = narg;
                argsuffleidx[paramidx] = i;
            }
        }
        const realargcount = args.filter((arg) => arg instanceof StdArgumentValue).length;
        if (restparam === undefined && realargcount > params.length) {
            this.reportError(sinfo, `Too many arguments provided to function`);
        }
        let setcondout = [];
        let setuncond = [];
        let inout = [];
        let byref = [];
        let usingdeafults = false;
        let argsuffletype = [];
        for (let i = 0; i < nonrestparams.length; ++i) {
            if (argsuffle[i] === undefined) {
                this.checkError(sinfo, nonrestparams[i].optDefaultValue === undefined, `Required argument ${nonrestparams[i].name} not provided`);
                usingdeafults = true;
                argsuffletype[i] = nonrestparams[i].type;
            }
            else {
                const pp = nonrestparams[i];
                argsuffletype[i] = this.checkSingleParam(env, argsuffle[i], pp.name, pp.type, pp.pkind, imapper);
                if (pp.pkind !== undefined && (argsuffle[i] instanceof PassingArgumentValue) && argsuffle[i].exp instanceof AccessVariableExpression) {
                    const vname = argsuffle[i].exp.srcname;
                    if (pp.pkind === "out?") {
                        setcondout.push(vname);
                    }
                    else if (pp.pkind === "out") {
                        setuncond.push(vname);
                    }
                    else if (pp.pkind === "inout") {
                        inout.push(vname);
                    }
                    else {
                        //ref param
                        byref.push(vname);
                    }
                }
            }
        }
        let resttype = undefined;
        let restinfo = undefined;
        if (restparam !== undefined) {
            let restargs = args.slice(Math.min(nlast, nonrestparams.length));
            this.checkError(sinfo, restargs.some((ra) => ra instanceof SkipArgumentValue), `Rest parameter requires at least one positional argument`);
            this.checkError(sinfo, restargs.length !== 0 && usingdeafults, `Cannot use (implicit) default arguments with rest parameter as uses are ambigious`);
            const restypes = this.checkRestParam(env, restargs.filter((p) => p instanceof StdArgumentValue), restparam.name, restparam.type, imapper);
            resttype = restparam.type.remapTemplateBindings(imapper);
            restinfo = [];
            for (let i = nonrestparams.length; i < args.length; ++i) {
                const rri = restypes[i - nonrestparams.length];
                restinfo.push([i, rri[0], rri[1]]);
            }
        }
        let shuffleinfo = [];
        for (let i = 0; i < nonrestparams.length; ++i) {
            shuffleinfo.push([argsuffleidx[i], argsuffletype[i]]);
        }
        return { shuffleinfo: shuffleinfo, resttype: resttype, restinfo: restinfo, setcondout: setcondout, setuncond: setuncond, inout: inout, byref: byref };
    }
    checkLambdaArgumentList(sinfo, env, refok, args, params) {
        if (args.some((av) => av instanceof SkipArgumentValue)) {
            this.reportError(sinfo, `Skip arguments not allowed in lambda argument list`);
        }
        if (args.some((av) => av instanceof NamedArgumentValue)) {
            this.reportError(sinfo, `Named arguments not allowed in lambda argument list`);
        }
        const nonrestparams = params.filter((p) => !p.isRestParam);
        const restparam = params.find((p) => p.isRestParam); //is only 1 at the end (from parser)
        if (nonrestparams.length > args.length) {
            this.reportError(sinfo, `Too few arguments provided to lambda`);
        }
        let arginfo = [];
        let setcond = [];
        let setuncond = [];
        let inout = [];
        let byref = [];
        for (let i = 0; i < nonrestparams.length && i < args.length; ++i) {
            const pp = nonrestparams[i];
            if (!(args[i] instanceof SkipArgumentValue)) {
                this.checkError(sinfo, !refok && (args[i] instanceof PassingArgumentValue), `Reference argument only allowed in top-level contexts`);
                const argtype = this.checkSingleParam(env, args[i], "[lambda_param]", nonrestparams[i].type, nonrestparams[i].pkind, TemplateNameMapper.createEmpty());
                arginfo.push(argtype);
                if (pp.pkind !== undefined && (args[i] instanceof PassingArgumentValue) && args[i].exp instanceof AccessVariableExpression) {
                    const vname = args[i].exp.srcname;
                    if (pp.pkind === "out?") {
                        setcond.push(vname);
                    }
                    else if (pp.pkind === "out") {
                        setuncond.push(vname);
                    }
                    else if (pp.pkind === "inout") {
                        inout.push(vname);
                    }
                    else {
                        //ref param
                        byref.push(vname);
                    }
                }
            }
        }
        let resttype = undefined;
        let restinfo = undefined;
        if (restparam !== undefined) {
            let restargs = args.slice(nonrestparams.length);
            const restypes = this.checkRestParam(env, restargs, "[lambda_param]", restparam.type, TemplateNameMapper.createEmpty());
            resttype = restparam.type;
            restinfo = [];
            for (let i = nonrestparams.length; i < args.length; ++i) {
                const rri = restypes[i - nonrestparams.length];
                restinfo.push([i, rri[0], rri[1]]);
            }
        }
        return { arginfo: arginfo, resttype: resttype, restinfo: restinfo, setcondout: setcond, setuncond: setuncond, inout: inout, byref: byref };
    }
    checkConstructorArgumentListStd(sinfo, env, args, bnames, imapper) {
        let argsuffle = [];
        let argsuffleidx = [];
        for (let i = 0; i < bnames.length; ++i) {
            argsuffle.push(undefined);
            argsuffleidx.push(-1);
        }
        //fill in all the parameter arg shuffle info
        let nfirst = args.findIndex((arg) => arg instanceof NamedArgumentValue);
        if (nfirst === -1) {
            nfirst = args.length;
        }
        for (let i = 0; i < Math.min(bnames.length, nfirst); ++i) {
            if (args[i] instanceof StdArgumentValue) {
                const sarg = args[i];
                argsuffle[i] = sarg;
                argsuffleidx[i] = i;
                this.checkError(sarg.exp.sinfo, (sarg instanceof PassingArgumentValue), `Passing arguments not allowed in constructors`);
            }
        }
        //fill in all the named arguments
        let nlast = args.slice(nfirst).findIndex((arg) => !(arg instanceof NamedArgumentValue));
        if (nlast === -1) {
            nlast = args.length;
        }
        for (let i = nfirst; i < nlast; ++i) {
            const narg = args[i];
            const paramidx = bnames.findIndex((p) => p.name === narg.name);
            if (paramidx === -1) {
                this.reportError(narg.exp.sinfo, `Named argument ${narg.name} not found in parameter list`);
            }
            else if (argsuffleidx[paramidx] !== -1) {
                this.reportError(narg.exp.sinfo, `Named argument ${narg.name} already assigned to parameter`);
            }
            else {
                argsuffle[paramidx] = narg;
                argsuffleidx[paramidx] = i;
            }
        }
        for (let i = argsuffleidx.length; i < bnames.length; ++i) {
            argsuffleidx.push(-1);
        }
        for (let i = 0; i < bnames.length; ++i) {
            if (argsuffle[i] === undefined) {
                this.checkError(sinfo, !bnames[i].hasdefault, `Required argument ${bnames[i].name} not provided`);
            }
            else {
                const argexp = argsuffle[i].exp;
                const argtype = this.checkExpression(env, argexp, new SimpleTypeInferContext(bnames[i].type));
                const ftype = bnames[i].type.remapTemplateBindings(imapper);
                this.checkError(argexp.sinfo, !(argtype instanceof ErrorTypeSignature) && !this.relations.isSubtypeOf(argtype, ftype, this.constraints), `Argument ${bnames[i].name} expected type ${ftype.emit()} but got ${argtype.emit()}`);
            }
        }
        const realargcount = args.filter((arg) => arg instanceof StdArgumentValue).length;
        if (realargcount > bnames.length) {
            this.reportError(sinfo, `Too many arguments provided to constructor`);
            return [];
        }
        return argsuffleidx.map((idx, i) => [idx, bnames[i].containingtype.remapTemplateBindings(imapper), bnames[i].name, bnames[i].type.remapTemplateBindings(imapper)]);
    }
    checkLiteralNoneExpression(env, exp) {
        return exp.setType(this.getWellKnownType("None"));
    }
    checkLiteralBoolExpression(env, exp) {
        return exp.setType(this.getWellKnownType("Bool"));
    }
    checkLiteralNatExpression(env, exp) {
        const nval = BigInt(exp.value.slice(0, exp.value.length - 1));
        this.checkError(exp.sinfo, nval < 0n, "Nat literal cannot be negative");
        this.checkError(exp.sinfo, MAX_SAFE_NAT < nval, "Nat literal out of valid range");
        return exp.setType(this.getWellKnownType("Nat"));
    }
    checkLiteralIntExpression(env, exp) {
        const nval = BigInt(exp.value.slice(0, exp.value.length - 1));
        this.checkError(exp.sinfo, nval < MIN_SAFE_INT, "Int literal cannot be negative");
        this.checkError(exp.sinfo, MAX_SAFE_INT < nval, "Int literal out of valid range");
        return exp.setType(this.getWellKnownType("Int"));
    }
    checkLiteralChkNatExpression(env, exp) {
        if (exp.value !== "ChkNat::npos") {
            const nval = BigInt(exp.value.slice(0, exp.value.length - 1));
            this.checkError(exp.sinfo, nval < 0n, "ChkNat literal cannot be negative");
            this.checkError(exp.sinfo, MAX_SAFE_CHK_NAT < nval, "ChkNat literal out of valid range");
        }
        return exp.setType(this.getWellKnownType("ChkNat"));
    }
    checkLiteralChkIntExpression(env, exp) {
        if (exp.value !== "ChkInt::npos") {
            const nval = BigInt(exp.value.slice(0, exp.value.length - 1));
            this.checkError(exp.sinfo, nval < MIN_SAFE_CHK_INT, "ChkInt literal out of valid range");
            this.checkError(exp.sinfo, MAX_SAFE_CHK_INT < nval, "ChkInt literal out of valid range");
        }
        return exp.setType(this.getWellKnownType("ChkInt"));
    }
    checkLiteralRationalExpression(env, exp) {
        const slpos = exp.value.indexOf("/");
        const num = BigInt(exp.value.slice(0, slpos));
        this.checkError(exp.sinfo, MAX_SAFE_CHK_INT < num, "Rational literal numerator out of valid range");
        const den = BigInt(exp.value.slice(slpos + 1, -1));
        this.checkError(exp.sinfo, MAX_SAFE_NAT < den, "Rational literal denominator out of valid range");
        return exp.setType(this.getWellKnownType("Rational"));
    }
    static isValidFloatLiteral(val) {
        const fval = Number.parseFloat(val);
        return !Number.isNaN(fval) && Number.isFinite(fval);
    }
    static isValidDecimalLiteral(val) {
        //TODO: we need to do a bit more on the bounds etc. here
        return true;
    }
    static isValidDecimalDegreeLiteral(val, min, max) {
        const pcstr = val.slice(val.indexOf("."));
        if (pcstr.length > 8) {
            return false; //max 8 decimal places of precision
        }
        const fval = Number.parseFloat(val);
        return !Number.isNaN(fval) && Number.isFinite(fval) && min <= fval && fval <= max;
    }
    checkLiteralFloatExpression(env, exp) {
        this.checkError(exp.sinfo, !TypeChecker.isValidFloatLiteral(exp.value.slice(0, exp.value.length - 1)), "Invalid Float literal");
        return exp.setType(this.getWellKnownType("Float"));
    }
    checkLiteralDecimalExpression(env, exp) {
        this.checkError(exp.sinfo, !TypeChecker.isValidDecimalLiteral(exp.value.slice(0, exp.value.length - 1)), "Invalid Decimal literal");
        return exp.setType(this.getWellKnownType("Decimal"));
    }
    checkLiteralDecimalDegreeExpression(env, exp) {
        this.checkError(exp.sinfo, !TypeChecker.isValidDecimalDegreeLiteral(exp.value.slice(0, exp.value.length - 2), -360.0, 360.0), "Invalid DecimalDegree literal");
        return exp.setType(this.getWellKnownType("DecimalDegree"));
    }
    checkLiteralLatLongCoordinateExpression(env, exp) {
        const latsplit = exp.value.indexOf("lat");
        const latval = exp.value.slice(0, latsplit);
        const longval = exp.value.slice(latsplit + 3, exp.value.length - 4);
        this.checkError(exp.sinfo, !TypeChecker.isValidDecimalDegreeLiteral(latval, -180.0, 180.0), "Invalid Latitude value");
        this.checkError(exp.sinfo, !TypeChecker.isValidDecimalDegreeLiteral(longval, -90.0, 90.0), "Invalid Longitude value");
        return exp.setType(this.getWellKnownType("LatLongCoordinate"));
    }
    checkLiteralComplexNumberExpression(env, exp) {
        let spos = exp.value.lastIndexOf("+");
        if (spos === -1) {
            spos = exp.value.lastIndexOf("-");
        }
        const realval = exp.value.slice(0, spos);
        const imagval = exp.value.slice(spos, exp.value.length - 1);
        this.checkError(exp.sinfo, !TypeChecker.isValidFloatLiteral(realval), "Invalid Complex literal real value");
        this.checkError(exp.sinfo, !TypeChecker.isValidFloatLiteral(imagval), "Invalid Complex literal imaginary value");
        return exp.setType(this.getWellKnownType("Complex"));
    }
    checkLiteralByteBufferExpression(env, exp) {
        return exp.setType(this.getWellKnownType("ByteBuffer"));
    }
    checkLiteralUUIDv4Expression(env, exp) {
        return exp.setType(this.getWellKnownType("UUIDv4"));
    }
    checkLiteralUUIDv7Expression(env, exp) {
        return exp.setType(this.getWellKnownType("UUIDv7"));
    }
    checkLiteralSHAContentHashExpression(env, exp) {
        return exp.setType(this.getWellKnownType("SHAContentHash"));
    }
    checkLiteralTZDateTimeExpression(env, exp) {
        //TODO: missing years and days in month validation here
        return exp.setType(this.getWellKnownType("TZDateTime"));
    }
    checkLiteralTAITimeExpression(env, exp) {
        //TODO: missing years and days in month validation here -- also leap seconds
        return exp.setType(this.getWellKnownType("TAIDateTime"));
    }
    checkLiteralPlainDateExpression(env, exp) {
        //TODO: missing years and days in month validation here
        return exp.setType(this.getWellKnownType("PlainDate"));
    }
    checkLiteralPlainTimeExpression(env, exp) {
        return exp.setType(this.getWellKnownType("PlainTime"));
    }
    checkLiteralLogicalTimeExpression(env, exp) {
        return exp.setType(this.getWellKnownType("LogicalTime"));
    }
    checkLiteralISOTimeStampExpression(env, exp) {
        //TODO: missing years and days in month validation here -- also leap seconds
        return exp.setType(this.getWellKnownType("ISOTimeStamp"));
    }
    checkLiteralDeltaDateTimeExpression(env, exp) {
        return exp.setType(this.getWellKnownType("DeltaDateTime"));
    }
    checkLiteralDeltaISOTimeStampExpression(env, exp) {
        return exp.setType(this.getWellKnownType("DeltaISOTimeStamp"));
    }
    checkLiteralDeltaSecondsExpression(env, exp) {
        return exp.setType(this.getWellKnownType("DeltaSeconds"));
    }
    checkLiteralDeltaLogicalExpression(env, exp) {
        return exp.setType(this.getWellKnownType("DeltaLogical"));
    }
    checkLiteralUnicodeRegexExpression(env, exp) {
        try {
            accepts(exp.value, "", exp.inns.ns.join("::")); //if this throws the the regex was invalid
        }
        catch (err) {
            this.reportError(exp.sinfo, `Invalid UnicodeRegex literal: ${exp.value}`);
        }
        return exp.setType(this.getWellKnownType("Regex"));
    }
    checkLiteralCRegexExpression(env, exp) {
        try {
            accepts(exp.value, "", exp.inns.ns.join("::")); //if this throws the the regex was invalid
        }
        catch (err) {
            this.reportError(exp.sinfo, `Invalid UnicodeRegex literal: ${exp.value}`);
        }
        return exp.setType(this.getWellKnownType("CRegex"));
    }
    checkLiteralByteExpression(env, exp) {
        const nval = Number.parseInt(exp.value, 16);
        this.checkError(exp.sinfo, nval < 0 || 255 < nval, "Byte literal out of valid range");
        return exp.setType(this.getWellKnownType("Byte"));
    }
    checkLiteralCCharExpression(env, exp) {
        try {
            const vcc = validateCStringLiteral(exp.value.slice(2, exp.value.length - 1));
            if (vcc === null) {
                throw new Error(`Invalid CChar literal`);
            }
            if (vcc.length > 1) {
                throw new Error(`Expected zero or one UnicodeChar, but found ${vcc.length} characters`);
            }
            exp.resolvedValue = vcc;
        }
        catch (err) {
            this.reportError(exp.sinfo, err.message);
        }
        return exp.setType(this.getWellKnownType("CChar"));
    }
    checkLiteralUnicodeCharExpression(env, exp) {
        try {
            const vuc = validateStringLiteral(exp.value.slice(2, exp.value.length - 1));
            if (vuc === null) {
                throw new Error(`Invalid UnicodeChar literal`);
            }
            if (vuc.length > 1) {
                throw new Error(`Expected zero or one UnicodeChar, but found ${vuc.length} characters`);
            }
            exp.resolvedValue = vuc;
        }
        catch (err) {
            this.reportError(exp.sinfo, err.message);
        }
        return exp.setType(this.getWellKnownType("UnicodeChar"));
    }
    checkLiteralStringExpression(env, exp) {
        try {
            const vs = validateStringLiteral(exp.value.slice(1, exp.value.length - 1));
            exp.resolvedValue = vs;
        }
        catch (err) {
            this.reportError(exp.sinfo, err.message);
        }
        return exp.setType(this.getWellKnownType("String"));
    }
    checkLiteralCStringExpression(env, exp) {
        try {
            const vs = validateCStringLiteral(exp.value.slice(1, exp.value.length - 1));
            exp.resolvedValue = vs;
        }
        catch (err) {
            this.reportError(exp.sinfo, err.message);
        }
        return exp.setType(this.getWellKnownType("CString"));
    }
    computeFormatArgsTypes(sinfo, fmts, defaulttype, infertype) {
        this.checkError(sinfo, infertype !== undefined && !(infertype instanceof ErrorTypeSignature) && !(infertype instanceof FormatStringTypeSignature), `Inferred type for format string must be a format string type`);
        const itype = infertype instanceof FormatStringTypeSignature ? infertype : undefined;
        let fmttypes = [];
        for (let i = 0; i < fmts.length; ++i) {
            const ffmt = fmts[i];
            if (ffmt instanceof FormatStringTextComponent) {
                try {
                    const vs = validateStringLiteral(ffmt.text);
                    ffmt.resolvedValue = vs;
                }
                catch (err) {
                    this.reportError(sinfo, err.message);
                }
            }
            else {
                const argfmt = ffmt;
                if (argfmt.argType instanceof AutoTypeSignature) {
                    argfmt.resolvedType = defaulttype;
                }
                else {
                    const oktype = this.checkTypeSignature(argfmt.argType);
                    if (!oktype || !(argfmt.argType instanceof NominalTypeSignature)) {
                        argfmt.resolvedType = new ErrorTypeSignature(sinfo, undefined);
                    }
                    else {
                        argfmt.resolvedType = argfmt.argType;
                    }
                }
                fmttypes.push({ argname: argfmt.argPos, argtype: argfmt.resolvedType });
            }
        }
        fmttypes.sort((a, b) => a.argname.localeCompare(b.argname));
        const allidxs = fmttypes.every((fmt) => /^[0-9]+$/.test(fmt.argname));
        const allnames = fmttypes.every((fmt) => !/^[0-9]+$/.test(fmt.argname));
        if (!allidxs && !allnames) {
            this.reportError(sinfo, `Format string arguments must be either all indexed or all named`);
        }
        let uniquefmttypes = [];
        for (let i = 0; i < fmttypes.length; ++i) {
            const mmtype = uniquefmttypes.find((uft) => uft.argname === fmttypes[i].argname);
            if (mmtype === undefined) {
                uniquefmttypes.push(fmttypes[i]);
            }
            else {
                this.checkError(sinfo, !this.relations.areSameTypes(mmtype.argtype, fmttypes[i].argtype), `Multiple format string arguments with name ${fmttypes[i].argname} must have the same type`);
            }
        }
        if (itype === undefined) {
            if (allidxs) {
                const allidxs = uniquefmttypes.map((fmt) => {
                    let ii = -1;
                    try {
                        ii = Number.parseInt(fmt.argname);
                    }
                    catch (err) {
                        ;
                    }
                    return ii;
                });
                this.checkError(sinfo, allidxs[0] !== 0, `If format string argument indexes are used, then they must start at 0 (unless being matched to an inferred type)`);
                this.checkError(sinfo, allidxs.slice(1).some((idx, ii) => idx - 1 !== allidxs[ii]), `Format string argument indexes cannot have gaps (unless being matched to an inferred type)`);
            }
        }
        else {
            if (allidxs) {
                const allidxsfound = fmttypes.every((fmt) => {
                    let iidx = -1;
                    try {
                        iidx = Number.parseInt(fmt.argname);
                    }
                    catch (err) {
                        ;
                    }
                    return iidx !== -1 && iidx < itype.terms.length;
                });
                this.checkError(sinfo, !allidxsfound, `Inferred format string type ${itype.emit()} does not have all the required argument indexes`);
            }
            else {
                const allnamesfound = fmttypes.every((fmt) => {
                    return itype.terms.some((term) => term.argname === fmt.argname);
                });
                this.checkError(sinfo, !allnamesfound, `Format string literal uses names not found in inferred type ${itype.emit()}`);
            }
        }
        if (allidxs) {
            const idxs = fmttypes.map((fmt) => Number.parseInt(fmt.argname));
            this.checkError(sinfo, idxs.some((idx) => idx < 0), `Format string argument indexes must be non-negative integers`);
            uniquefmttypes = uniquefmttypes.map((fmt) => ({ argname: "_", argtype: fmt.argtype }));
        }
        return uniquefmttypes;
    }
    checkLiteralFormatStringExpression(env, exp, infertype) {
        const fmttypes = this.computeFormatArgsTypes(exp.sinfo, exp.fmts, this.getWellKnownType("String"), infertype);
        return exp.setType(infertype || new FormatStringTypeSignature(exp.sinfo, "String", this.getWellKnownType("String"), fmttypes));
    }
    checkLiteralFormatCStringExpression(env, exp, infertype) {
        const fmttypes = this.computeFormatArgsTypes(exp.sinfo, exp.fmts, this.getWellKnownType("CString"), infertype);
        return exp.setType(infertype || new FormatStringTypeSignature(exp.sinfo, "CString", this.getWellKnownType("CString"), fmttypes));
    }
    checkLiteralPathExpression(env, exp) {
        assert(false, "Not Implemented -- checkLiteralPathExpression");
    }
    checkLiteralPathFragmentExpression(env, exp) {
        assert(false, "Not Implemented -- checkLiteralPathFragmentExpression");
    }
    checkLiteralGlobExpression(env, exp) {
        assert(false, "Not Implemented -- checkLiteralPathGlobExpression");
    }
    checkLiteralTypeDeclValueExpression(env, exp) {
        if (!this.checkTypeSignature(exp.constype)) {
            return exp.setType(exp.constype);
        }
        if (!(exp.constype instanceof NominalTypeSignature) || !(exp.constype.decl instanceof TypedeclTypeDecl)) {
            this.reportError(exp.sinfo, `Invalid type for literal typedecl expression -- ${exp.constype}`);
            return exp.setType(exp.constype);
        }
        const btype = this.relations.getTypeDeclValueType(exp.constype);
        const bvalue = this.checkExpression(env, exp.value, btype !== undefined ? new SimpleTypeInferContext(btype) : undefined);
        this.checkError(exp.sinfo, !(bvalue instanceof ErrorTypeSignature) && btype !== undefined && !this.relations.areSameTypes(bvalue, btype), `Literal value is not the same type (${bvalue.emit()}) as the value type (${TypeChecker.safeTypePrint(btype)})`);
        const tdecl = exp.constype.decl;
        if (tdecl.optsizerng !== undefined && exp.value instanceof LiteralSimpleExpression) {
            const typevaluename = tdecl.valuetype.decl.name;
            const valParsed = this.parseRangeBound(exp.sinfo, exp.value.value, typevaluename);
            if (valParsed.ok) {
                if (tdecl.optsizerng.min !== undefined) {
                    const minParsed = this.parseRangeBound(exp.sinfo, tdecl.optsizerng.min, typevaluename);
                    if (minParsed.ok) {
                        this.checkError(exp.sinfo, valParsed.value < minParsed.value, `Value ${exp.value.value} is below range minimum ${tdecl.optsizerng.min}`);
                    }
                }
                if (tdecl.optsizerng.max !== undefined) {
                    const maxParsed = this.parseRangeBound(exp.sinfo, tdecl.optsizerng.max, typevaluename);
                    if (maxParsed.ok) {
                        this.checkError(exp.sinfo, valParsed.value > maxParsed.value, `Value ${exp.value.value} is above range maximum ${tdecl.optsizerng.max}`);
                    }
                }
            }
        }
        return exp.setType(exp.constype);
    }
    checkLiteralTypedStringExpression(env, exp) {
        if (!this.checkTypeSignature(exp.constype)) {
            return exp.setType(exp.constype);
        }
        if (!(exp.constype instanceof NominalTypeSignature) || !(exp.constype.decl instanceof TypedeclTypeDecl)) {
            this.reportError(exp.sinfo, `Invalid type for typed string literal expression -- ${exp.constype.emit()}`);
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        const btype = this.relations.getTypeDeclValueType(exp.constype);
        if (btype === undefined || !this.relations.areSameTypes(btype, this.getWellKnownType("String"))) {
            this.reportError(exp.sinfo, `Typed string literal type must have base type String -- ${exp.constype.emit()}`);
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        const vs = this.checkTypeDeclOfStringRestrictions(exp.sinfo, exp.constype.decl, exp.value);
        if (vs !== null) {
            exp.resolvedValue = vs;
        }
        return exp.setType(exp.constype);
    }
    checkLiteralTypedCStringExpression(env, exp) {
        if (!this.checkTypeSignature(exp.constype)) {
            return exp.setType(exp.constype);
        }
        if (!(exp.constype instanceof NominalTypeSignature) || !(exp.constype.decl instanceof TypedeclTypeDecl)) {
            this.reportError(exp.sinfo, `Invalid type for typed cstring literal expression -- ${exp.constype.emit()}`);
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        const btype = this.relations.getTypeDeclValueType(exp.constype);
        if (btype === undefined || !this.relations.areSameTypes(btype, this.getWellKnownType("CString"))) {
            this.reportError(exp.sinfo, `Typed cstring literal type must have base type CString -- ${exp.constype.emit()}`);
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        const vs = this.checkTypeDeclOfCStringRestrictions(exp.sinfo, exp.constype.decl, exp.value);
        if (vs !== null) {
            exp.resolvedValue = vs;
        }
        return exp.setType(exp.constype);
    }
    checkLiteralTypedFormatStringExpression(env, exp, infertype) {
        if (!this.checkTypeSignature(exp.constype)) {
            return exp.setType(exp.constype);
        }
        if (!(exp.constype instanceof NominalTypeSignature) || !(exp.constype.decl instanceof TypedeclTypeDecl)) {
            this.reportError(exp.sinfo, `Invalid type for typed format string expression -- ${exp.constype.emit()}`);
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        const btype = this.relations.getTypeDeclValueType(exp.constype);
        if (!this.relations.areSameTypes(exp.constype, this.getWellKnownType("String")) && (btype === undefined || !this.relations.areSameTypes(btype, this.getWellKnownType("String")))) {
            this.reportError(exp.sinfo, `Typed format string type must have base type String -- ${exp.constype.emit()}`);
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        const fmttypes = this.computeFormatArgsTypes(exp.sinfo, exp.fmts, this.getWellKnownType("String"), infertype);
        return exp.setType(infertype || new FormatStringTypeSignature(exp.sinfo, "String", exp.constype, fmttypes));
    }
    checkLiteralTypedFormatCStringExpression(env, exp, infertype) {
        if (!this.checkTypeSignature(exp.constype)) {
            return exp.setType(exp.constype);
        }
        if (!(exp.constype instanceof NominalTypeSignature) || !(exp.constype.decl instanceof TypedeclTypeDecl)) {
            this.reportError(exp.sinfo, `Invalid type for typed format cstring expression -- ${exp.constype.emit()}`);
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        const btype = this.relations.getTypeDeclValueType(exp.constype);
        if (!this.relations.areSameTypes(exp.constype, this.getWellKnownType("CString")) && (btype === undefined || !this.relations.areSameTypes(btype, this.getWellKnownType("CString")))) {
            this.reportError(exp.sinfo, `Typed format cstring type must have base type CString -- ${exp.constype.emit()}`);
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        const fmttypes = this.computeFormatArgsTypes(exp.sinfo, exp.fmts, this.getWellKnownType("CString"), infertype);
        return exp.setType(infertype || new FormatStringTypeSignature(exp.sinfo, "CString", exp.constype, fmttypes));
    }
    checkAccessEnvValueExpression(env, exp) {
        this.checkError(exp.sinfo, !this.isTaskScope, `Environment values in non-task scopes`);
        if (!exp.keyname.startsWith("'")) {
            exp.resolvedkey = exp.keyname;
        }
        else {
            try {
                const vs = validateCStringLiteral(exp.keyname.slice(1, exp.keyname.length - 1));
                if (vs === null) {
                    this.reportError(exp.sinfo, `Invalid CString literal for environment value key`);
                    return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
                }
                exp.resolvedkey = vs;
            }
            catch (err) {
                this.reportError(exp.sinfo, err.message);
                return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
            }
        }
        const evdecl = this.envDecl.find((ev) => ev.evname === exp.keyname);
        if (exp.opname === "has") {
            if (evdecl === undefined) {
                this.reportError(exp.sinfo, `Environment variable ${exp.keyname} is never defined`);
            }
            else {
                this.checkError(exp.sinfo, evdecl.required, `Environment variable ${exp.keyname} is always defined`);
            }
            return exp.setType(this.getWellKnownType("Bool"));
        }
        else {
            if (evdecl === undefined) {
                this.reportError(exp.sinfo, `Could not find environment value ${exp.keyname}`);
                return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
            }
            exp.mustdefined = evdecl.required;
            this.checkTypeSignature(evdecl.evtype);
            if (exp.opname === undefined || exp.opname === "get") {
                return exp.setType(evdecl.evtype);
            }
            else {
                const optdecl = this.relations.assembly.getCoreNamespace().typedecls.find((td) => td.name === "Option");
                return exp.setType(new NominalTypeSignature(exp.sinfo, undefined, optdecl, [evdecl.evtype]));
            }
        }
    }
    checkTaskAccessInfoExpression(env, exp) {
        this.checkError(exp.sinfo, !this.isTaskScope, `Task ID values cannot be accessed in non-task scopes`);
        return exp.setType(this.getWellKnownType("UUIDv7"));
    }
    checkAccessNamespaceConstantExpression(env, exp) {
        const cdecl = this.relations.assembly.resolveNamespaceConstant(exp.ns, exp.name);
        if (cdecl === undefined) {
            this.reportError(exp.sinfo, `Could not find namespace constant ${exp.ns}::${exp.name}`);
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        this.checkTypeSignature(cdecl.declaredType);
        return exp.setType(cdecl.declaredType);
    }
    checkAccessStaticFieldExpression(env, exp) {
        const tok = this.checkTypeSignature(exp.stype);
        if (!tok) {
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        if (this.relations.isNumericType(exp.stype, this.constraints)) {
            if (exp.name === "zero") {
                exp.resolvedDeclType = exp.stype;
                return exp.setType(exp.stype);
            }
            if (exp.name === "one") {
                exp.resolvedDeclType = exp.stype;
                return exp.setType(exp.stype);
            }
        }
        const cconst = this.relations.resolveTypeConstant(exp.stype, exp.name, this.constraints);
        if (cconst !== undefined) {
            exp.resolvedDeclType = cconst.typeinfo.tsig;
            return exp.setType(cconst.member.declaredType.remapTemplateBindings(cconst.typeinfo.mapping));
        }
        else {
            this.reportError(exp.sinfo, `Type ${exp.stype.emit()} does not have const field ${exp.name}`);
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
    }
    checkAccessEnumExpression(env, exp) {
        const oktype = this.checkTypeSignature(exp.stype);
        if (!oktype) {
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        if (!(exp.stype instanceof NominalTypeSignature) || !(exp.stype.decl instanceof EnumTypeDecl)) {
            this.reportError(exp.sinfo, `Invalid type for enum access expression -- ${exp.stype.emit()}`);
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        const edecl = exp.stype.decl;
        if (edecl.members.includes(exp.name)) {
            return exp.setType(exp.stype);
        }
        else {
            this.reportError(exp.sinfo, `Enum ${exp.stype.decl.name} does not have member ${exp.name}`);
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
    }
    checkAccessVariableExpression(env, exp) {
        const vinfo = env.resolveLocalVarInfoFromSrcName(exp.srcname);
        if (vinfo !== undefined) {
            this.checkError(exp.sinfo, !vinfo.mustDefined, `Variable ${exp.srcname} may not be defined on all control flow paths`);
            exp.isParameter = env.isLocalVariableAParameter(vinfo.srcname);
            return exp.setType(vinfo.decltype);
        }
        else {
            const cinfo = env.resolveLambdaCaptureVarInfoFromSrcName(exp.srcname);
            if (cinfo === undefined) {
                this.reportError(exp.sinfo, `Variable ${exp.srcname} is not declared here`);
                return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
            }
            else {
                this.checkError(exp.sinfo, !cinfo.mustDefined, `Variable ${exp.srcname} may not be defined on all control flow paths`);
                exp.isCaptured = true;
                exp.ocapture = env.resolveOCaptureInfoFromSrcName(exp.srcname);
                return exp.setType(cinfo.decltype);
            }
        }
    }
    checkCollectionConstructor(env, cdecl, exp) {
        const etype = this.relations.getExpandoableOfType(exp.ctype);
        if (exp.args.args.some((arg) => (arg instanceof SkipArgumentValue) || (arg instanceof NamedArgumentValue) || (arg instanceof PassingArgumentValue))) {
            this.reportError(exp.sinfo, `Collection constructor expects only positional (or spread) arguments`);
            return exp.setType(exp.ctype);
        }
        let shuffleinfo = [];
        for (let i = 0; i < exp.args.args.length; ++i) {
            shuffleinfo.push([i, undefined, "_", etype]);
            const arg = exp.args.args[i];
            if (arg instanceof PositionalArgumentValue) {
                const argtype = this.checkExpression(env, arg.exp, new SimpleTypeInferContext(etype));
                this.checkError(arg.exp.sinfo, (argtype instanceof ErrorTypeSignature) || !this.relations.isSubtypeOf(argtype, etype, this.constraints), `Argument ${i} expected type ${etype.emit()}`);
            }
            else {
                const argtype = this.checkExpression(env, arg.exp, undefined);
                const argetype = this.relations.getExpandoableOfType(argtype);
                this.checkError(arg.exp.sinfo, argetype === undefined || !this.relations.areSameTypes(argetype, etype), `Spread argument ${i} expected to be container of type ${etype.emit()}`);
            }
        }
        exp.elemtype = etype;
        exp.shuffleinfo = shuffleinfo;
        return exp.setType(exp.ctype);
    }
    checkSpecialConstructableConstructor(env, cdecl, exp) {
        const ctype = exp.ctype;
        if (exp.args.args.some((arg) => !(arg instanceof PositionalArgumentValue))) {
            this.reportError(exp.sinfo, `Special constructor expects only positional arguments`);
            return exp.setType(ctype);
        }
        if (cdecl instanceof OkTypeDecl) {
            if (exp.args.args.length !== 1) {
                this.reportError(exp.sinfo, `Ok constructor expects 1 argument`);
            }
            else {
                const oktype = ctype.alltermargs[0];
                exp.shuffleinfo = [[0, undefined, "value", oktype]];
                const okarg = this.checkExpression(env, exp.args.args[0].exp, new SimpleTypeInferContext(oktype));
                this.checkError(exp.sinfo, (okarg instanceof ErrorTypeSignature) || !this.relations.isSubtypeOf(okarg, oktype, this.constraints), `Ok constructor argument is not a subtype of ${oktype.emit()}`);
            }
        }
        else if (cdecl instanceof FailTypeDecl) {
            if (exp.args.args.length !== 1) {
                this.reportError(exp.sinfo, `Fail constructor expects 1 argument`);
            }
            else {
                const errtype = ctype.alltermargs[1];
                exp.shuffleinfo = [[0, undefined, "value", errtype]];
                const errarg = this.checkExpression(env, exp.args.args[0].exp, new SimpleTypeInferContext(errtype));
                this.checkError(exp.sinfo, (errarg instanceof ErrorTypeSignature) || !this.relations.isSubtypeOf(errarg, errtype, this.constraints), `Err constructor argument is not a subtype of ${errtype.emit()}`);
            }
        }
        else if ((cdecl instanceof APIErrorTypeDecl) || (cdecl instanceof APIRejectedTypeDecl) || (cdecl instanceof APIDeniedTypeDecl) || (cdecl instanceof APIFlaggedTypeDecl) || (cdecl instanceof APISuccessTypeDecl)) {
            if (cdecl instanceof APIFlaggedTypeDecl) {
                if (exp.args.args.length !== 2) {
                    this.reportError(exp.sinfo, `API flagged result constructor expects 2 argument`);
                }
                else {
                    const attype = ctype.alltermargs[0];
                    const aetype = ctype.alltermargs[1];
                    exp.shuffleinfo = [[0, undefined, "value", attype], [1, undefined, "info", aetype]];
                    const atarg = this.checkExpression(env, exp.args.args[0].exp, new SimpleTypeInferContext(attype));
                    this.checkError(exp.sinfo, (atarg instanceof ErrorTypeSignature) || !this.relations.isSubtypeOf(atarg, attype, this.constraints), `API flagged result first constructor argument is not a subtype of ${attype.emit()}`);
                    const aetarg = this.checkExpression(env, exp.args.args[1].exp, new SimpleTypeInferContext(aetype));
                    this.checkError(exp.sinfo, (aetarg instanceof ErrorTypeSignature) || !this.relations.isSubtypeOf(aetarg, aetype, this.constraints), `API flagged result second constructor argument is not a subtype of ${aetype.emit()}`);
                }
            }
            else {
                if (exp.args.args.length !== 1) {
                    this.reportError(exp.sinfo, `API result constructor expects 1 argument`);
                }
                else {
                    if (cdecl instanceof APISuccessTypeDecl) {
                        const apitype = ctype.alltermargs[0];
                        exp.shuffleinfo = [[0, undefined, "value", apitype]];
                        const apiarg = this.checkExpression(env, exp.args.args[0].exp, new SimpleTypeInferContext(apitype));
                        this.checkError(exp.sinfo, (apiarg instanceof ErrorTypeSignature) || !this.relations.isSubtypeOf(apiarg, apitype, this.constraints), `API result constructor argument is not a subtype of ${apitype.emit()}`);
                    }
                    else {
                        const apitype = ctype.alltermargs[1];
                        exp.shuffleinfo = [[0, undefined, "info", apitype]];
                        const apiarg = this.checkExpression(env, exp.args.args[0].exp, new SimpleTypeInferContext(apitype));
                        this.checkError(exp.sinfo, (apiarg instanceof ErrorTypeSignature) || !this.relations.isSubtypeOf(apiarg, apitype, this.constraints), `API result constructor argument is not a subtype of ${apitype.emit()}`);
                    }
                }
            }
        }
        else if (cdecl instanceof SomeTypeDecl) {
            if (exp.args.args.length !== 1) {
                this.reportError(exp.sinfo, `Some constructor expects 1 argument`);
            }
            else {
                const ttype = ctype.alltermargs[0];
                exp.shuffleinfo = [[0, undefined, "value", ttype]];
                const etype = this.checkExpression(env, exp.args.args[0].exp, new SimpleTypeInferContext(ttype));
                this.checkError(exp.sinfo, (etype instanceof ErrorTypeSignature) || !this.relations.isSubtypeOf(etype, ttype, this.constraints), `Some constructor argument is not a subtype of ${ttype.emit()}`);
            }
        }
        else if (cdecl instanceof MapEntryTypeDecl) {
            if (exp.args.args.length !== 2) {
                this.reportError(exp.sinfo, `MapEntry constructor expects 2 arguments`);
            }
            else {
                const ktype = ctype.alltermargs[0];
                exp.shuffleinfo = [[0, undefined, "key", ktype]];
                const ketype = this.checkExpression(env, exp.args.args[0].exp, new SimpleTypeInferContext(ktype));
                this.checkError(exp.sinfo, (ketype instanceof ErrorTypeSignature) || !this.relations.isSubtypeOf(ketype, ktype, this.constraints), `MapEntry constructor key argument is not a subtype of ${ktype.emit()}`);
                const vtype = ctype.alltermargs[1];
                exp.shuffleinfo = [[1, undefined, "value", vtype]];
                const vetype = this.checkExpression(env, exp.args.args[1].exp, new SimpleTypeInferContext(vtype));
                this.checkError(exp.sinfo, (vetype instanceof ErrorTypeSignature) || !this.relations.isSubtypeOf(vetype, vtype, this.constraints), `MapEntry constructor value argument is not a subtype of ${vtype.emit()}`);
            }
        }
        else {
            assert(false, "Unknown ConstructableTypeDecl type");
        }
        return exp.setType(ctype);
    }
    checkSpecialTypeDeclConstructor(env, cdecl, exp) {
        const ctype = exp.ctype;
        if (exp.args.args.length !== 1) {
            this.reportError(exp.sinfo, `${ctype.emit()} constructor expects 1 argument`);
        }
        else if (!(exp.args.args[0] instanceof PositionalArgumentValue)) {
            this.reportError(exp.sinfo, `Type alias constructor expects only positional arguments`);
        }
        else {
            const vtype = this.relations.getTypeDeclValueType(ctype);
            if (vtype !== undefined) {
                const etype = this.checkExpression(env, exp.args.args[0].exp, new SimpleTypeInferContext(vtype));
                this.checkError(exp.sinfo, (etype instanceof ErrorTypeSignature) || !(this.relations.areSameTypes(etype, vtype)), `${etype.emit()} constructor argument is not compatible with ${vtype.emit()}`);
            }
        }
        return exp.setType(ctype);
    }
    checkStandardConstructor(env, fields, exp) {
        const ctype = exp.ctype;
        const imapper = this.checkTemplateBindingsOnConstructor(exp.sinfo, ctype.alltermargs, ctype.decl);
        if (imapper === undefined) {
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        const bnames = this.relations.generateAllFieldBNamesInfo(ctype, fields, this.constraints);
        const shuffleinfo = this.checkConstructorArgumentListStd(exp.sinfo, env, exp.args.args, bnames, imapper);
        exp.shuffleinfo = shuffleinfo;
        return exp.setType(ctype);
    }
    checkConstructorPrimaryExpression(env, exp) {
        const tok = this.checkTypeSignature(exp.ctype);
        if (!tok) {
            this.reportError(exp.sinfo, `Invalid type for constructor expression -- ${exp.ctype.emit()}`);
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        const decl = exp.ctype.decl;
        if (decl instanceof AbstractCollectionTypeDecl) {
            return this.checkCollectionConstructor(env, decl, exp);
        }
        else if (decl instanceof ConstructableTypeDecl) {
            return this.checkSpecialConstructableConstructor(env, decl, exp);
        }
        else if (decl instanceof TypedeclTypeDecl) {
            return this.checkSpecialTypeDeclConstructor(env, decl, exp);
        }
        else {
            if (decl instanceof EntityTypeDecl) {
                return this.checkStandardConstructor(env, decl.fields, exp);
            }
            else if (decl instanceof DatatypeMemberEntityTypeDecl) {
                return this.checkStandardConstructor(env, decl.fields, exp);
            }
            else {
                this.reportError(exp.sinfo, `Invalid type for constructor expression -- ${exp.ctype.emit()}`);
                return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
            }
        }
    }
    checkConstructorEListExpression(env, exp, infertype) {
        if (infertype === undefined) {
            const ttypes = exp.args.args.map((arg) => this.checkExpression(env, arg.exp, undefined));
            const rel = new EListTypeSignature(exp.sinfo, ttypes);
            return exp.setType(rel);
        }
        else {
            let iopts = [];
            if (infertype instanceof EListStyleTypeInferContext) {
                let itype = infertype;
                iopts = itype.elist;
            }
            else {
                const itype = infertype.ttype;
                if (!(itype instanceof EListTypeSignature)) {
                    this.reportError(exp.sinfo, `Invalid type for list constructor -- ${itype.emit()}`);
                    return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
                }
                iopts = itype.entries;
            }
            if (iopts.length !== exp.args.args.length) {
                this.reportError(exp.sinfo, `List constructor expects ${iopts.length} arguments but got ${exp.args.args.length}`);
                return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
            }
            let ttypes = [];
            for (let i = 0; i < exp.args.args.length; ++i) {
                const etype = this.checkExpression(env, exp.args.args[i].exp, i < iopts.length ? new SimpleTypeInferContext(iopts[i]) : undefined);
                if (iopts[i] === undefined) {
                    ttypes.push(etype);
                }
                else {
                    this.checkError(exp.sinfo, !(etype instanceof ErrorTypeSignature) && !this.relations.isSubtypeOf(etype, iopts[i], this.constraints), `Type ${etype.emit()} is not a subtype of ${iopts[i].emit()} as expected`);
                    ttypes.push(iopts[i]);
                }
            }
            const rel = new EListTypeSignature(exp.sinfo, ttypes);
            return exp.setType(rel);
        }
    }
    checkConstructorLambdaExpression(env, exp, infertype) {
        let itype = undefined;
        if (infertype !== undefined && infertype instanceof LambdaTypeSignature && infertype.params.length === exp.invoke.params.length) {
            itype = infertype;
        }
        let argsok = true;
        let args = [];
        let params = [];
        let rtype = new ErrorTypeSignature(exp.sinfo, undefined);
        if (exp.invoke.isAuto) {
            if (itype == undefined || itype.params.length !== exp.invoke.params.length) {
                argsok = false;
                this.reportError(exp.sinfo, `Cannot infer type for lambda constructor`);
            }
            else {
                for (let i = 0; i < itype.params.length; ++i) {
                    const iptype = itype.params[i];
                    const ipdecl = exp.invoke.params[i];
                    args.push(new VarInfo(ipdecl.name, iptype.type, ipdecl.pkind || "let", true));
                    params.push(new InvokeParameterDecl(ipdecl.name, iptype.type, undefined, ipdecl.pkind, ipdecl.isRestParam));
                }
            }
        }
        else {
            for (let i = 0; i < exp.invoke.params.length; ++i) {
                const ipdecl = exp.invoke.params[i];
                args.push(new VarInfo(ipdecl.name, ipdecl.type, ipdecl.pkind || "let", true));
                params.push(new InvokeParameterDecl(ipdecl.name, ipdecl.type, undefined, ipdecl.pkind, ipdecl.isRestParam));
            }
        }
        if (!(exp.invoke.resultType instanceof AutoTypeSignature)) {
            rtype = exp.invoke.resultType;
        }
        else {
            if (itype !== undefined) {
                rtype = itype.resultType;
            }
            else {
                this.reportError(exp.sinfo, `Cannot infer type for lambda constructor`);
            }
        }
        //check that we don't have a lambda parameter that takes a lambda
        for (let i = 0; i < params.length; ++i) {
            const ptype = params[i].type;
            if (ptype instanceof LambdaTypeSignature) {
                this.reportError(exp.sinfo, `Lambda parameters cannot be a lambda type --  ${params[i].name}`);
                argsok = false;
            }
        }
        if (!argsok || (rtype instanceof ErrorTypeSignature)) {
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        else {
            const lparams = params.map((p) => new LambdaParameterSignature(p.name, p.type, p.pkind, p.isRestParam));
            const ltype = new LambdaTypeSignature(exp.sinfo, exp.invoke.recursive, exp.invoke.name, lparams, rtype);
            const ireturn = this.relations.convertTypeSignatureToTypeInferCtx(rtype);
            const lenv = TypeEnvironment.createInitialLambdaEnv(rtype, ireturn, args, env);
            const fenv = this.checkBodyImplementation(lenv, exp.invoke.body, params);
            //note what escapes here and also resolve upwards
            exp.lcaptures = fenv.lcaptures.map((c) => {
                return { vname: c.vname, vtype: c.vtype, ocapture: lenv.resolveOCaptureInfoFromSrcName(c.vname) };
            });
            for (let i = 0; i < exp.lcaptures.length; ++i) {
                env.resolveLambdaCaptureVarInfoFromSrcName(exp.lcaptures[i].vname);
            }
            exp.monomorphizedUID = this.lambdaCtr++;
            return exp.setType(ltype);
        }
    }
    checkLambdaInvokeExpression(env, exp, refallowed) {
        let llvar = env.resolveLocalVarInfoFromSrcName(exp.name);
        if (llvar === undefined) {
            const clvar = env.resolveLambdaCaptureVarInfoFromSrcName(exp.name);
            if (clvar === undefined) {
                this.reportError(exp.sinfo, `Could not find lambda variable ${exp.name}`);
                return TypeResultWRefVarInfoResult.makeSimpleResult(new ErrorTypeSignature(exp.sinfo, undefined));
            }
            else {
                llvar = clvar;
                exp.isCapturedLambda = true;
                exp.ocapture = env.resolveOCaptureInfoFromSrcName(exp.name);
            }
        }
        if (!(llvar.decltype instanceof LambdaTypeSignature)) {
            this.reportError(exp.sinfo, `Variable ${exp.name} is not a lambda value`);
            return TypeResultWRefVarInfoResult.makeSimpleResult(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        const lsig = llvar.decltype;
        const arginfo = this.checkLambdaArgumentList(exp.sinfo, env, refallowed, exp.args.args, lsig.params);
        exp.lambda = llvar.decltype;
        exp.arginfo = arginfo.arginfo;
        exp.resttype = arginfo.resttype;
        exp.restinfo = arginfo.restinfo;
        exp.setcondout = arginfo.setcondout;
        exp.setuncond = arginfo.setuncond;
        exp.inout = arginfo.inout;
        exp.byref = arginfo.byref;
        exp.monoinvid = this.invidCtr++;
        const rrt = TypeResultWRefVarInfoResult.makeGeneralResult(exp.setType(lsig.resultType), false, false, { ttrue: [...arginfo.setcondout], tfalse: [] }, [...arginfo.setuncond], [...arginfo.inout, ...arginfo.byref], []);
        if (rrt !== undefined) {
            return rrt;
        }
        else {
            return TypeResultWRefVarInfoResult.makeSimpleResult(exp.setType(new ErrorTypeSignature(exp.sinfo, undefined)));
        }
    }
    checkSpecialConstructorExpressionNoInfer(env, exp) {
        const corens = this.relations.assembly.getCoreNamespace();
        const etype = this.checkExpression(env, exp.arg, undefined);
        if ((etype instanceof ErrorTypeSignature)) {
            this.reportError(exp.sinfo, `Invalid type for special constructor -- got ${etype.emit()}`);
            return exp.setType(etype);
        }
        if (exp.rop === "some") {
            exp.constype = new NominalTypeSignature(exp.sinfo, undefined, corens.typedecls.find((td) => td.name === "Some"), [etype]);
            return exp.setType(exp.constype);
        }
        else {
            this.reportError(exp.sinfo, "Cannot infer type for other special constructors");
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
    }
    checkSpecialConstructorExpression(env, exp, infertype) {
        if (infertype === undefined || !(infertype instanceof NominalTypeSignature)) {
            return this.checkSpecialConstructorExpressionNoInfer(env, exp);
        }
        else {
            const ninfer = infertype;
            if (exp.rop === "some") {
                if (ninfer.decl instanceof SomeTypeDecl) {
                    const ttype = ninfer.alltermargs[0];
                    const etype = this.checkExpression(env, exp.arg, new SimpleTypeInferContext(ttype));
                    this.checkError(exp.sinfo, etype instanceof ErrorTypeSignature || !this.relations.isSubtypeOf(etype, ttype, this.constraints), `Some constructor argument is not a subtype of ${ttype.emit()}`);
                    exp.constype = ninfer;
                    return exp.setType(ninfer);
                }
                else if (ninfer.decl instanceof OptionTypeDecl) {
                    const ttype = ninfer.alltermargs[0];
                    const etype = this.checkExpression(env, exp.arg, new SimpleTypeInferContext(ttype));
                    this.checkError(exp.sinfo, etype instanceof ErrorTypeSignature || !this.relations.isSubtypeOf(etype, ttype, this.constraints), `Some constructor argument is not a subtype of ${ttype.emit()}`);
                    exp.constype = new NominalTypeSignature(exp.sinfo, undefined, this.relations.assembly.getCoreNamespace().typedecls.find((td) => td.name === "Some"), [ttype]);
                    return exp.setType(exp.constype);
                }
                else {
                    return this.checkSpecialConstructorExpressionNoInfer(env, exp);
                }
            }
            else if (exp.rop === "ok") {
                if (ninfer.decl instanceof OkTypeDecl) {
                    const ttype = ninfer.alltermargs[0];
                    const etype = this.checkExpression(env, exp.arg, new SimpleTypeInferContext(ttype));
                    this.checkError(exp.sinfo, etype instanceof ErrorTypeSignature || !this.relations.isSubtypeOf(etype, ttype, this.constraints), `Ok constructor argument is not a subtype of ${ttype.emit()}`);
                    exp.constype = ninfer;
                    return exp.setType(ninfer);
                }
                else if (ninfer.decl instanceof ResultTypeDecl) {
                    const ttype = ninfer.alltermargs[0];
                    const etype = this.checkExpression(env, exp.arg, new SimpleTypeInferContext(ttype));
                    this.checkError(exp.sinfo, etype instanceof ErrorTypeSignature || !this.relations.isSubtypeOf(etype, ttype, this.constraints), `Ok constructor argument is not a subtype of ${ttype.emit()}`);
                    exp.constype = new NominalTypeSignature(exp.sinfo, undefined, ninfer.decl.getOkType(), [ttype, ninfer.alltermargs[1]]);
                    return exp.setType(exp.constype);
                }
                else {
                    this.reportError(exp.sinfo, `Cannot infer type for special Ok constructor -- got ${infertype.emit()}`);
                    return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
                }
            }
            else {
                if (ninfer.decl instanceof FailTypeDecl) {
                    const ttype = ninfer.alltermargs[1];
                    const etype = this.checkExpression(env, exp.arg, new SimpleTypeInferContext(ttype));
                    this.checkError(exp.sinfo, etype instanceof ErrorTypeSignature || !this.relations.isSubtypeOf(etype, ttype, this.constraints), `Fail constructor argument is not a subtype of ${ttype.emit()}`);
                    exp.constype = ninfer;
                    return exp.setType(ninfer);
                }
                else if (ninfer.decl instanceof ResultTypeDecl) {
                    const ttype = ninfer.alltermargs[1];
                    const etype = this.checkExpression(env, exp.arg, new SimpleTypeInferContext(ttype));
                    this.checkError(exp.sinfo, etype instanceof ErrorTypeSignature || !this.relations.isSubtypeOf(etype, ttype, this.constraints), `Err constructor argument is not a subtype of ${ttype.emit()}`);
                    exp.constype = new NominalTypeSignature(exp.sinfo, undefined, ninfer.decl.getFailType(), [ninfer.alltermargs[0], ttype]);
                    return exp.setType(exp.constype);
                }
                else {
                    this.reportError(exp.sinfo, `Cannot infer type for special Fail constructor -- got ${infertype.emit()}`);
                    return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
                }
            }
        }
    }
    checkCallNamespaceFunctionExpression(env, exp, refallowed) {
        const hastemplate = exp.terms.length > 0;
        const haslambda = exp.args.args.some((arg) => {
            if (!(arg instanceof PositionalArgumentValue)) {
                return false;
            }
            const eexp = arg.exp;
            if (eexp instanceof ConstructorLambdaExpression) {
                return true;
            }
            else if (eexp instanceof AccessVariableExpression) {
                const atype = this.checkAccessVariableExpression(env, eexp);
                return atype instanceof LambdaTypeSignature;
            }
            else {
                return false;
            }
        });
        const fdecl = this.relations.assembly.resolveNamespaceFunction(exp.ns, exp.name, hastemplate, haslambda, exp.args.hasSpecialRef());
        if (fdecl === undefined) {
            this.reportError(exp.sinfo, `Could not find namespace function ${exp.ns.emit()}::${exp.name}`);
            return TypeResultWRefVarInfoResult.makeSimpleResult(exp.setType(new ErrorTypeSignature(exp.sinfo, undefined)));
        }
        const imapper = this.checkTemplateBindingsOnInvokeSig(exp.sinfo, exp.terms, fdecl);
        if (imapper === undefined) {
            return TypeResultWRefVarInfoResult.makeSimpleResult(exp.setType(new ErrorTypeSignature(exp.sinfo, undefined)));
        }
        this.checkTemplateBindingsOnInvokeConstraints(exp.sinfo, imapper, fdecl);
        const arginfo = this.checkArgumentList(exp.sinfo, env, refallowed, exp.args.args, fdecl.params, imapper);
        exp.resolvedFunction = fdecl;
        exp.shuffleinfo = arginfo.shuffleinfo;
        exp.resttype = arginfo.resttype;
        exp.restinfo = arginfo.restinfo;
        exp.setcondout = arginfo.setcondout;
        exp.setuncond = arginfo.setuncond;
        exp.inout = arginfo.inout;
        exp.byref = arginfo.byref;
        exp.monoinvid = this.invidCtr++;
        const rrt = TypeResultWRefVarInfoResult.makeGeneralResult(exp.setType(fdecl.resultType.remapTemplateBindings(imapper)), false, false, { ttrue: [...arginfo.setcondout], tfalse: [] }, [...arginfo.setuncond], [...arginfo.inout, ...arginfo.byref], []);
        if (rrt !== undefined) {
            return rrt;
        }
        else {
            return TypeResultWRefVarInfoResult.makeSimpleResult(exp.setType(new ErrorTypeSignature(exp.sinfo, undefined)));
        }
    }
    checkCallTypeFunctionExpression(env, exp, refallowed) {
        const oktype = this.checkTypeSignature(exp.ttype);
        if (!oktype) {
            return TypeResultWRefVarInfoResult.makeSimpleResult(exp.setType(new ErrorTypeSignature(exp.sinfo, undefined)));
        }
        const hastemplate = exp.terms.length > 0;
        const haslambda = exp.args.args.some((arg) => {
            if (!(arg instanceof PositionalArgumentValue)) {
                return false;
            }
            const eexp = arg.exp;
            if (eexp instanceof ConstructorLambdaExpression) {
                return true;
            }
            else if (eexp instanceof AccessVariableExpression) {
                const atype = this.checkAccessVariableExpression(env, eexp);
                return atype instanceof LambdaTypeSignature;
            }
            else {
                return false;
            }
        });
        const fdecl = this.relations.resolveTypeFunction(exp.ttype, exp.name, hastemplate, haslambda, exp.args.hasSpecialRef(), this.constraints);
        if (fdecl === undefined) {
            this.reportError(exp.sinfo, `Could not find type scoped function ${exp.ttype.emit()}::${exp.name}`);
            return TypeResultWRefVarInfoResult.makeSimpleResult(exp.setType(new ErrorTypeSignature(exp.sinfo, undefined)));
        }
        exp.resolvedDeclType = fdecl.typeinfo.tsig;
        exp.monoinvid = this.invidCtr++;
        //special case for type Foo = String of ... Foo::from
        if (fdecl.member === null) {
            if (exp.args.args.length !== 1 || !(exp.args.args[0] instanceof PositionalArgumentValue)) {
                this.reportError(exp.sinfo, `Conversion from expects 1 argument`);
                return TypeResultWRefVarInfoResult.makeSimpleResult(exp.setType(new ErrorTypeSignature(exp.sinfo, undefined)));
            }
            const etype = this.checkExpression(env, exp.args.args[0].exp, undefined);
            this.checkError(exp.sinfo, !(etype instanceof NominalTypeSignature), `Invalid arg type for conversion from ${etype.emit()} -- converting to ${fdecl.typeinfo.tsig.emit()}`);
            if (etype instanceof NominalTypeSignature) {
                if (etype.decl instanceof PrimitiveEntityTypeDecl) {
                    this.checkError(exp.sinfo, !this.relations.areSameTypes(fdecl.typeinfo.tsig.decl.valuetype, etype), `Invalid arg type for conversion from ${etype.emit()} -- converting to ${fdecl.typeinfo.tsig.emit()}`);
                }
                else if (etype.decl instanceof TypedeclTypeDecl) {
                    this.checkError(exp.sinfo, !this.relations.areSameTypes(fdecl.typeinfo.tsig.decl.valuetype, etype.decl.valuetype), `Invalid arg type for conversion from ${etype.emit()} -- converting to ${fdecl.typeinfo.tsig.emit()}`);
                }
                else {
                    this.reportError(exp.sinfo, `Invalid arg type for conversion from ${etype.emit()} -- converting to ${fdecl.typeinfo.tsig.emit()}`);
                }
            }
            exp.isSpecialCall = true;
            exp.shuffleinfo = [[0, etype]];
            exp.resttype = undefined;
            exp.restinfo = undefined;
            exp.setcondout = [];
            exp.setuncond = [];
            exp.inout = [];
            exp.byref = [];
            return TypeResultWRefVarInfoResult.makeSimpleResult(exp.setType(fdecl.typeinfo.tsig));
        }
        else {
            const imapper = this.checkTemplateBindingsOnInvokeSig(exp.sinfo, exp.terms, fdecl.member);
            if (imapper === undefined) {
                return TypeResultWRefVarInfoResult.makeSimpleResult(exp.setType(new ErrorTypeSignature(exp.sinfo, undefined)));
            }
            const fullmapper = TemplateNameMapper.merge(fdecl.typeinfo.mapping, imapper);
            this.checkTemplateBindingsOnInvokeConstraints(exp.sinfo, fullmapper, fdecl.member);
            const arginfo = this.checkArgumentList(exp.sinfo, env, refallowed, exp.args.args, fdecl.member.params, fullmapper);
            exp.resolvedFunction = fdecl.member;
            exp.shuffleinfo = arginfo.shuffleinfo;
            exp.resttype = arginfo.resttype;
            exp.restinfo = arginfo.restinfo;
            exp.setcondout = arginfo.setcondout;
            exp.setuncond = arginfo.setuncond;
            exp.inout = arginfo.inout;
            exp.byref = arginfo.byref;
            const rrt = TypeResultWRefVarInfoResult.makeGeneralResult(exp.setType(fdecl.member.resultType.remapTemplateBindings(fullmapper)), false, false, { ttrue: [...arginfo.setcondout], tfalse: [] }, [...arginfo.setuncond], [...arginfo.inout, ...arginfo.byref], []);
            if (rrt !== undefined) {
                return rrt;
            }
            else {
                return TypeResultWRefVarInfoResult.makeSimpleResult(exp.setType(new ErrorTypeSignature(exp.sinfo, undefined)));
            }
        }
    }
    checkParseAsTypeExpression(env, exp) {
        /*
        const oktype = this.checkTypeSignature(exp.ttype);
        const etype = this.checkExpression(env, exp.exp, oktype ? new SimpleTypeInferContext(exp.ttype) : undefined);
        if(!oktype) {
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }

        this.checkError(exp.sinfo, etype instanceof ErrorTypeSignature || !this.relations.isSubtypeOf(etype, exp.ttype, this.constraints), `ParseAsType expression is not a subtype of ${exp.ttype.emit()}`);
        return exp.setType(exp.ttype);
        */
        assert(false, "Not Implemented -- checkParseAsTypeExpression");
    }
    checkInterpolationArguments(sinfo, iscstrunderly, env, args, fmtparams) {
        if (args.length !== fmtparams.length) {
            this.reportError(sinfo, `Interpolate must have same number of parameters and arguments`);
            return;
        }
        const argsallnamed = args.every((arg) => arg instanceof NamedArgumentValue);
        const paramsallpositional = fmtparams.every((p) => p.argname === "_");
        const paramsallnamed = fmtparams.every((p) => p.argname !== "_");
        if (paramsallpositional) {
            const argsallpositional = args.every((arg) => arg instanceof PositionalArgumentValue);
            if (!argsallpositional) {
                this.reportError(sinfo, `InterpolateFormatExpression with positional format parameters must have all positional arguments`);
                return;
            }
            for (let i = 0; i < args.length; i++) {
                const argtype = this.checkExpression(env, args[i].exp, fmtparams[i].argtype);
                if (iscstrunderly) {
                    if (this.relations.isSubtypeOf(fmtparams[i].argtype, this.getWellKnownType("CString"), this.constraints)) {
                        const btype = !(argtype instanceof ErrorTypeSignature) ? this.resolveUnderlyingType(argtype) || argtype : argtype;
                        this.checkError(sinfo, btype instanceof ErrorTypeSignature || !this.relations.isSubtypeOf(btype, this.getWellKnownType("CString"), this.constraints), `Interpolation argument ${i} is not a subtype of CString as required for CString format string`);
                    }
                    else {
                        this.checkError(sinfo, argtype instanceof ErrorTypeSignature || !this.relations.isSubtypeOf(argtype, fmtparams[i].argtype, this.constraints), `Interpolation argument ${i} is not a subtype of ${fmtparams[i].argtype.emit()}`);
                    }
                }
                else {
                    if (this.relations.isSubtypeOf(fmtparams[i].argtype, this.getWellKnownType("String"), this.constraints)) {
                        const btype = !(argtype instanceof ErrorTypeSignature) ? this.resolveUnderlyingType(argtype) || argtype : argtype;
                        this.checkError(sinfo, btype instanceof ErrorTypeSignature || !this.relations.isSubtypeOf(btype, this.getWellKnownType("String"), this.constraints), `Interpolation argument ${i} is not a subtype of String as required for String format string`);
                    }
                    else {
                        this.checkError(sinfo, argtype instanceof ErrorTypeSignature || !this.relations.isSubtypeOf(argtype, fmtparams[i].argtype, this.constraints), `Interpolation argument ${i} is not a subtype of ${fmtparams[i].argtype.emit()}`);
                    }
                }
            }
        }
        if (paramsallnamed) {
            if (!argsallnamed) {
                this.reportError(sinfo, `InterpolateFormatExpression with named format parameters must have all named arguments`);
                return;
            }
            for (let i = 0; i < args.length; i++) {
                const arg = args[i];
                const param = fmtparams.find((p) => p.argname === arg.name);
                if (param === undefined) {
                    this.reportError(sinfo, `Interpolation argument ${arg.name} does not match any format parameter`);
                    continue;
                }
                const argtype = this.checkExpression(env, arg.exp, param.argtype);
                this.checkError(sinfo, argtype instanceof ErrorTypeSignature || !this.relations.isSubtypeOf(argtype, param.argtype, this.constraints), `Interpolation argument ${arg.name} is not a subtype of ${param.argtype.emit()}`);
            }
        }
    }
    checkInterpolateFormatExpression(env, exp) {
        const fmtkind = this.checkExpression(env, exp.fmtString, undefined);
        if (exp.kind === "cstring") {
            if (!(fmtkind instanceof FormatStringTypeSignature) || fmtkind.oftype !== "CString") {
                this.reportError(exp.sinfo, `InterpolateFormatExpression with kind "cstring" must have a CString format string`);
                return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
            }
            if (exp.decloftype !== undefined) {
                this.checkTypeSignature(exp.decloftype);
                const isresultsimple = this.relations.isSubtypeOf(exp.decloftype, this.getWellKnownType("CString"), this.constraints);
                const isformatsimple = this.relations.isSubtypeOf(fmtkind.rtype, this.getWellKnownType("CString"), this.constraints);
                //if either is simple then we always allow it
                if (!isresultsimple && !isformatsimple) {
                    this.checkError(exp.sinfo, !this.relations.isSubtypeOf(exp.decloftype, fmtkind.rtype, this.constraints), `Declared oftype ${exp.decloftype.emit()} is not compatible with format string result type ${fmtkind.rtype.emit()}`);
                }
            }
            this.checkTypeSignature(fmtkind.rtype);
            this.checkInterpolationArguments(exp.sinfo, true, env, exp.args, fmtkind.terms);
            exp.actualoftype = fmtkind.rtype;
            return exp.setType(fmtkind.rtype);
        }
        else if (exp.kind === "string") {
            if (!(fmtkind instanceof FormatStringTypeSignature) || fmtkind.oftype !== "String") {
                this.reportError(exp.sinfo, `InterpolateFormatExpression with kind "string" must have a String format string`);
                return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
            }
            if (exp.decloftype !== undefined) {
                this.checkTypeSignature(exp.decloftype);
                const isresultsimple = this.relations.isSubtypeOf(exp.decloftype, this.getWellKnownType("String"), this.constraints);
                const isformatsimple = this.relations.isSubtypeOf(fmtkind.rtype, this.getWellKnownType("String"), this.constraints);
                //if either is simple then we always allow it
                if (!isresultsimple && !isformatsimple) {
                    this.checkError(exp.sinfo, !this.relations.isSubtypeOf(exp.decloftype, fmtkind.rtype, this.constraints), `Declared oftype ${exp.decloftype.emit()} is not compatible with format string result type ${fmtkind.rtype.emit()}`);
                }
            }
            this.checkTypeSignature(fmtkind.rtype);
            this.checkInterpolationArguments(exp.sinfo, false, env, exp.args, fmtkind.terms);
            exp.actualoftype = fmtkind.rtype;
            return exp.setType(fmtkind.rtype);
        }
        else {
            assert(false, "checkInterpolateFormatExpression -- unknown kind");
        }
    }
    ////////
    // Postfix Expressions
    checkPostfixAccessFromName(env, exp, rcvrtype) {
        const finfo = this.relations.resolveTypeField(rcvrtype, exp.name, this.constraints);
        if (finfo === undefined) {
            this.reportError(exp.sinfo, `Could not find field ${exp.name} in type ${rcvrtype.emit()}`);
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        else {
            exp.declaredInType = finfo.typeinfo.tsig;
            exp.fieldDecl = finfo.member;
            exp.fieldType = finfo.member.declaredType.remapTemplateBindings(finfo.typeinfo.mapping);
            exp.isdirect = this.relations.isDirectNominalType(finfo.typeinfo.tsig, this.constraints);
        }
        return exp.setType(finfo.member.declaredType.remapTemplateBindings(finfo.typeinfo.mapping));
    }
    checkPostfixProjectFromNames(env, exp, rcvrtype, infertype) {
        assert(false, "Not Implemented -- checkPostfixProjectFromNames");
    }
    checkPostfixAccessFromIndex(env, exp, rcvrtype) {
        if (!(rcvrtype instanceof EListTypeSignature)) {
            this.reportError(exp.sinfo, `Cannot access index from non-elist type ${rcvrtype.emit()}`);
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        if (exp.idx >= rcvrtype.entries.length) {
            this.reportError(exp.sinfo, `Index ${exp.idx} out of bounds for elist type ${rcvrtype.emit()}`);
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        return exp.setType(rcvrtype.entries[exp.idx]);
    }
    checkPostfixIsTest(env, exp, rcvrtype) {
        const splits = this.processITestAsBoolean(exp.sinfo, env, rcvrtype, exp.ttest);
        this.checkError(exp.sinfo, !splits.ttrue, "Test is never true");
        this.checkError(exp.sinfo, !splits.tfalse, "Test is never false");
        return exp.setType(this.getWellKnownType("Bool"));
    }
    checkPostfixAsConvert(env, exp, rcvrtype) {
        const splits = this.processITestAsConvert(exp.sinfo, env, rcvrtype, exp.ttest);
        this.checkError(exp.sinfo, splits.ttrue === undefined, "Convert always fails");
        //if always true then this is an upcast and OK!
        exp.alwaysSucceeds = splits.tfalse === undefined;
        return exp.setType(splits.ttrue || new ErrorTypeSignature(exp.sinfo, undefined));
    }
    checkPostfixAssignFields(env, exp, rcvrtype) {
        /*
        const [okupdate, isdirect] = TypeChecker.isTypeUpdatable(rcvrtype);
        if(!okupdate) {
            this.reportError(rcvrtype.sinfo, `Expression is not an updatable type (entity/concept or datatype)`);
            return rcvrtype;
        }

        const updates = exp.updates.map((upd) => {
            const bname = "$" + upd[0];
            const ftype = this.getFieldType(rcvrtype, upd[0]);

            if(ftype === undefined) {
                this.reportError(exp.sinfo, `Field ${upd[0]} is not a member of type ${rcvrtype.emit()}`);
                return {fieldname: upd[0], fieldtype: new ErrorTypeSignature(exp.sinfo, undefined), etype: new ErrorTypeSignature(exp.sinfo, undefined)};
            }

            const cenv = env.pushNewLocalBinderScope(bname, ftype);
            const etype = this.checkExpression(cenv, upd[1], new SimpleTypeInferContext(ftype));
            if(!(etype instanceof ErrorTypeSignature) && !this.relations.isSubtypeOf(etype, ftype, this.constraints)) {
                this.reportError(exp.sinfo, `Expression of type ${etype.emit()} cannot be assigned to field ${upd[0]} of type ${ftype.emit()}`);
            }

            return {fieldname: upd[0], fieldtype: ftype, etype: etype};
        });

        exp.updatetype = rcvrtype;
        exp.updateinfo = updates;
        exp.isdirect = isdirect;

        return rcvrtype;
        */
        assert(false, "Not Implemented -- checkPostfixAssignFields");
    }
    postfixInvokeStaticResolve(env, mdeclaration, name, isTemplate, hasLambda, isRef, resolvefrom) {
        if (mdeclaration.member.attributes.every((attr) => attr.name !== "virtual" && attr.name !== "abstract")) {
            return mdeclaration; //There is no overloading so the declaration is the implementation!
        }
        const tdecl = resolvefrom.decl;
        if (tdecl instanceof AbstractEntityTypeDecl) {
            return this.relations.resolveTypeMethodDeclaration(resolvefrom, name, isTemplate, hasLambda, isRef, this.constraints); //a concrete subtype so we can resolve statically
        }
        return undefined; //otherwise we have to do dynamic dispatch
    }
    checkPostfixInvoke(env, exp, rcvrtype, refallowed) {
        let resolvefrom = rcvrtype;
        if (exp.specificResolve !== undefined) {
            const specificok = this.checkTypeSignature(exp.specificResolve);
            if (specificok) {
                resolvefrom = exp.specificResolve;
            }
        }
        const hastemplate = exp.terms.length > 0;
        const haslambda = exp.args.args.some((arg) => {
            if (!(arg instanceof PositionalArgumentValue)) {
                return false;
            }
            const eexp = arg.exp;
            if (eexp instanceof ConstructorLambdaExpression) {
                return true;
            }
            else if (eexp instanceof AccessVariableExpression) {
                const atype = this.checkAccessVariableExpression(env, eexp);
                return atype instanceof LambdaTypeSignature;
            }
            else {
                return false;
            }
        });
        const mresolve = this.relations.resolveTypeMethodDeclaration(resolvefrom, exp.name, hastemplate, haslambda, exp.args.hasSpecialRef(), this.constraints);
        if (mresolve === undefined) {
            this.reportError(exp.sinfo, `Could not find method ${exp.name} in type ${rcvrtype.emit()}`);
            return TypeResultWRefVarInfoResult.makeSimpleResult(exp.setType(new ErrorTypeSignature(exp.sinfo, undefined)));
        }
        exp.resolvedDeclType = mresolve.typeinfo.tsig;
        exp.resolvedMethodDecl = mresolve.member;
        if (mresolve.member.isThisRef) {
            this.reportError(exp.sinfo, `Method ${exp.name} is a "ref" method and cannot be called without a ref rcvr`);
            return TypeResultWRefVarInfoResult.makeSimpleResult(exp.setType(new ErrorTypeSignature(exp.sinfo, undefined)));
        }
        const imapper = this.checkTemplateBindingsOnInvokeSig(exp.sinfo, exp.terms, mresolve.member);
        if (imapper === undefined) {
            return TypeResultWRefVarInfoResult.makeSimpleResult(exp.setType(new ErrorTypeSignature(exp.sinfo, undefined)));
        }
        exp.monoinvid = this.invidCtr++;
        const fullmapper = TemplateNameMapper.merge(mresolve.typeinfo.mapping, imapper);
        const arginfo = this.checkArgumentList(exp.sinfo, env, refallowed, exp.args.args, mresolve.member.params, fullmapper);
        let resolvedrtype = mresolve.member.resultType;
        if (exp.specificResolve !== undefined) {
            const rrt = this.relations.resolveTypeMethodImplementation(resolvefrom, exp.name, hastemplate, haslambda, exp.args.hasSpecialRef(), this.constraints);
            this.checkError(exp.sinfo, rrt === undefined, `Method ${exp.name} is not specifically resolvable from type ${resolvefrom.emit()}`);
            if (rrt !== undefined) {
                resolvedrtype = rrt.member.resultType;
                exp.resolvedImplType = rrt.typeinfo.tsig;
                exp.resolvedMethodImpl = rrt.member;
            }
        }
        else {
            const smresolve = this.postfixInvokeStaticResolve(env, mresolve, exp.name, hastemplate, haslambda, exp.args.hasSpecialRef(), resolvefrom);
            if (smresolve !== undefined) {
                resolvedrtype = smresolve.member.resultType;
                exp.resolvedImplType = smresolve.typeinfo.tsig;
                exp.resolvedMethodImpl = smresolve.member;
            }
        }
        exp.shuffleinfo = arginfo.shuffleinfo;
        exp.resttype = arginfo.resttype;
        exp.restinfo = arginfo.restinfo;
        exp.setcondout = arginfo.setcondout;
        exp.setuncond = arginfo.setuncond;
        exp.inout = arginfo.inout;
        exp.byref = arginfo.byref;
        const rrt = TypeResultWRefVarInfoResult.makeGeneralResult(exp.setType(resolvedrtype.remapTemplateBindings(fullmapper)), false, false, { ttrue: [...arginfo.setcondout], tfalse: [] }, [...arginfo.setuncond], [...arginfo.inout, ...arginfo.byref], []);
        if (rrt !== undefined) {
            return rrt;
        }
        else {
            return TypeResultWRefVarInfoResult.makeSimpleResult(exp.setType(new ErrorTypeSignature(exp.sinfo, undefined)));
        }
    }
    checkPostfixOp(env, exp, typeinfer) {
        let ctype = this.checkExpression(env, exp.rootExp, undefined);
        if (ctype instanceof ErrorTypeSignature) {
            return exp.setType(ctype);
        }
        for (let i = 0; i < exp.ops.length; ++i) {
            const op = exp.ops[i];
            const texpected = (i === exp.ops.length - 1) ? typeinfer : undefined;
            op.setRcvrType(ctype);
            switch (op.tag) {
                case PostfixOpTag.PostfixAccessFromName: {
                    ctype = this.checkPostfixAccessFromName(env, op, ctype);
                    break;
                }
                case PostfixOpTag.PostfixProjectFromNames: {
                    ctype = this.checkPostfixProjectFromNames(env, op, ctype, texpected);
                    break;
                }
                case PostfixOpTag.PostfixAccessFromIndex: {
                    ctype = this.checkPostfixAccessFromIndex(env, op, ctype);
                    break;
                }
                case PostfixOpTag.PostfixIsTest: {
                    ctype = this.checkPostfixIsTest(env, op, ctype);
                    break;
                }
                case PostfixOpTag.PostfixAsConvert: {
                    ctype = this.checkPostfixAsConvert(env, op, ctype);
                    break;
                }
                case PostfixOpTag.PostfixAssignFields: {
                    ctype = this.checkPostfixAssignFields(env, op, ctype);
                    break;
                }
                case PostfixOpTag.PostfixSliceOperator: {
                    assert(false, "Slice operator not implemented in postfix expressions");
                    break;
                }
                case PostfixOpTag.PostfixInvoke: {
                    ctype = this.checkPostfixInvoke(env, op, ctype, false).tsig;
                    break;
                }
                default: {
                    assert(op.tag === PostfixOpTag.PostfixError, "Unknown postfix op");
                    ctype = new ErrorTypeSignature(op.sinfo, undefined);
                    break;
                }
            }
            op.setType(ctype);
        }
        return exp.setType(ctype);
    }
    checkPostfixOpMaybeRefs(env, exp, typeinfer) {
        let ctype = this.checkExpression(env, exp.rootExp, undefined);
        if (ctype instanceof ErrorTypeSignature) {
            return TypeResultWRefVarInfoResult.makeSimpleResult(exp.setType(ctype));
        }
        const refokpreops = exp.ops.slice(0, exp.ops.length - 1).every((op) => {
            const ttag = op.tag;
            return (ttag === PostfixOpTag.PostfixAccessFromName) || (ttag === PostfixOpTag.PostfixAccessFromIndex) || (ttag === PostfixOpTag.PostfixAsConvert);
        });
        const refokops = refokpreops && exp.ops[exp.ops.length - 1].tag === PostfixOpTag.PostfixInvoke;
        for (let i = 0; i < exp.ops.length; ++i) {
            const op = exp.ops[i];
            const texpected = (i === exp.ops.length - 1) ? typeinfer : undefined;
            op.setRcvrType(ctype);
            switch (op.tag) {
                case PostfixOpTag.PostfixAccessFromName: {
                    ctype = this.checkPostfixAccessFromName(env, op, ctype);
                    break;
                }
                case PostfixOpTag.PostfixProjectFromNames: {
                    ctype = this.checkPostfixProjectFromNames(env, op, ctype, texpected);
                    break;
                }
                case PostfixOpTag.PostfixAccessFromIndex: {
                    ctype = this.checkPostfixAccessFromIndex(env, op, ctype);
                    break;
                }
                case PostfixOpTag.PostfixIsTest: {
                    ctype = this.checkPostfixIsTest(env, op, ctype);
                    break;
                }
                case PostfixOpTag.PostfixAsConvert: {
                    ctype = this.checkPostfixAsConvert(env, op, ctype);
                    break;
                }
                case PostfixOpTag.PostfixAssignFields: {
                    ctype = this.checkPostfixAssignFields(env, op, ctype);
                    break;
                }
                case PostfixOpTag.PostfixSliceOperator: {
                    assert(false, "Slice operator not implemented in postfix expressions");
                    break;
                }
                case PostfixOpTag.PostfixInvoke: {
                    if (!refokops || i < exp.ops.length - 1) {
                        ctype = this.checkPostfixInvoke(env, op, ctype, false).tsig;
                        break;
                    }
                    else {
                        const presult = this.checkPostfixInvoke(env, op, ctype, true);
                        op.setType(presult.tsig);
                        exp.setType(presult.tsig);
                        return presult; //it was the last one
                    }
                }
                default: {
                    assert(op.tag === PostfixOpTag.PostfixError, "Unknown postfix op");
                    ctype = new ErrorTypeSignature(op.sinfo, undefined);
                    break;
                }
            }
            op.setType(ctype);
        }
        return TypeResultWRefVarInfoResult.makeSimpleResult(exp.setType(ctype));
    }
    resolveUnderlyingType(ttype) {
        if (this.relations.isPrimitiveType(ttype)) {
            return ttype;
        }
        else if (this.relations.isEnumType(ttype)) {
            return ttype;
        }
        else if (this.relations.isTypeDeclType(ttype)) {
            return this.relations.getTypeDeclValueType(ttype);
        }
        else if (ttype instanceof TemplateTypeSignature) {
            return ttype;
        }
        else {
            return undefined;
        }
    }
    checkPrefixNotOpExpression(env, exp) {
        const etype = this.checkExpression(env, exp.exp, undefined);
        if (etype instanceof ErrorTypeSignature) {
            return exp.setType(etype);
        }
        this.checkError(exp.sinfo, !this.relations.isBooleanType(etype), "Prefix Not operator requires a Bool based type");
        exp.opertype = this.resolveUnderlyingType(etype);
        return exp.setType(etype);
    }
    checkPrefixNegateOrPlusOpExpression(env, exp) {
        const etype = this.checkExpression(env, exp.exp, undefined);
        if (etype instanceof ErrorTypeSignature) {
            return exp.setType(etype);
        }
        if (this.checkError(exp.sinfo, !this.relations.isNumericType(etype, this.constraints), "Prefix Negate/Plus operator requires a unique numeric type")) {
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        exp.opertype = this.resolveUnderlyingType(etype);
        return exp.setType(etype);
    }
    checkBinaryNumericArgs(env, lhs, rhs) {
        const tlhs = this.checkExpression(env, lhs, undefined);
        if (tlhs instanceof ErrorTypeSignature) {
            return [false, tlhs, tlhs];
        }
        const trhs = this.checkExpression(env, rhs, undefined);
        if (trhs instanceof ErrorTypeSignature) {
            return [false, tlhs, trhs];
        }
        if (this.checkError(lhs.sinfo, !this.relations.isNumericType(tlhs, this.constraints), "Binary operator requires a unique numeric type")) {
            return [false, tlhs, trhs];
        }
        if (this.checkError(rhs.sinfo, !this.relations.isNumericType(trhs, this.constraints), "Binary operator requires a unique numeric type")) {
            return [false, tlhs, trhs];
        }
        return [true, tlhs, trhs];
    }
    checkBinAddExpression(env, exp) {
        const [ok, tlhs, trhs] = this.checkBinaryNumericArgs(env, exp.lhs, exp.rhs);
        if (!ok) {
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        if (this.checkError(exp.sinfo, !this.relations.areSameTypes(tlhs, trhs), "Addition operator requires 2 arguments of the same type")) {
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        exp.opertype = this.resolveUnderlyingType(tlhs);
        return exp.setType(tlhs);
    }
    checkBinSubExpression(env, exp) {
        const [ok, tlhs, trhs] = this.checkBinaryNumericArgs(env, exp.lhs, exp.rhs);
        if (!ok) {
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        if (this.checkError(exp.sinfo, !this.relations.areSameTypes(tlhs, trhs), "Subtraction operator requires 2 arguments of the same type")) {
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        exp.opertype = this.resolveUnderlyingType(tlhs);
        return exp.setType(tlhs);
    }
    checkBinMultExpression(env, exp) {
        const [ok, tlhs, trhs] = this.checkBinaryNumericArgs(env, exp.lhs, exp.rhs);
        if (!ok) {
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        let res;
        if (this.relations.isPrimitiveType(tlhs) && this.relations.isPrimitiveType(trhs)) {
            if (this.checkError(exp.sinfo, !this.relations.areSameTypes(tlhs, trhs), "Multiplication operator requires 2 arguments of the same type")) {
                return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
            }
            res = tlhs;
        }
        else if (this.relations.isTypeDeclType(tlhs) && this.relations.isPrimitiveType(trhs)) {
            const baselhs = this.relations.getTypeDeclValueType(tlhs);
            if (this.checkError(exp.sinfo, baselhs === undefined || !this.relations.areSameTypes(baselhs, trhs), "Multiplication operator requires a unit-less argument that matches underlying unit type")) {
                return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
            }
            res = tlhs;
        }
        else if (this.relations.isPrimitiveType(tlhs) && this.relations.isTypeDeclType(trhs)) {
            const baserhs = this.relations.getTypeDeclValueType(trhs);
            if (this.checkError(exp.sinfo, baserhs === undefined || !this.relations.areSameTypes(tlhs, baserhs), "Multiplication operator requires a unit-less argument that matches underlying unit type")) {
                return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
            }
            res = trhs;
        }
        else {
            this.checkError(exp.sinfo, false, "Multiplication operator not allowed on 2 unit typed values");
            res = new ErrorTypeSignature(exp.sinfo, undefined);
        }
        exp.opertype = !(res instanceof ErrorTypeSignature) ? this.resolveUnderlyingType(res) : res;
        return exp.setType(res);
    }
    checkBinDivExpression(env, exp) {
        const [ok, tlhs, trhs] = this.checkBinaryNumericArgs(env, exp.lhs, exp.rhs);
        if (!ok) {
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }
        let res;
        if (this.relations.isPrimitiveType(tlhs) && this.relations.isPrimitiveType(trhs)) {
            if (this.checkError(exp.sinfo, !this.relations.areSameTypes(tlhs, trhs), "Division operator requires 2 arguments of the same type")) {
                return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
            }
            res = tlhs;
        }
        else if (this.relations.isTypeDeclType(tlhs) && this.relations.isPrimitiveType(trhs)) {
            const baselhs = this.relations.getTypeDeclValueType(tlhs);
            if (this.checkError(exp.sinfo, baselhs === undefined || !this.relations.areSameTypes(baselhs, trhs), "Division operator requires a unit-less divisor argument that matches the underlying unit type")) {
                return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
            }
            res = tlhs;
        }
        else if (this.relations.isTypeDeclType(tlhs) && this.relations.isTypeDeclType(trhs)) {
            if (this.checkError(exp.sinfo, !this.relations.areSameTypes(tlhs, trhs), "Division operator requires 2 arguments of the same type")) {
                return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
            }
            const basetype = this.relations.getTypeDeclValueType(trhs);
            if (this.checkError(exp.sinfo, basetype === undefined, "Division operator requires matching types on the arguments")) {
                return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
            }
            res = basetype;
        }
        else {
            this.checkError(exp.sinfo, false, "Division operator not allowed on with unit typed divisor and a type-less value");
            res = new ErrorTypeSignature(exp.sinfo, undefined);
        }
        exp.opertype = !(res instanceof ErrorTypeSignature) ? this.resolveUnderlyingType(res) : res;
        return exp.setType(res);
    }
    checkBinKeyEqExpression(env, exp) {
        const lhstype = this.checkExpression(env, exp.lhs, undefined);
        const rhstype = this.checkExpression(env, exp.rhs, undefined);
        if (lhstype instanceof ErrorTypeSignature || rhstype instanceof ErrorTypeSignature) {
            return exp.setType(this.getWellKnownType("Bool"));
        }
        const action = this.checkValueEq(exp.lhs, lhstype, exp.rhs, rhstype);
        if (action[0] === "err") {
            this.reportError(exp.sinfo, `Types ${lhstype.emit()} and ${rhstype.emit()} are not comparable`);
        }
        else {
            exp.operkind = action[0];
            exp.opertype = this.resolveUnderlyingType(action[1]);
        }
        return exp.setType(this.getWellKnownType("Bool"));
    }
    checkBinKeyNeqExpression(env, exp) {
        const lhstype = this.checkExpression(env, exp.lhs, undefined);
        const rhstype = this.checkExpression(env, exp.rhs, undefined);
        if (lhstype instanceof ErrorTypeSignature || rhstype instanceof ErrorTypeSignature) {
            return exp.setType(this.getWellKnownType("Bool"));
        }
        const action = this.checkValueEq(exp.lhs, lhstype, exp.rhs, rhstype);
        if (action[0] === "err") {
            this.reportError(exp.sinfo, `Types ${lhstype.emit()} and ${rhstype.emit()} are not comparable`);
        }
        else {
            exp.operkind = action[0];
            exp.opertype = this.resolveUnderlyingType(action[1]);
        }
        return exp.setType(this.getWellKnownType("Bool"));
    }
    checkKeyCompareEqExpression(env, exp) {
        const ktypeok = this.checkTypeSignature(exp.ktype);
        const tlhs = this.checkExpression(env, exp.lhs, ktypeok ? exp.ktype : undefined);
        const trhs = this.checkExpression(env, exp.rhs, ktypeok ? exp.ktype : undefined);
        if (ktypeok) {
            this.checkError(exp.sinfo, !this.relations.isKeyType(tlhs, this.constraints) || !this.relations.areSameTypes(tlhs, exp.ktype), `Type ${tlhs.emit()} is not a (keytype) of ${exp.ktype.emit()}`);
            this.checkError(exp.sinfo, !this.relations.isKeyType(trhs, this.constraints) || !this.relations.areSameTypes(trhs, exp.ktype), `Type ${trhs.emit()} is not a (keytype) of ${exp.ktype.emit()}`);
            exp.optype = this.resolveUnderlyingType(exp.ktype);
        }
        return exp.setType(this.getWellKnownType("Bool"));
    }
    checkKeyCompareLessExpression(env, exp) {
        const ktypeok = this.checkTypeSignature(exp.ktype);
        const tlhs = this.checkExpression(env, exp.lhs, ktypeok ? exp.ktype : undefined);
        const trhs = this.checkExpression(env, exp.rhs, ktypeok ? exp.ktype : undefined);
        if (ktypeok) {
            this.checkError(exp.sinfo, !this.relations.isKeyType(tlhs, this.constraints) || !this.relations.areSameTypes(tlhs, exp.ktype), `Type ${tlhs.emit()} is not a (keytype) of ${exp.ktype.emit()}`);
            this.checkError(exp.sinfo, !this.relations.isKeyType(trhs, this.constraints) || !this.relations.areSameTypes(trhs, exp.ktype), `Type ${trhs.emit()} is not a (keytype) of ${exp.ktype.emit()}`);
            exp.optype = this.resolveUnderlyingType(exp.ktype);
        }
        return exp.setType(this.getWellKnownType("Bool"));
    }
    checkNumericEqExpression(env, exp) {
        const [ok, tlhs, trhs] = this.checkBinaryNumericArgs(env, exp.lhs, exp.rhs);
        if (!ok) {
            return exp.setType(this.getWellKnownType("Bool"));
        }
        this.checkError(exp.sinfo, !this.relations.areSameTypes(tlhs, trhs), "Operator == requires 2 arguments of the same type");
        exp.opertype = this.resolveUnderlyingType(tlhs);
        return exp.setType(this.getWellKnownType("Bool"));
    }
    checkNumericNeqExpression(env, exp) {
        const [ok, tlhs, trhs] = this.checkBinaryNumericArgs(env, exp.lhs, exp.rhs);
        if (!ok) {
            return exp.setType(this.getWellKnownType("Bool"));
        }
        this.checkError(exp.sinfo, !this.relations.areSameTypes(tlhs, trhs), "Operator != requires 2 arguments of the same type");
        exp.opertype = this.resolveUnderlyingType(tlhs);
        return exp.setType(this.getWellKnownType("Bool"));
    }
    checkNumericLessExpression(env, exp) {
        const [ok, tlhs, trhs] = this.checkBinaryNumericArgs(env, exp.lhs, exp.rhs);
        if (!ok) {
            return exp.setType(this.getWellKnownType("Bool"));
        }
        this.checkError(exp.sinfo, !this.relations.areSameTypes(tlhs, trhs), "Operator < requires 2 arguments of the same type");
        exp.opertype = this.resolveUnderlyingType(tlhs);
        return exp.setType(this.getWellKnownType("Bool"));
    }
    checkNumericLessEqExpression(env, exp) {
        const [ok, tlhs, trhs] = this.checkBinaryNumericArgs(env, exp.lhs, exp.rhs);
        if (!ok) {
            return exp.setType(this.getWellKnownType("Bool"));
        }
        this.checkError(exp.sinfo, !this.relations.areSameTypes(tlhs, trhs), "Operator <= requires 2 arguments of the same type");
        exp.opertype = this.resolveUnderlyingType(tlhs);
        return exp.setType(this.getWellKnownType("Bool"));
    }
    checkNumericGreaterExpression(env, exp) {
        const [ok, tlhs, trhs] = this.checkBinaryNumericArgs(env, exp.lhs, exp.rhs);
        if (!ok) {
            return exp.setType(this.getWellKnownType("Bool"));
        }
        this.checkError(exp.sinfo, !this.relations.areSameTypes(tlhs, trhs), "Operator > requires 2 arguments of the same type");
        exp.opertype = this.resolveUnderlyingType(tlhs);
        return exp.setType(this.getWellKnownType("Bool"));
    }
    checkNumericGreaterEqExpression(env, exp) {
        const [ok, tlhs, trhs] = this.checkBinaryNumericArgs(env, exp.lhs, exp.rhs);
        if (!ok) {
            return exp.setType(this.getWellKnownType("Bool"));
        }
        this.checkError(exp.sinfo, !this.relations.areSameTypes(tlhs, trhs), "Operator >= requires 2 arguments of the same type");
        exp.opertype = this.resolveUnderlyingType(tlhs);
        return exp.setType(this.getWellKnownType("Bool"));
    }
    checkBinaryBooleanArg(env, arg) {
        const targ = this.checkExpression(env, arg, undefined);
        if (targ instanceof ErrorTypeSignature) {
            return undefined;
        }
        this.checkError(arg.sinfo, !this.relations.isBooleanType(targ), "Binary operator requires a Bool type");
        return targ;
    }
    checkBinLogicAndExpression(env, exp) {
        const etypes = exp.exps.map((arg) => this.checkBinaryBooleanArg(env, arg));
        const oftype = etypes.find((t) => t !== undefined);
        if (oftype === undefined) {
            return exp.setType(this.getWellKnownType("Bool"));
        }
        else {
            this.checkError(exp.sinfo, etypes.some((t) => t !== undefined && t.tkeystr !== oftype.tkeystr), "Logic And expressions require all arguments to be of the same (Bool compatible) type");
            const ft = etypes.every((t) => t !== undefined && t.tkeystr === oftype.tkeystr) ? oftype : this.getWellKnownType("Bool");
            return exp.setType(ft);
        }
    }
    checkBinLogicOrExpression(env, exp) {
        const etypes = exp.exps.map((arg) => this.checkBinaryBooleanArg(env, arg));
        const oftype = etypes.find((t) => t !== undefined);
        if (oftype === undefined) {
            return exp.setType(this.getWellKnownType("Bool"));
        }
        else {
            this.checkError(exp.sinfo, etypes.some((t) => t !== undefined && t.tkeystr !== oftype.tkeystr), "Logic Or expressions require all arguments to be of the same (Bool compatible) type");
            const ft = etypes.every((t) => t !== undefined && t.tkeystr === oftype.tkeystr) ? oftype : this.getWellKnownType("Bool");
            return exp.setType(ft);
        }
    }
    checkHoleExpression(env, exp, typeinfer) {
        assert(false, "Not Implemented -- checkHoleExpression");
    }
    checkMapEntryConstructorExpression(env, exp, infertype) {
        /*
        const ioktype = infertype !== undefined && (infertype instanceof NominalTypeSignature) && (infertype.decl instanceof MapEntryTypeDecl);
        if(!ioktype) {
            this.reportError(exp.sinfo, `MapEntryConstructor requires a MapEntry type as the inferred type`);
            return exp.setType(new ErrorTypeSignature(exp.sinfo, undefined));
        }

        const iktype: TypeSignature = infertype.alltermargs[0];
        const ktype = this.checkExpression(env, exp.kexp, new SimpleTypeInferContext(iktype));
        this.checkError(exp.sinfo, !this.relations.isKeyType(iktype, this.constraints), `MapEntryConstructor requires a key type as the first argument`);
        this.checkError(exp.sinfo, ktype instanceof ErrorTypeSignature || !this.relations.isSubtypeOf(ktype, iktype, this.constraints), `MapEntryConstructor key expression is not a subtype of ${iktype.emit()}`);

        let ivtype: TypeSignature = infertype.alltermargs[1];
        const vtype = this.checkExpression(env, exp.vexp, new SimpleTypeInferContext(ivtype));
        this.checkError(exp.sinfo, vtype instanceof ErrorTypeSignature || !this.relations.isSubtypeOf(vtype, ivtype, this.constraints), `MapEntryConstructor value expression is not a subtype of ${ivtype.emit()}`);

        exp.ctype = infertype;
        return exp.setType(infertype);
        */
        assert(false, "Not Implemented -- checkMapEntryConstructorExpression");
    }
    ////////
    //statement expressions
    checkExpression(env, exp, typeinfer) {
        switch (exp.tag) {
            case ExpressionTag.LiteralNoneExpression: {
                return this.checkLiteralNoneExpression(env, exp);
            }
            case ExpressionTag.LiteralBoolExpression: {
                return this.checkLiteralBoolExpression(env, exp);
            }
            case ExpressionTag.LiteralNatExpression: {
                return this.checkLiteralNatExpression(env, exp);
            }
            case ExpressionTag.LiteralIntExpression: {
                return this.checkLiteralIntExpression(env, exp);
            }
            case ExpressionTag.LiteralChkNatExpression: {
                return this.checkLiteralChkNatExpression(env, exp);
            }
            case ExpressionTag.LiteralChkIntExpression: {
                return this.checkLiteralChkIntExpression(env, exp);
            }
            case ExpressionTag.LiteralRationalExpression: {
                return this.checkLiteralRationalExpression(env, exp);
            }
            case ExpressionTag.LiteralFloatExpression: {
                return this.checkLiteralFloatExpression(env, exp);
            }
            case ExpressionTag.LiteralDecimalExpression: {
                return this.checkLiteralDecimalExpression(env, exp);
            }
            case ExpressionTag.LiteralDecimalDegreeExpression: {
                return this.checkLiteralDecimalDegreeExpression(env, exp);
            }
            case ExpressionTag.LiteralLatLongCoordinateExpression: {
                return this.checkLiteralLatLongCoordinateExpression(env, exp);
            }
            case ExpressionTag.LiteralComplexNumberExpression: {
                return this.checkLiteralComplexNumberExpression(env, exp);
            }
            case ExpressionTag.LiteralByteBufferExpression: {
                return this.checkLiteralByteBufferExpression(env, exp);
            }
            case ExpressionTag.LiteralUUIDv4Expression: {
                return this.checkLiteralUUIDv4Expression(env, exp);
            }
            case ExpressionTag.LiteralUUIDv7Expression: {
                return this.checkLiteralUUIDv7Expression(env, exp);
            }
            case ExpressionTag.LiteralSHAContentHashExpression: {
                return this.checkLiteralSHAContentHashExpression(env, exp);
            }
            case ExpressionTag.LiteralTZDateTimeExpression: {
                return this.checkLiteralTZDateTimeExpression(env, exp);
            }
            case ExpressionTag.LiteralTAITimeExpression: {
                return this.checkLiteralTAITimeExpression(env, exp);
            }
            case ExpressionTag.LiteralPlainDateExpression: {
                return this.checkLiteralPlainDateExpression(env, exp);
            }
            case ExpressionTag.LiteralPlainTimeExpression: {
                return this.checkLiteralPlainTimeExpression(env, exp);
            }
            case ExpressionTag.LiteralLogicalTimeExpression: {
                return this.checkLiteralLogicalTimeExpression(env, exp);
            }
            case ExpressionTag.LiteralISOTimeStampExpression: {
                return this.checkLiteralISOTimeStampExpression(env, exp);
            }
            case ExpressionTag.LiteralDeltaDateTimeExpression: {
                return this.checkLiteralDeltaDateTimeExpression(env, exp);
            }
            case ExpressionTag.LiteralDeltaISOTimeStampExpression: {
                return this.checkLiteralDeltaISOTimeStampExpression(env, exp);
            }
            case ExpressionTag.LiteralDeltaSecondsExpression: {
                return this.checkLiteralDeltaSecondsExpression(env, exp);
            }
            case ExpressionTag.LiteralDeltaLogicalExpression: {
                return this.checkLiteralDeltaLogicalExpression(env, exp);
            }
            case ExpressionTag.LiteralUnicodeRegexExpression: {
                return this.checkLiteralUnicodeRegexExpression(env, exp);
            }
            case ExpressionTag.LiteralCRegexExpression: {
                return this.checkLiteralCRegexExpression(env, exp);
            }
            case ExpressionTag.LiteralByteExpression: {
                return this.checkLiteralByteExpression(env, exp);
            }
            case ExpressionTag.LiteralCCharExpression: {
                return this.checkLiteralCCharExpression(env, exp);
            }
            case ExpressionTag.LiteralUnicodeCharExpression: {
                return this.checkLiteralUnicodeCharExpression(env, exp);
            }
            case ExpressionTag.LiteralStringExpression: {
                return this.checkLiteralStringExpression(env, exp);
            }
            case ExpressionTag.LiteralCStringExpression: {
                return this.checkLiteralCStringExpression(env, exp);
            }
            case ExpressionTag.LiteralFormatStringExpression: {
                const itype = TypeInferContext.asSimpleType(typeinfer);
                return this.checkLiteralFormatStringExpression(env, exp, itype);
            }
            case ExpressionTag.LiteralFormatCStringExpression: {
                const itype = TypeInferContext.asSimpleType(typeinfer);
                return this.checkLiteralFormatCStringExpression(env, exp, itype);
            }
            case ExpressionTag.LiteralPathExpression: {
                return this.checkLiteralPathExpression(env, exp);
            }
            case ExpressionTag.LiteralPathFragmentExpression: {
                return this.checkLiteralPathFragmentExpression(env, exp);
            }
            case ExpressionTag.LiteralGlobExpression: {
                return this.checkLiteralGlobExpression(env, exp);
            }
            case ExpressionTag.LiteralTypeDeclValueExpression: {
                return this.checkLiteralTypeDeclValueExpression(env, exp);
            }
            case ExpressionTag.LiteralTypedStringExpression: {
                return this.checkLiteralTypedStringExpression(env, exp);
            }
            case ExpressionTag.LiteralTypedCStringExpression: {
                return this.checkLiteralTypedCStringExpression(env, exp);
            }
            case ExpressionTag.LiteralTypedFormatStringExpression: {
                const itype = TypeInferContext.asSimpleType(typeinfer);
                return this.checkLiteralTypedFormatStringExpression(env, exp, itype);
            }
            case ExpressionTag.LiteralTypedFormatCStringExpression: {
                const itype = TypeInferContext.asSimpleType(typeinfer);
                return this.checkLiteralTypedFormatCStringExpression(env, exp, itype);
            }
            case ExpressionTag.AccessEnvValueExpression: {
                return this.checkAccessEnvValueExpression(env, exp);
            }
            case ExpressionTag.TaskAccessIDExpression: {
                return this.checkTaskAccessInfoExpression(env, exp);
            }
            case ExpressionTag.AccessNamespaceConstantExpression: {
                return this.checkAccessNamespaceConstantExpression(env, exp);
            }
            case ExpressionTag.AccessEnumExpression: {
                return this.checkAccessEnumExpression(env, exp);
            }
            case ExpressionTag.AccessStaticFieldExpression: {
                return this.checkAccessStaticFieldExpression(env, exp);
            }
            case ExpressionTag.AccessVariableExpression: {
                return this.checkAccessVariableExpression(env, exp);
            }
            case ExpressionTag.ConstructorPrimaryExpression: {
                return this.checkConstructorPrimaryExpression(env, exp);
            }
            case ExpressionTag.ConstructorEListExpression: {
                return this.checkConstructorEListExpression(env, exp, typeinfer);
            }
            case ExpressionTag.ConstructorLambdaExpression: {
                return this.checkConstructorLambdaExpression(env, exp, TypeInferContext.asSimpleType(typeinfer));
            }
            case ExpressionTag.LambdaInvokeExpression: {
                return this.checkLambdaInvokeExpression(env, exp, false).tsig;
            }
            case ExpressionTag.SpecialConstructorExpression: {
                return this.checkSpecialConstructorExpression(env, exp, TypeInferContext.asSimpleType(typeinfer));
            }
            case ExpressionTag.CallNamespaceFunctionExpression: {
                return this.checkCallNamespaceFunctionExpression(env, exp, false).tsig;
            }
            case ExpressionTag.CallTypeFunctionExpression: {
                return this.checkCallTypeFunctionExpression(env, exp, false).tsig;
            }
            case ExpressionTag.ParseAsTypeExpression: {
                return this.checkParseAsTypeExpression(env, exp);
            }
            case ExpressionTag.InterpolateFormatExpression: {
                return this.checkInterpolateFormatExpression(env, exp);
            }
            case ExpressionTag.PostfixOpExpression: {
                return this.checkPostfixOp(env, exp, typeinfer);
            }
            case ExpressionTag.PrefixNotOpExpression: {
                return this.checkPrefixNotOpExpression(env, exp);
            }
            case ExpressionTag.PrefixNegateOrPlusOpExpression: {
                return this.checkPrefixNegateOrPlusOpExpression(env, exp);
            }
            case ExpressionTag.BinAddExpression: {
                return this.checkBinAddExpression(env, exp);
            }
            case ExpressionTag.BinSubExpression: {
                return this.checkBinSubExpression(env, exp);
            }
            case ExpressionTag.BinMultExpression: {
                return this.checkBinMultExpression(env, exp);
            }
            case ExpressionTag.BinDivExpression: {
                return this.checkBinDivExpression(env, exp);
            }
            case ExpressionTag.BinKeyEqExpression: {
                return this.checkBinKeyEqExpression(env, exp);
            }
            case ExpressionTag.BinKeyNeqExpression: {
                return this.checkBinKeyNeqExpression(env, exp);
            }
            case ExpressionTag.KeyCompareEqExpression: {
                return this.checkKeyCompareEqExpression(env, exp);
            }
            case ExpressionTag.KeyCompareLessExpression: {
                return this.checkKeyCompareLessExpression(env, exp);
            }
            case ExpressionTag.NumericEqExpression: {
                return this.checkNumericEqExpression(env, exp);
            }
            case ExpressionTag.NumericNeqExpression: {
                return this.checkNumericNeqExpression(env, exp);
            }
            case ExpressionTag.NumericLessExpression: {
                return this.checkNumericLessExpression(env, exp);
            }
            case ExpressionTag.NumericLessEqExpression: {
                return this.checkNumericLessEqExpression(env, exp);
            }
            case ExpressionTag.NumericGreaterExpression: {
                return this.checkNumericGreaterExpression(env, exp);
            }
            case ExpressionTag.NumericGreaterEqExpression: {
                return this.checkNumericGreaterEqExpression(env, exp);
            }
            case ExpressionTag.LogicAndExpression: {
                return this.checkBinLogicAndExpression(env, exp);
            }
            case ExpressionTag.LogicOrExpression: {
                return this.checkBinLogicOrExpression(env, exp);
            }
            case ExpressionTag.HoleExpression: {
                return this.checkHoleExpression(env, exp, typeinfer);
            }
            case ExpressionTag.MapEntryConstructorExpression: {
                return this.checkMapEntryConstructorExpression(env, exp, TypeInferContext.asSimpleType(typeinfer));
            }
            default: {
                assert(exp.tag === ExpressionTag.ErrorExpression, "Unknown expression kind");
                return new ErrorTypeSignature(exp.sinfo, undefined);
            }
        }
    }
    checkCallRefInvokeExpression(env, exp) {
        const rcvrtype = this.checkExpression(env, exp.rcvr, undefined);
        let resolvefrom = rcvrtype;
        if (exp.specificResolve !== undefined) {
            const specificok = this.checkTypeSignature(exp.specificResolve);
            if (specificok) {
                resolvefrom = exp.specificResolve;
            }
        }
        const hastemplate = exp.terms.length > 0;
        const haslambda = exp.args.args.some((arg) => {
            if (!(arg instanceof PositionalArgumentValue)) {
                return false;
            }
            const eexp = arg.exp;
            if (eexp instanceof ConstructorLambdaExpression) {
                return true;
            }
            else if (eexp instanceof AccessVariableExpression) {
                const atype = this.checkAccessVariableExpression(env, eexp);
                return atype instanceof LambdaTypeSignature;
            }
            else {
                return false;
            }
        });
        const mresolve = this.relations.resolveTypeMethodDeclaration(resolvefrom, exp.name, hastemplate, haslambda, true, this.constraints);
        if (mresolve === undefined) {
            this.reportError(exp.sinfo, `Could not find method ${exp.name} in type ${rcvrtype.emit()}`);
            return TypeResultWRefVarInfoResult.makeSimpleResult(exp.setType(new ErrorTypeSignature(exp.sinfo, undefined)));
        }
        exp.resolvedDeclType = mresolve.typeinfo.tsig;
        exp.resolvedMethodDecl = mresolve.member;
        if (!mresolve.member.isThisRef) {
            this.reportError(exp.sinfo, `Method ${exp.name} is not a "ref" method and cannot be called with a ref rcvr`);
            return TypeResultWRefVarInfoResult.makeSimpleResult(exp.setType(new ErrorTypeSignature(exp.sinfo, undefined)));
        }
        const rcvrname = exp.rcvr.srcname;
        const vinfo = env.resolveLocalVarInfoFromSrcName(rcvrname);
        if (vinfo === undefined) {
            this.reportError(exp.sinfo, `Variable ${rcvrname} is not declared`);
        }
        else {
            if (vinfo.vkind === "let") {
                this.reportError(exp.sinfo, `Variable ${rcvrname} is cannot be updated (is local const or not a ref param)`);
            }
        }
        const imapper = this.checkTemplateBindingsOnInvokeSig(exp.sinfo, exp.terms, mresolve.member);
        if (imapper === undefined) {
            return TypeResultWRefVarInfoResult.makeSimpleResult(exp.setType(new ErrorTypeSignature(exp.sinfo, undefined)));
        }
        exp.monoinvid = this.invidCtr++;
        const fullmapper = TemplateNameMapper.merge(mresolve.typeinfo.mapping, imapper);
        const arginfo = this.checkArgumentList(exp.sinfo, env, false, exp.args.args, mresolve.member.params, fullmapper);
        let resolvedrtype = mresolve.member.resultType;
        if (exp.specificResolve !== undefined) {
            const rrt = this.relations.resolveTypeMethodImplementation(resolvefrom, exp.name, hastemplate, haslambda, true, this.constraints);
            this.checkError(exp.sinfo, rrt === undefined, `Method ${exp.name} is not specifically resolvable from type ${resolvefrom.emit()}`);
            if (rrt !== undefined) {
                resolvedrtype = rrt.member.resultType;
                exp.resolvedImplType = rrt.typeinfo.tsig;
                exp.resolvedMethodImpl = rrt.member;
            }
        }
        else {
            const smresolve = this.postfixInvokeStaticResolve(env, mresolve, exp.name, hastemplate, haslambda, true, resolvefrom);
            if (smresolve !== undefined) {
                resolvedrtype = smresolve.member.resultType;
                exp.resolvedImplType = smresolve.typeinfo.tsig;
                exp.resolvedMethodImpl = smresolve.member;
            }
        }
        this.checkError(exp.sinfo, !this.relations.areSameTypes(exp.resolvedDeclType, rcvrtype), `Receiver type ${rcvrtype.emit()} does not match method declaration receiver type ${exp.resolvedDeclType.emit()}`);
        exp.shuffleinfo = arginfo.shuffleinfo;
        exp.resttype = arginfo.resttype;
        exp.restinfo = arginfo.restinfo;
        exp.setcondout = arginfo.setcondout;
        exp.setuncond = arginfo.setuncond;
        exp.inout = arginfo.inout;
        exp.byref = arginfo.byref;
        const rrt = TypeResultWRefVarInfoResult.makeGeneralResult(exp.setType(resolvedrtype.remapTemplateBindings(fullmapper)), false, false, { ttrue: [...arginfo.setcondout], tfalse: [] }, [...arginfo.setuncond], [...arginfo.inout, ...arginfo.byref], []);
        if (rrt !== undefined) {
            return rrt;
        }
        else {
            return TypeResultWRefVarInfoResult.makeSimpleResult(exp.setType(new ErrorTypeSignature(exp.sinfo, undefined)));
        }
    }
    checkCallRefVariableExpression(env, exp) {
        return this.checkCallRefInvokeExpression(env, exp);
    }
    checkCallRefThisExpression(env, exp) {
        return this.checkCallRefInvokeExpression(env, exp);
    }
    checkCallRefSelfExpression(env, exp) {
        assert(false, "Not Implemented -- checkCallRefSelfExpression");
    }
    checkCallTaskActionExpression(env, exp) {
        assert(false, "Not Implemented -- checkCallTaskActionExpression");
    }
    checkTaskRunExpression(env, exp) {
        assert(false, "Not Implemented -- checkTaskRunExpression");
    }
    checkTaskMultiExpression(env, exp) {
        assert(false, "Not Implemented -- checkTaskMultiExpression");
    }
    checkTaskDashExpression(env, exp) {
        assert(false, "Not Implemented -- checkTaskDashExpression");
    }
    checkTaskAllExpression(env, exp) {
        assert(false, "Not Implemented -- checkTaskAllExpression");
    }
    checkTaskRaceExpression(env, exp) {
        assert(false, "Not Implemented -- checkTaskRaceExpression");
    }
    checkAPIInvokeExpression(env, exp) {
        assert(false, "Not Implemented -- checkAPIInvokeExpression");
    }
    checkAgentInvokeExpression(env, exp) {
        assert(false, "Not Implemented -- checkAgentInvokeExpression");
    }
    checkChkLogicExpression(env, exp) {
        if (exp.tag === ChkLogicExpressionTag.ChkLogicBaseExpression) {
            return this.checkExpression(env, exp.exp, undefined);
        }
        else {
            const iiexp = exp;
            const renv = this.processITestGuardSet(iiexp.sinfo, env, iiexp.lhs);
            this.checkError(iiexp.sinfo, renv.setcondout.ttrue.length !== 0 || renv.setcondout.tfalse.length !== 0, "Implicit mod via 'out?' is not allowed in this context");
            this.checkError(iiexp.sinfo, renv.setuncond.length !== 0, "Implicit mod via 'out' is not allowed in this context");
            this.checkError(iiexp.sinfo, renv.usemod.length !== 0, "Implicit mod via 'ref/out' is not allowed in this context");
            this.checkError(iiexp.sinfo, renv.alwaysfalse, "Condition is never true -- true branch of if is unreachable");
            this.checkError(iiexp.sinfo, renv.alwaystrue, "Condition is never false -- false branch of if is unreachable");
            let [tenv] = env.generateBranchFlows(renv);
            const tresult = this.checkExpression(tenv, iiexp.rhs, undefined); //tenv is modified in place with used var info
            this.checkError(iiexp.sinfo, !(tresult instanceof ErrorTypeSignature) && !this.relations.isBooleanType(tresult), "Right hand side of 'implies' must be a valid Bool compatible expression");
            const [nenv] = tenv.popLocalScope();
            env.updateUsedBindersFromOtherEnv(nenv);
            iiexp.bbinds = renv.bbinds;
            return this.getWellKnownType("Bool");
        }
    }
    checkConditionalValueExpression(env, exp, typeinfer) {
        const renv = this.processITestGuardSet(exp.sinfo, env, exp.guardset);
        this.checkError(exp.sinfo, renv.alwaysfalse, "Condition is never true -- true branch of if is unreachable");
        this.checkError(exp.sinfo, renv.alwaystrue, "Condition is never false -- false branch of if is unreachable");
        let [tenv, fenv] = env.generateBranchFlows(renv);
        const ttype = this.checkExpression(tenv, exp.trueValue, typeinfer);
        const ftype = this.checkExpression(fenv, exp.falseValue, typeinfer);
        env.updateUsedBindersFromOtherEnv(tenv);
        env.updateUsedBindersFromOtherEnv(fenv);
        exp.bbinds = renv.bbinds;
        if (ttype instanceof ErrorTypeSignature || ftype instanceof ErrorTypeSignature) {
            exp.rtype = new ErrorTypeSignature(exp.sinfo, undefined);
        }
        else {
            const jtype = this.relations.flowTypeLUB(exp.sinfo, TypeInferContext.asSimpleType(typeinfer), [ttype, ftype], this.constraints);
            this.checkError(exp.sinfo, jtype instanceof ErrorTypeSignature, "Could not unify types of true and false branches of if expression");
            exp.rtype = jtype;
        }
        return exp.rtype;
    }
    checkBaseRValueExpression(env, exp, typeinfer) {
        const ttag = exp.tag;
        switch (ttag) {
            case ExpressionTag.CallRefVariableExpression: {
                return this.checkCallRefVariableExpression(env, exp);
            }
            case ExpressionTag.CallRefThisExpression: {
                return this.checkCallRefThisExpression(env, exp);
            }
            case ExpressionTag.CallRefSelfExpression: {
                return this.checkCallRefSelfExpression(env, exp);
            }
            case ExpressionTag.CallTaskActionExpression: {
                return this.checkCallTaskActionExpression(env, exp);
            }
            case ExpressionTag.TaskRunExpression: {
                return TypeResultWRefVarInfoResult.makeSimpleResult(this.checkTaskRunExpression(env, exp));
            }
            case ExpressionTag.TaskMultiExpression: {
                return TypeResultWRefVarInfoResult.makeSimpleResult(this.checkTaskMultiExpression(env, exp));
            }
            case ExpressionTag.TaskDashExpression: {
                return TypeResultWRefVarInfoResult.makeSimpleResult(this.checkTaskDashExpression(env, exp));
            }
            case ExpressionTag.TaskAllExpression: {
                return TypeResultWRefVarInfoResult.makeSimpleResult(this.checkTaskAllExpression(env, exp));
            }
            case ExpressionTag.TaskRaceExpression: {
                return TypeResultWRefVarInfoResult.makeSimpleResult(this.checkTaskRaceExpression(env, exp));
            }
            case ExpressionTag.APIInvokeExpression: {
                return TypeResultWRefVarInfoResult.makeSimpleResult(this.checkAPIInvokeExpression(env, exp));
            }
            case ExpressionTag.AgentInvokeExpression: {
                return TypeResultWRefVarInfoResult.makeSimpleResult(this.checkAgentInvokeExpression(env, exp));
            }
            default: {
                if (ttag === ExpressionTag.CallNamespaceFunctionExpression) {
                    return this.checkCallNamespaceFunctionExpression(env, exp, true);
                }
                else if (ttag === ExpressionTag.CallTypeFunctionExpression) {
                    return this.checkCallTypeFunctionExpression(env, exp, true);
                }
                else if (ttag === ExpressionTag.LambdaInvokeExpression) {
                    return this.checkLambdaInvokeExpression(env, exp, true);
                }
                else if (ttag === ExpressionTag.PostfixOpExpression) {
                    return this.checkPostfixOpMaybeRefs(env, exp, typeinfer);
                }
                else if (ttag === ExpressionTag.PrefixNotOpExpression) {
                    const ueexp = exp;
                    const tte = this.processITestGuardExpression(env, ueexp.exp, false);
                    assert(tte.bbinds.length === 0, "These should be set in the itest part (not the expression part) probably bad nesting");
                    ueexp.opertype = this.resolveUnderlyingType(tte.tsig);
                    ueexp.setType(tte.tsig);
                    return new TypeResultWRefVarInfoResult(tte.tsig, false, false, { ttrue: tte.setcondout.tfalse, tfalse: tte.setcondout.ttrue }, tte.setuncond, tte.usemod, []);
                }
                else if (ttag === ExpressionTag.LogicAndExpression) {
                    const aexps = exp.exps.map((e) => this.processITestGuardExpression(env, e, false));
                    assert(aexps.every((a) => a.bbinds.length === 0), "These should be set in the itest part (not the expression part) probably bad nesting");
                    this.checkError(exp.sinfo, aexps.some((ee) => !this.relations.isBooleanType(ee.tsig)), "One or more sub-expressions in 'and' expression is not a Bool compatible type");
                    const oftype = aexps[0].tsig;
                    this.checkError(exp.sinfo, aexps.some((ee) => ee.tsig !== undefined && ee.tsig.tkeystr !== oftype.tkeystr), "Logic And expressions require all arguments to be of the same (Bool compatible) type");
                    const ft = aexps.every((ee) => this.relations.isBooleanType(ee.tsig) && ee.tsig.tkeystr === oftype.tkeystr) ? oftype : this.getWellKnownType("Bool");
                    exp.setType(ft);
                    const [hasconflicts, res] = TypeResultWRefVarInfoResult.andstates(aexps);
                    this.checkError(exp.sinfo, hasconflicts, "Cannot have multiple ref/mod uses of a variable in 'and' expression");
                    return res;
                }
                else {
                    return TypeResultWRefVarInfoResult.makeSimpleResult(this.checkExpression(env, exp, typeinfer));
                }
            }
        }
    }
    checkExpressionRHS(env, exp, typeinfer) {
        const ttag = exp.tag;
        let cbb;
        if (ttag === RValueExpressionTag.BaseExpression) {
            cbb = this.checkBaseRValueExpression(env, exp.exp, typeinfer);
        }
        else if (ttag === RValueExpressionTag.ShortCircuitAssignRHSExpressionFail) {
            assert(false, "Not Implemented -- checkShortCircuitAssignRHSFailExpression");
        }
        else if (ttag === RValueExpressionTag.ShortCircuitAssignRHSExpressionReturn) {
            assert(false, "Not Implemented -- checkShortCircuitAssignRHSReturnExpression");
        }
        else if (ttag === RValueExpressionTag.ConditionalValueExpression) {
            cbb = TypeResultWRefVarInfoResult.makeSimpleResult(this.checkConditionalValueExpression(env, exp, typeinfer));
        }
        else {
            assert(false, "Unknown RValueExpression kind");
        }
        exp.rtype = cbb.tsig;
        return cbb;
    }
    checkEmptyStatement(env, stmt) {
        return env;
    }
    checkVariableDeclarationStatement(env, stmt) {
        this.checkTypeSignature(stmt.vtype);
        return env.addLocalVar(stmt.name, stmt.vtype, "var", false);
    }
    checkVariableMultiDeclarationStatement(env, stmt) {
        for (let i = 0; i < stmt.decls.length; ++i) {
            this.checkTypeSignature(stmt.decls[i].vtype);
            env = env.addLocalVar(stmt.decls[i].name, stmt.decls[i].vtype, "var", false);
        }
        return env;
    }
    checkVariableInitializationStatement(env, stmt) {
        this.checkTypeSignature(stmt.vtype);
        const itype = !(stmt.vtype instanceof AutoTypeSignature) ? stmt.vtype : undefined;
        const rhs = this.checkExpressionRHS(env, stmt.exp, itype !== undefined ? new SimpleTypeInferContext(itype) : undefined);
        for (let i = 0; i < rhs.setuncond.length; ++i) {
            env = env.assignLocalVariable(rhs.setuncond[i]);
        }
        this.checkError(stmt.sinfo, itype !== undefined && !(rhs instanceof ErrorTypeSignature) && !this.relations.isSubtypeOf(rhs.tsig, itype, this.constraints), `Expression of type ${TypeChecker.safeTypePrint(rhs.tsig)} cannot be assigned to variable of type ${TypeChecker.safeTypePrint(itype)}`);
        if (stmt.name === "_") {
            return env;
        }
        else {
            stmt.actualtype = itype || rhs.tsig;
            return env.addLocalVar(stmt.name, itype || rhs.tsig, stmt.vkind, true);
        }
    }
    checkVariableMultiInitializationStatement(env, stmt) {
        /*
        for(let i = 0; i < stmt.decls.length; ++i) {
            this.checkTypeSignature(stmt.decls[i].vtype);
        }

        const iopts = stmt.decls.map((decl) => !(decl.vtype instanceof AutoTypeSignature) ? decl.vtype : undefined);
        let evals: TypeSignature[] = [];
        if(Array.isArray(stmt.exp)) {
            for(let i = 0; i < stmt.exp.length; ++i) {
                const cenv = env.addLocalVarSet(stmt.decls.filter((dd, ii) => dd.name !== "_" && ii !== i), stmt.isConst);

                //note this is Expression -- RHS expressions are not allowed in multi-expression initialization -- maybe a better error message here
                const etype = this.checkExpression(cenv, stmt.exp[i], i < iopts.length && iopts[i] !== undefined ? new SimpleTypeInferContext(iopts[i] as TypeSignature) : undefined);
                evals.push(etype);
            }

            this.checkError(stmt.sinfo, iopts.length !== evals.length, "Mismatch in number of variables and expressions in multi-variable initialization");
            for(let i = evals.length; i < iopts.length; ++i) {
                evals.push(new ErrorTypeSignature(stmt.sinfo, undefined)); //try to recover a bit
            }

            for(let i = 0; i < stmt.decls.length; ++i) {
                const decl = stmt.decls[i];
                const itype = iopts[i];
                const etype = evals[i];
    
                this.checkError(stmt.sinfo, decl.name === "_", "Cannot use _ for variable initialization with multiple explicit expressions!!!");
                this.checkError(stmt.sinfo, itype !== undefined && !(etype instanceof ErrorTypeSignature) && !this.relations.isSubtypeOf(etype, itype, this.constraints), `Expression of type ${TypeChecker.safeTypePrint(etype)} cannot be assigned to variable of type ${TypeChecker.safeTypePrint(itype)}`);
                
                stmt.actualtypes.push(itype || etype);
                if(decl.name !== "_") {
                    env = env.addLocalVar(decl.name, itype || etype, stmt.isConst, true); //try to recover a bit
                }
            }
        }
        else {
            const iinfer = new EListStyleTypeInferContext(iopts);
            const etype = this.checkExpressionRHS(env, stmt.exp, iinfer);
            if(etype instanceof EListTypeSignature) {
                evals.push(...etype.entries);
            }
            else {
                this.reportError(stmt.sinfo, "Expected a EList for multi-variable initialization");
            }

            this.checkError(stmt.sinfo, iopts.length !== evals.length, "Mismatch in number of variables and expressions in multi-variable initialization");
            for(let i = evals.length; i < iopts.length; ++i) {
                evals.push(new ErrorTypeSignature(stmt.sinfo, undefined)); //try to recover a bit
            }

            for(let i = 0; i < stmt.decls.length; ++i) {
                const decl = stmt.decls[i];
                const itype = iopts[i];
                const etype = evals[i];
    
                this.checkError(stmt.sinfo, itype !== undefined && !(etype instanceof ErrorTypeSignature) && !this.relations.areSameTypes(etype, itype), `Expression of type ${TypeChecker.safeTypePrint(etype)} (from EList) cannot be assigned to variable of type ${TypeChecker.safeTypePrint(itype)}`);
                
                stmt.actualtypes.push(itype || etype);
                if(decl.name !== "_") {
                    env = env.addLocalVar(decl.name, itype || etype, stmt.isConst, true); //try to recover a bit
                }
            }
        }

        return env;
        */
        assert(false, "Not Implemented -- checkVariableMultiInitializationStatement");
    }
    checkVariableAssignmentStatement(env, stmt) {
        const vinfo = env.resolveLocalVarInfoFromSrcName(stmt.name);
        if (vinfo === undefined && stmt.name !== "_") {
            this.reportError(stmt.sinfo, `Variable ${stmt.name} is not declared`);
            return env;
        }
        let decltype = undefined;
        if (vinfo !== undefined) {
            const badvkind = vinfo.vkind === "let" || vinfo.vkind === "ref";
            this.checkError(stmt.sinfo, badvkind, `Variable ${stmt.name} cannot be assigned`);
            decltype = vinfo.decltype;
        }
        const rhs = this.checkExpressionRHS(env, stmt.exp, decltype !== undefined ? new SimpleTypeInferContext(decltype) : undefined);
        this.checkError(stmt.sinfo, decltype !== undefined && !(rhs instanceof ErrorTypeSignature) && !this.relations.isSubtypeOf(rhs.tsig, decltype, this.constraints), `Expression of type ${TypeChecker.safeTypePrint(rhs.tsig)} cannot be assigned to variable of type ${TypeChecker.safeTypePrint(decltype)}`);
        for (let i = 0; i < rhs.setuncond.length; ++i) {
            env = env.assignLocalVariable(rhs.setuncond[i]);
        }
        stmt.vtype = decltype || rhs.tsig;
        return stmt.name !== "_" ? env.assignLocalVariable(stmt.name) : env;
    }
    checkVariableMultiAssignmentStatement(env, stmt) {
        /*
        const opts = stmt.names.map((vname) => env.resolveLocalVarInfoFromSrcName(vname));
        let iopts: (TypeSignature | undefined)[] = [];
        for(let i = 0; i < opts.length; ++i) {
            if(opts[i] !== undefined) {
                //TODO: I think we also need to check ref here (we shouldn't assign to those)

                this.checkError(stmt.sinfo, (opts[i] as VarInfo).isConst, `Variable ${stmt.names[i]} is declared as const and cannot be assigned`);
                iopts.push((opts[i] as VarInfo).decltype);
            }
            else {
                if(stmt.names[i] !== "_") {
                    this.reportError(stmt.sinfo, `Variable ${stmt.names[i]} is not declared`);
                }
                iopts.push(undefined);
            }
        }

        let evals: TypeSignature[] = [];
        if(Array.isArray(stmt.exp)) {
            //This evaluation is fully parallel -- no updates happen before all expressions are evaluated!!!!
            for(let i = 0; i < stmt.exp.length; ++i) {
                //note this is Expression -- RHS expressions are not allowed in multi-expression initialization -- maybe a better error message here
                const etype = this.checkExpression(env, stmt.exp[i], i < iopts.length && iopts[i] !== undefined ? new SimpleTypeInferContext(iopts[i] as TypeSignature) : undefined);
                evals.push(etype);
            }

            this.checkError(stmt.sinfo, opts.length !== evals.length, "Mismatch in number of variables and expressions in multi-variable initialization");
            for(let i = evals.length; i < opts.length; ++i) {
                evals.push(new ErrorTypeSignature(stmt.sinfo, undefined)); //try to recover a bit
            }

            for(let i = 0; i < stmt.names.length; ++i) {
                const name = stmt.names[i];
                const itype = i < iopts.length && iopts[i] !== undefined ? (iopts[i] as TypeSignature) : undefined;
                const etype = evals[i];
    

                this.checkError(stmt.sinfo, name === "_", "Cannot use _ for variable assignment with multiple explicit expressions!!!");
                this.checkError(stmt.sinfo, itype !== undefined && !(etype instanceof ErrorTypeSignature) && !this.relations.isSubtypeOf(etype, itype, this.constraints), `Expression of type ${TypeChecker.safeTypePrint(etype)} cannot be assigned to variable of type ${TypeChecker.safeTypePrint(itype)}`);
                
                stmt.vtypes.push(itype || etype);
                if(name !== "_") {
                    env = env.assignLocalVariable(name); //recover a bit
                }
            }
        }
        else {
            const iinfer = new EListStyleTypeInferContext(iopts);
            const etype = this.checkExpressionRHS(env, stmt.exp, iinfer);
            if(etype instanceof EListTypeSignature) {
                evals.push(...etype.entries);
            }
            else {
                this.reportError(stmt.sinfo, "Expected a EList for multi-variable initialization");
            }

            this.checkError(stmt.sinfo, opts.length !== evals.length, "Mismatch in number of variables and expressions in multi-variable initialization");
            for(let i = evals.length; i < opts.length; ++i) {
                evals.push(new ErrorTypeSignature(stmt.sinfo, undefined)); //try to recover a bit
            }

            for(let i = 0; i < stmt.names.length; ++i) {
                const name = stmt.names[i];
                const itype = i < iopts.length && iopts[i] !== undefined ? (iopts[i] as TypeSignature) : undefined;
                const etype = evals[i];
    
                this.checkError(stmt.sinfo, itype !== undefined && !(etype instanceof ErrorTypeSignature) && !this.relations.areSameTypes(etype, itype), `Expression of type ${TypeChecker.safeTypePrint(etype)} (from EList) cannot be assigned to variable of type ${TypeChecker.safeTypePrint(itype)}`);
                
                stmt.vtypes.push(itype || etype);
                if(name !== "_") {
                    env = env.assignLocalVariable(name); //recover a bit
                }
            }
        }

        return env;
        */
        assert(false, "Not Implemented -- checkVariableMultiAssignmentStatement");
    }
    checkReturnVoidStatement(env, stmt) {
        this.checkError(stmt.sinfo, !this.isVoidType(env.declReturnType), `Expected a void return`);
        return env.setReturnFlow();
    }
    checkReturnSingleStatement(env, stmt) {
        const rtype = this.checkExpressionRHS(env, stmt.value, env.inferReturn);
        for (let i = 0; i < rtype.setuncond.length; ++i) {
            env = env.assignLocalVariable(rtype.setuncond[i]);
        }
        stmt.rtype = env.declReturnType;
        this.checkError(stmt.sinfo, !(rtype.tsig instanceof ErrorTypeSignature) && !this.relations.isSubtypeOf(rtype.tsig, env.declReturnType, this.constraints), `Expected a return value of type ${env.declReturnType.emit()} but got ${rtype.tsig.emit()}`);
        return env.setReturnFlow();
    }
    checkReturnMultiStatement(env, stmt) {
        /*
        if(this.checkError(stmt.sinfo, !(env.inferReturn instanceof EListStyleTypeInferContext), `Multiple return requires an Elist type but got ${env.declReturnType.emit()}`)) {
            return env.setReturnFlow();
        }

        const rtypes = TypeInferContext.asEListOptions(env.inferReturn) as (TypeSignature | undefined)[];
        this.checkError(stmt.sinfo, rtypes.length !== stmt.value.length, `Mismatch in number of return values and expected return types`);

        for(let i = 0; i < stmt.value.length; ++i) {
            const rtype = rtypes[i] !== undefined ? rtypes[i] : undefined;
            const infertype = rtype !== undefined ? this.relations.convertTypeSignatureToTypeInferCtx(rtype) : undefined;
            const etype = this.checkExpression(env, stmt.value[i], infertype);

            const rtname = rtype !== undefined ? rtype.emit() : "skip";
            this.checkError(stmt.sinfo, rtype !== undefined && !(etype instanceof ErrorTypeSignature) && !this.relations.isSubtypeOf(etype, rtype, this.constraints), `Expected a return value of type ${rtname} but got ${etype.emit()}`);

            stmt.rtypes.push(rtype || etype);
        }

        stmt.elsig = new EListTypeSignature(stmt.sinfo, stmt.rtypes);
        return env.setReturnFlow();
        */
        assert(false, "Not Implemented -- checkReturnMultiStatement");
    }
    checkIfStatement(env, stmt) {
        let eetgr = this.processITestGuardSet(stmt.sinfo, env, stmt.cond);
        const eetype = (eetgr.tsig instanceof ErrorTypeSignature) ? this.getWellKnownType("Bool") : eetgr.tsig;
        stmt.bbinds = eetgr.bbinds;
        if (eetgr.bbinds.length === 0) {
            this.checkError(stmt.sinfo, !this.relations.isBooleanType(eetype), "If test requires a Bool type");
            let [aenv, tenv, _] = eetgr.extendEnvironmentWithVarAssignments(env);
            const ttrue = this.checkBlockStatement(tenv, stmt.trueBlock);
            return TypeEnvironment.mergeEnvironmentsSimple(aenv, tenv, ttrue);
        }
        else {
            this.checkError(stmt.sinfo, !this.relations.isBooleanType(eetype), "If test requires a Bool type");
            let [aenv, tenv, _] = eetgr.extendEnvironmentWithVarAssignments(env);
            //update the true branch with any binders from the itest
            tenv = tenv.pushNewLocalBinderScope(stmt.bbinds.map((bb) => new VarInfo(bb.bname, bb.ttrue, "let", true)));
            const ttrue = this.checkBlockStatement(tenv, stmt.trueBlock);
            return TypeEnvironment.mergeEnvironmentsSimple(aenv, tenv, ttrue);
        }
    }
    checkIfElseStatement(env, stmt) {
        let eetgr = this.processITestGuardSet(stmt.sinfo, env, stmt.cond);
        const eetype = (eetgr.tsig instanceof ErrorTypeSignature) ? this.getWellKnownType("Bool") : eetgr.tsig;
        stmt.bbinds = eetgr.bbinds;
        if (eetgr.bbinds.length === 0) {
            this.checkError(stmt.sinfo, !this.relations.isBooleanType(eetype), "If test requires a Bool type");
            let [aenv, tenv, fenv] = eetgr.extendEnvironmentWithVarAssignments(env);
            const ttrue = this.checkBlockStatement(tenv, stmt.trueBlock);
            const tfalse = this.checkBlockStatement(fenv, stmt.falseBlock);
            return TypeEnvironment.mergeEnvironmentsSimple(aenv, ttrue, tfalse);
        }
        else {
            this.checkError(stmt.sinfo, !this.relations.isBooleanType(eetype), "If test requires a Bool type");
            let [aenv, tenv, fenv] = eetgr.extendEnvironmentWithVarAssignments(env);
            //update the true branch with any binders from the itest
            tenv = tenv.pushNewLocalBinderScope(stmt.bbinds.map((bb) => new VarInfo(bb.bname, bb.ttrue, "let", true)));
            const ttrue = this.checkBlockStatement(tenv, stmt.trueBlock);
            //update the false branch with any binders from the itest
            fenv = fenv.pushNewLocalBinderScope(stmt.bbinds.map((bb) => new VarInfo(bb.bname, bb.tfalse, "let", true)));
            const tfalse = this.checkBlockStatement(fenv, stmt.falseBlock);
            return TypeEnvironment.mergeEnvironmentsSimple(aenv, ttrue, tfalse);
        }
    }
    checkIfElifElseStatement(env, stmt) {
        let branchflows = [];
        for (let i = 0; i < stmt.condflow.length; ++i) {
            let etype = this.checkExpression(env, stmt.condflow[i].cond, undefined);
            if (etype instanceof ErrorTypeSignature) {
                etype = this.getWellKnownType("Bool");
            }
            this.checkError(stmt.condflow[i].cond.sinfo, !this.relations.isBooleanType(etype), `Expected a boolean expression but got ${etype.emit()}`);
            const resenv = this.checkBlockStatement(env, stmt.condflow[i].block);
            branchflows.push(resenv);
        }
        const elseflow = this.checkBlockStatement(env, stmt.elseflow);
        return TypeEnvironment.mergeEnvironmentsSimple(env, ...branchflows, elseflow);
    }
    checkSwitchStatement(env, stmt) {
        /*
        let ctype = this.checkExpression(env, stmt.sval, undefined);
        
        let exhaustive = false;
        let results: TypeEnvironment[] = [];

        this.checkError(stmt.sinfo, stmt.switchflow.length < 2, "Switch statement must have 2 or more choices");

        for (let i = 0; i < stmt.switchflow.length && !exhaustive; ++i) {
            //it is a wildcard match
            if(stmt.switchflow[i].lval === undefined) {
                this.checkError(stmt.sinfo, i !== stmt.switchflow.length - 1, `wildcard should be last option in switch expression but there were ${stmt.switchflow.length - (i + 1)} more that are unreachable`);
                exhaustive = true;

                const cenv = this.checkBlockStatement(env, stmt.switchflow[i].value);
                results.push(cenv);
            }
            else {
                const slitexp = (stmt.switchflow[i].lval as LiteralExpressionValue).exp;
                const littype = this.checkExpression(env, slitexp, undefined);
                if(!this.relations.isKeyType(littype, this.constraints)) {
                    this.reportError(slitexp.sinfo, `Switch statement requires a unique key type but got ${littype.emit()}`);
                }
                else {
                    const cmpok = this.checkValueEq(stmt.sval, ctype, slitexp, littype);
                    this.checkError(slitexp.sinfo, cmpok[0] === "err", `Cannot compare arguments in switch statement ${littype.emit()}`);

                    if(cmpok[0] !== "err") {
                        stmt.optypes.push(this.resolveUnderlyingType(littype) as TypeSignature);
                    }
                }

                const cenv = this.checkBlockStatement(env, stmt.switchflow[i].value);
                results.push(cenv);
            }
        }
        stmt.mustExhaustive = exhaustive;

        //TODO: once we have exhaustive for enums (and bools) then we should do a type check for exhaustive too

        return TypeEnvironment.mergeEnvironmentsSimple(env, ...results);
        */
        assert(false, "Not Implemented -- checkSwitchStatement");
    }
    checkMatchStatement(env, stmt) {
        const eetype = this.checkExpression(env, stmt.sval, undefined);
        if (eetype instanceof ErrorTypeSignature) {
            return env;
        }
        let ctype = this.relations.decomposeType(eetype, this.constraints) || [];
        if (ctype.length === 0) {
            this.reportError(stmt.sval.sinfo, `Match statement requires a decomposable type but got ${eetype.emit()}`);
            return env;
        }
        let exhaustive = false;
        let results = [];
        this.checkError(stmt.sinfo, stmt.matchflow.length < 2, "Match statement must have 2 or more choices");
        for (let i = 0; i < stmt.matchflow.length && !exhaustive; ++i) {
            //it is a wildcard match
            if (stmt.matchflow[i].mtype === undefined) {
                this.checkError(stmt.matchflow[i].value.sinfo, i !== stmt.matchflow.length - 1, `wildcard should be last option in switch expression but there were ${stmt.matchflow.length - (i + 1)} more that are unreachable`);
                exhaustive = true;
                const lubattempt = this.relations.flowTypeLUB(stmt.matchflow[i].value.sinfo, eetype, ctype, this.constraints);
                const defaulttype = (lubattempt instanceof ErrorTypeSignature) ? eetype : lubattempt;
                stmt.implicitFinalType = defaulttype;
                let cenv = env.pushNewLocalBinderScope([new VarInfo(stmt.bindervar, defaulttype, "let", true)]);
                cenv = this.checkBlockStatement(cenv, stmt.matchflow[i].value);
                cenv = cenv.popLocalScope()[0];
                results.push(cenv);
            }
            else {
                const mtype = stmt.matchflow[i].mtype;
                this.checkTypeSignature(mtype);
                if (mtype instanceof ErrorTypeSignature) {
                    return env;
                }
                const splits = this.relations.refineMatchType(ctype, mtype, this.constraints);
                if (splits === undefined) {
                    this.reportError(stmt.matchflow[i].value.sinfo, `Match statement requires a type that is a subtype of the decomposed type but got ${mtype.emit()}`);
                    return env;
                }
                else {
                    this.checkError(stmt.matchflow[i].value.sinfo, splits.overlap.length === 0, "Test is never true -- true branch of match is unreachable");
                    exhaustive = splits.remain.length === 0;
                    this.checkError(stmt.matchflow[i].value.sinfo, exhaustive && i !== stmt.matchflow.length - 1, `Test is never false -- but there were ${stmt.matchflow.length - (i + 1)} more that are unreachable`);
                    let cenv = env.pushNewLocalBinderScope([new VarInfo(stmt.bindervar, mtype, "let", true)]);
                    cenv = this.checkBlockStatement(cenv, stmt.matchflow[i].value);
                    cenv = cenv.popLocalScope()[0];
                    ctype = splits.remain || ctype;
                    results.push(cenv);
                }
            }
        }
        stmt.mustExhaustive = exhaustive;
        return TypeEnvironment.mergeEnvironmentsSimple(env, ...results);
    }
    checkDispatchPatternStatement(env, stmt) {
        assert(false, "Not Implemented -- checkDispatchPatternStatement");
    }
    checkDispatchTaskStatement(env, stmt) {
        assert(false, "Not Implemented -- checkDispatchTaskStatement");
    }
    checkAbortStatement(env, stmt) {
        return env.setDeadFlow();
    }
    checkAssertStatement(env, stmt) {
        const etype = this.checkChkLogicExpression(env, stmt.cond);
        if (etype instanceof ErrorTypeSignature) {
            return env;
        }
        this.checkError(stmt.sinfo, !this.relations.isBooleanType(etype), `Expected a boolean type for assert condition but got ${etype.emit()}`);
        return env;
    }
    checkValidateStatement(env, stmt) {
        const etype = this.checkChkLogicExpression(env, stmt.cond);
        if (etype instanceof ErrorTypeSignature) {
            return env;
        }
        this.checkError(stmt.sinfo, !this.relations.isBooleanType(etype), `Expected a boolean type for validate condition but got ${etype.emit()}`);
        return env;
    }
    checkDebugStatement(env, stmt) {
        this.checkExpression(env, stmt.value, undefined);
        return env;
    }
    checkVoidRefCallStatement(env, stmt) {
        const rtype = this.checkBaseRValueExpression(env, stmt.exp, undefined);
        this.checkError(stmt.sinfo, !(rtype.tsig instanceof ErrorTypeSignature) && !(rtype.tsig instanceof VoidTypeSignature), `Expected a void return but got ${rtype.tsig.emit()}`);
        //TODO may want to do additional checks that there are ref/out params that are assigned here (or that it is a task operation)
        for (let i = 0; i < rtype.setuncond.length; ++i) {
            env = env.assignLocalVariable(rtype.setuncond[i]);
        }
        return env;
    }
    static isTypeUpdatable(ttype) {
        if (!(ttype instanceof NominalTypeSignature)) {
            return [false, false];
        }
        const decl = ttype.decl;
        const okupdate = (decl instanceof EntityTypeDecl) || (decl instanceof DatatypeMemberEntityTypeDecl) || (decl instanceof ConceptTypeDecl) || (decl instanceof DatatypeTypeDecl);
        const isdirect = (decl instanceof EntityTypeDecl) || (decl instanceof DatatypeMemberEntityTypeDecl);
        return [okupdate, isdirect];
    }
    /*
    private getFieldType(rcvrtype: TypeSignature, fname: string): TypeSignature | undefined {
        const finfo = this.relations.resolveTypeField(rcvrtype, fname, this.constraints);
        if(finfo === undefined) {
            return undefined;
        }

        return finfo.member.declaredType.remapTemplateBindings(finfo.typeinfo.mapping);
    }
    */
    checkUpdateStatement(env, stmt) {
        /*
        const vtype = this.checkExpression(env, stmt.vexp, undefined);
        const vname = stmt.vexp.srcname;

        const [vinfo, isparam] = env.resolveLocalVarInfoFromSrcNameWithIsParam(vname);
        if(vinfo === undefined) {
            this.reportError(stmt.sinfo, `Variable ${vname} is not declared`);
            return env;
        }
        if((!isparam && vinfo.isConst) || (isparam && !vinfo.isRef)) {
            this.reportError(stmt.sinfo, `Variable ${vname} is cannot be updated (is local const or not a ref param)`);
            return env;
        }

        const [okupdate, isdirect] = TypeChecker.isTypeUpdatable(vtype);
        if(!okupdate) {
            this.reportError(stmt.sinfo, `Variable ${vname} is not an updatable type (entity/concept or datatype)`);
            return env;
        }

        const updates = stmt.updates.map((upd) => {
            const bname = "$" + upd[0];
            const ftype = this.getFieldType(vtype, upd[0]);

            if(ftype === undefined) {
                this.reportError(stmt.sinfo, `Field ${upd[0]} is not a member of type ${vtype.emit()}`);
                return {fieldname: upd[0], fieldtype: new ErrorTypeSignature(stmt.sinfo, undefined), etype: new ErrorTypeSignature(stmt.sinfo, undefined)};
            }

            const cenv = env.pushNewLocalBinderScope(bname, ftype);
            const etype = this.checkExpression(cenv, upd[1], new SimpleTypeInferContext(ftype));
            if(!(etype instanceof ErrorTypeSignature) && !this.relations.isSubtypeOf(etype, ftype, this.constraints)) {
                this.reportError(stmt.sinfo, `Expression of type ${etype.emit()} cannot be assigned to field ${upd[0]} of type ${ftype.emit()}`);
            }

            return {fieldname: upd[0], fieldtype: ftype, etype: etype};
        });

        stmt.updatetype = vtype;
        stmt.updateinfo = updates;
        stmt.isdirect = isdirect;

        return env;
        */
        assert(false, "Not Implemented -- checkUpdateStatement");
    }
    checkVarUpdateStatement(env, stmt) {
        return this.checkUpdateStatement(env, stmt);
    }
    checkThisUpdateStatement(env, stmt) {
        return this.checkUpdateStatement(env, stmt);
    }
    checkSelfUpdateStatement(env, stmt) {
        assert(false, "Not implemented -- SelfUpdateStatement");
    }
    checkTaskStatusStatement(env, stmt) {
        assert(false, "Not implemented -- TaskStatusStatement");
    }
    checkTaskCheckAndHandleTerminationStatement(env, stmt) {
        assert(false, "Not implemented -- TaskCheckAndHandleTerminationStatement");
    }
    checkTaskYieldStatement(env, stmt) {
        assert(false, "Not implemented -- TaskYieldStatement");
    }
    checkHoleStatement(env, stmt) {
        return env;
    }
    checkBlockStatement(env, stmt) {
        let cenv = env;
        if (stmt.isScoping) {
            cenv = cenv.pushNewLocalScope();
            for (let i = 0; i < stmt.statements.length; ++i) {
                cenv = this.checkStatement(cenv, stmt.statements[i]);
            }
            [cenv,] = cenv.popLocalScope();
        }
        else {
            for (let i = 0; i < stmt.statements.length; ++i) {
                cenv = this.checkStatement(cenv, stmt.statements[i]);
            }
        }
        stmt.isterminal = !cenv.isnormalflow;
        return cenv;
    }
    /*
    private checkEnvironmentFreshStatement(env: StatementTypeEnvironment, stmt: EnvironmentFreshStatement): [StatementTypeEnvironment, TIRStatement[]] {
        const assigns = stmt.assigns.map((asgn) => {
            this.raiseErrorIf(stmt.sinfo, asgn.valexp === undefined, "cannot clear key in fresh environment creation");

            const etype = this.normalizeTypeOnly((asgn.valexp as [TypeSignature, Expression])[0], env.binds);
            const easgn = this.emitCoerceIfNeeded(this.checkExpression(env.createInitialEnvForExpressionEval(), (asgn.valexp as [TypeSignature, Expression])[1], etype), (asgn.valexp as [TypeSignature, Expression])[1].sinfo, etype);

            return {keyname: asgn.keyname, valexp: [this.toTIRTypeKey(etype), easgn.expressionResult] as [TIRTypeKey, TIRExpression]};
        });

        return [env, [new TIREnvironmentFreshStatement(stmt.sinfo, assigns)]];
    }

    private checkEnvironmentSetStatement(env: StatementTypeEnvironment, stmt: EnvironmentSetStatement): [StatementTypeEnvironment, TIRStatement[]] {
        const assigns = stmt.assigns.map<{keyname: string, valexp: [TIRTypeKey, TIRExpression] | undefined}>((asgn) => {
            this.raiseErrorIf(stmt.sinfo, asgn.valexp === undefined, "cannot clear key in fresh environment creation");

            if(asgn.valexp === undefined) {
                return { keyname: asgn.keyname, valexp: undefined };
            }
            else {
                const etype = this.normalizeTypeOnly((asgn.valexp as [TypeSignature, Expression])[0], env.binds);
                const easgn = this.emitCoerceIfNeeded(this.checkExpression(env.createInitialEnvForExpressionEval(), (asgn.valexp as [TypeSignature, Expression])[1], etype), (asgn.valexp as [TypeSignature, Expression])[1].sinfo, etype);

                return { keyname: asgn.keyname, valexp: [this.toTIRTypeKey(etype), easgn.expressionResult] as [TIRTypeKey, TIRExpression] };
            }
        });

        return [env, [new TIREnvironmentSetStatement(stmt.sinfo, assigns)]];
    }

    private checkEnvironmentSetStatementBracket(env: StatementTypeEnvironment, stmt: EnvironmentSetStatementBracket): [StatementTypeEnvironment, TIRStatement[]] {
        const assigns = stmt.assigns.map<{keyname: string, valexp: [TIRTypeKey, TIRExpression] | undefined}>((asgn) => {
            this.raiseErrorIf(stmt.sinfo, asgn.valexp === undefined, "cannot clear key in fresh environment creation");

            if(asgn.valexp === undefined) {
                return { keyname: asgn.keyname, valexp: undefined };
            }
            else {
                const etype = this.normalizeTypeOnly((asgn.valexp as [TypeSignature, Expression])[0], env.binds);
                const easgn = this.emitCoerceIfNeeded(this.checkExpression(env.createInitialEnvForExpressionEval(), (asgn.valexp as [TypeSignature, Expression])[1], etype), (asgn.valexp as [TypeSignature, Expression])[1].sinfo, etype);

                return { keyname: asgn.keyname, valexp: [this.toTIRTypeKey(etype), easgn.expressionResult] as [TIRTypeKey, TIRExpression] };
            }
        });

        const benv = this.checkScopedBlockStatement(env, stmt.block);
        return [benv[0], [new TIREnvironmentSetStatementBracket(stmt.sinfo, assigns, benv[1], stmt.isFresh)]];
    }

    private checkTaskRunStatement(env: StatementTypeEnvironment, stmt: TaskRunStatement): [StatementTypeEnvironment, TIRStatement[]] {
        this.raiseErrorIf(stmt.sinfo, !this.m_taskOpsOk || this.m_taskSelfOk === "no", "This code does not permit task operations (not a task method/action)");

        const [rtask, tirtask, taskdecl] = this.extractTaskInfo(env, stmt.task);
        const execargs = this.checkTaskDeclExecArgs(stmt.sinfo, env, taskdecl, TemplateBindScope.createBaseBindScope(rtask.binds), stmt.taskargs);

        this.raiseErrorIf(stmt.sinfo, stmt.args.length - 1 !== taskdecl.memberFields.length, `expected a field initializer + args`);

        const tfieldsrecord = this.getTaskFieldsInitRecord(rtask);
        const fieldarg = this.emitCoerceIfNeeded(this.checkExpression(env.createInitialEnvForExpressionEval(), stmt.args[0], tfieldsrecord), stmt.sinfo, tfieldsrecord);

        this.raiseErrorIf(stmt.sinfo, stmt.args.length - 1 !== taskdecl.mainfunc.invoke.params.length, `expected ${taskdecl.mainfunc.invoke.params.length} arguments for task but got ${stmt.args.length - 1}`);
        const fargs = stmt.args.slice(1).map((arg, ii) => {
            const ptype = this.normalizeTypeOnly(taskdecl.mainfunc.invoke.params[ii].type, TemplateBindScope.createBaseBindScope(rtask.binds));
            return this.emitCoerceIfNeeded(this.checkExpression(env.createInitialEnvForExpressionEval(), arg, ptype), arg.sinfo, ptype).expressionResult
        });

        const [eenv, vtrgt] = this.checkVTargetOption(stmt.sinfo, env, rtask, stmt.isdefine, stmt.isconst, stmt.vtrgt);
        const trun = new TIRTaskRunStatement(stmt.sinfo, stmt.isdefine, stmt.isconst, vtrgt, tirtask, execargs, {rarg: fieldarg.expressionResult, rtype: this.toTIRTypeKey(tfieldsrecord)}, fargs);
        
        return [eenv, [trun]];
    }

    private checkTaskMultiStatement(env: StatementTypeEnvironment, stmt: TaskMultiStatement): [StatementTypeEnvironment, TIRStatement[]] {
        this.raiseErrorIf(stmt.sinfo, !this.m_taskOpsOk || this.m_taskSelfOk === "no", "This code does not permit task operations (not a task method/action)");

        let cenv = env;
        let vtrgts: {name: string, vtype: TIRTypeKey}[] = [];
        let tasks: {task: TIRTypeKey, targs: {argn: string, argv: TIRExpression}[], argtype: TIRTypeKey, consargtype: TIRTypeKey, argexp: TIRExpression}[] = [];

        this.raiseErrorIf(stmt.sinfo, stmt.tasks.length !== stmt.args.length, `expected same number of tasks and argpacks but got ${stmt.tasks.length} and ${stmt.args.length}`);
        for (let i = 0; i < stmt.tasks.length; ++i) {
            const [rtask, tirtask, taskdecl] = this.extractTaskInfo(env, stmt.tasks[i]);
            const execargs = this.checkTaskDeclExecArgs(stmt.sinfo, env, taskdecl, TemplateBindScope.createBaseBindScope(rtask.binds), stmt.taskargs);

            const tfieldsrecord = this.getTaskFieldsInitRecord(rtask);
            const fargtuple = this.getTaskArgsTuple(rtask);
            const aargtype = ResolvedType.createSingle(ResolvedTupleAtomType.create([tfieldsrecord, ...(fargtuple.options[0] as ResolvedTupleAtomType).types]));
            
            const argexp = this.emitCoerceIfNeeded(this.checkExpression(env.createInitialEnvForExpressionEval(), stmt.args[i], aargtype), stmt.args[i].sinfo, aargtype);
            const [eenv, vtrgt] = this.checkVTargetOption(stmt.sinfo, env, rtask, stmt.isdefine, stmt.isconst, stmt.vtrgts[i]);

            cenv = eenv;
            vtrgts.push(vtrgt);
            tasks.push({task: tirtask, targs: execargs, argtype: this.toTIRTypeKey(aargtype), consargtype: this.toTIRTypeKey(tfieldsrecord), argexp: argexp.expressionResult});
        }

        const trun = new TIRTaskMultiStatement(stmt.sinfo, stmt.isdefine, stmt.isconst, vtrgts, tasks);
        return [cenv, [trun]];
    }

    private checkTaskDashStatement(env: StatementTypeEnvironment, stmt: TaskDashStatement): [StatementTypeEnvironment, TIRStatement[]] {
        this.raiseErrorIf(stmt.sinfo, !this.m_taskOpsOk || this.m_taskSelfOk === "no", "This code does not permit task operations (not a task method/action)");

        let cenv = env;
        let vtrgts: {name: string, vtype: TIRTypeKey, restype: TIRTypeKey}[] = [];
        let tasks: {task: TIRTypeKey, targs: {argn: string, argv: TIRExpression}[], argtype: TIRTypeKey, consargtype: TIRTypeKey, argexp: TIRExpression}[] = [];

        this.raiseErrorIf(stmt.sinfo, stmt.tasks.length !== stmt.args.length, `expected same number of tasks and argpacks but got ${stmt.tasks.length} and ${stmt.args.length}`);
        for (let i = 0; i < stmt.tasks.length; ++i) {
            const [rtask, tirtask, taskdecl] = this.extractTaskInfo(env, stmt.tasks[i]);
            const execargs = this.checkTaskDeclExecArgs(stmt.sinfo, env, taskdecl, TemplateBindScope.createBaseBindScope(rtask.binds), stmt.taskargs);

            const tfieldsrecord = this.getTaskFieldsInitRecord(rtask);
            const fargtuple = this.getTaskArgsTuple(rtask);
            const aargtype = ResolvedType.createSingle(ResolvedTupleAtomType.create([tfieldsrecord, ...(fargtuple.options[0] as ResolvedTupleAtomType).types]));
            
            const argexp = this.emitCoerceIfNeeded(this.checkExpression(env.createInitialEnvForExpressionEval(), stmt.args[i], aargtype), stmt.args[i].sinfo, aargtype);
            const [eenv, vtrgt] = this.checkVTargetOptionWithNone(stmt.sinfo, env, rtask, stmt.isdefine, stmt.isconst, stmt.vtrgts[i]);

            cenv = eenv;
            vtrgts.push(vtrgt);
            tasks.push({task: tirtask, targs: execargs, argtype: this.toTIRTypeKey(aargtype), consargtype: this.toTIRTypeKey(tfieldsrecord), argexp: argexp.expressionResult});
        }

        const trun = new TIRTaskDashStatement(stmt.sinfo, stmt.isdefine, stmt.isconst, vtrgts, tasks);
        return [cenv, [trun]];
    }

    private checkTaskAllStatement(env: StatementTypeEnvironment, stmt: TaskAllStatement): [StatementTypeEnvironment, TIRStatement[]] {
        this.raiseErrorIf(stmt.sinfo, !this.m_taskOpsOk || this.m_taskSelfOk === "no", "This code does not permit task operations (not a task method/action)");

        const [rtask, tirtask, taskdecl] = this.extractTaskInfo(env, stmt.task);
        const execargs = this.checkTaskDeclExecArgs(stmt.sinfo, env, taskdecl, TemplateBindScope.createBaseBindScope(rtask.binds), stmt.taskargs);

        const tfieldsrecord = this.getTaskFieldsInitRecord(rtask);
        const fargtuple = this.getTaskArgsTuple(rtask);
        const aargtype = ResolvedType.createSingle(ResolvedTupleAtomType.create([tfieldsrecord, ...(fargtuple.options[0] as ResolvedTupleAtomType).types]));
        const aarglist = ResolvedType.createSingle(ResolvedListEntityAtomType.create(this.m_assembly.tryGetObjectTypeForFullyResolvedName("List") as EntityTypeDecl, aargtype));

        const larg = this.emitCoerceIfNeeded(this.checkExpression(env.createInitialEnvForExpressionEval(), stmt.arg, aarglist), stmt.arg.sinfo, aarglist);

        const [eenv, vtrgt] = this.checkVTargetOptionWithList(stmt.sinfo, env, rtask, stmt.isdefine, stmt.isconst, stmt.vtrgt);
        const trun = new TIRTaskAllStatement(stmt.sinfo, stmt.isdefine, stmt.isconst, vtrgt, tirtask, execargs, larg.expressionResult, this.toTIRTypeKey(aarglist), this.toTIRTypeKey(aargtype));
        
        return [eenv, [trun]];
    }

    private checkTaskRaceStatement(env: StatementTypeEnvironment, stmt: TaskRaceStatement): [StatementTypeEnvironment, TIRStatement[]] {
        this.raiseErrorIf(stmt.sinfo, !this.m_taskOpsOk || this.m_taskSelfOk === "no", "This code does not permit task operations (not a task method/action)");

        const [rtask, tirtask, taskdecl] = this.extractTaskInfo(env, stmt.task);
        const execargs = this.checkTaskDeclExecArgs(stmt.sinfo, env, taskdecl, TemplateBindScope.createBaseBindScope(rtask.binds), stmt.taskargs);

        const tfieldsrecord = this.getTaskFieldsInitRecord(rtask);
        const fargtuple = this.getTaskArgsTuple(rtask);
        const aargtype = ResolvedType.createSingle(ResolvedTupleAtomType.create([tfieldsrecord, ...(fargtuple.options[0] as ResolvedTupleAtomType).types]));
        const aarglist = ResolvedType.createSingle(ResolvedListEntityAtomType.create(this.m_assembly.tryGetObjectTypeForFullyResolvedName("List") as EntityTypeDecl, aargtype));

        const larg = this.emitCoerceIfNeeded(this.checkExpression(env.createInitialEnvForExpressionEval(), stmt.arg, aarglist), stmt.arg.sinfo, aarglist);

        const [eenv, vtrgt] = this.checkVTargetOptionWithIndex(stmt.sinfo, env, rtask, stmt.isdefine, stmt.isconst, stmt.vtrgt);
        const trun = new TIRTaskRaceStatement(stmt.sinfo, stmt.isdefine, stmt.isconst, vtrgt, tirtask, execargs, larg.expressionResult, this.toTIRTypeKey(aarglist), this.toTIRTypeKey(aargtype));
        
        return [eenv, [trun]];
    }

    private checkTaskCallWithStatement(env: StatementTypeEnvironment, stmt: TaskCallWithStatement): [StatementTypeEnvironment, TIRStatement[]] {
        return TYPECHECKER_NOT_IMPLEMENTED<[StatementTypeEnvironment, TIRStatement[]]>("TaskCallWithStatement");
    }

    private checkTaskResultWithStatement(env: StatementTypeEnvironment, stmt: TaskResultWithStatement): [StatementTypeEnvironment, TIRStatement[]] {
        return TYPECHECKER_NOT_IMPLEMENTED<[StatementTypeEnvironment, TIRStatement[]]>("TaskResultWithStatement");
    }

    private checkTaskSetStatusStatement(env: StatementTypeEnvironment, stmt: TaskSetStatusStatement): [StatementTypeEnvironment, TIRStatement[]] {
        return TYPECHECKER_NOT_IMPLEMENTED<[StatementTypeEnvironment, TIRStatement[]]>("TaskSetStatusStatement");
    }

    private checkTaskSetSelfFieldStatement(env: StatementTypeEnvironment, stmt: TaskSetSelfFieldStatement): [StatementTypeEnvironment, TIRStatement[]] {
        this.raiseErrorIf(stmt.sinfo, !this.m_taskOpsOk || this.m_taskSelfOk !== "write", "This code does not permit task operations (not a task method/action)");
        const tsk = this.m_taskType as {taskdecl: TaskTypeDecl, taskbinds: Map<string, ResolvedType>};
        const tasktype = ResolvedType.createSingle(ResolvedTaskAtomType.create(tsk.taskdecl, tsk.taskbinds));

        const fftry = tsk.taskdecl.memberFields.find((f) => f.name === stmt.fname);
        this.raiseErrorIf(stmt.sinfo, fftry === undefined, `field ${stmt.fname} is not defined on task ${tsk.taskdecl.name}`);
        const ff = fftry as MemberFieldDecl;

        const fftype = this.normalizeTypeOnly(ff.declaredType, TemplateBindScope.createBaseBindScope(tsk.taskbinds));
        const fkey = TIRIDGenerator.generateMemberFieldID(this.toTIRTypeKey(tasktype), stmt.fname);

        const value = this.emitCoerceIfNeeded(this.checkExpression(env.createInitialEnvForExpressionEval(), stmt.value, fftype), stmt.value.sinfo, fftype);
        const tset = new TIRTaskSetSelfFieldStatement(stmt.sinfo, this.toTIRTypeKey(tasktype), fkey, stmt.fname, value.expressionResult);

        return [env, [tset]];
    }

    private checkTaskEventEmitStatement(env: StatementTypeEnvironment, stmt: TaskEventEmitStatement): [StatementTypeEnvironment, TIRStatement[]] {
        return TYPECHECKER_NOT_IMPLEMENTED<[StatementTypeEnvironment, TIRStatement[]]>("TaskEventEmitStatement");
    }
*/
    checkStatement(env, stmt) {
        if (!env.isnormalflow) {
            this.reportError(stmt.sinfo, "Unreachable code");
            return env;
        }
        switch (stmt.tag) {
            case StatementTag.EmptyStatement: {
                return this.checkEmptyStatement(env, stmt);
            }
            case StatementTag.VariableDeclarationStatement: {
                return this.checkVariableDeclarationStatement(env, stmt);
            }
            case StatementTag.VariableMultiDeclarationStatement: {
                return this.checkVariableMultiDeclarationStatement(env, stmt);
            }
            case StatementTag.VariableInitializationStatement: {
                return this.checkVariableInitializationStatement(env, stmt);
            }
            case StatementTag.VariableMultiInitializationStatement: {
                return this.checkVariableMultiInitializationStatement(env, stmt);
            }
            case StatementTag.VariableAssignmentStatement: {
                return this.checkVariableAssignmentStatement(env, stmt);
            }
            case StatementTag.VariableMultiAssignmentStatement: {
                return this.checkVariableMultiAssignmentStatement(env, stmt);
            }
            case StatementTag.ReturnVoidStatement: {
                return this.checkReturnVoidStatement(env, stmt);
            }
            case StatementTag.ReturnSingleStatement: {
                return this.checkReturnSingleStatement(env, stmt);
            }
            case StatementTag.ReturnMultiStatement: {
                return this.checkReturnMultiStatement(env, stmt);
            }
            case StatementTag.IfStatement: {
                return this.checkIfStatement(env, stmt);
            }
            case StatementTag.IfElseStatement: {
                return this.checkIfElseStatement(env, stmt);
            }
            case StatementTag.IfElifElseStatement: {
                return this.checkIfElifElseStatement(env, stmt);
            }
            case StatementTag.SwitchStatement: {
                return this.checkSwitchStatement(env, stmt);
            }
            case StatementTag.MatchStatement: {
                return this.checkMatchStatement(env, stmt);
            }
            case StatementTag.DispatchPatternStatement: {
                return this.checkDispatchPatternStatement(env, stmt);
            }
            case StatementTag.DispatchTaskStatement: {
                return this.checkDispatchTaskStatement(env, stmt);
            }
            case StatementTag.AbortStatement: {
                return this.checkAbortStatement(env, stmt);
            }
            case StatementTag.AssertStatement: {
                return this.checkAssertStatement(env, stmt);
            }
            case StatementTag.ValidateStatement: {
                return this.checkValidateStatement(env, stmt);
            }
            case StatementTag.DebugStatement: {
                return this.checkDebugStatement(env, stmt);
            }
            case StatementTag.VoidRefCallStatement: {
                return this.checkVoidRefCallStatement(env, stmt);
            }
            case StatementTag.VarUpdateStatement: {
                return this.checkVarUpdateStatement(env, stmt);
            }
            case StatementTag.ThisUpdateStatement: {
                return this.checkThisUpdateStatement(env, stmt);
            }
            case StatementTag.SelfUpdateStatement: {
                return this.checkSelfUpdateStatement(env, stmt);
            }
            case StatementTag.TaskStatusStatement: {
                return this.checkTaskStatusStatement(env, stmt);
            }
            case StatementTag.TaskCheckAndHandleTerminationStatement: {
                return this.checkTaskCheckAndHandleTerminationStatement(env, stmt);
            }
            case StatementTag.TaskYieldStatement: {
                return this.checkTaskYieldStatement(env, stmt);
            }
            case StatementTag.HoleStatement: {
                return this.checkHoleStatement(env, stmt);
            }
            case StatementTag.BlockStatement: {
                return this.checkBlockStatement(env, stmt);
            }
            default: {
                assert(stmt.tag === StatementTag.ErrorStatement, `Unknown statement kind -- ${stmt.tag}`);
                return env;
            }
        }
    }
    checkBodyImplementation(env, body, params) {
        if ((body instanceof AbstractBodyImplementation) || (body instanceof PredicateUFBodyImplementation) || (body instanceof BuiltinBodyImplementation)) {
            return env;
        }
        if (body instanceof HoleBodyImplementation) {
            if (body.samplesfile !== undefined) {
                const sptype = this.checkExpression(env, body.samplesfile, undefined);
                this.checkError(body.sinfo, (sptype instanceof ErrorTypeSignature) || sptype.tkeystr !== "Path", `Samples file expression does not have a path type -- got ${sptype.emit()}`);
            }
        }
        else if (body instanceof ExpressionBodyImplementation) {
            const etype = this.checkExpression(env, body.exp, env.inferReturn);
            this.checkError(body.sinfo, !(etype instanceof ErrorTypeSignature) && !this.relations.isSubtypeOf(etype, env.declReturnType, this.constraints), `Expression body does not match expected return type -- expected ${env.declReturnType.emit()} but got ${etype.emit()}`);
        }
        else {
            assert(body instanceof StandardBodyImplementation);
            for (let i = 0; i < body.statements.length; ++i) {
                env = this.checkStatement(env, body.statements[i]);
            }
            //check that any params described as out are assigned to and if there are any condouts then the return type is Bool
            const outp = params.find((p) => p.pkind === "out");
            if (outp !== undefined) {
                const vinfo = env.resolveLocalVarInfoFromSrcName(outp.name);
                this.checkError(body.sinfo, !vinfo.mustDefined, `Parameter "out ${outp.name}" is not definitely assigned in function body`);
            }
            const condoutp = params.find((p) => p.pkind === "out?");
            if (condoutp !== undefined) {
                this.checkError(body.sinfo, !this.relations.isBooleanType(env.declReturnType), `Function with conditional out parameter ${condoutp.name} must have a boolean return type`);
            }
            this.checkError(body.sinfo, !this.isVoidType(env.declReturnType) && env.isnormalflow, "Function does not have a return statement in all code paths");
        }
        return env;
    }
    checkRequires(env, requires) {
        for (let i = 0; i < requires.length; ++i) {
            const precond = requires[i];
            const etype = this.checkChkLogicExpression(env, precond.exp);
            this.checkError(precond.sinfo, !this.relations.isBooleanType(etype), `Requires expression does not have a boolean type -- got ${etype.emit()}`);
        }
    }
    checkEnsures(env, returntype, refvars, eventtype, ensures) {
        let eev = env.pushNewLocalScope();
        eev = eev.addLocalVar(WELL_KNOWN_RETURN_VAR_NAME, returntype, "let", true);
        if (eventtype !== undefined) {
            const eldecl = this.relations.assembly.getCoreNamespace().typedecls.find((td) => td.name === "EventList");
            const eventlisttype = new NominalTypeSignature(SourceInfo.implicitSourceInfo(), undefined, eldecl, [eventtype]);
            eev = eev.addLocalVar(WELL_KNOWN_EVENTS_VAR_NAME, eventlisttype, "let", true);
        }
        for (let i = 0; i < refvars.length; ++i) {
            const v = refvars[i];
            eev = eev.addLocalVar("$" + v, env.resolveLocalVarInfoFromSrcName(v).decltype, "let", true);
        }
        for (let i = 0; i < ensures.length; ++i) {
            const postcond = ensures[i];
            const etype = this.checkChkLogicExpression(eev, postcond.exp);
            this.checkError(postcond.sinfo, !this.relations.isBooleanType(etype), `Ensures expression does not have a boolean type -- got ${etype.emit()}`);
        }
    }
    checkInvariants(bnames, invariants) {
        const env = TypeEnvironment.createInitialStdEnv(this.getWellKnownType("Bool"), new SimpleTypeInferContext(this.getWellKnownType("Bool")), bnames.map((bn) => new VarInfo("$" + bn.name, bn.type, "let", true)));
        for (let i = 0; i < invariants.length; ++i) {
            const inv = invariants[i];
            const etype = this.checkChkLogicExpression(env, inv.exp);
            this.checkError(invariants[i].sinfo, !this.relations.isBooleanType(etype), `Invariant expression does not have a boolean type -- got ${etype.emit()}`);
        }
    }
    checkValidates(bnames, validates) {
        const env = TypeEnvironment.createInitialStdEnv(this.getWellKnownType("Bool"), new SimpleTypeInferContext(this.getWellKnownType("Bool")), bnames.map((bn) => new VarInfo("$" + bn.name, bn.type, "let", true)));
        for (let i = 0; i < validates.length; ++i) {
            const validate = validates[i];
            const etype = this.checkChkLogicExpression(env, validate.exp);
            this.checkError(validates[i].sinfo, !this.relations.isBooleanType(etype), `Validate expression does not have a boolean type -- got ${etype.emit()}`);
        }
    }
    checkExplicitInvokeDeclTermInfoClause(sinfo, trclause) {
        const tok = this.checkTypeSignature(trclause.t);
        const subtok = trclause.subtype === undefined || this.checkTypeSignature(trclause.subtype);
        if (!tok || !subtok) {
            return;
        }
        const tinscope = this.constraints.resolveConstraint(trclause.t.name);
        if (tinscope === undefined) {
            this.checkError(sinfo, true, `Template argument ${trclause.t.name} is not in scope -- so can't refine it`);
        }
    }
    checkExplicitInvokeDeclTermInfo(idecl) {
        this.checkTemplateTypesOnInvoke(idecl.sinfo, idecl.terms);
    }
    checkExplicitInvokeDeclTermConstraints(idecl) {
        if (idecl.termRestriction !== undefined) {
            for (let i = 0; i < idecl.termRestriction.clauses.length; ++i) {
                this.checkExplicitInvokeDeclTermInfoClause(idecl.sinfo, idecl.termRestriction.clauses[i]);
            }
        }
    }
    checkExplicitInvokeDeclSignature(idecl, specialvinfo) {
        let argnames = new Set();
        const fullvinfo = [...specialvinfo, ...idecl.params.map((p) => new VarInfo("$" + p.name, p.type, p.pkind || "let", true))];
        for (let i = 0; i < idecl.params.length; ++i) {
            const p = idecl.params[i];
            this.checkError(idecl.sinfo, argnames.has(p.name), `Duplicate parameter name ${p.name}`);
            argnames.add(p.name);
            const tok = this.checkTypeSignature(p.type);
            if (tok && p.optDefaultValue !== undefined) {
                const env = TypeEnvironment.createInitialStdEnv(idecl.resultType, new SimpleTypeInferContext(idecl.resultType), fullvinfo);
                const etype = this.checkExpression(env, p.optDefaultValue, p.type);
                this.checkError(idecl.sinfo, !(etype instanceof ErrorTypeSignature) && !this.relations.isSubtypeOf(etype, p.type, this.constraints), `Default value does not match declared type -- expected ${p.type.emit()} but got ${etype.emit()}`);
            }
            this.checkError(p.type.sinfo, p.pkind === "ref" && !TypeChecker.isTypeUpdatable(p.type)[0], `Ref parameter must be of an updatable type`);
        }
        this.checkTypeSignature(idecl.resultType);
    }
    checkExplicitInvokeDeclMetaData(idecl, specialvinfo, specialrefvars, eventtype) {
        const fullvinfo = [...specialvinfo, ...idecl.params.map((p) => new VarInfo(p.name, p.type, p.pkind || "let", true))];
        const fullrefvars = [...specialrefvars, ...idecl.params.filter((p) => p.pkind === "ref" || p.pkind === "inout").map((p) => p.name)];
        const ienv = TypeEnvironment.createInitialStdEnv(this.getWellKnownType("Bool"), new SimpleTypeInferContext(this.getWellKnownType("Bool")), fullvinfo);
        this.checkRequires(ienv, idecl.preconditions);
        this.checkEnsures(ienv, idecl.resultType, fullrefvars, eventtype, idecl.postconditions);
    }
    checkNamespaceFunctionDecls(fdecls) {
        for (let i = 0; i < fdecls.length; ++i) {
            const fdecl = fdecls[i];
            this.file = fdecl.file;
            this.checkExplicitInvokeDeclTermInfo(fdecl);
            if (fdecl.terms.length !== 0) {
                this.constraints.pushConstraintDeclsScope(fdecl.terms);
            }
            this.checkExplicitInvokeDeclTermConstraints(fdecl);
            if (fdecl.termRestriction !== undefined) {
                this.constraints.pushConstraintRestrictionScope(fdecl.termRestriction);
            }
            this.checkExplicitInvokeDeclSignature(fdecl, []);
            this.checkExplicitInvokeDeclMetaData(fdecl, [], [], undefined);
            const infertype = this.relations.convertTypeSignatureToTypeInferCtx(fdecl.resultType);
            const env = TypeEnvironment.createInitialStdEnv(fdecl.resultType, infertype, fdecl.params.map((p) => new VarInfo(p.name, p.type, p.pkind || "let", true)));
            this.checkBodyImplementation(env, fdecl.body, fdecl.params);
            if (fdecl.terms.length !== 0) {
                this.constraints.popConstraintScope();
            }
            this.file = CLEAR_FILENAME;
        }
    }
    checkTypeFunctionDecls(tdecl, fdecls) {
        for (let i = 0; i < fdecls.length; ++i) {
            const fdecl = fdecls[i];
            this.checkExplicitInvokeDeclTermInfo(fdecl);
            if (fdecl.terms.length !== 0) {
                this.constraints.pushConstraintDeclsScope(fdecl.terms);
            }
            this.checkExplicitInvokeDeclTermConstraints(fdecl);
            if (fdecl.termRestriction !== undefined) {
                this.constraints.pushConstraintRestrictionScope(fdecl.termRestriction);
            }
            this.checkExplicitInvokeDeclSignature(fdecl, []);
            this.checkExplicitInvokeDeclMetaData(fdecl, [], [], undefined);
            const infertype = this.relations.convertTypeSignatureToTypeInferCtx(fdecl.resultType);
            const env = TypeEnvironment.createInitialStdEnv(fdecl.resultType, infertype, fdecl.params.map((p) => new VarInfo(p.name, p.type, p.pkind || "let", true)));
            this.checkBodyImplementation(env, fdecl.body, fdecl.params);
            if (fdecl.terms.length !== 0) {
                this.constraints.popConstraintScope();
            }
        }
    }
    checkMethodDecls(tdecl, rcvr, mdecls) {
        for (let i = 0; i < mdecls.length; ++i) {
            const mdecl = mdecls[i];
            this.checkExplicitInvokeDeclTermInfo(mdecl);
            if (mdecl.terms.length !== 0) {
                this.constraints.pushConstraintDeclsScope(mdecl.terms);
            }
            this.checkExplicitInvokeDeclTermConstraints(mdecl);
            if (mdecl.termRestriction !== undefined) {
                this.constraints.pushConstraintRestrictionScope(mdecl.termRestriction);
            }
            const thisvinfo = new VarInfo("this", rcvr, mdecl.isThisRef ? "ref" : "let", true);
            this.checkExplicitInvokeDeclSignature(mdecl, [thisvinfo]);
            this.checkExplicitInvokeDeclMetaData(mdecl, [thisvinfo], mdecl.isThisRef ? ["this"] : [], undefined);
            const infertype = this.relations.convertTypeSignatureToTypeInferCtx(mdecl.resultType);
            const env = TypeEnvironment.createInitialStdEnv(mdecl.resultType, infertype, [thisvinfo, ...mdecl.params.map((p) => new VarInfo(p.name, p.type, p.pkind || "let", true))]);
            this.checkBodyImplementation(env, mdecl.body, mdecl.params);
            if (mdecl.terms.length !== 0) {
                this.constraints.popConstraintScope();
            }
        }
    }
    checkTaskMethodDecls(tdecl, rcvr, mdecls) {
        for (let i = 0; i < mdecls.length; ++i) {
            assert(false, "Not implemented -- checkTaskMethodDecl");
        }
    }
    checkTaskActionDecls(tdecl, rcvr, mdecls) {
        for (let i = 0; i < mdecls.length; ++i) {
            assert(false, "Not implemented -- checkTaskActionDecl");
        }
    }
    checkConstMemberDecls(tdecl, mdecls) {
        for (let i = 0; i < mdecls.length; ++i) {
            const m = mdecls[i];
            if (this.checkTypeSignature(m.declaredType)) {
                const infertype = this.relations.convertTypeSignatureToTypeInferCtx(m.declaredType);
                const env = TypeEnvironment.createInitialStdEnv(m.declaredType, infertype, []);
                const decltype = this.checkExpression(env, m.value, new SimpleTypeInferContext(m.declaredType));
                this.checkError(m.sinfo, !(decltype instanceof ErrorTypeSignature) && !this.relations.isSubtypeOf(decltype, m.declaredType, this.constraints), `Const initializer does not match declared type -- expected ${m.declaredType.emit()} but got ${decltype.emit()}`);
            }
        }
    }
    checkMemberFieldDecls(bnames, fdecls) {
        for (let i = 0; i < fdecls.length; ++i) {
            const f = fdecls[i];
            if (this.checkTypeSignature(f.declaredType)) {
                if (f.defaultValue !== undefined) {
                    const infertype = this.relations.convertTypeSignatureToTypeInferCtx(f.declaredType);
                    const env = TypeEnvironment.createInitialStdEnv(f.declaredType, infertype, []).pushNewLocalBinderScope(bnames.map((bn) => new VarInfo("$" + bn.name, bn.type, "let", true)));
                    const decltype = this.checkExpression(env, f.defaultValue, new SimpleTypeInferContext(f.declaredType));
                    const [, binds] = env.popLocalScope();
                    f.initdependencies = [...binds.accessed];
                    this.checkError(f.sinfo, !this.relations.isSubtypeOf(decltype, f.declaredType, this.constraints), `Field initializer does not match declared type -- expected ${f.declaredType.emit()} but got ${decltype.emit()}`);
                }
            }
        }
    }
    checkProvides(provides) {
        for (let i = 0; i < provides.length; ++i) {
            const p = provides[i];
            this.checkTypeSignature(p);
            if (!this.relations.isValidProvidesType(p)) {
                this.reportError(p.sinfo, `Invalid provides type -- ${p.emit()}`);
            }
        }
    }
    checkAbstractNominalTypeDeclVCallAndInheritance(tdecl, provides, isentity) {
        if (isentity) {
            const thisdynamic = tdecl.methods.some((mm) => mm.hasAttribute("override"));
            const pdynamic = provides.some((pp) => pp.decl.hasAttribute("abstract") || pp.decl.hasAttribute("virtual"));
            tdecl.hasDynamicInvokes = thisdynamic || pdynamic;
        }
        ////
        //TODO: Check that there are no name collisions on inhertied members and members in this
        //TODO: Check that all of the vcall resolves are unique .... and all of the vcall decls are implemented (depending on isentity)
        ////
    }
    checkAbstractNominalTypeDeclHelper(bnames, rcvr, tdecl, optfdecls, isentity) {
        this.file = tdecl.file;
        this.checkTemplateTypesOnType(tdecl.sinfo, tdecl.terms);
        if (tdecl.terms.length !== 0) {
            this.constraints.pushConstraintDeclsScope(tdecl.terms);
        }
        this.checkProvides(tdecl.provides);
        tdecl.saturatedProvides = this.relations.resolveTransitiveProvidesDecls(rcvr, this.constraints).map((tli) => tli.tsig.remapTemplateBindings(tli.mapping));
        tdecl.saturatedBFieldInfo = bnames;
        //make sure all of the invariants on this typecheck
        this.checkInvariants(bnames, tdecl.invariants);
        this.checkValidates(bnames, tdecl.validates);
        const { invariants, validators } = this.relations.resolveAllInheritedValidatorDecls(rcvr, this.constraints);
        tdecl.allInvariants = invariants.map((inv) => {
            return { containingtype: inv.typeinfo.tsig.remapTemplateBindings(inv.typeinfo.mapping), ii: inv.member.ii, file: inv.member.file, sinfo: inv.member.sinfo, tag: inv.member.diagnosticTag };
        });
        tdecl.allValidates = validators.map((inv) => {
            return { containingtype: inv.typeinfo.tsig.remapTemplateBindings(inv.typeinfo.mapping), ii: inv.member.ii, file: inv.member.file, sinfo: inv.member.sinfo, tag: inv.member.diagnosticTag };
        });
        this.checkConstMemberDecls(tdecl, tdecl.consts);
        this.checkTypeFunctionDecls(tdecl, tdecl.functions);
        this.checkMethodDecls(tdecl, rcvr, tdecl.methods);
        if (optfdecls !== undefined) {
            this.checkMemberFieldDecls(bnames, optfdecls);
        }
        this.checkAbstractNominalTypeDeclVCallAndInheritance(tdecl, tdecl.saturatedProvides, isentity);
        if (tdecl.terms.length !== 0) {
            this.constraints.popConstraintScope();
        }
        this.file = CLEAR_FILENAME;
    }
    checkEnumTypeDecl(ns, tdecl) {
        this.file = tdecl.file;
        this.checkError(tdecl.sinfo, tdecl.terms.length !== 0, "Enums cannot have template terms");
        const rcvr = new NominalTypeSignature(tdecl.sinfo, undefined, tdecl, []);
        this.checkProvides(tdecl.provides);
        this.checkError(tdecl.sinfo, tdecl.provides.length !== 0, "Enums cannot have provides types");
        this.checkError(tdecl.sinfo, tdecl.invariants.length !== 0 || tdecl.validates.length !== 0, "Enums cannot have invariants");
        this.checkError(tdecl.sinfo, tdecl.consts.length !== 0, "Enums cannot have consts");
        this.checkError(tdecl.sinfo, tdecl.functions.length !== 0, "Enums cannot have functions");
        this.checkMethodDecls(tdecl, rcvr, tdecl.methods);
        this.checkAbstractNominalTypeDeclVCallAndInheritance(tdecl, tdecl.saturatedProvides, true);
        let opts = new Set();
        for (let i = 0; i < tdecl.members.length; ++i) {
            this.checkError(tdecl.sinfo, opts.has(tdecl.members[i]), `Duplicate enum option ${tdecl.members[i]}`);
            opts.add(tdecl.members[i]);
        }
        this.file = CLEAR_FILENAME;
    }
    checkTypedeclTypeDecl(ns, tdecl) {
        this.file = tdecl.file;
        const okvalue = this.checkTypeSignature(tdecl.valuetype);
        if (!okvalue) {
            return;
        }
        const isvalueok = (tdecl.valuetype instanceof NominalTypeSignature) && tdecl.valuetype.decl.attributes.some((attr) => attr.name === "__typedeclable");
        if (!isvalueok) {
            this.reportError(tdecl.sinfo, `In type declaration value type must be simple primitive -- Bool, Int, etc.`);
            return;
        }
        if (tdecl.optsizerng !== undefined) {
            if (tdecl.optsizerng.min === undefined && tdecl.optsizerng.max === undefined) {
                this.reportError(tdecl.sinfo, `Invalid size range max and min -- at least one must be defined`);
            }
            const typevaluename = tdecl.valuetype.decl.name;
            let minParsed = undefined;
            let maxParsed = undefined;
            if (tdecl.optsizerng.min !== undefined) {
                minParsed = this.parseRangeBound(tdecl.sinfo, tdecl.optsizerng.min, typevaluename);
            }
            if (tdecl.optsizerng.max !== undefined) {
                maxParsed = this.parseRangeBound(tdecl.sinfo, tdecl.optsizerng.max, typevaluename);
            }
            if (minParsed !== undefined && minParsed.ok && maxParsed !== undefined && maxParsed.ok) {
                this.checkError(tdecl.sinfo, minParsed.value > maxParsed.value, `Range min (${tdecl.optsizerng.min}) must be <= max (${tdecl.optsizerng.max})`);
            }
            if (tdecl.optsizerng.min !== undefined && tdecl.optsizerng.max !== undefined) {
                try {
                    const minval = BigInt(tdecl.optsizerng.min.slice(0, -1));
                    const maxval = BigInt(tdecl.optsizerng.max.slice(0, -1));
                    this.checkError(tdecl.sinfo, minval > maxval, `Size range min cannot be larger than size range max`);
                }
                catch {
                    //ignore -- already reported as invalid
                }
            }
        }
        if (tdecl.optofexp !== undefined) {
            const checkerexp = tdecl.optofexp !== undefined ? this.relations.assembly.resolveValidatorLiteral(tdecl.optofexp) : undefined;
            this.checkError(tdecl.sinfo, checkerexp === undefined, `of expression must be regex or glob`);
            const typevaluename = tdecl.valuetype.decl.name;
            if (checkerexp !== undefined) {
                if (typevaluename === "String") {
                    this.checkError(tdecl.sinfo, checkerexp.tag !== ExpressionTag.LiteralUnicodeRegexExpression, `of expression must be unicode regex`);
                    const uretype = this.getWellKnownType("Regex");
                    this.checkExpression(TypeEnvironment.createInitialStdEnv(uretype, new SimpleTypeInferContext(uretype), []), checkerexp, undefined);
                    this.checkExpression(TypeEnvironment.createInitialStdEnv(uretype, new SimpleTypeInferContext(uretype), []), tdecl.optofexp, undefined);
                }
                else if (typevaluename === "CString") {
                    this.checkError(tdecl.sinfo, checkerexp.tag !== ExpressionTag.LiteralCRegexExpression, `of expression must be char regex`);
                    const cretype = this.getWellKnownType("CRegex");
                    this.checkExpression(TypeEnvironment.createInitialStdEnv(cretype, new SimpleTypeInferContext(cretype), []), checkerexp, undefined);
                    this.checkExpression(TypeEnvironment.createInitialStdEnv(cretype, new SimpleTypeInferContext(cretype), []), tdecl.optofexp, undefined);
                }
                else if (typevaluename === "Path") {
                    this.checkError(tdecl.sinfo, checkerexp.tag !== ExpressionTag.LiteralGlobExpression, `of expression must be path glob`);
                    const pgretype = this.getWellKnownType("PathGlob");
                    this.checkExpression(TypeEnvironment.createInitialStdEnv(pgretype, new SimpleTypeInferContext(pgretype), []), checkerexp, undefined);
                    this.checkExpression(TypeEnvironment.createInitialStdEnv(pgretype, new SimpleTypeInferContext(pgretype), []), tdecl.optofexp, undefined);
                }
                else {
                    this.reportError(tdecl.sinfo, `can only use "of" pattern on String/SCtring/Path types`);
                }
            }
        }
        const rcvr = new NominalTypeSignature(tdecl.sinfo, undefined, tdecl, []);
        this.checkProvides(tdecl.provides);
        tdecl.saturatedProvides = this.relations.resolveTransitiveProvidesDecls(rcvr, this.constraints).map((tli) => tli.tsig.remapTemplateBindings(tli.mapping));
        //Make sure that any provides types are not adding on fields!
        const providesdecls = this.relations.resolveTransitiveProvidesDecls(rcvr, this.constraints);
        for (let i = 0; i < providesdecls.length; ++i) {
            const pdecl = providesdecls[i];
            this.checkError(tdecl.sinfo, pdecl.tsig.decl.fields.length !== 0, `Provides type cannot have member fields -- ${pdecl.tsig.decl.name}`);
            this.checkError(tdecl.sinfo, pdecl.tsig.decl.invariants.length !== 0 || pdecl.tsig.decl.validates.length !== 0, `Provides type cannot have invariants -- ${pdecl.tsig.decl.name}`);
        }
        if (this.checkTypeSignature(tdecl.valuetype)) {
            //make sure the base type is typedeclable
            this.checkError(tdecl.sinfo, !this.relations.isTypedeclableType(tdecl.valuetype), `Base type is not typedeclable -- ${tdecl.valuetype.emit()}`);
            //make sure all of the invariants on this typecheck
            this.checkInvariants([{ name: "value", type: tdecl.valuetype, hasdefault: false }], tdecl.invariants);
            this.checkValidates([{ name: "value", type: tdecl.valuetype, hasdefault: false }], tdecl.validates);
        }
        const { invariants, validators } = this.relations.resolveAllTypeDeclaredValidatorDecls(rcvr, this.constraints);
        tdecl.allInvariants = invariants.map((inv) => {
            return { containingtype: inv.typeinfo.tsig.remapTemplateBindings(inv.typeinfo.mapping), ii: inv.member.ii, file: inv.member.file, sinfo: inv.member.sinfo, tag: inv.member.diagnosticTag };
        });
        tdecl.allValidates = validators.map((inv) => {
            return { containingtype: inv.typeinfo.tsig.remapTemplateBindings(inv.typeinfo.mapping), ii: inv.member.ii, file: inv.member.file, sinfo: inv.member.sinfo, tag: inv.member.diagnosticTag };
        });
        this.checkConstMemberDecls(tdecl, tdecl.consts);
        this.checkTypeFunctionDecls(tdecl, tdecl.functions);
        this.checkMethodDecls(tdecl, rcvr, tdecl.methods);
        this.checkAbstractNominalTypeDeclVCallAndInheritance(tdecl, [], true);
        if (tdecl.terms.length !== 0) {
            this.constraints.popConstraintScope();
        }
        this.file = CLEAR_FILENAME;
    }
    checkInteralSimpleTypeDeclHelper(ns, tdecl, isentity) {
        const rcvr = new NominalTypeSignature(tdecl.sinfo, undefined, tdecl, tdecl.terms.map((tt) => new TemplateTypeSignature(tdecl.sinfo, tt.name)));
        this.checkAbstractNominalTypeDeclHelper([], rcvr, tdecl, undefined, isentity);
    }
    checkPrimitiveEntityTypeDecl(ns, tdecl) {
        this.checkInteralSimpleTypeDeclHelper(ns, tdecl, true);
    }
    checkOkTypeDecl(ns, tdecl) {
        this.checkInteralSimpleTypeDeclHelper(ns, tdecl, true);
    }
    checkFailTypeDecl(ns, tdecl) {
        this.checkInteralSimpleTypeDeclHelper(ns, tdecl, true);
    }
    checkAPIErrorTypeDecl(ns, tdecl) {
        this.checkInteralSimpleTypeDeclHelper(ns, tdecl, true);
    }
    checkAPIRejectedTypeDecl(ns, tdecl) {
        this.checkInteralSimpleTypeDeclHelper(ns, tdecl, true);
    }
    checkAPIDeniedTypeDecl(ns, tdecl) {
        this.checkInteralSimpleTypeDeclHelper(ns, tdecl, true);
    }
    checkAPIFlaggedTypeDecl(ns, tdecl) {
        this.checkInteralSimpleTypeDeclHelper(ns, tdecl, true);
    }
    checkAPISuccessTypeDecl(ns, tdecl) {
        this.checkInteralSimpleTypeDeclHelper(ns, tdecl, true);
    }
    checkSomeTypeDecl(ns, tdecl) {
        this.checkInteralSimpleTypeDeclHelper(ns, tdecl, true);
    }
    checkMapEntryTypeDecl(ns, tdecl) {
        this.checkInteralSimpleTypeDeclHelper(ns, tdecl, true);
    }
    checkListTypeDecl(ns, tdecl) {
        this.checkInteralSimpleTypeDeclHelper(ns, tdecl, true);
    }
    checkStackTypeDecl(ns, tdecl) {
        this.checkInteralSimpleTypeDeclHelper(ns, tdecl, true);
    }
    checkQueueTypeDecl(ns, tdecl) {
        this.checkInteralSimpleTypeDeclHelper(ns, tdecl, true);
    }
    checkSetTypeDecl(ns, tdecl) {
        this.checkInteralSimpleTypeDeclHelper(ns, tdecl, true);
    }
    checkMapTypeDecl(ns, tdecl) {
        this.checkInteralSimpleTypeDeclHelper(ns, tdecl, true);
    }
    checkEventListTypeDecl(ns, tdecl) {
        this.checkInteralSimpleTypeDeclHelper(ns, tdecl, true);
    }
    checkEntityTypeDecl(ns, tdecl) {
        this.file = tdecl.file;
        const rcvr = new NominalTypeSignature(tdecl.sinfo, undefined, tdecl, tdecl.terms.map((tt) => new TemplateTypeSignature(tdecl.sinfo, tt.name)));
        const bnames = this.relations.generateAllFieldBNamesInfo(rcvr, tdecl.fields, this.constraints);
        this.checkAbstractNominalTypeDeclHelper(bnames, rcvr, tdecl, tdecl.fields, true);
        this.file = CLEAR_FILENAME;
    }
    checkOptionTypeDecl(ns, tdecl) {
        this.checkInteralSimpleTypeDeclHelper(ns, tdecl, false);
    }
    checkResultTypeDecl(ns, tdecl) {
        this.checkInteralSimpleTypeDeclHelper(ns, tdecl, false);
        this.constraints.pushConstraintDeclsScope(tdecl.terms);
        for (let i = 0; i < tdecl.nestedEntityDecls.length; ++i) {
            const ned = tdecl.nestedEntityDecls[i];
            if (ned instanceof OkTypeDecl) {
                this.checkOkTypeDecl(ns, ned);
            }
            else {
                this.checkFailTypeDecl(ns, ned);
            }
        }
        this.constraints.popConstraintScope();
    }
    checkAPIResultTypeDecl(ns, tdecl) {
        this.checkInteralSimpleTypeDeclHelper(ns, tdecl, false);
        this.constraints.pushConstraintDeclsScope(tdecl.terms);
        for (let i = 0; i < tdecl.nestedEntityDecls.length; ++i) {
            const ned = tdecl.nestedEntityDecls[i];
            if (ned instanceof APIErrorTypeDecl) {
                this.checkAPIErrorTypeDecl(ns, ned);
            }
            else if (ned instanceof APIRejectedTypeDecl) {
                this.checkAPIRejectedTypeDecl(ns, ned);
            }
            else if (ned instanceof APIDeniedTypeDecl) {
                this.checkAPIDeniedTypeDecl(ns, ned);
            }
            else if (ned instanceof APIFlaggedTypeDecl) {
                this.checkAPIFlaggedTypeDecl(ns, ned);
            }
            else {
                this.checkAPISuccessTypeDecl(ns, ned);
            }
        }
        this.constraints.popConstraintScope();
    }
    checkConceptTypeDecl(ns, tdecl) {
        this.file = tdecl.file;
        const rcvr = new NominalTypeSignature(tdecl.sinfo, undefined, tdecl, tdecl.terms.map((tt) => new TemplateTypeSignature(tdecl.sinfo, tt.name)));
        const bnames = this.relations.generateAllFieldBNamesInfo(rcvr, tdecl.fields, this.constraints);
        this.checkAbstractNominalTypeDeclHelper(bnames, rcvr, tdecl, tdecl.fields, false);
        this.file = CLEAR_FILENAME;
    }
    checkDatatypeMemberEntityTypeDecl(ns, parent, tdecl) {
        const rcvr = new NominalTypeSignature(tdecl.sinfo, undefined, tdecl, tdecl.terms.map((tt) => new TemplateTypeSignature(tdecl.sinfo, tt.name)));
        const bnames = this.relations.generateAllFieldBNamesInfo(rcvr, tdecl.fields, this.constraints);
        this.checkAbstractNominalTypeDeclHelper(bnames, rcvr, tdecl, tdecl.fields, true);
    }
    checkDatatypeTypeDecl(ns, tdecl) {
        this.file = tdecl.file;
        const rcvr = new NominalTypeSignature(tdecl.sinfo, undefined, tdecl, tdecl.terms.map((tt) => new TemplateTypeSignature(tdecl.sinfo, tt.name)));
        const bnames = this.relations.generateAllFieldBNamesInfo(rcvr, tdecl.fields, this.constraints);
        this.checkAbstractNominalTypeDeclHelper(bnames, rcvr, tdecl, tdecl.fields, true);
        for (let i = 0; i < tdecl.associatedMemberEntityDecls.length; ++i) {
            this.checkDatatypeMemberEntityTypeDecl(ns, tdecl, tdecl.associatedMemberEntityDecls[i]);
        }
        this.file = CLEAR_FILENAME;
    }
    checkConfigsurationParameters(tconfig) {
        assert(false, "Not implemented -- checkEnvironmentVariableInformation");
    }
    checkstatusinfo(status) {
        assert(false, "Not implemented -- checkStatusInformation");
    }
    checkenvreqs(envreqs) {
        assert(false, "Not implemented -- checkEnvironmentRequirements");
    }
    checkresourcereqs(resourcereqs) {
        assert(false, "Not implemented -- checkResourceRequirements");
    }
    checkeventinfo(eventinfo) {
        assert(false, "Not implemented -- checkEventInformation");
    }
    checkAPIDecl(adecl) {
        assert(false, "Not implemented -- checkAPIDecl");
    }
    checkAgentDecl(adecl) {
        assert(false, "Not implemented -- checkAgentDecl");
    }
    checkTaskDecl(ns, tdecl) {
        this.file = tdecl.file;
        this.checkTemplateTypesOnType(tdecl.sinfo, tdecl.terms);
        if (tdecl.terms.length !== 0) {
            this.constraints.pushConstraintDeclsScope(tdecl.terms);
        }
        const rcvr = new NominalTypeSignature(tdecl.sinfo, undefined, tdecl, tdecl.terms.map((tt) => new TemplateTypeSignature(tdecl.sinfo, tt.name)));
        const bnames = tdecl.fields.map((f) => { return { name: f.name, type: f.declaredType, hasdefault: f.defaultValue !== undefined, containingtype: rcvr }; });
        tdecl.saturatedBFieldInfo = bnames;
        //make sure all of the invariants on this typecheck
        this.checkInvariants(bnames, tdecl.invariants);
        this.checkValidates(bnames, tdecl.validates);
        const { invariants, validators } = this.relations.resolveAllInheritedValidatorDecls(rcvr, this.constraints);
        tdecl.allInvariants = invariants.map((inv) => {
            return { containingtype: inv.typeinfo.tsig.remapTemplateBindings(inv.typeinfo.mapping), ii: inv.member.ii, file: inv.member.file, sinfo: inv.member.sinfo, tag: inv.member.diagnosticTag };
        });
        tdecl.allValidates = validators.map((inv) => {
            return { containingtype: inv.typeinfo.tsig.remapTemplateBindings(inv.typeinfo.mapping), ii: inv.member.ii, file: inv.member.file, sinfo: inv.member.sinfo, tag: inv.member.diagnosticTag };
        });
        this.checkConstMemberDecls(tdecl, tdecl.consts);
        this.checkTypeFunctionDecls(tdecl, tdecl.functions);
        this.checkTaskMethodDecls(tdecl, rcvr, tdecl.selfmethods);
        this.checkTaskActionDecls(tdecl, rcvr, tdecl.actions);
        this.checkMemberFieldDecls(bnames, tdecl.fields);
        this.checkConfigsurationParameters(tdecl.configs);
        this.checkstatusinfo(tdecl.statusinfo);
        this.checkenvreqs(tdecl.envreqs);
        this.checkresourcereqs(tdecl.resourcereqs);
        this.checkeventinfo(tdecl.eventinfo);
        if (tdecl.terms.length !== 0) {
            this.constraints.popConstraintScope();
        }
        this.file = CLEAR_FILENAME;
    }
    checkNamespaceConstDecls(cdecls) {
        for (let i = 0; i < cdecls.length; ++i) {
            const m = cdecls[i];
            this.file = m.file;
            if (this.checkTypeSignature(m.declaredType)) {
                const infertype = this.relations.convertTypeSignatureToTypeInferCtx(m.declaredType);
                const decltype = this.checkExpression(TypeEnvironment.createInitialStdEnv(m.declaredType, infertype, []), m.value, m.declaredType);
                this.checkError(m.sinfo, !this.relations.isSubtypeOf(decltype, m.declaredType, this.constraints), `Const initializer does not match declared type -- expected ${m.declaredType.emit()} but got ${decltype.emit()}`);
            }
            this.file = CLEAR_FILENAME;
        }
    }
    checkNamespaceTypeDecls(ns, tdecl) {
        for (let i = 0; i < tdecl.length; ++i) {
            const tt = tdecl[i];
            if (tt instanceof EnumTypeDecl) {
                this.checkEnumTypeDecl(ns, tt);
            }
            else if (tt instanceof TypedeclTypeDecl) {
                this.checkTypedeclTypeDecl(ns, tt);
            }
            else if (tt instanceof PrimitiveEntityTypeDecl) {
                this.checkPrimitiveEntityTypeDecl(ns, tt);
            }
            else if (tt instanceof OkTypeDecl) {
                this.checkOkTypeDecl(ns, tt);
            }
            else if (tt instanceof FailTypeDecl) {
                this.checkFailTypeDecl(ns, tt);
            }
            else if (tt instanceof APIErrorTypeDecl) {
                this.checkAPIErrorTypeDecl(ns, tt);
            }
            else if (tt instanceof APIRejectedTypeDecl) {
                this.checkAPIRejectedTypeDecl(ns, tt);
            }
            else if (tt instanceof APIDeniedTypeDecl) {
                this.checkAPIDeniedTypeDecl(ns, tt);
            }
            else if (tt instanceof APIFlaggedTypeDecl) {
                this.checkAPIFlaggedTypeDecl(ns, tt);
            }
            else if (tt instanceof APISuccessTypeDecl) {
                this.checkAPISuccessTypeDecl(ns, tt);
            }
            else if (tt instanceof SomeTypeDecl) {
                this.checkSomeTypeDecl(ns, tt);
            }
            else if (tt instanceof MapEntryTypeDecl) {
                this.checkMapEntryTypeDecl(ns, tt);
            }
            else if (tt instanceof ListTypeDecl) {
                this.checkListTypeDecl(ns, tt);
            }
            else if (tt instanceof StackTypeDecl) {
                this.checkStackTypeDecl(ns, tt);
            }
            else if (tt instanceof QueueTypeDecl) {
                this.checkQueueTypeDecl(ns, tt);
            }
            else if (tt instanceof SetTypeDecl) {
                this.checkSetTypeDecl(ns, tt);
            }
            else if (tt instanceof MapTypeDecl) {
                this.checkMapTypeDecl(ns, tt);
            }
            else if (tt instanceof EventListTypeDecl) {
                this.checkEventListTypeDecl(ns, tt);
            }
            else if (tt instanceof EntityTypeDecl) {
                this.checkEntityTypeDecl(ns, tt);
            }
            else if (tt instanceof DatatypeMemberEntityTypeDecl) {
                this.checkDatatypeMemberEntityTypeDecl(ns, tt.parentTypeDecl, tt);
            }
            else if (tt instanceof OptionTypeDecl) {
                this.checkOptionTypeDecl(ns, tt);
            }
            else if (tt instanceof ResultTypeDecl) {
                this.checkResultTypeDecl(ns, tt);
            }
            else if (tt instanceof APIResultTypeDecl) {
                this.checkAPIResultTypeDecl(ns, tt);
            }
            else if (tt instanceof ConceptTypeDecl) {
                this.checkConceptTypeDecl(ns, tt);
            }
            else if (tt instanceof DatatypeTypeDecl) {
                this.checkDatatypeTypeDecl(ns, tt);
            }
            else {
                assert(false, "Unknown type decl kind");
            }
        }
    }
    checkNamespaceDeclaration(decl) {
        //all usings should be resolved and valid so nothing to do there
        this.checkNamespaceConstDecls(decl.consts);
        this.checkNamespaceFunctionDecls(decl.functions);
        this.checkNamespaceTypeDecls(decl, decl.typedecls);
        for (let i = 0; i < decl.apis.length; ++i) {
            this.checkAPIDecl(decl.apis[i]);
        }
        for (let i = 0; i < decl.agents.length; ++i) {
            this.checkAgentDecl(decl.agents[i]);
        }
        for (let i = 0; i < decl.tasks.length; ++i) {
            this.checkTaskDecl(decl, decl.tasks[i]);
        }
        for (let i = 0; i < decl.subns.length; ++i) {
            this.checkNamespaceDeclaration(decl.subns[i]);
        }
    }
    processConstsAndValidatorREs(assembly) {
        const asmreinfo = assembly.toplevelNamespaces.flatMap((ns) => assembly.loadConstantsAndValidatorREs(ns));
        //Now process the regexs
        const err = loadConstAndValidateRESystem(asmreinfo);
        if (err !== null) {
            for (let i = 0; i < err.length; ++i) {
                this.reportError(SourceInfo.implicitSourceInfo(), err[i]);
            }
        }
    }
    static loadWellKnownType(assembly, name, wellknownTypes) {
        const ccore = assembly.getCoreNamespace();
        const tdecl = ccore.typedecls.find((td) => td.name === name);
        assert(tdecl !== undefined, "Failed to find well known type");
        wellknownTypes.set(name, new NominalTypeSignature(tdecl.sinfo, undefined, tdecl, []));
    }
    static checkAssembly(assembly) {
        let wellknownTypes = new Map();
        wellknownTypes.set("Void", new VoidTypeSignature(SourceInfo.implicitSourceInfo()));
        TypeChecker.loadWellKnownType(assembly, "None", wellknownTypes);
        TypeChecker.loadWellKnownType(assembly, "Some", wellknownTypes);
        TypeChecker.loadWellKnownType(assembly, "Bool", wellknownTypes);
        TypeChecker.loadWellKnownType(assembly, "Int", wellknownTypes);
        TypeChecker.loadWellKnownType(assembly, "Nat", wellknownTypes);
        TypeChecker.loadWellKnownType(assembly, "ChkInt", wellknownTypes);
        TypeChecker.loadWellKnownType(assembly, "ChkNat", wellknownTypes);
        TypeChecker.loadWellKnownType(assembly, "Rational", wellknownTypes);
        TypeChecker.loadWellKnownType(assembly, "Float", wellknownTypes);
        TypeChecker.loadWellKnownType(assembly, "Decimal", wellknownTypes);
        TypeChecker.loadWellKnownType(assembly, "DecimalDegree", wellknownTypes);
        TypeChecker.loadWellKnownType(assembly, "LatLongCoordinate", wellknownTypes);
        TypeChecker.loadWellKnownType(assembly, "Complex", wellknownTypes);
        TypeChecker.loadWellKnownType(assembly, "CChar", wellknownTypes);
        TypeChecker.loadWellKnownType(assembly, "UnicodeChar", wellknownTypes);
        TypeChecker.loadWellKnownType(assembly, "String", wellknownTypes);
        TypeChecker.loadWellKnownType(assembly, "CString", wellknownTypes);
        TypeChecker.loadWellKnownType(assembly, "Regex", wellknownTypes);
        TypeChecker.loadWellKnownType(assembly, "CRegex", wellknownTypes);
        TypeChecker.loadWellKnownType(assembly, "UUIDv4", wellknownTypes);
        TypeChecker.loadWellKnownType(assembly, "UUIDv7", wellknownTypes);
        const checker = new TypeChecker(new TemplateConstraintScope(), new TypeCheckerRelations(assembly, wellknownTypes));
        //Gather all the const and validator regexs, make sure they are valid and generate the compiled versions
        checker.processConstsAndValidatorREs(assembly);
        //Type-check each of the assemblies
        for (let i = 0; i < assembly.toplevelNamespaces.length; ++i) {
            checker.checkNamespaceDeclaration(assembly.toplevelNamespaces[i]);
        }
        return checker.errors;
    }
}
export { TypeError, TypeChecker };
//# sourceMappingURL=checker.js.map