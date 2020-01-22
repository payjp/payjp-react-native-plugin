// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
    dependency: {
        platforms: {
            ios: {
                podspecPath: path.join(__dirname, "ios", "RNPayjp.podspec")
            }
        }
    }
};
