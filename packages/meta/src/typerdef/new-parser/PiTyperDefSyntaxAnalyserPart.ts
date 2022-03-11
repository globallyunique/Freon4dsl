// Generated by the ProjectIt Language Generator.
import { net } from "net.akehurst.language-agl-processor";
import SPPTBranch = net.akehurst.language.api.sppt.SPPTBranch;
import {
    PiElementReference,
    PiClassifier,
    PiLimitedConcept,
    PiInstance
} from "../../languagedef/metalanguage";
import {
    PiTyperDef,
    PitAnyTypeRule,
    PitSingleRule,
    PitPropertyCallExp,
    PitSelfExp,
    PitAnytypeExp,
    PitInstanceExp,
    PitWhereExp,
    PitFunctionCallExp,
    PitConformanceOrEqualsRule,
    PitInferenceRule,
    PitLimitedRule,
    PitClassifierRule,
    PitStatementKind,
    PitExp,
    PitProperty,
    PitStatement,
    PitAppliedExp,
    PitEquals,
    PitConforms
} from "../new-metalanguage";
import { PiTyperSyntaxAnalyser } from "./PiTyperSyntaxAnalyser";
import { PiParseLocation } from "../../utils";

export class PiTyperDefSyntaxAnalyserPart {
    mainAnalyser: PiTyperSyntaxAnalyser;

    constructor(mainAnalyser: PiTyperSyntaxAnalyser) {
        this.mainAnalyser = mainAnalyser;
    }

    /**
     * Method to transform branches that match the following rule:
     * PiTyperDef = 'typer'
     *	 'istype' '\{' [ __pi_reference / ',' ]* '}'
     *	 'hastype' '\{' [ __pi_reference / ',' ]* '}'
     *	 PitAnyTypeRule?
     *	 PitClassifierRule* ;
     * @param branch
     * @private
     */
    public transformPiTyperDef(branch: SPPTBranch): PiTyperDef {
        // console.log('transformPiTyperDef called: ' + branch.name);
        let __types: PiElementReference<PiClassifier>[];
        let __conceptsWithType: PiElementReference<PiClassifier>[];
        let __anyTypeRule: PitAnyTypeRule;
        let __classifierRules: PitClassifierRule[];
        const children = this.mainAnalyser.getChildren(branch);
        __types = this.mainAnalyser.transformSharedPackedParseTreeRefList<PiClassifier>(children[3], "PiClassifier", ","); // RHSRefListWithSeparator
        __conceptsWithType = this.mainAnalyser.transformSharedPackedParseTreeRefList<PiClassifier>(children[7], "PiClassifier", ","); // RHSRefListWithSeparator

        if (!children[9].isEmptyMatch) {
            // RHSOptionalGroup
            const _optBranch = this.mainAnalyser.getChildren(children[9]);
            __anyTypeRule = this.mainAnalyser.transformSharedPackedParseTreeNode(_optBranch[0]); // RHSPartEntry
        } // RHSPartListEntry
        if (children[10].name !== "PitClassifierRule") {
            __classifierRules = this.mainAnalyser.transformSharedPackedParseTreeList<PitClassifierRule>(children[10]);
        } else {
            // special case: only when this entry is the single rhs entry of this rule
            __classifierRules = [];
            for (const child of children) {
                __classifierRules.push(this.mainAnalyser.transformSharedPackedParseTreeNode(child));
            }
        }
        const location = PiParseLocation.create({filename: this.mainAnalyser.filename, line: branch.location.line, column: branch.location.column});
        return PiTyperDef.create({
            __types_references: __types,
            __conceptsWithType_references: __conceptsWithType,
            anyTypeRule: __anyTypeRule,
            classifierRules: __classifierRules,
            agl_location: location
        });
    }

