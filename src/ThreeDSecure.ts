// LICENSE : MIT
import { NativeModules } from 'react-native';

export enum ThreeDSecureProcessStatus {
    COMPLETED = 'completed',

    CANCELED = 'canceled',
}

/**
 * 3Dセキュア処理が成功したときに実行されるリスナー
 *
 * @param status 処理の結果状態
 */
export type OnThreeDSecureProcessSucceeded = (status: ThreeDSecureProcessStatus) => void;

/**
 * 3Dセキュア処理が失敗したときに実行されるリスナー
 *
 * @param error エラー情報
 */
export type OnThreeDSecureProcessFailed = (error: { message: string; code: number }) => void;

const { RNPAYThreeDSecureProcessHandler } = NativeModules;

/**
 * リソースIDを使用して3Dセキュア処理を開始します。
 * 「支払い時」「顧客カードに対する3Dセキュア」の両方に対応しています。
 *
 * @param resourceId charge_xxx（支払い時）またはcus_xxx_car_xxx（顧客カード）形式のリソースID
 * @param onSucceeded 3Dセキュア処理が成功したときに実行されるコールバック
 * @param onFailed 3Dセキュア処理が失敗したときに実行されるコールバック
 */
export const startThreeDSecureProcess = async (
    resourceId: string,
    onSucceeded: OnThreeDSecureProcessSucceeded,
    onFailed: OnThreeDSecureProcessFailed,
): Promise<void> => {
    try {
        const result = await RNPAYThreeDSecureProcessHandler.startThreeDSecureProcess(resourceId);

        if (result.status === 'completed') {
            onSucceeded(ThreeDSecureProcessStatus.COMPLETED);
        } else if (result.status === 'canceled') {
            onSucceeded(ThreeDSecureProcessStatus.CANCELED);
        } else {
            const errorMessage = `Unknown status: ${result.status}`;
            const errorPayload = { message: errorMessage, code: 1 };
            onFailed(errorPayload);
        }
    } catch (nativeError: any) {
        const errorMessage = `Native Code: ${nativeError.code}, Message: ${nativeError.message || 'Unknown error'}`;
        const errorPayload = { message: errorMessage, code: 1 };
        onFailed(errorPayload);
    }
};
