import fs from "fs";
import minimist from "minimist";

import expandGlob from "./expand-glob";
import filterIgnored from "./filter-ignored";
import runTsLint from "./run-tslint";
import runPrettier from "./run-prettier";

const format = filePath => {
  runPrettier(filePath);
  runTsLint(filePath);
};

const formatFiles = filePattern => {
  const files = filterIgnored(expandGlob(filePattern));
  files.forEach(format);
};

const cliOpts = {};

export const cli = argv => {
  const args = minimist(argv, cliOpts);
  args._.forEach(formatFiles);
};

export default format;
