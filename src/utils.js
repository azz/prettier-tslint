import requireRelative from "require-relative";
/* import merge from "lodash.merge";

const RULE_DISABLED = {};
const RULE_NOT_CONFIGURED = "RULE_NOT_CONFIGURED";
const ruleValueExists = prettierRuleValue =>
  prettierRuleValue !== RULE_NOT_CONFIGURED &&
  prettierRuleValue !== RULE_DISABLED &&
  typeof prettierRuleValue !== "undefined";
const OPTION_GETTERS = {
  printWidth: {
    ruleValue: rules => getRuleValue(rules, "max-len", "code"),
    ruleValueToPrettierOption(tslintValue, fallbacks) {
      return makePrettierOption("printWidth", tslintValue, fallbacks);
    },
  },
  tabWidth: {
    ruleValue: rules => {
      let value = getRuleValue(rules, "indent");
      if (value === "tab") {
        value = getRuleValue(rules, "max-len", "tabWidth");
      }
      return value;
    },
    ruleValueToPrettierOption(tslintValue, fallbacks) {
      return makePrettierOption("tabWidth", tslintValue, fallbacks);
    },
  },
  singleQuote: {
    ruleValue: rules => getRuleValue(rules, "quotes"),
    ruleValueToPrettierOption(tslintValue, fallbacks) {
      let prettierValue;

      if (tslintValue === "single") {
        prettierValue = true;
      } else if (tslintValue === "double") {
        prettierValue = false;
      } else if (tslintValue === "backtick") {
        prettierValue = false;
      } else {
        prettierValue = tslintValue;
      }

      return makePrettierOption("singleQuote", prettierValue, fallbacks);
    },
  },
  trailingComma: {
    ruleValue: rules => getRuleValue(rules, "comma-dangle", []),
    ruleValueToPrettierOption(tslintValue, fallbacks) {
      let prettierValue;

      if (tslintValue === "never") {
        prettierValue = "none";
      } else if (
        typeof tslintValue === "string" &&
        tslintValue.indexOf("always") === 0
      ) {
        prettierValue = "es5";
      } else if (typeof tslintValue === "object") {
        const { arrays = "", objects = "", functions = "" } = tslintValue;
        const fns = isAlways(functions);
        const es5 = [arrays, objects].some(isAlways);

        if (fns) {
          prettierValue = "all";
        } else if (es5) {
          prettierValue = "es5";
        } else {
          prettierValue = "none";
        }
      } else {
        prettierValue = RULE_NOT_CONFIGURED;
      }

      return makePrettierOption("trailingComma", prettierValue, fallbacks);
    },
  },
  bracketSpacing: {
    ruleValue: rules => getRuleValue(rules, "object-curly-spacing"),
    ruleValueToPrettierOption(tslintValue, fallbacks) {
      let prettierValue;

      if (tslintValue === "never") {
        prettierValue = false;
      } else if (tslintValue === "always") {
        prettierValue = true;
      } else {
        prettierValue = tslintValue;
      }

      return makePrettierOption("bracketSpacing", prettierValue, fallbacks);
    },
  },
  semi: {
    ruleValue: rules => getRuleValue(rules, "semi"),
    ruleValueToPrettierOption(tslintValue, fallbacks) {
      let prettierValue;

      if (tslintValue === "never") {
        prettierValue = false;
      } else if (tslintValue === "always") {
        prettierValue = true;
      } else {
        prettierValue = tslintValue;
      }

      return makePrettierOption("semi", prettierValue, fallbacks);
    },
  },
  useTabs: {
    ruleValue: rules => getRuleValue(rules, "indent"),
    ruleValueToPrettierOption(tslintValue, fallbacks) {
      let prettierValue;

      if (tslintValue === "tab") {
        prettierValue = true;
      } else {
        prettierValue = RULE_NOT_CONFIGURED;
      }

      return makePrettierOption("useTabs", prettierValue, fallbacks);
    },
  },
  jsxBracketSameLine: {
    ruleValue: rules =>
      getRuleValue(rules, "react/jsx-closing-bracket-location", "nonEmpty"),
    ruleValueToPrettierOption(tslintValue, fallbacks) {
      let prettierValue;

      if (tslintValue === "after-props") {
        prettierValue = true;
      } else if (
        tslintValue === "tag-aligned" ||
        tslintValue === "line-aligned" ||
        tslintValue === "props-aligned"
      ) {
        prettierValue = false;
      } else {
        prettierValue = tslintValue;
      }

      return makePrettierOption("jsxBracketSameLine", prettierValue, fallbacks);
    },
  },
  arrowParens: {
    ruleValue: rules => getRuleValue(rules, "arrow-parens"),
    ruleValueToPrettierOption(tslintValue, fallbacks) {
      let prettierValue;

      if (tslintValue === "as-needed") {
        prettierValue = "avoid";
      } else {
        prettierValue = tslintValue;
      }

      return makePrettierOption("arrowParens", prettierValue, fallbacks);
    },
  },
};

export function getPrettierOptionsFromTSLintRules(
  tslintConfig,
  prettierOptions,
  fallbackPrettierOptions
) {
  const { rules } = tslintConfig;
  const prettierPluginOptions = getRuleValue(rules, "prettier/prettier", []);

  if (ruleValueExists(prettierPluginOptions)) {
    prettierOptions = merge({}, prettierPluginOptions, prettierOptions);
  }

  return Object.keys(OPTION_GETTERS).reduce(
    (options, key) =>
      configureOptions(
        prettierOptions,
        fallbackPrettierOptions,
        key,
        options,
        rules
      ),
    prettierOptions
  );
}

// If an TSLint rule that prettier can be configured with is enabled create a
// prettier configuration object that reflects the ESLint rule configuration.
function configureOptions(
  prettierOptions,
  fallbackPrettierOptions,
  key,
  options,
  rules
) {
  const givenOption = prettierOptions[key];
  const optionIsGiven = givenOption !== undefined;

  if (optionIsGiven) {
    options[key] = givenOption;
  } else {
    const { ruleValue, ruleValueToPrettierOption } = OPTION_GETTERS[key];
    const tslintRuleValue = ruleValue(rules);

    const option = ruleValueToPrettierOption(
      tslintRuleValue,
      fallbackPrettierOptions,
      rules
    );

    if (option !== undefined) {
      options[key] = option;
    }
  }

  return options;
}

function extractRuleValue() {
  // XXX: Ignore code coverage for the following else case
  // There are currently no eslint rules which we can infer prettier
  // options from, that have an object option which we don't know how
  // to infer from.

  return undefined;
}

function getRuleValue(rules, name, objPath) {
  const ruleConfig = rules[name];

  if (Array.isArray(ruleConfig)) {
    const [ruleSetting, value] = ruleConfig;

    // If `ruleSetting` is set to disable the ESLint rule don't use `value` as
    // it might be a value provided by an overriden config package e.g. airbnb
    // overriden by config-prettier. The airbnb values are provided even though
    // config-prettier disables the rule. Instead use fallback or prettier
    // default.
    if (ruleSetting === 0 || ruleSetting === "off") {
      return RULE_DISABLED;
    }

    if (typeof value === "object") {
      return extractRuleValue(objPath, name, value);
    } else {
      return value;
    }
  }

  return RULE_NOT_CONFIGURED;
}

function makePrettierOption(prettierRuleName, prettierRuleValue, fallbacks) {
  if (ruleValueExists(prettierRuleValue)) {
    return prettierRuleValue;
  }

  const fallback = fallbacks[prettierRuleName];
  if (typeof fallback !== "undefined") {
    return fallback;
  }

  return undefined;
}

function isAlways(val) {
  return val.indexOf("always") === 0;
} */

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
