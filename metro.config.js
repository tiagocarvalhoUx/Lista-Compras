const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Disable package exports resolution to prevent Metro from picking up
// ESM .mjs files (e.g. zustand/esm/middleware.mjs) that use import.meta,
// which is invalid in non-ESM (script) web bundles.
// With this disabled, Metro falls back to classic Node resolution (main field),
// which correctly finds the CJS .js versions.
config.resolver.unstable_enablePackageExports = false;

module.exports = withNativeWind(config, { input: './global.css' });
