import { resolve } from "path";
import * as TJS from "typescript-json-schema";

// COULD NOT GET THIS TO WORK WITH `ts-node`
// Optionally pass argument to schema generator

const settings : TJS.PartialArgs = {
    required: true,
    noExtraProps: true
};

// optionally pass ts compiler options
const compilerOptions : TJS.CompilerOptions= {
    strictNullChecks: true
}
const program = TJS.getProgramFromFiles(
    [resolve("LevelData.ts")],
    compilerOptions);

// We can either get the schema for one file and one type...
const schema = TJS.generateSchema(program, "ILevel", settings);
console.log(schema);
// ... or a generator that lets us incrementally get more schemas
// const generator = TJS.buildGenerator(program, settings);
// // all symbols
// const symbols = generator.getUserSymbols();
// // Get symbols for different types from generator.
// generator.getSchemaForSymbol("MyType");
// generator.getSchemaForSymbol("AnotherType");