const { defineConfig } = require('eslint/config');
const universe = require('eslint-config-universe/flat/native');
const universeNode = require('eslint-config-universe/flat/node');
const universeWeb = require('eslint-config-universe/flat/web');

module.exports = defineConfig([
  {
    ignores: [
      'build',
      'plugin/build',
      'example/ios',
      'example/android',
      'example/.expo',
      'internal',
      'scoped',
    ],
  },
  ...universe,
  ...universeWeb,
  ...universeNode.map((config) => ({ ...config, files: ['**/*.js', '**/*.cjs'] })),
]);
