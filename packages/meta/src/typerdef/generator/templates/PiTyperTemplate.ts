import { Names, PROJECTITCORE, LANGUAGE_GEN_FOLDER, sortClasses, langExpToTypeScript } from "../../../utils";
import { PiClassifier, PiConcept, PiInterface, PiLanguageUnit } from "../../../languagedef/metalanguage/PiLanguage";
import {
    PiLangExp,
    PiLangFunctionCallExp,
    PiLangSelfExp, PiInstanceExp
} from "../../../languagedef/metalanguage/PiLangExpressions";
import { PiTypeDefinition, PiTypeClassifierRule, PiTypeIsTypeRule, PiTypeAnyTypeRule, PiTypeRule } from "../../metalanguage/PiTyperDefLang";

export class PiTyperTemplate {
    typerdef: PiTypeDefinition;
    language: PiLanguageUnit;

    constructor() {
    }

    generateTyper(language: PiLanguageUnit, typerdef: PiTypeDefinition, relativePath: string): string {
        if (typerdef == null) return this.generateDefault(language, relativePath);

        this.typerdef = typerdef;
        this.language = language;
        const rootType : string = this.typerdef.typeroot.name;
        const allLangConcepts : string = Names.allConcepts(language);   
        const generatedClassName : string = Names.typer(language);
        const typerInterfaceName : string = Names.PiTyper;
        const defaultType : string = this.findDefault();
        
        // Template starts here 
        return `
        import { ${typerInterfaceName} } from "${PROJECTITCORE}";
        import { ${allLangConcepts} } from "${relativePath}${LANGUAGE_GEN_FOLDER }";
        import { ${language.concepts.map(concept => `
                ${concept.name}`).join(", ")} } from "${relativePath}${LANGUAGE_GEN_FOLDER }";       
        import { ${language.interfaces.map(intf => `
                ${intf.name}`).join(", ")} } from "${relativePath}${LANGUAGE_GEN_FOLDER }";       

        /**
         * Class ${generatedClassName} implements the typer generated from, if present, the typer definition,
         * otherwise this class implements the default typer.
         */
        export class ${generatedClassName} implements ${typerInterfaceName} {
            defaultType : ${rootType} = ${defaultType};

            /**
             * See interface 
             */
            public equalsType(elem1: ${allLangConcepts}, elem2: ${allLangConcepts}): boolean {
                ${this.makeEqualsStatement()}
                if ( this.inferType(elem1) === this.inferType(elem2)) return true;
                return false;
            }
            
            /**
             * See interface 
             */        
            public inferType(modelelement: ${allLangConcepts}): ${rootType} {
                ${this.makeInferenceStatements()}
                return this.defaultType;
            }
            
            /**
             * See interface 
             */
            public conformsTo(elem1: ${rootType}, elem2: ${rootType}): boolean {
                ${this.makeConformsStatements()}
                if ( this.equalsType(elem1, elem2) ) return true;
                return false;
            }
            
            /**
             * See interface 
             */
            public conformList(typelist1: ${rootType}[], typelist2: ${rootType}[]): boolean {
                if (typelist1.length !== typelist2.length) return false;
                let result : boolean = true;
                for (let index in typelist1) {
                    result = this.conformsTo(typelist1[index], typelist2[index]);
                    if (result == false) return result;
                }
                return result;
            }

            /**
             * See interface 
             */        
            public isType(elem: ${allLangConcepts}): boolean { // entries for all types marked as @isType
                ${this.makeIsType()}
                return false;
            } 
        }`;
    }

    generateDefault(language: PiLanguageUnit, relativePath: string): string {
        const allLangConcepts : string = Names.allConcepts(language);   
        const typerInterfaceName : string = Names.PiTyper;
        const generatedClassName : string = Names.typer(language);

        // Template starts here 
        return `
        import { ${typerInterfaceName} } from "${PROJECTITCORE}";
        import { ${allLangConcepts} } from "${relativePath}${LANGUAGE_GEN_FOLDER }";
        
        export class ${generatedClassName} implements ${typerInterfaceName} {
            /**
             * See interface 
             */
            public inferType(modelelement: ${allLangConcepts}): ${allLangConcepts} {
                return null;
            }
            /**
             * See interface 
             */
            public equalsType(elem1: ${allLangConcepts}, elem2: ${allLangConcepts}): boolean {
                return true;
            }
            /**
             * See interface 
             */
            public conformsTo(elem1: ${allLangConcepts}, elem2: ${allLangConcepts}): boolean {
                return true;
            }
            /**
             * See interface 
             */
            public conformList(typelist1: ${allLangConcepts}[], typelist2: ${allLangConcepts}[]): boolean {
                return true;
            }
            /**
             * See interface 
             */
            public isType(elem: ${allLangConcepts}): boolean {
                return false;
            }      
        }`;
    }

    generateGenIndex(language: PiLanguageUnit): string {
        return `
        export * from "./${Names.typer(language)}";
        `;
    }

    private findDefault() : string {
        let result : string = "";
        for ( let tr of this.typerdef.typerRules ) {
            if (tr instanceof PiTypeAnyTypeRule) {
                for ( let stat of tr.statements  ) {
                    if ( stat.statementtype === "conformsto" || stat.statementtype === "equalsto") {
                        return `${this.makeTypeExp(stat.exp)}`;
                    }
                }
            } 
        }
        return result;
    }

