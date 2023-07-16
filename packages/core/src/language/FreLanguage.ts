import { forEach } from "lodash";
import { ReferenceShortcut } from "../editor";
import { FreNode, FreModel, FreModelUnit } from "../ast";
import { EmptyStdLib, FreStdlib } from "../stdlib/index";
import { isNullOrUndefined } from "../util";
import { FreLogger } from "../logging";
const LOGGER = new FreLogger("Language");

export type PropertyKind = "primitive" | "part" | "reference";

export type PrimType = string | boolean | number;

export type FreLanguageProperty = {
    name: string;
    type: string;
    id?: string;
    key?: string;// used for LionWeb
    isList: boolean;
    isPublic: boolean;
    propertyKind: PropertyKind;
};
export type Model = {
    typeName: string;
    id?: string;
    key?: string;// used for LionWeb
    isNamespace?: boolean;
    isNamedElement?: boolean;
    isAbstract?: boolean;
    subConceptNames?: string[];
    properties: Map<string, FreLanguageProperty>;
    constructor: (id?: string) => FreModel;
    referenceShortcut?: ReferenceShortcut;
};
export type ModelUnit = {
    typeName: string;
    id?: string;
    key?: string;// used for LionWeb
    // isPublic?: boolean;
    isNamespace?: boolean;
    isNamedElement?: boolean;
    isAbstract?: boolean;
    subConceptNames: string[];
    fileExtension: string;
    properties: Map<string, FreLanguageProperty>;
    constructor: (id?: string) => FreModelUnit;
    referenceShortcut?: ReferenceShortcut;
};
export type FreLanguageConcept = {
    typeName: string;
    id?: string;
    key?: string;// used for LionWeb
    isAbstract: boolean;
    isPublic: boolean;
    isNamespace?: boolean;
    isNamedElement?: boolean;
    baseName: string;
    subConceptNames: string[];
    properties: Map<string, FreLanguageProperty>;
    constructor: (id?: string) => FreNode;
    // Used by editor, therefore only in Concept
    trigger: string;
    referenceShortcut?: ReferenceShortcut;
};

export type FreLanguageInterface = {
    typeName: string;
    id?: string;
    key?: string;// used for LionWeb
    isPublic: boolean;
    isNamespace?: boolean;
    isNamedElement?: boolean;
    isAbstract?: boolean;
    subConceptNames: string[];
    properties: Map<string, FreLanguageProperty>;
    referenceShortcut?: ReferenceShortcut;
};

export type Classifier = Model | ModelUnit | FreLanguageConcept | FreLanguageInterface;

export class FreLanguage {
    private static theInstance: FreLanguage;

    static getInstance() {
        if (FreLanguage.theInstance === undefined) {
            FreLanguage.theInstance = new FreLanguage();
        }
        return FreLanguage.theInstance;
    }

    private languageName: string;
    private languageId?: string;
    private pmodel: Model;
    private units: Map<string, ModelUnit> = new Map<string, ModelUnit>();
    private concepts: Map<string, FreLanguageConcept> = new Map<string, FreLanguageConcept>();
    private interfaces: Map<string, FreLanguageInterface> = new Map<string, FreLanguageInterface>();
    private _stdLib: FreStdlib = new EmptyStdLib();
    set stdLib(lib: FreStdlib) {
        this._stdLib = lib;
    }
    get stdLib(): FreStdlib {
        return this._stdLib;
    }

    private constructor() {
    }

    model(): Model {
        return this.pmodel;
    }

    modelOfType(typeName: string) {
        if (!!this.pmodel && (this.pmodel.typeName === typeName)) {
            return this.pmodel;
        } else {
            return null;
        }
    }

    unit(typeName: string): ModelUnit | undefined {
        return this.units.get(typeName);
    }

    unitById(id: string): ModelUnit | undefined {
        // console.log("Language.unitById: " + id);
        // let u = "Units: ";
        // for(const s of this.units.keys()) {
        //     u += u + ", " + s;
        // }
        // console.log(u);
        return this.helperById(this.units, id) as ModelUnit;
        // console.log("Find unit by id: " + id + " in " + this.units.size )
        // for (const [key, unit] of this.units.entries()) {
        //     console.log("Trying unit [" + key + "] [" + unit.typeName + "] for: " + id);
        //     if (unit.id === id) {
        //         console.log("    found")
        //         return unit;
        //     }
        // }
        // return undefined;
    }

    concept(typeName: string): FreLanguageConcept | undefined {
        // console.log("Language find concept " + typeName);
        return this.concepts.get(typeName);
    }

