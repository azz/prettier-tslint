import fs from "fs";
import prettier from "prettier";

/**
 * @returns true iff output === input
 */
const runPrettier = (filepath, fix) => {
  const config = prettier.resolveConfig.sync(filepath);
  const code = fs.readFileSync(filepath, "utf8");
  const options = Object.assign({ filepath }, config);

  if (fix) {
    const output = prettier.format(code, options);
    if (output !== code) {
      fs.writeFileSync(filepath, output);
      return false;
    }
    return true;
  } else {
    return prettier.check(code, options);
  }
};

export default runPrettier;
