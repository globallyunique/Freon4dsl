// Generated by the ProjectIt Language Generator.
import { PiProjection, PiElement, Box, VerticalListBox, HorizontalListBox, LabelBox, TextBox } from "@projectit/core";
import { SelectBox, SelectOption } from "@projectit/core";
import { createDefaultExpressionBox, KeyPressAction } from "@projectit/core";
import { PiScoper } from "@projectit/core";
import { PiEditor } from "@projectit/core";
import {
    AllDemoConcepts,
    DemoAttribute,
    DemoAttributeType,
    DemoFunction,
    DemoFunctionCallExpression,
    DemoNumberLiteralExpression,
    DemoStringLiteralExpression,
    DemoVariable
} from "../language";
import { PiElementReference } from "../language/PiElementReference";
import { demoStyles } from "../styles/styles";
import { DemoEnvironment } from "../environment/DemoEnvironment";
import { DemoSelectionHelpers } from "./gen/DemoSelectionHelpers";

export class DemoProjection implements PiProjection {
    rootProjection: PiProjection;
    helpers = new DemoSelectionHelpers();

    getBox(element: PiElement): Box {
        if (element instanceof DemoFunctionCallExpression) {
            return this.getDemoFunctionCallExpressionBox(element);
        }
        if (element instanceof DemoStringLiteralExpression) {
            return this.getDemoStringLiteralExpressionBox(element);
        }
        if (element instanceof DemoNumberLiteralExpression) {
            return this.getDemoNumberLiteralExpressionBox(element);
        }
        // Add any handmade projections of your own before next statement
        if (element instanceof DemoVariable) {
            return new VerticalListBox(element, "element", [
                new HorizontalListBox(element, "element-name-list", [
                    new LabelBox(element, "element-name-label", "variable name", {
                        style: demoStyles.propertykeyword
                    }),
                    new TextBox(
                        element,
                        "element-name-text",
                        () => element.name,
                        (c: string) => (element.name = c as string),
                        {
                            placeHolder: "text",
                            style: demoStyles.placeholdertext
                        }
                    )
                ])
            ]);
        }
        return null;
    }

    public getDemoFunctionCallExpressionBox(element: DemoFunctionCallExpression): Box {
        return createDefaultExpressionBox(element, "getDemoFunctionCallExpressionBox", [
                this.helpers.getReferenceBox(element, "func-call-exp", "<select function>", "DemoFunction",
                    () => {
                        if (!!element.functionDefinition) {
                            return { id: element.functionDefinition.name, label: element.functionDefinition.name };
                        } else {
                            return null;
                        }
                    },
                    (option: SelectOption) => {
                        // TODO PiElementReference
                        element.functionDefinition = new PiElementReference<DemoFunction>(DemoEnvironment.getInstance().scoper.getFromVisibleElements(
                            element,
                            option.label,
                            "DemoFunction"
                        ) as DemoFunction, "DemoFunction");
                    }
                ),
            new TextBox(element, "blabla", () => element?.functionDefinition.name, (v: string) => (0), {
                style: demoStyles.stringLiteral,
                deleteWhenEmptyAndErase: true
            }),

        ]);
    }

    public getDemoStringLiteralExpressionBox(literal: DemoStringLiteralExpression): Box {
        return createDefaultExpressionBox(literal, "string-literal-exp", [
            new HorizontalListBox(literal, "string-literal", [
                new LabelBox(literal, "start-quote", "\"", { selectable: false }),
                new TextBox(literal, "element-value-text", () => literal.value, (v: string) => (literal.value = v), {
                    style: demoStyles.stringLiteral,
                    deleteWhenEmptyAndErase: true
                }),
                new LabelBox(literal, "end-quote", "\"", { selectable: false })
            ])
        ]);
    }

    public getDemoNumberLiteralExpressionBox(exp: DemoNumberLiteralExpression) {
        return createDefaultExpressionBox(exp, "number-literal", [
            new TextBox(exp, "num-literal-value", () => exp.value, (v: string) => (exp.value = v), {
                deleteWhenEmpty: true,
                style: demoStyles.stringLiteral,
                keyPressAction: (currentText: string, key: string, index: number) => {
                    return isNumber(currentText, key, index);
                }
            })
        ]);
    }
}

function isNumber(currentText: string, key: string, index: number): KeyPressAction {
    if (isNaN(Number(key))) {
        if (index === currentText.length) {
            return KeyPressAction.GOTO_NEXT;
        } else {
            return KeyPressAction.NOT_OK;
        }
    } else {
        return KeyPressAction.OK;
    }
}
