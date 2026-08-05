class IRSourceInfo {
    constructor(line, column) {
        this.line = line;
        this.column = column;
    }
}
class IRCRegex {
    constructor(regexID, bsqregex, smtregex, cppregex) {
        this.regexID = regexID;
        this.bsqregex = bsqregex;
        this.smtregex = smtregex;
        this.cppregex = cppregex;
    }
}
class IRURegex {
    constructor(regexID, bsqregex, smtregex, cppregex) {
        this.regexID = regexID;
        this.bsqregex = bsqregex;
        this.smtregex = smtregex;
        this.cppregex = cppregex;
    }
}
export { IRSourceInfo, IRCRegex, IRURegex };
//# sourceMappingURL=irsupport.js.map