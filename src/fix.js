import runTsLint from "./run-tslint";
import runPrettier from "./run-prettier";

const fix = filePath => {
  const prettierCheck = runPrettier(filePath, true);
  const tslintCheck = runTsLint(filePath, true);
  return prettierCheck && tslintCheck;
};

export default fix;
