module.exports = {
    root: true,
    extends: ['@react-native', 'eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    settings: { react: { version: '18.2' } },
    plugins: ['@typescript-eslint', 'unused-imports', 'simple-import-sort'],
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                'react-hooks/exhaustive-deps': 'off',
                '@typescript-eslint/no-shadow': 'off',
                'no-console': ['error', { allow: ['warn', 'error'] }],
                'no-shadow': 'off',
                'no-undef': 'off',
                'no-unused-vars': 'off',
                '@typescript-eslint/no-unused-vars': [
                    'warn',
                    { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }
                ],
                'unused-imports/no-unused-imports': 'error',
                'unused-imports/no-unused-vars': [
                    'warn',
                    {
                        vars: 'all',
                        varsIgnorePattern: '^_',
                        args: 'after-used',
                        argsIgnorePattern: '^_'
                    }
                ],
                semi: [2, 'never'],
                'simple-import-sort/imports': 'error',
                'simple-import-sort/exports': 'error'
            }
        }
    ]
}
