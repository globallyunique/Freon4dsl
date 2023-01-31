// Generated by the ProjectIt Language Generator.

import { PitCreateExp, PitExp } from "./expressions";
import { MetaElementReference, PiProperty } from "../../languagedef/metalanguage";
import { PiTyperElement } from "./PiTyperElement";

/**
 * Class PitPropInstance is the implementation of the concept with the same name in the language definition file.
 */
export class PitPropInstance extends PiTyperElement {
    owner: PitCreateExp;
    /**
     * A convenience method that creates an instance of this class
     * based on the properties defined in 'data'.
     * @param data
     */
    static create(data: Partial<PitPropInstance>): PitPropInstance {
        const result = new PitPropInstance();
        if (!!data.name) {
            result.name = data.name;
        }
        if (!!data.value) {
            result.value = data.value;
        }
        if (!!data.location) {
            result.location = data.location;
        }
        if (!!data.__property) {
            result.__property = data.__property;
        }
        if (data.agl_location) {
            result.agl_location = data.agl_location;
        }
        return result;
    }

    readonly $typename: string = "PitPropInstance"; // holds the metatype in the form of a string
    name: string = ""; // implementation of name
    value: PitExp; // implementation of part 'value'
    __property: MetaElementReference<PiProperty>; // implementation of reference 'property'

    /**
     * Convenience method for reference 'property'.
     * Instead of returning a 'MetaElementReference<PiProperty>' object,
     * it returns the referred 'PiProperty' object, if it can be found.
     */
    get property(): PiProperty {
        if (!!this.__property) {
            return this.__property.referred;
        }
        return null;
    }
    toPiString(): string {
        return this.__property.name + " : " +this.value.toPiString();
    }
}
