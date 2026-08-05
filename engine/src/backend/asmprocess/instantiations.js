class LambdaInstantiationInfo {
    constructor(newikey, binds, lambdacons, monoinvids, capturedVars, capturedLambdas, capturedTemplateNames, lsig, body) {
        this.newikey = newikey;
        this.binds = binds;
        this.lambdacons = lambdacons;
        this.monoinvids = monoinvids;
        this.capturedVars = capturedVars;
        this.capturedLambdas = capturedLambdas;
        this.capturedTemplateNames = capturedTemplateNames;
        this.lsig = lsig;
        this.body = body;
    }
}
class InvokeInstantiationInfo {
    constructor(newikey, binds, lambdaargs, lambdacons, monoinvids, prepostikey) {
        this.newikey = newikey;
        this.binds = binds;
        this.lambdaargs = lambdaargs;
        this.lambdacons = lambdacons;
        this.monoinvids = monoinvids;
        this.prepostikey = prepostikey;
    }
}
class TypeInstantiationInfo {
    constructor(tkey, tsig, binds, functionbinds, methodbinds, lambdacons, monoinvids) {
        this.tkey = tkey;
        this.tsig = tsig;
        this.binds = binds;
        this.functionbinds = functionbinds;
        this.methodbinds = methodbinds;
        this.lambdacons = lambdacons;
        this.monoinvids = monoinvids;
    }
}
class NamespaceInstantiationInfo {
    constructor(ns) {
        //For the implicit invokes that happen in const declarations
        this.lambdacons = new Map(); //string corresponds to a lambda instantation info
        this.monoinvids = new Map();
        this.ns = ns;
        this.functionbinds = new Map();
        this.typebinds = new Map();
        this.elists = new Map();
        this.lambdas = new Map();
    }
}
function computeTBindsKey(tbinds) {
    return (tbinds.length !== 0) ? `<${tbinds.map(t => t.tkeystr).join(", ")}>` : "";
}
function computeLambdaKey(packs) {
    return (packs.length !== 0) ? `[${packs.map(lp => lp.psigkey).join(", ")}]` : "";
}
function computeResolveKeyForInvoke(ikey, termcount, hasref, lambdas) {
    const tci = (termcount !== 0) ? `*tc_${termcount}_` : "";
    const rfi = (hasref ? "*_ref_" : "");
    const li = (lambdas ? "*_lambdas_" : "");
    return `${ikey}${tci}${rfi}${li}`;
}
function computeInvokeKeyForNamespaceFunction(ns, fdecl, terms, lambdas) {
    const rti = fdecl.params.some((p) => p.pkind !== undefined) ? "#ref" : "";
    return `${ns.fullnamespace.emit()}::${fdecl.name}${rti}${computeTBindsKey(terms)}${computeLambdaKey(lambdas)}`;
}
function computeInvokeKeyForTypeFunction(rcvrtype, fdecl, terms, lambdas) {
    const rti = fdecl.params.some((p) => p.pkind !== undefined) ? "#ref" : "";
    return `${rcvrtype.tkeystr}::${fdecl.name}${rti}${computeTBindsKey(terms)}${computeLambdaKey(lambdas)}`;
}
function computeInvokeKeyForTypeMethod(rcvrtype, mdecl, terms, lambdas) {
    const rti = ((mdecl.isThisRef) || mdecl.params.some((p) => p.pkind !== undefined)) ? "#ref" : "";
    return `${rcvrtype.tkeystr}@${mdecl.name}${rti}${computeTBindsKey(terms)}${computeLambdaKey(lambdas)}`;
}
function computeInvokeKeyForLambdaFunction(basefn, line, terms, lambdas) {
    return `${basefn}_${line}${computeTBindsKey(terms)}${computeLambdaKey(lambdas)}`;
}
export { LambdaInstantiationInfo, InvokeInstantiationInfo, TypeInstantiationInfo, NamespaceInstantiationInfo, computeTBindsKey, computeLambdaKey, computeResolveKeyForInvoke, computeInvokeKeyForNamespaceFunction, computeInvokeKeyForTypeFunction, computeInvokeKeyForTypeMethod, computeInvokeKeyForLambdaFunction };
//# sourceMappingURL=instantiations.js.map