import { NativeModules, NativeEventEmitter } from "react-native";
import { Token } from "./models";

type ErrorInfo = {
    errorType: string;
    errorCode: number;
    errorMessage: string;
};

type OnApplePayProducedToken = (token: Token) => void;
type OnApplePayFailedRequestToken = (errorInfo: ErrorInfo) => void;
type OnApplePayCompleted = () => void;

type OnApplePayUpdateObserver = {
    /**
     * PAY.JPトークンが生成されたときのリスナー
     */
    onApplePayProducedToken: OnApplePayProducedToken;
    /**
     * トークンのリクエストに失敗したときのリスナー
     */
    onApplePayFailedRequestToken: OnApplePayFailedRequestToken;
    /**
     * Apple Payが完了したときのリスナー
     */
    onApplePayCompleted: OnApplePayCompleted;
};

/**
 * Apple Payで支払いをリクエストするときに必要な情報
 * @see https://developer.apple.com/documentation/passkit/pkpaymentrequest
 */
type ApplePayAuthorizationOption = {
    /**
     * AppleのMerchantId
     * 例: `merchant.com.example.www`
     */
    appleMerchantId: string;
    /**
     * 通貨を表す(ISO 4217)
     * 例: `JPY`
     */
    currencyCode: string;
    /**
     * 国を表すコード(ISO 3166)
     * 例: `JP`
     */
    countryCode: string;
    /**
     * 表示されるサマリーアイテムの名前
     */
    summaryItemLabel: string;
    /**
     * 表示されるサマリーアイテムの金額
     */
    summaryItemAmount: string;
    /**
     * 住所を要求するかどうか
     */
    requiredBillingAddress?: boolean;
};

const { PayjpApplePay } = NativeModules;
const applePayEventEmitter = new NativeEventEmitter(PayjpApplePay);
const onApplePayProducedTokenSet: Set<OnApplePayProducedToken> = new Set();
const onApplePayFailedRequestTokenSet: Set<OnApplePayFailedRequestToken> = new Set();
const onApplePayCompletedSet: Set<OnApplePayCompleted> = new Set();

/**
 * ApplePayが利用可能かどうか
 */
export const isApplePayAvailable = async (): Promise<boolean> => {
    return PayjpApplePay.isApplePayAvailable();
};

/**
 * Apple Payの支払い認証フローを開始します。
 * AppleのMerchant IDが必要です。
 * フローの更新イベントを受け取るには、`onApplePayUpdate` にリスナーを登録してください。
 *
 * @param option Apple PayのPaymentRequestに必要な情報
 */
export const makeApplePayToken = async (option: ApplePayAuthorizationOption): Promise<void> => {
    const filledOption = {
        ...option,
        requiredBillingAddress: option.requiredBillingAddress || false
    };
    await PayjpApplePay.makeApplePayToken(filledOption);
};

/**
 * Apple Payによる支払いフローが成功したかどうかを伝えます。
 * {@link isSuccess} がtrueの場合はそのままApple Payのフローが終了し、
 * falseの場合はエラーUIを表示します。
 *
 * @param isSuccess Apple Payによるオーソリゼーションに成功したか（trueなら成功）
 * @param errorMessage {@link isSuccess} がfalseのときに表示するエラーメッセージ
 */
export const completeApplePay = async (isSuccess: boolean, errorMessage: string | null = null): Promise<void> => {
    await PayjpApplePay.completeApplePay(isSuccess, errorMessage);
};

/**
 * Apple Payの支払いフローの更新を受け取ります。
 * 登録したリスナーを解除するには、返却される関数を実行します。
 *
 * @param observer Apple Payによる支払いフローの更新を受け取るリスナー
 * @returns unsubscribe function リスナーを解除する関数
 */
export const onApplePayUpdate = (observer: OnApplePayUpdateObserver): (() => void) => {
    const { onApplePayProducedToken, onApplePayFailedRequestToken, onApplePayCompleted } = observer;
    const disconnect = connectApplePayEvent();
    onApplePayProducedTokenSet.add(onApplePayProducedToken);
    onApplePayFailedRequestTokenSet.add(onApplePayFailedRequestToken);
    onApplePayCompletedSet.add(onApplePayCompleted);
    return (): void => {
        disconnect();
        onApplePayProducedTokenSet.delete(onApplePayProducedToken);
        onApplePayFailedRequestTokenSet.delete(onApplePayFailedRequestToken);
        onApplePayCompletedSet.delete(onApplePayCompleted);
    };
};

const connectApplePayEvent = (): (() => void) => {
    const onApplePayProducedToken = applePayEventEmitter.addListener("onApplePayProducedToken", token => {
        onApplePayProducedTokenSet.forEach(observer => observer(token));
    });
    const onApplePayFailedRequestToken = applePayEventEmitter.addListener("onApplePayFailedRequestToken", error => {
        onApplePayFailedRequestTokenSet.forEach(observer => observer(error));
    });
    const onApplePayCompleted = applePayEventEmitter.addListener("onApplePayCompleted", () => {
        onApplePayCompletedSet.forEach(observer => observer());
    });
    return (): void => {
        onApplePayProducedToken.remove();
        onApplePayFailedRequestToken.remove();
        onApplePayCompleted.remove();
    };
};
