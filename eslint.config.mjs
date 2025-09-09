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
     
     // React hooks rules - Relaxed
     "react-hooks/rules-of-hooks": "warn",
     "react-hooks/exhaustive-deps": "off", // Turn off missing dependency warnings
     
     // React specific rules - Relaxed
     "react/no-unescaped-entities": "off",
     "react/display-name": "off",
     "react/jsx-key": "warn",
     
     // TypeScript rules - Relaxed
     "@typescript-eslint/no-unused-vars": "off", // Turn off unused vars warnings
     "@typescript-eslint/no-explicit-any": "off", // Allow 'any' type
     "@typescript-eslint/no-empty-function": "off",
     "@typescript-eslint/no-empty-object-type": "off", // Allow empty interfaces
     "@typescript-eslint/ban-ts-comment": "off",
     
     // General ESLint rules - Relaxed
     "no-unused-vars": "off", // Turn off unused vars warnings
     "no-console": "off", // Allow console statements
     "prefer-const": "warn",
    },
  },
];

export default eslintConfig;
