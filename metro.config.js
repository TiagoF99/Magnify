// Change 1 (import the blacklist utility)
// const blacklist = require('metro-config/src/defaults/blacklist');

// module.exports = {
//   transformer: {
//     getTransformOptions: async () => ({
//       transform: {
//         experimentalImportSupport: false,
//         inlineRequires: false,
//       },
//     }),
//   },
//   resolver: {
//     // Change 2 (add 'bin' to assetExts)
//     assetExts: ['bin', 'txt', 'jpg'],
//     sourceExts: ['js', 'json', 'ts', 'tsx', 'jsx'],
//     // Change 3 (add platform_node to blacklist)
//     blacklistRE: blacklist([/platform_node/])
//   },
// };

const {getDefaultConfig} = require('metro-config');

module.exports = (async () => {
  const {
    resolver: {sourceExts, assetExts},
  } = await getDefaultConfig();
  return {
    resolver: {
      assetExts: [assetExts, 'txt', 'xml', 'png', 'jpg', 'pb', 'tflite'],
      sourceExts: [...sourceExts, 'txt', 'xml', 'png', 'jpg', 'pb', 'tflite'],
    },
  };
})();