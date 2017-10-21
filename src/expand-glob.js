import globby from "globby";

const expandGlob = glob => {
  return globby.sync(
    [glob].concat(["!**/node_modules/**", "!./node_modules/**"]),
    {
      dot: true,
    }
  );
};

export default expandGlob;
