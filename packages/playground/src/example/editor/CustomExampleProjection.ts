// Generated by the ProjectIt Language Generator.
import {
    Box,
    createDefaultExpressionBox,
    TextBox,
    KeyPressAction,
    AliasBox,
    SelectOption,
    IndentBox,
    OptionalBox,
    NBSP,
    HorizontalListBox,
    LabelBox,
    SvgBox,
    GridCell,
    GridBox,
    GridUtil,
    VerticalListBox,
    PiProjection,
    PiElement,
    PiEditor
} from "@projectit/core";
import { projectitStyles } from "./styles/styles";
import { ExampleEnvironment } from "../environment/gen/ExampleEnvironment";
import {
    Attribute,
    AttributeType,
    Entity,
    NumberLiteralExpression,
    OrExpression,
    Parameter, ParameterRef,
    PiElementReference,
    SumExpression
} from "../language/gen";
import { projectitConfiguration } from "../projectit/ProjectitConfiguration";
import { ExampleSelectionHelpers } from "./gen/ExampleSelectionHelpers";
import { sumIcon } from "./Icons";
import { exampleStyles } from "./examplestyles";

const OPERATOR_COLUMN = 1;
const OPERAND_COLUM = 2;

/**
 * Class CustomExampleProjection provides an entry point for the language engineer to
 * define custom build additions to the editor.
 * These custom build additions are merged with the default and definition-based editor parts
 * in a three-way manner. For each modelelement,
 * (1) if a custom build creator/behavior is present, this is used,
 * (2) if a creator/behavior based on the editor definition is present, this is used,
 * (3) if neither (1) nor (2) yields a result, the default is used.
 */
export class CustomExampleProjection implements PiProjection {
    rootProjection: PiProjection;
    helpers = new ExampleSelectionHelpers();
    name: string = "";

    constructor(name: string) {
        this.name = name;
    }

    getBox(element: PiElement): Box {
        if (element instanceof NumberLiteralExpression) {
            return this.getDemoNumberLiteralExpressionBox(element);
        }
        if (element instanceof SumExpression) {
            return this.createSumBox(element);
        }
        if (element instanceof OrExpression) {
            return this.createOrBoxGrid(element);
        }
        if (element instanceof ParameterRef) {
            return this.getParameterRefBox(element);
        }
        // if (element instanceof Entity) {
        //     // return this.createEntityBox(element);
        //     // return this.createEntityBox2(element);
        //     return this.getEntityBox(element)
        // }

        return null;
    }

    public getEntityBox(entity: Entity): Box {
        return new VerticalListBox(entity, "Entity-overall", [
            new HorizontalListBox(
                entity,
                "Entity-hlist-line-0",
                [
                    new LabelBox(entity, "entity-label-line-0-item-0", "Entity ", {
                        style: projectitStyles.propertykeyword,
                        selectable: false,
                    }),
                    new TextBox(
                        entity,
                        "basetype-name",
                        () => entity.name,
                        (c: string) => (entity.name = c as string),
                        {
                            placeHolder: "text",
                            style: projectitStyles.placeholdertext,
                        }
                    ),
                    (!!entity.baseEntity ? new LabelBox(entity, "entity-label-line-0-item-2", "base ", {
                        style: projectitStyles.propertykeyword,
                        selectable: false,
                    }) : null),
                    new OptionalBox(entity, "optional-base", () => (!!entity.baseEntity),
                        this.helpers.getReferenceBox(
                            entity,
                            "entity-baseEntity",
                            "<select baseEntity>",
                            "Entity",
                            () => {
                                if (!!entity.baseEntity) {
                                    return { id: entity.baseEntity.name, label: entity.baseEntity.name };
                                } else {
                                    return null;
                                }
                            },
                            (option: SelectOption) => {
                                if (!!option) {
                                    entity.baseEntity = PiElementReference.create<Entity>(
                                        ExampleEnvironment.getInstance().scoper.getFromVisibleElements(
                                            entity,
                                            option.label,
                                            "Entity"
                                        ) as Entity,
                                        "Entity"
                                    );
                                } else {
                                    entity.baseEntity = null;
                                }
                            }
                        ),
                        false, "<+>"
                    ),
                    new LabelBox(entity, "entity-label-line-0-item-5", "{", {
                        style: projectitStyles.propertykeyword,
                        selectable: false,
                    }),
                ],
                { selectable: true }
            ),
            new IndentBox(
                entity,
                "Entity-indent-line-1",
                4,
                new VerticalListBox(
                    entity,
                    "entity-attributes-list",
                    entity.attributes
                        .map((feature) => {
                            return this.rootProjection.getBox(feature);
                        })
                        .concat(
                            new AliasBox(entity, "entity-attributes", "<+>", {
                                //  add attributes
                                style: projectitStyles.placeholdertext,
                                propertyName: "attributes",
                            })
                        )
                )
            ),
            new IndentBox(
                entity,
                "Entity-indent-line-2",
                4,
                new VerticalListBox(
                    entity,
                    "entity-methods-list",
                    entity.methods
                        .map((feature) => {
                            return this.rootProjection.getBox(feature);
                        })
                        .concat(
                            new AliasBox(entity, "entity-methods", "<+>", {
                                //  add methods
                                style: projectitStyles.placeholdertext,
                                propertyName: "methods",
                            })
                        )
                )
            ),
            new LabelBox(entity, "entity-label-line-3-item-0", "}", {
                style: projectitStyles.propertykeyword,
                selectable: false,
            }),
        ]);
    }


