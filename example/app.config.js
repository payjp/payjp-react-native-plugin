// Base config lives in app.json. This file only switches the iOS dependency manager.
//
//   yarn prebuild:ios      -> CocoaPods (default)
//   yarn prebuild:ios:spm  -> Swift Package Manager (experimental, Expo SDK 58+ / React Native 0.88+)
//
// Set PAYJP_IOS_SPM=1 for every prebuild while the generated ios/ project uses Swift Package Manager.
// Expo CLI refuses to prebuild an SPM-based ios/ project without experiments.swiftPackageManager.
module.exports = ({ config }) => {
    if (process.env.PAYJP_IOS_SPM !== '1') {
        return config;
    }
    return {
        ...config,
        experiments: {
            ...config.experiments,
            swiftPackageManager: true,
        },
    };
};
