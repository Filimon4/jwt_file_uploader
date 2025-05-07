import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

export default [
  globalIgnores(['./dist/**']),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["./src/**/*.ts"],

    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
