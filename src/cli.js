/* eslint no-console: 0 */

import chalk from "chalk";
import yargs, { showHelp } from "yargs";

import fix from "./fix";
import check from "./check";
import expandGlobs from "./expand-globs";
import createIgnorer from "./create-ignorer";

const cli = argv => {
  const { _: [command, ...patterns] } = yargs
    // Fix
    .command("fix", "Fix one or more files")
    .example("prettier-tslint fix file1.ts file2.ts", "Fix provided files")
    .example("prettier-tslint fix '**/*.ts'", "Fix all .ts files")
    // Check
    .command("check", "List files that aren't formatted")
    .example("prettier-tslint check '**/*.ts'", "List unformatted .ts files")
    // Meta
    .demandCommand(1, "Command not provided.")
    .help()
    .parse(argv);

  switch (command) {
    case "fix":
      return fixFiles(patterns);
    case "check":
      return checkFiles(patterns);
    default:
      showHelp();
      console.error(`Unknown command: ${command}`);
  }
};

const fixFiles = filePatterns => {
  const ignorer = createIgnorer();
  const files = expandGlobs(filePatterns);
  files.forEach(file => {
    const changed = !fix(file, ignorer);
    console.log(changed ? file : chalk.gray(file));
  });
};

const checkFiles = filePatterns => {
  const ignorer = createIgnorer();
  const files = expandGlobs(filePatterns);
  const invalid = files.filter(file => !check(file, ignorer));
  if (invalid.length) {
    process.exitCode = 1;
  }
  invalid.forEach(file => console.error(chalk.red.bold(file)));
};

export default cli;
