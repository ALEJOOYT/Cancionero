const { getDefaultConfig } = require('expo/metro-config');

// Get the default Expo config
const config = getDefaultConfig(__dirname);

// Export the default config without NativeWind modifications
module.exports = config;
