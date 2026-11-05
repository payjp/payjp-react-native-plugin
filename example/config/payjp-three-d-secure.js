const { withAndroidManifest } = require('@expo/config-plugins');

// The 3-D Secure redirect URL is defined once in app.json (`expo.extra.payjp.threeDSecureRedirect`).
// Register the same URL in the PAY.JP Dashboard. It is shared by:
//   - this plugin (the iOS URL scheme and the Android intent-filter),
//   - app/_layout.tsx (PayjpCore.init), and
//   - app/+native-intent.ts (keeps Expo Router from opening a not-found screen).
const getRedirectUrl = config => {
    const url = config.extra?.payjp?.threeDSecureRedirect?.url;
    if (!url) {
        throw new Error('expo.extra.payjp.threeDSecureRedirect.url is not defined in app.json');
    }
    return new URL(url);
};

// NOTE:
// To enable 3-D Secure, you must add the custom activity to your AndroidManifest.xml.
// In this example, we use expo config plugins to add the custom activity.
// You can also add the activity directly to your AndroidManifest.xml.
module.exports = function withCustomActivity(config) {
    const redirectUrl = getRedirectUrl(config);
    const redirectScheme = redirectUrl.protocol.replace(/:$/, '');

    // iOS: register the redirect URL scheme (CFBundleURLTypes) so the system can return to the app.
    const schemes = [].concat(config.scheme ?? []);
    if (!schemes.includes(redirectScheme)) {
        config.scheme = [...schemes, redirectScheme];
    }

    return withAndroidManifest(config, async config => {
        const androidManifest = config.modResults;
        const payjpThreeDSecureStepActivity = 'jp.pay.android.verifier.ui.PayjpThreeDSecureStepActivity';

        const customActivityExists = androidManifest.manifest.application[0].activity.some(
            activity => activity.$['android:name'] === payjpThreeDSecureStepActivity,
        );

        if (!customActivityExists) {
            androidManifest.manifest.application[0].activity.push({
                $: {
                    'android:name': payjpThreeDSecureStepActivity,
                    'android:exported': 'true',
                },
                'intent-filter': [
                    {
                        action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
                        category: [
                            { $: { 'android:name': 'android.intent.category.DEFAULT' } },
                            { $: { 'android:name': 'android.intent.category.BROWSABLE' } },
                        ],
                        // 3-D Secure flow will redirect back to your app after the verification process.
                        // Set the scheme, host, and path that you registered in the PAY.JP Dashboard.
                        data: [
                            {
                                $: {
                                    'android:scheme': redirectScheme,
                                    'android:host': redirectUrl.hostname,
                                    'android:path': redirectUrl.pathname,
                                },
                            },
                        ],
                    },
                ],
            });
        }

        return config;
    });
};
