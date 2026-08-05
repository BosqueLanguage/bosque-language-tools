import { DashResultTypeSignature, EListTypeSignature, FormatPathTypeSignature, FormatStringTypeSignature, LambdaTypeSignature, NominalTypeSignature, TemplateNameMapper, TemplateTypeSignature, VoidTypeSignature } from "../../frontend/type.js";
import { BuiltinBodyImplementation, CallNamespaceFunctionExpression, ChkLogicExpressionTag, ExpressionBodyImplementation, ExpressionTag, FormatStringTextComponent, HoleBodyImplementation, ITestBinderGuard, ITestFail, ITestNone, ITestOk, ITestSimpleGuard, ITestSome, ITestType, ITestTypeGuard, LiteralSimpleExpression, PassingArgumentValue, PositionalArgumentValue, PostfixOpTag, RValueExpressionTag, StandardBodyImplementation, StatementTag } from "../../frontend/body.js";
import { AbstractCollectionTypeDecl, AbstractConceptTypeDecl, AbstractEntityTypeDecl, AdditionalTypeDeclTag, APIDeniedTypeDecl, APIErrorTypeDecl, APIFlaggedTypeDecl, APIRejectedTypeDecl, APIResultTypeDecl, APISuccessTypeDecl, ConceptTypeDecl, ConstructableTypeDecl, DatatypeMemberEntityTypeDecl, DatatypeTypeDecl, EntityTypeDecl, EnumTypeDecl, EventListTypeDecl, FailTypeDecl, InvokeParameterDecl, ListTypeDecl, MapEntryTypeDecl, MapTypeDecl, OkTypeDecl, OptionTypeDecl, PrimitiveEntityTypeDecl, QueueTypeDecl, ResultTypeDecl, SetTypeDecl, SomeTypeDecl, StackTypeDecl, TypedeclTypeDecl } from "../../frontend/assembly.js";
import { IRDashResultTypeSignature, IREListTypeSignature, IRFormatCStringTypeSignature, IRFormatPathFragmentTypeSignature, IRFormatPathGlobTypeSignature, IRFormatPathTypeSignature, IRFormatStringTypeSignature, IRLambdaParameterPackTypeSignature, IRNominalTypeSignature, IRVoidTypeSignature } from "../irdefs/irtype.js";
import { IRDateRepresentation, IRDeltaDateRepresentation, IRDeltaTimeRepresentation, IRLiteralChkIntExpression, IRLiteralChkNatExpression, IRLiteralBoolExpression, IRLiteralByteBufferExpression, IRLiteralByteExpression, IRLiteralCCharExpression, IRLiteralComplexExpression, IRLiteralCRegexExpression, IRLiteralCStringExpression, IRLiteralDecimalExpression, IRLiteralDeltaDateTimeExpression, IRLiteralDeltaISOTimeStampExpression, IRLiteralDeltaLogicalTimeExpression, IRLiteralDeltaSecondsExpression, IRLiteralFloatExpression, IRLiteralIntExpression, IRLiteralISOTimeStampExpression, IRLiteralLatLongCoordinateExpression, IRLiteralLogicalTimeExpression, IRLiteralNatExpression, IRLiteralNoneExpression, IRLiteralPlainDateExpression, IRLiteralPlainTimeExpression, IRLiteralRationalExpression, IRLiteralSHAContentHashExpression, IRLiteralStringExpression, IRLiteralTAITimeExpression, IRLiteralTZDateTimeExpression, IRLiteralUnicodeCharExpression, IRLiteralUnicodeRegexExpression, IRLiteralUUIDv4Expression, IRLiteralUUIDv7Expression, IRTimeRepresentation, IRLiteralFormatStringExpression, IRFormatStringTextComponent, IRFormatStringArgComponent, IRLiteralFormatCStringExpression, IRLiteralTypedExpression, IRTypeDeclInvariantCheckStatement, IRLiteralTypedStringExpression, IRLiteralTypedCStringExpression, IRTaskAccessIDExpression, IRTaskAccessParentIDExpression, IRAccessEnvHasExpression, IRAccessEnvGetExpression, IRAccessEnvTryGetExpression, IRAccessConstantExpression, IRAccessEnumExpression, IRSimpleExpression, IRPreconditionCheckStatement, IRTempAssignExpressionStatement, IRAccessTempVariableExpression, IRAccessLocalVariableExpression, IRAccessCapturedVariableExpression, IRAccessParameterVariableExpression, IRPrefixNotOpExpression, IRAccessTypeDeclValueExpression, IRConstructSafeTypeDeclExpression, IRPrefixNegateOpExpression, IRBinAddExpression, IRErrorAdditionBoundsCheckStatement, IRBinSubExpression, IRBinMultExpression, IRBinDivExpression, IRErrorDivisionByZeroCheckStatement, IRErrorSubtractionBoundsCheckStatement, IRErrorMultiplicationBoundsCheckStatement, IRNumericEqExpression, IRNumericNeqExpression, IRNumericLessExpression, IRNumericLessEqExpression, IRNumericGreaterExpression, IRNumericGreaterEqExpression, IRLogicAndExpression, IRLogicOrExpression, IRNopStatement, IRVariableDeclarationStatement, IRVariableInitializationStatement, IRReturnVoidSimpleStatement, IRAbortStatement, IRImmediateExpression, IRReturnValueSimpleStatement, IRChkLogicImpliesShortCircuitStatement, IRInvokeDirectExpression, IRLogicSimpleConditionalExpression, IRLogicConditionalStatement, IRVariableInitializationDirectInvokeStatement, IRInvokeSimpleExpression, IRInvokeImplicitsExpression, IRTempAssignStdInvokeStatement, IRTempAssignRefInvokeStatement, IRReturnDirectInvokeStatement, IRAssertStatement, IRValidateStatement, IRDebugStatement, IRBuiltinBody, IRHoleBody, IRStandardBody, IRBinKeyEqDirectExpression, IRBinKeyLessDirectExpression, IRIsNoneOptionExpression, IRIsNotNoneOptionExpression, IRIsOptionEqValueExpression, IRIsOptionNeqValueExpression, IRIsSomeEqValueExpression, IRIsSomeNeqValueExpression, IRBinKeyNeqDirectExpression, IRConstructorOkTypeExpression, IRConstructorFailTypeExpression, IRConstructorSomeTypeExpression, IRConstructorMapEntryTypeExpression, IRLiteralDecimalDegreeExpression, IRTypeDeclSizeRangeCheckCStringStatement, IRTypeDeclSizeRangeCheckUnicodeStringStatement, IRTypeDeclFormatCheckCStringStatement, IRTypeDeclFormatCheckUnicodeStringStatement, IRLiteralOptionOfNoneExpression, IRConvertConceptRepresentationExpression, IRConstructResultFromOkExpression, IRConstructOptionFromSomeExpression, IRConstructResultFromFailExpression, IRBoxEntityToConceptRepresentationExpression, IRSimpleIfStatement, IRBlockStatement, IRSimpleIfElseStatement, IRConstructorStandardEntityExpression, IREntityInvariantCheckStatement, IRConstructExpression, IRVariableInitializationDirectConstructorStatement, IRReturnDirectConstructStatement, IRVariableAssignmentStatement, IRVariableAssignmentDirectInvokeStatement, IRVariableAssignmentDirectConstructorStatement, IRConstructorListEmptyExpression, IRConstructorListSingletonsExpression, IRReturnVoidWithImplicitStatement, IRReturnValueImplicitStatement, IRReturnDirectInvokeImplicitStatement, IRReturnDirectConstructWithBoxStatement, IRReturnDirectConstructImplicitStatement, IRReturnDirectConstructWithBoxImplicitStatement, IRReturnDirectInvokeImplicitPassThroughStatement, IRVariableInitializationDirectInvokeWithImplicitStatement, IRVariableAssignmentDirectInvokeWithImplicitStatement, IRInvokeSimpleWithImplicitsExpression, IRVoidInvokeStatement, IRVariableInitializationDirectConstructorWithBoxStatement, IRVariableAssignmentDirectConstructorWithBoxStatement, IRInterpolateFormatStringExpression, IRInterpolateFormatCStringExpression, IRAccessFieldSpecialExpression, IRAccessFieldDirectExpression, IRAccessFieldVirtualExpression, IRStaticIsTypeSubtypeOfExpression, IRIsConceptRepresentationOfTypeExpression, IRIsNotConceptRepresentationOfTypeExpression, IRIsNotConceptRepresentationSubtypeOfTypeExpression, IRIsConceptRepresentationSubtypeOfTypeExpression, IRExtractSomeFromOptionExpression, IRExtractSomeValueFromOptionExpression, IRErrorTypeAssertionCheckStatement, IRUnboxEntityFromConceptRepresentationExpression, IRConstructorLambdaExpression, IRMatchExactStatement, IRMatchGeneralStatement, IRErrorExhaustiveStatement, IRPostconditionCheckStatement, IRTypeDeclNumericRangeCheckStatement, IRTempAssignDirectConstructorStatement, IRConstructorEListExpression, IRAccessEListIndexExpression } from "../irdefs/irbody.js";
import { IRCRegex, IRURegex, IRSourceInfo } from "../irdefs/irsupport.js";
import { IRAssembly, IRConceptTypeDecl, IRConstantDecl, IRDatatypeMemberEntityTypeDecl, IRDatatypeTypeDecl, IRDeclarationDocString, IRDeclarationMetaTag, IREntityTypeDecl, IREnumTypeDecl, IRExampleDecl, IRInvariantDecl, IRInvokeDecl, IRInvokeParameterDecl, IRLambdaParameterPackDecl, IRListTypeDecl, IRMemberFieldDecl, IROptionTypeDecl, IRPostConditionDecl, IRPreConditionDecl, IRPredicateDecl, IRPrimitiveEntityTypeDecl, IRSomeTypeDecl, IRTestDecl, IRTypedeclCStringDecl, IRTypedeclStringDecl, IRTypedeclTypeDecl, IRValidateDecl } from "../irdefs/irassembly.js";
import { getBSQIRForm, getCPPForm, getSMTForm } from "@bosque/jsbrex";
import assert from "node:assert";
class ASMToIRConverter {
    constructor(assembly, generateTestInfo, testfilefilter, testfilters) {
        this.formatcstrings = [];
        this.formatstrings = [];
        this.isTaskAllowed = false;
        this.assembly = assembly;
        this.generateTestInfo = generateTestInfo;
        this.testfilefilter = testfilefilter;
        this.testfilters = testfilters;
        this.cregexs = new Map();
        this.uregexs = new Map();
        this.elists = [];
        this.dashtypes = [];
        this.formats = [];
        this.lpacks = [];
        this.errInfos = [];
        this.errCtr = 0;
        this.pendingblocks = [];
        this.rescopeStack = [];
        this.tmpVarCtr = 0;
    }
    initCodeTypeProcessingContext(file, isTaskAllowed, typeinst) {
        this.currentFile = file;
        this.isTaskAllowed = isTaskAllowed;
        this.currentReturnType = undefined;
        this.currentImplicitReturnVar = undefined;
        this.currentTypeInstantiation = typeinst;
        this.currentInvokeInstantation = undefined;
        this.currentLambdaInstantiation = undefined;
        this.currentBinds = typeinst.binds;
        this.currentLambdaConsMap = typeinst.lambdacons;
        this.currentMonoInvIdMap = typeinst.monoinvids;
        this.pendingblocks = [];
        this.rescopeStack = [];
        this.tmpVarCtr = 0;
    }
    initCodeInvokeProcessingContext(file, isTaskAllowed, rtype, implicitreturn, invokeinst) {
        this.currentFile = file;
        this.isTaskAllowed = isTaskAllowed;
        this.currentReturnType = rtype;
        this.currentImplicitReturnVar = implicitreturn !== undefined ? implicitreturn.name : undefined;
        this.currentTypeInstantiation = undefined;
        this.currentInvokeInstantation = invokeinst;
        this.currentLambdaInstantiation = undefined;
        this.currentBinds = invokeinst.binds;
        this.currentLambdaConsMap = invokeinst.lambdacons;
        this.currentMonoInvIdMap = invokeinst.monoinvids;
        this.pendingblocks = [];
        this.rescopeStack = [];
        this.tmpVarCtr = 0;
    }
    initCodeLambdaProcessingContext(file, rtype, implicitreturn, lambdainst) {
        this.currentFile = file;
        this.isTaskAllowed = false;
        this.currentReturnType = rtype;
        this.currentImplicitReturnVar = implicitreturn !== undefined ? implicitreturn.name : undefined;
        this.currentTypeInstantiation = undefined;
        this.currentInvokeInstantation = undefined;
        this.currentLambdaInstantiation = lambdainst;
        this.currentBinds = lambdainst.binds;
        this.currentLambdaConsMap = lambdainst.lambdacons;
        this.currentMonoInvIdMap = lambdainst.monoinvids;
        this.pendingblocks = [];
        this.rescopeStack = [];
        this.tmpVarCtr = 0;
    }
    extendProcessingContextForExpEval(rtype) {
        this.currentReturnType = rtype;
    }
    convertSourceInfo(sinfo) {
        return new IRSourceInfo(sinfo.line, sinfo.column);
    }
    registerError(file, sinfo, kind) {
        this.errInfos.push({ file: file, sinfo: sinfo, kind: kind, checkID: this.errCtr });
        return this.errCtr++;
    }
    generateLocalTemplateMapping(tnames, terms) {
        assert(terms.length === tnames.length);
        if (terms.length === 0) {
            return undefined;
        }
        let tmap = new Map();
        tnames.forEach((t, ii) => {
            tmap.set(t, terms[ii]);
        });
        return TemplateNameMapper.createInitialMapping(tmap);
    }
    applyLocalTemplateMapping(tsig, mapper) {
        return mapper !== undefined ? tsig.remapTemplateBindings(mapper) : tsig;
    }
    generateTempVarName() {
        const vname = `tmp_${this.tmpVarCtr}`;
        this.tmpVarCtr += 1;
        return vname;
    }
    processLocalVariableName(vname) {
        for (let i = this.rescopeStack.length - 1; i >= 0; --i) {
            const rescopeMap = this.rescopeStack[i];
            if (rescopeMap.has(vname)) {
                return rescopeMap.get(vname);
            }
        }
        return vname;
    }
    pushStatementBlock() {
        this.pendingblocks.push([]);
    }
    popStatementBlock() {
        const bb = this.pendingblocks.pop();
        const abortidx = bb.findIndex((stmt) => stmt instanceof IRAbortStatement);
        if (abortidx === -1 || abortidx < bb.length - 1) {
            return bb;
        }
        else {
            return bb.slice(0, abortidx + 1);
        }
    }
    pushStatement(stmt) {
        return this.pendingblocks[this.pendingblocks.length - 1].push(stmt);
    }
    pushStatements(stmts) {
        return this.pendingblocks[this.pendingblocks.length - 1].push(...stmts);
    }
    static extractLiteralDateInfo(datestr) {
        const y = parseInt(datestr.slice(0, 4), 10);
        const m = parseInt(datestr.slice(5, 7), 10);
        const d = parseInt(datestr.slice(8, 10), 10);
        return new IRDateRepresentation(y, m, d);
    }
    static extractLiteralTimeInfo(timestr) {
        const h = parseInt(timestr.slice(0, 2), 10);
        const m = parseInt(timestr.slice(3, 5), 10);
        const s = parseInt(timestr.slice(6, 8), 10);
        return new IRTimeRepresentation(h, m, s);
    }
    static extractLiteralDeltaDateInfo(datestr) {
        const pa = datestr.split("-");
        const y = parseInt(pa[0], 10);
        const m = parseInt(pa[1], 10);
        const d = parseInt(pa[2], 10);
        return new IRDeltaDateRepresentation(y, m, d);
    }
    static extractLiteralDeltaTimeInfo(datestr) {
        const pa = datestr.split(":");
        const h = parseInt(pa[0], 10);
        const m = parseInt(pa[1], 10);
        const s = parseInt(pa[2], 10);
        return new IRDeltaTimeRepresentation(h, m, s);
    }
    processCRegex(inns, regexstr) {
        const fullre = getBSQIRForm(regexstr, inns.emit());
        if (this.cregexs.has(fullre)) {
            return this.cregexs.get(fullre);
        }
        else {
            const smtre = getSMTForm(regexstr, inns.emit());
            const cppre = getCPPForm(regexstr, inns.emit());
            const rectr = this.cregexs.size;
            const inst = new IRCRegex(rectr, fullre, smtre, cppre);
            this.cregexs.set(fullre, inst);
            return inst;
        }
    }
    processURegex(inns, regexstr) {
        const fullre = getBSQIRForm(regexstr, inns.emit());
        if (this.uregexs.has(fullre)) {
            return this.uregexs.get(fullre);
        }
        else {
            const smtre = getSMTForm(regexstr, inns.emit());
            const cppre = getCPPForm(regexstr, inns.emit());
            const rectr = this.uregexs.size;
            const inst = new IRURegex(rectr, fullre, smtre, cppre);
            this.uregexs.set(fullre, inst);
            return inst;
        }
    }
    processStringBytes(sval) {
        const bbuff = Buffer.from(sval, "utf8");
        let bytes = [];
        for (let i = 0; i < bbuff.length; ++i) {
            bytes.push(bbuff[i]);
        }
        return bytes;
    }
    tproc(ttype) {
        return this.currentBinds !== undefined ? ttype.remapTemplateBindings(this.currentBinds) : ttype;
    }
    processTypeSignature(tsig) {
        let rtsig = this.tproc(tsig);
        if (rtsig instanceof VoidTypeSignature) {
            return new IRVoidTypeSignature();
        }
        else if (rtsig instanceof NominalTypeSignature) {
            return new IRNominalTypeSignature(rtsig.tkeystr);
        }
        else if (rtsig instanceof EListTypeSignature) {
            const elisttsig = rtsig;
            const irents = elisttsig.entries.map((ent) => this.processTypeSignature(ent));
            if (this.elists.find((el) => el.tkeystr === rtsig.tkeystr) === undefined) {
                this.elists.push(new IREListTypeSignature(rtsig.tkeystr, irents));
            }
            return new IREListTypeSignature(rtsig.tkeystr, irents);
        }
        else if (rtsig instanceof DashResultTypeSignature) {
            const drtsig = rtsig;
            const irents = drtsig.entries.map((ent) => this.processTypeSignature(ent));
            if (this.dashtypes.find((el) => el.tkeystr === rtsig.tkeystr) === undefined) {
                this.dashtypes.push(new IRDashResultTypeSignature(rtsig.tkeystr, irents));
            }
            return new IRDashResultTypeSignature(rtsig.tkeystr, irents);
        }
        else if (rtsig instanceof FormatStringTypeSignature) {
            const ffmtsig = rtsig;
            const irfmts = ffmtsig.terms.map((term) => {
                return { argname: term.argname, argtype: this.processTypeSignature(term.argtype) };
            });
            let fsig;
            if (ffmtsig.oftype === "CString") {
                fsig = new IRFormatCStringTypeSignature(rtsig.tkeystr, this.processTypeSignature(ffmtsig.rtype), irfmts);
            }
            else {
                fsig = new IRFormatStringTypeSignature(rtsig.tkeystr, this.processTypeSignature(ffmtsig.rtype), irfmts);
            }
            if (this.formats.find((el) => el.tkeystr === rtsig.tkeystr) === undefined) {
                this.formats.push(fsig);
            }
            return fsig;
        }
        else if (rtsig instanceof FormatPathTypeSignature) {
            const fpathtsig = rtsig;
            const irfmts = fpathtsig.terms.map((term) => {
                return { argname: term.argname, argtype: this.processTypeSignature(term.argtype) };
            });
            let fsig;
            if (fpathtsig.oftype === "Path") {
                fsig = new IRFormatPathTypeSignature(rtsig.tkeystr, this.processTypeSignature(fpathtsig.rtype), irfmts);
            }
            else if (fpathtsig.oftype === "PathFragment") {
                fsig = new IRFormatPathFragmentTypeSignature(rtsig.tkeystr, this.processTypeSignature(fpathtsig.rtype), irfmts);
            }
            else {
                fsig = new IRFormatPathGlobTypeSignature(rtsig.tkeystr, this.processTypeSignature(fpathtsig.rtype), irfmts);
            }
            if (this.formats.find((el) => el.tkeystr === rtsig.tkeystr) === undefined) {
                this.formats.push(fsig);
            }
            return fsig;
        }
        else {
            assert(false, `ASMToIRConverter: Unsupported type signature -- ${rtsig.tkeystr}`);
        }
    }
    //If we flatten an expression but it is nested then we need to simplify it -- this handles that by creating temps!
    makeExpressionSimple(exp, oftype) {
        if (exp instanceof IRSimpleExpression) {
            return exp;
        }
        else {
            const irtype = this.processTypeSignature(oftype);
            const tmpname = this.generateTempVarName();
            if (exp instanceof IRInvokeSimpleExpression) {
                this.pushStatement(new IRTempAssignStdInvokeStatement(tmpname, exp, irtype));
            }
            else if (exp instanceof IRInvokeImplicitsExpression) {
                this.pushStatement(new IRTempAssignRefInvokeStatement(tmpname, irtype, exp.ivar, exp.ivartype, exp.passkind, exp));
            }
            else if (exp instanceof IRConstructExpression) {
                this.pushStatement(new IRTempAssignDirectConstructorStatement(tmpname, irtype, exp));
            }
            else {
                this.pushStatement(new IRTempAssignExpressionStatement(tmpname, exp, irtype));
            }
            return new IRAccessTempVariableExpression(tmpname);
        }
    }
    //If we flatten an expression but it is nested then we need to simplify it -- this handles that by creating temps!
    makeExpressionImmediate(exp, oftype) {
        if (exp instanceof IRImmediateExpression) {
            return exp;
        }
        else {
            const sexp = this.makeExpressionSimple(exp, oftype);
            const irtype = this.processTypeSignature(oftype);
            const tmpname = this.generateTempVarName();
            this.pushStatement(new IRTempAssignExpressionStatement(tmpname, sexp, irtype));
            return new IRAccessTempVariableExpression(tmpname);
        }
    }
    coerceToBoolForTest(exp, oftype) {
        if (oftype.tkeystr === "Bool") {
            return exp;
        }
        else {
            //TODO: check if this is a literal typedecl true/false and optimize
            return new IRAccessTypeDeclValueExpression(this.processTypeSignature(oftype), exp);
        }
    }
    makeCoercionExplicitAsNeeded(exp, fromtype, totype) {
        const ftype = this.tproc(fromtype);
        const ttype = this.tproc(totype);
        if (ftype.tkeystr === ttype.tkeystr) {
            return exp;
        }
        else {
            assert(ftype instanceof NominalTypeSignature, "ASMToIRConverter::makeCoercionExplicitAsNeeded - fromtype not nominal");
            assert(ttype instanceof NominalTypeSignature, "ASMToIRConverter::makeCoercionExplicitAsNeeded - totype not nominal");
            if (ftype.decl instanceof AbstractConceptTypeDecl) {
                return new IRConvertConceptRepresentationExpression(this.processTypeSignature(ftype), this.processTypeSignature(ttype), exp);
            }
            else {
                if (ftype.tkeystr === "None") {
                    return new IRLiteralOptionOfNoneExpression(this.processTypeSignature(ttype));
                }
                else if (ftype.decl instanceof SomeTypeDecl) {
                    return new IRConstructOptionFromSomeExpression(this.processTypeSignature(ttype), this.processTypeSignature(ftype), exp);
                }
                else if (ftype.decl instanceof OkTypeDecl) {
                    return new IRConstructResultFromOkExpression(this.processTypeSignature(ttype), this.processTypeSignature(ftype), exp);
                }
                else if (ftype.decl instanceof FailTypeDecl) {
                    return new IRConstructResultFromFailExpression(this.processTypeSignature(ttype), this.processTypeSignature(ftype), exp);
                }
                else {
                    return new IRBoxEntityToConceptRepresentationExpression(this.processTypeSignature(ttype), this.processTypeSignature(ftype), exp);
                }
            }
        }
    }
    static isLiteralFalseExpression(exp) {
        //TODO: can make this work with literal typedecls too
        return exp instanceof IRLiteralBoolExpression && exp.value === false;
    }
    static isLiteralTrueExpression(exp) {
        //TODO: can make this work with literal typedecls too
        return exp instanceof IRLiteralBoolExpression && exp.value === true;
    }
    getSpecialType(tname) {
        return new IRNominalTypeSignature(tname);
    }
    processITestCond_None(src, sexp, isnot, makeimm) {
        const srctype = src;
        //!none === some
        if (isnot) {
            //if srctype is none or Some<...> then we can constant fold, otherwise we need to generate a test
            if (srctype.decl instanceof AbstractEntityTypeDecl) {
                return [new IRLiteralBoolExpression(srctype.tkeystr !== "None"), undefined];
            }
            else {
                const iexp = makeimm ? this.makeExpressionImmediate(sexp, srctype) : sexp;
                return [new IRIsNotNoneOptionExpression(iexp, this.processTypeSignature(srctype)), makeimm ? iexp : undefined];
            }
        }
        else {
            //if srctype is none then we can constant fold, if it is Some<...> then we can constant fold, otherwise we need to generate a test
            if (srctype.decl instanceof AbstractEntityTypeDecl) {
                return [new IRLiteralBoolExpression(srctype.tkeystr === "None"), undefined];
            }
            else {
                const iexp = makeimm ? this.makeExpressionImmediate(sexp, srctype) : sexp;
                return [new IRIsNoneOptionExpression(iexp, this.processTypeSignature(srctype)), makeimm ? iexp : undefined];
            }
        }
    }
    processITestCond_Some(src, sexp, isnot, makeimm) {
        const srctype = src;
        //!some === none
        if (isnot) {
            //if srctype is none or Some<...> then we can constant fold, otherwise we need to generate a test
            if (srctype.decl instanceof AbstractEntityTypeDecl) {
                return [new IRLiteralBoolExpression(srctype.tkeystr === "None"), undefined];
            }
            else {
                const iexp = makeimm ? this.makeExpressionImmediate(sexp, srctype) : sexp;
                return [new IRIsNoneOptionExpression(iexp, this.processTypeSignature(srctype)), makeimm ? iexp : undefined];
            }
        }
        else {
            //if srctype is none then we can constant fold, if it is Some<...> then we can constant fold, otherwise we need to generate a test
            if (srctype.decl instanceof AbstractEntityTypeDecl) {
                return [new IRLiteralBoolExpression(srctype.tkeystr !== "None"), undefined];
            }
            else {
                const iexp = makeimm ? this.makeExpressionImmediate(sexp, srctype) : sexp;
                return [new IRIsNotNoneOptionExpression(iexp, this.processTypeSignature(srctype)), makeimm ? iexp : undefined];
            }
        }
    }
    processITestCond_Ok(src, sexp, isnot, makeimm) {
        //!ok === fail
        /*
        if(isnot) {
            const rinfo = this.relations.splitOnErr(src, this.constraints);
            if(rinfo === undefined) {
                this.reportError(src.sinfo, `Unable to err-split type ${src.emit()}`);
                return { bindtrue: undefined, bindfalse: undefined };
            }
            else {
                return { bindtrue: rinfo.overlapErrE, bindfalse: rinfo.remainOkT };
            }
        }
        else {
            const rinfo = this.relations.splitOnOk(src, this.constraints);
            if(rinfo === undefined) {
                this.reportError(src.sinfo, `Unable to nothing-split type ${src.emit()}`);
                return { bindtrue: undefined, bindfalse: undefined };
            }
            else {
                return { bindtrue: rinfo.overlapOkT, bindfalse: rinfo.remainErrE };
            }
        }
        */
        assert(false, "Not implemented yet -- flatten ok/fail");
    }
    processITestCond_Fail(src, sexp, isnot, makeimm) {
        //!fail === ok
        /*
        if(isnot) {
            const rinfo = this.relations.splitOnOk(src, this.constraints);
            if(rinfo === undefined) {
                this.reportError(src.sinfo, `Unable to err-split type ${src.emit()}`);
                return { bindtrue: undefined, bindfalse: undefined };
            }
            else {
                return { bindtrue: rinfo.overlapOkT, bindfalse: rinfo.remainErrE };
            }
        }
        else {
            const rinfo = this.relations.splitOnErr(src, this.constraints);
            if(rinfo === undefined) {
                this.reportError(src.sinfo, `Unable to nothing-split type ${src.emit()}`);
                return { bindtrue: undefined, bindfalse: undefined };
            }
            else {
                return { bindtrue: rinfo.overlapErrE, bindfalse: rinfo.remainOkT };
            }
        }
        */
        assert(false, "Not implemented yet -- flatten ok/fail");
    }
    processITestCond_Type(src, sexp, oftype, isnot, makeimm) {
        if (oftype.tkeystr === "None") {
            return this.processITestCond_None(src, sexp, isnot, makeimm);
        }
        else if ((oftype instanceof NominalTypeSignature) && (oftype.decl instanceof SomeTypeDecl)) {
            return this.processITestCond_Some(src, sexp, isnot, makeimm);
        }
        else if ((oftype instanceof NominalTypeSignature) && (oftype.decl instanceof OkTypeDecl)) {
            return this.processITestCond_Ok(src, sexp, isnot, makeimm);
        }
        else if ((oftype instanceof NominalTypeSignature) && (oftype.decl instanceof FailTypeDecl)) {
            return this.processITestCond_Fail(src, sexp, isnot, makeimm);
        }
        else if ((src instanceof NominalTypeSignature) && (src.tkeystr === "None" || (src.decl instanceof SomeTypeDecl)) && (oftype instanceof NominalTypeSignature) && (oftype.decl instanceof OptionTypeDecl)) {
            const isoptsubtype = src.tkeystr === "None" || ((src instanceof NominalTypeSignature) && (src.decl instanceof SomeTypeDecl)) || src.tkeystr === oftype.tkeystr;
            if (isnot) {
                return [new IRLiteralBoolExpression(!isoptsubtype), undefined];
            }
            else {
                return [new IRLiteralBoolExpression(isoptsubtype), undefined];
            }
        }
        else if ((oftype instanceof NominalTypeSignature) && (oftype.decl instanceof ResultTypeDecl)) {
            assert(false, "Not implemented yet -- flatten option/result");
        }
        else if ((oftype instanceof NominalTypeSignature) && (oftype.decl instanceof APIErrorTypeDecl)) {
            assert(false, "Not implemented yet -- flatten api error");
        }
        else if ((oftype instanceof NominalTypeSignature) && (oftype.decl instanceof APIRejectedTypeDecl)) {
            assert(false, "Not implemented yet -- flatten api rejected");
        }
        else if ((oftype instanceof NominalTypeSignature) && (oftype.decl instanceof APIDeniedTypeDecl)) {
            assert(false, "Not implemented yet -- flatten api denied");
        }
        else if ((oftype instanceof NominalTypeSignature) && (oftype.decl instanceof APIFlaggedTypeDecl)) {
            assert(false, "Not implemented yet -- flatten api flagged");
        }
        else if ((oftype instanceof NominalTypeSignature) && (oftype.decl instanceof APISuccessTypeDecl)) {
            assert(false, "Not implemented yet -- flatten api success");
        }
        else if ((oftype instanceof NominalTypeSignature) && (oftype.decl instanceof APIResultTypeDecl)) {
            assert(false, "Not implemented yet -- flatten api result");
        }
        else {
            if (!(oftype instanceof NominalTypeSignature)) {
                //then this is is the special typesig types case and just depends on the names
                const aresame = (this.tproc(src).tkeystr === this.tproc(oftype).tkeystr);
                return [new IRLiteralBoolExpression(isnot ? !aresame : aresame), undefined];
            }
            else if (!(src instanceof NominalTypeSignature)) {
                //then this is is the special typesig types case -- special typesigs can never be of concept types!
                return [new IRLiteralBoolExpression(isnot), undefined];
            }
            else {
                if (oftype.decl instanceof AbstractEntityTypeDecl) {
                    //oftype is conrete entity
                    if (src.decl instanceof AbstractEntityTypeDecl) {
                        //then just depends on the names at compile time
                        const aresame = (this.tproc(src).tkeystr === this.tproc(oftype).tkeystr);
                        return [new IRLiteralBoolExpression(isnot ? !aresame : aresame), undefined];
                    }
                    else {
                        //Handle concrete oftype and abstract arg
                        const iexp = makeimm ? this.makeExpressionImmediate(sexp, src) : sexp;
                        if (isnot) {
                            // Handle negation of type test for non-abstract concept types
                            return [new IRIsNotConceptRepresentationOfTypeExpression(iexp, this.processTypeSignature(src), this.processTypeSignature(oftype)), makeimm ? iexp : undefined];
                        }
                        else {
                            // Handle type test for non-abstract concept types
                            return [new IRIsConceptRepresentationOfTypeExpression(iexp, this.processTypeSignature(src), this.processTypeSignature(oftype)), makeimm ? iexp : undefined];
                        }
                    }
                }
                else {
                    //oftype is concept
                    if (src.decl instanceof AbstractEntityTypeDecl) {
                        //emit subtype test but it is static since we know the concrete type at compile time
                        return [new IRStaticIsTypeSubtypeOfExpression(this.processTypeSignature(src), this.processTypeSignature(oftype), isnot), undefined];
                    }
                    else {
                        //handle abstract oftype and abstract arg
                        const iexp = makeimm ? this.makeExpressionImmediate(sexp, src) : sexp;
                        if (isnot) {
                            // Handle negation of type test for abstract concept types
                            return [new IRIsNotConceptRepresentationSubtypeOfTypeExpression(iexp, this.processTypeSignature(src), this.processTypeSignature(oftype)), makeimm ? iexp : undefined];
                        }
                        else {
                            // Handle type test for abstract concept types
                            return [new IRIsConceptRepresentationSubtypeOfTypeExpression(iexp, this.processTypeSignature(src), this.processTypeSignature(oftype)), makeimm ? iexp : undefined];
                        }
                    }
                }
            }
        }
    }
    processITestAsBoolean(src, sexp, tt) {
        let ops;
        if (tt instanceof ITestType) {
            ops = this.processITestCond_Type(src, sexp, this.tproc(tt.ttype), tt.isnot, false);
        }
        else {
            if (tt instanceof ITestNone) {
                ops = this.processITestCond_None(src, sexp, tt.isnot, false);
            }
            else if (tt instanceof ITestSome) {
                ops = this.processITestCond_Some(src, sexp, tt.isnot, false);
            }
            else if (tt instanceof ITestOk) {
                ops = this.processITestCond_Ok(src, sexp, tt.isnot, false);
            }
            else {
                assert(tt instanceof ITestFail, "missing case in ITest");
                ops = this.processITestCond_Fail(src, sexp, tt.isnot, false);
            }
        }
        return ops[0];
    }
    processITestConvert_SafeNone(src, sexp, isunwrap) {
        //if srctype is none then just return none (in any case)
        return new IRLiteralNoneExpression();
    }
    processITestConvert_SafeSome(src, sexp, isunwrap) {
        const srctype = src;
        if (srctype.decl instanceof AbstractEntityTypeDecl) {
            if (!isunwrap) {
                //src must be Some and we are not unwrapping so just return it
                return sexp;
            }
            else {
                //need to get value ot of some
                const sometype = this.processTypeSignature(srctype);
                const oftype = this.processTypeSignature(srctype.alltermargs[0]);
                return new IRAccessFieldSpecialExpression(sometype, sexp, sometype, "value", oftype);
            }
        }
        else {
            const opttype = this.processTypeSignature(srctype);
            const oftype = this.processTypeSignature(srctype.alltermargs[0]);
            const sometype = new IRNominalTypeSignature(`Some<${oftype.tkeystr}>`);
            return isunwrap ? new IRExtractSomeValueFromOptionExpression(opttype, sometype, oftype, sexp) : new IRExtractSomeFromOptionExpression(opttype, sometype, sexp);
        }
    }
    processITestConvert_SafeOk(src, sexp, isunwrap) {
        assert(false, "Not implemented yet -- flatten ok/fail");
    }
    processITestConvert_SafeFail(src, sexp, isunwrap) {
        assert(false, "Not implemented yet -- flatten ok/fail");
    }
    processITestConvert_SafeType(src, sexp, trgttype) {
        if (trgttype.tkeystr === "None") {
            return this.processITestConvert_SafeNone(src, sexp, false);
        }
        else if ((trgttype instanceof NominalTypeSignature) && (trgttype.decl instanceof SomeTypeDecl)) {
            return this.processITestConvert_SafeSome(src, sexp, false);
        }
        else if ((trgttype instanceof NominalTypeSignature) && (trgttype.decl instanceof OkTypeDecl)) {
            return this.processITestConvert_SafeOk(src, sexp, false);
        }
        else if ((trgttype instanceof NominalTypeSignature) && (trgttype.decl instanceof FailTypeDecl)) {
            return this.processITestConvert_SafeFail(src, sexp, false);
        }
        else if ((trgttype instanceof NominalTypeSignature) && (trgttype.decl instanceof OptionTypeDecl)) {
            if (src.tkeystr === "None") {
                return new IRLiteralOptionOfNoneExpression(this.processTypeSignature(trgttype));
            }
            else if ((src instanceof NominalTypeSignature) && (src.decl instanceof SomeTypeDecl)) {
                return new IRConstructOptionFromSomeExpression(this.processTypeSignature(trgttype), this.processTypeSignature(src), sexp);
            }
            else {
                return sexp; //both option<T>
            }
        }
        else if ((trgttype instanceof NominalTypeSignature) && (trgttype.decl instanceof ResultTypeDecl)) {
            assert(false, "Not implemented yet -- flatten option/result");
        }
        else if ((trgttype instanceof NominalTypeSignature) && (trgttype.decl instanceof APIErrorTypeDecl)) {
            assert(false, "Not implemented yet -- flatten api error");
        }
        else if ((trgttype instanceof NominalTypeSignature) && (trgttype.decl instanceof APIRejectedTypeDecl)) {
            assert(false, "Not implemented yet -- flatten api rejected");
        }
        else if ((trgttype instanceof NominalTypeSignature) && (trgttype.decl instanceof APIDeniedTypeDecl)) {
            assert(false, "Not implemented yet -- flatten api denied");
        }
        else if ((trgttype instanceof NominalTypeSignature) && (trgttype.decl instanceof APIFlaggedTypeDecl)) {
            assert(false, "Not implemented yet -- flatten api flagged");
        }
        else if ((trgttype instanceof NominalTypeSignature) && (trgttype.decl instanceof APISuccessTypeDecl)) {
            assert(false, "Not implemented yet -- flatten api success");
        }
        else if ((trgttype instanceof NominalTypeSignature) && (trgttype.decl instanceof APIResultTypeDecl)) {
            assert(false, "Not implemented yet -- flatten api result");
        }
        else {
            if (!(trgttype instanceof NominalTypeSignature)) {
                assert(this.tproc(src).tkeystr === this.tproc(trgttype).tkeystr, "these can never be subtypes so only option is if types are same so just return -- something went wrong");
                return sexp;
            }
            else {
                if (trgttype.decl instanceof AbstractEntityTypeDecl) {
                    if (this.tproc(src).tkeystr === this.tproc(trgttype).tkeystr) {
                        return sexp;
                    }
                    else {
                        assert((src instanceof NominalTypeSignature) && (src.decl instanceof AbstractConceptTypeDecl), "otherwise the test would always be false (and this fails)");
                        return new IRUnboxEntityFromConceptRepresentationExpression(this.processTypeSignature(src), this.processTypeSignature(trgttype), sexp);
                    }
                }
                else {
                    //trgttype is concept
                    if (src.decl instanceof AbstractEntityTypeDecl) {
                        return new IRBoxEntityToConceptRepresentationExpression(this.processTypeSignature(trgttype), this.processTypeSignature(src), sexp);
                    }
                    else {
                        //both concepts so see which way to convert
                        if (this.tproc(src).tkeystr === this.tproc(trgttype).tkeystr) {
                            return sexp;
                        }
                        else {
                            return new IRConvertConceptRepresentationExpression(this.processTypeSignature(src), this.processTypeSignature(trgttype), sexp);
                        }
                    }
                }
            }
        }
    }
    processITestAsConvertFlow(src, sexp, tt, followpathtypett, followpathtypeff) {
        if (tt instanceof ITestType) {
            return [
                followpathtypett !== undefined ? this.processITestConvert_SafeType(src, sexp, followpathtypett) : undefined,
                followpathtypeff !== undefined ? this.processITestConvert_SafeType(src, sexp, followpathtypeff) : undefined
            ];
        }
        else {
            if (tt instanceof ITestNone) {
                if (tt.isnot) {
                    return [
                        followpathtypett !== undefined ? this.processITestConvert_SafeSome(src, sexp, true) : undefined,
                        followpathtypeff !== undefined ? this.processITestConvert_SafeNone(src, sexp, true) : undefined
                    ];
                }
                else {
                    return [
                        followpathtypett !== undefined ? this.processITestConvert_SafeNone(src, sexp, true) : undefined,
                        followpathtypeff !== undefined ? this.processITestConvert_SafeSome(src, sexp, true) : undefined
                    ];
                }
            }
            else if (tt instanceof ITestSome) {
                if (tt.isnot) {
                    return [
                        followpathtypett !== undefined ? this.processITestConvert_SafeNone(src, sexp, true) : undefined,
                        followpathtypeff !== undefined ? this.processITestConvert_SafeSome(src, sexp, true) : undefined
                    ];
                }
                else {
                    return [
                        followpathtypett !== undefined ? this.processITestConvert_SafeSome(src, sexp, true) : undefined,
                        followpathtypeff !== undefined ? this.processITestConvert_SafeNone(src, sexp, true) : undefined
                    ];
                }
            }
            else if (tt instanceof ITestOk) {
                if (tt.isnot) {
                    return [
                        followpathtypett !== undefined ? this.processITestConvert_SafeFail(src, sexp, true) : undefined,
                        followpathtypeff !== undefined ? this.processITestConvert_SafeOk(src, sexp, true) : undefined
                    ];
                }
                else {
                    return [
                        followpathtypett !== undefined ? this.processITestConvert_SafeOk(src, sexp, true) : undefined,
                        followpathtypeff !== undefined ? this.processITestConvert_SafeFail(src, sexp, true) : undefined
                    ];
                }
            }
            else {
                assert(tt instanceof ITestFail, "missing case in ITest");
                if (tt.isnot) {
                    return [
                        followpathtypett !== undefined ? this.processITestConvert_SafeOk(src, sexp, true) : undefined,
                        followpathtypeff !== undefined ? this.processITestConvert_SafeFail(src, sexp, true) : undefined
                    ];
                }
                else {
                    return [
                        followpathtypett !== undefined ? this.processITestConvert_SafeFail(src, sexp, true) : undefined,
                        followpathtypeff !== undefined ? this.processITestConvert_SafeOk(src, sexp, true) : undefined
                    ];
                }
            }
        }
    }
    flattenITestGuardExpression(exp) {
        switch (exp.tag) {
            case ExpressionTag.CallRefVariableExpression: {
                const crexp = exp;
                return this.coerceToBoolForTest(this.makeExpressionSimple(this.flattenCallRefVariableExpression(crexp), this.tproc(crexp.getType())), this.tproc(crexp.getType()));
            }
            case ExpressionTag.CallRefThisExpression: {
                const crexp = exp;
                return this.coerceToBoolForTest(this.makeExpressionSimple(this.flattenCallRefThisExpression(crexp), this.tproc(crexp.getType())), this.tproc(crexp.getType()));
            }
            case ExpressionTag.CallRefSelfExpression: {
                const crexp = exp;
                return this.coerceToBoolForTest(this.makeExpressionSimple(this.flattenCallRefSelfExpression(crexp), this.tproc(crexp.getType())), this.tproc(crexp.getType()));
            }
            case ExpressionTag.CallTaskActionExpression: {
                const crexp = exp;
                return this.coerceToBoolForTest(this.makeExpressionSimple(this.flattenCallTaskActionExpression(crexp), this.tproc(crexp.getType())), this.tproc(crexp.getType()));
            }
            default: {
                const ttag = exp.tag;
                if (ttag === ExpressionTag.CallNamespaceFunctionExpression) {
                    const crexp = exp;
                    return this.coerceToBoolForTest(this.makeExpressionSimple(this.flattenCallNamespaceFunctionExpression(crexp), this.tproc(crexp.getType())), this.tproc(crexp.getType()));
                }
                else if (ttag === ExpressionTag.CallTypeFunctionExpression) {
                    const crexp = exp;
                    return this.coerceToBoolForTest(this.makeExpressionSimple(this.flattenCallTypeFunctionExpression(crexp), this.tproc(crexp.getType())), this.tproc(crexp.getType()));
                }
                else if (ttag === ExpressionTag.LambdaInvokeExpression) {
                    const crexp = exp;
                    return this.coerceToBoolForTest(this.makeExpressionSimple(this.flattenLambdaInvokeExpression(crexp), this.tproc(crexp.getType())), this.tproc(crexp.getType()));
                }
                else if (ttag === ExpressionTag.PostfixOpExpression) {
                    const crexp = exp;
                    return this.coerceToBoolForTest(this.makeExpressionSimple(this.flattenPostfixOp(crexp), this.tproc(crexp.getType())), this.tproc(crexp.getType()));
                }
                else if (ttag === ExpressionTag.PrefixNotOpExpression) {
                    const nexp = exp;
                    const nval = this.coerceToBoolForTest(this.flattenITestGuardExpression(nexp.exp), this.tproc(nexp.exp.getType()));
                    if (ASMToIRConverter.isLiteralTrueExpression(nval)) {
                        return new IRLiteralBoolExpression(false);
                    }
                    else if (ASMToIRConverter.isLiteralFalseExpression(nval)) {
                        return new IRLiteralBoolExpression(true);
                    }
                    else {
                        return new IRPrefixNotOpExpression(nval, this.getSpecialType("Bool"));
                    }
                }
                else if (ttag === ExpressionTag.LogicAndExpression) {
                    const aexps = exp.exps.map((e) => this.coerceToBoolForTest(this.flattenITestGuardExpression(e), this.tproc(e.getType())));
                    const mustfalse = aexps.some((aexp) => ASMToIRConverter.isLiteralFalseExpression(aexp));
                    if (mustfalse) {
                        return new IRLiteralBoolExpression(false);
                    }
                    else {
                        const filteredexps = aexps.filter((aexp) => !ASMToIRConverter.isLiteralTrueExpression(aexp));
                        if (filteredexps.length === 0) {
                            return new IRLiteralBoolExpression(true);
                        }
                        else if (filteredexps.length === 1) {
                            return filteredexps[0];
                        }
                        else {
                            return new IRLogicAndExpression(filteredexps);
                        }
                    }
                }
                else {
                    return this.coerceToBoolForTest(this.makeExpressionSimple(this.flattenExpression(exp), this.tproc(exp.getType())), this.tproc(exp.getType()));
                }
            }
        }
    }
    flattenITestGuard(sinfo, tt, gidx) {
        if (tt instanceof ITestSimpleGuard) {
            return [this.flattenITestGuardExpression(tt.exp), undefined];
        }
        else if (tt instanceof ITestTypeGuard) {
            const texp = this.flattenExpression(tt.exp);
            const sexp = this.makeExpressionSimple(texp, tt.exp.getType());
            return [this.processITestAsBoolean(tt.exp.getType(), sexp, tt.itest), { ee: sexp, srctype: tt.exp.getType(), itest: tt.itest }];
        }
        else if (tt instanceof ITestBinderGuard) {
            const texp = this.flattenExpression(tt.exp);
            const iexp = this.makeExpressionImmediate(texp, tt.exp.getType());
            return [this.processITestAsBoolean(tt.exp.getType(), iexp, tt.itest), { ee: iexp, srctype: tt.exp.getType(), itest: tt.itest }];
        }
        else {
            assert(false, "Unknown ITestGuard type"); //TODO check and do binders here!!!
        }
    }
    flattenITestGuardSet(sinfo, tt) {
        const grenvs = tt.guards.map((guard, ii) => this.flattenITestGuard(sinfo, guard, ii));
        const iebinds = grenvs.map((ginfo) => ginfo[1]).filter((gbi) => gbi !== undefined);
        const mustfalse = grenvs.some((aexp) => ASMToIRConverter.isLiteralFalseExpression(aexp[0]));
        if (mustfalse) {
            return [new IRLiteralBoolExpression(false), iebinds];
        }
        else {
            const filteredexps = grenvs.filter((aexp) => !ASMToIRConverter.isLiteralTrueExpression(aexp[0]));
            if (filteredexps.length === 0) {
                return [new IRLiteralBoolExpression(true), iebinds];
            }
            else if (filteredexps.length === 1) {
                return [filteredexps[0][0], iebinds];
            }
            else {
                return [new IRLogicAndExpression(filteredexps.map((fe) => fe[0])), iebinds];
            }
        }
    }
    flattenInvokeArgs(haspreconds, haspostconds, shuffleinfo, params, args, resttype, restinfo, imapper) {
        const aargs = [];
        for (let i = 0; i < shuffleinfo.length; ++i) {
            const ii = shuffleinfo[i];
            const pinfo = params[i];
            const ftype = this.applyLocalTemplateMapping(pinfo.type, imapper);
            if (ii[0] === -1) {
                const crexp = this.assembly.tryReduceConstantExpression(pinfo.optDefaultValue, this.currentBinds);
                if (crexp !== undefined) {
                    const sexp = this.flattenExpression(crexp);
                    const cexp = this.makeCoercionExplicitAsNeeded(this.makeExpressionSimple(sexp, crexp.getType()), crexp.getType(), ftype);
                    const fexp = (haspreconds || haspostconds) ? this.makeExpressionImmediate(cexp, ftype) : cexp;
                    aargs.push(fexp);
                }
                else {
                    assert(false, "ASMToIRConverter::flattenCallExpression - Invoke computation for default argument not implemented");
                }
            }
            else {
                const eexp = args.args[ii[0]];
                const sexp = this.flattenExpression(eexp.exp);
                const cexp = this.makeCoercionExplicitAsNeeded(this.makeExpressionSimple(sexp, eexp.exp.getType()), eexp.exp.getType(), ftype);
                const fexp = (haspreconds || haspostconds) ? this.makeExpressionImmediate(cexp, ftype) : cexp;
                aargs.push(fexp);
            }
        }
        //do rest parameter as needed
        if (resttype !== undefined) {
            const rrtype = this.applyLocalTemplateMapping(resttype, imapper);
            const rrinfo = restinfo;
            let clexp;
            if (rrinfo.length === 0) {
                if (rrtype.decl instanceof ListTypeDecl) {
                    clexp = new IRConstructorListEmptyExpression(this.processTypeSignature(rrtype));
                }
                else {
                    assert(false, "ASMToIRConverter::flattenCallExpression - Invoke computation for rest arguments with empty non-list type not implemented");
                }
            }
            else if (rrinfo.every((rri) => !rri[1])) {
                const clist = rrinfo.map((rri) => {
                    const eexp = args.args[rri[0]];
                    const sexp = this.flattenExpression(eexp.exp);
                    return this.makeCoercionExplicitAsNeeded(this.makeExpressionSimple(sexp, eexp.exp.getType()), eexp.exp.getType(), rrinfo[0][2]);
                });
                if (rrtype.decl instanceof ListTypeDecl) {
                    clexp = new IRConstructorListSingletonsExpression(this.processTypeSignature(rrtype), clist);
                }
                else {
                    assert(false, "ASMToIRConverter::flattenCallExpression - Invoke computation for rest arguments with non-list type not implemented");
                }
            }
            else {
                assert(false, "ASMToIRConverter::flattenCallExpression - Invoke computation for rest arguments with spread not implemented");
            }
            const tvname = this.generateTempVarName();
            this.pushStatement(new IRTempAssignDirectConstructorStatement(tvname, this.processTypeSignature(rrtype), clexp));
            aargs.push(new IRAccessTempVariableExpression(tvname));
        }
        return aargs;
    }
    flattenCallNamespaceFunctionExpression(exp) {
        const fdecl = exp.resolvedFunction;
        const haspreconds = fdecl.preconditions.length > 0;
        const haspostconds = fdecl.postconditions.length > 0;
        const iname = this.currentMonoInvIdMap.get(exp.monoinvid);
        const imapper = this.generateLocalTemplateMapping(fdecl.terms.map((t) => t.name), exp.terms);
        const aargs = this.flattenInvokeArgs(haspreconds, haspostconds, exp.shuffleinfo, fdecl.params, exp.args, exp.resttype, exp.restinfo, imapper);
        //do preconditions as needed
        for (let i = 0; i < fdecl.preconditions.length; ++i) {
            const invdecl = fdecl.preconditions[i];
            this.pushStatement(new IRPreconditionCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.diagnosticTag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), iname, invdecl.ii, aargs));
        }
        if (!exp.args.hasSpecialRef()) {
            if (!haspostconds) {
                return new IRInvokeSimpleExpression(iname, aargs);
            }
            else {
                const tmpres = this.generateTempVarName();
                this.pushStatement(new IRTempAssignStdInvokeStatement(tmpres, new IRInvokeSimpleExpression(iname, aargs), this.processTypeSignature(exp.getType())));
                //do postconditions as needed
                const postargs = [new IRAccessTempVariableExpression(tmpres), ...aargs];
                for (let i = 0; i < fdecl.postconditions.length; ++i) {
                    const invdecl = fdecl.postconditions[i];
                    this.pushStatement(new IRPostconditionCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.diagnosticTag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), iname, invdecl.ii, postargs));
                }
                return new IRAccessTempVariableExpression(tmpres);
            }
        }
        else {
            const srpos = exp.shuffleinfo.findIndex((si) => exp.args.args[si[0]] instanceof PassingArgumentValue);
            const ii = exp.shuffleinfo[srpos][0];
            const passarg = exp.args.args[ii];
            const ivar = passarg.exp.srcname;
            const ivartype = this.processTypeSignature(passarg.exp.getType());
            if (!haspostconds) {
                return new IRInvokeSimpleWithImplicitsExpression(iname, aargs, ii, ivar, ivartype, passarg.kind);
            }
            else {
                let tmppass = undefined;
                if (passarg.kind !== "out" && passarg.kind !== "out?") {
                    tmppass = this.generateTempVarName();
                    this.pushStatement(new IRTempAssignExpressionStatement(tmppass, aargs[srpos], ivartype));
                }
                const tmpres = this.generateTempVarName();
                this.pushStatement(new IRTempAssignRefInvokeStatement(tmpres, this.processTypeSignature(exp.getType()), ivar, ivartype, passarg.kind, new IRInvokeSimpleWithImplicitsExpression(iname, aargs, ii, ivar, ivartype, passarg.kind)));
                //do postconditions as needed
                let postargs = [new IRAccessTempVariableExpression(tmpres), ...aargs];
                if (tmppass !== undefined) {
                    postargs = [new IRAccessTempVariableExpression(tmpres), new IRAccessTempVariableExpression(tmppass), ...postargs];
                }
                for (let i = 0; i < fdecl.postconditions.length; ++i) {
                    const invdecl = fdecl.postconditions[i];
                    this.pushStatement(new IRPostconditionCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.diagnosticTag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), iname, invdecl.ii, postargs));
                }
                return new IRAccessTempVariableExpression(tmpres);
            }
        }
    }
    flattenCallTypeFunctionExpression(exp) {
        const fdecl = exp.resolvedFunction;
        const haspreconds = fdecl.preconditions.length > 0;
        const haspostconds = fdecl.postconditions.length > 0;
        const iname = this.currentMonoInvIdMap.get(exp.monoinvid);
        const tmapper = TemplateNameMapper.generateTemplateMappingForTypeDecl(this.tproc(exp.resolvedDeclType));
        const imapper = this.generateLocalTemplateMapping(fdecl.terms.map((t) => t.name), exp.terms);
        const fullmapper = TemplateNameMapper.tryMerge(tmapper, imapper);
        const aargs = this.flattenInvokeArgs(haspreconds, haspostconds, exp.shuffleinfo, fdecl.params, exp.args, exp.resttype, exp.restinfo, fullmapper);
        //do preconditions as needed
        for (let i = 0; i < fdecl.preconditions.length; ++i) {
            const invdecl = fdecl.preconditions[i];
            this.pushStatement(new IRPreconditionCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.diagnosticTag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), iname, invdecl.ii, aargs));
        }
        if (!exp.args.hasSpecialRef()) {
            if (!haspostconds) {
                return new IRInvokeSimpleExpression(iname, aargs);
            }
            else {
                const tmpres = this.generateTempVarName();
                this.pushStatement(new IRTempAssignStdInvokeStatement(tmpres, new IRInvokeSimpleExpression(iname, aargs), this.processTypeSignature(exp.getType())));
                //do postconditions as needed
                const postargs = [new IRAccessTempVariableExpression(tmpres), ...aargs];
                for (let i = 0; i < fdecl.postconditions.length; ++i) {
                    const invdecl = fdecl.postconditions[i];
                    this.pushStatement(new IRPostconditionCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.diagnosticTag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), iname, invdecl.ii, postargs));
                }
                return new IRAccessTempVariableExpression(tmpres);
            }
        }
        else {
            const srpos = exp.shuffleinfo.findIndex((si) => exp.args.args[si[0]] instanceof PassingArgumentValue);
            const ii = exp.shuffleinfo[srpos][0];
            const passarg = exp.args.args[ii];
            const ivar = passarg.exp.srcname;
            const ivartype = this.processTypeSignature(passarg.exp.getType());
            if (!haspostconds) {
                return new IRInvokeSimpleWithImplicitsExpression(iname, aargs, ii, ivar, ivartype, passarg.kind);
            }
            else {
                let tmppass = undefined;
                if (passarg.kind !== "out" && passarg.kind !== "out?") {
                    tmppass = this.generateTempVarName();
                    this.pushStatement(new IRTempAssignExpressionStatement(tmppass, aargs[srpos], ivartype));
                }
                const tmpres = this.generateTempVarName();
                this.pushStatement(new IRTempAssignRefInvokeStatement(tmpres, this.processTypeSignature(exp.getType()), ivar, ivartype, passarg.kind, new IRInvokeSimpleWithImplicitsExpression(iname, aargs, ii, ivar, ivartype, passarg.kind)));
                //do postconditions as needed
                let postargs = [new IRAccessTempVariableExpression(tmpres), ...aargs];
                if (tmppass !== undefined) {
                    postargs = [new IRAccessTempVariableExpression(tmpres), new IRAccessTempVariableExpression(tmppass), ...postargs];
                }
                for (let i = 0; i < fdecl.postconditions.length; ++i) {
                    const invdecl = fdecl.postconditions[i];
                    this.pushStatement(new IRPostconditionCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.diagnosticTag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), iname, invdecl.ii, postargs));
                }
                return new IRAccessTempVariableExpression(tmpres);
            }
        }
    }
    flattenConstructorLambdaExpression(exp) {
        const lptype = new IRLambdaParameterPackTypeSignature(this.currentLambdaConsMap.get(exp.monomorphizedUID));
        this.lpacks.push(lptype);
        const iidecl = this.currentNamespaceInstantiation.lambdas.get(lptype.tkeystr);
        const lcaptures = exp.lcaptures;
        const vexps = iidecl.capturedVars.map((vv) => {
            const ccap = lcaptures.find((lc) => lc.vname === vv[0]);
            if (ccap.ocapture === "outer") {
                return new IRAccessCapturedVariableExpression(vv[0]);
            }
            else if (ccap.ocapture === "param") {
                return new IRAccessParameterVariableExpression(vv[0]);
            }
            else {
                return new IRAccessLocalVariableExpression(vv[0]);
            }
        });
        const lexps = iidecl.capturedLambdas.map((vv) => {
            const ccap = lcaptures.find((lc) => lc.vname === vv.pname);
            if (ccap.ocapture === "outer") {
                return new IRAccessCapturedVariableExpression(vv.pname);
            }
            else if (ccap.ocapture === "param") {
                return new IRAccessParameterVariableExpression(vv.pname);
            }
            else {
                return new IRAccessLocalVariableExpression(vv.pname);
            }
        });
        return new IRConstructorLambdaExpression(lptype, [...vexps, ...lexps]);
    }
    flattenLambdaInvokeExpression(exp) {
        const iname = this.currentMonoInvIdMap.get(exp.monoinvid);
        const aargs = [exp.isCapturedLambda ? new IRAccessCapturedVariableExpression(exp.name) : new IRAccessParameterVariableExpression(exp.name)];
        for (let i = 0; i < exp.args.args.length; ++i) {
            const ftype = this.tproc(exp.lambda.params[i].type);
            const eexp = exp.args.args[i];
            const sexp = this.flattenExpression(eexp.exp);
            const cexp = this.makeCoercionExplicitAsNeeded(this.makeExpressionSimple(sexp, eexp.exp.getType()), eexp.exp.getType(), ftype);
            aargs.push(cexp);
        }
        //do rest parameter as needed
        if (exp.resttype !== undefined) {
            assert(false, "rest parameters not yet implemented in flattenCallNamespaceFunctionExpression");
        }
        if (!exp.args.hasSpecialRef()) {
            return new IRInvokeSimpleExpression(iname, aargs);
        }
        else {
            const srpos = exp.args.args.findIndex((si) => si instanceof PassingArgumentValue);
            const passarg = exp.args.args[srpos];
            const ivar = passarg.exp.srcname;
            const ivartype = this.processTypeSignature(passarg.exp.getType());
            return new IRInvokeSimpleWithImplicitsExpression(iname, aargs, srpos, ivar, ivartype, passarg.kind);
        }
    }
    flattenPostfixAccessFromName(exp, rootexp, roottype) {
        const fdecl = exp.fieldDecl;
        const indecl = this.tproc(exp.declaredInType);
        const irroottype = this.processTypeSignature(roottype);
        const irftype = this.processTypeSignature(exp.fieldType);
        if (fdecl.isSpecialAccess) {
            return new IRAccessFieldSpecialExpression(irroottype, rootexp, irroottype, fdecl.name, irftype);
        }
        else {
            if (exp.isdirect) {
                return new IRAccessFieldDirectExpression(irroottype, rootexp, this.processTypeSignature(indecl), fdecl.name, irftype);
            }
            else {
                return new IRAccessFieldVirtualExpression(irroottype, rootexp, this.processTypeSignature(indecl), fdecl.name, irftype);
            }
        }
    }
    flattenPostfixProjectFromNames(exp, rootexp, roottype) {
        assert(false, "ASMToIRConverter::flattenPostfixProjectFromNames - Not Implemented");
    }
    flattenPostfixAccessFromIndex(exp, rootexp, roottype) {
        const eltype = this.processTypeSignature(roottype);
        return new IRAccessEListIndexExpression(eltype, rootexp, exp.idx);
    }
    flattenPostfixIsTest(exp, rootexp, roottype) {
        return this.processITestAsBoolean(roottype, rootexp, exp.ttest);
    }
    flattenPostfixAsConvert(exp, rootexp, roottype) {
        if (exp.alwaysSucceeds) {
            const sexp = this.makeExpressionSimple(rootexp, roottype);
            const [ttop, _] = this.processITestAsConvertFlow(this.tproc(roottype), sexp, exp.ttest, this.tproc(exp.getType()), undefined);
            return ttop;
        }
        else {
            const iexp = this.makeExpressionImmediate(rootexp, roottype);
            const testop = this.processITestAsBoolean(roottype, iexp, exp.ttest);
            if (testop instanceof IRLiteralBoolExpression) {
                if (testop.value) {
                    const [ttop, _] = this.processITestAsConvertFlow(this.tproc(roottype), iexp, exp.ttest, this.tproc(exp.getType()), undefined);
                    return ttop;
                }
                else {
                    //If we optimize out later we could handle in a pass like the one where we cleanup copy propagation after we know allocation sizes
                    assert(false, "Todo: extra fails operation which we then optimize out later -- or make this a real error case?");
                }
            }
            else {
                const typeassert = new IRErrorTypeAssertionCheckStatement(this.currentFile, this.convertSourceInfo(exp.sinfo), undefined, this.registerError(this.currentFile, this.convertSourceInfo(exp.sinfo), "runtime"), testop);
                this.pushStatement(typeassert);
                const [ttop, _] = this.processITestAsConvertFlow(this.tproc(roottype), iexp, exp.ttest, this.tproc(exp.getType()), undefined);
                return ttop;
            }
        }
    }
    flattenPostfixAssignFields(exp, rootexp, roottype) {
        assert(false, "ASMToIRConverter::flattenPostfixAssignFields - Not Implemented");
    }
    flattenPostfixSliceOperator(exp, rootexp, roottype) {
        assert(false, "ASMToIRConverter::flattenPostfixSliceOperator - Not Implemented");
    }
    flattenPostfixInvoke(exp, rootexp, roottype) {
        const mdecl = exp.resolvedMethodDecl;
        const mimpl = exp.resolvedMethodImpl || exp.resolvedMethodDecl;
        const haspreconds = mdecl.preconditions.length > 0;
        const haspostconds = mdecl.postconditions.length > 0;
        const iname = this.currentMonoInvIdMap.get(exp.monoinvid);
        let rexp;
        if (exp.resolvedImplType !== undefined) {
            const convexp = this.makeCoercionExplicitAsNeeded(rootexp, this.tproc(roottype), this.tproc(exp.resolvedImplType));
            rexp = (haspreconds || haspostconds) ? this.makeExpressionImmediate(convexp, this.tproc(exp.resolvedImplType)) : convexp;
        }
        else {
            const convexp = this.makeCoercionExplicitAsNeeded(rootexp, this.tproc(roottype), this.tproc(exp.resolvedDeclType));
            rexp = (haspreconds || haspostconds) ? this.makeExpressionImmediate(convexp, this.tproc(exp.resolvedDeclType)) : convexp;
        }
        const tmapper = TemplateNameMapper.generateTemplateMappingForTypeDecl(this.tproc(exp.resolvedDeclType));
        const imapper = this.generateLocalTemplateMapping(mimpl.terms.map((t) => t.name), exp.terms);
        const fullmapper = TemplateNameMapper.tryMerge(tmapper, imapper);
        const aargs = [rexp, ...this.flattenInvokeArgs(haspreconds, haspostconds, exp.shuffleinfo, mimpl.params, exp.args, exp.resttype, exp.restinfo, fullmapper)];
        //do preconditions as needed
        for (let i = 0; i < mdecl.preconditions.length; ++i) {
            const invdecl = mdecl.preconditions[i];
            this.pushStatement(new IRPreconditionCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.diagnosticTag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), iname, invdecl.ii, aargs));
        }
        if (!exp.args.hasSpecialRef()) {
            if (!haspostconds) {
                return new IRInvokeSimpleExpression(iname, aargs);
            }
            else {
                const tmpres = this.generateTempVarName();
                this.pushStatement(new IRTempAssignStdInvokeStatement(tmpres, new IRInvokeSimpleExpression(iname, aargs), this.processTypeSignature(exp.getType())));
                //do postconditions as needed
                const postargs = [new IRAccessTempVariableExpression(tmpres), ...aargs];
                for (let i = 0; i < mdecl.postconditions.length; ++i) {
                    const invdecl = mdecl.postconditions[i];
                    this.pushStatement(new IRPostconditionCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.diagnosticTag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), iname, invdecl.ii, postargs));
                }
                return new IRAccessTempVariableExpression(tmpres);
            }
        }
        else {
            const srpos = exp.shuffleinfo.findIndex((si) => exp.args.args[si[0]] instanceof PassingArgumentValue);
            const ii = exp.shuffleinfo[srpos][0];
            const passarg = exp.args.args[ii];
            const ivar = passarg.exp.srcname;
            const ivartype = this.processTypeSignature(passarg.exp.getType());
            if (!haspostconds) {
                return new IRInvokeSimpleWithImplicitsExpression(iname, aargs, ii, ivar, ivartype, passarg.kind);
            }
            else {
                let tmppass = undefined;
                if (passarg.kind !== "out" && passarg.kind !== "out?") {
                    tmppass = this.generateTempVarName();
                    this.pushStatement(new IRTempAssignExpressionStatement(tmppass, aargs[srpos], ivartype));
                }
                const tmpres = this.generateTempVarName();
                this.pushStatement(new IRTempAssignRefInvokeStatement(tmpres, this.processTypeSignature(exp.getType()), ivar, ivartype, passarg.kind, new IRInvokeSimpleWithImplicitsExpression(iname, aargs, ii, ivar, ivartype, passarg.kind)));
                //do postconditions as needed
                let postargs = [new IRAccessTempVariableExpression(tmpres), ...aargs];
                if (tmppass !== undefined) {
                    postargs = [new IRAccessTempVariableExpression(tmpres), new IRAccessTempVariableExpression(tmppass), ...postargs];
                }
                for (let i = 0; i < mdecl.postconditions.length; ++i) {
                    const invdecl = mdecl.postconditions[i];
                    this.pushStatement(new IRPostconditionCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.diagnosticTag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), iname, invdecl.ii, postargs));
                }
                return new IRAccessTempVariableExpression(tmpres);
            }
        }
    }
    flattenPostfixOp(exp) {
        let eexp = this.flattenExpression(exp.rootExp);
        let eexptype = this.tproc(exp.rootExp.getType());
        for (let i = 0; i < exp.ops.length; ++i) {
            const op = exp.ops[i];
            const scurr = this.makeExpressionSimple(eexp, eexptype);
            switch (op.tag) {
                case PostfixOpTag.PostfixAccessFromName: {
                    eexp = this.flattenPostfixAccessFromName(op, scurr, eexptype);
                    eexptype = this.tproc(op.getType());
                    break;
                }
                case PostfixOpTag.PostfixProjectFromNames: {
                    eexp = this.flattenPostfixProjectFromNames(op, scurr, eexptype);
                    eexptype = this.tproc(op.getType());
                    break;
                }
                case PostfixOpTag.PostfixAccessFromIndex: {
                    eexp = this.flattenPostfixAccessFromIndex(op, scurr, eexptype);
                    eexptype = this.tproc(op.getType());
                    break;
                }
                case PostfixOpTag.PostfixIsTest: {
                    eexp = this.flattenPostfixIsTest(op, scurr, eexptype);
                    eexptype = this.tproc(op.getType());
                    break;
                }
                case PostfixOpTag.PostfixAsConvert: {
                    eexp = this.flattenPostfixAsConvert(op, scurr, eexptype);
                    eexptype = this.tproc(op.getType());
                    break;
                }
                case PostfixOpTag.PostfixAssignFields: {
                    eexp = this.flattenPostfixAssignFields(op, scurr, eexptype);
                    eexptype = this.tproc(op.getType());
                    break;
                }
                case PostfixOpTag.PostfixSliceOperator: {
                    eexp = this.flattenPostfixSliceOperator(op, scurr, eexptype);
                    eexptype = this.tproc(op.getType());
                    break;
                }
                case PostfixOpTag.PostfixInvoke: {
                    eexp = this.flattenPostfixInvoke(op, scurr, eexptype);
                    eexptype = this.tproc(op.getType());
                    break;
                }
                default: {
                    assert(false, "missing case in PostfixOpTag");
                }
            }
        }
        return eexp;
    }
    unwrapBinArgs(left, right, lefttype, righttype) {
        const lsimp = this.makeExpressionSimple(left, lefttype);
        const rsimp = this.makeExpressionSimple(right, righttype);
        const lres = ((lefttype instanceof NominalTypeSignature) && (lefttype.decl instanceof TypedeclTypeDecl)) ? new IRAccessTypeDeclValueExpression(this.processTypeSignature(lefttype), lsimp) : lsimp;
        const rres = ((righttype instanceof NominalTypeSignature) && (righttype.decl instanceof TypedeclTypeDecl)) ? new IRAccessTypeDeclValueExpression(this.processTypeSignature(righttype), rsimp) : rsimp;
        return [lres, rres];
    }
    needsAddCheck(opchk) {
        if (opchk === "ChkNat" || opchk === "ChkInt") {
            return false;
        }
        return true;
    }
    needsSubCheck(opchk) {
        if (opchk === "ChkInt") {
            return false;
        }
        return true;
    }
    needsMultCheck(opchk) {
        if (opchk === "ChkNat" || opchk === "ChkInt") {
            return false;
        }
        return true;
    }
    needsDivCheck(rhs, opchk) {
        if (!(rhs instanceof LiteralSimpleExpression)) {
            return true;
        }
        const rval = rhs.value;
        if (opchk === "Nat") {
            return /[+-]?0n/.test(rval);
        }
        else if (opchk === "Int") {
            return /[+-]?0i/.test(rval);
        }
        else if (opchk === "ChkNat") {
            return /[+-]?0N/.test(rval);
        }
        else if (opchk === "ChkInt") {
            return /[+-]?0I/.test(rval);
        }
        else if (opchk === "Float") {
            return /[+-]?0\.0+f/.test(rval);
        }
        else {
            return true;
        }
    }
    flattenListConstructor(decl, exp) {
        const tcons = this.tproc(exp.ctype);
        if (exp.args.args.length === 0) {
            return new IRConstructorListEmptyExpression(this.processTypeSignature(tcons));
        }
        else {
            if (exp.args.args.every((a) => a instanceof PositionalArgumentValue)) {
                const aargs = [];
                for (let i = 0; i < exp.args.args.length; ++i) {
                    const eexp = exp.args.args[i];
                    const sexp = this.flattenExpression(eexp.exp);
                    const cexp = this.makeCoercionExplicitAsNeeded(this.makeExpressionSimple(sexp, eexp.exp.getType()), eexp.exp.getType(), tcons.alltermargs[0]);
                    aargs.push(cexp);
                }
                return new IRConstructorListSingletonsExpression(this.processTypeSignature(tcons), aargs);
            }
            else {
                assert(false, "ASMToIRConverter::flattenListConstructor - spread and mixed args not implemented");
            }
        }
    }
    flattenCollectionConstructor(cdecl, exp) {
        if (cdecl instanceof ListTypeDecl) {
            return this.flattenListConstructor(cdecl, exp);
        }
        else {
            assert(false, "ASMToIRConverter::flattenCollectionConstructor - Not Implemented");
        }
    }
    flattenStandardConstructor(decl, exp) {
        const hasinvchks = decl.allInvariants.length !== 0;
        const bfinfo = decl.saturatedBFieldInfo;
        const tcons = this.tproc(exp.ctype);
        const imapper = this.generateLocalTemplateMapping(decl.terms.map((t) => t.name), tcons.alltermargs);
        const aargs = [];
        for (let i = 0; i < exp.shuffleinfo.length; ++i) {
            const ii = exp.shuffleinfo[i];
            const finfo = bfinfo[i];
            const ftype = this.applyLocalTemplateMapping(finfo.type, imapper);
            if (ii[0] === -1) {
                const eexp = this.assembly.resolveFieldDeclDefaultExpFromTypeSignature(finfo.containingtype, finfo.name);
                const crexp = eexp !== undefined ? this.assembly.tryReduceConstantExpression(eexp, this.currentBinds) : undefined;
                if (crexp !== undefined) {
                    const sexp = this.flattenExpression(crexp);
                    const cexp = this.makeCoercionExplicitAsNeeded(this.makeExpressionSimple(sexp, crexp.getType()), crexp.getType(), ftype);
                    const fexp = hasinvchks ? this.makeExpressionImmediate(cexp, ftype) : cexp;
                    aargs.push(fexp);
                }
                else {
                    assert(false, "ASMToIRConverter::flattenStandardConstructor - Invoke computation for default argument not implemented");
                }
            }
            else {
                const eexp = exp.args.args[ii[0]];
                const sexp = this.flattenExpression(eexp.exp);
                const cexp = this.makeCoercionExplicitAsNeeded(this.makeExpressionSimple(sexp, eexp.exp.getType()), eexp.exp.getType(), ftype);
                const fexp = hasinvchks ? this.makeExpressionImmediate(cexp, ftype) : cexp;
                aargs.push(fexp);
            }
        }
        //do invariants as needed (on appropriate sets of args
        for (let i = 0; i < decl.allInvariants.length; ++i) {
            const invdecl = decl.allInvariants[i];
            const ffargnames = invdecl.containingtype.decl.saturatedBFieldInfo.map((bf) => bf.name);
            const args = ffargnames.map((aname) => {
                const aaidx = bfinfo.findIndex((bf) => bf.name === aname);
                assert(aaidx !== -1, "invariant arg name not found in field list");
                return aargs[aaidx];
            });
            this.pushStatement(new IREntityInvariantCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.tag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), this.processTypeSignature(invdecl.containingtype).tkeystr, invdecl.ii, args));
        }
        return new IRConstructorStandardEntityExpression(this.processTypeSignature(exp.ctype), aargs);
    }
    flattenSpecialConstructableConstructor(cdecl, exp) {
        const ctype = this.tproc(exp.ctype);
        if (cdecl instanceof OkTypeDecl) {
            const argt = this.tproc(exp.args.args[0].exp.getType());
            const arg = this.makeExpressionSimple(this.flattenExpression(exp.args.args[0].exp), argt);
            const targ = this.makeCoercionExplicitAsNeeded(arg, argt, ctype.alltermargs[0]);
            return new IRConstructorOkTypeExpression(this.processTypeSignature(ctype), targ);
        }
        else if (cdecl instanceof FailTypeDecl) {
            const argt = this.tproc(exp.args.args[0].exp.getType());
            const arg = this.makeExpressionSimple(this.flattenExpression(exp.args.args[0].exp), argt);
            const targ = this.makeCoercionExplicitAsNeeded(arg, argt, ctype.alltermargs[1]);
            return new IRConstructorFailTypeExpression(this.processTypeSignature(ctype), targ);
        }
        else if ((cdecl instanceof APIErrorTypeDecl) || (cdecl instanceof APIRejectedTypeDecl) || (cdecl instanceof APIDeniedTypeDecl) || (cdecl instanceof APIFlaggedTypeDecl) || (cdecl instanceof APISuccessTypeDecl)) {
            assert(false, "ASMToIRConverter::flattenSpecialConstructableConstructor - Not Implemented");
        }
        else if (cdecl instanceof SomeTypeDecl) {
            const argt = this.tproc(exp.args.args[0].exp.getType());
            const arg = this.makeExpressionSimple(this.flattenExpression(exp.args.args[0].exp), argt);
            const targ = this.makeCoercionExplicitAsNeeded(arg, argt, ctype.alltermargs[0]);
            return new IRConstructorSomeTypeExpression(this.processTypeSignature(ctype), targ);
        }
        else {
            const kargt = this.tproc(exp.args.args[0].exp.getType());
            const karg = this.makeExpressionSimple(this.flattenExpression(exp.args.args[0].exp), kargt);
            const ktarg = this.makeCoercionExplicitAsNeeded(karg, kargt, ctype.alltermargs[0]);
            const vargt = this.tproc(exp.args.args[1].exp.getType());
            const varg = this.makeExpressionSimple(this.flattenExpression(exp.args.args[1].exp), vargt);
            const vtarg = this.makeCoercionExplicitAsNeeded(varg, vargt, ctype.alltermargs[1]);
            return new IRConstructorMapEntryTypeExpression(this.processTypeSignature(ctype), ktarg, vtarg);
        }
    }
    flattenSpecialTypeDeclConstructor(cdecl, exp) {
        const ctype = this.tproc(exp.ctype);
        const tdecl = ctype.decl;
        const cargt = this.tproc(exp.args.args[0].exp.getType());
        let cval = this.makeExpressionSimple(this.flattenExpression(exp.args.args[0].exp), cargt);
        if (tdecl.allInvariants.length !== 0 || tdecl.optofexp !== undefined || tdecl.optsizerng !== undefined) {
            cval = this.makeExpressionImmediate(cval, tdecl.valuetype);
        }
        if (tdecl.optsizerng !== undefined) {
            if (tdecl.valuetype.tkeystr === "CString") {
                this.pushStatement(new IRTypeDeclSizeRangeCheckCStringStatement(tdecl.file, this.convertSourceInfo(tdecl.sinfo), this.registerError(tdecl.file, this.convertSourceInfo(tdecl.sinfo), "userspec"), tdecl.optsizerng.min, tdecl.optsizerng.max, cval));
            }
            else if (tdecl.valuetype.tkeystr === "String") {
                this.pushStatement(new IRTypeDeclSizeRangeCheckUnicodeStringStatement(tdecl.file, this.convertSourceInfo(tdecl.sinfo), this.registerError(tdecl.file, this.convertSourceInfo(tdecl.sinfo), "userspec"), tdecl.optsizerng.min, tdecl.optsizerng.max, cval));
            }
            else {
                this.pushStatement(new IRTypeDeclNumericRangeCheckStatement(tdecl.file, this.convertSourceInfo(tdecl.sinfo), this.registerError(tdecl.file, this.convertSourceInfo(tdecl.sinfo), "userspec"), tdecl.optsizerng.min, tdecl.optsizerng.max, cval));
            }
        }
        if (tdecl.optofexp !== undefined) {
            if (tdecl.valuetype.tkeystr === "CString") {
                const regex = this.flattenExpression(tdecl.optofexp);
                this.pushStatement(new IRTypeDeclFormatCheckCStringStatement(tdecl.file, this.convertSourceInfo(tdecl.sinfo), this.registerError(tdecl.file, this.convertSourceInfo(tdecl.sinfo), "userspec"), regex, cval));
            }
            else {
                const regex = this.flattenExpression(tdecl.optofexp);
                this.pushStatement(new IRTypeDeclFormatCheckUnicodeStringStatement(tdecl.file, this.convertSourceInfo(tdecl.sinfo), this.registerError(tdecl.file, this.convertSourceInfo(tdecl.sinfo), "userspec"), regex, cval));
            }
        }
        if (tdecl.allInvariants.length !== 0) {
            const invchecks = tdecl.allInvariants.map((invdecl) => {
                return new IRTypeDeclInvariantCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.tag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), this.processTypeSignature(invdecl.containingtype).tkeystr, invdecl.ii, cval);
            });
            this.pushStatements(invchecks);
        }
        return new IRConstructSafeTypeDeclExpression(this.processTypeSignature(ctype), cval);
    }
    flattenConstructorPrimaryExpression(exp) {
        const tsig = this.tproc(exp.ctype);
        const decl = tsig.decl;
        if (decl instanceof AbstractCollectionTypeDecl) {
            return this.flattenCollectionConstructor(decl, exp);
        }
        else if (decl instanceof ConstructableTypeDecl) {
            return this.flattenSpecialConstructableConstructor(decl, exp);
        }
        else if (decl instanceof TypedeclTypeDecl) {
            return this.flattenSpecialTypeDeclConstructor(decl, exp);
        }
        else {
            assert(decl instanceof AbstractEntityTypeDecl, "Expected AbstractEntityTypeDecl in flattenConstructorPrimaryExpression");
            return this.flattenStandardConstructor(decl, exp);
        }
    }
    flattenEListConstructorExpression(exp) {
        const eltype = this.processTypeSignature(exp.getType());
        const values = exp.args.args.map((e) => {
            const aexp = e.exp;
            return this.makeExpressionSimple(this.flattenExpression(aexp), aexp.getType());
        });
        return new IRConstructorEListExpression(eltype, values);
    }
    flattenSpecialConstructorExpression(exp) {
        const ctype = this.tproc(exp.constype);
        const argt = this.tproc(exp.arg.getType());
        const arg = this.makeExpressionSimple(this.flattenExpression(exp.arg), argt);
        if (exp.rop === "some") {
            const targ = this.makeCoercionExplicitAsNeeded(arg, argt, ctype.alltermargs[0]);
            return new IRConstructorSomeTypeExpression(this.processTypeSignature(ctype), targ);
        }
        else if (exp.rop === "ok") {
            const targ = this.makeCoercionExplicitAsNeeded(arg, argt, ctype.alltermargs[0]);
            return new IRConstructorOkTypeExpression(this.processTypeSignature(ctype), targ);
        }
        else {
            //fail
            const targ = this.makeCoercionExplicitAsNeeded(arg, argt, ctype.alltermargs[1]);
            return new IRConstructorFailTypeExpression(this.processTypeSignature(ctype), targ);
        }
    }
    flattenExpression(exp) {
        const ttag = exp.tag;
        if (ttag === ExpressionTag.LiteralNoneExpression) {
            return new IRLiteralNoneExpression();
        }
        else if (ttag === ExpressionTag.LiteralBoolExpression) {
            return new IRLiteralBoolExpression(exp.value === "true");
        }
        else if (ttag === ExpressionTag.LiteralNatExpression) {
            return new IRLiteralNatExpression(exp.value.slice(0, -1));
        }
        else if (ttag === ExpressionTag.LiteralIntExpression) {
            return new IRLiteralIntExpression(exp.value.slice(0, -1));
        }
        else if (ttag === ExpressionTag.LiteralChkNatExpression) {
            const ll = exp.value;
            return new IRLiteralChkNatExpression(ll === "ChkNat::npos" ? ll : ll.slice(0, -1));
        }
        else if (ttag === ExpressionTag.LiteralChkIntExpression) {
            const ll = exp.value;
            return new IRLiteralChkIntExpression(ll === "ChkInt::npos" ? ll : ll.slice(0, -1));
        }
        else if (ttag === ExpressionTag.LiteralRationalExpression) {
            const rrval = exp.value;
            const slpos = rrval.indexOf("/");
            return new IRLiteralRationalExpression(rrval.slice(0, slpos), rrval.slice(slpos + 1, -1));
        }
        else if (ttag === ExpressionTag.LiteralFloatExpression) {
            return new IRLiteralFloatExpression(exp.value.slice(0, -1));
        }
        else if (ttag === ExpressionTag.LiteralDecimalExpression) {
            return new IRLiteralDecimalExpression(exp.value.slice(0, -1));
        }
        else if (ttag === ExpressionTag.LiteralDecimalDegreeExpression) {
            return new IRLiteralDecimalDegreeExpression(exp.value.slice(0, -2));
        }
        else if (ttag === ExpressionTag.LiteralLatLongCoordinateExpression) {
            const latsplit = exp.value.indexOf("lat");
            return new IRLiteralLatLongCoordinateExpression(exp.value.slice(0, latsplit), exp.value.slice(latsplit + 3, -4));
        }
        else if (ttag === ExpressionTag.LiteralComplexNumberExpression) {
            const cnv = exp.value;
            let spos = cnv.lastIndexOf("+");
            if (spos === -1) {
                spos = cnv.lastIndexOf("-");
            }
            return new IRLiteralComplexExpression(cnv.slice(0, spos), cnv.slice(spos, -1));
        }
        else if (ttag === ExpressionTag.LiteralByteBufferExpression) {
            const bytes = exp.value.slice(3, -1).split(",").map((b) => parseInt("0x" + b, 16));
            return new IRLiteralByteBufferExpression(bytes);
        }
        else if (ttag === ExpressionTag.LiteralUUIDv4Expression) {
            const bstring = exp.value.slice(6, -1).replace(/-/g, "");
            let bytes = [];
            for (let i = 0; i < bstring.length; i += 2) {
                bytes.push(parseInt("0x" + bstring.slice(i, i + 2), 16));
            }
            return new IRLiteralUUIDv4Expression(bytes);
        }
        else if (ttag === ExpressionTag.LiteralUUIDv7Expression) {
            const bstring = exp.value.slice(6, -1).replace(/-/g, "");
            let bytes = [];
            for (let i = 0; i < bstring.length; i += 2) {
                bytes.push(parseInt("0x" + bstring.slice(i, i + 2), 16));
            }
            return new IRLiteralUUIDv7Expression(bytes);
        }
        else if (ttag === ExpressionTag.LiteralSHAContentHashExpression) {
            const bstring = exp.value.slice(5, -1);
            let bytes = [];
            for (let i = 0; i < bstring.length; i += 2) {
                bytes.push(parseInt("0x" + bstring.slice(i, i + 2), 16));
            }
            return new IRLiteralSHAContentHashExpression(bytes);
        }
        else if (ttag === ExpressionTag.LiteralTZDateTimeExpression) {
            const dstri = exp.value.split("T@");
            const datepart = ASMToIRConverter.extractLiteralDateInfo(dstri[0]);
            const timepart = ASMToIRConverter.extractLiteralTimeInfo(dstri[1]);
            return new IRLiteralTZDateTimeExpression(datepart, timepart, dstri[2]);
        }
        else if (ttag === ExpressionTag.LiteralTAITimeExpression) {
            const dstri = exp.value.split("T");
            const datepart = ASMToIRConverter.extractLiteralDateInfo(dstri[0]);
            const timepart = ASMToIRConverter.extractLiteralTimeInfo(dstri[1]);
            return new IRLiteralTAITimeExpression(datepart, timepart);
        }
        else if (ttag === ExpressionTag.LiteralPlainDateExpression) {
            return new IRLiteralPlainDateExpression(ASMToIRConverter.extractLiteralDateInfo(exp.value));
        }
        else if (ttag === ExpressionTag.LiteralPlainTimeExpression) {
            return new IRLiteralPlainTimeExpression(ASMToIRConverter.extractLiteralTimeInfo(exp.value));
        }
        else if (ttag === ExpressionTag.LiteralLogicalTimeExpression) {
            return new IRLiteralLogicalTimeExpression(exp.value.slice(-2));
        }
        else if (ttag === ExpressionTag.LiteralISOTimeStampExpression) {
            const dstri = exp.value.slice(0, -1).split("T.");
            const datepart = ASMToIRConverter.extractLiteralDateInfo(dstri[0]);
            const timepart = ASMToIRConverter.extractLiteralTimeInfo(dstri[1]);
            return new IRLiteralISOTimeStampExpression(datepart, timepart, Number.parseInt(dstri[2].slice(0, -1), 10));
        }
        else if (ttag === ExpressionTag.LiteralDeltaDateTimeExpression) {
            const sign = exp.value[0];
            const dstri = exp.value.slice(1).split("T");
            const deltadatepart = ASMToIRConverter.extractLiteralDeltaDateInfo(dstri[0]);
            const deltatimepart = ASMToIRConverter.extractLiteralDeltaTimeInfo(dstri[1]);
            return new IRLiteralDeltaDateTimeExpression(sign, deltadatepart, deltatimepart);
        }
        else if (ttag === ExpressionTag.LiteralDeltaISOTimeStampExpression) {
            const sign = exp.value[0];
            const dstri = exp.value.slice(1, -1).split("T.");
            const deltadatepart = ASMToIRConverter.extractLiteralDeltaDateInfo(dstri[0]);
            const deltatimepart = ASMToIRConverter.extractLiteralDeltaTimeInfo(dstri[1]);
            const deltamilliseconds = BigInt(dstri[2]);
            return new IRLiteralDeltaISOTimeStampExpression(sign, deltadatepart, deltatimepart, deltamilliseconds);
        }
        else if (ttag === ExpressionTag.LiteralDeltaSecondsExpression) {
            const sign = exp.value[0];
            const seconds = exp.value.slice(1, -2);
            return new IRLiteralDeltaSecondsExpression(sign, seconds);
        }
        else if (ttag === ExpressionTag.LiteralDeltaLogicalExpression) {
            const sign = exp.value[0];
            const ticks = exp.value.slice(1, -2);
            return new IRLiteralDeltaLogicalTimeExpression(sign, ticks);
        }
        else if (ttag === ExpressionTag.LiteralUnicodeRegexExpression) {
            const rexp = exp;
            const regexinst = this.processURegex(rexp.inns, rexp.value);
            return new IRLiteralUnicodeRegexExpression(regexinst.regexID, rexp.value);
        }
        else if (ttag === ExpressionTag.LiteralCRegexExpression) {
            const rexp = exp;
            const regexinst = this.processCRegex(rexp.inns, rexp.value);
            return new IRLiteralCRegexExpression(regexinst.regexID, rexp.value);
        }
        else if (ttag === ExpressionTag.LiteralByteExpression) {
            const bstr = exp.value;
            const nval = Number.parseInt(bstr, 16);
            return new IRLiteralByteExpression(nval);
        }
        else if (ttag === ExpressionTag.LiteralCCharExpression) {
            return new IRLiteralCCharExpression(exp.resolvedValue.charCodeAt(0));
        }
        else if (ttag === ExpressionTag.LiteralUnicodeCharExpression) {
            return new IRLiteralUnicodeCharExpression(exp.resolvedValue.charCodeAt(0));
        }
        else if (ttag === ExpressionTag.LiteralCStringExpression) {
            const slexp = exp;
            const bytes = this.processStringBytes(slexp.resolvedValue);
            return new IRLiteralCStringExpression(bytes);
        }
        else if (ttag === ExpressionTag.LiteralStringExpression) {
            const slexp = exp;
            const bytes = this.processStringBytes(slexp.resolvedValue);
            return new IRLiteralStringExpression(bytes);
        }
        else if (ttag === ExpressionTag.LiteralFormatStringExpression) {
            const ffmt = exp;
            const ftype = this.processTypeSignature(ffmt.getType());
            const fmts = ffmt.fmts.map((fmtcomp) => {
                if (fmtcomp instanceof FormatStringTextComponent) {
                    const slexp = fmtcomp;
                    const bytes = this.processStringBytes(slexp.resolvedValue);
                    return new IRFormatStringTextComponent(bytes);
                }
                else {
                    const argexp = fmtcomp;
                    let apos;
                    if (/^[0-9]+$/.test(argexp.argPos)) {
                        apos = Number.parseInt(argexp.argPos, 10);
                    }
                    else {
                        apos = ftype.terms.findIndex((t) => t.argname === argexp.argPos);
                    }
                    return new IRFormatStringArgComponent(apos, this.processTypeSignature(argexp.resolvedType));
                }
            });
            const iidx = this.formatstrings.length;
            const fstring = new IRLiteralFormatStringExpression(iidx, fmts);
            this.formatstrings.push(fstring);
            return fstring;
        }
        else if (ttag === ExpressionTag.LiteralFormatCStringExpression) {
            const ffmt = exp;
            const ftype = this.processTypeSignature(ffmt.getType());
            const fmts = ffmt.fmts.map((fmtcomp) => {
                if (fmtcomp instanceof FormatStringTextComponent) {
                    const slexp = fmtcomp;
                    const bytes = this.processStringBytes(slexp.resolvedValue);
                    return new IRFormatStringTextComponent(bytes);
                }
                else {
                    const argexp = fmtcomp;
                    let apos;
                    if (/^[0-9]+$/.test(argexp.argPos)) {
                        apos = Number.parseInt(argexp.argPos, 10);
                    }
                    else {
                        apos = ftype.terms.findIndex((t) => t.argname === argexp.argPos);
                    }
                    return new IRFormatStringArgComponent(apos, this.processTypeSignature(argexp.resolvedType));
                }
            });
            const iidx = this.formatcstrings.length;
            const fstring = new IRLiteralFormatCStringExpression(iidx, fmts);
            this.formatcstrings.push(fstring);
            return fstring;
        }
        else if (ttag === ExpressionTag.LiteralTypeDeclValueExpression) {
            const tdeclexp = exp;
            const csig = this.processTypeSignature(tdeclexp.constype);
            const iexp = this.flattenExpression(tdeclexp.value);
            if (tdeclexp.constype.decl.allInvariants.length > 0) {
                const invchecks = tdeclexp.constype.decl.allInvariants.map((invdecl) => {
                    return new IRTypeDeclInvariantCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.tag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), this.processTypeSignature(invdecl.containingtype).tkeystr, invdecl.ii, iexp);
                });
                this.pushStatements(invchecks);
            }
            return new IRLiteralTypedExpression(iexp, csig);
        }
        else if (ttag === ExpressionTag.LiteralTypedStringExpression) {
            let tdeclexp = exp;
            const bytes = this.processStringBytes(tdeclexp.resolvedValue);
            const csig = this.processTypeSignature(tdeclexp.constype);
            const iexp = new IRLiteralStringExpression(bytes);
            if (tdeclexp.constype.decl.allInvariants.length > 0) {
                const invchecks = tdeclexp.constype.decl.allInvariants.map((invdecl) => {
                    return new IRTypeDeclInvariantCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.tag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), this.processTypeSignature(invdecl.containingtype).tkeystr, invdecl.ii, iexp);
                });
                this.pushStatements(invchecks);
            }
            return new IRLiteralTypedStringExpression(bytes, csig);
        }
        else if (ttag === ExpressionTag.LiteralTypedCStringExpression) {
            let tdeclexp = exp;
            const bytes = this.processStringBytes(tdeclexp.resolvedValue);
            const csig = this.processTypeSignature(tdeclexp.constype);
            const iexp = new IRLiteralCStringExpression(bytes);
            if (tdeclexp.constype.decl.allInvariants.length > 0) {
                const invchecks = tdeclexp.constype.decl.allInvariants.map((invdecl) => {
                    return new IRTypeDeclInvariantCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.tag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), this.processTypeSignature(invdecl.containingtype).tkeystr, invdecl.ii, iexp);
                });
                this.pushStatements(invchecks);
            }
            return new IRLiteralTypedCStringExpression(bytes, csig);
        }
        else if (ttag === ExpressionTag.LiteralTypedFormatStringExpression) {
            const ffmt = exp;
            const ftype = this.processTypeSignature(ffmt.getType());
            const fmts = ffmt.fmts.map((fmtcomp) => {
                if (fmtcomp instanceof FormatStringTextComponent) {
                    const slexp = fmtcomp;
                    const bytes = this.processStringBytes(slexp.resolvedValue);
                    return new IRFormatStringTextComponent(bytes);
                }
                else {
                    const argexp = fmtcomp;
                    let apos;
                    if (/^[0-9]+$/.test(argexp.argPos)) {
                        apos = Number.parseInt(argexp.argPos, 10);
                    }
                    else {
                        apos = ftype.terms.findIndex((t) => t.argname === argexp.argPos);
                    }
                    return new IRFormatStringArgComponent(apos, this.processTypeSignature(argexp.resolvedType));
                }
            });
            const iidx = this.formatstrings.length;
            const fstring = new IRLiteralFormatStringExpression(iidx, fmts);
            this.formatstrings.push(fstring);
            return fstring;
        }
        else if (ttag === ExpressionTag.LiteralTypedFormatCStringExpression) {
            const ffmt = exp;
            const ftype = this.processTypeSignature(ffmt.getType());
            const fmts = ffmt.fmts.map((fmtcomp) => {
                if (fmtcomp instanceof FormatStringTextComponent) {
                    const slexp = fmtcomp;
                    const bytes = this.processStringBytes(slexp.resolvedValue);
                    return new IRFormatStringTextComponent(bytes);
                }
                else {
                    const argexp = fmtcomp;
                    let apos;
                    if (/^[0-9]+$/.test(argexp.argPos)) {
                        apos = Number.parseInt(argexp.argPos, 10);
                    }
                    else {
                        apos = ftype.terms.findIndex((t) => t.argname === argexp.argPos);
                    }
                    return new IRFormatStringArgComponent(apos, this.processTypeSignature(argexp.resolvedType));
                }
            });
            const iidx = this.formatcstrings.length;
            const fstring = new IRLiteralFormatCStringExpression(iidx, fmts);
            this.formatcstrings.push(fstring);
            return fstring;
        }
        else if (ttag === ExpressionTag.AccessEnvValueExpression) {
            const aevexp = exp;
            const kbytes = this.processStringBytes(aevexp.resolvedkey);
            if (aevexp.opname === "has") {
                return new IRAccessEnvHasExpression(kbytes);
            }
            else if (aevexp.opname === "get") {
                if (!aevexp.mustdefined) {
                    this.pushStatement(new IRPreconditionCheckStatement(this.currentFile, this.convertSourceInfo(exp.sinfo), undefined, this.registerError(this.currentFile, this.convertSourceInfo(exp.sinfo), "runtime"), "env::get", 0, [new IRAccessEnvHasExpression(kbytes)]));
                }
                return new IRAccessEnvGetExpression(kbytes, this.processTypeSignature(aevexp.optoftype));
            }
            else {
                return new IRAccessEnvTryGetExpression(kbytes, this.processTypeSignature(aevexp.optoftype), this.processTypeSignature(exp.getType()));
            }
        }
        else if (ttag === ExpressionTag.TaskAccessIDExpression) {
            const taexp = exp;
            if (taexp.name === "currentID") {
                return new IRTaskAccessIDExpression();
            }
            else {
                return new IRTaskAccessParentIDExpression();
            }
        }
        else if (ttag === ExpressionTag.AccessNamespaceConstantExpression) {
            const tnsa = exp;
            const rvv = this.assembly.tryReduceConstantExpression(tnsa, this.currentBinds);
            if (rvv !== undefined) {
                return this.flattenExpression(rvv);
            }
            else {
                const flatconstname = `${tnsa.ns.emit()}::${tnsa.name}`;
                return new IRAccessConstantExpression(flatconstname);
            }
        }
        else if (ttag === ExpressionTag.AccessStaticFieldExpression) {
            const tasf = exp;
            const rvv = this.assembly.tryReduceConstantExpression(tasf, this.currentBinds);
            if (rvv !== undefined) {
                return this.flattenExpression(rvv);
            }
            else {
                const flatfieldname = `${tasf.resolvedDeclType.tkeystr}::${tasf.name}`;
                return new IRAccessConstantExpression(flatfieldname);
            }
        }
        else if (ttag === ExpressionTag.AccessEnumExpression) {
            const taee = exp;
            return new IRAccessEnumExpression(taee.stype.tkeystr, taee.name);
        }
        else if (ttag === ExpressionTag.AccessVariableExpression) {
            const tave = exp;
            if (tave.isParameter) {
                return new IRAccessParameterVariableExpression(tave.srcname);
            }
            else if (tave.isCaptured) {
                return new IRAccessCapturedVariableExpression(this.processLocalVariableName(tave.srcname));
            }
            else {
                return new IRAccessLocalVariableExpression(this.processLocalVariableName(tave.srcname));
            }
        }
        else if (ttag === ExpressionTag.ConstructorPrimaryExpression) {
            return this.flattenConstructorPrimaryExpression(exp);
        }
        else if (ttag === ExpressionTag.ConstructorEListExpression) {
            return this.flattenEListConstructorExpression(exp);
        }
        else if (ttag === ExpressionTag.ConstructorLambdaExpression) {
            return this.flattenConstructorLambdaExpression(exp);
        }
        else if (ttag === ExpressionTag.LambdaInvokeExpression) {
            return this.flattenLambdaInvokeExpression(exp);
        }
        else if (ttag === ExpressionTag.SpecialConstructorExpression) {
            return this.flattenSpecialConstructorExpression(exp);
        }
        else if (ttag === ExpressionTag.CallNamespaceFunctionExpression) {
            return this.flattenCallNamespaceFunctionExpression(exp);
        }
        else if (ttag === ExpressionTag.CallTypeFunctionExpression) {
            return this.flattenCallTypeFunctionExpression(exp);
        }
        else if (ttag === ExpressionTag.ParseAsTypeExpression) {
            assert(false, `ASMToIRConverter: not implemented -- ${exp.tag}`);
        }
        else if (ttag === ExpressionTag.InterpolateFormatExpression) {
            const ifexp = exp;
            const rtype = this.tproc(ifexp.getType());
            const fop = this.makeExpressionSimple(this.flattenExpression(ifexp.fmtString), ifexp.fmtString.getType());
            const fargs = [];
            for (let i = 0; i < ifexp.args.length; i++) {
                const argtype = this.tproc(ifexp.args[i].exp.getType());
                const barg = this.makeExpressionSimple(this.flattenExpression(ifexp.args[i].exp), this.tproc(ifexp.args[i].exp.getType()));
                if (!(argtype.decl instanceof TypedeclTypeDecl)) {
                    fargs.push(barg);
                }
                else {
                    const tdaccess = new IRAccessTypeDeclValueExpression(this.processTypeSignature(argtype), barg);
                    fargs.push(tdaccess);
                }
            }
            let interpop;
            if (ifexp.kind === "string") {
                interpop = new IRInterpolateFormatStringExpression(fop, fargs);
            }
            else if (ifexp.kind === "cstring") {
                interpop = new IRInterpolateFormatCStringExpression(fop, fargs);
            }
            else {
                assert(false, `ASMToIRConverter: Unknown InterpolateFormatExpression kind -- ${ifexp.kind}`);
            }
            //if the result is a CString/String then just emit the format operation
            if (rtype.tkeystr === "CString" || rtype.tkeystr === "String") {
                return interpop;
            }
            else {
                //else it is a formatted literal and we need to emit multiple ops -- format the string, then run the check, then "construct the type alias"
                assert(false, `ASMToIRConverter: not implemented -- InterpolateFormatExpression with type alias result`);
            }
        }
        else if (ttag === ExpressionTag.PostfixOpExpression) {
            return this.flattenPostfixOp(exp);
        }
        else if (ttag === ExpressionTag.PrefixNotOpExpression) {
            const pfxnot = exp;
            const eetype = this.tproc(pfxnot.exp.getType());
            const nexp = this.makeExpressionSimple(this.flattenExpression(pfxnot.exp), eetype);
            if (!(eetype.decl instanceof TypedeclTypeDecl)) {
                if (nexp instanceof IRPrefixNotOpExpression) {
                    return nexp.exp; //!!e is e
                }
                else if (ASMToIRConverter.isLiteralTrueExpression(nexp)) {
                    return new IRLiteralBoolExpression(false); //do the literal negation
                }
                else if (ASMToIRConverter.isLiteralFalseExpression(nexp)) {
                    return new IRLiteralBoolExpression(true); //do the literal negation
                }
                else {
                    return new IRPrefixNotOpExpression(nexp, this.processTypeSignature(pfxnot.opertype));
                }
            }
            else {
                //TODO: check for literal true/false and optimize
                const tdaccess = new IRAccessTypeDeclValueExpression(this.processTypeSignature(eetype), nexp);
                const bnotop = new IRPrefixNotOpExpression(tdaccess, this.processTypeSignature(pfxnot.opertype));
                const notop = (eetype.decl.allInvariants.length !== 0) ? this.makeExpressionImmediate(bnotop, this.tproc(pfxnot.opertype)) : bnotop;
                if (eetype.decl.allInvariants.length !== 0) {
                    const invchecks = eetype.decl.allInvariants.map((invdecl) => {
                        return new IRTypeDeclInvariantCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.tag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), this.processTypeSignature(invdecl.containingtype).tkeystr, invdecl.ii, notop);
                    });
                    this.pushStatements(invchecks);
                }
                return new IRConstructSafeTypeDeclExpression(this.processTypeSignature(eetype), notop);
            }
        }
        else if (ttag === ExpressionTag.PrefixNegateOrPlusOpExpression) {
            const pfxneg = exp;
            const eetype = this.tproc(pfxneg.exp.getType());
            const nexp = this.makeExpressionSimple(this.flattenExpression(pfxneg.exp), eetype);
            if (!(eetype.decl instanceof TypedeclTypeDecl)) {
                return pfxneg.op === "-" ? new IRPrefixNegateOpExpression(nexp, this.processTypeSignature(pfxneg.opertype)) : nexp;
            }
            else {
                const tdaccess = new IRAccessTypeDeclValueExpression(this.processTypeSignature(eetype), nexp);
                const bnsop = pfxneg.op === "-" ? new IRPrefixNegateOpExpression(tdaccess, this.processTypeSignature(pfxneg.opertype)) : tdaccess;
                const needsImmediate = eetype.decl.allInvariants.length !== 0 || eetype.decl.optsizerng !== undefined;
                const nsop = needsImmediate ? this.makeExpressionImmediate(bnsop, this.tproc(pfxneg.opertype)) : bnsop;
                if (eetype.decl.allInvariants.length !== 0) {
                    const invchecks = eetype.decl.allInvariants.map((invdecl) => {
                        return new IRTypeDeclInvariantCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.tag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), this.processTypeSignature(invdecl.containingtype).tkeystr, invdecl.ii, nsop);
                    });
                    this.pushStatements(invchecks);
                }
                if (eetype.decl.optsizerng !== undefined) {
                    this.pushStatement(new IRTypeDeclNumericRangeCheckStatement(this.currentFile, this.convertSourceInfo(pfxneg.sinfo), this.registerError(this.currentFile, this.convertSourceInfo(pfxneg.sinfo), "userspec"), eetype.decl.optsizerng.min, eetype.decl.optsizerng.max, nsop));
                }
                return new IRConstructSafeTypeDeclExpression(this.processTypeSignature(eetype), nsop);
            }
        }
        else if (ttag === ExpressionTag.BinAddExpression) {
            const binadd = exp;
            const finaltype = this.tproc(binadd.getType());
            const leetype = this.tproc(binadd.lhs.getType());
            const reetype = this.tproc(binadd.rhs.getType());
            let [lexp, rexp] = this.unwrapBinArgs(this.flattenExpression(binadd.lhs), this.flattenExpression(binadd.rhs), leetype, reetype);
            const opchk = binadd.opertype.tkeystr;
            const optype = this.tproc(binadd.opertype);
            const iropttype = this.processTypeSignature(optype);
            if (this.needsAddCheck(opchk)) {
                lexp = this.makeExpressionImmediate(lexp, optype);
                rexp = this.makeExpressionImmediate(rexp, optype);
                this.pushStatement(new IRErrorAdditionBoundsCheckStatement(this.currentFile, binadd.sinfo, this.registerError(this.currentFile, binadd.sinfo, "arith"), lexp, rexp, opchk));
            }
            if (!(finaltype.decl instanceof TypedeclTypeDecl)) {
                return new IRBinAddExpression(lexp, rexp, iropttype);
            }
            else {
                const baddop = new IRBinAddExpression(lexp, rexp, iropttype);
                const needsImmediate = finaltype.decl.allInvariants.length !== 0 || finaltype.decl.optsizerng !== undefined;
                let addop = needsImmediate ? this.makeExpressionImmediate(baddop, optype) : baddop;
                if (finaltype.decl.allInvariants.length !== 0) {
                    const invchecks = finaltype.decl.allInvariants.map((invdecl) => {
                        return new IRTypeDeclInvariantCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.tag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), this.processTypeSignature(invdecl.containingtype).tkeystr, invdecl.ii, addop);
                    });
                    this.pushStatements(invchecks);
                }
                if (finaltype.decl.optsizerng !== undefined) {
                    this.pushStatement(new IRTypeDeclNumericRangeCheckStatement(this.currentFile, this.convertSourceInfo(binadd.sinfo), this.registerError(this.currentFile, this.convertSourceInfo(binadd.sinfo), "userspec"), finaltype.decl.optsizerng.min, finaltype.decl.optsizerng.max, addop));
                }
                return new IRConstructSafeTypeDeclExpression(this.processTypeSignature(finaltype), addop);
            }
        }
        else if (ttag === ExpressionTag.BinSubExpression) {
            const binsub = exp;
            const finaltype = this.tproc(binsub.getType());
            const leetype = this.tproc(binsub.lhs.getType());
            const reetype = this.tproc(binsub.rhs.getType());
            let [lexp, rexp] = this.unwrapBinArgs(this.flattenExpression(binsub.lhs), this.flattenExpression(binsub.rhs), leetype, reetype);
            const opchk = binsub.opertype.tkeystr;
            const optype = this.tproc(binsub.opertype);
            const iropttype = this.processTypeSignature(optype);
            if (this.needsSubCheck(opchk)) {
                lexp = this.makeExpressionImmediate(lexp, optype);
                rexp = this.makeExpressionImmediate(rexp, optype);
                this.pushStatement(new IRErrorSubtractionBoundsCheckStatement(this.currentFile, this.convertSourceInfo(binsub.sinfo), this.registerError(this.currentFile, this.convertSourceInfo(binsub.sinfo), (opchk === "Nat" || opchk === "ChkNat") ? "runtime" : "arith"), lexp, rexp, opchk));
            }
            if (!(finaltype.decl instanceof TypedeclTypeDecl)) {
                return new IRBinSubExpression(lexp, rexp, iropttype);
            }
            else {
                const bsubop = new IRBinSubExpression(lexp, rexp, iropttype);
                const needsImmediate = finaltype.decl.allInvariants.length !== 0 || finaltype.decl.optsizerng !== undefined;
                let subop = needsImmediate ? this.makeExpressionImmediate(bsubop, optype) : bsubop;
                if (finaltype.decl.allInvariants.length !== 0) {
                    const invchecks = finaltype.decl.allInvariants.map((invdecl) => {
                        return new IRTypeDeclInvariantCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.tag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), this.processTypeSignature(invdecl.containingtype).tkeystr, invdecl.ii, subop);
                    });
                    this.pushStatements(invchecks);
                }
                if (finaltype.decl.optsizerng !== undefined) {
                    this.pushStatement(new IRTypeDeclNumericRangeCheckStatement(this.currentFile, this.convertSourceInfo(binsub.sinfo), this.registerError(this.currentFile, this.convertSourceInfo(binsub.sinfo), "userspec"), finaltype.decl.optsizerng.min, finaltype.decl.optsizerng.max, subop));
                }
                return new IRConstructSafeTypeDeclExpression(this.processTypeSignature(finaltype), subop);
            }
        }
        else if (ttag === ExpressionTag.BinMultExpression) {
            const binmult = exp;
            const finaltype = this.tproc(binmult.getType());
            const leetype = this.tproc(binmult.lhs.getType());
            const reetype = this.tproc(binmult.rhs.getType());
            let [lexp, rexp] = this.unwrapBinArgs(this.flattenExpression(binmult.lhs), this.flattenExpression(binmult.rhs), leetype, reetype);
            const opchk = binmult.opertype.tkeystr;
            const optype = this.tproc(binmult.opertype);
            const iropttype = this.processTypeSignature(optype);
            if (this.needsMultCheck(opchk)) {
                lexp = this.makeExpressionImmediate(lexp, optype);
                rexp = this.makeExpressionImmediate(rexp, optype);
                this.pushStatement(new IRErrorMultiplicationBoundsCheckStatement(this.currentFile, this.convertSourceInfo(binmult.sinfo), this.registerError(this.currentFile, this.convertSourceInfo(binmult.sinfo), "arith"), lexp, rexp, opchk));
            }
            if (!(finaltype.decl instanceof TypedeclTypeDecl)) {
                return new IRBinMultExpression(lexp, rexp, this.processTypeSignature(binmult.opertype));
            }
            else {
                const bmultop = new IRBinMultExpression(lexp, rexp, iropttype);
                const needsImmediate = finaltype.decl.allInvariants.length !== 0 || finaltype.decl.optsizerng !== undefined;
                let multop = needsImmediate ? this.makeExpressionImmediate(bmultop, optype) : bmultop;
                if (finaltype.decl.allInvariants.length !== 0) {
                    const invchecks = finaltype.decl.allInvariants.map((invdecl) => {
                        return new IRTypeDeclInvariantCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.tag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), this.processTypeSignature(invdecl.containingtype).tkeystr, invdecl.ii, multop);
                    });
                    this.pushStatements(invchecks);
                }
                if (finaltype.decl.optsizerng !== undefined) {
                    this.pushStatement(new IRTypeDeclNumericRangeCheckStatement(this.currentFile, this.convertSourceInfo(binmult.sinfo), this.registerError(this.currentFile, this.convertSourceInfo(binmult.sinfo), "userspec"), finaltype.decl.optsizerng.min, finaltype.decl.optsizerng.max, multop));
                }
                return new IRConstructSafeTypeDeclExpression(this.processTypeSignature(finaltype), multop);
            }
        }
        else if (ttag === ExpressionTag.BinDivExpression) {
            const bindiv = exp;
            const finaltype = this.tproc(bindiv.getType());
            const leetype = this.tproc(bindiv.lhs.getType());
            const reetype = this.tproc(bindiv.rhs.getType());
            let [lexp, rexp] = this.unwrapBinArgs(this.flattenExpression(bindiv.lhs), this.flattenExpression(bindiv.rhs), leetype, reetype);
            const opchk = bindiv.opertype.tkeystr;
            const optype = this.tproc(bindiv.opertype);
            const iropttype = this.processTypeSignature(optype);
            if (this.needsDivCheck(bindiv.rhs, opchk)) {
                lexp = this.makeExpressionImmediate(lexp, optype);
                rexp = this.makeExpressionImmediate(rexp, optype);
                this.pushStatement(new IRErrorDivisionByZeroCheckStatement(this.currentFile, this.convertSourceInfo(bindiv.sinfo), this.registerError(this.currentFile, this.convertSourceInfo(bindiv.sinfo), "runtime"), lexp, rexp, opchk));
            }
            if (!(finaltype.decl instanceof TypedeclTypeDecl)) {
                return new IRBinDivExpression(lexp, rexp, iropttype);
            }
            else {
                const bdivop = new IRBinDivExpression(lexp, rexp, iropttype);
                const needsImmediate = finaltype.decl.allInvariants.length !== 0 || finaltype.decl.optsizerng !== undefined;
                let divop = needsImmediate ? this.makeExpressionImmediate(bdivop, optype) : bdivop;
                if (finaltype.decl.allInvariants.length !== 0) {
                    const invchecks = finaltype.decl.allInvariants.map((invdecl) => {
                        return new IRTypeDeclInvariantCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.tag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), this.processTypeSignature(invdecl.containingtype).tkeystr, invdecl.ii, divop);
                    });
                    this.pushStatements(invchecks);
                }
                if (finaltype.decl.optsizerng !== undefined) {
                    this.pushStatement(new IRTypeDeclNumericRangeCheckStatement(this.currentFile, this.convertSourceInfo(bindiv.sinfo), this.registerError(this.currentFile, this.convertSourceInfo(bindiv.sinfo), "userspec"), finaltype.decl.optsizerng.min, finaltype.decl.optsizerng.max, divop));
                }
                return new IRConstructSafeTypeDeclExpression(this.processTypeSignature(finaltype), divop);
            }
        }
        else if (ttag === ExpressionTag.BinKeyEqExpression) {
            const kkop = exp;
            if (kkop.operkind === "lhsnone") {
                const rhs = this.makeExpressionSimple(this.flattenExpression(kkop.rhs), this.tproc(kkop.rhs.getType()));
                return new IRIsNoneOptionExpression(rhs, this.processTypeSignature(kkop.rhs.getType()));
            }
            else if (kkop.operkind === "rhsnone") {
                const lhs = this.makeExpressionSimple(this.flattenExpression(kkop.lhs), this.tproc(kkop.lhs.getType()));
                return new IRIsNoneOptionExpression(lhs, this.processTypeSignature(kkop.lhs.getType()));
            }
            else if (kkop.operkind === "lhskeyeqoption") {
                const optexp = this.makeExpressionSimple(this.flattenExpression(kkop.lhs), this.tproc(kkop.lhs.getType()));
                const opttype = this.processTypeSignature(kkop.lhs.getType());
                const valexp = this.makeExpressionSimple(this.flattenExpression(kkop.rhs), this.tproc(kkop.rhs.getType()));
                const valuetype = this.processTypeSignature(kkop.rhs.getType());
                return new IRIsOptionEqValueExpression(optexp, opttype, valexp, valuetype);
            }
            else if (kkop.operkind === "rhskeyeqoption") {
                const optexp = this.makeExpressionSimple(this.flattenExpression(kkop.rhs), this.tproc(kkop.rhs.getType()));
                const opttype = this.processTypeSignature(kkop.rhs.getType());
                const valexp = this.makeExpressionSimple(this.flattenExpression(kkop.lhs), this.tproc(kkop.lhs.getType()));
                const valuetype = this.processTypeSignature(kkop.lhs.getType());
                return new IRIsOptionEqValueExpression(optexp, opttype, valexp, valuetype);
            }
            else if (kkop.operkind === "lhskeyeqsome") {
                const someexp = this.makeExpressionSimple(this.flattenExpression(kkop.lhs), this.tproc(kkop.lhs.getType()));
                const sometype = this.processTypeSignature(kkop.lhs.getType());
                const valexp = this.makeExpressionSimple(this.flattenExpression(kkop.rhs), this.tproc(kkop.rhs.getType()));
                const valuetype = this.processTypeSignature(kkop.rhs.getType());
                return new IRIsSomeEqValueExpression(someexp, sometype, valexp, valuetype);
            }
            else if (kkop.operkind === "rhskeyeqsome") {
                const someexp = this.makeExpressionSimple(this.flattenExpression(kkop.rhs), this.tproc(kkop.rhs.getType()));
                const sometype = this.processTypeSignature(kkop.rhs.getType());
                const valexp = this.makeExpressionSimple(this.flattenExpression(kkop.lhs), this.tproc(kkop.lhs.getType()));
                const valuetype = this.processTypeSignature(kkop.lhs.getType());
                return new IRIsSomeEqValueExpression(someexp, sometype, valexp, valuetype);
            }
            else {
                const lhs = this.makeExpressionSimple(this.flattenExpression(kkop.lhs), this.tproc(kkop.lhs.getType()));
                const rhs = this.makeExpressionSimple(this.flattenExpression(kkop.rhs), this.tproc(kkop.rhs.getType()));
                return new IRBinKeyEqDirectExpression(lhs, rhs, this.processTypeSignature(kkop.lhs.getType()));
            }
        }
        else if (ttag === ExpressionTag.BinKeyNeqExpression) {
            const kkop = exp;
            if (kkop.operkind === "lhsnone") {
                const rhs = this.makeExpressionSimple(this.flattenExpression(kkop.rhs), this.tproc(kkop.rhs.getType()));
                return new IRIsNotNoneOptionExpression(rhs, this.processTypeSignature(kkop.rhs.getType()));
            }
            else if (kkop.operkind === "rhsnone") {
                const lhs = this.makeExpressionSimple(this.flattenExpression(kkop.lhs), this.tproc(kkop.lhs.getType()));
                return new IRIsNotNoneOptionExpression(lhs, this.processTypeSignature(kkop.lhs.getType()));
            }
            else if (kkop.operkind === "lhskeyeqoption") {
                const optexp = this.makeExpressionSimple(this.flattenExpression(kkop.lhs), this.tproc(kkop.lhs.getType()));
                const opttype = this.processTypeSignature(kkop.lhs.getType());
                const valexp = this.makeExpressionSimple(this.flattenExpression(kkop.rhs), this.tproc(kkop.rhs.getType()));
                const valuetype = this.processTypeSignature(kkop.rhs.getType());
                return new IRIsOptionNeqValueExpression(optexp, opttype, valexp, valuetype);
            }
            else if (kkop.operkind === "rhskeyeqoption") {
                const optexp = this.makeExpressionSimple(this.flattenExpression(kkop.rhs), this.tproc(kkop.rhs.getType()));
                const opttype = this.processTypeSignature(kkop.rhs.getType());
                const valexp = this.makeExpressionSimple(this.flattenExpression(kkop.lhs), this.tproc(kkop.lhs.getType()));
                const valuetype = this.processTypeSignature(kkop.lhs.getType());
                return new IRIsOptionNeqValueExpression(optexp, opttype, valexp, valuetype);
            }
            else if (kkop.operkind === "lhskeyeqsome") {
                const someexp = this.makeExpressionSimple(this.flattenExpression(kkop.lhs), this.tproc(kkop.lhs.getType()));
                const sometype = this.processTypeSignature(kkop.lhs.getType());
                const valexp = this.makeExpressionSimple(this.flattenExpression(kkop.rhs), this.tproc(kkop.rhs.getType()));
                const valuetype = this.processTypeSignature(kkop.rhs.getType());
                return new IRIsSomeNeqValueExpression(someexp, sometype, valexp, valuetype);
            }
            else if (kkop.operkind === "rhskeyeqsome") {
                const someexp = this.makeExpressionSimple(this.flattenExpression(kkop.rhs), this.tproc(kkop.rhs.getType()));
                const sometype = this.processTypeSignature(kkop.rhs.getType());
                const valexp = this.makeExpressionSimple(this.flattenExpression(kkop.lhs), this.tproc(kkop.lhs.getType()));
                const valuetype = this.processTypeSignature(kkop.lhs.getType());
                return new IRIsSomeNeqValueExpression(someexp, sometype, valexp, valuetype);
            }
            else {
                const lhs = this.makeExpressionSimple(this.flattenExpression(kkop.lhs), this.tproc(kkop.lhs.getType()));
                const rhs = this.makeExpressionSimple(this.flattenExpression(kkop.rhs), this.tproc(kkop.rhs.getType()));
                return new IRBinKeyNeqDirectExpression(lhs, rhs, this.processTypeSignature(kkop.lhs.getType()));
            }
        }
        else if (ttag === ExpressionTag.KeyCompareEqExpression) {
            const kkop = exp;
            const lhs = this.makeExpressionSimple(this.flattenExpression(kkop.lhs), this.tproc(kkop.lhs.getType()));
            const rhs = this.makeExpressionSimple(this.flattenExpression(kkop.rhs), this.tproc(kkop.rhs.getType()));
            return new IRBinKeyEqDirectExpression(lhs, rhs, this.processTypeSignature(kkop.ktype));
        }
        else if (ttag === ExpressionTag.KeyCompareLessExpression) {
            const kklop = exp;
            const lhs = this.makeExpressionSimple(this.flattenExpression(kklop.lhs), this.tproc(kklop.lhs.getType()));
            const rhs = this.makeExpressionSimple(this.flattenExpression(kklop.rhs), this.tproc(kklop.rhs.getType()));
            return new IRBinKeyLessDirectExpression(lhs, rhs, this.processTypeSignature(kklop.ktype));
        }
        else if (ttag === ExpressionTag.NumericEqExpression) {
            const neqexp = exp;
            const leetype = this.tproc(neqexp.lhs.getType());
            const reetype = this.tproc(neqexp.rhs.getType());
            const [lexp, rexp] = this.unwrapBinArgs(this.flattenExpression(neqexp.lhs), this.flattenExpression(neqexp.rhs), leetype, reetype);
            return new IRNumericEqExpression(lexp, rexp, this.processTypeSignature(neqexp.opertype));
        }
        else if (ttag === ExpressionTag.NumericNeqExpression) {
            const nneqexp = exp;
            const leetype = this.tproc(nneqexp.lhs.getType());
            const reetype = this.tproc(nneqexp.rhs.getType());
            const [lexp, rexp] = this.unwrapBinArgs(this.flattenExpression(nneqexp.lhs), this.flattenExpression(nneqexp.rhs), leetype, reetype);
            return new IRNumericNeqExpression(lexp, rexp, this.processTypeSignature(nneqexp.opertype));
        }
        else if (ttag === ExpressionTag.NumericLessExpression) {
            const nless = exp;
            const leetype = this.tproc(nless.lhs.getType());
            const reetype = this.tproc(nless.rhs.getType());
            const [lexp, rexp] = this.unwrapBinArgs(this.flattenExpression(nless.lhs), this.flattenExpression(nless.rhs), leetype, reetype);
            return new IRNumericLessExpression(lexp, rexp, this.processTypeSignature(nless.opertype));
        }
        else if (ttag === ExpressionTag.NumericLessEqExpression) {
            const nlesseq = exp;
            const leetype = this.tproc(nlesseq.lhs.getType());
            const reetype = this.tproc(nlesseq.rhs.getType());
            const [lexp, rexp] = this.unwrapBinArgs(this.flattenExpression(nlesseq.lhs), this.flattenExpression(nlesseq.rhs), leetype, reetype);
            return new IRNumericLessEqExpression(lexp, rexp, this.processTypeSignature(nlesseq.opertype));
        }
        else if (ttag === ExpressionTag.NumericGreaterExpression) {
            const ngreater = exp;
            const leetype = this.tproc(ngreater.lhs.getType());
            const reetype = this.tproc(ngreater.rhs.getType());
            const [lexp, rexp] = this.unwrapBinArgs(this.flattenExpression(ngreater.lhs), this.flattenExpression(ngreater.rhs), leetype, reetype);
            return new IRNumericGreaterExpression(lexp, rexp, this.processTypeSignature(ngreater.opertype));
        }
        else if (ttag === ExpressionTag.NumericGreaterEqExpression) {
            const ngreatereq = exp;
            const leetype = this.tproc(ngreatereq.lhs.getType());
            const reetype = this.tproc(ngreatereq.rhs.getType());
            const [lexp, rexp] = this.unwrapBinArgs(this.flattenExpression(ngreatereq.lhs), this.flattenExpression(ngreatereq.rhs), leetype, reetype);
            return new IRNumericGreaterEqExpression(lexp, rexp, this.processTypeSignature(ngreatereq.opertype));
        }
        else if (ttag === ExpressionTag.LogicAndExpression) {
            const landexp = exp;
            const landargs = landexp.exps.map((argexp) => [this.makeExpressionSimple(this.flattenExpression(argexp), this.tproc(argexp.getType())), this.processTypeSignature(argexp.getType())]);
            if (landargs.some((a) => ASMToIRConverter.isLiteralFalseExpression(a[0]))) {
                //if one arg was a literal bool then the return must also be a bool type (namely false)
                return new IRLiteralBoolExpression(false);
            }
            else {
                let resbool;
                const filteredargs = landargs.filter((a) => !ASMToIRConverter.isLiteralTrueExpression(a[0]));
                if (filteredargs.length === 0) {
                    resbool = new IRLiteralBoolExpression(true); //all args were true
                }
                else if (filteredargs.length === 1) {
                    if (filteredargs[0][1].tkeystr === "Bool") {
                        resbool = filteredargs[0][0];
                    }
                    else {
                        resbool = new IRAccessTypeDeclValueExpression(filteredargs[0][1], filteredargs[0][0]);
                    }
                }
                else {
                    const allexps = filteredargs.map((a) => (a[1].tkeystr !== "Bool") ? new IRAccessTypeDeclValueExpression(a[1], a[0]) : a[0]);
                    resbool = new IRLogicAndExpression(allexps);
                }
                if (this.tproc(exp.getType()).tkeystr === "Bool") {
                    return resbool;
                }
                else {
                    const baliastype = this.tproc(exp.getType());
                    const vtype = baliastype.decl.valuetype;
                    resbool = baliastype.decl.allInvariants.length !== 0 ? this.makeExpressionImmediate(resbool, vtype) : resbool;
                    if (baliastype.decl.allInvariants.length !== 0) {
                        const invchecks = baliastype.decl.allInvariants.map((invdecl) => {
                            return new IRTypeDeclInvariantCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.tag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), this.processTypeSignature(invdecl.containingtype).tkeystr, invdecl.ii, resbool);
                        });
                        this.pushStatements(invchecks);
                    }
                    return new IRConstructSafeTypeDeclExpression(this.processTypeSignature(exp.getType()), resbool);
                }
            }
        }
        else if (ttag === ExpressionTag.LogicOrExpression) {
            const lorexp = exp;
            const lorargs = lorexp.exps.map((argexp) => [this.makeExpressionSimple(this.flattenExpression(argexp), this.tproc(argexp.getType())), this.processTypeSignature(argexp.getType())]);
            if (lorargs.some((a) => ASMToIRConverter.isLiteralTrueExpression(a[0]))) {
                //if one arg was a literal bool then the return must also be a bool type (namely true)
                return new IRLiteralBoolExpression(true);
            }
            else {
                let resbool;
                const filteredargs = lorargs.filter((a) => !ASMToIRConverter.isLiteralFalseExpression(a[0]));
                if (filteredargs.length === 0) {
                    resbool = new IRLiteralBoolExpression(false); //all args were false
                }
                else if (filteredargs.length === 1) {
                    if (filteredargs[0][1].tkeystr === "Bool") {
                        resbool = filteredargs[0][0];
                    }
                    else {
                        resbool = new IRAccessTypeDeclValueExpression(filteredargs[0][1], filteredargs[0][0]);
                    }
                }
                else {
                    const allexps = filteredargs.map((a) => (a[1].tkeystr !== "Bool") ? new IRAccessTypeDeclValueExpression(a[1], a[0]) : a[0]);
                    resbool = new IRLogicOrExpression(allexps);
                }
                if (this.tproc(exp.getType()).tkeystr === "Bool") {
                    return resbool;
                }
                else {
                    const baliastype = this.tproc(exp.getType());
                    const vtype = baliastype.decl.valuetype;
                    resbool = baliastype.decl.allInvariants.length !== 0 ? this.makeExpressionImmediate(resbool, vtype) : resbool;
                    if (baliastype.decl.allInvariants.length !== 0) {
                        const invchecks = baliastype.decl.allInvariants.map((invdecl) => {
                            return new IRTypeDeclInvariantCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.tag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), this.processTypeSignature(invdecl.containingtype).tkeystr, invdecl.ii, resbool);
                        });
                        this.pushStatements(invchecks);
                    }
                    return new IRConstructSafeTypeDeclExpression(this.processTypeSignature(exp.getType()), resbool);
                }
            }
        }
        else if (ttag === ExpressionTag.HoleExpression) {
            assert(false, `ASMToIRConverter: not implemented -- ${exp.tag}`);
        }
        else if (ttag === ExpressionTag.MapEntryConstructorExpression) {
            assert(false, `ASMToIRConverter: not implemented -- ${exp.tag}`);
        }
        else {
            assert(false, `ASMToIRConverter: Unsupported expression type -- ${exp.tag}`);
        }
    }
    flattenRefInvoke(exp) {
        const rtype = this.tproc(exp.getType());
        const rexp = this.flattenExpression(exp.rcvr);
        const mdecl = exp.resolvedMethodDecl;
        const mimpl = exp.resolvedMethodImpl || exp.resolvedMethodDecl;
        const haspreconds = mdecl.preconditions.length > 0;
        const haspostconds = mdecl.postconditions.length > 0;
        const iname = this.currentMonoInvIdMap.get(exp.monoinvid);
        const tmapper = TemplateNameMapper.generateTemplateMappingForTypeDecl(this.tproc(exp.resolvedDeclType));
        const imapper = this.generateLocalTemplateMapping(mimpl.terms.map((t) => t.name), exp.terms);
        const fullmapper = TemplateNameMapper.tryMerge(tmapper, imapper);
        const aargs = [rexp, ...this.flattenInvokeArgs(haspreconds, haspostconds, exp.shuffleinfo, mimpl.params, exp.args, exp.resttype, exp.restinfo, fullmapper)];
        //do preconditions as needed
        for (let i = 0; i < mdecl.preconditions.length; ++i) {
            const invdecl = mdecl.preconditions[i];
            this.pushStatement(new IRPreconditionCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.diagnosticTag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), iname, invdecl.ii, aargs));
        }
        if (!haspostconds) {
            return new IRInvokeSimpleWithImplicitsExpression(iname, aargs, 0, exp.rcvr.srcname, this.processTypeSignature(rtype), "ref");
        }
        else {
            const tmppass = this.generateTempVarName();
            this.pushStatement(new IRTempAssignExpressionStatement(tmppass, aargs[0], this.processTypeSignature(rtype)));
            const tmpres = this.generateTempVarName();
            this.pushStatement(new IRTempAssignRefInvokeStatement(tmpres, this.processTypeSignature(exp.getType()), exp.rcvr.srcname, this.processTypeSignature(rtype), "ref", new IRInvokeSimpleWithImplicitsExpression(iname, aargs, 0, exp.rcvr.srcname, this.processTypeSignature(rtype), "ref")));
            //do postconditions as needed
            const postargs = [new IRAccessTempVariableExpression(tmpres), new IRAccessTempVariableExpression(tmppass), ...aargs];
            for (let i = 0; i < mdecl.postconditions.length; ++i) {
                const invdecl = mdecl.postconditions[i];
                this.pushStatement(new IRPostconditionCheckStatement(invdecl.file, this.convertSourceInfo(invdecl.sinfo), invdecl.diagnosticTag, this.registerError(invdecl.file, this.convertSourceInfo(invdecl.sinfo), "userspec"), iname, invdecl.ii, postargs));
            }
            return new IRAccessTempVariableExpression(tmpres);
        }
    }
    flattenCallRefVariableExpression(exp) {
        return this.flattenRefInvoke(exp);
    }
    flattenCallRefThisExpression(exp) {
        return this.flattenRefInvoke(exp);
    }
    flattenCallRefSelfExpression(exp) {
        assert(false, "Not Implemented -- checkCallRefSelfExpression");
    }
    flattenCallTaskActionExpression(exp) {
        assert(false, "Not Implemented -- checkCallTaskActionExpression");
    }
    flattenTaskRunExpression(exp) {
        assert(false, "Not Implemented -- instantiateTaskRunExpression");
    }
    flattenTaskMultiExpression(exp) {
        assert(false, "Not Implemented -- instantiateTaskMultiExpression");
    }
    flattenTaskDashExpression(exp) {
        assert(false, "Not Implemented -- instantiateTaskDashExpression");
    }
    flattenTaskAllExpression(exp) {
        assert(false, "Not Implemented -- instantiateTaskAllExpression");
    }
    flattenTaskRaceExpression(exp) {
        assert(false, "Not Implemented -- instantiateTaskRaceExpression");
    }
    flattenAPIInvokeExpression(exp) {
        assert(false, "Not Implemented");
    }
    flattenAgentInvokeExpression(exp) {
        assert(false, "Not Implemented");
    }
    flattenChkLogicExpression(exp) {
        if (exp.tag === ChkLogicExpressionTag.ChkLogicBaseExpression) {
            const cle = exp;
            return this.coerceToBoolForTest(this.makeExpressionSimple(this.flattenExpression(cle.exp), this.tproc(cle.exp.getType())), this.tproc(cle.exp.getType()));
        }
        else {
            const iiexp = exp;
            const renv = this.flattenITestGuardSet(iiexp.sinfo, iiexp.lhs);
            if (iiexp.bbinds.length === 0) {
                if (ASMToIRConverter.isLiteralFalseExpression(renv[0])) {
                    return new IRLiteralBoolExpression(true);
                }
                else {
                    this.pushStatementBlock();
                    const rhs = this.coerceToBoolForTest(this.makeExpressionSimple(this.flattenExpression(iiexp.rhs), this.tproc(iiexp.rhs.getType())), this.tproc(iiexp.rhs.getType()));
                    const stmts = this.popStatementBlock();
                    if (stmts.length === 0) {
                        //no statements generated, so just return a simple expression directly
                        return new IRLogicOrExpression([new IRPrefixNotOpExpression(renv[0], this.getSpecialType("Bool")), rhs]);
                    }
                    else {
                        if (ASMToIRConverter.isLiteralTrueExpression(renv[0])) {
                            stmts.forEach((s) => this.pushStatement(s));
                            return rhs;
                        }
                        else {
                            const tvar = this.generateTempVarName();
                            this.pushStatement(new IRChkLogicImpliesShortCircuitStatement(tvar, renv[0], stmts, rhs));
                            return new IRAccessTempVariableExpression(tvar);
                        }
                    }
                }
            }
            else {
                assert(false, "Not implemented -- ChkLogicImpliesExpression with binders");
            }
        }
    }
    flattenConditionalValueExpression(exp) {
        const renv = this.flattenITestGuardSet(exp.sinfo, exp.guardset);
        if (exp.bbinds.length === 0) {
            if (ASMToIRConverter.isLiteralTrueExpression(renv[0])) {
                return this.makeExpressionSimple(this.flattenExpression(exp.trueValue), this.tproc(exp.trueValue.getType()));
            }
            else if (ASMToIRConverter.isLiteralFalseExpression(renv[0])) {
                return this.makeExpressionSimple(this.flattenExpression(exp.falseValue), this.tproc(exp.falseValue.getType()));
            }
            else {
                this.pushStatementBlock();
                const texp = this.makeCoercionExplicitAsNeeded(this.makeExpressionSimple(this.flattenExpression(exp.trueValue), this.tproc(exp.trueValue.getType())), this.tproc(exp.trueValue.getType()), exp.rtype);
                const fstmts = this.popStatementBlock();
                this.pushStatementBlock();
                const fexp = this.makeCoercionExplicitAsNeeded(this.makeExpressionSimple(this.flattenExpression(exp.falseValue), this.tproc(exp.falseValue.getType())), this.tproc(exp.falseValue.getType()), exp.rtype);
                const tstmts = this.popStatementBlock();
                if (tstmts.length === 0 && fstmts.length === 0) {
                    //no statements generated, so just return a simple expression directly
                    return new IRLogicSimpleConditionalExpression(renv[0], texp, fexp);
                }
                else {
                    const tvar = this.generateTempVarName();
                    const cbs = new IRLogicConditionalStatement(tvar, this.processTypeSignature(exp.rtype), renv[0], tstmts, texp, fstmts, fexp);
                    this.pushStatement(cbs);
                    return new IRAccessTempVariableExpression(tvar);
                }
            }
        }
        else {
            assert(false, "Not implemented -- ConditionalValueExpression with binders");
        }
    }
    flattenBaseRValueExpression(exp) {
        const ttag = exp.tag;
        switch (ttag) {
            case ExpressionTag.CallRefVariableExpression: {
                return this.flattenCallRefVariableExpression(exp);
            }
            case ExpressionTag.CallRefThisExpression: {
                return this.flattenCallRefThisExpression(exp);
            }
            case ExpressionTag.CallRefSelfExpression: {
                return this.flattenCallRefSelfExpression(exp);
            }
            case ExpressionTag.CallTaskActionExpression: {
                return this.flattenCallTaskActionExpression(exp);
            }
            case ExpressionTag.TaskRunExpression: {
                return this.flattenTaskRunExpression(exp);
            }
            case ExpressionTag.TaskMultiExpression: {
                return this.flattenTaskMultiExpression(exp);
            }
            case ExpressionTag.TaskDashExpression: {
                return this.flattenTaskDashExpression(exp);
            }
            case ExpressionTag.TaskAllExpression: {
                return this.flattenTaskAllExpression(exp);
            }
            case ExpressionTag.TaskRaceExpression: {
                return this.flattenTaskRaceExpression(exp);
            }
            case ExpressionTag.APIInvokeExpression: {
                return this.flattenAPIInvokeExpression(exp);
            }
            case ExpressionTag.AgentInvokeExpression: {
                return this.flattenAgentInvokeExpression(exp);
            }
            default: {
                return this.flattenExpression(exp);
            }
        }
    }
    flattenExpressionRHS(exp) {
        const ttag = exp.tag;
        if (ttag === RValueExpressionTag.BaseExpression) {
            return this.flattenBaseRValueExpression(exp.exp);
        }
        else if (ttag === RValueExpressionTag.ShortCircuitAssignRHSExpressionFail) {
            assert(false, "Not Implemented -- checkShortCircuitAssignRHSFailExpression");
        }
        else if (ttag === RValueExpressionTag.ShortCircuitAssignRHSExpressionReturn) {
            assert(false, "Not Implemented -- checkShortCircuitAssignRHSReturnExpression");
        }
        else if (ttag === RValueExpressionTag.ConditionalValueExpression) {
            return this.flattenConditionalValueExpression(exp);
        }
        else {
            assert(false, "Unknown RValueExpression kind");
        }
    }
    flattenEmptyStatement(stmt) {
        this.pushStatement(new IRNopStatement());
    }
    flattenVariableDeclarationStatement(stmt) {
        this.pushStatement(new IRVariableDeclarationStatement(this.processLocalVariableName(stmt.name), this.processTypeSignature(stmt.vtype)));
    }
    flattenVariableMultiDeclarationStatement(stmt) {
        for (let i = 0; i < stmt.decls.length; ++i) {
            const vdecl = stmt.decls[i];
            this.pushStatement(new IRVariableDeclarationStatement(this.processLocalVariableName(vdecl.name), this.processTypeSignature(vdecl.vtype)));
        }
    }
    flattenVariableInitializationStatement(stmt) {
        const irval = this.flattenExpressionRHS(stmt.exp);
        const irvtype = this.processTypeSignature(stmt.actualtype);
        if (irval instanceof IRSimpleExpression) {
            const iconv = this.makeCoercionExplicitAsNeeded(irval, stmt.exp.rtype, stmt.actualtype);
            this.pushStatement(new IRVariableInitializationStatement(this.processLocalVariableName(stmt.name), irvtype, iconv, stmt.vkind === "let"));
        }
        else if (irval instanceof IRInvokeDirectExpression) {
            if (irvtype.tkeystr === stmt.exp.rtype.tkeystr) {
                this.pushStatement(new IRVariableInitializationDirectInvokeStatement(this.generateTempVarName(), this.processLocalVariableName(stmt.name), irvtype, irval, stmt.vkind === "let"));
            }
            else {
                const iiexp = this.makeCoercionExplicitAsNeeded(this.makeExpressionSimple(irval, stmt.exp.rtype), stmt.exp.rtype, stmt.actualtype);
                this.pushStatement(new IRVariableInitializationStatement(this.processLocalVariableName(stmt.name), irvtype, iiexp, stmt.vkind === "let"));
            }
        }
        else if (irval instanceof IRInvokeImplicitsExpression) {
            if (irvtype.tkeystr === stmt.exp.rtype.tkeystr) {
                this.pushStatement(new IRVariableInitializationDirectInvokeWithImplicitStatement(this.generateTempVarName(), this.processLocalVariableName(stmt.name), irvtype, irval, stmt.vkind === "let"));
            }
            else {
                const iiexp = this.makeCoercionExplicitAsNeeded(this.makeExpressionSimple(irval, stmt.exp.rtype), stmt.exp.rtype, stmt.actualtype);
                this.pushStatement(new IRVariableInitializationStatement(this.processLocalVariableName(stmt.name), irvtype, iiexp, stmt.vkind === "let"));
            }
        }
        else if (irval instanceof IRConstructExpression) {
            if (irvtype.tkeystr === stmt.exp.rtype.tkeystr) {
                this.pushStatement(new IRVariableInitializationDirectConstructorStatement(this.processLocalVariableName(stmt.name), irvtype, irval, stmt.vkind === "let"));
            }
            else {
                this.pushStatement(new IRVariableInitializationDirectConstructorWithBoxStatement(this.processLocalVariableName(stmt.name), irvtype, this.processTypeSignature(stmt.exp.rtype), irval, stmt.vkind === "let"));
            }
        }
        else {
            assert(false, "ASMToIRConverter not implemented: VariableInitializationStatement case not implemented");
        }
    }
    flattenVariableMultiInitializationStatement(stmt) {
        assert(false, "Not Implemented -- flattenVariableMultiInitializationStatement");
    }
    flattenVariableAssignmentStatement(stmt) {
        const irval = this.flattenExpressionRHS(stmt.exp);
        if (stmt.name === "_") {
            ; //just drop the expression value
        }
        else {
            const irvtype = this.processTypeSignature(stmt.vtype);
            if (irval instanceof IRSimpleExpression) {
                const iconv = this.makeCoercionExplicitAsNeeded(irval, stmt.exp.rtype, stmt.vtype);
                this.pushStatement(new IRVariableAssignmentStatement(this.processLocalVariableName(stmt.name), irvtype, iconv));
            }
            else if (irval instanceof IRInvokeDirectExpression) {
                if (irvtype.tkeystr === stmt.exp.rtype.tkeystr) {
                    this.pushStatement(new IRVariableAssignmentDirectInvokeStatement(this.generateTempVarName(), this.processLocalVariableName(stmt.name), irvtype, irval));
                }
                else {
                    const iiexp = this.makeCoercionExplicitAsNeeded(this.makeExpressionSimple(irval, stmt.exp.rtype), stmt.exp.rtype, stmt.vtype);
                    this.pushStatement(new IRVariableAssignmentStatement(this.processLocalVariableName(stmt.name), irvtype, iiexp));
                }
            }
            else if (irval instanceof IRInvokeImplicitsExpression) {
                if (irvtype.tkeystr === stmt.exp.rtype.tkeystr) {
                    this.pushStatement(new IRVariableAssignmentDirectInvokeWithImplicitStatement(this.generateTempVarName(), this.processLocalVariableName(stmt.name), irvtype, irval));
                }
                else {
                    const iiexp = this.makeCoercionExplicitAsNeeded(this.makeExpressionSimple(irval, stmt.exp.rtype), stmt.exp.rtype, stmt.vtype);
                    this.pushStatement(new IRVariableAssignmentStatement(this.processLocalVariableName(stmt.name), irvtype, iiexp));
                }
            }
            else if (irval instanceof IRConstructExpression) {
                if (irvtype.tkeystr === stmt.exp.rtype.tkeystr) {
                    this.pushStatement(new IRVariableAssignmentDirectConstructorStatement(this.processLocalVariableName(stmt.name), irvtype, irval));
                }
                else {
                    this.pushStatement(new IRVariableAssignmentDirectConstructorWithBoxStatement(this.processLocalVariableName(stmt.name), irvtype, this.processTypeSignature(stmt.exp.rtype), irval));
                }
            }
            else {
                assert(false, "ASMToIRConverter not implemented: VariableAssignmentStatement case not implemented");
            }
        }
    }
    flattenVariableMultiAssignmentStatement(stmt) {
        assert(false, "Not Implemented -- flattenVariableMultiAssignmentStatement");
    }
    flattenReturnVoidStatement(stmt) {
        if (this.currentImplicitReturnVar === undefined) {
            this.pushStatement(new IRReturnVoidSimpleStatement());
        }
        else {
            this.pushStatement(new IRReturnVoidWithImplicitStatement(this.currentImplicitReturnVar));
        }
    }
    flattenReturnSingleStatement(stmt) {
        let irval = this.flattenExpressionRHS(stmt.value);
        if (this.currentImplicitReturnVar === undefined) {
            if (irval instanceof IRSimpleExpression) {
                const frval = this.makeCoercionExplicitAsNeeded(irval, stmt.value.rtype, this.currentReturnType);
                this.pushStatement(new IRReturnValueSimpleStatement(frval));
            }
            else if (irval instanceof IRInvokeDirectExpression) {
                if (stmt.value.rtype.tkeystr === this.currentReturnType.tkeystr) {
                    this.pushStatement(new IRReturnDirectInvokeStatement(irval));
                }
                else {
                    const sexp = this.makeExpressionSimple(irval, stmt.value.rtype);
                    const frval = this.makeCoercionExplicitAsNeeded(sexp, stmt.value.rtype, this.currentReturnType);
                    this.pushStatement(new IRReturnValueSimpleStatement(frval));
                }
            }
            else if (irval instanceof IRInvokeImplicitsExpression) {
                const sexp = this.makeExpressionSimple(irval, stmt.value.rtype);
                const frval = this.makeCoercionExplicitAsNeeded(sexp, stmt.value.rtype, this.currentReturnType);
                this.pushStatement(new IRReturnValueSimpleStatement(frval));
            }
            else if (irval instanceof IRConstructExpression) {
                if (stmt.value.rtype.tkeystr === this.currentReturnType.tkeystr) {
                    this.pushStatement(new IRReturnDirectConstructStatement(irval));
                }
                else {
                    this.pushStatement(new IRReturnDirectConstructWithBoxStatement(irval, this.processTypeSignature(stmt.value.rtype), this.processTypeSignature(this.currentReturnType)));
                }
            }
            else {
                assert(false, "ASMToIRConverter not implemented: unknown ReturnSingleStatement variant");
            }
        }
        else {
            if (irval instanceof IRSimpleExpression) {
                const frval = this.makeCoercionExplicitAsNeeded(irval, stmt.value.rtype, this.currentReturnType);
                this.pushStatement(new IRReturnValueImplicitStatement(frval, this.currentImplicitReturnVar));
            }
            else if (irval instanceof IRInvokeDirectExpression) {
                if (stmt.value.rtype.tkeystr === this.currentReturnType.tkeystr) {
                    this.pushStatement(new IRReturnDirectInvokeImplicitStatement(irval, this.currentImplicitReturnVar));
                }
                else {
                    const sexp = this.makeExpressionSimple(irval, stmt.value.rtype);
                    const frval = this.makeCoercionExplicitAsNeeded(sexp, stmt.value.rtype, this.currentReturnType);
                    this.pushStatement(new IRReturnValueImplicitStatement(frval, this.currentImplicitReturnVar));
                }
            }
            else if (irval instanceof IRInvokeImplicitsExpression) {
                if ((stmt.value.rtype.tkeystr === this.currentReturnType.tkeystr) && (irval.ivar === this.currentImplicitReturnVar)) {
                    this.pushStatement(new IRReturnDirectInvokeImplicitPassThroughStatement(irval, this.currentImplicitReturnVar));
                }
                else {
                    const sexp = this.makeExpressionSimple(irval, stmt.value.rtype);
                    const frval = this.makeCoercionExplicitAsNeeded(sexp, stmt.value.rtype, this.currentReturnType);
                    this.pushStatement(new IRReturnValueImplicitStatement(frval, this.currentImplicitReturnVar));
                }
            }
            else if (irval instanceof IRConstructExpression) {
                if (stmt.value.rtype.tkeystr === this.currentReturnType.tkeystr) {
                    this.pushStatement(new IRReturnDirectConstructImplicitStatement(irval, this.currentImplicitReturnVar));
                }
                else {
                    this.pushStatement(new IRReturnDirectConstructWithBoxImplicitStatement(irval, this.processTypeSignature(stmt.value.rtype), this.processTypeSignature(this.currentReturnType), this.currentImplicitReturnVar));
                }
            }
            else {
                assert(false, "ASMToIRConverter not implemented: unknown ReturnSingleStatement with refs variant");
            }
        }
    }
    flattenReturnMultiStatement(stmt) {
        assert(false, "Not Implemented -- flattenReturnMultiStatement");
    }
    flattenIfStatement(stmt) {
        const [texp, ginfos] = this.flattenITestGuardSet(stmt.sinfo, stmt.cond);
        if (stmt.bbinds.length === 0) {
            if (ASMToIRConverter.isLiteralTrueExpression(texp)) {
                return this.flattenBlockStatement(stmt.trueBlock) || stmt.trueBlock.isterminal;
            }
            else if (ASMToIRConverter.isLiteralFalseExpression(texp)) {
                return false;
            }
            else {
                this.pushStatementBlock();
                this.flattenBlockStatement(stmt.trueBlock);
                const tblock = this.popStatementBlock();
                this.pushStatement(new IRSimpleIfStatement(texp, new IRBlockStatement(tblock)));
                return false;
            }
        }
        else {
            let bindstmts = [];
            if (!ASMToIRConverter.isLiteralFalseExpression(texp)) {
                for (let i = 0; i < ginfos.length; ++i) {
                    const bvar = this.processLocalVariableName(stmt.bbinds[i].bname);
                    const btype = stmt.bbinds[i].ttrue;
                    const [tconv, _] = this.processITestAsConvertFlow(this.tproc(ginfos[i].srctype), ginfos[i].ee, ginfos[i].itest, this.tproc(btype), undefined);
                    bindstmts.push(new IRVariableInitializationStatement(bvar, this.processTypeSignature(btype), tconv, true));
                }
            }
            if (ASMToIRConverter.isLiteralTrueExpression(texp)) {
                this.pushStatements(bindstmts);
                return this.flattenBlockStatement(stmt.trueBlock) || stmt.trueBlock.isterminal;
            }
            else if (ASMToIRConverter.isLiteralFalseExpression(texp)) {
                return false;
            }
            else {
                this.pushStatementBlock();
                this.pushStatements(bindstmts);
                this.flattenBlockStatement(stmt.trueBlock);
                const tblock = this.popStatementBlock();
                this.pushStatement(new IRSimpleIfStatement(texp, new IRBlockStatement(tblock)));
                return false;
            }
        }
    }
    flattenIfElseStatement(stmt) {
        const [texp, ginfos] = this.flattenITestGuardSet(stmt.sinfo, stmt.cond);
        if (stmt.bbinds.length === 0) {
            if (ASMToIRConverter.isLiteralTrueExpression(texp)) {
                return this.flattenBlockStatement(stmt.trueBlock) || stmt.trueBlock.isterminal;
            }
            else if (ASMToIRConverter.isLiteralFalseExpression(texp)) {
                return this.flattenBlockStatement(stmt.falseBlock) || stmt.falseBlock.isterminal;
            }
            else {
                this.pushStatementBlock();
                const ttrue = this.flattenBlockStatement(stmt.trueBlock);
                const tblock = this.popStatementBlock();
                this.pushStatementBlock();
                const tfalse = this.flattenBlockStatement(stmt.falseBlock);
                const fblock = this.popStatementBlock();
                this.pushStatement(new IRSimpleIfElseStatement(texp, new IRBlockStatement(tblock), new IRBlockStatement(fblock)));
                return (ttrue || stmt.trueBlock.isterminal) && (tfalse || stmt.falseBlock.isterminal);
            }
        }
        else {
            let bindstmtstt = [];
            let bindstmtsff = [];
            if (!ASMToIRConverter.isLiteralTrueExpression(texp) && !ASMToIRConverter.isLiteralFalseExpression(texp)) {
                for (let i = 0; i < ginfos.length; ++i) {
                    const bvar = this.processLocalVariableName(stmt.bbinds[i].bname);
                    const ttype = !ASMToIRConverter.isLiteralFalseExpression(texp) ? this.tproc(stmt.bbinds[i].ttrue) : undefined;
                    const ftype = !ASMToIRConverter.isLiteralTrueExpression(texp) ? this.tproc(stmt.bbinds[i].tfalse) : undefined;
                    const [tbind, fbind] = this.processITestAsConvertFlow(this.tproc(ginfos[i].srctype), ginfos[i].ee, ginfos[i].itest, ttype, ftype);
                    if (tbind !== undefined) {
                        bindstmtstt.push(new IRVariableInitializationStatement(bvar, this.processTypeSignature(ttype), tbind, true));
                    }
                    if (fbind !== undefined) {
                        bindstmtsff.push(new IRVariableInitializationStatement(bvar, this.processTypeSignature(ftype), fbind, true));
                    }
                }
            }
            if (ASMToIRConverter.isLiteralTrueExpression(texp)) {
                this.pushStatements(bindstmtstt);
                return this.flattenBlockStatement(stmt.trueBlock) || stmt.trueBlock.isterminal;
            }
            else if (ASMToIRConverter.isLiteralFalseExpression(texp)) {
                this.pushStatements(bindstmtsff);
                return this.flattenBlockStatement(stmt.falseBlock) || stmt.falseBlock.isterminal;
            }
            else {
                this.pushStatementBlock();
                this.pushStatements(bindstmtstt);
                const ttrue = this.flattenBlockStatement(stmt.trueBlock);
                const tblock = this.popStatementBlock();
                this.pushStatementBlock();
                this.pushStatements(bindstmtsff);
                const tfalse = this.flattenBlockStatement(stmt.falseBlock);
                const fblock = this.popStatementBlock();
                this.pushStatement(new IRSimpleIfElseStatement(texp, new IRBlockStatement(tblock), new IRBlockStatement(fblock)));
                return (ttrue || stmt.trueBlock.isterminal) && (tfalse || stmt.falseBlock.isterminal);
            }
        }
    }
    flattenIfElifElseStatementHelper(condflow, elseflow) {
        if (condflow.length === 0) {
            return this.flattenBlockStatement(elseflow) || elseflow.isterminal;
        }
        const cc = condflow[0].cond;
        const bb = condflow[0].block;
        const texp = this.makeExpressionSimple(this.flattenExpression(cc), this.tproc(cc.getType()));
        if (ASMToIRConverter.isLiteralTrueExpression(texp)) {
            return this.flattenBlockStatement(bb) || bb.isterminal;
        }
        else if (ASMToIRConverter.isLiteralFalseExpression(texp)) {
            return this.flattenIfElifElseStatementHelper(condflow.slice(1), elseflow);
        }
        else {
            this.pushStatementBlock();
            const tblock = this.flattenBlockStatement(bb);
            const block = this.popStatementBlock();
            this.pushStatementBlock();
            const rterm = this.flattenIfElifElseStatementHelper(condflow.slice(1), elseflow);
            const fblock = this.popStatementBlock();
            this.pushStatement(new IRSimpleIfElseStatement(texp, new IRBlockStatement(block), new IRBlockStatement(fblock)));
            return (tblock || bb.isterminal) && rterm;
        }
    }
    flattenIfElifElseStatement(stmt) {
        return this.flattenIfElifElseStatementHelper(stmt.condflow, stmt.elseflow);
    }
    flattenSwitchStatement(stmt) {
        assert(false, "Not Implemented -- flattenSwitchStatement");
    }
    flattenMatchStatement(stmt) {
        const sval = this.makeExpressionImmediate(this.flattenExpression(stmt.sval), this.tproc(stmt.sval.getType()));
        const svaltype = this.processTypeSignature(stmt.sval.getType());
        const implicitfinal = this.processTypeSignature(stmt.implicitFinalType || stmt.sval.getType());
        //We need to do some cleanup in the case of template instantiation simplifying something -- making a case always true/false
        let ccflows = stmt.matchflow.map((mf) => {
            if (mf.mtype === undefined) {
                return mf;
            }
            //This assumes that no ops are added to the statment block during flattening -- if that happens then this needs to be cleaned up or a flag set to prevent that from happening
            const top = this.processITestCond_Type(this.tproc(stmt.sval.getType()), sval, this.tproc(mf.mtype), false, false);
            if (!(top instanceof IRLiteralBoolExpression)) {
                return mf;
            }
            else {
                if (top.value) {
                    return { mtype: undefined, value: mf.value };
                }
                else {
                    return undefined; //this case is always false, so remove it from the match
                }
            }
        })
            .filter((mf) => mf !== undefined);
        const lidx = ccflows.findIndex((f) => f.mtype === undefined);
        if (lidx !== -1 && lidx !== ccflows.length - 1) {
            ccflows = ccflows.slice(0, lidx);
        }
        const flows = ccflows.map((mf) => {
            const mtype = mf.mtype !== undefined ? this.processTypeSignature(mf.mtype) : undefined;
            const bvar = this.processLocalVariableName(stmt.bindervar);
            const ttype = mf.mtype || stmt.implicitFinalType || stmt.sval.getType();
            const bexp = this.processITestConvert_SafeType(this.tproc(stmt.sval.getType()), sval, this.tproc(ttype));
            const bstmt = new IRVariableInitializationStatement(bvar, this.processTypeSignature(ttype), bexp, true);
            this.pushStatementBlock();
            this.pushStatement(bstmt);
            this.flattenBlockStatement(mf.value);
            const stmts = this.popStatementBlock();
            return { mtype: mtype, value: new IRBlockStatement(stmts) };
        });
        if (!stmt.mustExhaustive) {
            flows.push({ mtype: undefined, value: new IRBlockStatement([new IRErrorExhaustiveStatement(this.currentFile, this.convertSourceInfo(stmt.sinfo), this.registerError(this.currentFile, this.convertSourceInfo(stmt.sinfo), "runtime"))]) });
        }
        const allexact = stmt.matchflow.every((f) => {
            if (f.mtype === undefined) {
                return true;
            }
            const mmtype = this.tproc(f.mtype);
            return (mmtype instanceof NominalTypeSignature) && (mmtype.decl instanceof AbstractEntityTypeDecl);
        });
        if (!allexact) {
            this.pushStatement(new IRMatchGeneralStatement(sval, svaltype, stmt.bindervar, flows, implicitfinal));
        }
        else {
            const svtype = this.tproc(stmt.sval.getType());
            if ((svtype instanceof NominalTypeSignature) && (svtype.decl instanceof AbstractConceptTypeDecl)) {
                this.pushStatement(new IRMatchExactStatement(sval, svaltype, stmt.bindervar, flows, implicitfinal));
            }
            else {
                const eflow = stmt.matchflow.findIndex((f) => f.mtype === undefined || svtype.tkeystr === this.tproc(f.mtype).tkeystr);
                this.pushStatement(flows[eflow].value);
            }
        }
        return stmt.matchflow.every((mf) => mf.value.isterminal);
    }
    flattenDispatchPatternStatement(stmt) {
        assert(false, "Not Implemented -- flattenDispatchPatternStatement");
    }
    flattenDispatchTaskStatement(stmt) {
        assert(false, "Not Implemented -- flattenDispatchTaskStatement");
    }
    flattenAbortStatement(stmt) {
        this.pushStatement(new IRAbortStatement(this.currentFile, this.convertSourceInfo(stmt.sinfo), undefined, this.registerError(this.currentFile, this.convertSourceInfo(stmt.sinfo), "userspec")));
    }
    flattenAssertStatement(stmt) {
        const ircond = this.flattenChkLogicExpression(stmt.cond);
        if (ASMToIRConverter.isLiteralTrueExpression(ircond)) {
            ; //no-op
        }
        else {
            this.pushStatement(new IRAssertStatement(this.currentFile, this.convertSourceInfo(stmt.sinfo), undefined, this.registerError(this.currentFile, this.convertSourceInfo(stmt.sinfo), "userspec"), ircond));
        }
    }
    flattenValidateStatement(stmt) {
        const ircond = this.flattenChkLogicExpression(stmt.cond);
        if (ASMToIRConverter.isLiteralTrueExpression(ircond)) {
            ; //no-op
        }
        else {
            this.pushStatement(new IRValidateStatement(this.currentFile, this.convertSourceInfo(stmt.sinfo), stmt.diagnosticTag, this.registerError(this.currentFile, this.convertSourceInfo(stmt.sinfo), "userspec"), ircond));
        }
    }
    flattenDebugStatement(stmt) {
        const irval = this.makeExpressionSimple(this.flattenExpression(stmt.value), this.tproc(stmt.value.getType()));
        const irtype = this.processTypeSignature(stmt.value.getType());
        this.pushStatement(new IRDebugStatement(irtype, irval, this.currentFile, this.convertSourceInfo(stmt.sinfo)));
    }
    flattenVoidRefCallStatement(stmt) {
        if (stmt.exp instanceof CallNamespaceFunctionExpression) {
            const iiv = this.flattenExpression(stmt.exp);
            this.pushStatement(new IRVoidInvokeStatement(this.generateTempVarName(), iiv));
        }
        else {
            assert(false, "Not Implemented -- flattenVoidRefCallStatement for other calls");
        }
    }
    flattenVarUpdateStatement(stmt) {
        assert(false, "Not Implemented -- flattenVarUpdateStatement");
    }
    flattenThisUpdateStatement(stmt) {
        assert(false, "Not Implemented -- flattenThisUpdateStatement");
    }
    flattenSelfUpdateStatement(stmt) {
        assert(false, "Not Implemented -- flattenSelfUpdateStatement");
    }
    flattenHoleStatement(stmt) {
        assert(false, "Not Implemented -- flattenHoleStatement");
    }
    flattenTaskStatusStatement(stmt) {
        assert(false, "Not Implemented -- flattenTaskStatusStatement");
    }
    flattenTaskCheckAndHandleTerminationStatement(stmt) {
        assert(false, "Not Implemented -- flattenTaskCheckAndHandleTerminationStatement");
    }
    flattenTaskYieldStatement(stmt) {
        assert(false, "Not Implemented -- flattenTaskYieldStatement");
    }
    flattenBlockStatement(stmt) {
        for (let i = 0; i < stmt.statements.length; ++i) {
            const earlyterm = this.flattenStatement(stmt.statements[i]);
            if (earlyterm) {
                return true;
            }
        }
        return false;
    }
    flattenStatement(stmt) {
        let terminal = false;
        switch (stmt.tag) {
            case StatementTag.EmptyStatement: {
                this.flattenEmptyStatement(stmt);
                break;
            }
            case StatementTag.VariableDeclarationStatement: {
                this.flattenVariableDeclarationStatement(stmt);
                break;
            }
            case StatementTag.VariableMultiDeclarationStatement: {
                this.flattenVariableMultiDeclarationStatement(stmt);
                break;
            }
            case StatementTag.VariableInitializationStatement: {
                this.flattenVariableInitializationStatement(stmt);
                break;
            }
            case StatementTag.VariableMultiInitializationStatement: {
                this.flattenVariableMultiInitializationStatement(stmt);
                break;
            }
            case StatementTag.VariableAssignmentStatement: {
                this.flattenVariableAssignmentStatement(stmt);
                break;
            }
            case StatementTag.VariableMultiAssignmentStatement: {
                this.flattenVariableMultiAssignmentStatement(stmt);
                break;
            }
            case StatementTag.ReturnVoidStatement: {
                this.flattenReturnVoidStatement(stmt);
                break;
            }
            case StatementTag.ReturnSingleStatement: {
                this.flattenReturnSingleStatement(stmt);
                break;
            }
            case StatementTag.ReturnMultiStatement: {
                this.flattenReturnMultiStatement(stmt);
                break;
            }
            case StatementTag.IfStatement: {
                terminal = this.flattenIfStatement(stmt);
                break;
            }
            case StatementTag.IfElseStatement: {
                terminal = this.flattenIfElseStatement(stmt);
                break;
            }
            case StatementTag.IfElifElseStatement: {
                terminal = this.flattenIfElifElseStatement(stmt);
                break;
            }
            case StatementTag.SwitchStatement: {
                terminal = this.flattenSwitchStatement(stmt);
                break;
            }
            case StatementTag.MatchStatement: {
                terminal = this.flattenMatchStatement(stmt);
                break;
            }
            case StatementTag.DispatchPatternStatement: {
                terminal = this.flattenDispatchPatternStatement(stmt);
                break;
            }
            case StatementTag.DispatchTaskStatement: {
                terminal = this.flattenDispatchTaskStatement(stmt);
                break;
            }
            case StatementTag.AbortStatement: {
                this.flattenAbortStatement(stmt);
                break;
            }
            case StatementTag.AssertStatement: {
                this.flattenAssertStatement(stmt);
                break;
            }
            case StatementTag.ValidateStatement: {
                this.flattenValidateStatement(stmt);
                break;
            }
            case StatementTag.DebugStatement: {
                this.flattenDebugStatement(stmt);
                break;
            }
            case StatementTag.VoidRefCallStatement: {
                this.flattenVoidRefCallStatement(stmt);
                break;
            }
            case StatementTag.VarUpdateStatement: {
                this.flattenVarUpdateStatement(stmt);
                break;
            }
            case StatementTag.ThisUpdateStatement: {
                this.flattenThisUpdateStatement(stmt);
                break;
            }
            case StatementTag.SelfUpdateStatement: {
                this.flattenSelfUpdateStatement(stmt);
                break;
            }
            case StatementTag.HoleStatement: {
                this.flattenHoleStatement(stmt);
                break;
            }
            case StatementTag.TaskStatusStatement: {
                this.flattenTaskStatusStatement(stmt);
                break;
            }
            case StatementTag.TaskCheckAndHandleTerminationStatement: {
                this.flattenTaskCheckAndHandleTerminationStatement(stmt);
                break;
            }
            case StatementTag.TaskYieldStatement: {
                this.flattenTaskYieldStatement(stmt);
                break;
            }
            case StatementTag.BlockStatement: {
                this.flattenBlockStatement(stmt);
                break;
            }
            default: {
                assert(false, `Unknown statement kind -- ${stmt.tag}`);
            }
        }
        return terminal;
    }
    processBody(body, bitbinds) {
        if (body instanceof BuiltinBodyImplementation) {
            const bbi = (bitbinds || []).map((bb) => [this.processLocalVariableName(bb[0]), this.processTypeSignature(bb[1])]);
            return new IRBuiltinBody(body.builtin, bbi);
        }
        else if (body instanceof HoleBodyImplementation) {
            assert(body.samplesfile === undefined, "HoleBodyImplementation with expression not supported in IR yet");
            return new IRHoleBody(body.hname, body.doccomment, undefined);
        }
        else {
            if (body instanceof ExpressionBodyImplementation) {
                this.pushStatementBlock();
                const eexp = this.flattenExpression(body.exp);
                if (eexp instanceof IRSimpleExpression) {
                    const frval = this.makeCoercionExplicitAsNeeded(eexp, this.tproc(body.exp.getType()), this.currentReturnType);
                    this.pushStatement(new IRReturnValueSimpleStatement(frval));
                }
                else if (eexp instanceof IRConstructExpression) {
                    if (body.exp.getType().tkeystr === this.currentReturnType.tkeystr) {
                        this.pushStatement(new IRReturnDirectConstructStatement(eexp));
                    }
                    else {
                        this.pushStatement(new IRReturnDirectConstructWithBoxStatement(eexp, this.processTypeSignature(body.exp.getType()), this.processTypeSignature(this.currentReturnType)));
                    }
                }
                else {
                    if (eexp instanceof IRInvokeDirectExpression && this.tproc(body.exp.getType()).tkeystr === this.currentReturnType.tkeystr) {
                        this.pushStatement(new IRReturnDirectInvokeStatement(eexp));
                    }
                    else {
                        const sexp = this.makeExpressionSimple(eexp, this.tproc(body.exp.getType()));
                        const frval = this.makeCoercionExplicitAsNeeded(sexp, this.tproc(body.exp.getType()), this.currentReturnType);
                        this.pushStatement(new IRReturnValueSimpleStatement(frval));
                    }
                }
                const stmts = this.popStatementBlock();
                return new IRStandardBody(stmts);
            }
            else {
                assert(body instanceof StandardBodyImplementation);
                this.pushStatementBlock();
                for (let i = 0; i < body.statements.length; ++i) {
                    const earlyterm = this.flattenStatement(body.statements[i]);
                    if (earlyterm) {
                        break;
                    }
                }
                const stmts = this.popStatementBlock();
                return new IRStandardBody(stmts);
            }
        }
    }
    generateRequiresClauseDecl(req, ikey) {
        this.pushStatementBlock();
        const eexp = this.flattenChkLogicExpression(req.exp);
        const stmts = this.popStatementBlock();
        return new IRPreConditionDecl(req.file, this.convertSourceInfo(req.sinfo), req.diagnosticTag, ikey, req.ii, req.issoft, stmts, eexp);
    }
    generateEnsuresClauseDecl(req, ikey) {
        this.pushStatementBlock();
        const eexp = this.flattenChkLogicExpression(req.exp);
        const stmts = this.popStatementBlock();
        return new IRPostConditionDecl(req.file, this.convertSourceInfo(req.sinfo), req.diagnosticTag, ikey, req.ii, req.issoft, stmts, eexp);
    }
    generateMemberFieldDecl(containingtype, mdecl) {
        const doc = mdecl.attributes.find((a) => a.name === "doc");
        const docstring = (doc !== undefined) ? new IRDeclarationDocString(doc.text) : undefined;
        let defaultinfo = undefined;
        if (mdecl.defaultValue !== undefined) {
            const crexp = this.assembly.tryReduceConstantExpression(mdecl.defaultValue, this.currentBinds);
            if (crexp === undefined) {
                assert(false, "ASMToIRConverter not implemented: MemberFieldDecl default value is a constant evaluatable expression");
            }
        }
        const fkey = `${containingtype.tkeystr}--${mdecl.name}`;
        return new IRMemberFieldDecl(fkey, this.processTypeSignature(containingtype), mdecl.name, this.processTypeSignature(mdecl.declaredType), defaultinfo, docstring, this.processMetaDataTags(mdecl.attributes));
    }
    generateInvariantClauseDecl(containingtype, req) {
        const encltype = this.processTypeSignature(containingtype);
        this.pushStatementBlock();
        const eexp = this.flattenChkLogicExpression(req.exp);
        const stmts = this.popStatementBlock();
        return new IRInvariantDecl(req.file, this.convertSourceInfo(req.sinfo), req.diagnosticTag, encltype.tkeystr, req.ii, stmts, eexp);
    }
    generateValidateClauseDecl(containingtype, req) {
        const encltype = this.processTypeSignature(containingtype);
        this.pushStatementBlock();
        const eexp = this.flattenChkLogicExpression(req.exp);
        const stmts = this.popStatementBlock();
        return new IRValidateDecl(req.file, this.convertSourceInfo(req.sinfo), req.diagnosticTag, encltype.tkeystr, req.ii, stmts, eexp);
    }
    processRecursiveInfo(recursive) {
        if (recursive === "yes") {
            return "recursive";
        }
        else if (recursive === "cond") {
            return "recursive?";
        }
        else {
            return undefined;
        }
    }
    processMetaDataTags(tags) {
        return tags.filter((a) => a.name !== "doc").map((mtag) => {
            const tags = mtag.tags.map((tt) => {
                return { enumType: this.processTypeSignature(tt.enumType), tag: tt.tag };
            });
            return new IRDeclarationMetaTag(mtag.name, tags);
        });
    }
    processAssociationInfo(association) {
        assert(false, "Not Implemented -- processAssociationInfo");
    }
    processInvokeParams(params) {
        return params.map((p) => {
            let defaultValue = undefined;
            if (p.optDefaultValue !== undefined) {
                const crexp = this.assembly.tryReduceConstantExpression(p.optDefaultValue, this.currentBinds);
                if (crexp === undefined) {
                    assert(false, "Not Implemented -- processInvokeParams default value");
                }
            }
            if (!(p.type instanceof LambdaTypeSignature)) {
                return new IRInvokeParameterDecl(p.name, this.processTypeSignature(p.type), p.pkind, undefined, defaultValue);
            }
            else {
                //This is ok since lambda params can only be on an invoke (not on another lambda)
                const ll = this.currentInvokeInstantation.lambdaargs.find((li) => li.pname === p.name);
                const tlambda = new IRLambdaParameterPackTypeSignature(ll.psigkey);
                return new IRInvokeParameterDecl(p.name, tlambda, p.pkind, undefined, defaultValue);
            }
        });
    }
    generateNamespaceFunctionDecl(fdecl, irasm) {
        const ikey = this.currentInvokeInstantation.newikey;
        const recursive = this.processRecursiveInfo(fdecl.recursive);
        const params = this.processInvokeParams(fdecl.params);
        const preconds = fdecl.preconditions.map((pc) => this.generateRequiresClauseDecl(pc, ikey));
        const postconds = fdecl.postconditions.map((ec) => this.generateEnsuresClauseDecl(ec, ikey));
        const doc = fdecl.attributes.find((a) => a.name === "doc");
        const docstring = (doc !== undefined) ? new IRDeclarationDocString(doc.text) : undefined;
        if (fdecl.fkind === "predicate") {
            irasm.predicates.push(new IRPredicateDecl(ikey, recursive, params, this.processTypeSignature(fdecl.resultType), preconds, postconds, docstring, fdecl.file, this.convertSourceInfo(fdecl.sinfo)));
        }
        else {
            const body = this.processBody(fdecl.body, fdecl.terms.map((t) => [t.name, new TemplateTypeSignature(fdecl.sinfo, t.name)]));
            const association = (fdecl.tassoc !== undefined) ? this.processAssociationInfo(fdecl.tassoc) : undefined;
            if (fdecl.fkind === "function") {
                irasm.invokes.push(new IRInvokeDecl(ikey, recursive, params, this.processTypeSignature(fdecl.resultType), preconds, postconds, docstring, fdecl.file, this.convertSourceInfo(fdecl.sinfo), body));
            }
            else if (fdecl.fkind === "chktest" || fdecl.fkind === "errtest") {
                irasm.tests.push(new IRTestDecl(ikey, recursive, params, this.processTypeSignature(fdecl.resultType), preconds, postconds, docstring, fdecl.file, this.convertSourceInfo(fdecl.sinfo), fdecl.fkind, association, body));
            }
            else {
                irasm.examples.push(new IRExampleDecl(ikey, recursive, params, this.processTypeSignature(fdecl.resultType), preconds, postconds, docstring, fdecl.file, this.convertSourceInfo(fdecl.sinfo), association, body));
            }
        }
    }
    generateLambdaInvokeDecl(linst) {
        const recursive = this.processRecursiveInfo(linst.body.recursive);
        const params = [
            new IRInvokeParameterDecl(linst.newikey, new IRLambdaParameterPackTypeSignature(linst.newikey), undefined, "lcapture", undefined),
            ...this.processInvokeParams(linst.lsig.params.map((p) => new InvokeParameterDecl(p.name, p.type, undefined, p.pkind, p.isRestParam)))
        ];
        return new IRInvokeDecl(linst.newikey, recursive, params, this.processTypeSignature(linst.lsig.resultType), [], [], undefined, linst.body.file, this.convertSourceInfo(linst.body.sinfo), this.processBody(linst.body.body, undefined));
    }
    generateTypeFunctionDecl(fdecl, irasm) {
        const ikey = this.currentInvokeInstantation.newikey;
        const recursive = this.processRecursiveInfo(fdecl.recursive);
        const params = this.processInvokeParams(fdecl.params);
        const preconds = fdecl.preconditions.map((pc) => this.generateRequiresClauseDecl(pc, ikey));
        const postconds = fdecl.postconditions.map((ec) => this.generateEnsuresClauseDecl(ec, ikey));
        const doc = fdecl.attributes.find((a) => a.name === "doc");
        const docstring = (doc !== undefined) ? new IRDeclarationDocString(doc.text) : undefined;
        const body = this.processBody(fdecl.body, undefined);
        irasm.invokes.push(new IRInvokeDecl(ikey, recursive, params, this.processTypeSignature(fdecl.resultType), preconds, postconds, docstring, fdecl.file, this.convertSourceInfo(fdecl.sinfo), body));
    }
    generateMethodDecl(tdecl, rcvr, mdecl, irasm) {
        const ikey = this.currentInvokeInstantation.newikey;
        const recursive = this.processRecursiveInfo(mdecl.recursive);
        const params = [new IRInvokeParameterDecl("this", this.processTypeSignature(rcvr), mdecl.isThisRef ? "ref" : undefined, "this", undefined), ...this.processInvokeParams(mdecl.params)];
        const preconds = mdecl.preconditions.map((pc) => this.generateRequiresClauseDecl(pc, ikey));
        const postconds = mdecl.postconditions.map((ec) => this.generateEnsuresClauseDecl(ec, ikey));
        const doc = mdecl.attributes.find((a) => a.name === "doc");
        const docstring = (doc !== undefined) ? new IRDeclarationDocString(doc.text) : undefined;
        const body = this.processBody(mdecl.body, undefined);
        irasm.invokes.push(new IRInvokeDecl(ikey, recursive, params, this.processTypeSignature(mdecl.resultType), preconds, postconds, docstring, mdecl.file, this.convertSourceInfo(mdecl.sinfo), body));
    }
    /*
        private generateTaskMethodDecl(tdecl: AbstractNominalTypeDecl, rcvr: TypeSignature, mdecl: TaskMethodDecl, invks: IRInvokeDecl[]) {
            assert(false, "Not implemented -- generateTaskMethodDecl");
        }
    
        private generateTaskActionDecl(tdecl: AbstractNominalTypeDecl, rcvr: TypeSignature, mdecl: TaskActionDecl, adecls: IRTaskActionDecl[]) {
            assert(false, "Not implemented -- generateTaskActionDecl");
        }
    */
    generateConstMemberDecl(tdecl, cdecl, typeinst) {
        this.extendProcessingContextForExpEval(cdecl.declaredType);
        this.pushStatementBlock();
        const irval = this.flattenExpression(cdecl.value);
        const doc = cdecl.attributes.find((a) => a.name === "doc");
        const docstring = (doc !== undefined) ? new IRDeclarationDocString(doc.text) : undefined;
        const expr = this.makeCoercionExplicitAsNeeded(this.makeExpressionSimple(irval, cdecl.value.getType()), cdecl.value.getType(), cdecl.declaredType);
        const stmts = this.popStatementBlock();
        const flatfieldname = `${typeinst.tkey}::${cdecl.name}`;
        return new IRConstantDecl(flatfieldname, this.processTypeSignature(cdecl.declaredType), stmts, expr, docstring);
    }
    /** Handle the standard set of type functions, methods, and constants **/
    processNominalTypeInfoStandard(tdecl, tinst, irasm) {
        for (let i = 0; i < tdecl.consts.length; ++i) {
            const cc = tdecl.consts[i];
            const nsd = this.assembly.tryReduceConstantExpression(cc.value, this.currentBinds);
            if (nsd === undefined) {
                irasm.constants.push(this.generateConstMemberDecl(tdecl, cc, tinst));
            }
        }
        for (let i = 0; i < tdecl.functions.length; ++i) {
            const ff = tdecl.functions[i];
            const finst = tinst.functionbinds.get(ff.resolvename);
            if (finst !== undefined) {
                for (let j = 0; j < finst.length; ++j) {
                    const implicitreturn = ff.params.find((p) => p.pkind !== undefined);
                    this.initCodeInvokeProcessingContext(ff.file, false, ff.resultType, implicitreturn, finst[j]);
                    this.generateTypeFunctionDecl(ff, irasm);
                }
            }
        }
        for (let i = 0; i < tdecl.methods.length; ++i) {
            const mm = tdecl.methods[i];
            const minst = tinst.methodbinds.get(mm.resolvename);
            if (minst !== undefined) {
                for (let j = 0; j < minst.length; ++j) {
                    const implicitreturn = mm.params.find((p) => p.pkind !== undefined) || (mm.isThisRef ? new InvokeParameterDecl("this", tinst.tsig, undefined, undefined, false) : undefined);
                    this.initCodeInvokeProcessingContext(mm.file, false, mm.resultType, implicitreturn, minst[j]);
                    this.generateMethodDecl(tdecl, tinst.tsig, mm, irasm);
                }
            }
        }
    }
    generateEnumTypeDecl(tdecl, tinst, irasm) {
        this.initCodeTypeProcessingContext(tdecl.file, false, tinst);
        const doc = tdecl.attributes.find((a) => a.name === "doc");
        const docstring = (doc !== undefined) ? new IRDeclarationDocString(doc.text) : undefined;
        this.processNominalTypeInfoStandard(tdecl, tinst, irasm);
        return new IREnumTypeDecl(tinst.tkey, docstring, tdecl.file, this.convertSourceInfo(tdecl.sinfo), [...tdecl.members]);
    }
    generateTypedeclTypeDecl(tdecl, tinst, irasm) {
        this.initCodeTypeProcessingContext(tdecl.file, false, tinst);
        const doc = tdecl.attributes.find((a) => a.name === "doc");
        const docstring = (doc !== undefined) ? new IRDeclarationDocString(doc.text) : undefined;
        const invariants = tdecl.invariants.map((inv) => this.generateInvariantClauseDecl(tinst.tsig, inv));
        const validates = tdecl.validates.map((val) => this.generateValidateClauseDecl(tinst.tsig, val));
        this.processNominalTypeInfoStandard(tdecl, tinst, irasm);
        const saturatedProvides = tdecl.saturatedProvides.map((sp => this.processTypeSignature(sp)));
        const allInvariants = tdecl.allInvariants.map((inv, jj) => {
            return { containingtype: this.processTypeSignature(inv.containingtype), ii: jj };
        });
        const allValidates = tdecl.allValidates.map((val, jj) => {
            return { containingtype: this.processTypeSignature(val.containingtype), ii: jj };
        });
        return new IRTypedeclTypeDecl(tinst.tkey, invariants, validates, saturatedProvides, allInvariants, allValidates, docstring, this.processMetaDataTags(tdecl.attributes), tdecl.file, this.convertSourceInfo(tdecl.sinfo), this.processTypeSignature(tdecl.valuetype), tdecl.valuetype.decl.isKeyTypeRestricted(), tdecl.valuetype.decl.isNumericRestricted());
    }
    generateTypedeclCStringDecl(tdecl, tinst, irasm) {
        this.initCodeTypeProcessingContext(tdecl.file, false, tinst);
        const doc = tdecl.attributes.find((a) => a.name === "doc");
        const docstring = (doc !== undefined) ? new IRDeclarationDocString(doc.text) : undefined;
        const invariants = tdecl.invariants.map((inv) => this.generateInvariantClauseDecl(tinst.tsig, inv));
        const validates = tdecl.validates.map((val) => this.generateValidateClauseDecl(tinst.tsig, val));
        this.processNominalTypeInfoStandard(tdecl, tinst, irasm);
        const saturatedProvides = tdecl.saturatedProvides.map((sp => this.processTypeSignature(sp)));
        const allInvariants = tdecl.allInvariants.map((inv, jj) => {
            return { containingtype: this.processTypeSignature(inv.containingtype), ii: jj };
        });
        const allValidates = tdecl.allValidates.map((val, jj) => {
            return { containingtype: this.processTypeSignature(val.containingtype), ii: jj };
        });
        let rngchk = undefined;
        if (tdecl.optsizerng !== undefined) {
            rngchk = { min: tdecl.optsizerng.min, max: tdecl.optsizerng.max };
        }
        const rechk = tdecl.optofexp !== undefined ? this.flattenExpression(tdecl.optofexp) : undefined;
        return new IRTypedeclCStringDecl(tinst.tkey, invariants, validates, saturatedProvides, allInvariants, allValidates, docstring, this.processMetaDataTags(tdecl.attributes), tdecl.file, this.convertSourceInfo(tdecl.sinfo), rngchk, rechk);
    }
    generateTypedeclStringDecl(tdecl, tinst, irasm) {
        this.initCodeTypeProcessingContext(tdecl.file, false, tinst);
        const doc = tdecl.attributes.find((a) => a.name === "doc");
        const docstring = (doc !== undefined) ? new IRDeclarationDocString(doc.text) : undefined;
        const invariants = tdecl.invariants.map((inv) => this.generateInvariantClauseDecl(tinst.tsig, inv));
        const validates = tdecl.validates.map((val) => this.generateValidateClauseDecl(tinst.tsig, val));
        this.processNominalTypeInfoStandard(tdecl, tinst, irasm);
        const saturatedProvides = tdecl.saturatedProvides.map((sp => this.processTypeSignature(sp)));
        const allInvariants = tdecl.allInvariants.map((inv, jj) => {
            return { containingtype: this.processTypeSignature(inv.containingtype), ii: jj };
        });
        const allValidates = tdecl.allValidates.map((val, jj) => {
            return { containingtype: this.processTypeSignature(val.containingtype), ii: jj };
        });
        let rngchk = undefined;
        if (tdecl.optsizerng !== undefined) {
            rngchk = { min: tdecl.optsizerng.min, max: tdecl.optsizerng.max };
        }
        const rechk = tdecl.optofexp !== undefined ? this.flattenExpression(tdecl.optofexp) : undefined;
        return new IRTypedeclStringDecl(tinst.tkey, invariants, validates, saturatedProvides, allInvariants, allValidates, docstring, this.processMetaDataTags(tdecl.attributes), tdecl.file, this.convertSourceInfo(tdecl.sinfo), rngchk, rechk);
    }
    generatePrimitiveEntityTypeDecl(tdecl, tinst, irasm) {
        this.initCodeTypeProcessingContext(tdecl.file, false, tinst);
        const doc = tdecl.attributes.find((a) => a.name === "doc");
        const docstring = (doc !== undefined) ? new IRDeclarationDocString(doc.text) : undefined;
        this.processNominalTypeInfoStandard(tdecl, tinst, irasm);
        return new IRPrimitiveEntityTypeDecl(tdecl.name, docstring, tdecl.file, this.convertSourceInfo(tdecl.sinfo));
    }
    generateOkTypeDecl(tdecl, tinst, irasm) {
        assert(false, "Not Implemented -- generateOkTypeDecl");
    }
    generateFailTypeDecl(tdecl, tinst, irasm) {
        assert(false, "Not Implemented -- generateFailTypeDecl");
    }
    generateAPIErrorTypeDecl(tdecl, tinst, irasm) {
        assert(false, "Not Implemented -- generateAPIErrorTypeDecl");
    }
    generateAPIRejectedTypeDecl(tdecl, tinst, irasm) {
        assert(false, "Not Implemented -- generateAPIRejectedTypeDecl");
    }
    generateAPIDeniedTypeDecl(tdecl, tinst, irasm) {
        assert(false, "Not Implemented -- generateAPIDeniedTypeDecl");
    }
    generateAPIFlaggedTypeDecl(tdecl, tinst, irasm) {
        assert(false, "Not Implemented -- generateAPIFlaggedTypeDecl");
    }
    generateAPISuccessTypeDecl(tdecl, tinst, irasm) {
        assert(false, "Not Implemented -- generateAPISuccessTypeDecl");
    }
    generateSomeTypeDecl(tdecl, tinst, irasm) {
        this.initCodeTypeProcessingContext(tdecl.file, false, tinst);
        const encloption = tdecl.saturatedProvides.map((sp) => this.processTypeSignature(sp));
        const doc = tdecl.attributes.find((a) => a.name === "doc");
        const docstring = (doc !== undefined) ? new IRDeclarationDocString(doc.text) : undefined;
        this.processNominalTypeInfoStandard(tdecl, tinst, irasm);
        const oftype = this.processTypeSignature(this.tproc(tinst.tsig).alltermargs[0]);
        return new IRSomeTypeDecl(tinst.tkey, encloption, docstring, tdecl.file, this.convertSourceInfo(tdecl.sinfo), oftype);
    }
    generateMapEntryTypeDecl(tdecl, tinst, irasm) {
        assert(false, "Not Implemented -- generateMapEntryTypeDecl");
    }
    generateListTypeDecl(tdecl, tinst, irasm) {
        this.initCodeTypeProcessingContext(tdecl.file, false, tinst);
        const doc = tdecl.attributes.find((a) => a.name === "doc");
        const docstring = (doc !== undefined) ? new IRDeclarationDocString(doc.text) : undefined;
        this.processNominalTypeInfoStandard(tdecl, tinst, irasm);
        const oftype = this.processTypeSignature(this.tproc(tinst.tsig).alltermargs[0]);
        return new IRListTypeDecl(tinst.tkey, docstring, tdecl.file, this.convertSourceInfo(tdecl.sinfo), oftype);
    }
    generateStackTypeDecl(tdecl, tinst, irasm) {
        assert(false, "Not Implemented -- generateStackTypeDecl");
    }
    generateQueueTypeDecl(tdecl, tinst, irasm) {
        assert(false, "Not Implemented -- generateQueueTypeDecl");
    }
    generateSetTypeDecl(tdecl, tinst, irasm) {
        assert(false, "Not Implemented -- generateSetTypeDecl");
    }
    generateMapTypeDecl(tdecl, tinst, irasm) {
        assert(false, "Not Implemented -- generateMapTypeDecl");
    }
    generateEventListTypeDecl(tdecl, tinst, irasm) {
        assert(false, "Not Implemented -- generateEventListTypeDecl");
    }
    generateEntityTypeDecl(tdecl, tinst, irasm) {
        this.initCodeTypeProcessingContext(tdecl.file, false, tinst);
        const doc = tdecl.attributes.find((a) => a.name === "doc");
        const docstring = (doc !== undefined) ? new IRDeclarationDocString(doc.text) : undefined;
        let etag = "std";
        if (tdecl.etag === AdditionalTypeDeclTag.Status) {
            etag = "status";
        }
        if (tdecl.etag === AdditionalTypeDeclTag.Event) {
            etag = "event";
        }
        const fields = tdecl.fields.map((f) => this.generateMemberFieldDecl(tinst.tsig, f));
        const invariants = tdecl.invariants.map((inv) => this.generateInvariantClauseDecl(tinst.tsig, inv));
        const validates = tdecl.validates.map((val) => this.generateValidateClauseDecl(tinst.tsig, val));
        this.processNominalTypeInfoStandard(tdecl, tinst, irasm);
        const bfinfo = tdecl.saturatedBFieldInfo.map((bf) => {
            const bfirt = this.processTypeSignature(bf.containingtype);
            const fkey = `${bfirt.tkeystr}--${bf.name}`;
            return { containingtype: bfirt, fkey: fkey, fname: bf.name, ftype: this.processTypeSignature(bf.type) };
        });
        const allInvariants = tdecl.allInvariants.map((vv) => {
            return { containingtype: this.processTypeSignature(vv.containingtype), ii: vv.ii };
        });
        const allValidates = tdecl.allValidates.map((vv) => {
            return { containingtype: this.processTypeSignature(vv.containingtype), ii: vv.ii };
        });
        return new IREntityTypeDecl(tinst.tkey, invariants, validates, fields, etag, tdecl.saturatedProvides.map((sp) => this.processTypeSignature(sp)), bfinfo, allInvariants, allValidates, docstring, this.processMetaDataTags(tdecl.attributes), tdecl.file, this.convertSourceInfo(tdecl.sinfo));
    }
    generateLambdaDataDecl(linst) {
        const stdvalues = linst.capturedVars
            .map((cv) => { return { vname: cv[0], vtype: this.processTypeSignature(cv[1]) }; });
        const lambdavalues = linst.capturedLambdas.map((cl) => { return { lname: cl.pname, ltypekey: cl.psigkey }; });
        return new IRLambdaParameterPackDecl(linst.newikey, linst.newikey, stdvalues, lambdavalues);
    }
    generateOptionTypeDecl(tdecl, tinst, irasm) {
        this.initCodeTypeProcessingContext(tdecl.file, false, tinst);
        const doc = tdecl.attributes.find((a) => a.name === "doc");
        const docstring = (doc !== undefined) ? new IRDeclarationDocString(doc.text) : undefined;
        this.processNominalTypeInfoStandard(tdecl, tinst, irasm);
        const oftype = this.processTypeSignature(this.tproc(tinst.tsig).alltermargs[0]);
        const somedecl = this.assembly.getCoreNamespace().typedecls.find((td) => td.name === "Some");
        const sometype = this.processTypeSignature(new NominalTypeSignature(tinst.tsig.sinfo, undefined, somedecl, [this.tproc(tinst.tsig).alltermargs[0]]));
        return new IROptionTypeDecl(tinst.tkey, docstring, tdecl.file, this.convertSourceInfo(tdecl.sinfo), oftype, sometype);
    }
    generateResultTypeDecl(tdecl, tinst, irasm) {
        assert(false, "Not Implemented -- generateResultTypeDecl");
    }
    generateAPIResultTypeDecl(tdecl, tinst, irasm) {
        assert(false, "Not Implemented -- generateAPIResultTypeDecl");
    }
    generateConceptTypeDecl(tdecl, tinst, irasm) {
        this.initCodeTypeProcessingContext(tdecl.file, false, tinst);
        const doc = tdecl.attributes.find((a) => a.name === "doc");
        const docstring = (doc !== undefined) ? new IRDeclarationDocString(doc.text) : undefined;
        const fields = tdecl.fields.map((f) => this.generateMemberFieldDecl(tinst.tsig, f));
        const invariants = tdecl.invariants.map((inv) => this.generateInvariantClauseDecl(tinst.tsig, inv));
        const validates = tdecl.validates.map((val) => this.generateValidateClauseDecl(tinst.tsig, val));
        this.processNominalTypeInfoStandard(tdecl, tinst, irasm);
        const bfinfo = tdecl.saturatedBFieldInfo.map((bf) => {
            const bfirt = this.processTypeSignature(bf.containingtype);
            const fkey = `${bfirt.tkeystr}--${bf.name}`;
            return { containingtype: bfirt, fkey: fkey, fname: bf.name, ftype: this.processTypeSignature(bf.type) };
        });
        return new IRConceptTypeDecl(tinst.tkey, invariants, validates, fields, tdecl.saturatedProvides.map((sp) => this.processTypeSignature(sp)), bfinfo, docstring, this.processMetaDataTags(tdecl.attributes), tdecl.file, this.convertSourceInfo(tdecl.sinfo));
    }
    generateDatatypeMemberEntityTypeDecl(tdecl, tinst, irasm) {
        this.initCodeTypeProcessingContext(tdecl.file, false, tinst);
        const doc = tdecl.attributes.find((a) => a.name === "doc");
        const docstring = (doc !== undefined) ? new IRDeclarationDocString(doc.text) : undefined;
        let etag = "std";
        if (tdecl.etag === AdditionalTypeDeclTag.Status) {
            etag = "status";
        }
        if (tdecl.etag === AdditionalTypeDeclTag.Event) {
            etag = "event";
        }
        const fields = tdecl.fields.map((f) => this.generateMemberFieldDecl(tinst.tsig, f));
        const invariants = tdecl.invariants.map((inv) => this.generateInvariantClauseDecl(tinst.tsig, inv));
        const validates = tdecl.validates.map((val) => this.generateValidateClauseDecl(tinst.tsig, val));
        this.processNominalTypeInfoStandard(tdecl, tinst, irasm);
        const bfinfo = tdecl.saturatedBFieldInfo.map((bf) => {
            const bfirt = this.processTypeSignature(bf.containingtype);
            const fkey = `${bfirt.tkeystr}--${bf.name}`;
            return { containingtype: bfirt, fkey: fkey, fname: bf.name, ftype: this.processTypeSignature(bf.type) };
        });
        const allInvariants = tdecl.allInvariants.map((vv) => {
            return { containingtype: this.processTypeSignature(vv.containingtype), ii: vv.ii };
        });
        const allValidates = tdecl.allValidates.map((vv) => {
            return { containingtype: this.processTypeSignature(vv.containingtype), ii: vv.ii };
        });
        return new IRDatatypeMemberEntityTypeDecl(tinst.tkey, invariants, validates, fields, etag, tdecl.saturatedProvides.map((sp) => this.processTypeSignature(sp)), bfinfo, allInvariants, allValidates, docstring, this.processMetaDataTags(tdecl.attributes), tdecl.file, this.convertSourceInfo(tdecl.sinfo));
    }
    generateDatatypeTypeDecl(tdecl, tinst, irasm) {
        this.initCodeTypeProcessingContext(tdecl.file, false, tinst);
        const doc = tdecl.attributes.find((a) => a.name === "doc");
        const docstring = (doc !== undefined) ? new IRDeclarationDocString(doc.text) : undefined;
        const fields = tdecl.fields.map((f) => this.generateMemberFieldDecl(tinst.tsig, f));
        const invariants = tdecl.invariants.map((inv) => this.generateInvariantClauseDecl(tinst.tsig, inv));
        const validates = tdecl.validates.map((val) => this.generateValidateClauseDecl(tinst.tsig, val));
        this.processNominalTypeInfoStandard(tdecl, tinst, irasm);
        const bfinfo = tdecl.saturatedBFieldInfo.map((bf) => {
            const bfirt = this.processTypeSignature(bf.containingtype);
            const fkey = `${bfirt.tkeystr}--${bf.name}`;
            return { containingtype: bfirt, fkey: fkey, fname: bf.name, ftype: this.processTypeSignature(bf.type) };
        });
        const assocdecls = tdecl.associatedMemberEntityDecls.map((md) => {
            const tsig = new NominalTypeSignature(md.sinfo, undefined, md, tdecl.terms.map((ta) => new TemplateTypeSignature(md.sinfo, ta.name)));
            return this.processTypeSignature(tsig);
        });
        return new IRDatatypeTypeDecl(tinst.tkey, invariants, validates, fields, tdecl.saturatedProvides.map((sp) => this.processTypeSignature(sp)), bfinfo, docstring, this.processMetaDataTags(tdecl.attributes), tdecl.file, this.convertSourceInfo(tdecl.sinfo), assocdecls);
    }
    generateAPIDecl(adecl, irasm) {
        assert(false, "Not implemented -- checkAPIDecl");
    }
    generateAgentDecl(adecl, irasm) {
        assert(false, "Not implemented -- checkAgentDecl");
    }
    generateTaskDecl(tdecl, irasm) {
        assert(false, "Not implemented -- checkTaskDecl");
    }
    generateNamespaceConstDecl(ns, cdecl) {
        this.extendProcessingContextForExpEval(cdecl.declaredType);
        this.pushStatementBlock();
        const irval = this.flattenExpression(cdecl.value);
        const doc = cdecl.attributes.find((a) => a.name === "doc");
        const docstring = (doc !== undefined) ? new IRDeclarationDocString(doc.text) : undefined;
        const expr = this.makeCoercionExplicitAsNeeded(this.makeExpressionSimple(irval, this.tproc(cdecl.value.getType())), this.tproc(cdecl.value.getType()), cdecl.declaredType);
        const stmts = this.popStatementBlock();
        const flatconstname = `${ns.emit()}::${cdecl.name}`;
        return new IRConstantDecl(flatconstname, this.processTypeSignature(cdecl.declaredType), stmts, expr, docstring);
    }
    generateNamespaceTypeDecl(tinst, irasm, iinfo) {
        const tt = tinst.tsig.decl;
        if (tt instanceof EnumTypeDecl) {
            const edecl = this.generateEnumTypeDecl(tt, tinst, irasm);
            irasm.enums.push(edecl);
            irasm.alltypes.set(edecl.tkey, edecl);
        }
        else if (tt instanceof TypedeclTypeDecl) {
            const oftype = this.processTypeSignature(tt.valuetype);
            if (oftype.tkeystr === "CString") {
                const csdecl = this.generateTypedeclCStringDecl(tt, tinst, irasm);
                irasm.cstringoftypedecls.push(csdecl);
                irasm.alltypes.set(csdecl.tkey, csdecl);
            }
            else if (oftype.tkeystr === "String") {
                const sdecl = this.generateTypedeclStringDecl(tt, tinst, irasm);
                irasm.stringoftypedecls.push(sdecl);
                irasm.alltypes.set(sdecl.tkey, sdecl);
            }
            else {
                const ttdecl = this.generateTypedeclTypeDecl(tt, tinst, irasm);
                irasm.typedecls.push(ttdecl);
                irasm.alltypes.set(ttdecl.tkey, ttdecl);
            }
        }
        else if (tt instanceof PrimitiveEntityTypeDecl) {
            const pdecl = this.generatePrimitiveEntityTypeDecl(tt, tinst, irasm);
            irasm.primitives.push(pdecl);
            irasm.alltypes.set(pdecl.tkey, pdecl);
        }
        else if (tt instanceof OkTypeDecl) {
            const okdecl = this.generateOkTypeDecl(tt, tinst, irasm);
            irasm.constructables.push(okdecl);
            irasm.alltypes.set(okdecl.tkey, okdecl);
        }
        else if (tt instanceof FailTypeDecl) {
            const faildecl = this.generateFailTypeDecl(tt, tinst, irasm);
            irasm.constructables.push(faildecl);
            irasm.alltypes.set(faildecl.tkey, faildecl);
        }
        else if (tt instanceof APIErrorTypeDecl) {
            const errdecl = this.generateAPIErrorTypeDecl(tt, tinst, irasm);
            irasm.constructables.push(errdecl);
            irasm.alltypes.set(errdecl.tkey, errdecl);
        }
        else if (tt instanceof APIRejectedTypeDecl) {
            const rejecteddecl = this.generateAPIRejectedTypeDecl(tt, tinst, irasm);
            irasm.constructables.push(rejecteddecl);
            irasm.alltypes.set(rejecteddecl.tkey, rejecteddecl);
        }
        else if (tt instanceof APIDeniedTypeDecl) {
            const denieddecl = this.generateAPIDeniedTypeDecl(tt, tinst, irasm);
            irasm.constructables.push(denieddecl);
            irasm.alltypes.set(denieddecl.tkey, denieddecl);
        }
        else if (tt instanceof APIFlaggedTypeDecl) {
            const flaggeddecl = this.generateAPIFlaggedTypeDecl(tt, tinst, irasm);
            irasm.constructables.push(flaggeddecl);
            irasm.alltypes.set(flaggeddecl.tkey, flaggeddecl);
        }
        else if (tt instanceof APISuccessTypeDecl) {
            const successdecl = this.generateAPISuccessTypeDecl(tt, tinst, irasm);
            irasm.constructables.push(successdecl);
            irasm.alltypes.set(successdecl.tkey, successdecl);
        }
        else if (tt instanceof SomeTypeDecl) {
            const somedecl = this.generateSomeTypeDecl(tt, tinst, irasm);
            irasm.constructables.push(somedecl);
            irasm.alltypes.set(somedecl.tkey, somedecl);
        }
        else if (tt instanceof MapEntryTypeDecl) {
            const mapdecl = this.generateMapEntryTypeDecl(tt, tinst, irasm);
            irasm.constructables.push(mapdecl);
            irasm.alltypes.set(mapdecl.tkey, mapdecl);
        }
        else if (tt instanceof ListTypeDecl) {
            const listdecl = this.generateListTypeDecl(tt, tinst, irasm);
            irasm.collections.push(listdecl);
            irasm.alltypes.set(listdecl.tkey, listdecl);
        }
        else if (tt instanceof StackTypeDecl) {
            const stackdecl = this.generateStackTypeDecl(tt, tinst, irasm);
            irasm.collections.push(stackdecl);
            irasm.alltypes.set(stackdecl.tkey, stackdecl);
        }
        else if (tt instanceof QueueTypeDecl) {
            const queuedecl = this.generateQueueTypeDecl(tt, tinst, irasm);
            irasm.collections.push(queuedecl);
            irasm.alltypes.set(queuedecl.tkey, queuedecl);
        }
        else if (tt instanceof SetTypeDecl) {
            const setdecl = this.generateSetTypeDecl(tt, tinst, irasm);
            irasm.collections.push(setdecl);
            irasm.alltypes.set(setdecl.tkey, setdecl);
        }
        else if (tt instanceof MapTypeDecl) {
            const mapdecl = this.generateMapTypeDecl(tt, tinst, irasm);
            irasm.collections.push(mapdecl);
            irasm.alltypes.set(mapdecl.tkey, mapdecl);
        }
        else if (tt instanceof EventListTypeDecl) {
            const eldecl = this.generateEventListTypeDecl(tt, tinst, irasm);
            irasm.eventlists.push(eldecl);
            irasm.alltypes.set(eldecl.tkey, eldecl);
        }
        else if (tt instanceof EntityTypeDecl) {
            const eedecl = this.generateEntityTypeDecl(tt, tinst, irasm);
            irasm.entities.push(eedecl);
            irasm.alltypes.set(eedecl.tkey, eedecl);
        }
        else if (tt instanceof OptionTypeDecl) {
            const optdecl = this.generateOptionTypeDecl(tt, tinst, irasm);
            irasm.pconcepts.push(optdecl);
            irasm.alltypes.set(optdecl.tkey, optdecl);
        }
        else if (tt instanceof ResultTypeDecl) {
            const resdecl = this.generateResultTypeDecl(tt, tinst, irasm);
            irasm.pconcepts.push(resdecl);
            irasm.alltypes.set(resdecl.tkey, resdecl);
        }
        else if (tt instanceof APIResultTypeDecl) {
            const apidecl = this.generateAPIResultTypeDecl(tt, tinst, irasm);
            irasm.pconcepts.push(apidecl);
            irasm.alltypes.set(apidecl.tkey, apidecl);
        }
        else if (tt instanceof ConceptTypeDecl) {
            const cptdecl = this.generateConceptTypeDecl(tt, tinst, irasm);
            irasm.concepts.push(cptdecl);
            irasm.alltypes.set(cptdecl.tkey, cptdecl);
        }
        else if (tt instanceof DatatypeMemberEntityTypeDecl) {
            const dmdecl = this.generateDatatypeMemberEntityTypeDecl(tt, tinst, irasm);
            irasm.datamembers.push(dmdecl);
            irasm.alltypes.set(dmdecl.tkey, dmdecl);
        }
        else if (tt instanceof DatatypeTypeDecl) {
            const dtdecl = this.generateDatatypeTypeDecl(tt, tinst, irasm);
            irasm.datatypes.push(dtdecl);
            irasm.alltypes.set(dtdecl.tkey, dtdecl);
        }
        else {
            assert(false, "Unknown type decl kind");
        }
    }
    testEmitEnabled(fdecl) {
        if (!this.generateTestInfo) {
            return false;
        }
        if (this.testfilefilter === undefined && this.testfilters === undefined) {
            return true;
        }
        let matchfile = false;
        if (this.testfilefilter !== undefined) {
            matchfile = this.testfilefilter.some((ff) => fdecl.file.endsWith(ff));
        }
        let matchfilter = false;
        if (this.testfilters !== undefined) {
            const assoc = fdecl.tassoc;
            matchfilter = assoc !== undefined && this.testfilters.some((tmatch) => assoc.some((asc) => asc.isMatchWith(tmatch)));
        }
        return matchfile || matchfilter;
    }
    emitNamespaceDeclaration(decl, asminstantiation, aainsts, irasm) {
        for (let i = 0; i < decl.subns.length; ++i) {
            const subdecl = decl.subns[i];
            const nsii = aainsts.find((ai) => ai.ns.emit() === subdecl.fullnamespace.emit());
            if (nsii !== undefined) {
                this.emitNamespaceDeclaration(decl.subns[i], nsii, aainsts, irasm);
            }
        }
        //don't want subnamespace decls to overwrite the current namespace instantiation
        this.currentNamespaceInstantiation = asminstantiation;
        this.currentLambdaConsMap = asminstantiation.lambdacons;
        this.currentMonoInvIdMap = asminstantiation.monoinvids;
        for (let i = 0; i < decl.consts.length; ++i) {
            const ntcd = this.assembly.tryReduceConstantExpression(decl.consts[i].value, undefined);
            if (ntcd === undefined) {
                irasm.constants.push(this.generateNamespaceConstDecl(decl.fullnamespace, decl.consts[i]));
            }
        }
        const llist = [...asminstantiation.lambdas.values()].sort((a, b) => a.newikey.localeCompare(b.newikey));
        for (let i = 0; i < llist.length; ++i) {
            const linst = llist[i];
            irasm.lpacksigs.push(new IRLambdaParameterPackTypeSignature(linst.newikey));
            const implicitreturn = linst.lsig.params.find((p) => p.pkind !== undefined);
            this.initCodeLambdaProcessingContext(linst.body.file, linst.lsig.resultType, implicitreturn, linst);
            const ldecl = this.generateLambdaDataDecl(linst);
            irasm.alllambdas.set(ldecl.tkeystr, ldecl);
            const linv = this.generateLambdaInvokeDecl(linst);
            irasm.invokes.push(linv);
        }
        for (let i = 0; i < decl.functions.length; ++i) {
            const finst = asminstantiation.functionbinds.get(decl.functions[i].resolvename);
            if (finst !== undefined && (decl.functions[i].fkind !== "predicate" || decl.functions[i].fkind !== "function" || this.testEmitEnabled(decl.functions[i]))) {
                for (let j = 0; j < finst.length; ++j) {
                    const fdecl = decl.functions[i];
                    const implicitreturn = fdecl.params.find((p) => p.pkind !== undefined);
                    this.initCodeInvokeProcessingContext(fdecl.file, false, fdecl.resultType, implicitreturn, finst[j]);
                    this.generateNamespaceFunctionDecl(fdecl, irasm);
                }
            }
        }
        for (let i = 0; i < decl.typedecls.length; ++i) {
            const tinst = asminstantiation.typebinds.get(decl.typedecls[i].name);
            if (tinst !== undefined) {
                for (let j = 0; j < tinst.length; ++j) {
                    this.generateNamespaceTypeDecl(tinst[j], irasm, aainsts);
                }
            }
        }
        //apis
        for (let i = 0; i < decl.apis.length; ++i) {
            irasm.apis.push(this.generateAPIDecl(decl.apis[i], irasm));
        }
        //agents
        for (let i = 0; i < decl.agents.length; ++i) {
            irasm.agents.push(this.generateAgentDecl(decl.agents[i], irasm));
        }
        //tasks
        for (let i = 0; i < decl.tasks.length; ++i) {
            irasm.tasks.push(this.generateTaskDecl(decl.tasks[i], irasm));
        }
        this.currentNamespaceInstantiation = undefined;
    }
    static generateIR(assembly, asminstantiation, testfilefilter) {
        const emitter = new ASMToIRConverter(assembly, testfilefilter !== undefined, testfilefilter, undefined);
        const irasm = new IRAssembly();
        //emit each of the assemblies
        for (let i = 0; i < assembly.toplevelNamespaces.length; ++i) {
            const nsdecl = assembly.toplevelNamespaces[i];
            const nsii = asminstantiation.find((ai) => ai.ns.emit() === nsdecl.fullnamespace.emit());
            if (nsii !== undefined) {
                emitter.emitNamespaceDeclaration(nsdecl, nsii, asminstantiation, irasm);
            }
        }
        irasm.elists.push(...emitter.elists);
        irasm.cregexps.push(...emitter.cregexs.values());
        irasm.uregexps.push(...emitter.uregexs.values());
        irasm.formats.push(...emitter.formats);
        irasm.formatcstrings.push(...emitter.formatcstrings);
        irasm.formatstrings.push(...emitter.formatstrings);
        irasm.computeSubtypeInfo();
        irasm.computeTypeDependencyInfo();
        return irasm;
    }
}
export { ASMToIRConverter };
//# sourceMappingURL=flatten.js.map