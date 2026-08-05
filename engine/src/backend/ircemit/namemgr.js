const s_coloncolon_repl = "ᕒ";
const s_at_repl = "ᑀ";
const s_colon_repl = "ᕀ";
const s_hash_repl = "ᙾ";
const s_comma_repl = "ᐪ";
const s_BSQ_tag = "ᗑ";
const s_binderv_tag = "ᑯ";
const s_specialop_sep = "ᐤ";
const s_runtimename = "ᐸRuntimeᐳ";
class TransformCPPNameManager {
    static resymbol(cstr) {
        const bb = cstr
            .replace(/@/g, s_at_repl)
            .replace(/::/g, s_coloncolon_repl)
            .replace(/: */g, s_colon_repl)
            .replace(/#/g, s_hash_repl)
            .replace(/, */g, s_comma_repl)
            .replace(/< */g, "ᐸ")
            .replace(/ *>/g, "ᐳ")
            .replace(/\[ */g, "ᑅ")
            .replace(/\] */g, "ᑀ")
            .replace(/\(\| */g, (s_BSQ_tag + "EListᐸ"))
            .replace(/ *\|\)/g, "ᐳ");
        if (bb.startsWith("lambda_")) {
            return "lambda_" + s_BSQ_tag + bb.slice(6);
        }
        else if (bb.startsWith("BSQ_")) {
            return "BSQ_" + s_BSQ_tag + bb.slice(3);
        }
        else if (bb.startsWith("GC_")) {
            return "GC_" + s_BSQ_tag + bb.slice(3);
        }
        else if (bb.startsWith("MINT_")) {
            return "MINT_" + s_BSQ_tag + bb.slice(4);
        }
        else {
            return bb;
        }
    }
    static safeifyName(name) {
        const nn = TransformCPPNameManager.c_dangerous.get(name);
        if (nn !== undefined) {
            return nn;
        }
        else {
            return this.resymbol(name);
        }
    }
    static convertIdentifier(vname) {
        let nn = TransformCPPNameManager.safeifyName(vname);
        if (!nn.startsWith("$")) {
            return TransformCPPNameManager.safeifyName(vname);
        }
        else {
            return s_binderv_tag + TransformCPPNameManager.safeifyName(vname.slice(1));
        }
    }
    static convertNamespaceKey(nskey) {
        return TransformCPPNameManager.safeifyName(nskey);
    }
    static convertTypeKey(tkey) {
        return TransformCPPNameManager.safeifyName(tkey);
    }
    static convertInvokeKey(ikey) {
        return TransformCPPNameManager.safeifyName(ikey);
    }
    static generateNameForUnionType(tkey) {
        return `${TransformCPPNameManager.convertTypeKey(tkey)}${s_specialop_sep}Union`;
    }
    static generateNameForUnionMember(tkey) {
        return `u_${TransformCPPNameManager.convertTypeKey(tkey)}`;
    }
    static generateTypeInfoNameForTypeKey(tkey) {
        return `${s_runtimename}::g_typeinfo_${TransformCPPNameManager.convertTypeKey(tkey)}`;
    }
    static generateNameForConstantKey(constkey) {
        return TransformCPPNameManager.safeifyName(constkey);
    }
    static generateNameForEnumKey(tkey, emember) {
        return TransformCPPNameManager.convertTypeKey(tkey) + "::" + TransformCPPNameManager.safeifyName(emember);
    }
    static generateNameForConstructor(tkey) {
        return TransformCPPNameManager.convertTypeKey(tkey);
    }
    static generateNameForInvariantFunction(tkey, invariantidx) {
        return TransformCPPNameManager.convertTypeKey(tkey) + s_specialop_sep + "invariant_" + invariantidx;
    }
    static generateNameForValidateFunction(tkey, invariantidx) {
        return TransformCPPNameManager.convertTypeKey(tkey) + s_specialop_sep + "validate_" + invariantidx;
    }
    static generateNameForFieldDefaultFunction(tkey, fname) {
        return TransformCPPNameManager.convertTypeKey(tkey) + s_specialop_sep + "default" + s_specialop_sep + TransformCPPNameManager.safeifyName(fname);
    }
    static generateNameForInvokePreconditionCheck(ikey, requiresidx) {
        return TransformCPPNameManager.convertInvokeKey(ikey) + s_specialop_sep + "requires_" + requiresidx;
    }
    static generateNameForInvokePostconditionCheck(ikey, ensuresidx) {
        return TransformCPPNameManager.convertInvokeKey(ikey) + s_specialop_sep + "ensures_" + ensuresidx;
    }
}
TransformCPPNameManager.c_dangerous = new Map([
    ["this", "ᐸthisᐳ"],
    ["$return", "ᐸreturnᐳ"]
]);
export { TransformCPPNameManager };
//# sourceMappingURL=namemgr.js.map