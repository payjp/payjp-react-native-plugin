#!/usr/bin/env node

// Runs React Native's setup-apple-spm.js with Expo's autolinking config.
// Expo projects do not install @react-native-community/cli, so the config command must be passed explicitly
// (the same command Expo CLI uses when `experiments.swiftPackageManager` is enabled).
//
//   node scripts/setup-apple-spm.js add --deintegrate --yes

const { spawnSync } = require('child_process');
const path = require('path');

const CONFIG_COMMAND = JSON.stringify([
    'node',
    '--no-warnings',
    '--eval',
    "require('expo/bin/autolinking')",
    'expo-modules-autolinking',
    'react-native-config',
    '--json',
    '--platform',
    'ios',
]);

const appRoot = path.resolve(__dirname, '..');
const script = require.resolve('react-native/scripts/setup-apple-spm', { paths: [appRoot] });
const result = spawnSync(process.execPath, [script, ...process.argv.slice(2), '--config-command', CONFIG_COMMAND], {
    cwd: appRoot,
    stdio: 'inherit',
});
if (result.error) {
    console.error(result.error);
}
process.exit(result.status ?? 1);
