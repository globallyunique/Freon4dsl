import { RHSPropPartWithSeparator } from "./RHSPropPartWithSeparator";
import { PiProperty } from "../../../../languagedef/metalanguage";
import { getTypeCall, makeIndent } from "../GrammarUtils";
import { getBaseTypeAsString } from "../../../../utils";
import { internalTransformList} from "../../ParserGenUtil";

export class RHSPartListEntryWithSeparator extends RHSPropPartWithSeparator {
    constructor(prop: PiProperty, separatorText: string) {
        super(prop, separatorText);
        this.isList = true;
    }

    toGrammar(): string {
        return `[ ${getTypeCall(this.property.type.referred)} / '${this.separatorText}' ]*` + this.doNewline();
    }

    toMethod(propIndex: number, nodeName: string): string {
        const baseType: string = getBaseTypeAsString(this.property);
        return `${this.property.name} = this.${internalTransformList}<${baseType}>(${nodeName}[${propIndex}], '${this.separatorText}'); // RHSPartListEntryWithSeparator\n`;
    }

    toString(depth: number): string {
        let indent = makeIndent(depth);
        return indent + "RHSPartListEntryWithSeparator: " + this.property.name;
    }
}