    public getDemoNumberLiteralExpressionBox(exp: NumberLiteralExpression): Box {
        return createDefaultExpressionBox(exp, "number-literal", [
            new TextBox(exp, "NumberLiteralExpression-value", () => exp.value, (v: string) => (exp.value = v), {
                deleteWhenEmpty: true,
                style: projectitStyles.stringLiteral,
                keyPressAction: (currentText: string, key: string, index: number) => {
                    return isNumber(currentText, key, index);
                }
            })
        ]);
    }

    optionalPartBox(element: PiElement, roleName: string, property: string){
        const projectionToUse = !!this.rootProjection ? this.rootProjection : this;
        return !!element[property]
            ? projectionToUse.getBox(element[property])
            : new AliasBox(element, roleName, "[" + property + "]", { propertyName: property });
    }

    public createSumBox(sum: SumExpression): Box {
        let cells: GridCell[] = [
            {
                row: 3,
                column: 1,
                columnSpan: 2,
                box: new HorizontalListBox(sum, "Sum-from-part", [
                    this.optionalPartBox(sum, "SumExpression-variable", "variable"),
                    new LabelBox(sum, "sum-from-equals", "=", { style: exampleStyles.bracket }),
                    this.optionalPartBox(sum, "SumExpression-from", "from")
                ]),
                    // !!sum.from
                    // ? this.rootProjection.getBox(sum.from)
                    // : new AliasBox(sum, "sum-from", "[from]", { propertyName: "from" }),
                style: exampleStyles.mycell
            },
            {
                row: 2,
                column: 1,
                box: new SvgBox(sum, "sum-icon", sumIcon, {
                    width: 50,
                    height: 50,
                    selectable: false
                }),
                style: exampleStyles.mycell
            },
            {
                row: 1,
                column: 1,
                columnSpan: 2,
                box: this.optionalPartBox(sum, "SumExpression-to","to"),
                style: exampleStyles.mycell
            },
            {
                row: 2,
                column: 2,
                box: new HorizontalListBox(sum, "sum-body", [
                    new LabelBox(sum, "sum-body-open", "(", { style: exampleStyles.bracket }),
                    this.optionalPartBox(sum, "SumExpression-body","body"),
                    new LabelBox(sum, "sum-body-close", ")", { style: exampleStyles.bracket })
                ]),
                style: exampleStyles.mycell
            }
        ];
        let result = new GridBox(sum, "sum-all", cells, {
            style: exampleStyles.mygrid
        });
        return createDefaultExpressionBox(sum, "sum-exp", [result]);
    }


