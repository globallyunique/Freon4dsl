// Generated by the ProjectIt Language Generator.
import { AllDemoConcepts } from "../../language";
import { PiValidator, PiError, PiTyper } from "@projectit/core";
import { DemoChecker } from "./DemoChecker";
import { DemoWalker } from "../../../demo/utils/gen/DemoWalker";

export class DemoValidator implements PiValidator {
    myTyper: PiTyper;

    public validate(modelelement: AllDemoConcepts, includeChildren?: boolean): PiError[] {
        let myChecker = new DemoChecker();
        let errorlist: PiError[] = [];
        myChecker.errorList = errorlist;
        myChecker.typer = this.myTyper;

        let myWalker = new DemoWalker();
        myWalker.myWorker = myChecker;
        myWalker.walk(modelelement, includeChildren);

        return errorlist;
    }
}
