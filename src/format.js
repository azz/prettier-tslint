import { extname } from "path";
import { readFileSync } from "fs";
import { requireModule, getModulePath, getPrettierConfig } from "./utils";

/**
 * Formats the text with prettier and then eslint based on the given options
 * @param {String} options.filePath - the path of the file being formatted
 *  can be used in leu of `eslintConfig` (eslint will be used to find the
 *  relevant config for the file). Will also be used to load the `text` if
 *  `text` is not provided.
 * @param {String} options.text - the text (TypeScript code) to format
 * @param {String} options.tslintPath - the path to the tslint module to use.
 *   Will default to require.resolve('tslint')
 * @param {String} options.prettierPath - the path to the prettier module.
 *   Will default to require.resovlve('prettier')
 * @param {Object} options.tslintConfig - the config to use for formatting
 *  with TSLint.
 * @param {Object} options.prettierOptions - the options to pass for
 *  formatting with `prettier`. If not provided, prettier-eslint will attempt
 *  to create the options based on the eslintConfig
 * @param {Object} options.fallbackPrettierOptions - the options to pass for
 *  formatting with `prettier` if the given option is not inferrable from the
 *  eslintConfig.
 * @param {Boolean} options.prettierLast - Run Prettier Last
 * @return {String} - the formatted string
 */
export default function format(options) {
  const { filePath } = options;

  const tslintFix = createTSLintFix(
    options.tslintConfig,
    options.tslintPath || getModulePath(filePath, "tslint")
  );

  const prettify = createPrettify(
    options.prettierOptions || options.fallbackPrettierOptions || {},
    options.prettierPath || getModulePath(filePath, "prettier")
  );

  const text = options.text || readFileSync(filePath, "utf8");
  return options.prettierLast
    ? prettify(tslintFix(text, filePath), filePath)
    : tslintFix(prettify(text, filePath), filePath);
}

function createPrettify(formatOptions, prettierPath) {
  const prettier = requireModule(prettierPath);
  return function prettify(text, filePath) {
    return prettier.format(
      text,
      Object.assign(
        {},
        formatOptions,
        getPrettierConfig(filePath),
        filePath && { filepath: filePath }
      )
    );
  };
}

function createTSLintFix(defaultLintConfig, tslintPath) {
  const tslint = requireModule(tslintPath);
  const { findConfiguration } = tslint.Configuration;

  // Adapted from: https://github.com/palantir/tslint/blob/5.12.0/src/linter.ts
  return function tslintFix(text, filePath) {
    // TODO: Use the "fix" option of `new tslint.Linter()` once the following
    // issue is triaged: https://github.com/palantir/tslint/issues/4411
    const linter = new tslint.Linter({
      fix: false, // Disabled to avoid file operations.
      formatter: "json",
    });

    const lintConfig = Object.assign(
      {},
      defaultLintConfig,
      findConfiguration(null, filePath).results
    );

    linter.lint(filePath, text, lintConfig);
    const { failures } = linter.getResult();
    if (!failures.length) {
      return text;
    }

    // This is a private method, but we're using it as a workaround.
    const enabledRules = linter.getEnabledRules(
      lintConfig,
      extname(filePath) === ".js"
    );

    // To keep rules from interfering with one another, we apply their fixes one
    // rule at a time. More info: https://github.com/azz/prettier-tslint/issues/26
    return enabledRules.reduce((text, rule) => {
      const { ruleName } = rule.getOptions();
      const hasFix = f => f.hasFix() && f.getRuleName() === ruleName;
      if (failures.some(hasFix)) {
        const sourceFile = tslint.getSourceFile(filePath, text);
        const fixableFailures = tslint
          .removeDisabledFailures(sourceFile, rule.apply(sourceFile))
          .filter(f => f.hasFix());

        if (fixableFailures.length) {
          const fixes = fixableFailures.map(f => f.getFix());
          return tslint.Replacement.applyFixes(text, fixes);
        }
      }
      return text;
    }, text);
  };
}
