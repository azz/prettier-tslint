import runTsLint from "./run-tslint";
import runPrettier from "./run-prettier";
import createIgnorer from "./create-ignorer";

const check = (filePath, isIgnored = createIgnorer()) => {
  if (isIgnored(filePath)) {
    return null;
  }
  return runPrettier(filePath, false) && runTsLint(filePath, false);
};

export default check;
