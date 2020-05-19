const prettierOptions = JSON.parse(require('fs').readFileSync('./.prettierrc').toString());

module.exports = {
    "extends": [
        "ringcentral-typescript"
    ],
    "rules": {
        "comma-dangle": [
            "error",
            "never"
        ],
        "import/named": "off",
        "import/no-default-export": "off",
        "no-async-promise-executor": "warn",
        "no-console": "off",
        "no-inner-declarations": "off",
        "no-undef": "off",
        "no-var": "off",
        "no-prototype-builtins": "off",
        "no-restricted-globals": "off",
        "prettier/prettier": ['warn', Object.assign({}, prettierOptions)],
        "prefer-rest-params": "off",
        "prefer-spread": "off",
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-this-alias": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-var-requires": "off",
        "ringcentral/specified-comment-with-task-id": "off",
        "sonarjs/cognitive-complexity": "off",
        "sonarjs/no-identical-functions": "off",
        "sonarjs/no-unused-collection": "off"
    },
    "settings": {
        "react": {
            "version": "16.8.0"
        }
    }
}