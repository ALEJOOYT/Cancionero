const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  input: './global.css',
  // Set this to true if you want to use CSS instead of the default PostCSS:
  configPath: 'tailwind.config.js',
});

