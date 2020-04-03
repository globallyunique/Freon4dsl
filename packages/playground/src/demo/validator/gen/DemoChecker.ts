// Generated by the ProjectIt Language Generator.
import { PiError, PiTyper } from "@projectit/core";
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
    DemoVariableRef,
    DemoAttributeType,
    DemoType
} from "../../language/gen";
import { DemoUnparser } from "../../utils/gen/DemoUnparser";
import { DemoWorker } from "../../utils/gen/DemoWorker";

export class DemoChecker implements DemoWorker {
    myUnparser = new DemoUnparser();
    typer: PiTyper;
    errorList: PiError[] = [];

    public execBeforeDemoModel(modelelement: DemoModel) {
        // @validName name
        if (!this.isValidName(modelelement.name)) {
            this.errorList.push(new PiError("'" + modelelement.name + "' is not a valid identifier", name));
        }
        // @notEmpty this.entities
        if (modelelement.entities.length == 0) {
            this.errorList.push(new PiError("List 'this.entities' may not be empty", modelelement.entities));
        }
        // @notEmpty this.functions
        if (modelelement.functions.length == 0) {
            this.errorList.push(new PiError("List 'this.functions' may not be empty", modelelement.functions));
        }
    }
    public execAfterDemoModel(modelelement: DemoModel) {}

    public execBeforeDemoEntity(modelelement: DemoEntity) {
        // @validName name
        if (!this.isValidName(modelelement.name)) {
            this.errorList.push(new PiError("'" + modelelement.name + "' is not a valid identifier", name));
        }
        // @notEmpty this.attributes
        if (modelelement.attributes.length == 0) {
            this.errorList.push(new PiError("List 'this.attributes' may not be empty", modelelement.attributes));
        }
        // @notEmpty this.functions
        if (modelelement.functions.length == 0) {
            this.errorList.push(new PiError("List 'this.functions' may not be empty", modelelement.functions));
        }
    }
    public execAfterDemoEntity(modelelement: DemoEntity) {}

    public execBeforeDemoAttribute(modelelement: DemoAttribute) {
        // @validName name
        if (!this.isValidName(modelelement.name)) {
            this.errorList.push(new PiError("'" + modelelement.name + "' is not a valid identifier", name));
        }
    }
    public execAfterDemoAttribute(modelelement: DemoAttribute) {}

    public execBeforeDemoFunction(modelelement: DemoFunction) {
        // @typecheck conformsTo( this.expression, this.declaredType )
        if (!this.typer.conformsTo(modelelement.expression, modelelement.declaredType)) {
            this.errorList.push(
                new PiError(
                    "Type of '" +
                        this.myUnparser.unparse(modelelement.expression) +
                        "' does not conform to (the type of) '" +
                        this.myUnparser.unparse(modelelement.declaredType) +
                        "'",
                    modelelement.expression
                )
            );
        }
        // @notEmpty this.parameters
        if (modelelement.parameters.length == 0) {
            this.errorList.push(new PiError("List 'this.parameters' may not be empty", modelelement.parameters));
        }
        // @validName name
        if (!this.isValidName(modelelement.name)) {
            this.errorList.push(new PiError("'" + modelelement.name + "' is not a valid identifier", name));
        }
    }
    public execAfterDemoFunction(modelelement: DemoFunction) {}

    public execBeforeDemoVariable(modelelement: DemoVariable) {
        // @validName name
        if (!this.isValidName(modelelement.name)) {
            this.errorList.push(new PiError("'" + modelelement.name + "' is not a valid identifier", name));
        }
    }
    public execAfterDemoVariable(modelelement: DemoVariable) {}

    public execBeforeDemoAbsExpression(modelelement: DemoAbsExpression) {
        // @typecheck equalsType( this.expr, DemoAttributeType:Integer )
        if (!this.typer.equalsType(modelelement.expr, DemoAttributeType.Integer)) {
            this.errorList.push(
                new PiError(
                    "Type of '" +
                        this.myUnparser.unparse(modelelement.expr) +
                        "' should be equal to (the type of) '" +
                        this.myUnparser.unparse(DemoAttributeType.Integer) +
                        "'",
                    modelelement.expr
                )
            );
        }
    }
    public execAfterDemoAbsExpression(modelelement: DemoAbsExpression) {}

    public execBeforeDemoMultiplyExpression(modelelement: DemoMultiplyExpression) {
        // @typecheck equalsType( this.left, DemoAttributeType:Integer )
        if (!this.typer.equalsType(modelelement.left, DemoAttributeType.Integer)) {
            this.errorList.push(
                new PiError(
                    "Type of '" +
                        this.myUnparser.unparse(modelelement.left) +
                        "' should be equal to (the type of) '" +
                        this.myUnparser.unparse(DemoAttributeType.Integer) +
                        "'",
                    modelelement.left
                )
            );
        }
        // @typecheck equalsType( this.right, DemoAttributeType:Integer )
        if (!this.typer.equalsType(modelelement.right, DemoAttributeType.Integer)) {
            this.errorList.push(
                new PiError(
                    "Type of '" +
                        this.myUnparser.unparse(modelelement.right) +
                        "' should be equal to (the type of) '" +
                        this.myUnparser.unparse(DemoAttributeType.Integer) +
                        "'",
                    modelelement.right
                )
            );
        }
    }
    public execAfterDemoMultiplyExpression(modelelement: DemoMultiplyExpression) {}

