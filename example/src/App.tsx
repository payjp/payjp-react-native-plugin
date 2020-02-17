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
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Button,
    Platform,
    processColor
} from "react-native";
import { PayjpCore, PayjpCardForm, Token, PayjpApplePay } from "payjp-react-native";
import { postTokenToBackEnd } from "./SampleApi";
import { IOSCardFormStyle } from "payjp-react-native/lib/src/CardForm";

// TODO: REPLACE WITH YOUR PAY.JP PUBLIC KEY
const PAYJP_PUBLIC_KEY = "pk_test_0383a1b8f91e8a6e3ea0e2a9";
// TODO: REPLACE WITH YOUR APPLE MERCHANT ID
const APPLE_MERCHANT_ID = "merchant.jp.pay.example2";
// Custom iOS CardForm style
const iOSCardFormStyle: IOSCardFormStyle = {
    labelTextColor: {
        r: 0,
        g: 0.4,
        b: 0.8
    },
    inputTextColor: processColor("#004488"),
    submitButtonColor: processColor("#0055ff")
};

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

const onProducedTokenByApplePay = async (token: Token): Promise<void> => {
    try {
        const response = await postTokenToBackEnd(token);
        console.log(response);
        await PayjpApplePay.completeApplePay(true);
    } catch (e) {
        console.warn(e.message);
        await PayjpApplePay.completeApplePay(false, e.message);
    }
};

const onPressApplePay = async (): Promise<void> => {
    const available = await PayjpApplePay.isApplePayAvailable();
    if (available) {
        await PayjpApplePay.makeApplePayToken({
            appleMerchantId: APPLE_MERCHANT_ID,
            currencyCode: "JPY",
            countryCode: "JP",
            summaryItemLabel: "PAY.JP T-shirt",
            summaryItemAmount: "100",
            requiredBillingAddress: false
        });
    } else {
        Alert.alert("Apple Pay", "この端末では利用できません。", [{ text: "OK" }]);
    }
};

const App = (): React.ReactElement => {
    useEffect(() => {
        PayjpCore.init({ publicKey: PAYJP_PUBLIC_KEY });
        if (Platform.OS === "ios") {
            PayjpCardForm.setIOSCardFormStyle(iOSCardFormStyle);
        }
        const unsubscribeCardForm = PayjpCardForm.onCardFormUpdate({
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
        const unsubscribeApplePay =
            Platform.OS == "ios"
                ? PayjpApplePay.onApplePayUpdate({
                      onApplePayCompleted: () => {
                          console.warn("PAY.JP ApplePay completed.");
                      },
                      onApplePayFailedRequestToken: error => {
                          console.warn("error => ", error);
                          PayjpApplePay.completeApplePay(false, error.errorMessage);
                      },
                      onApplePayProducedToken: token => {
                          console.log("PAY.JP token => ", token);
                          onProducedTokenByApplePay(token);
                      }
                  })
                : null;

        return (): void => {
            unsubscribeCardForm();
            unsubscribeApplePay?.();
        };
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
                                Edit <Text style={styles.highlight}>App.tsx</Text> to replace{" "}
                                <Text style={styles.highlight}>PAYJP_PUBLIC_KEY</Text> with your PAY.JP public key.
                            </Text>
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Card Form</Text>
                            <Text style={styles.sectionDescription}>Click following button to start card form.</Text>
                            <Button
                                title="Add Credit Card"
                                onPress={(): void => {
                                    PayjpCardForm.startCardForm();
                                }}
                            />
                        </View>
                        {Platform.OS === "ios" ? (
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Apple Pay</Text>
                                <Text style={styles.sectionDescription}>
                                    Edit <Text style={styles.highlight}>APPLE_MERCHANT_ID</Text> in App.tsx, then start
                                    Apple Pay.
                                </Text>
                                <Button title="Buy with Apple Pay" onPress={onPressApplePay} />
                            </View>
                        ) : null}
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
