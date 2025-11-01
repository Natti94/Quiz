import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", ".netlify"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^[A-Z_]",
          argsIgnorePattern: "^_|^err$",
          caughtErrors: "none",
        },
      ],
      "no-empty": ["warn", { allowEmptyCatch: true }],
    },
  },
  // Node.js environment for Netlify Functions
  {
    files: ["netlify/functions/**/*.js", "netlify/functions/**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parserOptions: { sourceType: "module" },
    },
    rules: {
      "no-undef": "off",
      "no-empty": "off",
      "no-unused-vars": "off",
    },
  },
]);
