import assert from "node:assert";
import { AutoTypeSignature } from "./type.js";
class BinderInfo {
    constructor(srcname, implicitdef) {
        this.srcname = srcname;
        this.implicitdef = implicitdef;
    }
    emitoptdef() {
        return !this.implicitdef ? `${this.srcname} = ` : "";
    }
}
class TypeTestBindInfo {
    constructor(guardidx, bname, ttrue, tfalse) {
        this.guardidx = guardidx;
        this.bname = bname;
        this.ttrue = ttrue;
        this.tfalse = tfalse;
    }
    notop() {
        return new TypeTestBindInfo(this.guardidx, this.bname, this.tfalse, this.ttrue);
    }
}
class ITest {
    constructor(isnot) {
        this.isnot = isnot;
    }
}
class ITestType extends ITest {
    constructor(isnot, ttype) {
        super(isnot);
        this.ttype = ttype;
    }
    emit(fmt) {
        return `${this.isnot ? "!" : ""}<${this.ttype.emit()}>`;
    }
}
class ITestNone extends ITest {
    constructor(isnot) {
        super(isnot);
    }
    emit(fmt) {
        return `${this.isnot ? "!" : ""}none`;
    }
}
class ITestSome extends ITest {
    constructor(isnot) {
        super(isnot);
    }
    emit(fmt) {
        return `${this.isnot ? "!" : ""}some`;
    }
}
class ITestOk extends ITest {
    constructor(isnot) {
        super(isnot);
    }
    emit(fmt) {
        return `${this.isnot ? "!" : ""}ok`;
    }
}
class ITestFail extends ITest {
    constructor(isnot) {
        super(isnot);
    }
    emit(fmt) {
        return `${this.isnot ? "!" : ""}fail`;
    }
}
class ITestGuard {
    constructor(exp) {
        this.exp = exp;
    }
}
class ITestBinderGuard extends ITestGuard {
    constructor(exp, itest, bindinfo) {
        super(exp);
        this.itest = itest;
        this.bindinfo = bindinfo;
    }
    emit(mustparens, fmt) {
        return `(${this.bindinfo.emitoptdef()}${this.exp.emit(true, fmt)})@${this.itest.emit(fmt)}`;
    }
}
class ITestTypeGuard extends ITestGuard {
    constructor(exp, itest) {
        super(exp);
        this.itest = itest;
    }
    emit(mustparens, fmt) {
        return `(${this.exp.emit(true, fmt)})${this.itest.emit(fmt)}`;
    }
}
class ITestSimpleGuard extends ITestGuard {
    emit(mustparens, fmt) {
        let ee = this.exp.emit(true, fmt);
        return mustparens ? `(${ee})` : ee;
    }
}
class ITestGuardSet {
    constructor(guards) {
        this.guards = guards;
    }
    emit(fmt) {
        if (this.guards.length === 1) {
            return this.guards[0].emit(true, fmt);
        }
        else {
            return this.guards.map((g) => g.emit(false, fmt)).join(" && ");
        }
    }
}
class FormatStringComponent {
}
class FormatStringTextComponent extends FormatStringComponent {
    constructor(text) {
        super();
        this.resolvedValue = undefined; //after unescaping
        this.text = text;
    }
    emit() {
        return this.text;
    }
}
class FormatStringArgComponent extends FormatStringComponent {
    constructor(argPos, argType) {
        super();
        this.argPos = argPos;
        this.argType = argType;
    }
    emit() {
        return `%{${this.argPos}: ${this.argType.emit()}}`;
    }
}
class AbstractArgumentValue {
}
class SkipArgumentValue extends AbstractArgumentValue {
    constructor() {
        super();
    }
    emit(fmt) {
        return `_`;
    }
}
class StdArgumentValue extends AbstractArgumentValue {
    constructor(exp) {
        super();
        this.exp = exp;
    }
}
class PositionalArgumentValue extends StdArgumentValue {
    constructor(exp) {
        super(exp);
    }
    emit(fmt) {
        return this.exp.emit(true, fmt);
    }
}
class NamedArgumentValue extends StdArgumentValue {
    constructor(name, exp) {
        super(exp);
        this.name = name;
    }
    emit(fmt) {
        return `${this.name} = ${this.exp.emit(true, fmt)}`;
    }
}
class SpreadArgumentValue extends StdArgumentValue {
    constructor(exp) {
        super(exp);
    }
    emit(fmt) {
        return `...${this.exp.emit(true, fmt)}`;
    }
}
class PassingArgumentValue extends StdArgumentValue {
    constructor(kind, exp) {
        super(exp);
        this.kind = kind;
    }
    emit(fmt) {
        return `${this.kind} ${this.exp.emit(true, fmt)}`;
    }
}
class ArgumentList {
    constructor(args) {
        this.args = args;
    }
    emit(fmt, lp, rp) {
        return lp + this.args.map((arg) => arg.emit(fmt)).join(", ") + rp;
    }
    hasSpecialRef() {
        return this.args.some((arg) => arg instanceof PassingArgumentValue);
    }
    hasSpread() {
        return this.args.some((arg) => arg instanceof SpreadArgumentValue);
    }
}
var ExpressionTag;
(function (ExpressionTag) {
    ExpressionTag["Clear"] = "[CLEAR]";
    ExpressionTag["ErrorExpression"] = "ErrorExpression";
    ExpressionTag["LiteralNoneExpression"] = "LiteralNoneExpression";
    ExpressionTag["LiteralBoolExpression"] = "LiteralBoolExpression";
    ExpressionTag["LiteralNatExpression"] = "LiteralNatExpression";
    ExpressionTag["LiteralIntExpression"] = "LiteralIntExpression";
    ExpressionTag["LiteralChkNatExpression"] = "LiteralChkNatExpression";
    ExpressionTag["LiteralChkIntExpression"] = "LiteralChkIntExpression";
    ExpressionTag["LiteralRationalExpression"] = "LiteralRationalExpression";
    ExpressionTag["LiteralFloatExpression"] = "LiteralFloatExpression";
    ExpressionTag["LiteralDecimalExpression"] = "LiteralDecimalExpression";
    ExpressionTag["LiteralDecimalDegreeExpression"] = "LiteralDecimalDegreeExpression";
    ExpressionTag["LiteralLatLongCoordinateExpression"] = "LiteralLatLongCoordinateExpression";
    ExpressionTag["LiteralComplexNumberExpression"] = "LiteralComplexNumberExpression";
    ExpressionTag["LiteralByteBufferExpression"] = "LiteralByteBufferExpression";
    ExpressionTag["LiteralUUIDv4Expression"] = "LiteralUUIDv4Expression";
    ExpressionTag["LiteralUUIDv7Expression"] = "LiteralUUIDv7Expression";
    ExpressionTag["LiteralSHAContentHashExpression"] = "LiteralSHAContentHashExpression";
    ExpressionTag["LiteralTZDateTimeExpression"] = "LiteralTZDateTimeExpression";
    ExpressionTag["LiteralTAITimeExpression"] = "LiteralTAITimeExpression";
    ExpressionTag["LiteralPlainDateExpression"] = "LiteralPlainDateExpression";
    ExpressionTag["LiteralPlainTimeExpression"] = "LiteralPlainTimeExpression";
    ExpressionTag["LiteralLogicalTimeExpression"] = "LiteralLogicalTimeExpression";
    ExpressionTag["LiteralISOTimeStampExpression"] = "LiteralISOTimeStampExpression";
    ExpressionTag["LiteralDeltaDateTimeExpression"] = "LiteralDeltaDateTimeExpression";
    ExpressionTag["LiteralDeltaISOTimeStampExpression"] = "LiteralDeltaISOTimeStampExpression";
    ExpressionTag["LiteralDeltaSecondsExpression"] = "LiteralDeltaSecondsExpression";
    ExpressionTag["LiteralDeltaLogicalExpression"] = "LiteralDeltaLogicalExpression";
    ExpressionTag["LiteralUnicodeRegexExpression"] = "LiteralUnicodeRegexExpression";
    ExpressionTag["LiteralCRegexExpression"] = "LiteralCRegexExpression";
    ExpressionTag["LiteralByteExpression"] = "LiteralByteExpression";
    ExpressionTag["LiteralCCharExpression"] = "LiteralCCharExpression";
    ExpressionTag["LiteralUnicodeCharExpression"] = "LiteralUnicodeCharExpression";
    ExpressionTag["LiteralStringExpression"] = "LiteralStringExpression";
    ExpressionTag["LiteralCStringExpression"] = "LiteralCStringExpression";
    ExpressionTag["LiteralFormatStringExpression"] = "LiteralFormatStringExpression";
    ExpressionTag["LiteralFormatCStringExpression"] = "LiteralFormatCStringExpression";
    ExpressionTag["LiteralPathExpression"] = "LiteralPathExpression";
    ExpressionTag["LiteralPathFragmentExpression"] = "LiteralPathFragmentExpression";
    ExpressionTag["LiteralGlobExpression"] = "LiteralGlobExpression";
    ExpressionTag["LiteralFormatPathExpression"] = "LiteralFormatPathExpression";
    ExpressionTag["LiteralFormatPathFragmentExpression"] = "LiteralFormatPathFragmentExpression";
    ExpressionTag["LiteralFormatGlobExpression"] = "LiteralFormatGlobExpression";
    ExpressionTag["LiteralTypeDeclValueExpression"] = "LiteralTypeDeclValueExpression";
    ExpressionTag["LiteralTypedStringExpression"] = "LiteralTypedStringExpression";
    ExpressionTag["LiteralTypedCStringExpression"] = "LiteralTypedCStringExpression";
    ExpressionTag["LiteralTypedFormatStringExpression"] = "LiteralTypedFormatStringExpression";
    ExpressionTag["LiteralTypedFormatCStringExpression"] = "LiteralTypedFormatCStringExpression";
    ExpressionTag["LiteralTypedPathExpression"] = "LiteralTypedPathExpression";
    ExpressionTag["LiteralTypedPathFormatExpression"] = "LiteralTypedPathFragmentExpression";
    ExpressionTag["AccessEnvValueExpression"] = "AccessEnvValueExpression";
    ExpressionTag["TaskAccessIDExpression"] = "TaskAccessIDExpression";
    ExpressionTag["TaskAccessParentIDExpression"] = "TaskAccessParentIDExpression";
    ExpressionTag["AccessNamespaceConstantExpression"] = "AccessNamespaceConstantExpression";
    ExpressionTag["AccessStaticFieldExpression"] = " AccessStaticFieldExpression";
    ExpressionTag["AccessEnumExpression"] = "AccessEnumExpression";
    ExpressionTag["AccessVariableExpression"] = "AccessVariableExpression";
    ExpressionTag["ConstructorPrimaryExpression"] = "ConstructorPrimaryExpression";
    ExpressionTag["ConstructorEListExpression"] = "ConstructorEListExpression";
    ExpressionTag["ConstructorLambdaExpression"] = "ConstructorLambdaExpression";
    ExpressionTag["LambdaInvokeExpression"] = "LambdaInvokeExpression";
    ExpressionTag["SpecialConstructorExpression"] = "SpecialConstructorExpression";
    ExpressionTag["CallNamespaceFunctionExpression"] = "CallNamespaceFunctionExpression";
    ExpressionTag["CallTypeFunctionExpression"] = "CallTypeFunctionExpression";
    ExpressionTag["CallRefVariableExpression"] = "CallRefVariableExpression";
    ExpressionTag["CallRefThisExpression"] = "CallRefThisExpression";
    ExpressionTag["CallRefSelfExpression"] = "CallRefSelfExpression";
    ExpressionTag["CallTaskActionExpression"] = "CallTaskActionExpression";
    ExpressionTag["ParseAsTypeExpression"] = "ParseAsTypeExpression";
    ExpressionTag["InterpolateFormatExpression"] = "InterpolateFormatExpression";
    ExpressionTag["PostfixOpExpression"] = "PostfixOpExpression";
    ExpressionTag["PrefixNotOpExpression"] = "PrefixNotOpExpression";
    ExpressionTag["PrefixNegateOrPlusOpExpression"] = "PrefixNegateOrPlusOpExpression";
    ExpressionTag["BinAddExpression"] = "BinAddExpression";
    ExpressionTag["BinSubExpression"] = "BinSubExpression";
    ExpressionTag["BinMultExpression"] = "BinMultExpression";
    ExpressionTag["BinDivExpression"] = "BinDivExpression";
    ExpressionTag["BinKeyEqExpression"] = "BinKeyEqExpression";
    ExpressionTag["BinKeyNeqExpression"] = "BinKeyNeqExpression";
    ExpressionTag["KeyCompareEqExpression"] = "KeyCompareEqExpression";
    ExpressionTag["KeyCompareLessExpression"] = "KeyCompareLessExpression";
    ExpressionTag["NumericEqExpression"] = "NumericEqExpression";
    ExpressionTag["NumericNeqExpression"] = "NumericNeqExpression";
    ExpressionTag["NumericLessExpression"] = "NumericLessExpression";
    ExpressionTag["NumericLessEqExpression"] = "NumericLessEqExpression";
    ExpressionTag["NumericGreaterExpression"] = "NumericGreaterExpression";
    ExpressionTag["NumericGreaterEqExpression"] = "NumericGreaterEqExpression";
    ExpressionTag["LogicAndExpression"] = "LogicAndExpression";
    ExpressionTag["LogicOrExpression"] = "LogicOrExpression";
    ExpressionTag["HoleExpression"] = "HoleExpression";
    ExpressionTag["MapEntryConstructorExpression"] = "MapEntryConstructorExpression";
    ExpressionTag["TaskRunExpression"] = "TaskRunExpression";
    ExpressionTag["TaskMultiExpression"] = "TaskMultiExpression";
    ExpressionTag["TaskAllExpression"] = "TaskAllExpression";
    ExpressionTag["TaskDashExpression"] = "TaskDashExpression";
    ExpressionTag["TaskDashAnyExpression"] = "TaskDashAnyExpression";
    ExpressionTag["TaskRaceExpression"] = "TaskRaceExpression";
    ExpressionTag["TaskRaceAnyExpression"] = "TaskRaceAnyExpression";
    ExpressionTag["APIInvokeExpression"] = "APIInvokeExpression";
    ExpressionTag["AgentInvokeExpression"] = "AgentInvokeExpression";
})(ExpressionTag || (ExpressionTag = {}));
class Expression {
    constructor(tag, sinfo) {
        this.etype = undefined;
        this.tag = tag;
        this.sinfo = sinfo;
    }
    getType() {
        assert(this.etype !== undefined, "Type signature not set");
        return this.etype;
    }
    setType(etype) {
        this.etype = etype;
        return etype;
    }
    isLiteralExpression() {
        return false;
    }
}
class ErrorExpression extends Expression {
    constructor(sinfo, staticPrefix, dotaccess) {
        super(ExpressionTag.ErrorExpression, sinfo);
        this.staticPrefix = staticPrefix;
        this.dotaccess = dotaccess;
    }
    emit(toplevel, fmt) {
        return "[!ERROR_EXP!]";
    }
}
class LiteralNoneExpression extends Expression {
    constructor(tag, sinfo) {
        super(tag, sinfo);
    }
    isLiteralExpression() {
        return true;
    }
    emit(toplevel, fmt) {
        return "none";
    }
}
class LiteralSimpleExpression extends Expression {
    constructor(tag, sinfo, value) {
        super(tag, sinfo);
        this.resolvedValue = undefined; //e.g. for string types after unescaping
        this.value = value;
    }
    isLiteralExpression() {
        return true;
    }
    emit(toplevel, fmt) {
        return this.value;
    }
}
class LiteralStringExpression extends Expression {
    constructor(sinfo, value) {
        super(ExpressionTag.LiteralStringExpression, sinfo);
        this.resolvedValue = undefined; //e.g. for string types after unescaping
        this.value = value;
    }
    isLiteralExpression() {
        return true;
    }
    emit(toplevel, fmt) {
        return this.value;
    }
}
class LiteralCStringExpression extends Expression {
    constructor(sinfo, value) {
        super(ExpressionTag.LiteralCStringExpression, sinfo);
        this.resolvedValue = undefined; //e.g. for string types after unescaping
        this.value = value;
    }
    isLiteralExpression() {
        return true;
    }
    emit(toplevel, fmt) {
        return this.value;
    }
}
class LiteralFormatStringExpression extends Expression {
    constructor(sinfo, value, fmts) {
        super(ExpressionTag.LiteralFormatStringExpression, sinfo);
        this.value = value;
        this.fmts = fmts;
    }
    isLiteralExpression() {
        return true;
    }
    emit(toplevel, fmt) {
        return this.value;
    }
}
class LiteralFormatCStringExpression extends Expression {
    constructor(sinfo, value, fmts) {
        super(ExpressionTag.LiteralFormatCStringExpression, sinfo);
        this.value = value;
        this.fmts = fmts;
    }
    isLiteralExpression() {
        return true;
    }
    emit(toplevel, fmt) {
        return this.value;
    }
}
class LiteralRegexExpression extends Expression {
    constructor(tag, sinfo, inns, value) {
        super(tag, sinfo);
        this.inns = inns;
        this.value = value;
    }
    isLiteralExpression() {
        return true;
    }
    emit(toplevel, fmt) {
        return this.value;
    }
}
class LiteralPathItemExpression extends Expression {
    constructor(tag, sinfo, value) {
        super(tag, sinfo);
        this.value = value;
    }
    isLiteralExpression() {
        return true;
    }
    emit(toplevel, fmt) {
        return this.value;
    }
}
class LiteralFormatPathItemExpression extends Expression {
    constructor(tag, sinfo, value, fmts) {
        super(tag, sinfo);
        this.value = value;
        this.fmts = fmts;
    }
    isLiteralExpression() {
        return true;
    }
    emit(toplevel, fmt) {
        return this.value;
    }
}
class LiteralTypeDeclValueExpression extends Expression {
    constructor(sinfo, value, constype) {
        super(ExpressionTag.LiteralTypeDeclValueExpression, sinfo);
        this.value = value;
        this.constype = constype;
    }
    isLiteralExpression() {
        return true;
    }
    emit(toplevel, fmt) {
        return `${this.value.emit(toplevel, fmt)}<${this.constype.emit()}>`;
    }
}
class LiteralTypedStringExpression extends Expression {
    constructor(sinfo, value, constype) {
        super(ExpressionTag.LiteralTypedStringExpression, sinfo);
        this.resolvedValue = undefined; //e.g. for string types after unescaping
        this.value = value;
        this.constype = constype;
    }
    isLiteralExpression() {
        return true;
    }
    emit(toplevel, fmt) {
        return `${this.value}<${this.constype.emit()}>`;
    }
}
class LiteralTypedCStringExpression extends Expression {
    constructor(sinfo, value, constype) {
        super(ExpressionTag.LiteralTypedCStringExpression, sinfo);
        this.resolvedValue = undefined; //e.g. for string types after unescaping
        this.value = value;
        this.constype = constype;
    }
    isLiteralExpression() {
        return true;
    }
    emit(toplevel, fmt) {
        return `${this.value}<${this.constype.emit()}>`;
    }
}
class LiteralTypedFormatStringExpression extends Expression {
    constructor(sinfo, value, fmts, constype) {
        super(ExpressionTag.LiteralTypedFormatStringExpression, sinfo);
        this.value = value;
        this.fmts = fmts;
        this.constype = constype;
    }
    isLiteralExpression() {
        return true;
    }
    emit(toplevel, fmt) {
        return `${this.value}<${this.constype.emit()}>`;
    }
}
class LiteralTypedFormatCStringExpression extends Expression {
    constructor(sinfo, value, fmts, constype) {
        super(ExpressionTag.LiteralTypedFormatCStringExpression, sinfo);
        this.value = value;
        this.fmts = fmts;
        this.constype = constype;
    }
    isLiteralExpression() {
        return true;
    }
    emit(toplevel, fmt) {
        return `'${this.value}'<${this.constype.emit()}>`;
    }
}
class LiteralTypedPathExpression extends Expression {
    constructor(sinfo, value, constype) {
        super(ExpressionTag.LiteralTypedPathExpression, sinfo);
        this.value = value;
        this.constype = constype;
    }
    isLiteralExpression() {
        return true;
    }
    emit(toplevel, fmt) {
        return `${this.value}<${this.constype.emit()}>`;
    }
}
class LiteralTypedPathFormatExpression extends Expression {
    constructor(sinfo, value, constype) {
        super(ExpressionTag.LiteralTypedPathFormatExpression, sinfo);
        this.value = value;
        this.constype = constype;
    }
    isLiteralExpression() {
        return true;
    }
    emit(toplevel, fmt) {
        return `${this.value}<${this.constype.emit()}>`;
    }
}
class AccessEnvValueExpression extends Expression {
    constructor(sinfo, opname, keyname) {
        super(ExpressionTag.AccessEnvValueExpression, sinfo);
        this.resolvedkey = undefined;
        this.optoftype = undefined;
        this.mustdefined = false;
        this.opname = opname;
        this.keyname = keyname;
    }
    emit(toplevel, fmt) {
        if (this.opname === undefined) {
            return `env.${this.keyname}`;
        }
        else {
            return `env.${this.opname}('${this.keyname}')`;
        }
    }
}
class TaskAccessInfoExpression extends Expression {
    constructor(tag, sinfo, name) {
        super(tag, sinfo);
        this.name = name;
    }
    emit(toplevel, fmt) {
        return `Task::${this.name}()`;
    }
}
class AccessNamespaceConstantExpression extends Expression {
    constructor(sinfo, isImplicitNS, ns, name) {
        super(ExpressionTag.AccessNamespaceConstantExpression, sinfo);
        this.ns = ns;
        this.isImplicitNS = isImplicitNS;
        this.name = name;
    }
    emit(toplevel, fmt) {
        return `${!this.isImplicitNS ? (this.ns.emit() + "::") : ""}${this.name}`;
    }
}
class AccessStaticFieldExpression extends Expression {
    constructor(sinfo, stype, name) {
        super(ExpressionTag.AccessStaticFieldExpression, sinfo);
        this.resolvedDeclType = undefined;
        this.stype = stype;
        this.name = name;
    }
    emit(toplevel, fmt) {
        return `${this.stype.emit()}::${this.name}`;
    }
}
class AccessEnumExpression extends Expression {
    constructor(sinfo, stype, name) {
        super(ExpressionTag.AccessEnumExpression, sinfo);
        this.stype = stype;
        this.name = name;
    }
    isLiteralExpression() {
        return true;
    }
    emit(toplevel, fmt) {
        return `${this.stype.emit()}#${this.name}`;
    }
}
class AccessVariableExpression extends Expression {
    constructor(sinfo, srcname) {
        super(ExpressionTag.AccessVariableExpression, sinfo);
        this.isParameter = false;
        this.isCaptured = false;
        this.ocapture = undefined;
        this.srcname = srcname;
    }
    emit(toplevel, fmt) {
        return this.srcname;
    }
}
class ConstructorExpression extends Expression {
    constructor(tag, sinfo, args) {
        super(tag, sinfo);
        this.args = args;
    }
}
class ConstructorPrimaryExpression extends ConstructorExpression {
    constructor(sinfo, ctype, args) {
        super(ExpressionTag.ConstructorPrimaryExpression, sinfo, args);
        this.elemtype = undefined;
        this.shuffleinfo = [];
        this.ctype = ctype;
    }
    emit(toplevel, fmt) {
        return `${this.ctype.emit()}${this.args.emit(fmt, "{", "}")}`;
    }
}
class ConstructorEListExpression extends ConstructorExpression {
    constructor(sinfo, args) {
        super(ExpressionTag.ConstructorEListExpression, sinfo, args);
    }
    emit(toplevel, fmt) {
        return this.args.emit(fmt, "(|", "|)");
    }
}
class ConstructorLambdaExpression extends Expression {
    constructor(sinfo, invoke) {
        super(ExpressionTag.ConstructorLambdaExpression, sinfo);
        this.monomorphizedUID = undefined;
        this.lcaptures = undefined;
        this.invoke = invoke;
    }
    emit(toplevel, fmt) {
        return this.invoke.emit(fmt);
    }
}
class SpecialConstructorExpression extends Expression {
    constructor(sinfo, rop, arg) {
        super(ExpressionTag.SpecialConstructorExpression, sinfo);
        this.constype = undefined;
        this.rop = rop;
        this.arg = arg;
    }
    emit(toplevel, fmt) {
        return `${this.rop}(${this.arg.emit(toplevel, fmt)})`;
    }
}
class LambdaInvokeExpression extends Expression {
    constructor(sinfo, name, rec, args) {
        super(ExpressionTag.LambdaInvokeExpression, sinfo);
        this.isCapturedLambda = false;
        this.ocapture = undefined;
        this.lambda = undefined;
        this.arginfo = [];
        this.resttype = undefined;
        this.restinfo = undefined;
        this.setcondout = [];
        this.setuncond = [];
        this.inout = [];
        this.byref = [];
        this.monoinvid = undefined;
        this.name = name;
        this.rec = rec;
        this.args = args;
    }
    emit(toplevel, fmt) {
        let rec = "";
        if (this.rec !== "no") {
            rec = "[" + (this.rec === "yes" ? "recursive" : "recursive?") + "]";
        }
        return `${this.name}${rec}${this.args.emit(fmt, "(", ")")}`;
    }
}
class CallNamespaceFunctionExpression extends Expression {
    constructor(sinfo, isImplicitNS, ns, name, terms, rec, args) {
        super(ExpressionTag.CallNamespaceFunctionExpression, sinfo);
        this.resolvedFunction = undefined;
        this.shuffleinfo = [];
        this.resttype = undefined;
        this.restinfo = undefined;
        this.setcondout = [];
        this.setuncond = [];
        this.inout = [];
        this.byref = [];
        this.monoinvid = undefined;
        this.ns = ns;
        this.isImplicitNS = isImplicitNS;
        this.name = name;
        this.rec = rec;
        this.terms = terms;
        this.args = args;
    }
    emit(toplevel, fmt) {
        let rec = "";
        if (this.rec !== "no") {
            rec = "[" + (this.rec === "yes" ? "recursive" : "recursive?") + "]";
        }
        let terms = "";
        if (this.terms.length !== 0) {
            terms = "<" + this.terms.map((tt) => tt.emit()).join(", ") + ">";
        }
        return `${!this.isImplicitNS ? (this.ns.emit() + "::") : ""}${this.name}${rec}${terms}${this.args.emit(fmt, "(", ")")}`;
    }
}
class CallTypeFunctionExpression extends Expression {
    constructor(sinfo, ttype, name, terms, rec, args) {
        super(ExpressionTag.CallTypeFunctionExpression, sinfo);
        this.isSpecialCall = false;
        this.resolvedDeclType = undefined;
        this.resolvedFunction = undefined;
        this.shuffleinfo = [];
        this.resttype = undefined;
        this.restinfo = undefined;
        this.setcondout = [];
        this.setuncond = [];
        this.inout = [];
        this.byref = [];
        this.monoinvid = undefined;
        this.ttype = ttype;
        this.name = name;
        this.rec = rec;
        this.terms = terms;
        this.args = args;
    }
    emit(toplevel, fmt) {
        let rec = "";
        if (this.rec !== "no") {
            rec = "[" + (this.rec === "yes" ? "recursive" : "recursive?") + "]";
        }
        let terms = "";
        if (this.terms.length !== 0) {
            terms = "<" + this.terms.map((tt) => tt.emit()).join(", ") + ">";
        }
        return `${this.ttype.emit()}::${this.name}${rec}${terms}${this.args.emit(fmt, "(", ")")}`;
    }
}
class CallRefInvokeExpression extends Expression {
    constructor(tag, sinfo, rcvr, specificResolve, name, terms, rec, args) {
        super(tag, sinfo);
        this.resolvedDeclType = undefined;
        this.resolvedMethodDecl = undefined;
        this.resolvedImplType = undefined;
        this.resolvedMethodImpl = undefined; //can stay undefined if virtual
        this.shuffleinfo = [];
        this.resttype = undefined;
        this.restinfo = undefined;
        this.setcondout = [];
        this.setuncond = [];
        this.inout = [];
        this.byref = [];
        this.monoinvid = undefined;
        this.rcvr = rcvr;
        this.specificResolve = specificResolve;
        this.name = name;
        this.rec = rec;
        this.terms = terms;
        this.args = args;
    }
    emit(toplevel, fmt) {
        let rec = "";
        if (this.rec !== "no") {
            rec = "[" + (this.rec === "yes" ? "recursive" : "recursive?") + "]";
        }
        let terms = "";
        if (this.terms.length !== 0) {
            terms = "<" + this.terms.map((tt) => tt.emit()).join(", ") + ">";
        }
        return `ref ${this.rcvr.emit(true, fmt)}.${this.specificResolve ? this.specificResolve.emit() + "::" : ""}${this.name}${rec}${terms}${this.args.emit(fmt, "(", ")")}`;
    }
}
class CallRefVariableExpression extends CallRefInvokeExpression {
    constructor(sinfo, rcvr, specificResolve, name, terms, rec, args) {
        super(ExpressionTag.CallRefVariableExpression, sinfo, rcvr, specificResolve, name, terms, rec, args);
    }
}
class CallRefThisExpression extends CallRefInvokeExpression {
    constructor(sinfo, rcvr, specificResolve, name, terms, rec, args) {
        super(ExpressionTag.CallRefThisExpression, sinfo, rcvr, specificResolve, name, terms, rec, args);
    }
}
class CallRefSelfExpression extends CallRefInvokeExpression {
    constructor(sinfo, rcvr, name, terms, rec, args) {
        super(ExpressionTag.CallRefSelfExpression, sinfo, rcvr, undefined, name, terms, rec, args);
    }
}
class CallTaskActionExpression extends Expression {
    constructor(sinfo, name, terms, args) {
        super(ExpressionTag.CallTaskActionExpression, sinfo);
        this.name = name;
        this.terms = terms;
        this.args = args;
    }
    emit(toplevel, fmt) {
        let terms = "";
        if (this.terms.length !== 0) {
            terms = "<" + this.terms.map((tt) => tt.emit()).join(", ") + ">";
        }
        return `do self.${this.name}${terms}${this.args.emit(fmt, "(", ")")}`;
    }
}
class ParseAsTypeExpression extends Expression {
    constructor(sinfo, exp, ttype) {
        super(ExpressionTag.ParseAsTypeExpression, sinfo);
        this.exp = exp;
        this.ttype = ttype;
    }
    emit(toplevel, fmt) {
        return `<${this.ttype.emit()}>(${this.exp.emit(toplevel, fmt)})`;
    }
}
class InterpolateFormatExpression extends Expression {
    constructor(sinfo, kind, decloftype, fmtString, args) {
        super(ExpressionTag.InterpolateFormatExpression, sinfo);
        this.actualoftype = undefined;
        this.kind = kind;
        this.decloftype = decloftype;
        this.fmtString = fmtString;
        this.args = args;
    }
    emit(toplevel, fmt) {
        const fmtStr = this.fmtString.emit(true, fmt);
        const argsStr = this.args.map((a) => a.emit(fmt)).join(", ");
        return `Interpolate::${this.kind}${this.decloftype !== undefined ? `<${this.decloftype.emit()}>` : ""}(${fmtStr}, ${argsStr})`;
    }
}
var PostfixOpTag;
(function (PostfixOpTag) {
    PostfixOpTag["PostfixError"] = "PostfixError";
    PostfixOpTag["PostfixAccessFromName"] = "PostfixAccessFromName";
    PostfixOpTag["PostfixProjectFromNames"] = "PostfixProjectFromNames";
    PostfixOpTag["PostfixAccessFromIndex"] = "PostfixAccessFromIndex";
    PostfixOpTag["PostfixIsTest"] = "PostfixIsTest";
    PostfixOpTag["PostfixAsConvert"] = "PostfixAsConvert";
    PostfixOpTag["PostfixAssignFields"] = "PostfixAssignFields";
    PostfixOpTag["PostfixSliceOperator"] = "PostfixSliceOperator";
    PostfixOpTag["PostfixInvoke"] = "PostfixInvoke";
})(PostfixOpTag || (PostfixOpTag = {}));
class PostfixOperation {
    constructor(sinfo, tag) {
        this.rcvrType = undefined;
        this.etype = undefined;
        this.sinfo = sinfo;
        this.tag = tag;
    }
    getRcvrType() {
        assert(this.rcvrType !== undefined, "Type signature not set");
        return this.rcvrType;
    }
    setRcvrType(rcvrType) {
        this.rcvrType = rcvrType;
        return rcvrType;
    }
    getType() {
        assert(this.etype !== undefined, "Type signature not set");
        return this.etype;
    }
    setType(etype) {
        this.etype = etype;
        return etype;
    }
}
class PostfixOp extends Expression {
    constructor(sinfo, root, ops) {
        super(ExpressionTag.PostfixOpExpression, sinfo);
        this.rootExp = root;
        this.ops = ops;
    }
    emit(toplevel, fmt) {
        let res = this.rootExp.emit(false, fmt);
        for (let i = 0; i < this.ops.length; ++i) {
            res += this.ops[i].emit(fmt);
        }
        return res;
    }
}
class PostfixError extends PostfixOperation {
    constructor(sinfo) {
        super(sinfo, PostfixOpTag.PostfixError);
    }
    emit(fmt) {
        return "[!ERROR!]";
    }
}
class PostfixAccessFromName extends PostfixOperation {
    constructor(sinfo, name) {
        super(sinfo, PostfixOpTag.PostfixAccessFromName);
        this.declaredInType = undefined;
        this.fieldDecl = undefined;
        this.fieldType = undefined;
        this.isdirect = false;
        this.name = name;
    }
    emit(fmt) {
        return `.${this.name}`;
    }
}
class PostfixProjectFromNames extends PostfixOperation {
    constructor(sinfo, names) {
        super(sinfo, PostfixOpTag.PostfixProjectFromNames);
        this.names = names;
    }
    emit(fmt) {
        return `.(|${this.names.join(", ")}|)`;
    }
}
class PostfixAccessFromIndex extends PostfixOperation {
    constructor(sinfo, idx) {
        super(sinfo, PostfixOpTag.PostfixAccessFromIndex);
        this.idx = idx;
    }
    emit(fmt) {
        return `.${this.idx}`;
    }
}
class PostfixIsTest extends PostfixOperation {
    constructor(sinfo, ttest) {
        super(sinfo, PostfixOpTag.PostfixIsTest);
        this.ttest = ttest;
    }
    emit(fmt) {
        return ".?" + this.ttest.emit(fmt);
    }
}
class PostfixAsConvert extends PostfixOperation {
    constructor(sinfo, ttest) {
        super(sinfo, PostfixOpTag.PostfixAsConvert);
        this.alwaysSucceeds = false;
        this.ttest = ttest;
    }
    emit(fmt) {
        return ".@" + this.ttest.emit(fmt);
    }
}
class PostfixAssignFields extends PostfixOperation {
    constructor(sinfo, updates) {
        super(sinfo, PostfixOpTag.PostfixAssignFields);
        this.updatetype = undefined;
        this.updateinfo = [];
        this.isdirect = false;
        this.updates = updates;
    }
    emit(fmt) {
        const updates = this.updates.map(([name, exp]) => `${name} = ${exp.emit(true, fmt)}`).join(", ");
        return `[${updates}]`;
    }
}
class PostfixSliceOperator extends PostfixOperation {
    constructor(sinfo, args) {
        super(sinfo, PostfixOpTag.PostfixSliceOperator);
        this.args = args;
    }
    emit(fmt) {
        return `.of${this.args.emit(fmt, "(", ")")}`;
    }
}
class PostfixInvoke extends PostfixOperation {
    constructor(sinfo, specificResolve, name, terms, rec, args) {
        super(sinfo, PostfixOpTag.PostfixInvoke);
        this.resolvedDeclType = undefined;
        this.resolvedMethodDecl = undefined;
        this.resolvedImplType = undefined;
        this.resolvedMethodImpl = undefined; //can stay undefined if virtual
        this.shuffleinfo = [];
        this.resttype = undefined;
        this.restinfo = undefined;
        this.setcondout = [];
        this.setuncond = [];
        this.inout = [];
        this.byref = [];
        this.monoinvid = undefined;
        this.specificResolve = specificResolve;
        this.name = name;
        this.rec = rec;
        this.terms = terms;
        this.args = args;
    }
    emit(fmt) {
        let rec = "";
        if (this.rec !== "no") {
            rec = "[" + (this.rec === "yes" ? "recursive" : "recursive?") + "]";
        }
        let terms = "";
        if (this.terms.length !== 0) {
            terms = "<" + this.terms.map((tt) => tt.emit()).join(", ") + ">";
        }
        return `.${this.specificResolve ? this.specificResolve.emit() + "::" : ""}${this.name}${rec}${terms}${this.args.emit(fmt, "(", ")")}`;
    }
}
class UnaryExpression extends Expression {
    constructor(tag, sinfo, exp) {
        super(tag, sinfo);
        this.opertype = undefined;
        this.exp = exp;
    }
    uopEmit(toplevel, fmt, op) {
        let ee = `${this.exp.emit(false, fmt)}`;
        if (op === "-" || op === "+") {
            ee = `(${ee})`;
        }
        ee = `${op}${ee}`;
        return toplevel ? ee : `(${ee})`;
    }
}
class PrefixNotOpExpression extends UnaryExpression {
    constructor(sinfo, exp) {
        super(ExpressionTag.PrefixNotOpExpression, sinfo, exp);
    }
    emit(toplevel, fmt) {
        return this.uopEmit(toplevel, fmt, "!");
    }
}
class PrefixNegateOrPlusOpExpression extends UnaryExpression {
    constructor(sinfo, exp, op) {
        super(ExpressionTag.PrefixNegateOrPlusOpExpression, sinfo, exp);
        this.op = op;
    }
    emit(toplevel, fmt) {
        return this.uopEmit(toplevel, fmt, this.op);
    }
}
class BinaryArithExpression extends Expression {
    constructor(tag, sinfo, lhs, rhs) {
        super(tag, sinfo);
        this.opertype = undefined;
        this.lhs = lhs;
        this.rhs = rhs;
    }
    baopEmit(toplevel, fmt, op) {
        const ee = `${this.lhs.emit(false, fmt)} ${op} ${this.rhs.emit(false, fmt)}`;
        return toplevel ? ee : `(${ee})`;
    }
}
class BinAddExpression extends BinaryArithExpression {
    constructor(sinfo, lhs, rhs) {
        super(ExpressionTag.BinAddExpression, sinfo, lhs, rhs);
    }
    emit(toplevel, fmt) {
        return this.baopEmit(toplevel, fmt, "+");
    }
}
class BinSubExpression extends BinaryArithExpression {
    constructor(sinfo, lhs, rhs) {
        super(ExpressionTag.BinSubExpression, sinfo, lhs, rhs);
    }
    emit(toplevel, fmt) {
        return this.baopEmit(toplevel, fmt, "-");
    }
}
class BinMultExpression extends BinaryArithExpression {
    constructor(sinfo, lhs, rhs) {
        super(ExpressionTag.BinMultExpression, sinfo, lhs, rhs);
    }
    emit(toplevel, fmt) {
        return this.baopEmit(toplevel, fmt, "*");
    }
}
class BinDivExpression extends BinaryArithExpression {
    constructor(sinfo, lhs, rhs) {
        super(ExpressionTag.BinDivExpression, sinfo, lhs, rhs);
    }
    emit(toplevel, fmt) {
        return this.baopEmit(toplevel, fmt, "//");
    }
}
class BinaryKeyExpression extends Expression {
    constructor(tag, sinfo, lhs, rhs) {
        super(tag, sinfo);
        this.opertype = undefined;
        this.lhs = lhs;
        this.rhs = rhs;
    }
    bkopEmit(toplevel, fmt, op) {
        const ee = `${this.lhs.emit(false, fmt)} ${op} ${this.rhs.emit(false, fmt)}`;
        return toplevel ? ee : `(${ee})`;
    }
}
class BinKeyEqExpression extends BinaryKeyExpression {
    constructor(sinfo, lhs, rhs) {
        super(ExpressionTag.BinKeyEqExpression, sinfo, lhs, rhs);
    }
    emit(toplevel, fmt) {
        return this.bkopEmit(toplevel, fmt, "===");
    }
}
class BinKeyNeqExpression extends BinaryKeyExpression {
    constructor(sinfo, lhs, rhs) {
        super(ExpressionTag.BinKeyNeqExpression, sinfo, lhs, rhs);
    }
    emit(toplevel, fmt) {
        return this.bkopEmit(toplevel, fmt, "!==");
    }
}
class KeyCompareEqExpression extends Expression {
    constructor(sinfo, ktype, lhs, rhs) {
        super(ExpressionTag.KeyCompareEqExpression, sinfo);
        this.optype = undefined;
        this.ktype = ktype;
        this.lhs = lhs;
        this.rhs = rhs;
    }
    emit(toplevel, fmt) {
        return `KeyComparator::equal<${this.ktype.emit()}>(${this.lhs.emit(false, fmt)}, ${this.rhs.emit(false, fmt)})`;
    }
}
class KeyCompareLessExpression extends Expression {
    constructor(sinfo, ktype, lhs, rhs) {
        super(ExpressionTag.KeyCompareLessExpression, sinfo);
        this.optype = undefined;
        this.ktype = ktype;
        this.lhs = lhs;
        this.rhs = rhs;
    }
    emit(toplevel, fmt) {
        return `KeyComparator::less<${this.ktype.emit()}>(${this.lhs.emit(false, fmt)}, ${this.rhs.emit(false, fmt)})`;
    }
}
class BinaryNumericExpression extends Expression {
    constructor(tag, sinfo, lhs, rhs) {
        super(tag, sinfo);
        this.opertype = undefined;
        this.lhs = lhs;
        this.rhs = rhs;
    }
    bnopEmit(toplevel, fmt, op) {
        const ee = `${this.lhs.emit(false, fmt)} ${op} ${this.rhs.emit(false, fmt)}`;
        return toplevel ? ee : `(${ee})`;
    }
}
class NumericEqExpression extends BinaryNumericExpression {
    constructor(sinfo, lhs, rhs) {
        super(ExpressionTag.NumericEqExpression, sinfo, lhs, rhs);
    }
    emit(toplevel, fmt) {
        return this.bnopEmit(toplevel, fmt, "==");
    }
}
class NumericNeqExpression extends BinaryNumericExpression {
    constructor(sinfo, lhs, rhs) {
        super(ExpressionTag.NumericNeqExpression, sinfo, lhs, rhs);
    }
    emit(toplevel, fmt) {
        return this.bnopEmit(toplevel, fmt, "!=");
    }
}
class NumericLessExpression extends BinaryNumericExpression {
    constructor(sinfo, lhs, rhs) {
        super(ExpressionTag.NumericLessExpression, sinfo, lhs, rhs);
    }
    emit(toplevel, fmt) {
        return this.bnopEmit(toplevel, fmt, "<");
    }
}
class NumericLessEqExpression extends BinaryNumericExpression {
    constructor(sinfo, lhs, rhs) {
        super(ExpressionTag.NumericLessEqExpression, sinfo, lhs, rhs);
    }
    emit(toplevel, fmt) {
        return this.bnopEmit(toplevel, fmt, "<=");
    }
}
class NumericGreaterExpression extends BinaryNumericExpression {
    constructor(sinfo, lhs, rhs) {
        super(ExpressionTag.NumericGreaterExpression, sinfo, lhs, rhs);
    }
    emit(toplevel, fmt) {
        return this.bnopEmit(toplevel, fmt, ">");
    }
}
class NumericGreaterEqExpression extends BinaryNumericExpression {
    constructor(sinfo, lhs, rhs) {
        super(ExpressionTag.NumericGreaterEqExpression, sinfo, lhs, rhs);
    }
    emit(toplevel, fmt) {
        return this.bnopEmit(toplevel, fmt, ">=");
    }
}
class LogicExpression extends Expression {
    constructor(tag, sinfo, exps) {
        super(tag, sinfo);
        this.exps = exps;
    }
    blopEmit(toplevel, fmt, op) {
        const ee = this.exps.map((e) => e.emit(false, fmt)).join(` ${op} `);
        return toplevel ? ee : `(${ee})`;
    }
}
class LogicAndExpression extends LogicExpression {
    constructor(sinfo, exps) {
        super(ExpressionTag.LogicAndExpression, sinfo, exps);
    }
    emit(toplevel, fmt) {
        return this.blopEmit(toplevel, fmt, "&&");
    }
}
class LogicOrExpression extends LogicExpression {
    constructor(sinfo, exps) {
        super(ExpressionTag.LogicOrExpression, sinfo, exps);
    }
    emit(toplevel, fmt) {
        return this.blopEmit(toplevel, fmt, "||");
    }
}
class HoleExpression extends Expression {
    constructor(sinfo, hname, captures, explicittype, doccomment, samplesfile) {
        super(ExpressionTag.HoleExpression, sinfo);
        this.hname = hname;
        this.captures = captures;
        this.explicittype = explicittype;
        this.doccomment = doccomment;
        this.samplesfile = samplesfile;
    }
    emit(toplevel, fmt) {
        const etype = this.explicittype ? ` -> ${this.explicittype.emit()}` : "";
        let ebody = "";
        if (this.doccomment !== undefined || this.samplesfile !== undefined) {
            const dcom = this.doccomment !== undefined ? `%** ${this.doccomment} **%` : "";
            const samplstr = this.samplesfile !== undefined ? ` of ${this.samplesfile.emit(false, fmt)}` : "";
            ebody = `(${dcom})${samplstr}`;
        }
        const hb = `?_${this.hname || ""}${this.captures.length !== 0 ? ("[" + this.captures.join(", ") + "]") : ""}${ebody}${etype}`;
        return toplevel ? hb : `(${hb})`;
    }
}
class MapEntryConstructorExpression extends Expression {
    constructor(sinfo, kexp, vexp) {
        super(ExpressionTag.MapEntryConstructorExpression, sinfo);
        this.ctype = undefined;
        this.kexp = kexp;
        this.vexp = vexp;
    }
    emit(toplevel, fmt) {
        return `${this.kexp.emit(toplevel, fmt)} => ${this.vexp.emit(toplevel, fmt)}`;
    }
}
var EnvironmentGenerationExpressionTag;
(function (EnvironmentGenerationExpressionTag) {
    EnvironmentGenerationExpressionTag["ErrorEnvironmentExpression"] = "ErrorEnvironmentExpression";
    EnvironmentGenerationExpressionTag["EmptyEnvironmentExpression"] = "EmptyEnvironmentExpression";
    EnvironmentGenerationExpressionTag["InitializeEnvironmentExpression"] = "InitializeEnvironmentExpression";
    EnvironmentGenerationExpressionTag["CurrentEnvironmentExpression"] = "CurrentEnvironmentExpression";
})(EnvironmentGenerationExpressionTag || (EnvironmentGenerationExpressionTag = {}));
class EnvironmentGenerationExpression {
    constructor(tag, sinfo) {
        this.tag = tag;
        this.sinfo = sinfo;
    }
}
class ErrorEnvironmentExpression extends EnvironmentGenerationExpression {
    constructor(sinfo) {
        super(EnvironmentGenerationExpressionTag.ErrorEnvironmentExpression, sinfo);
    }
    emit(fmt) {
        return "[!ERROR!]";
    }
}
class EmptyEnvironmentExpression extends EnvironmentGenerationExpression {
    constructor(sinfo) {
        super(EnvironmentGenerationExpressionTag.EmptyEnvironmentExpression, sinfo);
    }
    emit(fmt) {
        return "env{}";
    }
}
class InitializeEnvironmentExpression extends EnvironmentGenerationExpression {
    constructor(sinfo, args) {
        super(EnvironmentGenerationExpressionTag.InitializeEnvironmentExpression, sinfo);
        this.args = args;
    }
    emit(fmt) {
        const argl = this.args.map((arg) => `${arg.envkey} = ${arg.value.emit(true, fmt)}`).join(", ");
        return `env{ ${argl} }`;
    }
}
class CurrentEnvironmentExpression extends EnvironmentGenerationExpression {
    constructor(sinfo) {
        super(EnvironmentGenerationExpressionTag.CurrentEnvironmentExpression, sinfo);
    }
    emit(fmt) {
        return "env";
    }
}
class TaskInvokeExpression extends Expression {
    constructor(tag, sinfo) {
        super(tag, sinfo);
    }
    static emitconfigs(configs, fmt) {
        const ccf = configs.emit();
        if (ccf === undefined) {
            return "";
        }
        else {
            return `[${ccf}]`;
        }
    }
}
class TaskRunExpression extends TaskInvokeExpression {
    constructor(sinfo, task, args, envexp, configs) {
        super(ExpressionTag.TaskRunExpression, sinfo);
        this.task = task;
        this.configs = configs;
        this.args = args;
        this.envexp = envexp;
    }
    emit(toplevel, fmt) {
        const configs = TaskInvokeExpression.emitconfigs(this.configs, fmt);
        const envexp = this.envexp.emit(fmt);
        const argl = this.args.map((arg) => arg.emit(true, fmt)).join(", ");
        return `Task::run<${this.task.emit()}${configs}>(${envexp}${argl !== "" ? (", " + argl) : ""})`;
    }
}
class TaskMultiExpression extends TaskInvokeExpression {
    constructor(sinfo, execmode, tasks, args) {
        super(ExpressionTag.TaskMultiExpression, sinfo);
        this.execmode = execmode;
        this.tasks = tasks;
        this.args = args;
    }
    emit(toplevel, fmt) {
        const taskstrs = this.tasks.map((tt) => {
            const configs = TaskInvokeExpression.emitconfigs(tt[1], fmt);
            return `${tt[0].emit()}${configs}`;
        });
        const argl = this.args.map((arg) => {
            const envexp = arg[1].emit(fmt);
            const argexp = arg[0].map((a) => a.emit(true, fmt)).join(", ");
            return `${envexp}${argexp !== "" ? (", " + argexp) : ""}`;
        });
        return `${this.execmode !== "std" ? `${this.execmode} ` : ""}Task::multi<${taskstrs.join(", ")}>(${argl.join("; ")})`;
    }
}
class TaskAllExpression extends TaskInvokeExpression {
    constructor(sinfo, execmode, task, args, envexp, configs) {
        super(ExpressionTag.TaskAllExpression, sinfo);
        this.execmode = execmode;
        this.task = task;
        this.configs = configs;
        this.args = args;
        this.envexp = envexp;
    }
    emit(toplevel, fmt) {
        const configs = TaskInvokeExpression.emitconfigs(this.configs, fmt);
        const envexp = this.envexp.emit(fmt);
        const argl = this.args.emit(true, fmt);
        return `${this.execmode !== "std" ? `${this.execmode} ` : ""}Task::all<${this.task.emit()}${configs}>(${envexp}, ${argl})`;
    }
}
class TaskDashExpression extends TaskInvokeExpression {
    constructor(sinfo, execmode, tasks, args) {
        super(ExpressionTag.TaskDashExpression, sinfo);
        this.execmode = execmode;
        this.tasks = tasks;
        this.args = args;
    }
    emit(toplevel, fmt) {
        const taskstrs = this.tasks.map((tt) => {
            const configs = TaskInvokeExpression.emitconfigs(tt[1], fmt);
            return `${tt[0].emit()}${configs}`;
        });
        const argl = this.args.map((arg) => {
            const envexp = arg[1].emit(fmt);
            const argexp = arg[0].map((a) => a.emit(true, fmt)).join(", ");
            return `${envexp}${argexp !== "" ? (", " + argexp) : ""}`;
        });
        return `${this.execmode !== "std" ? `${this.execmode} ` : ""}Task::dash<${taskstrs.join(", ")}>(${argl.join("; ")})`;
    }
}
class TaskDashAnyExpression extends TaskInvokeExpression {
    constructor(sinfo, execmode, tasks, args) {
        super(ExpressionTag.TaskDashAnyExpression, sinfo);
        this.execmode = execmode;
        this.tasks = tasks;
        this.args = args;
    }
    emit(toplevel, fmt) {
        const taskstrs = this.tasks.map((tt) => {
            const configs = TaskInvokeExpression.emitconfigs(tt[1], fmt);
            return `${tt[0].emit()}${configs}`;
        });
        const argl = this.args.map((arg) => {
            const envexp = arg[1].emit(fmt);
            const argexp = arg[0].map((a) => a.emit(true, fmt)).join(", ");
            return `${envexp}${argexp !== "" ? (", " + argexp) : ""}`;
        });
        return `${this.execmode !== "std" ? `${this.execmode} ` : ""}Task::dashAny<${taskstrs.join(", ")}>(${argl.join("; ")})`;
    }
}
class TaskRaceExpression extends TaskInvokeExpression {
    constructor(sinfo, execmode, task, args, envexp, configs) {
        super(ExpressionTag.TaskRaceExpression, sinfo);
        this.execmode = execmode;
        this.task = task;
        this.configs = configs;
        this.args = args;
        this.envexp = envexp;
    }
    emit(toplevel, fmt) {
        const configs = TaskInvokeExpression.emitconfigs(this.configs, fmt);
        const envexp = this.envexp.emit(fmt);
        const argl = this.args.emit(true, fmt);
        return `${this.execmode !== "std" ? `${this.execmode} ` : ""}Task::race<${this.task.emit()}${configs}>(${envexp}, ${argl})`;
    }
}
class TaskRaceAnyExpression extends TaskInvokeExpression {
    constructor(sinfo, execmode, task, args, envexp, configs) {
        super(ExpressionTag.TaskRaceAnyExpression, sinfo);
        this.execmode = execmode;
        this.task = task;
        this.configs = configs;
        this.args = args;
        this.envexp = envexp;
    }
    emit(toplevel, fmt) {
        const configs = TaskInvokeExpression.emitconfigs(this.configs, fmt);
        const envexp = this.envexp.emit(fmt);
        const argl = this.args.emit(true, fmt);
        return `${this.execmode !== "std" ? `${this.execmode} ` : ""}Task::raceAny<${this.task.emit()}${configs}>(${envexp}, ${argl})`;
    }
}
class APIInvokeExpression extends Expression {
    constructor(sinfo, ns, api, args, envexp, configs) {
        super(ExpressionTag.APIInvokeExpression, sinfo);
        this.ns = ns;
        this.api = api;
        this.args = args;
        this.envexp = envexp;
        this.configs = configs;
    }
    emit(toplevel, fmt) {
        const nsstr = this.ns.emit() + "::";
        const configs = TaskInvokeExpression.emitconfigs(this.configs, fmt);
        const envexp = this.envexp.emit(fmt);
        const argl = this.args.map((arg) => arg.emit(true, fmt)).join(", ");
        return `api ${nsstr}${this.api}${configs}(${envexp}${argl !== "" ? (", " + argl) : ""})`;
    }
}
class AgentInvokeExpression extends Expression {
    constructor(sinfo, ns, agent, optrestype, args, envexp, configs) {
        super(ExpressionTag.AgentInvokeExpression, sinfo);
        this.ns = ns;
        this.agent = agent;
        this.optrestype = optrestype;
        this.args = args;
        this.envexp = envexp;
        this.configs = configs;
    }
    emit(toplevel, fmt) {
        const nsstr = this.ns.emit() + "::";
        const restypeStr = this.optrestype ? `<${this.optrestype.emit()}>` : "";
        const configs = TaskInvokeExpression.emitconfigs(this.configs, fmt);
        const envexp = this.envexp.emit(fmt);
        const argl = this.args.map((arg) => arg.emit(true, fmt)).join(", ");
        return `agent ${nsstr}${this.agent}${configs}${restypeStr}(${envexp}${argl !== "" ? (", " + argl) : ""})`;
    }
}
var ChkLogicExpressionTag;
(function (ChkLogicExpressionTag) {
    ChkLogicExpressionTag["ChkLogicImpliesExpression"] = "ChkLogicImpliesExpression";
    ChkLogicExpressionTag["ChkLogicBaseExpression"] = "ChkLogicBaseExpression";
})(ChkLogicExpressionTag || (ChkLogicExpressionTag = {}));
class ChkLogicExpression {
    constructor(tag) {
        this.tag = tag;
    }
}
class ChkLogicImpliesExpression extends ChkLogicExpression {
    constructor(sinfo, lhs, rhs) {
        super(ChkLogicExpressionTag.ChkLogicImpliesExpression);
        this.bbinds = [];
        this.sinfo = sinfo;
        this.lhs = lhs;
        this.rhs = rhs;
    }
    emit(fmt) {
        return `${this.lhs.emit(fmt)} ==> ${this.rhs.emit(true, fmt)}`;
    }
}
class ChkLogicBaseExpression extends ChkLogicExpression {
    constructor(exp) {
        super(ChkLogicExpressionTag.ChkLogicBaseExpression);
        this.exp = exp;
    }
    emit(fmt) {
        return this.exp.emit(true, fmt);
    }
}
var RValueExpressionTag;
(function (RValueExpressionTag) {
    RValueExpressionTag["ConditionalValueExpression"] = "ConditionalValueExpression";
    RValueExpressionTag["ShortCircuitAssignRHSExpressionFail"] = "ShortCircuitAssignRHSExpressionFail";
    RValueExpressionTag["ShortCircuitAssignRHSExpressionReturn"] = "ShortCircuitAssignRHSExpressionReturn";
    RValueExpressionTag["BaseExpression"] = "BaseExpression";
})(RValueExpressionTag || (RValueExpressionTag = {}));
class RValueExpression {
    constructor(tag) {
        this.rtype = undefined;
        this.tag = tag;
    }
}
class ConditionalValueExpression extends RValueExpression {
    constructor(sinfo, guardset, trueValue, falseValue) {
        super(RValueExpressionTag.ConditionalValueExpression);
        this.bbinds = [];
        this.sinfo = sinfo;
        this.guardset = guardset;
        this.trueValue = trueValue;
        this.falseValue = falseValue;
    }
    emit(toplevel, fmt) {
        const ttest = this.guardset.emit(fmt);
        return `${ttest} ?? ${this.trueValue.emit(true, fmt)} : ${this.falseValue.emit(true, fmt)}`;
    }
}
class ShortCircuitAssignRHSITestExpression extends RValueExpression {
    constructor(tag, exp, itest) {
        super(tag);
        this.exp = exp;
        this.itest = itest;
    }
}
class ShortCircuitAssignRHSExpressionFail extends ShortCircuitAssignRHSITestExpression {
    constructor(exp, itest) {
        super(RValueExpressionTag.ShortCircuitAssignRHSExpressionFail, exp, itest);
    }
    emit(toplevel, fmt) {
        return `${this.exp.emit(true, fmt)} @@ ${this.itest.emit(fmt)}`;
    }
}
class ShortCircuitAssignRHSExpressionReturn extends ShortCircuitAssignRHSITestExpression {
    constructor(exp, itest, failexp) {
        super(RValueExpressionTag.ShortCircuitAssignRHSExpressionReturn, exp, itest);
        this.failexp = failexp;
    }
    emit(toplevel, fmt) {
        if (this.failexp === undefined) {
            return `${this.exp.emit(true, fmt)} ?@ ${this.itest.emit(fmt)}`;
        }
        else {
            return `${this.exp.emit(true, fmt)} ?@ ${this.itest.emit(fmt)} : ${this.failexp.emit(true, fmt)}`;
        }
    }
}
class BaseRValueExpression extends RValueExpression {
    constructor(exp) {
        super(RValueExpressionTag.BaseExpression);
        this.exp = exp;
    }
    emit(toplevel, fmt) {
        return this.exp.emit(true, fmt);
    }
}
var StatementTag;
(function (StatementTag) {
    StatementTag["Clear"] = "[CLEAR]";
    StatementTag["ErrorStatement"] = "ErrorStatement";
    StatementTag["EmptyStatement"] = "EmptyStatement";
    StatementTag["VariableDeclarationStatement"] = "VariableDeclarationStatement";
    StatementTag["VariableMultiDeclarationStatement"] = "VariableMultiDeclarationStatement";
    StatementTag["VariableInitializationStatement"] = "VariableInitializationStatement";
    StatementTag["VariableMultiInitializationStatement"] = "VariableMultiInitializationStatement";
    StatementTag["VariableAssignmentStatement"] = "VariableAssignmentStatement";
    StatementTag["VariableMultiAssignmentStatement"] = "VariableMultiAssignmentStatement";
    StatementTag["ReturnVoidStatement"] = "ReturnVoidStatement";
    StatementTag["ReturnSingleStatement"] = "ReturnSingleStatement";
    StatementTag["ReturnMultiStatement"] = "ReturnMultiStatement";
    StatementTag["IfStatement"] = "IfStatement";
    StatementTag["IfElseStatement"] = "IfElseStatement";
    StatementTag["IfElifElseStatement"] = "IfElifElseStatement";
    StatementTag["SwitchStatement"] = "SwitchStatement";
    StatementTag["MatchStatement"] = "MatchStatement";
    StatementTag["DispatchPatternStatement"] = "DispatchPatternStatement";
    StatementTag["DispatchTaskStatement"] = "DispatchTaskStatement";
    StatementTag["AbortStatement"] = "AbortStatement";
    StatementTag["AssertStatement"] = "AssertStatement";
    StatementTag["ValidateStatement"] = "ValidateStatement";
    StatementTag["DebugStatement"] = "DebugStatement";
    StatementTag["VoidRefCallStatement"] = "VoidRefCallStatement";
    StatementTag["VarUpdateStatement"] = "VarUpdateStatement";
    StatementTag["ThisUpdateStatement"] = "ThisUpdateStatement";
    StatementTag["SelfUpdateStatement"] = "SelfUpdateStatement";
    StatementTag["TaskStatusStatement"] = "TaskStatusStatement";
    StatementTag["TaskCheckAndHandleTerminationStatement"] = "TaskCheckAndHandleTerminationStatement";
    StatementTag["TaskYieldStatement"] = "TaskYieldStatement";
    StatementTag["HoleStatement"] = "HoleStatement";
    StatementTag["BlockStatement"] = "BlockStatement";
})(StatementTag || (StatementTag = {}));
class Statement {
    constructor(tag, sinfo) {
        this.tag = tag;
        this.sinfo = sinfo;
    }
}
class ErrorStatement extends Statement {
    constructor(sinfo) {
        super(StatementTag.ErrorStatement, sinfo);
    }
    emit(fmt) {
        return `[error]`;
    }
}
class EmptyStatement extends Statement {
    constructor(sinfo) {
        super(StatementTag.EmptyStatement, sinfo);
    }
    emit(fmt) {
        return ";";
    }
}
class VariableDeclarationStatement extends Statement {
    constructor(sinfo, name, vtype) {
        super(StatementTag.VariableDeclarationStatement, sinfo);
        this.name = name;
        this.vtype = vtype;
    }
    emit(fmt) {
        return `var ${this.name}: ${this.vtype.emit()};`;
    }
}
class VariableMultiDeclarationStatement extends Statement {
    constructor(sinfo, decls) {
        super(StatementTag.VariableMultiDeclarationStatement, sinfo);
        this.decls = decls;
    }
    emit(fmt) {
        return `var ${this.decls.map((dd) => `${dd.name}: ${dd.vtype.emit()}`).join(", ")};`;
    }
}
class VariableInitializationStatement extends Statement {
    constructor(sinfo, vkind, name, vtype, exp) {
        super(StatementTag.VariableInitializationStatement, sinfo);
        this.actualtype = undefined;
        this.vkind = vkind;
        this.name = name;
        this.vtype = vtype;
        this.exp = exp;
    }
    emit(fmt) {
        const tt = this.vtype instanceof AutoTypeSignature ? "" : `: ${this.vtype.emit()}`;
        return `${this.vkind} ${this.name}${tt} = ${this.exp.emit(true, fmt)};`;
    }
}
class VariableMultiInitializationStatement extends Statement {
    constructor(sinfo, vkind, decls, exp) {
        super(StatementTag.VariableMultiInitializationStatement, sinfo);
        this.actualtypes = [];
        this.vkind = vkind;
        this.decls = decls;
        this.exp = exp;
    }
    emit(fmt) {
        const ttdecls = this.decls.map((dd) => dd.name + (dd.vtype instanceof AutoTypeSignature ? "" : `: ${dd.vtype.emit()}`));
        const ttexp = Array.isArray(this.exp) ? this.exp.map((ee) => ee.emit(true, fmt)).join(", ") : this.exp.emit(true, fmt);
        return `${this.vkind} ${ttdecls.join(", ")} = ${ttexp};`;
    }
}
class VariableAssignmentStatement extends Statement {
    constructor(sinfo, name, exp) {
        super(StatementTag.VariableAssignmentStatement, sinfo);
        this.vtype = undefined;
        this.name = name;
        this.exp = exp;
    }
    emit(fmt) {
        return `${this.name} = ${this.exp.emit(true, fmt)};`;
    }
}
class VariableMultiAssignmentStatement extends Statement {
    constructor(sinfo, names, exp) {
        super(StatementTag.VariableMultiAssignmentStatement, sinfo);
        this.vtypes = [];
        this.names = names;
        this.exp = exp;
    }
    emit(fmt) {
        const ttname = this.names.join(", ");
        const ttexp = Array.isArray(this.exp) ? this.exp.map((ee) => ee.emit(true, fmt)).join(", ") : this.exp.emit(true, fmt);
        return `${ttname} = ${ttexp};`;
    }
}
class ReturnVoidStatement extends Statement {
    constructor(sinfo) {
        super(StatementTag.ReturnVoidStatement, sinfo);
    }
    emit(fmt) {
        return `return;`;
    }
}
class ReturnSingleStatement extends Statement {
    constructor(sinfo, value) {
        super(StatementTag.ReturnSingleStatement, sinfo);
        this.rtype = undefined;
        this.value = value;
    }
    emit(fmt) {
        return `return ${this.value.emit(true, fmt)};`;
    }
}
class ReturnMultiStatement extends Statement {
    constructor(sinfo, value) {
        super(StatementTag.ReturnMultiStatement, sinfo);
        this.rtypes = [];
        this.elsig = undefined;
        this.value = value;
    }
    emit(fmt) {
        return `return ${this.value.map((vv) => vv.emit(true, fmt)).join(", ")};`;
    }
}
class IfStatement extends Statement {
    constructor(sinfo, cond, trueBlock) {
        super(StatementTag.IfStatement, sinfo);
        this.bbinds = [];
        this.cond = cond;
        this.trueBlock = trueBlock;
    }
    emit(fmt) {
        return `if ${this.cond.emit(fmt)} ${this.trueBlock.emit(fmt)}`;
    }
}
class IfElseStatement extends Statement {
    constructor(sinfo, cond, trueBlock, falseBlock) {
        super(StatementTag.IfElseStatement, sinfo);
        this.bbinds = [];
        this.cond = cond;
        this.trueBlock = trueBlock;
        this.falseBlock = falseBlock;
    }
    emit(fmt) {
        const ttif = this.trueBlock.emit(fmt);
        const ttelse = this.falseBlock.emit(fmt);
        return [`if ${this.cond.emit(fmt)} ${ttif}`, `else ${ttelse}`].join("\n");
    }
}
class IfElifElseStatement extends Statement {
    constructor(sinfo, condflow, elseflow) {
        super(StatementTag.IfElifElseStatement, sinfo);
        this.condflow = condflow;
        this.elseflow = elseflow;
    }
    emit(fmt) {
        const ttcond = this.condflow.map((cf) => `(${cf.cond.emit(true, fmt)}) ${cf.block.emit(fmt)}`);
        const ttelse = this.elseflow.emit(fmt);
        const iif = `if${ttcond[0]}`;
        const ielifs = [...ttcond.slice(1).map((cc) => fmt.indent(`elif${cc}`)), fmt.indent(`else ${ttelse}`)];
        return [iif, ...ielifs].join("\n");
    }
}
class SwitchStatement extends Statement {
    constructor(sinfo, sval, flow) {
        super(StatementTag.SwitchStatement, sinfo);
        this.mustExhaustive = false;
        this.optypes = [];
        this.sval = sval;
        this.switchflow = flow;
    }
    emit(fmt) {
        const mheader = `switch(${this.sval.emit(true, fmt)})`;
        fmt.indentPush();
        const ttmf = this.switchflow.map((sf) => `${sf.lval ? sf.lval.emit(true, fmt) : "_"} => ${sf.value.emit(fmt)}`);
        fmt.indentPop();
        const iir = ttmf.map((cc) => fmt.indent("    " + cc));
        return `${mheader} {\n${iir.join("\n")}\n${fmt.indent("}")}`;
    }
}
class MatchStatement extends Statement {
    constructor(sinfo, sval, bindername, flow) {
        super(StatementTag.MatchStatement, sinfo);
        this.mustExhaustive = false;
        this.implicitFinalType = undefined;
        this.sval = sval;
        this.bindervar = bindername;
        this.matchflow = flow;
    }
    emit(fmt) {
        const mheader = `match(${this.sval.emit(true, fmt)})`;
        fmt.indentPush();
        const ttmf = this.matchflow.map((mf) => `${mf.mtype ? mf.mtype.emit() : "_"} => ${mf.value.emit(fmt)}`);
        fmt.indentPop();
        const iir = ttmf.map((cc) => fmt.indent("    " + cc));
        return `${mheader} {\n${iir.join("\n")}\n${fmt.indent("}")}`;
    }
}
class DispatchPatternStatement extends Statement {
    constructor(sinfo, sval, bindername, dispatchflow) {
        super(StatementTag.DispatchPatternStatement, sinfo);
        //always must exhaustive
        this.implicitFinalType = undefined;
        this.sval = sval;
        this.bindername = bindername;
        this.dispatchflow = dispatchflow;
    }
    emit(fmt) {
        const dheader = `dispatch(${this.sval.emit(true, fmt)})`;
        fmt.indentPush();
        const ttdf = this.dispatchflow.map((df) => `${df.kidx ? df.kidx.emit(true, fmt) : "_"} => ${df.value.emit(fmt)}`);
        fmt.indentPop();
        const iir = ttdf.map((cc) => fmt.indent("    " + cc));
        return `${dheader} {\n${iir.join("\n")}\n${fmt.indent("}")}`;
    }
}
class DispatchTaskStatement extends Statement {
    constructor(sinfo, sval, bindername, dispatchflow) {
        super(StatementTag.DispatchTaskStatement, sinfo);
        //always must exhaustive
        this.implicitFinalType = undefined;
        this.sval = sval;
        this.bindername = bindername;
        this.dispatchflow = dispatchflow;
    }
    emit(fmt) {
        const dheader = `dispatch(${this.sval.emit(true, fmt)})`;
        fmt.indentPush();
        const ttdf = this.dispatchflow.map((df) => `${df.kidx ? df.kidx : "_"} => ${df.value.emit(fmt)}`);
        fmt.indentPop();
        const iir = ttdf.map((cc) => fmt.indent("| " + cc));
        return `${dheader} {\n${iir.join("\n")}\n${fmt.indent("}")}`;
    }
}
class AbortStatement extends Statement {
    constructor(sinfo) {
        super(StatementTag.AbortStatement, sinfo);
    }
    emit(fmt) {
        return `abort;`;
    }
}
class AssertStatement extends Statement {
    constructor(sinfo, cond, level) {
        super(StatementTag.AssertStatement, sinfo);
        this.cond = cond;
        this.level = level;
    }
    emit(fmt) {
        const level = (this.level !== "release") ? (" " + this.level) : "";
        return `assert${level} ${this.cond.emit(fmt)};`;
    }
}
class ValidateStatement extends Statement {
    constructor(sinfo, cond, diagnosticTag) {
        super(StatementTag.ValidateStatement, sinfo);
        this.cond = cond;
        this.diagnosticTag = diagnosticTag;
    }
    emit(fmt) {
        const ttg = (this.diagnosticTag !== undefined) ? `[${this.diagnosticTag}]` : "";
        return `validate${ttg} ${this.cond.emit(fmt)};`;
    }
}
class DebugStatement extends Statement {
    constructor(sinfo, value) {
        super(StatementTag.DebugStatement, sinfo);
        this.value = value;
    }
    emit(fmt) {
        return `_debug ${this.value.emit(true, fmt)};`;
    }
}
class VoidRefCallStatement extends Statement {
    constructor(sinfo, exp) {
        super(StatementTag.VoidRefCallStatement, sinfo);
        this.exp = exp;
    }
    emit(fmt) {
        return `${this.exp.emit(true, fmt)};`;
    }
}
class UpdateStatement extends Statement {
    constructor(sinfo, tag, vexp, updates) {
        super(tag, sinfo);
        this.updatetype = undefined;
        this.updateinfo = [];
        this.isdirect = false;
        this.vexp = vexp;
        this.updates = updates;
    }
    emit(fmt) {
        const updates = this.updates.map(([name, exp]) => `${name} = ${exp.emit(true, fmt)}`).join(", ");
        return `ref ${this.vexp.emit(true, fmt)}[${updates}];`;
    }
}
class VarUpdateStatement extends UpdateStatement {
    constructor(sinfo, vexp, updates) {
        super(sinfo, StatementTag.VarUpdateStatement, vexp, updates);
    }
}
class ThisUpdateStatement extends UpdateStatement {
    constructor(sinfo, vexp, updates) {
        super(sinfo, StatementTag.ThisUpdateStatement, vexp, updates);
    }
}
class SelfUpdateStatement extends Statement {
    constructor(sinfo, updates) {
        super(StatementTag.SelfUpdateStatement, sinfo);
        this.updates = updates;
    }
    emit(fmt) {
        const updates = this.updates.map(([name, exp]) => `${name} = ${exp.emit(true, fmt)}`).join(", ");
        return `ref self[${updates}];`;
    }
}
class HoleStatement extends Statement {
    constructor(sinfo, hname, captures, doccomment, samplesfile, nvars, ensures) {
        super(StatementTag.HoleStatement, sinfo);
        this.hname = hname;
        this.captures = captures;
        this.doccomment = doccomment;
        this.samplesfile = samplesfile;
        this.nvars = nvars;
        this.ensures = ensures;
    }
    emit(fmt) {
        let ebody = "";
        if (this.doccomment !== undefined || this.samplesfile !== undefined) {
            const dcom = this.doccomment !== undefined ? `%** ${this.doccomment} **%` : "";
            const samplstr = this.samplesfile !== undefined ? ` of ${this.samplesfile.emit(false, fmt)}` : "";
            ebody = `(${dcom})${samplstr}`;
        }
        let rbody = "";
        if (this.nvars.length === 0 || this.ensures.length === 0) {
            const nvars = this.nvars.map((nv) => `${nv.name}: ${nv.tsig.emit()}`).join(", ");
            const ensures = this.ensures.map((e) => `ensures ${e.emit(fmt)};`).join(" ");
            rbody = " ->" + (nvars !== "" ? (` [${nvars}]`) : "[]") + (ensures !== "" ? (` { ${ensures} }`) : "");
        }
        return `?_${this.hname || ""}${this.captures.length !== 0 ? ("[" + this.captures.join(", ") + "]") : ""}${ebody}${rbody}`;
    }
}
class TaskStatusStatement extends Statement {
    constructor(sinfo, exp) {
        super(StatementTag.TaskStatusStatement, sinfo);
        this.exp = exp;
    }
    emit(fmt) {
        return `Task::emitStatusUpdate(${this.exp.emit(true, fmt)});`;
    }
}
class TaskCheckAndHandleTerminationStatement extends Statement {
    constructor(sinfo) {
        super(StatementTag.TaskCheckAndHandleTerminationStatement, sinfo);
    }
    emit(fmt) {
        return `Task::checkAndHandleTermination();`;
    }
}
class TaskYieldStatement extends Statement {
    constructor(sinfo, res) {
        super(StatementTag.TaskYieldStatement, sinfo);
        this.res = res;
    }
    emit(fmt) {
        return `yield ${this.res.emit(true, fmt)};`;
    }
}
class BlockStatement extends Statement {
    constructor(sinfo, statements, isScoping) {
        super(StatementTag.BlockStatement, sinfo);
        this.isterminal = false;
        this.statements = statements;
        this.isScoping = isScoping;
    }
    emit(fmt) {
        fmt.indentPush();
        const bb = this.statements.map((stmt) => fmt.indent(stmt.emit(fmt))).join("\n");
        fmt.indentPop();
        return this.isScoping ? `{${bb}${fmt.indent("}")}` : `{|${bb}${fmt.indent("|}")}`;
    }
}
class BodyImplementation {
    constructor(sinfo, file) {
        this.sinfo = sinfo;
        this.file = file;
    }
}
class AbstractBodyImplementation extends BodyImplementation {
    constructor(sinfo, file) {
        super(sinfo, file);
    }
    emit(fmt, headerstr) {
        if (headerstr === undefined) {
            return ";";
        }
        else {
            return headerstr + ";";
        }
    }
}
class PredicateUFBodyImplementation extends BodyImplementation {
    constructor(sinfo, file) {
        super(sinfo, file);
    }
    emit(fmt, headerstr) {
        if (headerstr === undefined) {
            return "%* Uninterpreted Function as predicate for checking *%;";
        }
        else {
            return headerstr + "%* Uninterpreted Function as predicate for checking *%;";
        }
    }
}
class BuiltinBodyImplementation extends BodyImplementation {
    constructor(sinfo, file, builtin) {
        super(sinfo, file);
        this.builtin = builtin;
    }
    emit(fmt, headerstr) {
        assert(headerstr === undefined);
        return ` = @${this.builtin};`;
    }
}
class HoleBodyImplementation extends BodyImplementation {
    constructor(sinfo, file, hname, doccomment, samplesfile) {
        super(sinfo, file);
        this.hname = hname;
        this.doccomment = doccomment;
        this.samplesfile = samplesfile;
    }
    emit(fmt, headerstr) {
        let hstr = "";
        if (headerstr !== undefined) {
            hstr = " " + headerstr;
        }
        let ebody = "";
        if (this.doccomment !== undefined || this.samplesfile !== undefined) {
            const dcom = this.doccomment !== undefined ? `%** ${this.doccomment} **%` : "";
            const samplstr = this.samplesfile !== undefined ? ` of ${this.samplesfile.emit(false, fmt)}` : "";
            ebody = `(${dcom})${samplstr}`;
        }
        return hstr + `?_${this.hname || ""}${ebody}`;
    }
}
class ExpressionBodyImplementation extends BodyImplementation {
    constructor(sinfo, file, exp) {
        super(sinfo, file);
        this.exp = exp;
    }
    emit(fmt, headerstr) {
        let hstr = "";
        if (headerstr !== undefined) {
            hstr = " " + headerstr;
        }
        return `${hstr} ${this.exp.emit(true, fmt)}`;
    }
}
class StandardBodyImplementation extends BodyImplementation {
    constructor(sinfo, file, statements) {
        super(sinfo, file);
        this.statements = statements;
    }
    emit(fmt, headerstr) {
        let hstr = "";
        if (headerstr !== undefined) {
            hstr = headerstr + "\n" + fmt.indent("");
        }
        fmt.indentPush();
        const bb = this.statements.map((stmt, i) => {
            let ss = stmt.emit(fmt);
            if (i !== this.statements.length - 1) {
                return ss;
            }
            else {
                if (stmt.tag === StatementTag.IfElseStatement || stmt.tag === StatementTag.SwitchStatement || stmt.tag === StatementTag.MatchStatement || stmt.tag === StatementTag.BlockStatement) {
                    return ss + "\n";
                }
                else {
                    return ss;
                }
            }
        }).join("\n");
        fmt.indentPop();
        return `${hstr}{\n${bb}\n${fmt.indent("}")}`;
    }
}
export { BinderInfo, TypeTestBindInfo, ITest, ITestType, ITestNone, ITestSome, ITestOk, ITestFail, ITestGuard, ITestBinderGuard, ITestTypeGuard, ITestSimpleGuard, ITestGuardSet, FormatStringComponent, FormatStringTextComponent, FormatStringArgComponent, AbstractArgumentValue, SkipArgumentValue, StdArgumentValue, PositionalArgumentValue, NamedArgumentValue, SpreadArgumentValue, PassingArgumentValue, ArgumentList, ExpressionTag, Expression, ErrorExpression, LiteralNoneExpression, LiteralSimpleExpression, LiteralStringExpression, LiteralCStringExpression, LiteralFormatStringExpression, LiteralFormatCStringExpression, LiteralRegexExpression, LiteralPathItemExpression, LiteralFormatPathItemExpression, LiteralTypeDeclValueExpression, LiteralTypedCStringExpression, LiteralTypedStringExpression, LiteralTypedFormatStringExpression, LiteralTypedFormatCStringExpression, LiteralTypedPathExpression, LiteralTypedPathFormatExpression, AccessEnvValueExpression, TaskAccessInfoExpression, AccessNamespaceConstantExpression, AccessStaticFieldExpression, AccessEnumExpression, AccessVariableExpression, ConstructorExpression, ConstructorPrimaryExpression, ConstructorEListExpression, ConstructorLambdaExpression, SpecialConstructorExpression, LambdaInvokeExpression, CallNamespaceFunctionExpression, CallTypeFunctionExpression, CallRefInvokeExpression, CallRefVariableExpression, CallRefThisExpression, CallRefSelfExpression, CallTaskActionExpression, ParseAsTypeExpression, InterpolateFormatExpression, PostfixOpTag, PostfixOperation, PostfixOp, PostfixError, PostfixAccessFromName, PostfixAccessFromIndex, PostfixProjectFromNames, PostfixIsTest, PostfixAsConvert, PostfixAssignFields, PostfixSliceOperator, PostfixInvoke, UnaryExpression, PrefixNotOpExpression, PrefixNegateOrPlusOpExpression, BinaryArithExpression, BinAddExpression, BinSubExpression, BinMultExpression, BinDivExpression, BinaryKeyExpression, BinKeyEqExpression, BinKeyNeqExpression, KeyCompareEqExpression, KeyCompareLessExpression, BinaryNumericExpression, NumericEqExpression, NumericNeqExpression, NumericLessExpression, NumericLessEqExpression, NumericGreaterExpression, NumericGreaterEqExpression, LogicExpression, LogicAndExpression, LogicOrExpression, HoleExpression, MapEntryConstructorExpression, ChkLogicExpressionTag, ChkLogicExpression, ChkLogicImpliesExpression, ChkLogicBaseExpression, RValueExpressionTag, RValueExpression, ConditionalValueExpression, ShortCircuitAssignRHSITestExpression, ShortCircuitAssignRHSExpressionFail, ShortCircuitAssignRHSExpressionReturn, BaseRValueExpression, EnvironmentGenerationExpressionTag, EnvironmentGenerationExpression, ErrorEnvironmentExpression, EmptyEnvironmentExpression, InitializeEnvironmentExpression, CurrentEnvironmentExpression, TaskRunExpression, TaskMultiExpression, TaskDashExpression, TaskDashAnyExpression, TaskAllExpression, TaskRaceExpression, TaskRaceAnyExpression, APIInvokeExpression, AgentInvokeExpression, StatementTag, Statement, ErrorStatement, EmptyStatement, VariableDeclarationStatement, VariableMultiDeclarationStatement, VariableInitializationStatement, VariableMultiInitializationStatement, VariableAssignmentStatement, VariableMultiAssignmentStatement, ReturnVoidStatement, ReturnSingleStatement, ReturnMultiStatement, IfStatement, IfElseStatement, IfElifElseStatement, SwitchStatement, MatchStatement, DispatchPatternStatement, DispatchTaskStatement, AbortStatement, AssertStatement, ValidateStatement, DebugStatement, VoidRefCallStatement, UpdateStatement, VarUpdateStatement, ThisUpdateStatement, SelfUpdateStatement, HoleStatement, TaskStatusStatement, TaskCheckAndHandleTerminationStatement, TaskYieldStatement, BlockStatement, BodyImplementation, AbstractBodyImplementation, PredicateUFBodyImplementation, BuiltinBodyImplementation, HoleBodyImplementation, ExpressionBodyImplementation, StandardBodyImplementation };
//# sourceMappingURL=body.js.map