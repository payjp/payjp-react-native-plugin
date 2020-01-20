module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:prettier/recommended",
        "prettier/@typescript-eslint",
        "plugin:react/recommended"
    ],
    plugins: ["@typescript-eslint"],
    parser: "@typescript-eslint/parser",
    env: {
        browser: true,
        node: true,
        es6: true
    },
    settings: {
        react: {
            version: "detect"
        }
    },
    parserOptions: {
        sourceType: "module",
        ecmaFeatures: {
            jsx: true
        }
    },
    rules: {
        "@typescript-eslint/no-use-before-define": [
            "error",
            {
                variables: false
            }
        ]
    },
    globals: {
        __DEV__: true
    }
};
