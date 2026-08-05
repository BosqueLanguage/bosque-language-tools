import { IRNominalTypeSignature } from "./irtype.js";
var IRExpressionTag;
(function (IRExpressionTag) {
    IRExpressionTag["IRLiteralNoneExpression"] = "IRLiteralNoneExpression";
    IRExpressionTag["IRLiteralBoolExpression"] = "IRLiteralBoolExpression";
    IRExpressionTag["IRLiteralNatExpression"] = "IRLiteralNatExpression";
    IRExpressionTag["IRLiteralIntExpression"] = "IRLiteralIntExpression";
    IRExpressionTag["IRLiteralChkNatExpression"] = "IRLiteralChkNatExpression";
    IRExpressionTag["IRLiteralChkIntExpression"] = "IRLiteralChkIntExpression";
    IRExpressionTag["IRLiteralRationalExpression"] = "IRLiteralRationalExpression";
    IRExpressionTag["IRLiteralFloatExpression"] = "IRLiteralFloatExpression";
    IRExpressionTag["IRLiteralDecimalExpression"] = "IRLiteralDecimalExpression";
    IRExpressionTag["IRLiteralDecimalDegreeExpression"] = "IRLiteralDecimalDegreeExpression";
    IRExpressionTag["IRLiteralLatLongCoordinateExpression"] = "IRLiteralLatLongCoordinateExpression";
    IRExpressionTag["IRLiteralComplexExpression"] = "IRLiteralComplexExpression";
    IRExpressionTag["IRLiteralByteBufferExpression"] = "IRLiteralByteBufferExpression";
    IRExpressionTag["IRLiteralUUIDv4Expression"] = "IRLiteralUUIDv4Expression";
    IRExpressionTag["IRLiteralUUIDv7Expression"] = "IRLiteralUUIDv7Expression";
    IRExpressionTag["IRLiteralSHAContentHashExpression"] = "IRLiteralSHAContentHashExpression";
    IRExpressionTag["IRLiteralTZDateTimeExpression"] = "IRLiteralTZDateTimeExpression";
    IRExpressionTag["IRLiteralTAITimeExpression"] = "IRLiteralTAITimeExpression";
    IRExpressionTag["IRLiteralPlainDateExpression"] = "IRLiteralPlainDateExpression";
    IRExpressionTag["IRLiteralPlainTimeExpression"] = "IRLiteralPlainTimeExpression";
    IRExpressionTag["IRLiteralLogicalTimeExpression"] = "IRLiteralLogicalTimeExpression";
    IRExpressionTag["IRLiteralISOTimeStampExpression"] = "IRLiteralISOTimeStampExpression";
    IRExpressionTag["IRLiteralDeltaDateTimeExpression"] = "IRLiteralDeltaDateTimeExpression";
    IRExpressionTag["IRLiteralDeltaISOTimeStampExpression"] = "IRLiteralDeltaISOTimeStampExpression";
    IRExpressionTag["IRLiteralDeltaSecondsExpression"] = "IRLiteralDeltaSecondsExpression";
    IRExpressionTag["IRLiteralDeltaLogicalTimeExpression"] = "IRLiteralDeltaLogicalTimeExpression";
    IRExpressionTag["IRLiteralUnicodeRegexExpression"] = "IRLiteralUnicodeRegexExpression";
    IRExpressionTag["IRLiteralCRegexExpression"] = "IRLiteralCRegexExpression";
    IRExpressionTag["IRLiteralByteExpression"] = "IRLiteralByteExpression";
    IRExpressionTag["IRLiteralCCharExpression"] = "IRLiteralCCharExpression";
    IRExpressionTag["IRLiteralUnicodeCharExpression"] = "IRLiteralUnicodeCharExpression";
    IRExpressionTag["IRLiteralCStringExpression"] = "IRLiteralCStringExpression";
    IRExpressionTag["IRLiteralStringExpression"] = "IRLiteralStringExpression";
    IRExpressionTag["IRLiteralFormatStringExpression"] = "IRLiteralFormatStringExpression";
    IRExpressionTag["IRLiteralFormatCStringExpression"] = "IRLiteralFormatCStringExpression";
    //TODO: path literal options here
    //TODO: path literal -format- options here
    IRExpressionTag["IRLiteralTypedExpression"] = "IRLiteralTypedExpression";
    IRExpressionTag["IRLiteralTypedStringExpression"] = "IRLiteralTypedStringExpression";
    IRExpressionTag["IRLiteralTypedCStringExpression"] = "IRLiteralTypedCStringExpression";
    //TODO: path typed literal and -format- options here
    IRExpressionTag["IRAccessEnvHasExpression"] = "IRAccessEnvHasExpression";
    IRExpressionTag["IRAccessEnvGetExpression"] = "IRAccessEnvGetExpression";
    IRExpressionTag["IRAccessEnvTryGetExpression"] = "IRAccessEnvTryGetExpression";
    IRExpressionTag["IRTaskAccessIDExpression"] = "IRTaskAccessIDExpression";
    IRExpressionTag["IRTaskAccessParentIDExpression"] = "IRTaskAccessParentIDExpression";
    IRExpressionTag["IRAccessConstantExpression"] = "IRAccessConstantExpression";
    IRExpressionTag["IRAccessEnumExpression"] = "IRAccessEnumExpression";
    IRExpressionTag["IRAccessParameterVariableExpression"] = "IRAccessParameterVariableExpression";
    IRExpressionTag["IRAccessLocalVariableExpression"] = "IRAccessLocalVariableExpression";
    IRExpressionTag["IRAccessCapturedVariableExpression"] = "IRAccessCapturedVariableExpression";
    IRExpressionTag["IRAccessTempVariableExpression"] = "IRAccessTempVariableExpression";
    IRExpressionTag["IRAccessTypeDeclValueExpression"] = "IRAccessTypeDeclValueExpression";
    IRExpressionTag["IRConstructSafeTypeDeclExpression"] = "IRConstructSafeTypeDeclExpression";
    IRExpressionTag["IRConstructorSomeTypeExpression"] = "IRConstructorSomeTypeExpression";
    IRExpressionTag["IRConstructorOkTypeExpression"] = "IRConstructorOkTypeExpression";
    IRExpressionTag["IRConstructorFailTypeExpression"] = "IRConstructorFailTypeExpression";
    IRExpressionTag["IRConstructorMapEntryTypeExpression"] = "IRConstructorMapEntryTypeExpression";
    IRExpressionTag["IRConstructorStandardEntityExpression"] = "IRConstructorStandardEntityExpression";
    IRExpressionTag["IRConstructorLambdaExpression"] = "IRConstructorLambdaExpression";
    IRExpressionTag["IRConstructorEListExpression"] = "IRConstructorEListExpression";
    IRExpressionTag["IRConstructorListEmptyExpression"] = "IRConstructorListEmptyExpression";
    IRExpressionTag["IRConstructorListSingletonsExpression"] = "IRConstructorListSingletonsExpression";
    IRExpressionTag["IRAccessFieldSpecialExpression"] = "IRAccessFieldSpecialExpression";
    IRExpressionTag["IRAccessFieldDirectExpression"] = "IRAccessFieldDirectExpression";
    IRExpressionTag["IRAccessFieldVirtualExpression"] = "IRAccessFieldVirtualExpression";
    IRExpressionTag["IRAccessEListIndexExpression"] = "IRAccessEListIndexExpression";
    IRExpressionTag["IRInvokeSimpleExpression"] = "IRInvokeSimpleExpression";
    IRExpressionTag["IRInvokeSimpleWithImplicitsExpression"] = "IRInvokeSimpleWithImplicitsExpression";
    IRExpressionTag["IRInvokeVirtualSimpleExpression"] = "IRInvokeVirtualSimpleExpression";
    IRExpressionTag["IRInvokeVirtualWithImplicitsExpression"] = "IRInvokeVirtualWithImplicitsExpression";
    IRExpressionTag["IRInterpolateFormatCStringExpression"] = "IRInterpolateFormatCStringExpression";
    IRExpressionTag["IRInterpolateFormatStringExpression"] = "IRInterpolateFormatStringExpression";
    IRExpressionTag["IRPrefixNotOpExpression"] = "IRPrefixNotOpExpression";
    IRExpressionTag["IRPrefixNegateOpExpression"] = "IRPrefixNegateOrPlusOpExpression";
    IRExpressionTag["IRPrefixPlusOpExpression"] = "IRPrefixPlusOpExpression";
    IRExpressionTag["IRBinAddExpression"] = "IRBinAddExpression";
    IRExpressionTag["IRBinSubExpression"] = "IRBinSubExpression";
    IRExpressionTag["IRBinMultExpression"] = "IRBinMultExpression";
    IRExpressionTag["IRBinDivExpression"] = "IRBinDivExpression";
    IRExpressionTag["IRNumericEqExpression"] = "IRNumericEqExpression";
    IRExpressionTag["IRNumericNeqExpression"] = "IRNumericNeqExpression";
    IRExpressionTag["IRNumericLessExpression"] = "IRNumericLessExpression";
    IRExpressionTag["IRNumericLessEqExpression"] = "IRNumericLessEqExpression";
    IRExpressionTag["IRNumericGreaterExpression"] = "IRNumericGreaterExpression";
    IRExpressionTag["IRNumericGreaterEqExpression"] = "IRNumericGreaterEqExpression";
    IRExpressionTag["IRIsNoneOptionExpression"] = "IRIsNoneOptionExpression";
    IRExpressionTag["IRIsNotNoneOptionExpression"] = "IRIsNotNoneOptionExpression";
    IRExpressionTag["IRIsOptionEqValueExpression"] = "IRIsOptionEqValueExpression";
    IRExpressionTag["IRIsOptionNeqValueExpression"] = "IRIsOptionNeqValueExpression";
    IRExpressionTag["IRIsSomeEqValueExpression"] = "IRIsSomeEqValueExpression";
    IRExpressionTag["IRIsSomeNeqValueExpression"] = "IRIsSomeNeqValueExpression";
    IRExpressionTag["IRBinKeyEqDirectExpression"] = "IRBinKeyEqDirectExpression";
    IRExpressionTag["IRBinKeyNeqDirectExpression"] = "IRBinKeyNeqDirectExpression";
    IRExpressionTag["IRBinKeyLessDirectExpression"] = "IRBinKeyLessDirectExpression";
    IRExpressionTag["IRLogicAndExpression"] = "IRLogicAndExpression";
    IRExpressionTag["IRLogicOrExpression"] = "IRLogicOrExpression";
    IRExpressionTag["IRLogicSimpleConditionalExpression"] = "IRLogicSimpleConditionalExpression";
    IRExpressionTag["IRLiteralOptionOfNoneExpression"] = "IRLiteralOptionOfNoneExpression";
    IRExpressionTag["IRConstructOptionFromSomeExpression"] = "IRConstructOptionFromSomeExpression";
    IRExpressionTag["IRExtractSomeFromOptionExpression"] = "IRExtractSomeFromOptionExpression";
    IRExpressionTag["IRExtractSomeValueFromOptionExpression"] = "IRExtractSomeValueFromOptionExpression";
    IRExpressionTag["IRConstructResultFromOkExpression"] = "IRConstructResultFromOkExpression";
    IRExpressionTag["IRConstructResultFromFailExpression"] = "IRConstructResultFromFailExpression";
    IRExpressionTag["IRExtractOkFromResultExpression"] = "IRExtractOkFromResultExpression";
    IRExpressionTag["IRExtractOkValueFromResultExpression"] = "IRExtractOkValueFromResultExpression";
    IRExpressionTag["IRExtractFailFromResultExpression"] = "IRExtractFailFromResultExpression";
    IRExpressionTag["IRExtractFailValueFromResultExpression"] = "IRExtractFailValueFromResultExpression";
    IRExpressionTag["IRIsConceptRepresentationOfTypeExpression"] = "IRIsConceptRepresentationOfTypeExpression";
    IRExpressionTag["IRIsNotConceptRepresentationOfTypeExpression"] = "IRIsNotConceptRepresentationOfTypeExpression";
    IRExpressionTag["IRIsConceptRepresentationSubtypeOfTypeExpression"] = "IRIsConceptRepresentationSubtypeOfTypeExpression";
    IRExpressionTag["IRIsNotConceptRepresentationSubtypeOfTypeExpression"] = "IRIsNotConceptRepresentationSubtypeOfTypeExpression";
    IRExpressionTag["IRStaticIsTypeSubtypeOfExpression"] = "IRStaticIsTypeSubtypeOfExpression";
    IRExpressionTag["IRBoxEntityToConceptRepresentationExpression"] = "IRBoxEntityToConceptRepresentationExpression";
    IRExpressionTag["IRUnboxEntityFromConceptRepresentationExpression"] = "IRUnboxEntityFromConceptRepresentationExpression";
    IRExpressionTag["IRConvertConceptRepresentationExpression"] = "IRConvertConceptRepresentationExpression";
})(IRExpressionTag || (IRExpressionTag = {}));
class IRExpression {
    constructor(tag) {
        this.tag = tag;
    }
}
/* This class represents expressions that are invocations (function/method/virtual calls) */
class IRInvokeExpression extends IRExpression {
    constructor(tag, ikey, args) {
        super(tag);
        this.ikey = ikey;
        this.args = args;
    }
    isSimpleExpression() {
        return false;
    }
}
/* This class represents expressions that have a single return value */
class IRInvokeDirectExpression extends IRInvokeExpression {
    constructor(tag, ikey, args) {
        super(tag, ikey, args);
    }
}
/* This class represents expressions that have implicit return values */
class IRInvokeImplicitsExpression extends IRInvokeExpression {
    constructor(tag, ikey, args, implicitidx, ivar, ivartype, passkind) {
        super(tag, ikey, args);
        this.implicitidx = implicitidx;
        this.ivar = ivar;
        this.ivartype = ivartype;
        this.passkind = passkind;
    }
}
/* This class represents expressions that construct composite (maybe allocating) values -- can only OOM (otherwise semantically safe) but we want to keep them ordered strongly */
class IRConstructExpression extends IRExpression {
    constructor(tag, constype) {
        super(tag);
        this.constype = constype;
    }
    isSimpleExpression() {
        return true;
    }
}
/* This class represents expressions that are simple and side-effect free (i.e., immediate expressions plus simple operations that we can put into expression trees) */
class IRSimpleExpression extends IRExpression {
    constructor(tag) {
        super(tag);
    }
    isSimpleExpression() {
        return true;
    }
}
/* This class represents expressions that are guaranteed to be immediate values (i.e., vars, literals, constants) */
class IRImmediateExpression extends IRSimpleExpression {
    constructor(tag) {
        super(tag);
    }
}
/* This class represents expressions that are guaranteed to be immediate values (i.e., constants, typdecl literals) */
class IRLiteralExpression extends IRImmediateExpression {
    constructor(tag) {
        super(tag);
    }
}
/* This class represents expressions that access field values */
class IRAccessFieldExpression extends IRSimpleExpression {
    constructor(tag, eexptype, eexp, intype, fieldname, fieldtype) {
        super(tag);
        this.eexptype = eexptype;
        this.eexp = eexp;
        this.intype = intype;
        this.fieldname = fieldname;
        this.fieldtype = fieldtype;
    }
}
var IRStatementTag;
(function (IRStatementTag) {
    IRStatementTag["IRNopStatement"] = "IRNopStatement";
    IRStatementTag["IRTempAssignExpressionStatement"] = "IRTempAssignExpressionStatement";
    IRStatementTag["IRTempAssignStdInvokeStatement"] = "IRTempAssignStdInvokeStatement";
    IRStatementTag["IRTempAssignRefInvokeStatement"] = "IRTempAssignRefInvokeStatement";
    IRStatementTag["IRTempAssignDirectConstructorStatement"] = "IRTempAssignDirectConstructorStatement";
    IRStatementTag["IRVariableDeclarationStatement"] = "IRVariableDeclarationStatement";
    IRStatementTag["IRVariableInitializationStatement"] = "IRVariableInitializationStatement";
    IRStatementTag["IRVariableInitializationDirectInvokeStatement"] = "IRVariableInitializationDirectInvokeStatement";
    IRStatementTag["IRVariableInitializationDirectInvokeWithImplicitStatement"] = "IRVariableInitializationDirectInvokeWithImplicitStatement";
    IRStatementTag["IRVariableInitializationDirectConstructorStatement"] = "IRVariableInitializationDirectConstructorStatement";
    IRStatementTag["IRVariableInitializationDirectConstructorWithBoxStatement"] = "IRVariableInitializationDirectConstructorWithBoxStatement";
    IRStatementTag["IRVariableAssignmentStatement"] = "IRVariableAssignmentStatement";
    IRStatementTag["IRVariableAssignmentDirectInvokeStatement"] = "IRVariableAssignmentDirectInvokeStatement";
    IRStatementTag["IRVariableAssignmentDirectInvokeWithImplicitStatement"] = "IRVariableAssignmentDirectInvokeWithImplicitStatement";
    IRStatementTag["IRVariableAssignmentDirectConstructorStatement"] = "IRVariableAssignmentDirectConstructorStatement";
    IRStatementTag["IRVariableAssignmentDirectConstructorWithBoxStatement"] = "IRVariableAssignmentDirectConstructorWithBoxStatement";
    IRStatementTag["IRReturnVoidSimpleStatement"] = "IRReturnVoidSimpleStatement";
    IRStatementTag["IRReturnValueSimpleStatement"] = "IRReturnValueSimpleStatement";
    IRStatementTag["IRReturnDirectInvokeStatement"] = "IRReturnDirectInvokeStatement";
    IRStatementTag["IRReturnDirectConstructStatement"] = "IRReturnDirectConstructStatement";
    IRStatementTag["IRReturnDirectConstructWithBoxStatement"] = "IRReturnDirectConstructWithBoxStatement";
    IRStatementTag["IRReturnVoidImplicitStatement"] = "IRReturnVoidImplicitStatement";
    IRStatementTag["IRReturnValueImplicitStatement"] = "IRReturnValueImplicitStatement";
    IRStatementTag["IRReturnDirectInvokeImplicitStatement"] = "IRReturnDirectInvokeImplicitStatement";
    IRStatementTag["IRReturnDirectInvokeImplicitPassThroughStatement"] = "IRReturnDirectInvokeImplicitPassThroughStatement";
    IRStatementTag["IRReturnDirectConstructImplicitStatement"] = "IRReturnDirectConstructImplicitStatement";
    IRStatementTag["IRReturnDirectConstructWithBoxImplicitStatement"] = "IRReturnDirectConstructWithBoxImplicitStatement";
    IRStatementTag["IRVoidInvokeStatement"] = "IRVoidInvokeStatement";
    IRStatementTag["IRChkLogicImpliesShortCircuitStatement"] = "IRChkLogicImpliesShortCircuitStatement";
    IRStatementTag["IRLogicConditionalStatement"] = "IRLogicConditionalStatement";
    IRStatementTag["IRSimpleIfStatement"] = "IRSimpleIfStatement";
    IRStatementTag["IRSimpleIfElseStatement"] = "IRSimpleIfElseStatement";
    IRStatementTag["IRMatchExactStatement"] = "IRMatchExactStatement";
    IRStatementTag["IRMatchGeneralStatement"] = "IRMatchGeneralStatement";
    IRStatementTag["IRBlockStatement"] = "IRBlockStatement";
    IRStatementTag["IRErrorAdditionBoundsCheckStatement"] = "IRErrorAdditionBoundsCheckStatement";
    IRStatementTag["IRErrorSubtractionBoundsCheckStatement"] = "IRErrorSubtractionBoundsCheckStatement";
    IRStatementTag["IRErrorMultiplicationBoundsCheckStatement"] = "IRErrorMultiplicationBoundsCheckStatement";
    IRStatementTag["IRErrorDivisionByZeroCheckStatement"] = "IRErrorDivisionByZeroCheckStatement";
    IRStatementTag["IRErrorTypeAssertionCheckStatement"] = "IRErrorTypeAssertionCheckStatement";
    IRStatementTag["IRErrorExhaustiveStatement"] = "IRErrorExhaustiveStatement";
    IRStatementTag["IRTypeDeclSizeRangeCheckCStringStatement"] = "IRTypeDeclSizeRangeCheckCStringStatement";
    IRStatementTag["IRTypeDeclSizeRangeCheckUnicodeStringStatement"] = "IRTypeDeclSizeRangeCheckUnicodeStringStatement";
    IRStatementTag["IRTypeDeclNumericRangeCheckStatement"] = "IRTypeDeclNumericRangeCheckStatement";
    IRStatementTag["IRTypeDeclFormatCheckCStringStatement"] = "IRTypeDeclFormatCheckCStringStatement";
    IRStatementTag["IRTypeDeclFormatCheckUnicodeStringStatement"] = "IRTypeDeclFormatCheckUnicodeStringStatement";
    IRStatementTag["IRTypeDeclInvariantCheckStatement"] = "IRTypeDeclInvariantCheckStatement";
    IRStatementTag["IREntityInvariantCheckStatement"] = "IREntityInvariantCheckStatement";
    IRStatementTag["IRPreconditionCheckStatement"] = "IRPreconditionCheckStatement";
    IRStatementTag["IRPostconditionCheckStatement"] = "IRPostconditionCheckStatement";
    IRStatementTag["IRAbortStatement"] = "IRAbortStatement";
    IRStatementTag["IRAssertStatement"] = "IRAssertStatement";
    IRStatementTag["IRAssumeStatement"] = "IRAssumeStatement";
    IRStatementTag["IRValidateStatement"] = "IRValidateStatement";
    IRStatementTag["IRDebugStatement"] = "IRDebugStatement";
})(IRStatementTag || (IRStatementTag = {}));
class IRStatement {
    constructor(tag) {
        this.tag = tag;
    }
    isTerminalStatement() { return false; }
}
/* This class represents statements that are atomic (line statements) and don't have control flow or sub blocks */
class IRAtomicStatement extends IRStatement {
    constructor(tag) {
        super(tag);
    }
}
/* Represent temporary variable assignment statements */
class IRTempAssignStatement extends IRAtomicStatement {
    constructor(tag, tname, ttype) {
        super(tag);
        this.tname = tname;
        this.ttype = ttype;
    }
    isSimpleStatement() {
        return true;
    }
}
/* Represent return statement that do not involve any ref/out/out?/inout parameters */
class IRReturnSimpleStatement extends IRAtomicStatement {
    constructor(tag) {
        super(tag);
    }
    isTerminalStatement() {
        return true;
    }
    isSimpleStatement() {
        return true;
    }
}
/* Represent return statement that involve ref/out/out?/inout parameters and thus have an implicit variable to hold the returned value */
class IRReturnWithImplicitStatement extends IRAtomicStatement {
    constructor(tag, implicitvar) {
        super(tag);
        this.implicitvar = implicitvar;
    }
    isTerminalStatement() {
        return true;
    }
    isSimpleStatement() {
        return false;
    }
}
/* Explicit error condition checks -- all possible error conditions must be made explicit during flattening */
class IRErrorCheckStatement extends IRAtomicStatement {
    constructor(tag, file, sinfo, diagnosticTag, checkID) {
        super(tag);
        this.file = file;
        this.sinfo = sinfo;
        this.diagnosticTag = diagnosticTag;
        this.checkID = checkID;
    }
    isSimpleStatement() {
        return false;
    }
}
IRErrorCheckStatement.assumeCheckID = -11;
class IRErrorBinArithCheckStatement extends IRErrorCheckStatement {
    constructor(tag, file, sinfo, diagnosticTag, checkID, left, right, optypechk) {
        super(tag, file, sinfo, diagnosticTag, checkID);
        this.left = left;
        this.right = right;
        this.optypechk = optypechk;
    }
}
class IRErrorTypedStringCheckStatement extends IRErrorCheckStatement {
    constructor(tag, file, sinfo, diagnosticTag, checkID, strexp) {
        super(tag, file, sinfo, diagnosticTag, checkID);
        this.strexp = strexp;
    }
}
////////////////////////////////////////
//Our literal expressions are all very safe and will never fail to construct -- if there are possible issues the flattening phase should have emitted and explicit check
class IRLiteralNoneExpression extends IRLiteralExpression {
    constructor() {
        super(IRExpressionTag.IRLiteralNoneExpression);
    }
}
class IRLiteralBoolExpression extends IRLiteralExpression {
    constructor(value) {
        super(IRExpressionTag.IRLiteralBoolExpression);
        this.value = value;
    }
}
class IRLiteralIntegralNumberExpression extends IRLiteralExpression {
    constructor(tag, value) {
        super(tag);
        this.value = value;
    }
}
class IRLiteralNatExpression extends IRLiteralIntegralNumberExpression {
    constructor(value) {
        super(IRExpressionTag.IRLiteralNatExpression, value);
    }
}
class IRLiteralIntExpression extends IRLiteralIntegralNumberExpression {
    constructor(value) {
        super(IRExpressionTag.IRLiteralIntExpression, value);
    }
}
class IRLiteralChkNatExpression extends IRLiteralIntegralNumberExpression {
    constructor(value) {
        super(IRExpressionTag.IRLiteralChkNatExpression, value);
    }
}
class IRLiteralChkIntExpression extends IRLiteralIntegralNumberExpression {
    constructor(value) {
        super(IRExpressionTag.IRLiteralChkIntExpression, value);
    }
}
class IRLiteralRationalExpression extends IRLiteralExpression {
    constructor(numerator, denominator) {
        super(IRExpressionTag.IRLiteralRationalExpression);
        this.numerator = numerator;
        this.denominator = denominator;
    }
}
class IRLiteralFloatingPointExpression extends IRLiteralExpression {
    constructor(tag, value) {
        super(tag);
        this.value = value;
    }
}
class IRLiteralFloatExpression extends IRLiteralFloatingPointExpression {
    constructor(value) {
        super(IRExpressionTag.IRLiteralFloatExpression, value);
    }
}
class IRLiteralDecimalExpression extends IRLiteralFloatingPointExpression {
    constructor(value) {
        super(IRExpressionTag.IRLiteralDecimalExpression, value);
    }
}
class IRLiteralDecimalDegreeExpression extends IRLiteralFloatingPointExpression {
    constructor(value) {
        super(IRExpressionTag.IRLiteralDecimalDegreeExpression, value);
    }
}
class IRLiteralLatLongCoordinateExpression extends IRLiteralExpression {
    constructor(latitude, longitude) {
        super(IRExpressionTag.IRLiteralLatLongCoordinateExpression);
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
class IRLiteralComplexExpression extends IRLiteralExpression {
    constructor(real, imaginary) {
        super(IRExpressionTag.IRLiteralComplexExpression);
        this.real = real;
        this.imaginary = imaginary;
    }
}
class IRLiteralByteBufferExpression extends IRLiteralExpression {
    constructor(bytes) {
        super(IRExpressionTag.IRLiteralByteBufferExpression);
        this.bytes = bytes;
    }
}
class IRLiteralUUIDv4Expression extends IRLiteralExpression {
    constructor(bytes) {
        super(IRExpressionTag.IRLiteralUUIDv4Expression);
        this.bytes = bytes;
    }
}
class IRLiteralUUIDv7Expression extends IRLiteralExpression {
    constructor(bytes) {
        super(IRExpressionTag.IRLiteralUUIDv7Expression);
        this.bytes = bytes;
    }
}
class IRLiteralSHAContentHashExpression extends IRLiteralExpression {
    constructor(bytes) {
        super(IRExpressionTag.IRLiteralSHAContentHashExpression);
        this.bytes = bytes;
    }
}
class IRDateRepresentation {
    constructor(year, month, day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }
}
class IRTimeRepresentation {
    constructor(hour, minute, second) {
        this.hour = hour;
        this.minute = minute;
        this.second = second;
    }
}
class IRLiteralTZDateTimeExpression extends IRLiteralExpression {
    constructor(date, time, timezone) {
        super(IRExpressionTag.IRLiteralTZDateTimeExpression);
        this.date = date;
        this.time = time;
        this.timezone = timezone;
    }
}
class IRLiteralTAITimeExpression extends IRLiteralExpression {
    constructor(date, time) {
        super(IRExpressionTag.IRLiteralTAITimeExpression);
        this.date = date;
        this.time = time;
    }
}
class IRLiteralPlainDateExpression extends IRLiteralExpression {
    constructor(date) {
        super(IRExpressionTag.IRLiteralPlainDateExpression);
        this.date = date;
    }
}
class IRLiteralPlainTimeExpression extends IRLiteralExpression {
    constructor(time) {
        super(IRExpressionTag.IRLiteralPlainTimeExpression);
        this.time = time;
    }
}
class IRLiteralLogicalTimeExpression extends IRLiteralExpression {
    constructor(ticks) {
        super(IRExpressionTag.IRLiteralLogicalTimeExpression);
        this.ticks = ticks;
    }
}
class IRLiteralISOTimeStampExpression extends IRLiteralExpression {
    constructor(date, time, milliseconds) {
        super(IRExpressionTag.IRLiteralISOTimeStampExpression);
        this.date = date;
        this.time = time;
        this.milliseconds = milliseconds;
    }
}
class IRDeltaDateRepresentation {
    constructor(years, months, days) {
        this.years = years;
        this.months = months;
        this.days = days;
    }
}
class IRDeltaTimeRepresentation {
    constructor(hours, minutes, seconds) {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
    }
}
class IRLiteralDeltaDateTimeExpression extends IRLiteralExpression {
    constructor(sign, deltadate, deltatime) {
        super(IRExpressionTag.IRLiteralDeltaDateTimeExpression);
        this.sign = sign;
        this.deltadate = deltadate;
        this.deltatime = deltatime;
    }
}
class IRLiteralDeltaISOTimeStampExpression extends IRLiteralExpression {
    constructor(sign, deltadate, deltatime, deltamilliseconds) {
        super(IRExpressionTag.IRLiteralDeltaISOTimeStampExpression);
        this.sign = sign;
        this.deltadate = deltadate;
        this.deltatime = deltatime;
        this.deltamilliseconds = deltamilliseconds;
    }
}
class IRLiteralDeltaSecondsExpression extends IRLiteralExpression {
    constructor(sign, seconds) {
        super(IRExpressionTag.IRLiteralDeltaSecondsExpression);
        this.sign = sign;
        this.seconds = seconds;
    }
}
class IRLiteralDeltaLogicalTimeExpression extends IRLiteralExpression {
    constructor(sign, ticks) {
        super(IRExpressionTag.IRLiteralDeltaLogicalTimeExpression);
        this.sign = sign;
        this.ticks = ticks;
    }
}
class IRLiteralUnicodeRegexExpression extends IRLiteralExpression {
    constructor(regexID, value) {
        super(IRExpressionTag.IRLiteralUnicodeRegexExpression);
        this.regexID = regexID;
        this.value = value;
    }
}
class IRLiteralCRegexExpression extends IRLiteralExpression {
    constructor(regexID, value) {
        super(IRExpressionTag.IRLiteralCRegexExpression);
        this.regexID = regexID;
        this.value = value;
    }
}
class IRLiteralByteExpression extends IRLiteralExpression {
    constructor(value) {
        super(IRExpressionTag.IRLiteralByteExpression);
        this.value = value;
    }
}
class IRLiteralCCharExpression extends IRLiteralExpression {
    constructor(value) {
        super(IRExpressionTag.IRLiteralCCharExpression);
        this.value = value;
    }
}
class IRLiteralUnicodeCharExpression extends IRLiteralExpression {
    constructor(value) {
        super(IRExpressionTag.IRLiteralUnicodeCharExpression);
        this.value = value;
    }
}
class IRLiteralCStringExpression extends IRLiteralExpression {
    constructor(bytes) {
        super(IRExpressionTag.IRLiteralCStringExpression);
        this.bytes = bytes;
    }
}
class IRLiteralStringExpression extends IRLiteralExpression {
    constructor(bytes) {
        super(IRExpressionTag.IRLiteralStringExpression);
        this.bytes = bytes;
    }
}
class IRFormatStringComponent {
}
class IRFormatStringTextComponent extends IRFormatStringComponent {
    constructor(bytes) {
        super();
        this.bytes = bytes;
    }
}
class IRFormatStringArgComponent extends IRFormatStringComponent {
    constructor(aidx, atype) {
        super();
        this.aidx = aidx;
        this.atype = atype;
    }
}
class IRLiteralFormatStringExpression extends IRLiteralExpression {
    constructor(fmtid, fmts) {
        super(IRExpressionTag.IRLiteralFormatStringExpression);
        this.fmtid = fmtid;
        this.fmts = fmts;
    }
}
class IRLiteralFormatCStringExpression extends IRLiteralExpression {
    constructor(fmtid, fmts) {
        super(IRExpressionTag.IRLiteralFormatCStringExpression);
        this.fmtid = fmtid;
        this.fmts = fmts;
    }
}
//
//TODO: Path literal expressions here
//
class IRLiteralTypedExpression extends IRLiteralExpression {
    constructor(value, constype) {
        super(IRExpressionTag.IRLiteralTypedExpression);
        this.value = value;
        this.constype = constype;
    }
}
class IRLiteralTypedStringExpression extends IRLiteralExpression {
    constructor(bytes, constype) {
        super(IRExpressionTag.IRLiteralTypedStringExpression);
        this.bytes = bytes;
        this.constype = constype;
    }
}
class IRLiteralTypedCStringExpression extends IRLiteralExpression {
    constructor(bytes, constype) {
        super(IRExpressionTag.IRLiteralTypedCStringExpression);
        this.bytes = bytes;
        this.constype = constype;
    }
}
class IRAccessEnvHasExpression extends IRExpression {
    constructor(keybytes) {
        super(IRExpressionTag.IRAccessEnvHasExpression);
        this.keybytes = keybytes;
    }
    isSimpleExpression() {
        return false;
    }
}
class IRAccessEnvGetExpression extends IRExpression {
    constructor(keybytes, oftype) {
        super(IRExpressionTag.IRAccessEnvGetExpression);
        this.keybytes = keybytes;
        this.oftype = oftype;
    }
    isSimpleExpression() {
        return false;
    }
}
class IRAccessEnvTryGetExpression extends IRExpression {
    constructor(keybytes, oftype, optiontype) {
        super(IRExpressionTag.IRAccessEnvTryGetExpression);
        this.keybytes = keybytes;
        this.oftype = oftype;
        this.optiontype = optiontype;
    }
    isSimpleExpression() {
        return false;
    }
}
class IRTaskAccessIDExpression extends IRExpression {
    constructor() {
        super(IRExpressionTag.IRTaskAccessIDExpression);
    }
    isSimpleExpression() {
        return false;
    }
}
class IRTaskAccessParentIDExpression extends IRExpression {
    constructor() {
        super(IRExpressionTag.IRTaskAccessParentIDExpression);
    }
    isSimpleExpression() {
        return false;
    }
}
class IRAccessConstantExpression extends IRImmediateExpression {
    constructor(constkey) {
        super(IRExpressionTag.IRAccessConstantExpression);
        this.constkey = constkey;
    }
}
class IRAccessEnumExpression extends IRImmediateExpression {
    constructor(tkey, membername) {
        super(IRExpressionTag.IRAccessEnumExpression);
        this.tkey = tkey;
        this.membername = membername;
    }
}
class IRAccessParameterVariableExpression extends IRImmediateExpression {
    constructor(pname) {
        super(IRExpressionTag.IRAccessParameterVariableExpression);
        this.pname = pname;
    }
}
class IRAccessLocalVariableExpression extends IRImmediateExpression {
    constructor(vname) {
        super(IRExpressionTag.IRAccessLocalVariableExpression);
        this.vname = vname;
    }
}
class IRAccessCapturedVariableExpression extends IRImmediateExpression {
    constructor(vname) {
        super(IRExpressionTag.IRAccessCapturedVariableExpression);
        this.vname = vname;
    }
}
class IRAccessTempVariableExpression extends IRImmediateExpression {
    constructor(vname) {
        super(IRExpressionTag.IRAccessTempVariableExpression);
        this.vname = vname;
    }
}
class IRAccessTypeDeclValueExpression extends IRSimpleExpression {
    constructor(accesstype, exp) {
        super(IRExpressionTag.IRAccessTypeDeclValueExpression);
        this.accesstype = accesstype;
        this.exp = exp;
    }
}
class IRConstructSafeTypeDeclExpression extends IRSimpleExpression {
    constructor(constype, value) {
        super(IRExpressionTag.IRConstructSafeTypeDeclExpression);
        this.constype = constype;
        this.value = value;
    }
}
class IRConstructorSomeTypeExpression extends IRSimpleExpression {
    constructor(oftype, value) {
        super(IRExpressionTag.IRConstructorSomeTypeExpression);
        this.oftype = oftype;
        this.value = value;
    }
}
class IRConstructorOkTypeExpression extends IRSimpleExpression {
    constructor(oftype, value) {
        super(IRExpressionTag.IRConstructorOkTypeExpression);
        this.oftype = oftype;
        this.value = value;
    }
}
class IRConstructorFailTypeExpression extends IRSimpleExpression {
    constructor(oftype, value) {
        super(IRExpressionTag.IRConstructorFailTypeExpression);
        this.oftype = oftype;
        this.value = value;
    }
}
class IRConstructorMapEntryTypeExpression extends IRSimpleExpression {
    constructor(oftype, key, value) {
        super(IRExpressionTag.IRConstructorMapEntryTypeExpression);
        this.oftype = oftype;
        this.key = key;
        this.value = value;
    }
}
//TODO: maybe add a specialized version of this that does boxing to a concept as well
class IRConstructorStandardEntityExpression extends IRConstructExpression {
    constructor(entitytype, values) {
        super(IRExpressionTag.IRConstructorStandardEntityExpression, entitytype);
        this.values = values;
    }
}
//TODO: maybe add a specialized version of this that does boxing to a concept as well
class IRConstructorLambdaExpression extends IRImmediateExpression {
    constructor(entitytype, values) {
        super(IRExpressionTag.IRConstructorLambdaExpression);
        this.ltype = entitytype;
        this.values = values;
    }
}
class IRConstructorEListExpression extends IRSimpleExpression {
    constructor(eltype, values) {
        super(IRExpressionTag.IRConstructorEListExpression);
        this.eltype = eltype;
        this.values = values;
    }
}
/* NOTE -- the empty constructor is a simple expression (as it is really a constant) we can place anywhere safely */
class IRConstructorListEmptyExpression extends IRConstructExpression {
    constructor(ctype) {
        super(IRExpressionTag.IRConstructorListEmptyExpression, ctype);
    }
}
class IRConstructorListSingletonsExpression extends IRConstructExpression {
    constructor(ctype, elements) {
        super(IRExpressionTag.IRConstructorListSingletonsExpression, ctype);
        this.elements = elements;
    }
}
//
//TODO: lots more expression types here
//
class IRAccessFieldSpecialExpression extends IRAccessFieldExpression {
    constructor(eexptype, eexp, intype, fieldname, fieldtype) {
        super(IRExpressionTag.IRAccessFieldSpecialExpression, eexptype, eexp, intype, fieldname, fieldtype);
    }
}
class IRAccessFieldDirectExpression extends IRAccessFieldExpression {
    constructor(eexptype, eexp, intype, fieldname, fieldtype) {
        super(IRExpressionTag.IRAccessFieldDirectExpression, eexptype, eexp, intype, fieldname, fieldtype);
    }
}
class IRAccessFieldVirtualExpression extends IRAccessFieldExpression {
    constructor(eexptype, eexp, intype, fieldname, fieldtype) {
        super(IRExpressionTag.IRAccessFieldVirtualExpression, eexptype, eexp, intype, fieldname, fieldtype);
    }
}
class IRAccessEListIndexExpression extends IRSimpleExpression {
    constructor(eltype, eexp, idx) {
        super(IRExpressionTag.IRAccessEListIndexExpression);
        this.eltype = eltype;
        this.eexp = eexp;
        this.idx = idx;
    }
}
/** Simple invocations functions/methods/lambdas that do not have any special parameters **/
class IRInvokeSimpleExpression extends IRInvokeDirectExpression {
    constructor(ikey, args) {
        super(IRExpressionTag.IRInvokeSimpleExpression, ikey, args);
    }
}
/** Simple invocations functions/methods/lambdas that have any special ref/out/out?/inout parameters **/
class IRInvokeSimpleWithImplicitsExpression extends IRInvokeImplicitsExpression {
    constructor(ikey, args, implicitidx, ivar, ivartype, passkind) {
        super(IRExpressionTag.IRInvokeSimpleWithImplicitsExpression, ikey, args, implicitidx, ivar, ivartype, passkind);
    }
}
/** Virtual invocations functions/methods/lambdas that do not have any special parameters (arg0 is the receiver) **/
class IRInvokeVirtualSimpleExpression extends IRInvokeDirectExpression {
    constructor(ikey, rcvr, args) {
        super(IRExpressionTag.IRInvokeVirtualSimpleExpression, ikey, args);
        this.rcvr = rcvr;
    }
}
/** Virtual invocations functions/methods/lambdas that have any special ref/out/out?/inout parameters (arg0 is the receiver) **/
class IRInvokeVirtualWithImplicitsExpression extends IRInvokeImplicitsExpression {
    constructor(ikey, rcvr, args, implicitidx, ivar, ivartype, passkind) {
        super(IRExpressionTag.IRInvokeVirtualWithImplicitsExpression, ikey, args, implicitidx, ivar, ivartype, passkind);
        this.rcvr = rcvr;
    }
}
class IRInterpolateFormatCStringExpression extends IRConstructExpression {
    constructor(fmtString, args) {
        super(IRExpressionTag.IRInterpolateFormatCStringExpression, new IRNominalTypeSignature("CString"));
        this.fmtString = fmtString;
        this.args = args;
    }
}
class IRInterpolateFormatStringExpression extends IRConstructExpression {
    constructor(fmtString, args) {
        super(IRExpressionTag.IRInterpolateFormatCStringExpression, new IRNominalTypeSignature("String"));
        this.fmtString = fmtString;
        this.args = args;
    }
}
class IRUnaryOpExpression extends IRSimpleExpression {
    constructor(tag, exp, opertype) {
        super(tag);
        this.exp = exp;
        this.opertype = opertype;
    }
}
class IRPrefixNotOpExpression extends IRUnaryOpExpression {
    constructor(exp, opertype) {
        super(IRExpressionTag.IRPrefixNotOpExpression, exp, opertype);
    }
}
class IRPrefixNegateOpExpression extends IRUnaryOpExpression {
    constructor(exp, opertype) {
        super(IRExpressionTag.IRPrefixNegateOpExpression, exp, opertype);
    }
}
class IRPrefixPlusOpExpression extends IRUnaryOpExpression {
    constructor(exp, opertype) {
        super(IRExpressionTag.IRPrefixPlusOpExpression, exp, opertype);
    }
}
class IRBinOpExpression extends IRSimpleExpression {
    constructor(tag, left, right, opertype) {
        super(tag);
        this.left = left;
        this.right = right;
        this.opertype = opertype;
    }
}
class IRBinAddExpression extends IRBinOpExpression {
    constructor(left, right, opertype) {
        super(IRExpressionTag.IRBinAddExpression, left, right, opertype);
    }
}
class IRBinSubExpression extends IRBinOpExpression {
    constructor(left, right, opertype) {
        super(IRExpressionTag.IRBinSubExpression, left, right, opertype);
    }
}
class IRBinMultExpression extends IRBinOpExpression {
    constructor(left, right, opertype) {
        super(IRExpressionTag.IRBinMultExpression, left, right, opertype);
    }
}
class IRBinDivExpression extends IRBinOpExpression {
    constructor(left, right, opertype) {
        super(IRExpressionTag.IRBinDivExpression, left, right, opertype);
    }
}
class IRNumericComparisonExpression extends IRSimpleExpression {
    constructor(tag, left, right, opertype) {
        super(tag);
        this.left = left;
        this.right = right;
        this.opertype = opertype;
    }
}
class IRNumericEqExpression extends IRNumericComparisonExpression {
    constructor(left, right, opertype) {
        super(IRExpressionTag.IRNumericEqExpression, left, right, opertype);
    }
}
class IRNumericNeqExpression extends IRNumericComparisonExpression {
    constructor(left, right, opertype) {
        super(IRExpressionTag.IRNumericNeqExpression, left, right, opertype);
    }
}
class IRNumericLessExpression extends IRNumericComparisonExpression {
    constructor(left, right, opertype) {
        super(IRExpressionTag.IRNumericLessExpression, left, right, opertype);
    }
}
class IRNumericLessEqExpression extends IRNumericComparisonExpression {
    constructor(left, right, opertype) {
        super(IRExpressionTag.IRNumericLessEqExpression, left, right, opertype);
    }
}
class IRNumericGreaterExpression extends IRNumericComparisonExpression {
    constructor(left, right, opertype) {
        super(IRExpressionTag.IRNumericGreaterExpression, left, right, opertype);
    }
}
class IRNumericGreaterEqExpression extends IRNumericComparisonExpression {
    constructor(left, right, opertype) {
        super(IRExpressionTag.IRNumericGreaterEqExpression, left, right, opertype);
    }
}
class IRIsNoneOptionExpression extends IRSimpleExpression {
    constructor(exp, opttype) {
        super(IRExpressionTag.IRIsNoneOptionExpression);
        this.exp = exp;
        this.opttype = opttype;
    }
}
class IRIsNotNoneOptionExpression extends IRSimpleExpression {
    constructor(exp, opttype) {
        super(IRExpressionTag.IRIsNotNoneOptionExpression);
        this.exp = exp;
        this.opttype = opttype;
    }
}
class IRIsOptionEqValueExpression extends IRSimpleExpression {
    constructor(optexp, opttype, valexp, valtype) {
        super(IRExpressionTag.IRIsOptionEqValueExpression);
        this.optexp = optexp;
        this.opttype = opttype;
        this.valexp = valexp;
        this.valtype = valtype;
    }
}
class IRIsOptionNeqValueExpression extends IRSimpleExpression {
    constructor(optexp, opttype, valexp, valtype) {
        super(IRExpressionTag.IRIsOptionNeqValueExpression);
        this.optexp = optexp;
        this.opttype = opttype;
        this.valexp = valexp;
        this.valtype = valtype;
    }
}
class IRIsSomeEqValueExpression extends IRSimpleExpression {
    constructor(someexp, sometype, valexp, valtype) {
        super(IRExpressionTag.IRIsSomeEqValueExpression);
        this.someexp = someexp;
        this.sometype = sometype;
        this.valexp = valexp;
        this.valtype = valtype;
    }
}
class IRIsSomeNeqValueExpression extends IRSimpleExpression {
    constructor(someexp, sometype, valexp, valtype) {
        super(IRExpressionTag.IRIsSomeNeqValueExpression);
        this.someexp = someexp;
        this.sometype = sometype;
        this.valexp = valexp;
        this.valtype = valtype;
    }
}
class IRKeyComparisonExpression extends IRSimpleExpression {
    constructor(tag, left, right, opertype) {
        super(tag);
        this.left = left;
        this.right = right;
        this.opertype = opertype;
    }
}
class IRBinKeyEqDirectExpression extends IRKeyComparisonExpression {
    constructor(left, right, opertype) {
        super(IRExpressionTag.IRBinKeyEqDirectExpression, left, right, opertype);
    }
}
class IRBinKeyNeqDirectExpression extends IRKeyComparisonExpression {
    constructor(left, right, opertype) {
        super(IRExpressionTag.IRBinKeyNeqDirectExpression, left, right, opertype);
    }
}
class IRBinKeyLessDirectExpression extends IRKeyComparisonExpression {
    constructor(left, right, opertype) {
        super(IRExpressionTag.IRBinKeyLessDirectExpression, left, right, opertype);
    }
}
class IRLogicOpExpression extends IRSimpleExpression {
    constructor(tag, args) {
        super(tag);
        this.args = args;
    }
}
class IRLogicAndExpression extends IRLogicOpExpression {
    constructor(args) {
        super(IRExpressionTag.IRLogicAndExpression, args);
    }
}
class IRLogicOrExpression extends IRLogicOpExpression {
    constructor(args) {
        super(IRExpressionTag.IRLogicOrExpression, args);
    }
}
class IRLogicSimpleConditionalExpression extends IRSimpleExpression {
    constructor(condition, trueexp, falseexp) {
        super(IRExpressionTag.IRLogicSimpleConditionalExpression);
        this.condition = condition;
        this.trueexp = trueexp;
        this.falseexp = falseexp;
    }
}
class IRLiteralOptionOfNoneExpression extends IRLiteralExpression {
    constructor(opttype) {
        super(IRExpressionTag.IRLiteralOptionOfNoneExpression);
        this.opttype = opttype;
    }
}
class IRConstructOptionFromSomeExpression extends IRSimpleExpression {
    constructor(opttype, sometype, value) {
        super(IRExpressionTag.IRConstructOptionFromSomeExpression);
        this.opttype = opttype;
        this.sometype = sometype;
        this.value = value;
    }
}
class IRExtractSomeFromOptionExpression extends IRSimpleExpression {
    constructor(opttype, sometype, value) {
        super(IRExpressionTag.IRExtractSomeFromOptionExpression);
        this.opttype = opttype;
        this.sometype = sometype;
        this.value = value;
    }
}
class IRExtractSomeValueFromOptionExpression extends IRSimpleExpression {
    constructor(opttype, sometype, ttype, value) {
        super(IRExpressionTag.IRExtractSomeValueFromOptionExpression);
        this.opttype = opttype;
        this.sometype = sometype;
        this.ttype = ttype;
        this.value = value;
    }
}
class IRConstructResultFromOkExpression extends IRSimpleExpression {
    constructor(rtype, oktype, value) {
        super(IRExpressionTag.IRConstructResultFromOkExpression);
        this.rtype = rtype;
        this.oktype = oktype;
        this.value = value;
    }
}
class IRConstructResultFromFailExpression extends IRSimpleExpression {
    constructor(rtype, failtype, value) {
        super(IRExpressionTag.IRConstructResultFromFailExpression);
        this.rtype = rtype;
        this.failtype = failtype;
        this.value = value;
    }
}
class IRExtractOkFromResultExpression extends IRSimpleExpression {
    constructor(rtype, oktype, value) {
        super(IRExpressionTag.IRExtractOkFromResultExpression);
        this.rtype = rtype;
        this.oktype = oktype;
        this.value = value;
    }
}
class IRExtractOkValueFromResultExpression extends IRSimpleExpression {
    constructor(rtype, oktype, ttype, value) {
        super(IRExpressionTag.IRExtractOkValueFromResultExpression);
        this.rtype = rtype;
        this.oktype = oktype;
        this.ttype = ttype;
        this.value = value;
    }
}
class IRExtractFailFromResultExpression extends IRSimpleExpression {
    constructor(rtype, failtype, value) {
        super(IRExpressionTag.IRExtractFailFromResultExpression);
        this.rtype = rtype;
        this.failtype = failtype;
        this.value = value;
    }
}
class IRExtractFailValueFromResultExpression extends IRSimpleExpression {
    constructor(rtype, failtype, etype, value) {
        super(IRExpressionTag.IRExtractFailValueFromResultExpression);
        this.rtype = rtype;
        this.failtype = failtype;
        this.etype = etype;
        this.value = value;
    }
}
class IRConceptRepresentationOfTypeExpression extends IRSimpleExpression {
    constructor(tag, exp, exptype, targettype) {
        super(tag);
        this.exp = exp;
        this.exptype = exptype;
        this.targettype = targettype;
    }
}
class IRIsConceptRepresentationOfTypeExpression extends IRConceptRepresentationOfTypeExpression {
    constructor(exp, exptype, targettype) {
        super(IRExpressionTag.IRIsConceptRepresentationOfTypeExpression, exp, exptype, targettype);
    }
}
class IRIsNotConceptRepresentationOfTypeExpression extends IRConceptRepresentationOfTypeExpression {
    constructor(exp, exptype, targettype) {
        super(IRExpressionTag.IRIsNotConceptRepresentationOfTypeExpression, exp, exptype, targettype);
    }
}
class IRIsConceptRepresentationSubtypeOfTypeExpression extends IRConceptRepresentationOfTypeExpression {
    constructor(exp, exptype, targettype) {
        super(IRExpressionTag.IRIsConceptRepresentationSubtypeOfTypeExpression, exp, exptype, targettype);
    }
}
class IRIsNotConceptRepresentationSubtypeOfTypeExpression extends IRConceptRepresentationOfTypeExpression {
    constructor(exp, exptype, targettype) {
        super(IRExpressionTag.IRIsNotConceptRepresentationSubtypeOfTypeExpression, exp, exptype, targettype);
    }
}
class IRStaticIsTypeSubtypeOfExpression extends IRSimpleExpression {
    constructor(exptype, targettype, isnot) {
        super(IRExpressionTag.IRStaticIsTypeSubtypeOfExpression);
        this.exptype = exptype;
        this.targettype = targettype;
        this.isnot = isnot;
    }
}
class IRBoxEntityToConceptRepresentationExpression extends IRSimpleExpression {
    constructor(totype, fromtype, value) {
        super(IRExpressionTag.IRBoxEntityToConceptRepresentationExpression);
        this.totype = totype;
        this.fromtype = fromtype;
        this.value = value;
    }
}
class IRUnboxEntityFromConceptRepresentationExpression extends IRSimpleExpression {
    constructor(fromtype, totype, value) {
        super(IRExpressionTag.IRUnboxEntityFromConceptRepresentationExpression);
        this.fromtype = fromtype;
        this.totype = totype;
        this.value = value;
    }
}
class IRConvertConceptRepresentationExpression extends IRSimpleExpression {
    constructor(fromtype, totype, value) {
        super(IRExpressionTag.IRConvertConceptRepresentationExpression);
        this.fromtype = fromtype;
        this.totype = totype;
        this.value = value;
    }
}
////////////////////////////////////////
//Basic Line statements
class IRNopStatement extends IRAtomicStatement {
    constructor() {
        super(IRStatementTag.IRNopStatement);
    }
    isSimpleStatement() {
        return true;
    }
}
class IRTempAssignExpressionStatement extends IRTempAssignStatement {
    constructor(tname, rhs, ttype) {
        super(IRStatementTag.IRTempAssignExpressionStatement, tname, ttype);
        this.rhs = rhs;
    }
}
class IRTempAssignStdInvokeStatement extends IRTempAssignStatement {
    constructor(tname, rhs, ttype) {
        super(IRStatementTag.IRTempAssignStdInvokeStatement, tname, ttype);
        this.rhs = rhs;
    }
}
//We definitely need to have the var type include the ref/out/intout.. placeholder info AND may need to check error results on this in smt
class IRTempAssignRefInvokeStatement extends IRTempAssignStatement {
    constructor(tname, ttype, ivar, ivartype, passkind, rhs) {
        super(IRStatementTag.IRTempAssignRefInvokeStatement, tname, ttype);
        this.ivar = ivar;
        this.ivartype = ivartype;
        this.passkind = passkind;
        this.rhs = rhs;
    }
}
class IRTempAssignDirectConstructorStatement extends IRTempAssignStatement {
    constructor(tname, ttype, rhs) {
        super(IRStatementTag.IRTempAssignDirectConstructorStatement, tname, ttype);
        this.rhs = rhs;
    }
}
class IRVariableDeclarationStatement extends IRAtomicStatement {
    constructor(vname, vtype) {
        super(IRStatementTag.IRVariableDeclarationStatement);
        this.vname = vname;
        this.vtype = vtype;
    }
    isSimpleStatement() {
        return true;
    }
}
class IRVariableInitializationStatement extends IRAtomicStatement {
    constructor(vname, vtype, initexp, isconst) {
        super(IRStatementTag.IRVariableInitializationStatement);
        this.vname = vname;
        this.vtype = vtype;
        this.initexp = initexp;
        this.isconst = isconst;
    }
    isSimpleStatement() {
        return true;
    }
}
class IRVariableInitializationDirectInvokeStatement extends IRAtomicStatement {
    constructor(scratch, vname, vtype, initexp, isconst) {
        super(IRStatementTag.IRVariableInitializationDirectInvokeStatement);
        this.scratchname = scratch;
        this.vname = vname;
        this.vtype = vtype;
        this.initexp = initexp;
        this.isconst = isconst;
    }
    isSimpleStatement() {
        return false;
    }
}
class IRVariableInitializationDirectInvokeWithImplicitStatement extends IRAtomicStatement {
    constructor(scratch, vname, vtype, initexp, isconst) {
        super(IRStatementTag.IRVariableInitializationDirectInvokeWithImplicitStatement);
        this.scratchname = scratch;
        this.vname = vname;
        this.vtype = vtype;
        this.initexp = initexp;
        this.isconst = isconst;
    }
    isSimpleStatement() {
        return false;
    }
}
class IRVariableInitializationDirectConstructorStatement extends IRAtomicStatement {
    constructor(vname, vtype, initexp, isconst) {
        super(IRStatementTag.IRVariableInitializationDirectConstructorStatement);
        this.vname = vname;
        this.vtype = vtype;
        this.initexp = initexp;
        this.isconst = isconst;
    }
    isSimpleStatement() {
        return true;
    }
}
class IRVariableInitializationDirectConstructorWithBoxStatement extends IRAtomicStatement {
    constructor(vname, vtype, fromtype, initexp, isconst) {
        super(IRStatementTag.IRVariableInitializationDirectConstructorWithBoxStatement);
        this.vname = vname;
        this.vtype = vtype;
        this.fromtype = fromtype;
        this.initexp = initexp;
        this.isconst = isconst;
    }
    isSimpleStatement() {
        return true;
    }
}
class IRVariableAssignmentStatement extends IRAtomicStatement {
    constructor(vname, vtype, aexp) {
        super(IRStatementTag.IRVariableAssignmentStatement);
        this.vname = vname;
        this.vtype = vtype;
        this.aexp = aexp;
    }
    isSimpleStatement() {
        return true;
    }
}
class IRVariableAssignmentDirectInvokeStatement extends IRAtomicStatement {
    constructor(scratch, vname, vtype, aexp) {
        super(IRStatementTag.IRVariableAssignmentDirectInvokeStatement);
        this.scratchname = scratch;
        this.vname = vname;
        this.vtype = vtype;
        this.aexp = aexp;
    }
    isSimpleStatement() {
        return false;
    }
}
class IRVariableAssignmentDirectInvokeWithImplicitStatement extends IRAtomicStatement {
    constructor(scratch, vname, vtype, aexp) {
        super(IRStatementTag.IRVariableAssignmentDirectInvokeWithImplicitStatement);
        this.scratchname = scratch;
        this.vname = vname;
        this.vtype = vtype;
        this.aexp = aexp;
    }
    isSimpleStatement() {
        return false;
    }
}
class IRVariableAssignmentDirectConstructorStatement extends IRAtomicStatement {
    constructor(vname, vtype, aexp) {
        super(IRStatementTag.IRVariableAssignmentDirectConstructorStatement);
        this.vname = vname;
        this.vtype = vtype;
        this.aexp = aexp;
    }
    isSimpleStatement() {
        return true;
    }
}
class IRVariableAssignmentDirectConstructorWithBoxStatement extends IRAtomicStatement {
    constructor(vname, vtype, fromtype, aexp) {
        super(IRStatementTag.IRVariableAssignmentDirectConstructorWithBoxStatement);
        this.vname = vname;
        this.vtype = vtype;
        this.fromtype = fromtype;
        this.aexp = aexp;
    }
    isSimpleStatement() {
        return true;
    }
}
//
//TODO: lots more statement types here
//
class IRReturnVoidSimpleStatement extends IRReturnSimpleStatement {
    constructor() {
        super(IRStatementTag.IRReturnVoidSimpleStatement);
    }
}
class IRReturnValueSimpleStatement extends IRReturnSimpleStatement {
    constructor(retexp) {
        super(IRStatementTag.IRReturnValueSimpleStatement);
        this.retexp = retexp;
    }
}
class IRReturnDirectInvokeStatement extends IRReturnSimpleStatement {
    constructor(retexp) {
        super(IRStatementTag.IRReturnDirectInvokeStatement);
        this.retexp = retexp;
    }
}
class IRReturnDirectConstructStatement extends IRReturnSimpleStatement {
    constructor(retexp) {
        super(IRStatementTag.IRReturnDirectConstructStatement);
        this.retexp = retexp;
    }
}
class IRReturnDirectConstructWithBoxStatement extends IRReturnSimpleStatement {
    constructor(retexp, fromtype, totype) {
        super(IRStatementTag.IRReturnDirectConstructWithBoxStatement);
        this.retexp = retexp;
        this.fromtype = fromtype;
        this.totype = totype;
    }
}
class IRReturnVoidWithImplicitStatement extends IRReturnWithImplicitStatement {
    constructor(implicitvar) {
        super(IRStatementTag.IRReturnVoidImplicitStatement, implicitvar);
    }
}
class IRReturnValueImplicitStatement extends IRReturnWithImplicitStatement {
    constructor(retexp, implicitvar) {
        super(IRStatementTag.IRReturnValueImplicitStatement, implicitvar);
        this.retexp = retexp;
    }
}
class IRReturnDirectInvokeImplicitStatement extends IRReturnWithImplicitStatement {
    constructor(retexp, implicitvar) {
        super(IRStatementTag.IRReturnDirectInvokeImplicitStatement, implicitvar);
        this.retexp = retexp;
    }
}
class IRReturnDirectInvokeImplicitPassThroughStatement extends IRReturnWithImplicitStatement {
    constructor(retexp, implicitvar) {
        super(IRStatementTag.IRReturnDirectInvokeImplicitPassThroughStatement, implicitvar);
        this.retexp = retexp;
    }
}
class IRReturnDirectConstructImplicitStatement extends IRReturnWithImplicitStatement {
    constructor(retexp, implicitvar) {
        super(IRStatementTag.IRReturnDirectConstructImplicitStatement, implicitvar);
        this.retexp = retexp;
    }
}
class IRReturnDirectConstructWithBoxImplicitStatement extends IRReturnWithImplicitStatement {
    constructor(retexp, fromtype, totype, implicitvar) {
        super(IRStatementTag.IRReturnDirectConstructWithBoxImplicitStatement, implicitvar);
        this.retexp = retexp;
        this.fromtype = fromtype;
        this.totype = totype;
    }
}
class IRVoidInvokeStatement extends IRAtomicStatement {
    constructor(scratch, aexp) {
        super(IRStatementTag.IRVoidInvokeStatement);
        this.scratchname = scratch;
        this.aexp = aexp;
    }
    isSimpleStatement() {
        return false;
    }
}
class IRChkLogicImpliesShortCircuitStatement extends IRStatement {
    constructor(tvar, lhs, rstmts, rexp) {
        super(IRStatementTag.IRChkLogicImpliesShortCircuitStatement);
        this.tvar = tvar;
        this.lhs = lhs;
        this.rstmts = rstmts;
        this.rexp = rexp;
    }
    isSimpleStatement() {
        return this.lhs.isSimpleExpression() && this.rstmts.every(s => s.isSimpleStatement()) && this.rexp.isSimpleExpression();
    }
}
class IRLogicConditionalStatement extends IRStatement {
    constructor(tvar, ttype, condition, truestmt, trueexp, falsestmt, falseexp) {
        super(IRStatementTag.IRLogicConditionalStatement);
        this.tvar = tvar;
        this.ttype = ttype;
        this.condition = condition;
        this.truestmt = truestmt;
        this.trueexp = trueexp;
        this.falsestmt = falsestmt;
        this.falseexp = falseexp;
    }
    isSimpleStatement() {
        return this.condition.isSimpleExpression() && this.truestmt.every(s => s.isSimpleStatement()) && this.trueexp.isSimpleExpression() && this.falsestmt.every(s => s.isSimpleStatement()) && this.falseexp.isSimpleExpression();
    }
}
class IRSimpleIfStatement extends IRStatement {
    constructor(cond, tblock) {
        super(IRStatementTag.IRSimpleIfStatement);
        this.cond = cond;
        this.tblock = tblock;
    }
    isSimpleStatement() {
        return this.cond.isSimpleExpression() && this.tblock.isSimpleStatement();
    }
}
class IRSimpleIfElseStatement extends IRStatement {
    constructor(cond, tblock, eblock) {
        super(IRStatementTag.IRSimpleIfElseStatement);
        this.cond = cond;
        this.tblock = tblock;
        this.eblock = eblock;
    }
    isTerminalStatement() {
        return this.tblock.isTerminalStatement() && this.eblock.isTerminalStatement();
    }
    isSimpleStatement() {
        return this.cond.isSimpleExpression() && this.tblock.isSimpleStatement() && this.eblock.isSimpleStatement();
    }
}
class IRMatchExactStatement extends IRStatement {
    constructor(sval, svaltype, bindername, flow, implicitFinalType) {
        super(IRStatementTag.IRMatchExactStatement);
        this.sval = sval;
        this.svaltype = svaltype;
        this.bindervar = bindername;
        this.matchflow = flow;
        this.implicitFinalType = implicitFinalType;
    }
    isTerminalStatement() {
        return this.matchflow.every(f => f.value.isTerminalStatement());
    }
    isSimpleStatement() {
        return this.sval.isSimpleExpression() && this.matchflow.every(f => f.value.isSimpleStatement());
    }
}
class IRMatchGeneralStatement extends IRStatement {
    constructor(sval, svaltype, bindername, flow, implicitFinalType) {
        super(IRStatementTag.IRMatchGeneralStatement);
        this.sval = sval;
        this.svaltype = svaltype;
        this.bindervar = bindername;
        this.matchflow = flow;
        this.implicitFinalType = implicitFinalType;
    }
    isTerminalStatement() {
        return this.matchflow.every(f => f.value.isTerminalStatement());
    }
    isSimpleStatement() {
        return this.sval.isSimpleExpression() && this.matchflow.every(f => f.value.isSimpleStatement());
    }
}
class IRErrorAdditionBoundsCheckStatement extends IRErrorBinArithCheckStatement {
    constructor(file, sinfo, checkID, left, right, optypechk) {
        super(IRStatementTag.IRErrorAdditionBoundsCheckStatement, file, sinfo, undefined, checkID, left, right, optypechk);
    }
}
class IRErrorSubtractionBoundsCheckStatement extends IRErrorBinArithCheckStatement {
    constructor(file, sinfo, checkID, left, right, optypechk) {
        super(IRStatementTag.IRErrorSubtractionBoundsCheckStatement, file, sinfo, undefined, checkID, left, right, optypechk);
    }
}
class IRErrorMultiplicationBoundsCheckStatement extends IRErrorBinArithCheckStatement {
    constructor(file, sinfo, checkID, left, right, optypechk) {
        super(IRStatementTag.IRErrorMultiplicationBoundsCheckStatement, file, sinfo, undefined, checkID, left, right, optypechk);
    }
}
class IRErrorDivisionByZeroCheckStatement extends IRErrorBinArithCheckStatement {
    constructor(file, sinfo, checkID, left, right, optypechk) {
        super(IRStatementTag.IRErrorDivisionByZeroCheckStatement, file, sinfo, undefined, checkID, left, right, optypechk);
    }
}
class IRErrorTypeAssertionCheckStatement extends IRErrorCheckStatement {
    constructor(file, sinfo, diagnosticTag, checkID, typeok) {
        super(IRStatementTag.IRErrorTypeAssertionCheckStatement, file, sinfo, diagnosticTag, checkID);
        this.typeok = typeok;
    }
}
class IRErrorExhaustiveStatement extends IRErrorCheckStatement {
    constructor(file, sinfo, checkID) {
        super(IRStatementTag.IRErrorExhaustiveStatement, file, sinfo, undefined, checkID);
    }
    isTerminalStatement() { return true; }
}
class IRTypeDeclSizeRangeCheckCStringStatement extends IRErrorTypedStringCheckStatement {
    constructor(file, sinfo, checkID, min, max, strexp) {
        super(IRStatementTag.IRTypeDeclSizeRangeCheckCStringStatement, file, sinfo, undefined, checkID, strexp);
        this.min = min;
        this.max = max;
    }
}
class IRTypeDeclSizeRangeCheckUnicodeStringStatement extends IRErrorTypedStringCheckStatement {
    constructor(file, sinfo, checkID, min, max, strexp) {
        super(IRStatementTag.IRTypeDeclSizeRangeCheckUnicodeStringStatement, file, sinfo, undefined, checkID, strexp);
        this.min = min;
        this.max = max;
    }
}
class IRTypeDeclNumericRangeCheckStatement extends IRErrorCheckStatement {
    constructor(file, sinfo, checkID, min, max, numexp) {
        super(IRStatementTag.IRTypeDeclNumericRangeCheckStatement, file, sinfo, undefined, checkID);
        this.min = min;
        this.max = max;
        this.numexp = numexp;
    }
}
class IRTypeDeclFormatCheckCStringStatement extends IRErrorTypedStringCheckStatement {
    constructor(file, sinfo, checkID, re, strexp) {
        super(IRStatementTag.IRTypeDeclFormatCheckCStringStatement, file, sinfo, undefined, checkID, strexp);
        this.re = re;
    }
}
class IRTypeDeclFormatCheckUnicodeStringStatement extends IRErrorTypedStringCheckStatement {
    constructor(file, sinfo, checkID, re, strexp) {
        super(IRStatementTag.IRTypeDeclFormatCheckUnicodeStringStatement, file, sinfo, undefined, checkID, strexp);
        this.re = re;
    }
}
/* This calls the defined invariant check function for the target type decl on the provided value -- errors are reported from there */
class IRTypeDeclInvariantCheckStatement extends IRErrorCheckStatement {
    constructor(file, sinfo, diagnosticTag, checkID, tkey, invariantidx, targetValue) {
        super(IRStatementTag.IRTypeDeclInvariantCheckStatement, file, sinfo, diagnosticTag, checkID);
        this.tkey = tkey;
        this.invariantidx = invariantidx;
        this.targetValue = targetValue;
    }
}
class IREntityInvariantCheckStatement extends IRErrorCheckStatement {
    constructor(file, sinfo, diagnosticTag, checkID, tkey, invariantidx, args) {
        super(IRStatementTag.IREntityInvariantCheckStatement, file, sinfo, diagnosticTag, checkID);
        this.tkey = tkey;
        this.invariantidx = invariantidx;
        this.args = args;
    }
}
/* This asserts that the given precondition expression is true */
class IRPreconditionCheckStatement extends IRErrorCheckStatement {
    constructor(file, sinfo, diagnosticTag, checkID, ikey, requiresidx, args) {
        super(IRStatementTag.IRPreconditionCheckStatement, file, sinfo, diagnosticTag, checkID);
        this.ikey = ikey;
        this.requiresidx = requiresidx;
        this.args = args;
    }
}
/* This asserts that the given postcondition expresssion is true */
class IRPostconditionCheckStatement extends IRErrorCheckStatement {
    constructor(file, sinfo, diagnosticTag, checkID, ikey, ensuresidx, args) {
        super(IRStatementTag.IRPostconditionCheckStatement, file, sinfo, diagnosticTag, checkID);
        this.ikey = ikey;
        this.ensuresidx = ensuresidx;
        this.args = args;
    }
}
class IRAbortStatement extends IRErrorCheckStatement {
    constructor(file, sinfo, diagnosticTag, checkID) {
        super(IRStatementTag.IRAbortStatement, file, sinfo, diagnosticTag, checkID);
    }
    isTerminalStatement() { return true; }
}
class IRAssertStatement extends IRErrorCheckStatement {
    constructor(file, sinfo, diagnosticTag, checkID, cond) {
        super(IRStatementTag.IRAssertStatement, file, sinfo, diagnosticTag, checkID);
        this.cond = cond;
    }
}
class IRAssumeStatement extends IRErrorCheckStatement {
    constructor(file, sinfo, cond) {
        super(IRStatementTag.IRAssumeStatement, file, sinfo, undefined, IRErrorCheckStatement.assumeCheckID);
        this.cond = cond;
    }
}
class IRValidateStatement extends IRErrorCheckStatement {
    constructor(file, sinfo, diagnosticTag, checkID, cond) {
        super(IRStatementTag.IRValidateStatement, file, sinfo, diagnosticTag, checkID);
        this.cond = cond;
    }
}
class IRDebugStatement extends IRAtomicStatement {
    constructor(oftype, dbgexp, file, sinfo) {
        super(IRStatementTag.IRDebugStatement);
        this.oftype = oftype;
        this.dbgexp = dbgexp;
        this.file = file;
        this.line = sinfo.line;
    }
    isSimpleStatement() {
        return this.dbgexp.isSimpleExpression();
    }
}
class IRBlockStatement extends IRStatement {
    constructor(statements) {
        super(IRStatementTag.IRBlockStatement);
        this.statements = statements;
    }
    isTerminalStatement() {
        return this.statements.length > 0 && this.statements[this.statements.length - 1].isTerminalStatement();
    }
    isSimpleStatement() {
        return this.statements.every(s => s.isSimpleStatement());
    }
}
class IRBody {
    constructor() {
    }
}
class IRBuiltinBody extends IRBody {
    constructor(builtin, biterms) {
        super();
        this.builtin = builtin;
        this.biterms = biterms;
    }
    isSimpleBody() {
        return false;
    }
}
class IRHoleBody extends IRBody {
    constructor(hname, doccomment, samplesfile) {
        super();
        this.hname = hname;
        this.doccomment = doccomment;
        this.samplesfile = samplesfile;
    }
    isSimpleBody() {
        return false;
    }
}
class IRStandardBody extends IRBody {
    constructor(statements) {
        super();
        this.statements = statements;
    }
    isSimpleBody() {
        return this.statements.every(s => s.isSimpleStatement());
    }
}
export { IRExpressionTag, IRExpression, IRLiteralExpression, IRImmediateExpression, IRSimpleExpression, IRLiteralNoneExpression, IRLiteralBoolExpression, IRLiteralIntegralNumberExpression, IRLiteralNatExpression, IRLiteralIntExpression, IRLiteralChkNatExpression, IRLiteralChkIntExpression, IRLiteralRationalExpression, IRLiteralFloatingPointExpression, IRLiteralFloatExpression, IRLiteralDecimalExpression, IRLiteralDecimalDegreeExpression, IRLiteralLatLongCoordinateExpression, IRLiteralComplexExpression, IRLiteralByteBufferExpression, IRLiteralUUIDv4Expression, IRLiteralUUIDv7Expression, IRLiteralSHAContentHashExpression, IRDateRepresentation, IRTimeRepresentation, IRLiteralTZDateTimeExpression, IRLiteralTAITimeExpression, IRLiteralPlainDateExpression, IRLiteralPlainTimeExpression, IRLiteralLogicalTimeExpression, IRLiteralISOTimeStampExpression, IRDeltaDateRepresentation, IRDeltaTimeRepresentation, IRLiteralDeltaDateTimeExpression, IRLiteralDeltaISOTimeStampExpression, IRLiteralDeltaSecondsExpression, IRLiteralDeltaLogicalTimeExpression, IRLiteralUnicodeRegexExpression, IRLiteralCRegexExpression, IRLiteralByteExpression, IRLiteralCCharExpression, IRLiteralUnicodeCharExpression, IRLiteralCStringExpression, IRLiteralStringExpression, IRFormatStringComponent, IRFormatStringTextComponent, IRFormatStringArgComponent, IRLiteralFormatStringExpression, IRLiteralFormatCStringExpression, IRLiteralTypedExpression, IRLiteralTypedStringExpression, IRLiteralTypedCStringExpression, IRAccessEnvHasExpression, IRAccessEnvGetExpression, IRAccessEnvTryGetExpression, IRTaskAccessIDExpression, IRTaskAccessParentIDExpression, IRAccessConstantExpression, IRAccessEnumExpression, IRAccessParameterVariableExpression, IRAccessLocalVariableExpression, IRAccessCapturedVariableExpression, IRAccessTempVariableExpression, IRAccessTypeDeclValueExpression, IRConstructSafeTypeDeclExpression, IRConstructorSomeTypeExpression, IRConstructorOkTypeExpression, IRConstructorFailTypeExpression, IRConstructorMapEntryTypeExpression, IRConstructExpression, IRConstructorStandardEntityExpression, IRConstructorLambdaExpression, IRConstructorEListExpression, IRConstructorListEmptyExpression, IRConstructorListSingletonsExpression, IRAccessFieldExpression, IRAccessFieldSpecialExpression, IRAccessFieldDirectExpression, IRAccessFieldVirtualExpression, IRAccessEListIndexExpression, IRInvokeExpression, IRInvokeDirectExpression, IRInvokeImplicitsExpression, IRInvokeSimpleExpression, IRInvokeSimpleWithImplicitsExpression, IRInvokeVirtualSimpleExpression, IRInvokeVirtualWithImplicitsExpression, IRInterpolateFormatCStringExpression, IRInterpolateFormatStringExpression, IRUnaryOpExpression, IRPrefixNotOpExpression, IRPrefixNegateOpExpression, IRPrefixPlusOpExpression, IRBinOpExpression, IRBinAddExpression, IRBinSubExpression, IRBinMultExpression, IRBinDivExpression, IRNumericComparisonExpression, IRNumericEqExpression, IRNumericNeqExpression, IRNumericLessExpression, IRNumericLessEqExpression, IRNumericGreaterExpression, IRNumericGreaterEqExpression, IRIsNoneOptionExpression, IRIsNotNoneOptionExpression, IRIsOptionEqValueExpression, IRIsOptionNeqValueExpression, IRIsSomeEqValueExpression, IRIsSomeNeqValueExpression, IRKeyComparisonExpression, IRBinKeyEqDirectExpression, IRBinKeyNeqDirectExpression, IRBinKeyLessDirectExpression, IRLogicOpExpression, IRLogicAndExpression, IRLogicOrExpression, IRLogicSimpleConditionalExpression, IRLiteralOptionOfNoneExpression, IRConstructOptionFromSomeExpression, IRExtractSomeFromOptionExpression, IRExtractSomeValueFromOptionExpression, IRConstructResultFromOkExpression, IRConstructResultFromFailExpression, IRExtractOkFromResultExpression, IRExtractOkValueFromResultExpression, IRExtractFailFromResultExpression, IRExtractFailValueFromResultExpression, IRConceptRepresentationOfTypeExpression, IRIsConceptRepresentationOfTypeExpression, IRIsNotConceptRepresentationOfTypeExpression, IRIsConceptRepresentationSubtypeOfTypeExpression, IRIsNotConceptRepresentationSubtypeOfTypeExpression, IRStaticIsTypeSubtypeOfExpression, IRBoxEntityToConceptRepresentationExpression, IRUnboxEntityFromConceptRepresentationExpression, IRConvertConceptRepresentationExpression, IRStatementTag, IRStatement, IRAtomicStatement, IRReturnSimpleStatement, IRReturnWithImplicitStatement, IRErrorCheckStatement, IRErrorBinArithCheckStatement, IRNopStatement, IRTempAssignExpressionStatement, IRTempAssignStdInvokeStatement, IRTempAssignRefInvokeStatement, IRTempAssignDirectConstructorStatement, IRVariableDeclarationStatement, IRVariableInitializationStatement, IRVariableInitializationDirectInvokeStatement, IRVariableInitializationDirectInvokeWithImplicitStatement, IRVariableInitializationDirectConstructorStatement, IRVariableInitializationDirectConstructorWithBoxStatement, IRVariableAssignmentStatement, IRVariableAssignmentDirectInvokeStatement, IRVariableAssignmentDirectInvokeWithImplicitStatement, IRVariableAssignmentDirectConstructorStatement, IRVariableAssignmentDirectConstructorWithBoxStatement, IRReturnVoidSimpleStatement, IRReturnValueSimpleStatement, IRReturnDirectInvokeStatement, IRReturnDirectConstructStatement, IRReturnDirectConstructWithBoxStatement, IRReturnVoidWithImplicitStatement, IRReturnValueImplicitStatement, IRReturnDirectInvokeImplicitStatement, IRReturnDirectInvokeImplicitPassThroughStatement, IRReturnDirectConstructImplicitStatement, IRReturnDirectConstructWithBoxImplicitStatement, IRVoidInvokeStatement, IRChkLogicImpliesShortCircuitStatement, IRLogicConditionalStatement, IRSimpleIfStatement, IRSimpleIfElseStatement, IRMatchExactStatement, IRMatchGeneralStatement, IRErrorAdditionBoundsCheckStatement, IRErrorSubtractionBoundsCheckStatement, IRErrorMultiplicationBoundsCheckStatement, IRErrorDivisionByZeroCheckStatement, IRErrorTypeAssertionCheckStatement, IRErrorExhaustiveStatement, IRErrorTypedStringCheckStatement, IRTypeDeclSizeRangeCheckCStringStatement, IRTypeDeclSizeRangeCheckUnicodeStringStatement, IRTypeDeclNumericRangeCheckStatement, IRTypeDeclFormatCheckCStringStatement, IRTypeDeclFormatCheckUnicodeStringStatement, IRTypeDeclInvariantCheckStatement, IREntityInvariantCheckStatement, IRPreconditionCheckStatement, IRPostconditionCheckStatement, IRAbortStatement, IRAssertStatement, IRAssumeStatement, IRValidateStatement, IRDebugStatement, IRBlockStatement, IRBody, IRBuiltinBody, IRHoleBody, IRStandardBody };
//# sourceMappingURL=irbody.js.map