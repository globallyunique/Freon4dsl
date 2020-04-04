// Generated by the ProjectIt Language Generator.
import { AllDemoConcepts } from "../../language/gen";
import {
    DemoModel,
    DemoEntity,
    DemoAttribute,
    DemoFunction,
    DemoVariable,
    DemoExpression,
    DemoPlaceholderExpression,
    DemoLiteralExpression,
    DemoStringLiteralExpression,
    DemoNumberLiteralExpression,
    DemoBooleanLiteralExpression,
    DemoAbsExpression,
    DemoBinaryExpression,
    DemoMultiplyExpression,
    DemoPlusExpression,
    DemoDivideExpression,
    DemoAndExpression,
    DemoOrExpression,
    DemoComparisonExpression,
    DemoLessThenExpression,
    DemoGreaterThenExpression,
    DemoEqualsExpression,
    DemoFunctionCallExpression,
    DemoIfExpression,
    DemoVariableRef
} from "../../language/gen";
import { DemoAttributeType } from "../../language/gen";
// TODO change import to @project/core
import { PiLogger } from "../../../../../core/src/util/PiLogging";

const LOGGER = new PiLogger("DemoUnparser");

// For now, we generate an empty template class as unparser.
// When the editor definition language is finished, the .edit file
// will be used to generate the bodies of the functions below.
export class DemoUnparser {
    public unparse(modelelement: AllDemoConcepts): string {
        if (modelelement instanceof DemoVariableRef) {
            return this.unparseDemoVariableRef(modelelement);
        }
        if (modelelement instanceof DemoIfExpression) {
            return this.unparseDemoIfExpression(modelelement);
        }
        if (modelelement instanceof DemoFunctionCallExpression) {
            return this.unparseDemoFunctionCallExpression(modelelement);
        }
        if (modelelement instanceof DemoEqualsExpression) {
            return this.unparseDemoEqualsExpression(modelelement);
        }
        if (modelelement instanceof DemoGreaterThenExpression) {
            return this.unparseDemoGreaterThenExpression(modelelement);
        }
        if (modelelement instanceof DemoLessThenExpression) {
            return this.unparseDemoLessThenExpression(modelelement);
        }
        if (modelelement instanceof DemoComparisonExpression) {
            return this.unparseDemoComparisonExpression(modelelement);
        }
        if (modelelement instanceof DemoOrExpression) {
            return this.unparseDemoOrExpression(modelelement);
        }
        if (modelelement instanceof DemoAndExpression) {
            return this.unparseDemoAndExpression(modelelement);
        }
        if (modelelement instanceof DemoDivideExpression) {
            return this.unparseDemoDivideExpression(modelelement);
        }
        if (modelelement instanceof DemoPlusExpression) {
            return this.unparseDemoPlusExpression(modelelement);
        }
        if (modelelement instanceof DemoMultiplyExpression) {
            return this.unparseDemoMultiplyExpression(modelelement);
        }
        if (modelelement instanceof DemoBinaryExpression) {
            return this.unparseDemoBinaryExpression(modelelement);
        }
        if (modelelement instanceof DemoAbsExpression) {
            return this.unparseDemoAbsExpression(modelelement);
        }
        if (modelelement instanceof DemoBooleanLiteralExpression) {
            return this.unparseDemoBooleanLiteralExpression(modelelement);
        }
        if (modelelement instanceof DemoNumberLiteralExpression) {
            return this.unparseDemoNumberLiteralExpression(modelelement);
        }
        if (modelelement instanceof DemoStringLiteralExpression) {
            return this.unparseDemoStringLiteralExpression(modelelement);
        }
        if (modelelement instanceof DemoLiteralExpression) {
            return this.unparseDemoLiteralExpression(modelelement);
        }
        if (modelelement instanceof DemoModel) {
            return this.unparseDemoModel(modelelement);
        }
        if (modelelement instanceof DemoEntity) {
            return this.unparseDemoEntity(modelelement);
        }
        if (modelelement instanceof DemoAttribute) {
            return this.unparseDemoAttribute(modelelement);
        }
        if (modelelement instanceof DemoFunction) {
            return this.unparseDemoFunction(modelelement);
        }
        if (modelelement instanceof DemoVariable) {
            return this.unparseDemoVariable(modelelement);
        }
        if (modelelement instanceof DemoExpression) {
            return this.unparseDemoExpression(modelelement);
        }
        if (modelelement instanceof DemoPlaceholderExpression) {
            return this.unparseDemoPlaceholderExpression(modelelement);
        }

        if (modelelement instanceof DemoAttributeType) {
            return this.unparseDemoAttributeType(modelelement);
        }
    }

    private unparseDemoModel(modelelement: DemoModel): string {
        return "";
    }

    private unparseDemoEntity(modelelement: DemoEntity): string {
        return "";
    }

    private unparseDemoAttribute(modelelement: DemoAttribute): string {
        return "";
    }

    private unparseDemoFunction(modelelement: DemoFunction): string {
        return "";
    }

    private unparseDemoVariable(modelelement: DemoVariable): string {
        return "";
    }

    private unparseDemoExpression(modelelement: DemoExpression): string {
        return "";
    }

    private unparseDemoPlaceholderExpression(modelelement: DemoPlaceholderExpression): string {
        return "";
    }

    private unparseDemoLiteralExpression(modelelement: DemoLiteralExpression): string {
        return "";
    }

    private unparseDemoStringLiteralExpression(modelelement: DemoStringLiteralExpression): string {
        return "";
    }

    private unparseDemoNumberLiteralExpression(modelelement: DemoNumberLiteralExpression): string {
        return "";
    }

    private unparseDemoBooleanLiteralExpression(modelelement: DemoBooleanLiteralExpression): string {
        return "";
    }

    private unparseDemoAbsExpression(modelelement: DemoAbsExpression): string {
        return "";
    }

    private unparseDemoBinaryExpression(modelelement: DemoBinaryExpression): string {
        return "";
    }

    private unparseDemoMultiplyExpression(modelelement: DemoMultiplyExpression): string {
        return "";
    }

    private unparseDemoPlusExpression(modelelement: DemoPlusExpression): string {
        return "";
    }

    private unparseDemoDivideExpression(modelelement: DemoDivideExpression): string {
        return "";
    }

    private unparseDemoAndExpression(modelelement: DemoAndExpression): string {
        return "";
    }

    private unparseDemoOrExpression(modelelement: DemoOrExpression): string {
        return "";
    }

    private unparseDemoComparisonExpression(modelelement: DemoComparisonExpression): string {
        return "";
    }

    private unparseDemoLessThenExpression(modelelement: DemoLessThenExpression): string {
        return "";
    }

    private unparseDemoGreaterThenExpression(modelelement: DemoGreaterThenExpression): string {
        return "";
    }

    private unparseDemoEqualsExpression(modelelement: DemoEqualsExpression): string {
        return "";
    }

    private unparseDemoFunctionCallExpression(modelelement: DemoFunctionCallExpression): string {
        return "";
    }

    private unparseDemoIfExpression(modelelement: DemoIfExpression): string {
        return "";
    }

    private unparseDemoVariableRef(modelelement: DemoVariableRef): string {
        return "";
    }

    private unparseDemoAttributeType(modelelement: DemoAttributeType): string {
        return "";
    }
}