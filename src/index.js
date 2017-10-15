import fs from "fs";
import minimist from "minimist";

import runTsLint from "./run-tslint";
import runPrettier from "./run-prettier";

const format = filepath => {
  runPrettier(filepath);
  runTsLint(filepath);
};

const cliOpts = {};

export const cli = argv => {
  const args = minimist(argv, cliOpts);
  args._.forEach(format);
};

export default format;
