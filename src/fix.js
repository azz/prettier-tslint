import runTsLint from "./run-tslint";
import runPrettier from "./run-prettier";
import createIgnorer from "./create-ignorer";

const fix = (filePath, isIgnored = createIgnorer()) => {
  if (isIgnored(filePath)) {
    return null;
  }
  const prettierCheck = runPrettier(filePath, true);
  const tslintCheck = runTsLint(filePath, true);
  return prettierCheck && tslintCheck;
};

export default fix;
