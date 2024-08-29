// LICENSE : MIT
import {NativeModules, NativeEventEmitter} from 'react-native';
import {Token} from './models';

/**
 * エラー情報
 */
export type ErrorInfo = {
    errorType: string;
    errorCode: number;
    errorMessage: string;
};

/**
 * PAY.JPトークンが生成されたときのリスナー
 * @param token PAY.JPトークン
 */
export type OnApplePayProducedToken = (token: Token) => void;

/**
 * トークンのリクエストに失敗したときのリスナー
 * @param errorInfo エラー情報
 */
export type OnApplePayFailedRequestToken = (errorInfo: ErrorInfo) => void;

/**
 * Apple Payが完了したときのリスナー
 */
export type OnApplePayCompleted = () => void;

/**
 * Apple Payで支払いをリクエストするときに必要な情報
 * @see {@link https://developer.apple.com/documentation/passkit/pkpaymentrequest}
 */
export type ApplePayAuthorizationOption = {
    /**
     * AppleのMerchantId
     * 例: `merchant.com.example.www`
     */
    readonly appleMerchantId: string;
    /**
     * 通貨を表す(ISO 4217)
     * 例: `JPY`
     */
    readonly currencyCode: string;
    /**
     * 国を表すコード(ISO 3166)
     * 例: `JP`
     */
    readonly countryCode: string;
    /**
     * 表示されるサマリーアイテムの名前
     */
    readonly summaryItemLabel: string;
    /**
     * 表示されるサマリーアイテムの金額
     */
    readonly summaryItemAmount: string;
    /**
     * 住所を要求するかどうか
     */
    readonly requiredBillingAddress?: boolean;
};

const {RNPAYApplePay} = NativeModules;
const applePayEventEmitter = new NativeEventEmitter(RNPAYApplePay);
const onApplePayProducedTokenSet: Set<OnApplePayProducedToken> = new Set();
const onApplePayFailedRequestTokenSet: Set<OnApplePayFailedRequestToken> = new Set();
const onApplePayCompletedSet: Set<OnApplePayCompleted> = new Set();

/**
 * ApplePayが利用可能かどうか
 *
 * cf. [canMakePayments](https://developer.apple.com/documentation/passkit/pkpaymentauthorizationviewcontroller/1616192-canmakepayments)
 */
export const isApplePayAvailable = async (): Promise<boolean> => {
    return RNPAYApplePay.isApplePayAvailable();
};

/**
 * Apple Payの支払い認証フローを開始します。
 * AppleのMerchant IDが必要です。
 * フローの更新イベントを受け取るには、{@link onApplePayUpdate} にリスナーを登録してください。
 * Apple Payのペイメントシートを閉じるには {@link completeApplePay} を呼ぶ必要があります。
 *
 * @param option Apple PayのPaymentRequestに必要な情報
 */
export const makeApplePayToken = async (option: ApplePayAuthorizationOption): Promise<void> => {
    const filledOption = {
        ...option,
        requiredBillingAddress: option.requiredBillingAddress || false,
    };
    await RNPAYApplePay.makeApplePayToken(filledOption);
};

/**
 * Apple Payによる支払いの成功可否を伝え、支払いフローを完了させます。
 * `isSuccess` がtrueの場合は成功の、falseの場合はエラーのUIを表示します。
 *
 * @param isSuccess Apple Payによるオーソリゼーションに成功したか（trueなら成功）
 * @param errorMessage エラーメッセージ
 */
export const completeApplePay = async (isSuccess: boolean, errorMessage: string | null = null): Promise<void> => {
    await RNPAYApplePay.completeApplePay(isSuccess, errorMessage);
};

/**
 * Apple Payの支払いフローの更新を受け取ります。
 * 登録したリスナーを解除するには、返却される関数を実行します。
 *
 * @param observer Apple Payによる支払いフローの更新を受け取るリスナー
 * @returns unsubscribe function リスナーを解除する関数
 */
export const onApplePayUpdate = (observer: {
    onApplePayProducedToken: OnApplePayProducedToken;
    onApplePayFailedRequestToken: OnApplePayFailedRequestToken;
    onApplePayCompleted?: OnApplePayCompleted;
}): (() => void) => {
    const {onApplePayProducedToken, onApplePayFailedRequestToken, onApplePayCompleted} = observer;
    const disconnect = connectApplePayEvent();
    onApplePayProducedToken && onApplePayProducedTokenSet.add(onApplePayProducedToken);
    onApplePayFailedRequestToken && onApplePayFailedRequestTokenSet.add(onApplePayFailedRequestToken);
    onApplePayCompleted && onApplePayCompletedSet.add(onApplePayCompleted);
    return (): void => {
        disconnect();
        onApplePayProducedToken && onApplePayProducedTokenSet.delete(onApplePayProducedToken);
        onApplePayFailedRequestToken && onApplePayFailedRequestTokenSet.delete(onApplePayFailedRequestToken);
        onApplePayCompleted && onApplePayCompletedSet.delete(onApplePayCompleted);
    };
};

const connectApplePayEvent = (): (() => void) => {
    const onApplePayProducedToken = applePayEventEmitter.addListener('onApplePayProducedToken', token => {
        onApplePayProducedTokenSet.forEach(observer => observer(token));
    });
    const onApplePayFailedRequestToken = applePayEventEmitter.addListener('onApplePayFailedRequestToken', error => {
        onApplePayFailedRequestTokenSet.forEach(observer => observer(error));
    });
    const onApplePayCompleted = applePayEventEmitter.addListener('onApplePayCompleted', () => {
        onApplePayCompletedSet.forEach(observer => observer());
    });
    return (): void => {
        onApplePayProducedToken.remove();
        onApplePayFailedRequestToken.remove();
        onApplePayCompleted.remove();
    };
};
