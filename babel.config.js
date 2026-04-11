module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    ],
    plugins: [
      // Transforms import.meta → commonjs-compatible equivalent
      // Required because zustand's devtools middleware uses import.meta.env
      // which causes SyntaxError in non-ESM (script) bundles
      'babel-plugin-transform-import-meta',
      'react-native-reanimated/plugin', // must be last
    ],
  };
};
