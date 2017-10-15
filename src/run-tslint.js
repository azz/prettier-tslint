import fs from "fs";
import tslint from "tslint";
import createProgram from "./create-program";

const runTsLint = filepath => {
  const code = fs.readFileSync(filepath, "utf8");
  const config = tslint.Configuration.findConfiguration(null, filepath).results;

  const program = createProgram(filepath);

  // TODO(azz): This actually writes over the file, we don't really want that...
  const linter = new tslint.Linter({ fix: true }, program);

  linter.lint(filepath, code, config);
  const result = linter.getResult();
  return result;
};

export default runTsLint;
