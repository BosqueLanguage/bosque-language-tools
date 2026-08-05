class IRTypeSignature {
    constructor(tkeystr) {
        this.tkeystr = tkeystr;
    }
}
class IRVoidTypeSignature extends IRTypeSignature {
    constructor() {
        super("Void");
    }
    getDirectDependencyTypes() {
        return [];
    }
}
class IRNominalTypeSignature extends IRTypeSignature {
    constructor(tkeystr) {
        super(tkeystr);
    }
    getDirectDependencyTypes() {
        return [];
    }
}
class IREListTypeSignature extends IRTypeSignature {
    constructor(tkeystr, entries) {
        super(tkeystr);
        this.entries = entries;
    }
    getDirectDependencyTypes() {
        return this.entries;
    }
}
class IRDashResultTypeSignature extends IRTypeSignature {
    constructor(tkeystr, entries) {
        super(tkeystr);
        this.entries = entries;
    }
    getDirectDependencyTypes() {
        return this.entries;
    }
}
class IRFormatTypeSignature extends IRTypeSignature {
    constructor(tkeystr, rtype, terms) {
        super(tkeystr);
        this.rtype = rtype;
        this.terms = terms;
    }
    getDirectDependencyTypes() {
        return [this.rtype, ...this.terms.map(t => t.argtype)];
    }
}
class IRFormatCStringTypeSignature extends IRFormatTypeSignature {
    constructor(tkeystr, rtype, terms) {
        super(tkeystr, rtype, terms);
    }
}
class IRFormatStringTypeSignature extends IRFormatTypeSignature {
    constructor(tkeystr, rtype, terms) {
        super(tkeystr, rtype, terms);
    }
}
class IRFormatPathTypeSignature extends IRFormatTypeSignature {
    constructor(tkeystr, rtype, terms) {
        super(tkeystr, rtype, terms);
    }
}
class IRFormatPathFragmentTypeSignature extends IRFormatTypeSignature {
    constructor(tkeystr, rtype, terms) {
        super(tkeystr, rtype, terms);
    }
}
class IRFormatPathGlobTypeSignature extends IRFormatTypeSignature {
    constructor(tkeystr, rtype, terms) {
        super(tkeystr, rtype, terms);
    }
}
class IRLambdaParameterPackTypeSignature extends IRTypeSignature {
    constructor(tkeystr) {
        super(tkeystr);
    }
    getDirectDependencyTypes() {
        return [];
    }
}
export { IRTypeSignature, IRVoidTypeSignature, IRNominalTypeSignature, IREListTypeSignature, IRDashResultTypeSignature, IRFormatTypeSignature, IRFormatCStringTypeSignature, IRFormatStringTypeSignature, IRFormatPathTypeSignature, IRFormatPathFragmentTypeSignature, IRFormatPathGlobTypeSignature, IRLambdaParameterPackTypeSignature };
//# sourceMappingURL=irtype.js.map