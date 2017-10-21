import path from "path";

const actual = require.requireActual("fs");

let writes = Object.create(null);

export const readdirSync = jest.fn(actual.readdirSync);
export const statSync = jest.fn(actual.statSync);

export const existsSync = jest.fn(filePath => {
  const relative = path.relative(process.cwd(), filePath);
  if (relative in writes) {
    return true;
  }
  return actual.existsSync(filePath);
});

export const writeFileSync = jest.fn((filePath, content) => {
  const relative = path.relative(process.cwd(), filePath);
  writes[relative] = content;
});

export const readFileSync = jest.fn(filePath => {
  const relative = path.relative(process.cwd(), filePath);
  if (relative in writes) {
    return writes[relative];
  }
  return actual.readFileSync(filePath, "utf8");
});

export const __clear = () => {
  writes = Object.create(null);
  readdirSync.mockClear();
  existsSync.mockClear();
  statSync.mockClear();
  writeFileSync.mockClear();
  readFileSync.mockClear();
};

export const __setContents = (filePath, contents) => {
  writes[filePath] = contents;
};

export default {
  __clear,
  __setContents,
  existsSync,
  statSync,
  readFileSync,
  writeFileSync,
};
