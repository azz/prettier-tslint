import check from "../src/check";

describe("check()", () => {
  test("good format, bad lint fails check", () => {
    expect(check("test/fixture/good-format-bad-lint.ts")).toEqual(false);
  });
  test("bad format, good lint fails check", () => {
    expect(check("test/fixture/bad-format-good-lint.ts")).toEqual(false);
  });
  test("bad format, bad lint fails check", () => {
    expect(check("test/fixture/bad-format-bad-lint.ts")).toEqual(false);
  });
  test("good format, good lint passes check", () => {
    expect(check("test/fixture/good-format-good-lint.ts")).toEqual(true);
  });
});
