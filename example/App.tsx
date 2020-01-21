/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from "react";
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar } from "react-native";
import { hello } from "payjp-react-native";

const App = (): React.ReactElement => {
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
                            <Text style={styles.sectionTitle}>OS Version</Text>
                            <Text style={styles.sectionDescription}>{hello()}</Text>
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
