import { LanguageParser } from "../../parser/LanguageParser";

describe("Checking language parser on syntax errors", () => {
    let parser = new LanguageParser();
    let testdir = "src/languagedef/__tests__/language-tests/faultyDefFiles/syntax-errors/";

    test("language should have a unitName", () => {
        let parseFile = testdir + "test1.lang";
        try {
            parser.parse(parseFile);
        } catch(e) {
            expect(e.message).toBe(`syntax error.`);
        }
    });

    test("language unitName should not contain a dot", () => {
        let parseFile = testdir + "test2.lang";
        try {
            parser.parse(parseFile);
        } catch(e) {
            expect(e.message).toBe(`syntax error.`);
        }
    });

    test("properties cannot be initialized", () => {
        let parseFile = testdir + "test3.lang";
        try {
            parser.parse(parseFile);
        } catch(e) {
            expect(e.message).toBe(`syntax error.`);
        }
    });

    test("concepts should have a unitName", () => {
        let parseFile = testdir + "test4.lang";
        try {
            parser.parse(parseFile);
        } catch(e) {
            expect(e.message).toBe(`syntax error.`);
        }
    });

    test("instances of limited concepts should have a unitName", () => {
        let parseFile = testdir + "test5.lang";
        try {
            parser.parse(parseFile);
        } catch(e) {
            expect(e.message).toBe(`syntax error.`);
        }
    });

    test("property definitions should end in semicolon", () => {
        let parseFile = testdir + "test6.lang";
        try {
            parser.parse(parseFile);
        } catch(e) {
            expect(e.message).toBe(`syntax error.`);
        }
    });

    test("only a single '?' can be used for optional properties", () => {
        let parseFile = testdir + "test7.lang";
        try {
            parser.parse(parseFile);
        } catch(e) {
            expect(e.message).toBe(`syntax error.`);
        }
    });

    test("concepts may have only one base concept", () => {
        let parseFile = testdir + "test8.lang";
        try {
            parser.parse(parseFile);
        } catch(e) {
            expect(e.message).toBe(`syntax error.`);
        }
    });

    test("interfaces may not implement other interfaces", () => {
        let parseFile = testdir + "test9.lang";
        try {
            parser.parse(parseFile);
        } catch(e) {
            expect(e.message).toBe(`syntax error.`);
        }
    });

    test("instances of limited concepts should have some properties", () => {
        let parseFile = testdir + "test10.lang";
        try {
            parser.parse(parseFile);
        } catch(e) {
            expect(e.message).toBe(`syntax error.`);
        }
    });
});
