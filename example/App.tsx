import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { PayjpCore } from 'payjp-react-native';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import ApplePayScreen from '@/screens/ApplePayScreen';
import CardScreen from '@/screens/CardScreen';

// TODO: REPLACE WITH YOUR PAY.JP PUBLIC KEY
const PAYJP_PUBLIC_KEY = 'pk_test_0383a1b8f91e8a6e3ea0e2a9';

const TABS = [
    { key: 'card', title: 'Card', icon: 'card', Screen: CardScreen },
    { key: 'applepay', title: 'Apple Pay', icon: 'wallet', Screen: ApplePayScreen },
] as const;

type TabKey = (typeof TABS)[number]['key'];

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [loaded] = useFonts({
        SpaceMono: require('./assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        // Set up PAY.JP SDK
        // If you use 3-D Secure, you need to set up the redirect URL and key.
        // Check the PAY.JP dashboard for the redirect URL and key.
        PayjpCore.init({
            publicKey: PAYJP_PUBLIC_KEY,
            debugEnabled: __DEV__,
            // Defined in app.json (expo.extra.payjp.threeDSecureRedirect).
            threeDSecureRedirect: Constants.expoConfig?.extra?.payjp?.threeDSecureRedirect,
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
        <SafeAreaProvider>
            <ActionSheetProvider>
                <Tabs />
            </ActionSheetProvider>
            <StatusBar style="auto" />
        </SafeAreaProvider>
    );
}

function Tabs() {
    const colors = Colors[useColorScheme() === 'dark' ? 'dark' : 'light'];
    const insets = useSafeAreaInsets();
    const [selected, setSelected] = useState<TabKey>('card');

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Keep every screen mounted so that each screen's PAY.JP listeners stay subscribed. */}
            {TABS.map(({ key, Screen }) => (
                <View key={key} style={[styles.screen, key !== selected && styles.hidden]}>
                    <Screen />
                </View>
            ))}
            <View style={[styles.tabBar, { borderTopColor: colors.tabIconDefault, paddingBottom: insets.bottom }]}>
                {TABS.map(({ key, title, icon }) => {
                    const focused = key === selected;
                    const color = focused ? colors.tabIconSelected : colors.tabIconDefault;
                    return (
                        <Pressable
                            key={key}
                            accessibilityRole="tab"
                            accessibilityState={{ selected: focused }}
                            style={styles.tab}
                            onPress={() => setSelected(key)}>
                            <TabBarIcon name={focused ? icon : `${icon}-outline`} color={color} />
                            <Text style={[styles.tabTitle, { color }]}>{title}</Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    screen: {
        flex: 1,
    },
    hidden: {
        display: 'none',
    },
    tabBar: {
        flexDirection: 'row',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 6,
        paddingBottom: 4,
    },
    tabTitle: {
        fontSize: 10,
        marginTop: 2,
    },
});