    private makeConformsStatements() : string {
        let result : string = "";
        for ( let tr of this.typerdef.typerRules ) {
            if (tr instanceof PiTypeClassifierRule) {
                let myConceptName = tr.conceptRef.name;
                for ( let stat of tr.statements  ) {
                    if ( stat.statementtype === "conformsto" ) {                        
                        result = result.concat(`if ( this.inferType(elem1) instanceof ${myConceptName}) {
                            return true;
                        }`);
                    }
                }
            } 
            if (tr instanceof PiTypeAnyTypeRule) {
                // console.log(" rule: " + tr.toPiString());
                for ( let stat of tr.statements  ) {
                    // console.log(" stat: " + stat.toPiString());
                    if ( stat.statementtype === "conformsto" ) {                        
                        // console.log(" stat.statementtype: " + stat.statementtype);
                        result = result.concat(`if ( this.inferType(elem2) === ${this.makeTypeExp(stat.exp)}) {
                            return true;
                        }`);
                    }
                }
            } 
        }
        return result;
    }

    private makeInferenceStatements() : string {
        let result : string = "";

        for ( let tr of this.typerdef.typerRules) {
            if (tr instanceof PiTypeIsTypeRule) {
                let typesAdded: PiClassifier[] = [];
                for (let type of tr.types) {
                    // TODO create a separate method to find all concepts that are marked 'isType', this if-statement is also used in makeIsType
                    let realType = type.referred;
                    if (!!realType && (realType instanceof PiInterface)) {
                        let yy = realType as PiInterface;
                        // add a statement for all concepts that implement this interface
                        this.language.concepts.filter(con => con.allInterfaces().some(intf => intf === yy)).map(implementor => {
                            if (!typesAdded.includes(implementor)) {
                                result = result.concat(`if (modelelement instanceof ${implementor.name}) {
                                    return modelelement;
                                }`);
                                typesAdded.push(implementor);
                            }
                        });
                    } else if (!!realType && (realType instanceof PiConcept)) {
                         if (!typesAdded.includes(realType)) {
                            let myConceptName = realType.name;
                            result = result.concat(`if (modelelement instanceof ${myConceptName}) {
                                return modelelement;
                            }`);
                            typesAdded.push(realType);
                        }
                    }
                }
            }
            // TODO check what to do with PiTypeAnyTypeRule
        }
        // change the order in which the statements are generated, because subclasses need to overwrite their super
        // and thus their statement needs to come before the super statement
        let myList = this.sortConceptRules(this.typerdef.classifierRules);
        for (let tr of myList) {
            let myConceptName = tr.conceptRef.name;
            for ( let stat of tr.statements  ) {
                 if ( stat.statementtype === "infertype" && !stat.isAbstract) {
                    result = result.concat(`if (modelelement instanceof ${myConceptName}) {
                            return ${this.makeTypeExp(stat.exp)};
                        }`);
                }
            }
        }
        return result;
    }

    private sortConceptRules(conceptRules: PiTypeClassifierRule[]): PiTypeClassifierRule[] {
        let sortedConceptRules: PiTypeClassifierRule[] = [];
        let sortedClasses = sortClasses(this.language.concepts);
        for (let piclass of sortedClasses) {
            // find conceptRule for this piclass
            let myRule: PiTypeClassifierRule;
            for (let rule of conceptRules) {
                if (piclass === rule.conceptRef.referred) {
                    myRule = rule;
                    // console.log("found " + piclass.unitName + ", index in classes: " + sortedClasses.indexOf(piclass) + ", index in rules: " + classifierRules.indexOf(rule));
                }
            }
            // if found push rule
            if (!!myRule) {
                sortedConceptRules.push(myRule);
            }
        }
        return sortedConceptRules;
    }

    private makeIsType() : string {
        let result : string = "";
        for ( let tr of this.typerdef.typerRules ) {
            if (tr instanceof PiTypeIsTypeRule) {
                let typesAdded: PiClassifier[] = [];
                for ( let type of tr.types  ) {
                    let realType = type.referred;
                    if (!!realType && (realType instanceof PiInterface)) {
                        let yy = realType as PiInterface;
                        // add a statement for all concepts that implement this interface
                        this.language.concepts.filter(con => con.allInterfaces().some(intf => intf === yy )).map (implementor => {
                            if (!typesAdded.includes(implementor)) {
                                result = result.concat(`if (elem instanceof ${implementor.name}) {
                                    return true;
                                }`)
                                typesAdded.push(implementor);
                            }
                        });
                    } else if (!!realType && (realType instanceof PiConcept)){
                        if (!typesAdded.includes(realType)) {
                            let myConceptName = realType.name;
                            result = result.concat(`if (elem instanceof ${myConceptName}) {
                                return true;
                            }`);
                            typesAdded.push(realType);
                        }
                    }
                }
            }
        }
        return result;
    }

    private makeEqualsStatement() : string {
        for ( let rule of this.typerdef.typerRules ) {
            // TODO check makeEqualsStatement
            if (rule instanceof PiTypeClassifierRule) {
                for (let stat of rule.statements) {
                    if (stat.statementtype === "equalsto") {
                        return `${langExpToTypeScript(stat.exp)}`;
                    }
                }
            }
        }
        return "";
    }

    private makeTypeExp(exp: PiLangExp) : string {
        if (exp instanceof PiLangSelfExp) {
            return `this.inferType(modelelement.${langExpToTypeScript(exp.appliedfeature)})`;
        } else {
            return `${langExpToTypeScript(exp)}`;
        }
    }
}
