// Generated by the ProjectIt Language Generator.

import { PiClassifier, MetaElementReference } from "../../languagedef/metalanguage";
import { PitWhereExp } from "./expressions";
import { PiTyperElement } from "./PiTyperElement";

/**
 * Class PitVarDecl is the implementation of the concept with the same name in the language definition file.
 * It uses mobx decorators to enable parts of the language environment, e.g. the editor, to react
 * to changes in the state of its properties.
 */
export class PitVarDecl extends PiTyperElement {
    owner: PitWhereExp;
    /**
     * A convenience method that creates an instance of this class
     * based on the properties defined in 'data'.
     * @param data
     */
    static create(data: Partial<PitVarDecl>): PitVarDecl {
        const result = new PitVarDecl();
        if (!!data.name) {
            result.name = data.name;
        }
        if (!!data.__type) {
            result.__type = data.__type;
        }
        if (data.agl_location) {
            result.agl_location = data.agl_location;
        }
        return result;
    }

    readonly $typename: string = "PitVarDecl"; // holds the metatype in the form of a string
    name: string = ""; // implementation of name

    __type: MetaElementReference<PiClassifier>; // implementation of reference 'type'

    /**
     * Convenience method for reference 'type'.
     * Instead of returning a 'MetaElementReference<PiClassifier>' object,
     * it returns the referred 'PiClassifier' object, if it can be found.
     */
    get type(): PiClassifier {
        if (!!this.__type) {
            return this.__type.referred;
        }
        return null;
    }

    set type(newOne: PiClassifier) {
        if (!!newOne) {
            this.__type = MetaElementReference.create<PiClassifier>(newOne, "PiClassifier");
            this.__type.owner = this;
        }
    }

    toPiString(): string {
        return this.name + ' : ' + this.__type.name;
    }
}
