import fs from "fs";
import prettier from "prettier";

const runPrettier = filepath => {
  const code = fs.readFileSync(filepath, "utf8");
  const output = prettier.format(code, { filepath });
  fs.writeFileSync(filepath, output);
};

export default runPrettier;