    /**
     * Method to transform branches that match the following rule:
     * PitAnyTypeRule = 'anytype' '\{'
     *	 PitSingleRule*
     *	 '}' ;
     * @param branch
     * @private
     */
    public transformPitAnyTypeRule(branch: SPPTBranch): PitAnyTypeRule {
        // console.log('transformPitAnyTypeRule called: ' + branch.name);
        let __myRules: PitSingleRule[];
        const children = this.mainAnalyser.getChildren(branch); // RHSPartListEntry
        if (children[2].name !== "PitSingleRule") {
            __myRules = this.mainAnalyser.transformSharedPackedParseTreeList<PitSingleRule>(children[2]);
        } else {
            // special case: only when this entry is the single rhs entry of this rule
            __myRules = [];
            for (const child of children) {
                __myRules.push(this.mainAnalyser.transformSharedPackedParseTreeNode(child));
            }
        }
        const location = PiParseLocation.create({filename: this.mainAnalyser.filename, line: branch.location.line, column: branch.location.column});
        return PitAnyTypeRule.create({ myRules: __myRules, agl_location: location });
    }

    /**
     * Method to transform branches that match the following rule:
     * PitSingleRule = PitStatementKind PitExp ';' ;
     * @param branch
     * @private
     */
    public transformPitSingleRule(branch: SPPTBranch): PitSingleRule {
        // console.log('transformPitSingleRule called: ' + branch.name);
        let __kind: PiElementReference<PitStatementKind>;
        let __exp: PitExp;
        const children = this.mainAnalyser.getChildren(branch);
        __kind = this.mainAnalyser.piElemRef<PitStatementKind>(children[0], "PitStatementKind"); // RHSLimitedRefEntry
        __exp = this.mainAnalyser.transformSharedPackedParseTreeNode(children[1]); // RHSPartEntry

        const location = PiParseLocation.create({filename: this.mainAnalyser.filename, line: branch.location.line, column: branch.location.column});
        return PitSingleRule.create({ __kind: __kind, exp: __exp, agl_location: location });
    }

    /**
     * Method to transform branches that match the following rule:
     * PitPropertyCallExp = PitExp '.' __pi_reference ;
     * @param branch
     * @private
     */
    public transformPitPropertyCallExp(branch: SPPTBranch): PitPropertyCallExp {
        // console.log('transformPitPropertyCallExp called: ' + branch.name);
        let __source: PitExp;
        let __property: PiElementReference<PitProperty>;
        const children = this.mainAnalyser.getChildren(branch);
        if (!children[0].isEmptyMatch) {
            // RHSOptionalGroup
            const _optGroup = this.mainAnalyser.getGroup(children[0]);
            const _propItem = this.mainAnalyser.getChildren(_optGroup);
            __source = this.mainAnalyser.transformSharedPackedParseTreeNode(_propItem[0]); // RHSPartEntry
        }
        __property = this.mainAnalyser.piElemRef<PitProperty>(children[1], "PitProperty"); // RHSRefEntry

        const location = PiParseLocation.create({filename: this.mainAnalyser.filename, line: branch.location.line, column: branch.location.column});
        return PitPropertyCallExp.create({ source: __source, __property: __property, agl_location: location });
    }

    /**
     * Method to transform branches that match the following rule:
     * PitSelfExp = 'self' ;
     * @param branch
     * @private
     */
    public transformPitSelfExp(branch: SPPTBranch): PitSelfExp {
        // console.log('transformPitSelfExp called: ' + branch.name);

        const children = this.mainAnalyser.getChildren(branch);
        const location = PiParseLocation.create({filename: this.mainAnalyser.filename, line: branch.location.line, column: branch.location.column});
        return PitSelfExp.create({ agl_location: location });
    }

    /**
     * Method to transform branches that match the following rule:
     * PitAnytypeExp = 'anytype' ;
     * @param branch
     * @private
     */
    public transformPitAnytypeExp(branch: SPPTBranch): PitAnytypeExp {
        // console.log('transformPitAnytypeExp called: ' + branch.name);

        const children = this.mainAnalyser.getChildren(branch);
        const location = PiParseLocation.create({filename: this.mainAnalyser.filename, line: branch.location.line, column: branch.location.column});
        return PitAnytypeExp.create({ agl_location: location });
    }

