const { withAndroidManifest } = require('@expo/config-plugins');
// NOTE:
// To enable 3-D Secure, you must add the custom activity to your AndroidManifest.xml.
// In this example, we use expo config plugins to add the custom activity.
// You can also add the activity directly to your AndroidManifest.xml.
module.exports = function withCustomActivity(config) {
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
                                    'android:scheme': 'jp.pay.example',
                                    'android:host': 'tds',
                                    'android:path': '/finish',
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
