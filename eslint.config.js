import nextPlugin from '@next/eslint-plugin-next';

import baseConfig from '../../eslint.config.js';

export default [
  ...baseConfig,
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['next.config.cpanel.js', 'scripts/*.js'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.cpanel.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Ignore security warnings for deployment scripts
      'security/detect-non-literal-fs-operation': 'off',
      'security/detect-non-literal-require': 'off',
      'security/detect-object-injection': 'off',
      
      // Allow console.log in deployment scripts
      'no-console': 'off',
      
      // Allow process.exit in deployment scripts
      'no-process-exit': 'off',
      
      // Allow non-literal fs operations for deployment utilities
      'node/no-unpublished-require': 'off',
      'node/no-missing-require': 'off'
    },
  },
  {
    ignores: [
      '.next/**',
      'dist/**',
      'build/**',
      'webpack.optimization.js',
      'src/config/seo.js',
      'src/lib/data/packages-data-1.ts',
      'src/lib/data/packages-data-2.ts',
      'tsconfig.cpanel.json'
    ],
  },
];
