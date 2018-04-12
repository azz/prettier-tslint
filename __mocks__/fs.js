const path = require("path");
const actualFs = require.requireActual("fs");

let writes = Object.create(null);

const readdirSync = jest.fn(actualFs.readdirSync);
const statSync = jest.fn(actualFs.statSync);

const existsSync = jest.fn(filePath => {
  const relative = path.relative(process.cwd(), filePath);
  if (relative in writes) {
    return true;
  }
  return actualFs.existsSync(filePath);
});

const readFileSync = jest.fn(filePath => {
  const relative = path.relative(process.cwd(), filePath);
  if (relative in writes) {
    return writes[relative];
  }
  return actualFs.readFileSync(filePath, "utf8");
});

const writeFileSync = jest.fn((filePath, content) => {
  const relative = path.relative(process.cwd(), filePath);
  writes[relative] = content;
});

function __clear() {
  writes = Object.create(null);
  readdirSync.mockClear();
  existsSync.mockClear();
  statSync.mockClear();
  readFileSync.mockClear();
  writeFileSync.mockClear();
}

function __setContents(filePath, contents) {
  writes[filePath] = contents;
}

module.exports = Object.assign({}, actualFs, {
  __clear,
  __setContents,
  readdirSync,
  existsSync,
  statSync,
  readFileSync,
  writeFileSync,
});
