import { GenericModelSerializer } from "@projectit/core";
import { FileHandler } from "./FileHandler";
import { ExpressionLibraryEnvironment } from "../environment/gen/ExpressionLibraryEnvironment";
import { ExpressionLibraryModelUnitType, ModelUnitMetaType } from "../language/gen";

const writer = ExpressionLibraryEnvironment.getInstance().writer;
const reader = ExpressionLibraryEnvironment.getInstance().reader;
const serial: GenericModelSerializer = new GenericModelSerializer();
const handler = new FileHandler();

function compareReadAndWrittenOclParts(path: string) {
    try {
        const unit1 = readFromFile(path, "LibUnit");
        let result: string = writer.writeToString(unit1, 0, false);
        expect(result.length).toBeGreaterThan(0);
        const unit2 = reader.readFromString(result, "OclPart");
        // simply comparing the units does not work because the id properties of the two units
        // are not the same, therefore we use the hack of checking whether both units in JSON
        // format are the same
        const unit1_json = serial.convertToJSON(unit1);
        const unit2_json = serial.convertToJSON(unit2);
        expect(unit1_json).toEqual(unit2_json);
    } catch (e) {
        console.log(e.message);
        expect(e).toBeNaN();
    }
}

function readFromFile(filepath: string, metatype: ModelUnitMetaType): ExpressionLibraryModelUnitType {
    // read language file
    const langSpec = handler.stringFromFile(filepath);
    return reader.readFromString(langSpec, metatype) as ExpressionLibraryModelUnitType;
}

describe("Testing Parser for expression library", () => {

    // TODO use snapshots
    test("Numeric expressions unparsed and parsed again", () => {
        compareReadAndWrittenOclParts("src/libraries-test/__inputs__/numerics.lts");
    });

    // test("Period unparsed and parsed again", () => {
    //     compareReadAndWrittenOclParts("src/octopus/__inputs__/Appendix.ocl");
    // });
    //
    // test("Period unparsed and parsed again", () => {
    //     compareReadAndWrittenOclParts("src/octopus/__inputs__/Bookpart.ocl");
    // });
    //
    // test("Period unparsed and parsed again", () => {
    //     compareReadAndWrittenOclParts("src/octopus/__inputs__/Chapter.ocl");
    // });
    //
    // test("Period unparsed and parsed again", () => {
    //     compareReadAndWrittenOclParts("src/octopus/__inputs__/Prependix.ocl");
    // });
});
