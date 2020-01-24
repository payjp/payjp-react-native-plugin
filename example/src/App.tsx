/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Button } from "react-native";
import { PayjpCore, PayjpCardForm, Token } from "payjp-react-native";
import { postTokenToBackEnd } from "./SampleApi";

// TODO: REPLACE WITH YOUR PAY.JP PUBLIC KEY
const PAYJP_PUBLIC_KEY = "pk_test_0383a1b8f91e8a6e3ea0e2a9";

const onProducedToken = async (token: Token): Promise<void> => {
    try {
        const response = await postTokenToBackEnd(token);
        console.log(response);
        await PayjpCardForm.completeCardForm();
    } catch (e) {
        console.warn(e.message);
        await PayjpCardForm.showTokenProcessingError(e.message);
    }
};

const App = (): React.ReactElement => {
    useEffect(() => {
        PayjpCore.init({ publicKey: PAYJP_PUBLIC_KEY });
        const unsubscribe = PayjpCardForm.onCardFormUpdate({
            onCardFormCanceled: () => {
                console.warn("PAY.JP canceled");
            },
            onCardFormCompleted: () => {
                console.warn("PAY.JP completed");
            },
            onCardFormProducedToken: token => {
                console.log("PAY.JP token => ", token);
                onProducedToken(token);
            }
        });
        return (): void => unsubscribe();
    }, []);

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                    <View style={styles.body}>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Step One</Text>
                            <Text style={styles.sectionDescription}>
                                Edit <Text style={styles.highlight}>App.tsx</Text> to change this screen and then come
                                back to see your edits.
                            </Text>
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Card Form</Text>
                            <Button
                                title="click"
                                onPress={(): void => {
                                    PayjpCardForm.startCardForm();
                                }}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    scrollView: {},
    body: {},
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "600"
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: "400"
    },
    highlight: {
        fontWeight: "700"
    },
    footer: {
        fontSize: 12,
        fontWeight: "600",
        padding: 4,
        paddingRight: 12,
        textAlign: "right"
    }
});

export default App;
