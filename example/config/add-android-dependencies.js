const { withAppBuildGradle } = require('@expo/config-plugins');

const addDependencyToBuildGradle = (config, dependency) => {
    return withAppBuildGradle(config, config => {
        const buildGradle = config.modResults.contents;

        if (!buildGradle.includes(dependency)) {
            console.log('Adding dependency to build.gradle');
            const dependencyBlock = 'dependencies {';
            const updatedBuildGradle = buildGradle.replace(
                dependencyBlock,
                `${dependencyBlock}\n    implementation '${dependency}'`,
            );
            config.modResults.contents = updatedBuildGradle;
        } else {
            console.log('Dependency already present in build.gradle');
        }

        return config;
    });
};

module.exports = config => {
    // Fix okhttp3 dependencies between Expo and PAY.JP SDK
    const dependency = 'com.squareup.okhttp3:logging-interceptor:4.9.2';

    return addDependencyToBuildGradle(config, dependency);
};
