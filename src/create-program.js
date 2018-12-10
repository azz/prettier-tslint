import ts from "typescript";

const createProgram = filepath => {
  const program = ts.createProgram([filepath], {
    noResolve: true,
    target: ts.ScriptTarget.Latest,
    jsx: "preserve",
  });

  // This ensures the `parent` property of every node exists. More info here: https://github.com/Microsoft/TypeScript/issues/14464#issuecomment-284533993
  program.getTypeChecker();

  return program;
};

export default createProgram;
