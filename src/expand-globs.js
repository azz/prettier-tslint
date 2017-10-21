import globby from "globby";

const expandGlobs = (globs = []) => {
  return globby.sync([...globs, "!**/node_modules/**", "!./node_modules/**"], {
    dot: true,
  });
};

export default expandGlobs;
