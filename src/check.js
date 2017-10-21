import runTsLint from "./run-tslint";
import runPrettier from "./run-prettier";

const check = filePath => {
  return runPrettier(filePath, false) && runTsLint(filePath, false);
};

export default check;
