import nextPlugin from '@next/eslint-plugin-next';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  {
    plugins: {
      '@next/next': nextPlugin,
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
    },
  },
  {
    files: ['next.config.cpanel.js', 'scripts/*.js'],
    rules: {
      'security/detect-non-literal-fs-operation': 'off',
      'security/detect-non-literal-require': 'off',
      'security/detect-object-injection': 'off',
      'no-console': 'off',
      'no-process-exit': 'off',
      'node/no-unpublished-require': 'off',
      'node/no-missing-require': 'off',
    },
  },
  {
    ignores: [
      '.next/**',
      'dist/**',
      'build/**',
      'packages/**',
      'Zoo-Code/**',
      'webpack.optimization.js',
      'src/config/seo.js',
      'src/lib/data/packages-data-1.ts',
      'src/lib/data/packages-data-2.ts',
      'tsconfig.cpanel.json',
    ],
  },
];
