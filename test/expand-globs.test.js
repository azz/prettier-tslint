import * as path from "path";
import expandGlobs from "../src/expand-globs";

describe("expandGlobs()", () => {
  test("fixture1", () => {
    expect(expandGlobs([path.join(__dirname, "./fixture/**/*.ts")])).toEqual([
      path.join(__dirname, "fixture/bad-format-bad-lint.ts"),
      path.join(__dirname, "fixture/bad-format-good-lint.ts"),
      path.join(__dirname, "fixture/good-format-bad-lint.ts"),
      path.join(__dirname, "fixture/good-format-good-lint.ts"),
      path.join(__dirname, "fixture/ignored/ignored.ts"),
      path.join(__dirname, "fixture/ignored/not-ignored.ts"),
    ]);
  });
  test("fixture1 --with-node-modules", () => {
    expect(
      expandGlobs([path.join(__dirname, "./fixture/**/*.ts")], true)
    ).toEqual([
      path.join(__dirname, "fixture/bad-format-bad-lint.ts"),
      path.join(__dirname, "fixture/bad-format-good-lint.ts"),
      path.join(__dirname, "fixture/good-format-bad-lint.ts"),
      path.join(__dirname, "fixture/good-format-good-lint.ts"),
      path.join(__dirname, "fixture/ignored/ignored.ts"),
      path.join(__dirname, "fixture/ignored/not-ignored.ts"),
    ]);
  });

  test("fixture2", () => {
    expect(
      expandGlobs([path.join(__dirname, "./monorepo-fixture/**/*.ts")])
    ).toEqual([
      path.join(__dirname, "monorepo-fixture/src/good-format-bad-lint.ts"),
    ]);
  });

  test("fixture2 --with-node-modules", () => {
    expect(
      expandGlobs([path.join(__dirname, "./monorepo-fixture/**/*.ts")], true)
    ).toEqual([
      path.join(__dirname, "monorepo-fixture/src/good-format-bad-lint.ts"),
      path.join(
        __dirname,
        "monorepo-fixture/packages/node_modules/test1/bad-format-good-lint.ts"
      ),
      path.join(
        __dirname,
        "monorepo-fixture/packages/node_modules/test1/good-format-bad-lint.ts"
      ),
      path.join(
        __dirname,
        "monorepo-fixture/packages/node_modules/@scoped/test2/bad-format-good-lint.ts"
      ),
      path.join(
        __dirname,
        "monorepo-fixture/packages/node_modules/@scoped/test2/good-format-bad-lint.ts"
      ),
    ]);
  });
});
