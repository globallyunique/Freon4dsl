import {
    PiLangElement,
    PiClassifier,
    PiConcept,
    PiConceptProperty,
    PiInterface,
    PiLanguage,
    PiProperty,
    PiLangAppliedFeatureExp,
    PiPrimitiveType
} from "./internal";
import { MetaLogger } from "../../utils/MetaLogger";

const LOGGER = new MetaLogger("PiLangScoper"); // .mute();
const anyElement = "_$anyElement";

export class PiLangScoper {
    public language: PiLanguage;

    // TODO can we restrict typeName to PiLangConceptType ?
    public getFromVisibleElements(owner: PiLangElement, name: string, typeName: string): PiLangElement {
        let result: PiLangElement;
        if (typeName === "PiPrimitiveType" ) {
            result = PiPrimitiveType.find(name);
        } else if (typeName === "PiConcept" || typeName === "PiExpressionConcept" || typeName === "PiBinaryExpressionConcept") {
            result = this.language.findConcept(name);
        } else if (typeName === "PiUnitDescription" ) {
            result = this.language.findUnitDescription(name);
        } else if (typeName === "PiInterface" ) {
            result = this.language.findInterface(name);
        } else if (typeName === "PiClassifier" ) {
            result = this.language.findClassifier(name);
        } else if (typeName === "PiProperty" || typeName === "PiPrimitiveProperty" || typeName === "PiConceptProperty") {
            if (owner instanceof PiLangAppliedFeatureExp) {
                const xx = owner.sourceExp.referredElement?.referred;
                if (!(!!xx)) {
                    LOGGER.error(`Incorrect use of applied feature, source expression has unknown reference: '${owner.sourceExp.sourceName}'.`);
                }
                if (!!xx && xx instanceof PiClassifier) {
                    result = xx.allProperties().filter(prop => prop.name === name)[0];
                }
            }
        } else {
            console.error("NO calculation found for " + name + ", owner: " + owner.name + ", type:" + typeName);
        }
        return result;
    }

}
