// eslint.config.mjs
import antfu from "@antfu/eslint-config";

export default antfu({
  rules: {
    "unused-imports/no-unused-vars": ["warn"],
    "ts/ban-ts-comment": ["warn"],
    "no-useless-catch": ["warn"],
  },
});
