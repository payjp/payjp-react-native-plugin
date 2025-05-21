import { StyleSheet, TextInput, TouchableOpacity, View, ScrollView, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import { PayjpThreeDSecure } from 'payjp-react-native';
import { Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

export default function ThreeDSecureScreen() {
    const [resourceId, setResourceId] = useState('');
    const [resultMessage, setResultMessage] = useState('');
    const router = useRouter();

    const startThreeDSecure = async () => {
        try {
            if (!resourceId) {
                setResultMessage('リソースIDを入力してください');
                return;
            }

            setResultMessage('3Dセキュア認証を開始します...');
            await PayjpThreeDSecure.startThreeDSecureProcess(
                resourceId,
                status => {
                    if (status === PayjpThreeDSecure.ThreeDSecureProcessStatus.COMPLETED) {
                        setResultMessage('3Dセキュア認証が完了しました');
                        router.push('/tds/finish');
                    } else if (status === PayjpThreeDSecure.ThreeDSecureProcessStatus.CANCELED) {
                        setResultMessage('3Dセキュア認証がキャンセルされました');
                    }
                },
                (error: { message: string; code: number }) => {
                    console.error('3Dセキュア認証が失敗しました', error);
                    setResultMessage(`エラー: ${error.message}`);
                },
            );
        } catch (e: any) {
            console.error('The 3D Secure process promise was rejected:', e);
        }
    };

    const handleChargeTDSLink = () => {
        Linking.openURL('https://pay.jp/docs/charge-tds');
    };

    const handleCustomerCardTDSLink = () => {
        Linking.openURL('https://pay.jp/docs/customer-card-tds');
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <ThemedView style={styles.container}>
                    <ThemedText type="subtitle" style={styles.title}>
                        3Dセキュア
                    </ThemedText>
                    <ThemedView style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="リソースID (charge_xxxまたはcus_xxx_cad_xxx)"
                            value={resourceId}
                            onChangeText={setResourceId}
                        />

                        <TouchableOpacity style={styles.button} onPress={startThreeDSecure}>
                            <ThemedText style={styles.buttonText}>3Dセキュア開始</ThemedText>
                        </TouchableOpacity>

                        {resultMessage ? <ThemedText style={styles.statusText}>{resultMessage}</ThemedText> : null}
                        <ThemedText style={styles.instruction}>
                            1. 下記を参考に、先にサーバーサイドで支払い、または3Dセキュアリクエストを作成してください。
                        </ThemedText>

                        <View style={styles.linkContainer}>
                            <ThemedText style={styles.linkLabel}>支払い作成時の3Dセキュア：</ThemedText>
                            <TouchableOpacity onPress={handleChargeTDSLink}>
                                <ThemedText style={styles.urlText}>https://pay.jp/docs/charge-tds</ThemedText>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.linkContainer}>
                            <ThemedText style={styles.linkLabel}>顧客カードに対する3Dセキュア：</ThemedText>
                            <TouchableOpacity onPress={handleCustomerCardTDSLink}>
                                <ThemedText style={styles.urlText}>https://pay.jp/docs/customer-card-tds</ThemedText>
                            </TouchableOpacity>
                        </View>

                        <ThemedText style={styles.instruction}>
                            2. 作成したリソースのIDを上記に入力して3Dセキュアを開始してください。
                        </ThemedText>

                        <ThemedText style={styles.instruction}>
                            3.
                            立ち上がった画面が閉じ、認証が終了したら、ドキュメントを参考にサーバーサイドにて結果を確認してください。
                        </ThemedText>
                    </ThemedView>
                </ThemedView>
            </ScrollView>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    formContainer: {
        gap: 20,
    },
    instruction: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 4,
    },
    linkContainer: {
        marginBottom: 8,
    },
    linkLabel: {
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fff',
        fontSize: 14,
        marginVertical: 8,
    },
    button: {
        backgroundColor: '#4287f5',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    urlText: {
        color: '#4287f5',
        textDecorationLine: 'underline',
    },
    statusText: {
        marginTop: 8,
        color: '#f44336',
    },
});