    public createOrBoxGrid(exp: OrExpression): Box {
        const gridCells: GridCell[] = [];
        if (exp.left instanceof OrExpression) {
            gridCells.push(
                {
                    row: 1,
                    column: OPERATOR_COLUMN,
                    box: new LabelBox(exp, "or-Box2", () => "or"),
                    style: exampleStyles.gridcellOr,
                    rowSpan: 3
                },
                {
                    row: 1,
                    column: OPERAND_COLUM,
                    box: this.optionalPartBox(exp.left, "OrExpression-left", "left"),
                    style: exampleStyles.gridcellFirst
                },
                {
                    row: 2,
                    column: OPERAND_COLUM,
                    box: this.optionalPartBox(exp.left, "OrExpression-right", "right"),
                    style: exampleStyles.gridcell
                },
                {
                    row: 3,
                    column: OPERAND_COLUM,
                    box: this.optionalPartBox(exp, "OrExpression-right", "right"),
                    style: exampleStyles.gridcellLast
                }
            );
        } else {
            gridCells.push(
                {
                    row: 1,
                    column: OPERATOR_COLUMN,
                    box: new LabelBox(exp, "or-Box3", () => "or"),
                    style: exampleStyles.gridcellOr,
                    rowSpan: 2
                },
                {
                    row: 1,
                    column: OPERAND_COLUM,
                    box: this.optionalPartBox(exp, "OrExpression-left", "left"),
                    style: exampleStyles.gridcellFirst
                },
                {
                    row: 2,
                    column: OPERAND_COLUM,
                    box: this.optionalPartBox(exp, "OrExpression-right", "right"),
                    style: exampleStyles.gridcellLast
                }
            );
        }
        return new GridBox(exp, "grid-or", gridCells, { style: exampleStyles.grid });
    }

    private createEntityBox(entity: Entity): Box {
        let cells: GridCell[] = [];
        cells.push({
            row: 1,
            column: 1,
            box: new TextBox(entity, "entity-name", () => entity.name, (s: string) => (entity.name = s), {
                deleteWhenEmpty: true,
                placeHolder: "<enter entity name>",
                keyPressAction: (currentText: string, key: string, index: number) => {
                    return isName(currentText, key, index);
                }
            })
        });
        cells.push({
            row: 2,
            column: 1,
            box: this.createAttributeGrid(entity)
        });
        return new GridBox(entity, "entity-all", cells);
    }
    private createEntityBox2(entity: Entity): Box {
        return new VerticalListBox(entity, "Entity-overall", [
            new HorizontalListBox(
                entity,
                "Entity-hlist-line-0",
                [
                    new LabelBox(entity, "Entity-label-line-0-item-0", "entity ", {
                        style: projectitStyles.propertykeyword,
                        selectable: false,
                    }),
                    new TextBox(
                        entity,
                        "BaseType-name",
                        () => entity.name,
                        (c: string) => (entity.name = c as string),
                        {
                            placeHolder: "entity name",
                            style: projectitStyles.placeholdertext,
                        }
                    ),
                    new LabelBox(entity, "Entity-label-line-0-item-2", "base ", {
                        style: projectitStyles.propertykeyword,
                        selectable: false,
                    }),
                    this.helpers.getReferenceBox(
                        entity,
                        "Entity-baseEntity",
                        "<select base entity>",
                        "Entity",
                        () => {
                            if (!!entity.baseEntity) {
                                return { id: entity.baseEntity.name, label: entity.baseEntity.name };
                            } else {
                                return null;
                            }
                        },
                        (option: SelectOption) => {
                            if( !!(option)) {
                                entity.baseEntity = PiElementReference.create<Entity>(
                                    ExampleEnvironment.getInstance().scoper.getFromVisibleElements(entity, option.label, "Entity") as Entity,
                                    "Entity"
                                );
                            } else {
                                entity.baseEntity = null;
                            }
                        }
                    )
                ],
                { selectable: true }
            ),
            new IndentBox(
                entity,
                "Entity-attributes",
                4,
                this.createAttributeGrid(entity)
            ),
            new IndentBox(
                entity,
                "Entity-methods",
                4,
                new VerticalListBox(
                    entity,
                    "Model-methods-list",
                    entity.methods
                        .map((feature) => {
                            return this.rootProjection.getBox(feature);
                        })
                        .concat(
                            new AliasBox(entity, "Entity-methods", "<+>", {
                                //  add methods
                                style: projectitStyles.placeholdertext,
                                propertyName: "methods",
                            })
                        )
                )
            ),

        ]);
    }

