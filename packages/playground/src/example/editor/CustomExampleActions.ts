// Generated by the ProjectIt Language Generator.
import {
    KeyboardShortcutBehavior,
    PiBinaryExpressionCreator,
    PiCustomBehavior,
    PiExpressionCreator,
    PiActions,
    Box, PiTriggerType, PiEditor, AliasBox, PiCaret, PiElement, OptionalBox
} from "@projectit/core";
import { PiCustomAction } from "@projectit/core";
import { NumberLiteralExpression } from "../language/gen/NumberLiteralExpression";

/**
 * Class CustomExampleActions provides an entry point for the language engineer to
 * define custom build additions to the editor.
 * These custom build additions are merged with the default and definition-based editor parts
 * in a three-way manner. For each modelelement,
 * (1) if a custom build creator/behavior is present, this is used,
 * (2) if a creator/behavior based on the editor definition is present, this is used,
 * (3) if neither (1) nor (2) yields a result, the default is used.
 */
export class CustomExampleActions implements PiActions {
    binaryExpressionCreators: PiBinaryExpressionCreator[] = MANUAL_BINARY_EXPRESSION_CREATORS;
    customBehaviors: PiCustomBehavior[] = MANUAL_CUSTOM_BEHAVIORS;
    expressionCreators: PiExpressionCreator[] = MANUAL_EXPRESSION_CREATORS;
}

const cust: PiCustomAction[] = [
    new PiCustomAction({
        activeInBoxRoles: [],
        boxRoleToSelect: "",
        caretPosition: null,
        trigger: "",
    }),
    new PiCustomAction({
        trigger: "base",
        activeInBoxRoles: ["optional-baseEntity"],
        action: (box: Box, trigger: PiTriggerType, ed: PiEditor): PiElement | null => {
            (box.parent as OptionalBox).mustShow = true;
            return null;
        },
        boxRoleToSelect: "Entity-baseEntity"
    }),
];

export const MANUAL_EXPRESSION_CREATORS: PiExpressionCreator[] = [
    // Add your own custom expression creators here
    {

        activeInBoxRoles: [
            "Method-body",
            "AbsExpression-expr",
            "SumExpression-from",
            "SumExpression-to",
            "SumExpression-body",
            "IfExpression-condition",
            "IfExpression-whenTrue",
            "IfExpression-whenFalse",
            "PiBinaryExpression-left",
            "PiBinaryExpression-right",
            "MultiplyExpression-left",
            "MultiplyExpression-right",
            "PlusExpression-left",
            "PlusExpression-right",
            "DivideExpression-left",
            "DivideExpression-right",
            "AndExpression-left",
            "AndExpression-right",
            "OrExpression-left",
            "OrExpression-right",
            "ComparisonExpression-left",
            "ComparisonExpression-right",
            "LessThenExpression-left",
            "LessThenExpression-right",
            "GreaterThenExpression-left",
            "GreaterThenExpression-right",
            "EqualsExpression-left",
            "EqualsExpression-right"
        ],
        trigger: /[0-9]/,
        expressionBuilder: (box: Box, trigger: string, editor: PiEditor) => {
            const parent = box.element;
            const x = new NumberLiteralExpression();
            x.value = Number.parseInt(trigger.toString());
            parent[(box as AliasBox).propertyName] = x;
            return x;
        },
        boxRoleToSelect: "NumberLiteralExpression-value-numberbox",
        caretPosition: PiCaret.RIGHT_MOST
    }
];

export const MANUAL_BINARY_EXPRESSION_CREATORS: PiBinaryExpressionCreator[] = [
    // Add your own custom binary expression creators here
];

export const MANUAL_CUSTOM_BEHAVIORS: PiCustomBehavior[] = [
    // Add your own custom behavior here
];

export const MANUAL_KEYBOARD: KeyboardShortcutBehavior[] = [
    // Add your own custom keyboard shortcuts here
];
