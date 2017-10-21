import fs from "fs";
import prettier from "prettier";

const runPrettier = filepath => {
  const config = prettier.resolveConfig.sync(filepath);
  const code = fs.readFileSync(filepath, "utf8");
  const output = prettier.format(code, Object.assign({ filepath }, config));
  fs.writeFileSync(filepath, output);
};

export default runPrettier;
