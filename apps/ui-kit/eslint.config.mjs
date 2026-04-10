import baseConfig from '@showcase/eslint-config';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  {
    settings: {
      react: { version: 'detect' },
    },
  },
];
