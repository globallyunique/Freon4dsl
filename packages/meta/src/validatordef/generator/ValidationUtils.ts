import { FreClassifier, FrePrimitiveType } from "../../languagedef/metalanguage";

export class ValidationUtils {
    public static findLocationDescription(concept: FreClassifier): string {
        let nameProp = concept.allPrimProperties().find(prop => prop.name === "name");
        if (!(!!nameProp)) {
            nameProp = concept.allPrimProperties().find(prop => prop.type === FrePrimitiveType.identifier);
        }
        return !!nameProp ? `modelelement.${nameProp.name}` : `'unnamed'`;
    }
}
