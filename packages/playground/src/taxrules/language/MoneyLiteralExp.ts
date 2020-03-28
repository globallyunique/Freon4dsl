// Generated by the ProjectIt Language Generator.
import { observable } from "mobx";
import * as uuid from "uuid";
import { PiElement, PiNamedElement, PiExpression, PiBinaryExpression } from "@projectit/core";
import { model } from "@projectit/core";
import { TaxRulesConceptType } from "./TaxRules";
import { IncomeType } from "./IncomeType";
import { TaxPayerType } from "./TaxPayerType";
import { PlaceholderExpression } from "./PlaceholderExpression";
import { Expression } from "./Expression";
import { LiteralExpression } from "./LiteralExpression";

@model
export class MoneyLiteralExp extends LiteralExpression implements PiExpression {
    readonly $typename: TaxRulesConceptType = "MoneyLiteralExp";

    constructor(id?: string) {
        super(id);
    }

    @observable value: string;

    piLanguageConcept(): TaxRulesConceptType {
        return this.$typename;
    }

    piIsExpression(): boolean {
        return true;
    }

    piIsBinaryExpression(): boolean {
        return false;
    }

    piIsExpressionPlaceHolder(): boolean {
        return false;
    }
}
