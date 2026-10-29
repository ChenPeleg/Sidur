import tseslint from "typescript-eslint";
import prettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
    {
        ignores: ["build/**", "dist/**", "coverage/**", "node_modules/**"],
    },
    ...tseslint.configs.recommended,
    prettierRecommended,
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
        rules: {
            "prettier/prettier": "warn",
        },
    }
);