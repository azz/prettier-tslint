import { existsSync, readFileSync } from "fs";
import path from "path";
import ignore from "ignore";

const createIgnorer = () => {
  const ignorePath = path.resolve(process.cwd(), ".prettierignore");
  if (existsSync(ignorePath)) {
    const ignorer = ignore().add(readFileSync(ignorePath, "utf8"));
    return filePath => ignorer.ignores(path.relative(process.cwd(), filePath));
  }

  return () => false;
};

export default createIgnorer;
