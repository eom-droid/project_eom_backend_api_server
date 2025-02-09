// import globals from "globals";
// import pluginJs from "@eslint/js";
// import tseslint from "typescript-eslint";

// /** @type {import('eslint').Linter.Config[]} */
// export default [
//   {files: ["**/*.{js,mjs,cjs,ts}"]},
//   {languageOptions: { globals: globals.browser }},
//   pluginJs.configs.recommended,
//   ...tseslint.configs.recommended,
// ];

// eslint.config.mjs
import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
  eslint.configs.recommended, // 기본 ESLint 추천 규칙
  {
    files: ["**/*.ts"], // TypeScript 파일만 검사
    languageOptions: {
      parser: tsparser,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      semi: ["error", "always"], // 세미콜론 강제
      quotes: ["error", "single"], // 작은따옴표 사용 강제
      "@typescript-eslint/no-unused-vars": ["warn"], // 사용하지 않는 변수 경고
    },
  },
];
