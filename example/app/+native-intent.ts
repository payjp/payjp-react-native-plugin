import Constants from 'expo-constants';

// The 3-D Secure redirect URL (expo.extra.payjp.threeDSecureRedirect in app.json) is handled by the
// PAY.JP SDK. Without this, Expo Router also receives the URL as a deep link and navigates to the
// non-existent "/tds/finish" route (the "This screen doesn't exist." screen).
const threeDSecureRedirectUrl: string | undefined = Constants.expoConfig?.extra?.payjp?.threeDSecureRedirect?.url;

export function redirectSystemPath({ path }: { path: string; initial: boolean }): string | null {
    if (threeDSecureRedirectUrl && path.startsWith(threeDSecureRedirectUrl)) {
        // Returning null keeps the app on the current screen.
        return null;
    }
    return path;
}
