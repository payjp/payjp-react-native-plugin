import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { PayjpCore } from 'payjp-react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

// TODO: REPLACE WITH YOUR PAY.JP PUBLIC KEY
const PAYJP_PUBLIC_KEY = 'pk_test_0383a1b8f91e8a6e3ea0e2a9';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    useEffect(() => {
        // Set up PAY.JP SDK
        // If you use 3-D Secure, you need to set up the redirect URL and key.
        // Check the PAY.JP dashboard for the redirect URL and key.
        PayjpCore.init({
            publicKey: PAYJP_PUBLIC_KEY,
            debugEnabled: __DEV__,
            threeDSecureRedirect: {
                url: 'jp.pay.example://tds/finish',
                key: 'mobileapp',
            },
        });
    }, []);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <ActionSheetProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                </Stack>
            </ActionSheetProvider>
        </ThemeProvider>
    );
}
