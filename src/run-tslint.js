import { readFileSync } from "fs";
import { Configuration, Linter } from "tslint";
import createProgram from "./create-program";

/**
 * @returns true iff output === input
 */
const runTsLint = (filepath, fix) => {
  const code = readFileSync(filepath, "utf8");
  const config = Configuration.findConfiguration(null, filepath).results;

  const program = createProgram(filepath);

  // TODO(azz): This actually writes over the file, we don't really want that...
  const linter = new Linter({ fix }, program);

  linter.lint(filepath, code, config);
  const result = linter.getResult();
  if (fix) {
    // There were no fixes applied
    return result.fixes.length === 0;
  } else {
    // There were no auto-fixable problems
    return !result.failures.find(failure => failure.fix);
  }
};

export default runTsLint;
