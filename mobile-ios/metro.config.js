const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// TanStack Query's package "exports" send Metro to build/modern/*.js.
// Those explicit .js imports fail to resolve on Windows. Disable exports so
// Metro uses the "react-native" field (src/index.ts) instead.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
