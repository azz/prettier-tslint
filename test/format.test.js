import format from "../src/format";

describe("format()", () => {
  test("good format, bad lint passes format", () => {
    expect(
      format({
        filePath: "test/fixture/good-format-bad-lint.ts",
      })
    ).toMatchSnapshot();
  });

  test("bad format, good lint passes format", () => {
    expect(
      format({
        filePath: "test/fixture/bad-format-good-lint.ts",
      })
    ).toMatchSnapshot();
  });

  test("bad format, bad lint passes format", () => {
    expect(
      format({
        filePath: "test/fixture/bad-format-bad-lint.ts",
      })
    ).toMatchSnapshot();
  });

  test("good format, good lint passes format", () => {
    expect(
      format({
        filePath: "test/fixture/good-format-good-lint.ts",
      })
    ).toMatchSnapshot();
  });

  test("no-unnecessary-type-assertion format, which is required type infomation", () => {
    expect(
      format({
        filePath: "test/fixture/no-unnecessary-type-assertion.ts",
      })
    ).toMatchSnapshot();
  });

  test("prefer-readonly format, which is required type infomation", () => {
    expect(
      format({
        filePath: "test/fixture/prefer-readonly.ts",
      })
    ).toMatchSnapshot();
  });

  test("bad format, bad lint. with 'prettierLast' of false value whould not pass format", () => {
    expect(
      format({
        filePath: "test/fixture/bad-format-bad-lint.ts",
        prettierLast: false,
      })
    ).toMatchSnapshot();
  });
});
