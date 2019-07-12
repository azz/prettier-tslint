import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { FatalError, showWarningOnce } from "tslint/lib/error";

const CONFIG_FILENAME = "tsconfig.json";

export function findTsconfigPath(suppliedConfigFilePath, inputFilePath) {
  if (suppliedConfigFilePath !== undefined) {
    if (!fs.existsSync(suppliedConfigFilePath)) {
      throw new FatalError(
        "Could not find config file at: " + path.resolve(suppliedConfigFilePath)
      );
    } else {
      return path.resolve(suppliedConfigFilePath);
    }
  } else if (inputFilePath) {
    // convert to dir if it's a file or doesn't exist
    let useDirName = false;
    let inputDir = inputFilePath;
    try {
      const stats = fs.statSync(inputFilePath);
      if (stats.isFile()) {
        useDirName = true;
      }
    } catch (e) {
      // throws if file doesn't exist
      useDirName = true;
    }
    if (useDirName) {
      inputDir = path.dirname(inputFilePath);
    }
    // search for tsconfig.json from input file location
    let configFilePath = findup([CONFIG_FILENAME], path.resolve(inputDir));
    if (configFilePath !== undefined) {
      return configFilePath;
    }
    // search for tsconfig.json in home directory
    const homeDir = os.homedir();
    configFilePath = path.join(homeDir, CONFIG_FILENAME);
    if (fs.existsSync(configFilePath)) {
      return path.resolve(configFilePath);
    }
    // no path could be found
    return undefined;
  }
}

/**
 * Find a file by names in a directory or any ancestor directory.
 * Will try each filename in filenames before recursing to a parent directory.
 * This is case-insensitive, so it can find 'TsLiNt.JsOn' when searching for 'tslint.json'.
 */
function findup(filenames, dir) {
  let directory = dir;
  // eslint-disable-next-line
  while (true) {
    const res = findFile(directory);
    if (res !== undefined) {
      return path.join(directory, res);
    }

    const parent = path.dirname(directory);
    if (parent === directory) {
      return undefined;
    }
    directory = parent;
  }

  function findFile(cwd) {
    const dirFiles = fs.readdirSync(cwd);
    for (const filename of filenames) {
      const index = dirFiles.indexOf(filename);
      if (index > -1) {
        return filename;
      }
      // TODO: remove in v6.0.0
      // Try reading in the entire directory and looking for a file with different casing.
      const result = dirFiles.find(entry => entry.toLowerCase() === filename);
      if (result !== undefined) {
        showWarningOnce(
          `Using mixed case ${filename} is deprecated. Found: ${path.join(
            cwd,
            result
          )}`
        );
        return result;
      }
    }
    return undefined;
  }
}