    conceptById(conceptId: string): FreLanguageConcept | undefined {
        return this.helperById(this.concepts, conceptId) as FreLanguageConcept;
    }

    helperById(map: Map<string, Classifier>, conceptId: string): Classifier | undefined {
        // console.log("Language.helperById: find classifier " + conceptId);
        for ( const concept of map.values()) {
            if ( concept.key === conceptId) {
                // console.log("     found it");
                return concept;
            }
        }
        // console.log("    NOT foundd")
        return null;
    }

    interface(typeName: string): FreLanguageInterface | undefined {
        return this.interfaces.get(typeName);
    }

    interfaceById(interfaceId: string): FreLanguageInterface | undefined {
        return this.helperById(this.interfaces, interfaceId) as FreLanguageInterface;
    }

    classifier(typeName: string): Classifier | undefined {
        const concept1 = this.concepts.get(typeName);
        if (!!concept1) {
            return concept1;
        } else {
            const intf = this.interfaces.get(typeName);
            if (!!intf) {
                return intf;
            } else {
                const unit1 = this.units.get(typeName);
                if (!!unit1) {
                    return unit1;
                } else {
                    const model = this.modelOfType(typeName);
                    if (!! model) {
                        return model;
                    }
                }
            }
        }
        // console.log("RETURNING NULL FOR " + typeName)
        return undefined;
    }

    classifierById(typeName: string): Classifier | undefined {
        const concept1 = this.conceptById(typeName);
        if (!!concept1) {
            return concept1;
        } else {
            const intf = this.interfaceById(typeName);
            if (!!intf) {
                return intf;
            } else {
                const unit1 = this.unitById(typeName);
                if (!!unit1) {
                    return unit1;
                } else {
                    // TODO By Id for models
                    const model = this.modelOfType(typeName);
                    if (!! model) {
                        return model;
                    }
                }
            }
        }
        // console.log("RETURNING NULL FOR " + typeName)
        return undefined;
    }

    conceptProperty(typeName: string, propertyName: string): FreLanguageProperty | undefined {
        // LOGGER.log("copnceptProperty [" + typeName + "."  + propertyName + "]");
        return this.concepts.get(typeName)?.properties.get(propertyName);
    }

    conceptPropertyById(typeName: string, propertyName: string): FreLanguageProperty | undefined {
        // LOGGER.log("copnceptProperty [" + typeName + "."  + propertyName + "]");
        return this.helperPropByKey(this.conceptById(typeName).properties, propertyName);
    }

    helperPropByKey(map: Map<string, FreLanguageProperty>, key: string): FreLanguageProperty | undefined {
        for ( const prop of map.values()) {
            if ( prop.key === key) {
                return prop;
            }
        }
        return undefined;

    }

    unitProperty(typeName: string, propertyName: string): FreLanguageProperty | undefined {
        return this.units.get(typeName)?.properties.get(propertyName);
    }

    unitPropertyById(typeName: string, propertyName: string): FreLanguageProperty | undefined {
        // LOGGER.log("copnceptProperty [" + typeName + "."  + propertyName + "]");
        return this.helperPropByKey(this.unitById(typeName).properties, propertyName);
    }

    interfaceProperty(typeName: string, propertyName: string): FreLanguageProperty | undefined {
        return this.interfaces.get(typeName)?.properties.get(propertyName);
    }

    interfacePropertyById(typeName: string, propertyName: string): FreLanguageProperty | undefined {
        // LOGGER.log("copnceptProperty [" + typeName + "."  + propertyName + "]");
        return this.helperPropByKey(this.interfaceById(typeName).properties, propertyName);
    }

    classifierProperty(typeName: string, propertyName: string): FreLanguageProperty | undefined {
        // LOGGER.log("CLASSIFIERPROPERTY " + typeName + "." + propertyName);
        const concept1 = this.concepts.get(typeName);
        if (!!concept1) {
            return concept1.properties.get(propertyName);
        } else {
            const intf = this.interfaces.get(typeName);
            if (!!intf) {
                return intf.properties.get(propertyName);
            } else {
                const unit1 = this.units.get(typeName);
                if (!!unit1) {
                    return unit1.properties.get(propertyName);
                } else {
                    const model = this.modelOfType(typeName);
                    if (!!model) {
                        return model.properties.get(propertyName);
                    }
                }
            }
        }
        return undefined;
    }

    classifierPropertyById(typeName: string, propertyName: string): FreLanguageProperty | undefined {
        // LOGGER.log("CLASSIFIERPROPERTY " + typeName + "." + propertyName);
        const concept1 = this.classifierById(typeName);
        return this.helperPropByKey(concept1.properties, propertyName);
    }

