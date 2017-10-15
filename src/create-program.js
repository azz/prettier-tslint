import ts from "typescript";

const createProgram = filepath => {
  const program = ts.createProgram([filepath], {
    noResolve: true,
    target: ts.ScriptTarget.Latest,
    jsx: "preserve",
  });
  return program;
};

export default createProgram;
