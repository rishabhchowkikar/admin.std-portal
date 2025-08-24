import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Next.js specific rules - set to warn or off
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "warn", 
      "@next/next/no-page-custom-font": "off",
      "@next/next/no-sync-scripts": "off",
      "@next/next/no-css-tags": "off",
      "@next/next/no-head-element": "warn",
      "@next/next/no-title-in-document-head": "warn",
      
      // React hooks rules
      "react-hooks/rules-of-hooks": "warn",
      "react-hooks/exhaustive-deps": "warn",
      
      // React specific rules
      "react/no-unescaped-entities": "off",
      "react/display-name": "warn",
      "react/jsx-key": "warn",
      
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/ban-ts-comment": "warn",
      
      // General ESLint rules
      "no-unused-vars": "warn",
      "no-console": "warn",
      "prefer-const": "warn",
    },
  },
];

export default eslintConfig;
