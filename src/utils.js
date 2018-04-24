import requireRelative from "require-relative";

export function requireModule(modulePath) {
  try {
    return require(modulePath);
  } catch (error) {
    throw error;
  }
}

export function getModulePath(filePath, moduleName) {
  try {
    return requireRelative.resolve(moduleName, filePath);
  } catch (error) {
    return require.resolve(moduleName);
  }
}

export function getPrettierConfig(
  filePath,
  prettier = requireModule(getModulePath(filePath, "prettier"))
) {
  return (
    (prettier.resolveConfig &&
      prettier.resolveConfig.sync &&
      prettier.resolveConfig.sync(filePath)) ||
    {}
  );
}
