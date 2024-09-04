import React, { useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, Button, StyleSheet, Platform } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { PayjpApplePay, Token } from 'payjp-react-native';
import { postTokenToBackEnd } from '../SampleApi';

// TODO: REPLACE WITH YOUR APPLE MERCHANT ID
const APPLE_MERCHANT_ID = 'merchant.jp.pay.example2';

const onProducedTokenByApplePay = async (token: Token): Promise<void> => {
    try {
        const response = await postTokenToBackEnd(token);
        console.log(response);
        await PayjpApplePay.completeApplePay(true);
    } catch (e: any) {
        console.warn(e.message);
        await PayjpApplePay.completeApplePay(false, e.message);
    }
};

export default function TabTwoScreen() {
    useEffect(() => {
        const unsubscribeApplePay =
            Platform.OS === 'ios'
                ? PayjpApplePay.onApplePayUpdate({
                      onApplePayCompleted: () => {
                          console.warn('PAY.JP ApplePay completed.');
                      },
                      onApplePayFailedRequestToken: error => {
                          console.warn('error => ', error);
                          PayjpApplePay.completeApplePay(false, error.errorMessage);
                      },
                      onApplePayProducedToken: token => {
                          console.log('PAY.JP token => ', token);
                          onProducedTokenByApplePay(token);
                      },
                  })
                : null;

        return (): void => {
            unsubscribeApplePay?.();
        };
    }, []);
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Apple Pay</ThemedText>
            </ThemedView>
            <ThemedText>
                Edit <ThemedText type="defaultSemiBold">APPLE_MERCHANT_ID</ThemedText> in app/(tabs)/applepay.tsx, then
                start Apple Pay.
            </ThemedText>
            {Platform.select({
                ios: <Button title="Buy with Apple Pay" onPress={onPressApplePay} />,
                android: <ThemedText>Apple Pay is only iOS available.</ThemedText>,
            })}
        </ParallaxScrollView>
    );
}

const onPressApplePay = async (): Promise<void> => {
    const available = await PayjpApplePay.isApplePayAvailable();
    if (available) {
        await PayjpApplePay.makeApplePayToken({
            appleMerchantId: APPLE_MERCHANT_ID,
            currencyCode: 'JPY',
            countryCode: 'JP',
            summaryItemLabel: 'PAY.JP T-shirt',
            summaryItemAmount: '100',
            requiredBillingAddress: false,
        });
    } else {
        Alert.alert('Apple Pay', 'この端末では利用できません。', [{ text: 'OK' }]);
    }
};

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});
