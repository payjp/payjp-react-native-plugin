#!/usr/bin/env node

// Generates ios/ with Swift Package Manager (experimental, Expo SDK 58+ / React Native 0.88+).
//
//   yarn prebuild:ios:spm   generate ios/
//
// Every native library in the example ships its own Package.swift, so no workarounds are needed.
// If a library without a Package.swift is added, `add` stops with "Package.swift is missing for library".

const { spawnSync } = require('child_process');
const path = require('path');

const appRoot = path.resolve(__dirname, '..');
const setupAppleSpm = path.join(__dirname, 'setup-apple-spm.js');
const expoCli = require.resolve('expo/bin/cli', { paths: [appRoot] });

const env = { ...process.env, PAYJP_IOS_SPM: '1' };

const run = (command, args) => {
    console.log(`\n> ${[command, ...args].join(' ')}`);
    const result = spawnSync(command, args, { cwd: appRoot, env, stdio: 'inherit' });
    if (result.error) {
        throw result.error;
    }
    if (result.status !== 0) {
        throw new Error(`Command failed (exit ${result.status ?? result.signal}): ${command} ${args.join(' ')}`);
    }
};

// setup-apple-spm.js uses CocoaPods for `pod deintegrate`.
const assertCocoaPodsInstalled = () => {
    const result = spawnSync('pod', ['--version'], { encoding: 'utf8' });
    if (result.error || result.status !== 0) {
        throw new Error(
            'CocoaPods (`pod`) is required even for the Swift Package Manager setup. Install CocoaPods first.',
        );
    }
};

const main = () => {
    assertCocoaPodsInstalled();
    // --no-install skips Expo's own SwiftPM setup; setup-apple-spm.js below runs it with Expo's autolinking config.
    run(process.execPath, [expoCli, 'prebuild', '--platform', 'ios', '--clean', '--no-install']);
    run(process.execPath, [setupAppleSpm, 'add', '--deintegrate', '--yes']);
};

try {
    main();
} catch (error) {
    console.error(`\n${error.message}`);
    process.exit(1);
}