    /**
     * Method to transform branches that match the following rule:
     * PitInstanceExp = ( __pi_reference ':' )?
     *	 __pi_reference ;
     * @param branch
     * @private
     */
    public transformPitInstanceExp(branch: SPPTBranch): PitInstanceExp {
        // console.log('transformPitInstanceExp called: ' + branch.name);
        let __myLimited: PiElementReference<PiLimitedConcept>;
        let __myInstance: PiElementReference<PiInstance>;
        const children = this.mainAnalyser.getChildren(branch);
        if (!children[0].isEmptyMatch) {
            // RHSOptionalGroup
            const _optGroup = this.mainAnalyser.getGroup(children[0]);
            const _propItem = this.mainAnalyser.getChildren(_optGroup);
            __myLimited = this.mainAnalyser.piElemRef<PiLimitedConcept>(_propItem[0], "PiLimitedConcept"); // RHSRefEntry
        }
        __myInstance = this.mainAnalyser.piElemRef<PiInstance>(children[1], "PiInstance"); // RHSRefEntry

        const location = PiParseLocation.create({filename: this.mainAnalyser.filename, line: branch.location.line, column: branch.location.column});
        return PitInstanceExp.create({ __myLimited: __myLimited, __myInstance: __myInstance, agl_location: location });
    }

    /**
     * Method to transform branches that match the following rule:
     * PitWhereExp = PitProperty 'where' '\{'
     *	 ( __pi_binary_PitExp ';' )*
     *	 '}' ;
     * @param branch
     * @private
     */
    public transformPitWhereExp(branch: SPPTBranch): PitWhereExp {
        // console.log('transformPitWhereExp called: ' + branch.name);
        let __otherType: PitProperty;
        let __conditions: PitStatement[];
        const children = this.mainAnalyser.getChildren(branch);
        __otherType = this.mainAnalyser.transformSharedPackedParseTreeNode(children[0]); // RHSPartEntry
        // RHSBinExpListWithTerminator
        __conditions = [];
        const _myList = this.mainAnalyser.getChildren(children[3]);
        _myList.forEach(subNode => {
            const _transformed = this.mainAnalyser.transformSharedPackedParseTreeNode(subNode.nonSkipChildren?.toArray()[0]);
            if (!!_transformed) {
                __conditions.push(_transformed);
            }
        });
        const location = PiParseLocation.create({filename: this.mainAnalyser.filename, line: branch.location.line, column: branch.location.column});
        return PitWhereExp.create({ otherType: __otherType, conditions: __conditions, agl_location: location });
    }

    /**
     * Method to transform branches that match the following rule:
     * PitFunctionCallExp = identifier '(' [ PitExp / ',' ]* ')' ;
     * @param branch
     * @private
     */
    public transformPitFunctionCallExp(branch: SPPTBranch): PitFunctionCallExp {
        // console.log('transformPitFunctionCallExp called: ' + branch.name);
        let __calledFunction: string;
        let __arguments: PitExp[];
        const children = this.mainAnalyser.getChildren(branch);
        __calledFunction = this.mainAnalyser.transformSharedPackedParseTreeNode(children[0]); // RHSPrimEntry
        __arguments = this.mainAnalyser.transformSharedPackedParseTreeList<PitExp>(children[2], ","); // RHSPartListWithSeparator

        const location = PiParseLocation.create({filename: this.mainAnalyser.filename, line: branch.location.line, column: branch.location.column});
        return PitFunctionCallExp.create({ calledFunction: __calledFunction, arguments: __arguments, agl_location: location });
    }

