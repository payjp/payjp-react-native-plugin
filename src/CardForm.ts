import { NativeModules, NativeEventEmitter } from "react-native";
import { Token } from "./models";

const { PayjpCardForm } = NativeModules;

const cardFormEventEmitter = new NativeEventEmitter(PayjpCardForm);

type OnCardFormCanceled = () => void;
type OnCardFormCompleted = () => void;
type OnCardFormProducedToken = (token: Token) => void;

type OnCardFormUpdateObserver = {
    /**
     * カードフォームがキャンセルされたとき
     */
    onCardFormCanceled: OnCardFormCanceled;
    /**
     * カードフォームが完了したとき
     */
    onCardFormCompleted: OnCardFormCompleted;
    /**
     * カードフォームでトークンが生成されたとき
     */
    onCardFormProducedToken: OnCardFormProducedToken;
};

const onCardFormCanceledSet: Set<OnCardFormCanceled> = new Set();
const onCardFormCompletedSet: Set<OnCardFormCompleted> = new Set();
const onCardFormProducedTokenSet: Set<OnCardFormProducedToken> = new Set();

/**
 * カードフォームを開始します。
 * 更新を受け取るには `onCardFormUpdate` にリスナーを登録してください。
 *
 * @param tenantId PAY.JP Platform Marketplace 利用の場合のみ必要です (cf. https://pay.jp/docs/platform-tenant-checkout ).
 */
export const startCardForm = async (tenantId?: string): Promise<void> => {
    await PayjpCardForm.startCardForm(tenantId);
};

/**
 * カードフォーム画面を閉じます。
 */
export const completeCardForm = async (): Promise<void> => {
    await PayjpCardForm.completeCardForm();
};

/**
 * カードフォーム画面を終了せずにエラーメッセージを表示します。
 *
 * @param message エラーメッセージ
 */
export const showTokenProcessingError = async (message: string): Promise<void> => {
    await PayjpCardForm.showTokenProcessingError(message);
};

/**
 * カードフォームの更新を受け取ります。
 *
 * @param options カードフォームの更新を受け取るリスナー
 * @returns unsubscribe function リスナーを解除する（多くの場合アンマウント時にコールする）関数
 */
export const onCardFormUpdate = (observer: OnCardFormUpdateObserver): (() => void) => {
    const { onCardFormCanceled, onCardFormCompleted, onCardFormProducedToken } = observer;
    const unsubscribeNative = connectCardForm();
    onCardFormCanceledSet.add(onCardFormCanceled);
    onCardFormCompletedSet.add(onCardFormCompleted);
    onCardFormProducedTokenSet.add(onCardFormProducedToken);
    return (): void => {
        unsubscribeNative();
        onCardFormCanceledSet.delete(onCardFormCanceled);
        onCardFormCompletedSet.delete(onCardFormCompleted);
        onCardFormProducedTokenSet.delete(onCardFormProducedToken);
    };
};

const connectCardForm = (): (() => void) => {
    const onCardFormCanceled = cardFormEventEmitter.addListener("onCardFormCanceled", () => {
        onCardFormCanceledSet.forEach(observer => observer());
    });
    const onCardFormCompleted = cardFormEventEmitter.addListener("onCardFormCompleted", () => {
        onCardFormCompletedSet.forEach(observer => observer());
    });
    const onCardFormProducedToken = cardFormEventEmitter.addListener("onCardFormProducedToken", token => {
        onCardFormProducedTokenSet.forEach(observer => observer(token));
    });
    return (): void => {
        onCardFormCanceled.remove();
        onCardFormCompleted.remove();
        onCardFormProducedToken.remove();
    };
};
