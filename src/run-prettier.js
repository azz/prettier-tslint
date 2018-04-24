import { readFileSync, writeFileSync } from "fs";
import { requireModule, getModulePath, getPrettierConfig } from "./utils";

/**
 * @returns true iff output === input
 */
const runPrettier = (filepath, fix) => {
  const prettier = requireModule(getModulePath(filepath, "prettier"));
  const config = getPrettierConfig(filepath, prettier);
  const code = readFileSync(filepath, "utf8");
  const options = Object.assign({ filepath }, config);

  if (fix) {
    const output = prettier.format(code, options);
    if (output !== code) {
      writeFileSync(filepath, output);
      return false;
    }
    return true;
  } else {
    return prettier.check(code, options);
  }
};

export default runPrettier;
