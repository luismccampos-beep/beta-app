import nextPlugin from '@next/eslint-plugin-next';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

// jsx-a11y recommended rules tailored for this project
const a11yRules = {
  'jsx-a11y/alt-text': 'error',
  'jsx-a11y/anchor-is-valid': 'error',
  'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
  'jsx-a11y/aria-props': 'error',
  'jsx-a11y/aria-proptypes': 'error',
  'jsx-a11y/aria-role': 'error',
  'jsx-a11y/aria-unsupported-elements': 'error',
  'jsx-a11y/autocomplete-valid': 'error',
  'jsx-a11y/click-events-have-key-events': 'warn',
  'jsx-a11y/heading-has-content': 'warn',
  'jsx-a11y/html-has-lang': 'error',
  'jsx-a11y/iframe-has-title': 'error',
  'jsx-a11y/img-redundant-alt': 'error',
  'jsx-a11y/interactive-supports-focus': ['error', {
    tabbable: ['button', 'checkbox', 'link', 'searchbox', 'spinbutton', 'switch', 'textbox'],
  }],
  'jsx-a11y/label-has-associated-control': 'warn',
  'jsx-a11y/media-has-caption': 'warn',
  'jsx-a11y/mouse-events-have-key-events': 'error',
  'jsx-a11y/no-access-key': 'error',
  'jsx-a11y/no-autofocus': ['warn', { ignoreNonDOM: true }],
  'jsx-a11y/no-distracting-elements': 'error',
  'jsx-a11y/no-interactive-element-to-noninteractive-role': ['error', {
    tr: ['none', 'presentation'],
    canvas: ['img'],
  }],
  'jsx-a11y/no-noninteractive-element-interactions': ['warn', {
    handlers: ['onClick', 'onError', 'onLoad', 'onMouseDown', 'onMouseUp', 'onKeyPress', 'onKeyDown', 'onKeyUp'],
    body: ['onError', 'onLoad'],
    iframe: ['onError', 'onLoad'],
    img: ['onError', 'onLoad'],
  }],
  'jsx-a11y/no-noninteractive-element-to-interactive-role': ['error', {
    ul: ['listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree', 'treegrid'],
    ol: ['listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree', 'treegrid'],
    li: ['menuitem', 'menuitemradio', 'menuitemcheckbox', 'option', 'row', 'tab', 'treeitem'],
    table: ['grid'],
    td: ['gridcell'],
  }],
  'jsx-a11y/no-noninteractive-tabindex': ['error', {
    tags: [],
    roles: ['tabpanel'],
    allowExpressionValues: true,
  }],
  'jsx-a11y/no-redundant-roles': 'error',
  'jsx-a11y/no-static-element-interactions': ['error', {
    allowExpressionValues: true,
    handlers: ['onClick', 'onMouseDown', 'onMouseUp', 'onKeyPress', 'onKeyDown', 'onKeyUp'],
  }],
  'jsx-a11y/role-has-required-aria-props': 'error',
  'jsx-a11y/role-supports-aria-props': 'error',
  'jsx-a11y/scope': 'error',
  'jsx-a11y/tabindex-no-positive': 'error',
  // Off — deprecated in favour of label-has-associated-control
  'jsx-a11y/label-has-for': 'off',
  // Off — rare edge case, noisy on icon buttons
  'jsx-a11y/control-has-associated-label': 'off',
  // Off — too broad for existing codebase; remediate incrementally
  'jsx-a11y/anchor-ambiguous-text': 'off',
};

export default [
  {
    plugins: {
      '@next/next': nextPlugin,
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      ...a11yRules,
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
    },
  },
  {
    files: ['next.config.cpanel.js', 'scripts/*.js', 'scripts/*.mjs'],
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
      'test-results/**',
      'playwright-report/**',
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