    /**
     * Method to transform branches that match the following rule:
     * PitConformanceOrEqualsRule = __pi_reference '\{'
     *	 PitSingleRule*
     *	 '}' ;
     * @param branch
     * @private
     */
    public transformPitConformanceOrEqualsRule(branch: SPPTBranch): PitConformanceOrEqualsRule {
        // console.log('transformPitConformanceOrEqualsRule called: ' + branch.name);
        let __myClassifier: PiElementReference<PiClassifier>;
        let __myRules: PitSingleRule[];
        const children = this.mainAnalyser.getChildren(branch);
        __myClassifier = this.mainAnalyser.piElemRef<PiClassifier>(children[0], "PiClassifier"); // RHSRefEntry
        // RHSPartListEntry
        if (children[2].name !== "PitSingleRule") {
            __myRules = this.mainAnalyser.transformSharedPackedParseTreeList<PitSingleRule>(children[2]);
        } else {
            // special case: only when this entry is the single rhs entry of this rule
            __myRules = [];
            for (const child of children) {
                __myRules.push(this.mainAnalyser.transformSharedPackedParseTreeNode(child));
            }
        }
        const location = PiParseLocation.create({filename: this.mainAnalyser.filename, line: branch.location.line, column: branch.location.column});
        return PitConformanceOrEqualsRule.create({ __myClassifier: __myClassifier, myRules: __myRules, agl_location: location });
    }

    /**
     * Method to transform branches that match the following rule:
     * PitInferenceRule = __pi_reference '\{'
     *	 'infertype' PitExp ';'
     *	 '}' ;
     * @param branch
     * @private
     */
    public transformPitInferenceRule(branch: SPPTBranch): PitInferenceRule {
        // console.log('transformPitInferenceRule called: ' + branch.name);
        let __myClassifier: PiElementReference<PiClassifier>;
        let __exp: PitExp;
        const children = this.mainAnalyser.getChildren(branch);
        __myClassifier = this.mainAnalyser.piElemRef<PiClassifier>(children[0], "PiClassifier"); // RHSRefEntry
        __exp = this.mainAnalyser.transformSharedPackedParseTreeNode(children[3]); // RHSPartEntry

        const location = PiParseLocation.create({filename: this.mainAnalyser.filename, line: branch.location.line, column: branch.location.column});
        return PitInferenceRule.create({ __myClassifier: __myClassifier, exp: __exp, agl_location: location });
    }

    /**
     * Method to transform branches that match the following rule:
     * PitLimitedRule = __pi_reference '\{'
     *	 ( __pi_binary_PitExp ';' )*
     *	 '}' ;
     * @param branch
     * @private
     */
    public transformPitLimitedRule(branch: SPPTBranch): PitLimitedRule {
        // console.log('transformPitLimitedRule called: ' + branch.name);
        let __myClassifier: PiElementReference<PiClassifier>;
        let __statements: PitStatement[];
        const children = this.mainAnalyser.getChildren(branch);
        __myClassifier = this.mainAnalyser.piElemRef<PiClassifier>(children[0], "PiClassifier"); // RHSRefEntry
        // RHSBinExpListWithTerminator
        __statements = [];
        const _myList = this.mainAnalyser.getChildren(children[2]);
        _myList.forEach(subNode => {
            const _transformed = this.mainAnalyser.transformSharedPackedParseTreeNode(subNode.nonSkipChildren?.toArray()[0]);
            if (!!_transformed) {
                __statements.push(_transformed);
            }
        });
        const location = PiParseLocation.create({filename: this.mainAnalyser.filename, line: branch.location.line, column: branch.location.column});
        return PitLimitedRule.create({ __myClassifier: __myClassifier, statements: __statements, agl_location: location });
    }

    /**
     * Method to transform branches that match the following rule:
     * PitExp = PitAppliedExp
     *    | PitSelfExp
     *    | PitAnytypeExp
     *    | PitInstanceExp
     *    | PitWhereExp
     *    | PitFunctionCallExp
     *    | __pi_binary_PitExp ;
     * @param branch
     * @private
     */
    public transformPitExp(branch: SPPTBranch): PitExp {
        // console.log('transformPitExp called: ' + branch.name);
        return this.mainAnalyser.transformSharedPackedParseTreeNode(branch.nonSkipChildren.toArray()[0]);
    }

