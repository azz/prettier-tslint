import globby from "globby";

const expandGlobs = (globs = [], withNodeModules = false) => {
  const filteredGlobs = withNodeModules
    ? globs
    : [...globs, "!**/node_modules/**", "!./node_modules/**"];
  return globby.sync(filteredGlobs, {
    dot: true,
  });
};

export default expandGlobs;
