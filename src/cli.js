/* eslint no-console: 0 */

import chalk from "chalk";
import yargs from "yargs";

import fix from "./fix";
import check from "./check";
import expandGlob from "./expand-glob";
import filterIgnored from "./filter-ignored";

const cli = argv => {
  const yargsInstance = yargs
    // Fix
    .command("fix", "Fix one or more files")
    .example("prettier-tslint fix file1.ts file2.ts", "Fix provided files")
    .example("prettier-tslint fix '**/*.ts'", "Fix all .ts files")
    // Check
    .command("check", "List files that aren't formatted")
    .example("prettier-tslint check '**/*.ts'", "List unformatted .ts files")
    // Meta
    .demandCommand(1, "Command not provided.")
    .help();

  const args = yargsInstance.parse(argv);
  const command = args._[0];
  const patterns = args._.slice(1);

  switch (command) {
    case "fix":
      return patterns.forEach(fixFiles);
    case "check":
      return patterns.forEach(checkFiles);
    default:
      yargs.showHelp();
      console.error(`Unknown command: ${command}`);
  }
};

const fixFiles = filePattern => {
  const files = filterIgnored(expandGlob(filePattern));
  files.forEach(file => {
    const changed = !fix(file);
    console.log(changed ? file : chalk.gray(file));
  });
};

const checkFiles = filePattern => {
  const files = filterIgnored(expandGlob(filePattern));
  const invalid = files.filter(file => !check(file));
  if (invalid.length) {
    process.exitCode = 1;
  }
  invalid.forEach(file => console.error(chalk.red.bold(file)));
};

export default cli;