    public execBeforeDemoPlusExpression(modelelement: DemoPlusExpression) {
        // @typecheck equalsType( this.left, DemoAttributeType:Integer )
        if (!this.typer.equalsType(modelelement.left, DemoAttributeType.Integer)) {
            this.errorList.push(
                new PiError(
                    "Type of '" +
                        this.myUnparser.unparse(modelelement.left) +
                        "' should be equal to (the type of) '" +
                        this.myUnparser.unparse(DemoAttributeType.Integer) +
                        "'",
                    modelelement.left
                )
            );
        }
        // @typecheck equalsType( this.right, DemoAttributeType:Integer )
        if (!this.typer.equalsType(modelelement.right, DemoAttributeType.Integer)) {
            this.errorList.push(
                new PiError(
                    "Type of '" +
                        this.myUnparser.unparse(modelelement.right) +
                        "' should be equal to (the type of) '" +
                        this.myUnparser.unparse(DemoAttributeType.Integer) +
                        "'",
                    modelelement.right
                )
            );
        }
        // @typecheck conformsTo( this.left, this.right )
        if (!this.typer.conformsTo(modelelement.left, modelelement.right)) {
            this.errorList.push(
                new PiError(
                    "Type of '" +
                        this.myUnparser.unparse(modelelement.left) +
                        "' does not conform to (the type of) '" +
                        this.myUnparser.unparse(modelelement.right) +
                        "'",
                    modelelement.left
                )
            );
        }
    }
    public execAfterDemoPlusExpression(modelelement: DemoPlusExpression) {}

    public execBeforeDemoDivideExpression(modelelement: DemoDivideExpression) {
        // @typecheck equalsType( this.left, DemoAttributeType:Integer )
        if (!this.typer.equalsType(modelelement.left, DemoAttributeType.Integer)) {
            this.errorList.push(
                new PiError(
                    "Type of '" +
                        this.myUnparser.unparse(modelelement.left) +
                        "' should be equal to (the type of) '" +
                        this.myUnparser.unparse(DemoAttributeType.Integer) +
                        "'",
                    modelelement.left
                )
            );
        }
        // @typecheck equalsType( this.right, DemoAttributeType:Integer )
        if (!this.typer.equalsType(modelelement.right, DemoAttributeType.Integer)) {
            this.errorList.push(
                new PiError(
                    "Type of '" +
                        this.myUnparser.unparse(modelelement.right) +
                        "' should be equal to (the type of) '" +
                        this.myUnparser.unparse(DemoAttributeType.Integer) +
                        "'",
                    modelelement.right
                )
            );
        }
    }
    public execAfterDemoDivideExpression(modelelement: DemoDivideExpression) {}

    public execBeforeDemoAndExpression(modelelement: DemoAndExpression) {
        // @typecheck equalsType( this.left, DemoAttributeType:Boolean )
        if (!this.typer.equalsType(modelelement.left, DemoAttributeType.Boolean)) {
            this.errorList.push(
                new PiError(
                    "Type of '" +
                        this.myUnparser.unparse(modelelement.left) +
                        "' should be equal to (the type of) '" +
                        this.myUnparser.unparse(DemoAttributeType.Boolean) +
                        "'",
                    modelelement.left
                )
            );
        }
        // @typecheck equalsType( this.right, DemoAttributeType:Boolean )
        if (!this.typer.equalsType(modelelement.right, DemoAttributeType.Boolean)) {
            this.errorList.push(
                new PiError(
                    "Type of '" +
                        this.myUnparser.unparse(modelelement.right) +
                        "' should be equal to (the type of) '" +
                        this.myUnparser.unparse(DemoAttributeType.Boolean) +
                        "'",
                    modelelement.right
                )
            );
        }
    }
    public execAfterDemoAndExpression(modelelement: DemoAndExpression) {}

    public execBeforeDemoOrExpression(modelelement: DemoOrExpression) {
        // @typecheck equalsType( this.left, DemoAttributeType:Boolean )
        if (!this.typer.equalsType(modelelement.left, DemoAttributeType.Boolean)) {
            this.errorList.push(
                new PiError(
                    "Type of '" +
                        this.myUnparser.unparse(modelelement.left) +
                        "' should be equal to (the type of) '" +
                        this.myUnparser.unparse(DemoAttributeType.Boolean) +
                        "'",
                    modelelement.left
                )
            );
        }
        // @typecheck equalsType( this.right, DemoAttributeType:Boolean )
        if (!this.typer.equalsType(modelelement.right, DemoAttributeType.Boolean)) {
            this.errorList.push(
                new PiError(
                    "Type of '" +
                        this.myUnparser.unparse(modelelement.right) +
                        "' should be equal to (the type of) '" +
                        this.myUnparser.unparse(DemoAttributeType.Boolean) +
                        "'",
                    modelelement.right
                )
            );
        }
    }
    public execAfterDemoOrExpression(modelelement: DemoOrExpression) {}

