module.exports = {
    root: true,
    extends: ['@react-native', 'eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    plugins: ['@typescript-eslint', 'prettier', 'unused-imports', 'simple-import-sort'],
    overrides: [
        {
            files: ['metro.config.js', 'babel.config.js'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
                '@typescript-eslint/no-require-imports': 'off'
            }
        },
        {
            files: ['src/assets/**/*.ts', 'src/screens/ComposableGameScreen.tsx'],
            rules: { '@typescript-eslint/no-require-imports': 'off' }
        },
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                'prettier/prettier': ['error'],
                'react-hooks/exhaustive-deps': 'off',
                '@typescript-eslint/no-shadow': ['off'],
                'no-console': ['error', { allow: ['warn', 'error'] }],
                'no-shadow': 'off',
                'no-undef': 'off',
                'no-unused-vars': 'off',
                'unused-imports/no-unused-imports': 'error',
                'unused-imports/no-unused-vars': [
                    'warn',
                    {
                        vars: 'all',
                        varsIgnorePattern: '^_',
                        args: 'after-used',
                        argsIgnorePattern: '^_',
                    },
                ],
                semi: [2, 'never'],
                'simple-import-sort/imports': 'error',
                'simple-import-sort/exports': 'error',
            },
        },
    ],
};
