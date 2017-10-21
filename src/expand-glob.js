import globby from "globby";

const expandGlob = glob => {
  return globby.sync(glob, {
    dot: true,
  });
};

export default expandGlob;
