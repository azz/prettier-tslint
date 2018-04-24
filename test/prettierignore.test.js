jest.mock("fs");

import fs from "fs";
import check from "../src/check";
import fix from "../src/fix";

describe(".prettierignore", () => {
  beforeAll(() => {
    fs.__setContents(".prettierignore", "ignored.ts\n");
  });
  afterAll(fs.__clear);

  test("check() returns null when file is ignored", () => {
    expect(check("test/fixture/ignored/ignored.ts")).toBeNull();
  });
  test("check() returns false when file is not ignored", () => {
    expect(check("test/fixture/ignored/not-ignored.ts")).toEqual(true);
  });

  test("fix() returns null when file is ignored", () => {
    expect(fix("test/fixture/ignored/ignored.ts")).toBeNull();
  });
  test("fix() returns false when file is not ignored", () => {
    expect(fix("test/fixture/ignored/not-ignored.ts")).toEqual(true);
  });
});