    allConceptProperties(typeName: string): IterableIterator<FreLanguageProperty> | undefined {
        // console.log("Looking up properties for "+ typeName);
        let myType: FreLanguageConcept | ModelUnit | undefined = this.concept(typeName);
        if (isNullOrUndefined(myType)) {
            myType = this.unit(typeName);
        }
        return myType?.properties.values();
    }

    /**
     * Get all properties of kind "kind" of classifier "typename"
     * @param typename
     * @param ptype
     */
    public getPropertiesOfKind(typename: string, ptype: PropertyKind): FreLanguageProperty[] {
        const classifier: Classifier | undefined = FreLanguage.getInstance().classifier(typename);
        const foundProperties: FreLanguageProperty[] = [];
        if (!!classifier) {
            for (const prop of classifier.properties.values()) {
                if (prop.propertyKind === ptype) {
                    foundProperties.push(prop);
                }
            }
        }
        return foundProperties;
    }

    /**
     * Return the value of `prop' in `element'.
     * For ease of use, always returns a list, even is the property is not a list.
     * @param element
     * @param prop
     */
    public getPropertyValue(element: FreNode, prop: FreLanguageProperty): FreNode[] {
        if (prop.isList) {
            return element[prop.name];
        } else {
            const value = element[prop.name];
            if (!!value) {
                return [value];
            } else {
                return [];
            }
        }
    }

    /**
     * Return all named concept in the language.
     */
    public getNamedConcepts(): string[] {
        return Array.from(this.concepts.values()).filter( concept => concept.isNamedElement).map(concept => concept.typeName);
    }

    /**
     * Return all named interfaces in the language.
     */
    public getNamedInterfaces(): string[] {
        return Array.from(this.interfaces.values()).filter( intfc => intfc.isNamedElement).map(intfc => intfc.typeName);
    }

    /**
     * Return all named concepts and interfaces in the language.
     */
    public getNamedElements(): string[] {
        return this.getNamedConcepts().concat(this.getNamedInterfaces());
    }

    /**
     * Return the names of all model unit types.
     */
    public getUnitNames(): string[] {
        return Array.from(this.units.values()).map(unit => unit.typeName);
    }

    createModel(id?: string): FreModel {
        return this.pmodel?.constructor(id);
    }

    createUnit(typeName: string, id?: string): FreModelUnit | undefined {
        return this.units.get(typeName)?.constructor(id);
    }

    /**
     * Create a new instance of the class `typeName`.
     * @param typeName
     */
    createConceptOrUnit(typeName: string, id?: string): FreNode | undefined {
        let myType: FreLanguageConcept | ModelUnit | undefined = this.concept(typeName);
        if (isNullOrUndefined(myType)) {
            myType = this.unit(typeName);
        }
        return myType?.constructor(id);
    }

    addModel(model: Model) {
        if (!!this.pmodel) {
            console.error("Language: adding model of type " + model?.typeName + " while there is already a model of type " + this.pmodel.typeName);
        }
        this.pmodel = model;
    }

    addUnit(unit: ModelUnit) {
        this.units.set(unit.typeName, unit);
        unit.subConceptNames = [];
    }

    /**
     * Add a concept definition to this language
     * @param concept
     */
    addConcept(concept: FreLanguageConcept) {
        this.concepts.set(concept.typeName, concept);
    }

    addInterface(intface: FreLanguageInterface) {
        this.interfaces.set(intface.typeName, intface);
    }

    /**
     * Set Language name
     * @param name
     */
    set name(name: string) {
        this.languageName = name;
    }

    get name(): string {
        return this.languageName;
    }

    set id(id: string) {
        this.languageId = id;
    }

    get id(): string {
        return this.languageId;
    }

    subConcepts(typeName: string): string[] {
        const concept = this.concept(typeName);
        if (!!concept) {
            return concept.subConceptNames;
        }
        const intface = this.interface(typeName);
        if (!!intface) {
            return intface.subConceptNames;
        }
        return [];
    }

    referenceCreator: (name: string, type: string) => any;

    addReferenceCreator(creator: (name: string, type: string) => any) {
        this.referenceCreator = creator;
    }

    /**
     * Returns true if the freLanguageConcept of 'element', i.e. its metatype,
     * is the same as 'requestedType' or is a subtype of 'requestedType'.
     * @param element
     * @param requestedType
     */
    public metaConformsToType(element: FreNode, requestedType: string): boolean {
        const metatype = element.freLanguageConcept();
        return metatype === requestedType || FreLanguage.getInstance().subConcepts(requestedType).includes(metatype);
    }
}
