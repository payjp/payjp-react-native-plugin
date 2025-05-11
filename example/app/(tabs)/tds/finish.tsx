import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ThreeDSecureFinishScreen() {
    const router = useRouter();

    const handleReturn = () => {
        router.replace('/tds');
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ThemedView style={styles.container}>
                <ThemedView style={styles.resultContainer}>
                    <ThemedText style={styles.resultText}>3Dセキュア認証が終了しました。</ThemedText>
                    <ThemedText>
                        この結果をサーバーサイドに伝え、完了処理や結果のハンドリングをおこなってください。
                    </ThemedText>
                    <TouchableOpacity style={styles.button} onPress={handleReturn}>
                        <ThemedText style={styles.buttonText}>戻る</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 15,
        justifyContent: 'center',
    },
    resultContainer: {
        gap: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 40,
    },
    button: {
        backgroundColor: '#4287f5',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 8,
        minWidth: 200,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    resultText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
});
