jest.mock("fs");

import fix from "../src/fix";
import fs from "fs";

const lastCall = fn => {
  return fn.mock.calls[fn.mock.calls.length - 1];
};

describe("fix()", () => {
  beforeEach(() => {
    fs.__clear();
  });

  test("good format, bad lint writes fix to disk", () => {
    fix("test/fixture/good-format-bad-lint.ts");
    expect(lastCall(fs.writeFileSync)).toMatchSnapshot();
  });

  test("bad format, good lint writes fix to disk", () => {
    fix("test/fixture/bad-format-good-lint.ts");
    expect(lastCall(fs.writeFileSync)).toMatchSnapshot();
  });

  test("bad format, bad lint writes fix to disk", () => {
    fix("test/fixture/bad-format-bad-lint.ts");
    expect(lastCall(fs.writeFileSync)).toMatchSnapshot();
  });

  test("good format, good lint writes doesn't write to disk", () => {
    fix("test/fixture/good-format-good-lint.ts");
    expect(fs.writeFileSync).toHaveBeenCalledTimes(0);
  });
});
