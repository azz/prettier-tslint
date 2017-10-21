import fs from "fs";
import path from "path";
import ignore from "ignore";

const filterIgnored = filePaths => {
  const ignorePath = path.resolve(process.cwd(), ".prettierignore");
  if (fs.existsSync(ignorePath)) {
    return ignore()
      .add(fs.readFileSync(ignorePath, "utf8"))
      .filter(filePaths);
  }
  return filePaths;
};

export default filterIgnored;
