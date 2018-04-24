import { readFileSync } from "fs";
import { applyTSLintAllFixes } from "./apply-fixes";
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
  const {
    filePath,
    text = readFileSync(filePath, "utf8"),
    tslintPath = getModulePath(filePath, "tslint"),
    prettierPath = getModulePath(filePath, "prettier"),
    prettierLast,
    fallbackPrettierOptions,
  } = options;

  const tslintConfig = Object.assign(
    {},
    options.tslintConfig,
    getTSLintConfig(filePath, tslintPath)
  );

  const prettierOptions = Object.assign(
    {},
    filePath && { filepath: filePath },
    getPrettierConfig(filePath),
    options.prettierOptions
  );

  const prettify = createPrettify(
    prettierOptions || fallbackPrettierOptions || {},
    prettierPath
  );
  const tslintFix = createTSLintFix(tslintConfig, tslintPath);

  if (prettierLast) {
    return prettify(tslintFix(text, filePath));
  }
  return tslintFix(prettify(text), filePath);
}

function createPrettify(formatOptions, prettierPath) {
  return function prettify(text) {
    const prettier = requireModule(prettierPath);
    try {
      const output = prettier.format(text, formatOptions);
      return output;
    } catch (error) {
      throw error;
    }
  };
}

function createTSLintFix(tslintConfig, tslintPath) {
  return function tslintFix(text, filePath) {
    const tslint = requireModule(tslintPath);
    try {
      const linter = new tslint.Linter({
        fix: false,
        formatter: "json",
      });

      linter.lint(filePath, text, tslintConfig);
      return applyTSLintAllFixes(linter.getResult(), text, tslint);
    } catch (error) {
      throw error;
    }
  };
}

function getTSLintConfig(filePath, tslintPath) {
  const tslint = requireModule(tslintPath);
  try {
    return tslint.Configuration.findConfiguration(null, filePath).results;
  } catch (error) {
    return { rules: {} };
  }
}
