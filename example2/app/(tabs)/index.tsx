import { Image, StyleSheet, Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect } from 'react';
import { PayjpCardForm, Token } from 'payjp-react-native';
import { postTokenToBackEnd } from '../SampleApi';

const onProducedToken = async (token: Token): Promise<void> => {
    try {
        const response = await postTokenToBackEnd(token);
        console.log(response);
        await PayjpCardForm.completeCardForm();
    } catch (e: any) {
        console.warn(e.message);
        await PayjpCardForm.showTokenProcessingError(e.message);
    }
};

export default function HomeScreen() {
    useEffect(() => {
        const unsubscribeCardForm = PayjpCardForm.onCardFormUpdate({
            onCardFormCanceled: () => {
                console.warn('PAY.JP canceled');
            },
            onCardFormCompleted: () => {
                console.warn('PAY.JP completed');
            },
            onCardFormProducedToken: token => {
                console.log('PAY.JP token => ', token);
                onProducedToken(token);
            },
        });

        return (): void => {
            unsubscribeCardForm();
        };
    }, []);
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={<Image source={require('@/assets/images/partial-react-logo.png')} style={styles.reactLogo} />}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">PAY.JP React Native Plugin Sample</ThemedText>
                <HelloWave />
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Step 1: Set Public Key</ThemedText>
                <ThemedText>
                    Edit <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText> to see changes. Replace{' '}
                    <ThemedText type="defaultSemiBold">PAYJP_PUBLIC_KEY</ThemedText> with your PAY.JP public key.
                </ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Step 2: Card Form</ThemedText>
                <ThemedText>Click following button to start card form.</ThemedText>
                <Button
                    testID="start_card_form"
                    title="Add Credit Card（MultiLine）"
                    onPress={(): void => {
                        PayjpCardForm.startCardForm();
                    }}
                />
                <Button
                    title="Add Credit Card（CardDisplay）"
                    onPress={(): void => {
                        PayjpCardForm.startCardForm({ cardFormType: 'cardDisplay' });
                    }}
                />
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});