    /**
     * Method to transform branches that match the following rule:
     * PitAppliedExp = PitPropertyCallExp  ;
     * @param branch
     * @private
     */
    public transformPitAppliedExp(branch: SPPTBranch): PitAppliedExp {
        // console.log('transformPitAppliedExp called: ' + branch.name);
        return this.mainAnalyser.transformSharedPackedParseTreeNode(branch.nonSkipChildren.toArray()[0]);
    }

    /**
     * Method to transform branches that match the following rule:
     * PitClassifierRule = PitConformanceOrEqualsRule
     *    | PitInferenceRule
     *    | PitLimitedRule  ;
     * @param branch
     * @private
     */
    public transformPitClassifierRule(branch: SPPTBranch): PitClassifierRule {
        // console.log('transformPitClassifierRule called: ' + branch.name);
        return this.mainAnalyser.transformSharedPackedParseTreeNode(branch.nonSkipChildren.toArray()[0]);
    }

    /**
     * Generic method to transform binary expressions, which are parsed
     * according to these rules:
     * __pi_binary_PitExp = [PitExp / __pi_binary_operator]2+ ;
     * leaf __pi_binary_operator = 'conformsto' | 'equalsto' ;
     *
     * In this method we build a crooked tree, which in a later phase needs to be balanced
     * according to the priorities of the operators.
     * @param branch
     * @private
     */
    public transform__pi_binary_PitExp(branch: SPPTBranch): PitExp {
        // console.log('transform__pi_binary_PitExp called: ' + branch.name);
        const children = branch.nonSkipChildren.toArray();
        let index = 0;
        let first = this.mainAnalyser.transformSharedPackedParseTreeNode(children[index++]);
        while (index < children.length) {
            let operator = this.mainAnalyser.transformSharedPackedParseTreeNode(children[index++]);
            let second = this.mainAnalyser.transformSharedPackedParseTreeNode(children[index++]);
            let combined: PitExp = null;
            const location = PiParseLocation.create({filename: this.mainAnalyser.filename, line: branch.location.line, column: branch.location.column});
            switch (operator) {
                case "equalsto": {
                    combined = PitEquals.create({ left: first, right: second, agl_location: location });
                    break;
                }
                case "conformsto": {
                    combined = PitConforms.create({ left: first, right: second, agl_location: location });
                    break;
                }
                default: {
                    combined = null;
                }
            }
            first = combined;
        }
        return first;
    }

    /**
     * Method to transform branches that match the following rule:
     * PitStatementKind = 'equalsto'
     *	| 'conformsto' ;
     * @param branch
     * @private
     */
    public transformPitStatementKind(branch: SPPTBranch): PitStatementKind {
        let choice = branch.nonSkipMatchedText;
        if (choice == "equalsto") {
            return PitStatementKind.EQUALS;
        } else if (choice == "conformsto") {
            return PitStatementKind.CONFORMS;
        } else {
            return null;
        }
    }

    /**
     * Method to transform branches that match the following rule:
     * PitProperty = identifier ':' __pi_reference ;
     * @param branch
     * @private
     */
    public transformPitProperty(branch: SPPTBranch): PitProperty {
        // console.log('transformPitProperty called: ' + branch.name);
        let __name: string;
        let __type: PiElementReference<PiClassifier>;
        const children = this.mainAnalyser.getChildren(branch);
        __name = this.mainAnalyser.transformSharedPackedParseTreeNode(children[0]); // RHSPrimEntry
        __type = this.mainAnalyser.piElemRef<PiClassifier>(children[2], "PiClassifier"); // RHSRefEntry

        const location = PiParseLocation.create({filename: this.mainAnalyser.filename, line: branch.location.line, column: branch.location.column});
        return PitProperty.create({ name: __name, refType: __type, agl_location: location });
    }
}
