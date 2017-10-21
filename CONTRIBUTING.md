# Contributing to `prettier-tslint`

Thanks for contributing to `prettier-tslint`! Here's a quick-start guide.

## Pre-requisites

* [Node.js](nodejs.org) v4 or later installed.
* [`yarn`](https://yarnpkg.com) installed.

## Setup

* Clone this repository:

  ```bash
  git clone https://github.com/azz/prettier-tslint.git
  cd prettier-tslint
  ```

* Install dependencies:

  ```bash
  yarn
  ```

## Development

All of the source code lives in `src/` and the tests are in `test/`.

Tests are written with [jest](http://facebook.github.io/jest/) and can be run
with:

```bash
yarn test
```

All code is linted with [`eslint`](https://eslint.org/) with
[`prettier`](prettier.io) integration. To validate your files, run:

```bash
yarn lint
```

To fix any auto-fixable problems, run:

```bash
yarn lint --fix
```

> With `yarn` before v1, this is `yarn lint -- --fix`
