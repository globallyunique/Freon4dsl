import { Checker } from "../../utils/Checker";
import { PiLanguageUnit, PiLangProperty, PiLangConcept, PiLangPrimitiveProperty } from "../../languagedef/metalanguage/PiLanguage";
import { ConceptRuleSet, PiValidatorDef, CheckEqualsTypeRule, ValidationRule, CheckConformsRule, NotEmptyRule, ValidNameRule } from "./ValidatorDefLang";
import { PiLangConceptReference, PiLangPropertyReference } from "../../languagedef/metalanguage/PiLangReferences";
import { PiLangAppliedFeatureExp, PiLangThisExp } from "../../languagedef/metalanguage/PiLangExpressions";
import { PiLogger } from "../../../../core/src/util/PiLogging";
import { PiLanguageExpressionChecker } from "../../languagedef/metalanguage/PiLanguageExpressionChecker";

const LOGGER = new PiLogger("ValidatorGenerator"); // .mute();
export class ValidatorChecker extends Checker<PiValidatorDef> {
    myExpressionChecker: PiLanguageExpressionChecker;
    
    constructor(language: PiLanguageUnit) {
        super(language);
        this.myExpressionChecker = new PiLanguageExpressionChecker(this.language);
    }

    public check(definition: PiValidatorDef): void {
        LOGGER.log("Checking validator Definition '" + definition.validatorName + "'");

        if ( this.language === null || this.language === undefined ) {
            LOGGER.error(this, "Validator definition checker does not known the language, exiting.");
            process.exit(-1);
        }

        this.nestedCheck(
            {
                check: this.language.name === definition.languageName,
                error: `Language reference ('${definition.languageName}') in 
                    Validation Definition '${definition.validatorName}' does not match language '${this.language.name}'.`,
                whenOk: () => {
                    definition.conceptRules.forEach(rule => {
                        this.checkConceptRule(rule);
                    });
                }
            });
        this.errors = this.errors.concat(this.myExpressionChecker.errors);
    }

    private checkConceptRule(rule: ConceptRuleSet) {
        this.checkConceptReference(rule.conceptRef);

        const enclosingConcept = rule.conceptRef.referedElement();
        if (enclosingConcept) {
            rule.rules.forEach(tr => {
                this.checkRule(tr, enclosingConcept);
            });
        }
    }

    private checkConceptReference(reference: PiLangConceptReference) {
        // Note that the following statement is crucial, because the model we are testing is separate
        // from the model of the language.
        // If it is not set, the conceptReference will not find the refered language concept.
        reference.language = this.language;

        this.nestedCheck(
            {
                check: reference.name !== undefined,
                error: `Concept reference should have a name, but doesn't`,
                whenOk: () => this.nestedCheck(
                    {
                        check: reference.referedElement() !== undefined,
                        error: `Concept reference to ${reference.name} cannot be resolved`
                    })
            })
    }

    checkRule(tr: ValidationRule, enclosingConcept: PiLangConcept) {
        if ( tr instanceof CheckEqualsTypeRule) { this.checkEqualsTypeRule(tr, enclosingConcept); }
        if ( tr instanceof CheckConformsRule) { this.checkConformsTypeRule(tr, enclosingConcept); }
        if ( tr instanceof NotEmptyRule) { this.checkNotEmptyRule(tr, enclosingConcept); }
        if ( tr instanceof ValidNameRule) { this.checkValidNameRule(tr, enclosingConcept); }
    }

    checkValidNameRule(tr: ValidNameRule, enclosingConcept: PiLangConcept) {
        // check whether tr.property (if set) is a property of enclosingConcept
        // if so, set myProperty to this property,
        // otherwise set myProperty to the 'name' property of the EnclosingConcept
        if (!!tr.property) {
            this.myExpressionChecker.checkLangExp(tr.property, enclosingConcept);
        } else {
            const myProp = enclosingConcept.allProperties().find(e => {
                e.name === "name"
            });
            this.nestedCheck({
                check:!(!!myProp),
                error: "Cannot find property 'name' in " + enclosingConcept.name,
                whenOk: () => {
                    tr.property = new PiLangThisExp();
                    tr.property.appliedfeature = new PiLangAppliedFeatureExp();
                    tr.property.appliedfeature.sourceName = "name";
                    tr.property.appliedfeature.referedElement = myProp;
                }
            });
        }
        // TODO check if found property is of type 'string'
        // if (!!tr.property) {
        //     this.simpleCheck(tr.property instanceof PiLangPrimitiveProperty && (tr.property as PiLangPrimitiveProperty).primType === "string",
        //         "Property '" + tr.property.sourceName + "' should have type 'string'");
        // }
    }

    checkEqualsTypeRule(tr: CheckEqualsTypeRule, enclosingConcept: PiLangConcept) {
        // check references to types
        this.nestedCheck(
            {
                check: tr.type1 != null || tr.type2 != null,
                error: `Typecheck "equalsType" should have two types to compare`,
                whenOk: () => {
                    // LOGGER.log("Checking EqualsTo ( " + tr.type1.makeString() + ", " + tr.type2.makeString() +" )");
                    this.myExpressionChecker.checkLangExp(tr.type1, enclosingConcept),
                    this.myExpressionChecker.checkLangExp(tr.type2, enclosingConcept)  
                }
            })
    }

    checkConformsTypeRule(tr: CheckConformsRule, enclosingConcept: PiLangConcept) {
        // check references to types
        this.nestedCheck(
            {
                check: tr.type1 != null || tr.type2 != null,
                error: `Typecheck "conformsTo" should have two types to compare`,
                whenOk: () => {
                    // LOGGER.log("Checking ConformsTo ( " + tr.type1.makeString() + ", " + tr.type2.makeString() + " )");
                    this.myExpressionChecker.checkLangExp(tr.type1, enclosingConcept);
                    this.myExpressionChecker.checkLangExp(tr.type2, enclosingConcept)  
                }
            })
    }

    checkNotEmptyRule(nr: NotEmptyRule, enclosingConcept: PiLangConcept) {
        // check whether nr.property is a property of enclosingConcept
        // and whether it is a list 
        // if so, set myProperty to this property,
        let myProp : PiLangProperty;
        if( nr.property != null ) {
            this.myExpressionChecker.checkLangExp(nr.property, enclosingConcept);
        }
        // TODO set nr.property
    }
}
