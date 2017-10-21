import { readFileSync, writeFileSync } from "fs";
import { format, check, resolveConfig } from "prettier";

/**
 * @returns true iff output === input
 */
const runPrettier = (filepath, fix) => {
  const config = resolveConfig.sync(filepath);
  const code = readFileSync(filepath, "utf8");
  const options = Object.assign({ filepath }, config);

  if (fix) {
    const output = format(code, options);
    if (output !== code) {
      writeFileSync(filepath, output);
      return false;
    }
    return true;
  } else {
    return check(code, options);
  }
};

export default runPrettier;
