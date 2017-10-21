# prettier-tslint

Formats your TypeScript using [`prettier`](https://github.com/prettier/prettier)
followed by [`tslint --fix`](https://github.com/palantir/tslint).

[![Travis](https://img.shields.io/travis/azz/prettier-tslint.svg?style=flat-square)](https://travis-ci.org/azz/prettier-tslint)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![npm](https://img.shields.io/npm/v/prettier-tslint.svg?style=flat-square)](https://npmjs.org/prettier-tslint)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

> ⚠️ WIP - check back soon!

## Install

With `npm`:

```bash
npm install --save-dev prettier-tslint
```

Or with `yarn`:

```bash
yarn add --dev prettier-tslint
```

## Confituration

`prettier-tslint` find and will respect:

* `prettier`'s `.prettierrc`, or any other config file such as `package.json`.
* `prettier`'s `.prettierignore` file.
* `tslint`'s `tslint.json`

`prettier-tslint` has no additional configuration.

## CLI

```bash
pretttier-tslint file.ts
```

## API


```js
import format from "prettier-eslint";

format("file.ts");
```

Currently the `format` function will write to disk and not return anything. This behavior **will change** in a minor release before `1.0.0` is released.
