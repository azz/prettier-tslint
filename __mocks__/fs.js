import path from "path";

const actual = require.requireActual("fs");

let writes = {};

export const statSync = jest.fn(actual.statSync);
export const existsSync = jest.fn(actual.existsSync);

export const writeFileSync = jest.fn((filePath, content) => {
  const relative = path.relative(process.cwd(), filePath);
  writes[relative] = content;
});

export const readFileSync = jest.fn(filePath => {
  const relative = path.relative(process.cwd(), filePath);
  if (writes[relative]) {
    return writes[relative];
  }
  return actual.readFileSync(filePath, "utf8");
});

export const __clear = () => {
  writes = {};
  existsSync.mockClear();
  statSync.mockClear();
  writeFileSync.mockClear();
  readFileSync.mockClear();
};

export default {
  __clear,
  existsSync,
  statSync,
  readFileSync,
  writeFileSync,
};