    public execBeforeDemoComparisonExpression(modelelement: DemoComparisonExpression) {
        // @typecheck equalsType( this.left, this.right )
        if (!this.typer.equalsType(modelelement.left, modelelement.right)) {
            this.errorList.push(
                new PiError(
                    "Type of '" +
                        this.myUnparser.unparse(modelelement.left) +
                        "' should be equal to (the type of) '" +
                        this.myUnparser.unparse(modelelement.right) +
                        "'",
                    modelelement.left
                )
            );
        }
    }
    public execAfterDemoComparisonExpression(modelelement: DemoComparisonExpression) {}

    public execBeforeDemoIfExpression(modelelement: DemoIfExpression) {
        // @typecheck equalsType( this.condition, DemoAttributeType:Boolean )
        if (!this.typer.equalsType(modelelement.condition, DemoAttributeType.Boolean)) {
            this.errorList.push(
                new PiError(
                    "Type of '" +
                        this.myUnparser.unparse(modelelement.condition) +
                        "' should be equal to (the type of) '" +
                        this.myUnparser.unparse(DemoAttributeType.Boolean) +
                        "'",
                    modelelement.condition
                )
            );
        }
        // @typecheck conformsTo( this.whenTrue, this.whenFalse )
        if (!this.typer.conformsTo(modelelement.whenTrue, modelelement.whenFalse)) {
            this.errorList.push(
                new PiError(
                    "Type of '" +
                        this.myUnparser.unparse(modelelement.whenTrue) +
                        "' does not conform to (the type of) '" +
                        this.myUnparser.unparse(modelelement.whenFalse) +
                        "'",
                    modelelement.whenTrue
                )
            );
        }
    }
    public execAfterDemoIfExpression(modelelement: DemoIfExpression) {}

    public execBeforeDemoExpression(modelelement: DemoExpression) {}
    public execAfterDemoExpression(modelelement: DemoExpression) {}

    public execBeforeDemoPlaceholderExpression(modelelement: DemoPlaceholderExpression) {}
    public execAfterDemoPlaceholderExpression(modelelement: DemoPlaceholderExpression) {}

    public execBeforeDemoLiteralExpression(modelelement: DemoLiteralExpression) {}
    public execAfterDemoLiteralExpression(modelelement: DemoLiteralExpression) {}

    public execBeforeDemoStringLiteralExpression(modelelement: DemoStringLiteralExpression) {}
    public execAfterDemoStringLiteralExpression(modelelement: DemoStringLiteralExpression) {}

    public execBeforeDemoNumberLiteralExpression(modelelement: DemoNumberLiteralExpression) {}
    public execAfterDemoNumberLiteralExpression(modelelement: DemoNumberLiteralExpression) {}

    public execBeforeDemoBooleanLiteralExpression(modelelement: DemoBooleanLiteralExpression) {}
    public execAfterDemoBooleanLiteralExpression(modelelement: DemoBooleanLiteralExpression) {}

    public execBeforeDemoBinaryExpression(modelelement: DemoBinaryExpression) {}
    public execAfterDemoBinaryExpression(modelelement: DemoBinaryExpression) {}

    public execBeforeDemoLessThenExpression(modelelement: DemoLessThenExpression) {}
    public execAfterDemoLessThenExpression(modelelement: DemoLessThenExpression) {}

    public execBeforeDemoGreaterThenExpression(modelelement: DemoGreaterThenExpression) {}
    public execAfterDemoGreaterThenExpression(modelelement: DemoGreaterThenExpression) {}

    public execBeforeDemoEqualsExpression(modelelement: DemoEqualsExpression) {}
    public execAfterDemoEqualsExpression(modelelement: DemoEqualsExpression) {}

    public execBeforeDemoFunctionCallExpression(modelelement: DemoFunctionCallExpression) {}
    public execAfterDemoFunctionCallExpression(modelelement: DemoFunctionCallExpression) {}

    public execBeforeDemoVariableRef(modelelement: DemoVariableRef) {}
    public execAfterDemoVariableRef(modelelement: DemoVariableRef) {}

    public execBeforeDemoAttributeType(modelelement: DemoAttributeType) {}
    public execAfterDemoAttributeType(modelelement: DemoAttributeType) {}

    private isValidName(name: string): boolean {
        if (name == null) return false;
        // cannot start with number
        if (/[0-9]/.test(name[0])) return false;
        // may contain letters, numbers, '$', and '_', but no other characters
        if (/[.|,|!|?|@|~|%|^|&|*|-|=|+|(|)|{|}|"|'|:|;|<|>|?]/.test(name)) return false;
        if (/\\/.test(name)) return false;
        if (/[/|[|]]/.test(name)) return false;
        // may not contain whitespaces
        if (/[\t|\n|\r| ]/.test(name)) return false;
        // may not be a Typescript keyword
        // TODO implement this
        return true;
    }
}
