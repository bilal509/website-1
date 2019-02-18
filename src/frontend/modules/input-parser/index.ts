const graphqlObjToArg = require("graphql-obj2arg");

export const inputParser = (object: {}) => {
  return graphqlObjToArg(object, { noOuterBraces: true });
};
