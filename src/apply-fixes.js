export function applyTSLintAllFixes(linterResults, source, tslint) {
  const fixes = [];
  linterResults.failures.forEach(failure => {
    if (failure.hasFix()) {
      fixes.push(failure.getFix());
    }
  });

  return tslint.Replacement.applyFixes(source, fixes);
}