    private createEntityBoxGrid(entity: Entity): Box {
        // LOGGER.info(this, "createEntityBox: ");
        let cells: GridCell[] = [
            {
                row: 1,
                column: 1,
                columnSpan: 2,
                box: new TextBox(entity, "entity-name", () => entity.name, (v: string) => (entity.name = v))
            }
        ];
        let row = 2;
        entity.attributes.forEach(a => {
            cells.push({
                row: row,
                column: 1,
                box: new TextBox(a, "attr-name-" + row, () => a.name, (v: string) => (a.name = v))
            });
            cells.push({
                row: row,
                column: 2,
                box: this.helpers.getReferenceBox(
                    a,
                    "Attribute-declaredType",
                    "<select declaredType>",
                    "AttributeType",
                    () => {
                        if (!!a.declaredType) {
                            return { id: a.declaredType.name, label: a.declaredType.name };
                        } else {
                            return null;
                        }
                    },
                    (option: SelectOption) => {
                        if (!!option) {
                            a.declaredType = PiElementReference.create<AttributeType>(
                                ExampleEnvironment.getInstance().scoper.getFromVisibleElements(
                                    a,
                                    option.label,
                                    "AttributeType"
                                ) as AttributeType,
                                "AttributeType"
                            );
                        } else {
                            a.declaredType = null;
                        }
                    }
                )

            });
            row++;
        });
        return new GridBox(entity, "entity", cells);
    }

    // TODO Refactor row and column based collections into one generic function.
    private createAttributeGrid(entity: Entity): Box {
        return GridUtil.createCollectionRowGrid<Attribute>(
            entity,
            "attr-grid",
            "attributes",
            entity.attributes,
            ["name", "type"],
            [
                (att: Attribute): Box => {
                    return new TextBox(att, "attr-name", () => att.name, (s: string) => (att.name = s), {
                        deleteWhenEmpty: true,
                        keyPressAction: (currentText: string, key: string, index: number) => {
                            return isName(currentText, key, index);
                        },
                        placeHolder: "<name>"
                    });
                },
                (attr: Attribute): Box => {
                    return this.helpers.getReferenceBox(
                        attr,
                        "Attribute-declaredType",
                        "<select declaredType>",
                        "AttributeType",
                        () => {
                            if (!!attr.declaredType) {
                                return { id: attr.declaredType.name, label: attr.declaredType.name };
                            } else {
                                return null;
                            }
                        },
                        (option: SelectOption) => {
                            if (!!option) {
                                attr.declaredType = PiElementReference.create<AttributeType>(
                                    ExampleEnvironment.getInstance().scoper.getFromVisibleElements(
                                        attr,
                                        option.label,
                                        "AttributeType"
                                    ) as AttributeType,
                                    "AttributeType"
                                );
                            } else {
                                attr.declaredType = null;
                            }
                        }
                    )
                }
            ],
            (box: Box, editor: PiEditor) => {
                return new Attribute();
            },
            ExampleEnvironment.getInstance().editor
        );
    }

    public getParameterRefBox(ParameterRef: ParameterRef): Box {
        return createDefaultExpressionBox(
            ParameterRef,
            "default-expression-box",
            [
                new HorizontalListBox(
                    ParameterRef,
                    "ParameterRef-hlist-line-0",
                    [
                        this.helpers.getReferenceBox(
                            ParameterRef,
                            "ParameterRef-parameter",
                            "<select parameter>",
                            "Parameter",
                            () => {
                                if (!!ParameterRef.parameter) {
                                    return { id: ParameterRef.parameter.name, label: ParameterRef.parameter.name };
                                } else {
                                    return null;
                                }
                            },
                            (option: SelectOption) => {
                                if (!!option) {
                                    ParameterRef.parameter = PiElementReference.create<Parameter>(
                                        ExampleEnvironment.getInstance().scoper.getFromVisibleElements(
                                            ParameterRef,
                                            option.label,
                                            "Parameter"
                                        ) as Parameter,
                                        "Parameter"
                                    );
                                } else {
                                    ParameterRef.parameter = null;
                                }
                            }
                        ),
                        (!!ParameterRef.appliedfeature ?
                            new LabelBox(ParameterRef, "ParameterRef-label-line-0-item-1", ".", {
                                style: projectitStyles.propertykeyword,
                                selectable: false
                            })
                        : new AliasBox(ParameterRef, "ExExpression-appliedfeature", NBSP, { propertyName: "appliedfeature" })
                        ),
                        !!ParameterRef.appliedfeature
                            ? this.rootProjection.getBox(ParameterRef.appliedfeature)
                            : null
                    ],
                    { selectable: true }
                )
            ],
            { selectable: false }
        );
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

function isName(currentText: string, key: string, index: number): KeyPressAction {
    // LOGGER.log("IsName key[" + key + "]");
    if (key === "Enter") {
        if (index === currentText.length) {
            return KeyPressAction.GOTO_NEXT;
        } else {
            return KeyPressAction.NOT_OK;
        }
    } else {
        return KeyPressAction.OK;
    }
}

