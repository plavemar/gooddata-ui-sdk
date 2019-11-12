// (C) 2007-2019 GoodData Corporation

import { createUniqueVariableName } from "../variableNaming";

describe("createUniqueVariableName", () => {
    describe("scenario transformation", () => {
        const TEST_DATA: Array<[string, string]> = [
            ["MyScenario", "my scenario"],
            ["SingleMeasureSingleViewBy", "single measure, single view by"],
            ["SingleMeasureWithPercentFormat", "single measure with % format"],
            ["$1Measure", "1 measure"],
        ];

        it.each(TEST_DATA)("should return '%s' when input is '%s'", (expectedResult, input) => {
            expect(createUniqueVariableName(input)).toEqual(expectedResult);
        });
    });

    describe("uniqueness guarantees", () => {
        it("should append 1 if name is taken", () => {
            expect(createUniqueVariableName("Something", { Something: true })).toEqual("Something_1");
        });
        it("should append 2 if names are taken", () => {
            expect(createUniqueVariableName("Something", { Something: true, Something_1: true })).toEqual(
                "Something_2",
            );
        });
        it("should work with transformed title", () => {
            expect(createUniqueVariableName("something", { Something: true })).toEqual("Something_1");
        });
    });
});
