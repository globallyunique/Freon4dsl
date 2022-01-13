import { RHSPropEntry } from "./RHSPropEntry";
import { PiPrimitiveProperty } from "../../../../languagedef/metalanguage";
import { makeIndent } from "../GrammarUtils";
import { ParserGenUtil } from "../../ParserGenUtil";

export class RHSBooleanWithDoubleKeyWord extends RHSPropEntry {
    // TODO make this class work!
    private trueKeyword: string = "";
    private falseKeyword: string = "";

    constructor(prop: PiPrimitiveProperty, trueKeyword, falseKeyword) {
        super(prop);
        this.trueKeyword = trueKeyword;
        this.falseKeyword = falseKeyword;
        this.isList = false;
    }

    toGrammar(): string {
        // no need for the closing '?' because this is always within an optional group
        // e.g [?${self.primBoolean [<BOOL>]}]
        return `( '${this.trueKeyword}' | '${this.falseKeyword}' )` + this.doNewline();
    }

    toMethod(index: number, nodeName: string, mainAnalyserName: string): string {
        return `// RHSBooleanWithDoubleKeyWord
                if (!${nodeName}[${index}].isEmptyMatch) {
                    ${ParserGenUtil.internalName(this.property.name)} = true;
                }`;
    }

    toString(depth: number): string {
        let indent = makeIndent(depth);
        return indent + "RHSBooleanWithKeyWord: " + this.property.name + ": " + this.trueKeyword;
    }
}
