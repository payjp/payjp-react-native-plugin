import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { hello } from "payjp-react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    }
});

const App = (): React.ReactElement => {
    const greeting = hello();
    return (
        <View style={styles.container}>
            <Text>{greeting}</Text>
        </View>
    );
};

export default App;
