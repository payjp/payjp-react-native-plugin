// LICENSE : MIT
import { NativeModules, NativeEventEmitter } from "react-native";
import { Token } from "./models";

/**
 * カードフォームがキャンセルされたときに実行されるリスナー
 */
export type OnCardFormCanceled = () => void;

/**
 * カードフォームが完了したときに実行されるリスナー
 */
export type OnCardFormCompleted = () => void;

/**
 * カードフォームでトークンが生成されたときに実行されるリスナー
 *
 * @param token PAY.JPトークン
 */
export type OnCardFormProducedToken = (token: Token) => void;

/**
 * カードフォームスタイル（iOS用）
 */
export type IOSCardFormStyle = {
    labelTextColor?: RgbaColor | number;
    inputTextColor?: RgbaColor | number;
    errorTextColor?: RgbaColor | number;
    tintColor?: RgbaColor | number;
    inputFieldBackgroundColor?: RgbaColor | number;
    submitButtonColor?: RgbaColor | number;
    highlightColor?: RgbaColor | number;
};

/**
 * RGBAカラー
 */
export type RgbaColor = {
    r: number;
    g: number;
    b: number;
    a?: number;
};

/**
 * カードフォームの表示タイプ
 */
export type CardFormType = "multiLine" | "cardDisplay";

const { RNPAYCardForm } = NativeModules;
const cardFormEventEmitter = new NativeEventEmitter(RNPAYCardForm);
const onCardFormCanceledSet: Set<OnCardFormCanceled> = new Set();
const onCardFormCompletedSet: Set<OnCardFormCompleted> = new Set();
const onCardFormProducedTokenSet: Set<OnCardFormProducedToken> = new Set();

/**
 * カードフォームを開始します。
 * 更新を受け取るには {@link onCardFormUpdate} にリスナーを登録してください。
 *
 * @param tenantId PAY.JP Platform Marketplace 利用の場合のみ必要です (cf. {@link https://pay.jp/docs/platform-tenant-checkout} ).
 * @param cardFormType カードフォームの表示タイプ（デフォルトはmultiLine）
 */
export const startCardForm = async (tenantId?: string, cardFormType?: CardFormType): Promise<void> => {
    await RNPAYCardForm.startCardForm(tenantId, cardFormType);
};

/**
 * カードフォーム画面を閉じます。
 */
export const completeCardForm = async (): Promise<void> => {
    await RNPAYCardForm.completeCardForm();
};

/**
 * カードフォーム画面を終了せずにエラーメッセージを表示します。
 *
 * @param message エラーメッセージ
 */
export const showTokenProcessingError = async (message: string): Promise<void> => {
    await RNPAYCardForm.showTokenProcessingError(message);
};

/**
 * カードフォームのスタイルをセットします。（iOS用）
 *
 * @param style スタイル情報
 */
export const setIOSCardFormStyle = async (style: IOSCardFormStyle): Promise<void> => {
    const styleConverted: { [P in keyof IOSCardFormStyle]: number[] | number } = {};
    for (const key in style) {
        const styleKey = key as keyof IOSCardFormStyle;
        const styleValue = style[styleKey];
        if (typeof styleValue === "number") {
            styleConverted[styleKey] = styleValue;
        } else if (styleValue) {
            styleConverted[styleKey] = [styleValue.r, styleValue.g, styleValue.b, styleValue.a].filter(
                (e) => typeof e === "number" && !Number.isNaN(e)
            ) as number[];
        }
    }
    await RNPAYCardForm.setFormStyle(styleConverted);
};

/**
 * カードフォームの更新を受け取ります。
 * 登録したリスナーを解除するには、返却される関数を実行します。
 *
 * ```typescript
 * const unsubscribe = PayjpCardForm.onCardFormUpdate({
 *   onCardFormCanceled: () => {},
 *   onCardFormCompleted: () => {},
 *   onCardFormProducedToken: token => {}
 * });
 * // when you need to release listener...
 * unsubscribe();
 * ```
 *
 * @param observer カードフォームの更新を受け取るリスナー
 * @returns unsubscribe function リスナーを解除する（多くの場合アンマウント時にコールする）関数
 */
export const onCardFormUpdate = (observer: {
    onCardFormCanceled?: OnCardFormCanceled;
    onCardFormCompleted?: OnCardFormCompleted;
    onCardFormProducedToken: OnCardFormProducedToken;
}): (() => void) => {
    const { onCardFormCanceled, onCardFormCompleted, onCardFormProducedToken } = observer;
    const unsubscribeNative = connectCardForm();
    onCardFormCanceled && onCardFormCanceledSet.add(onCardFormCanceled);
    onCardFormCompleted && onCardFormCompletedSet.add(onCardFormCompleted);
    onCardFormProducedToken && onCardFormProducedTokenSet.add(onCardFormProducedToken);
    return (): void => {
        unsubscribeNative();
        onCardFormCanceled && onCardFormCanceledSet.delete(onCardFormCanceled);
        onCardFormCompleted && onCardFormCompletedSet.delete(onCardFormCompleted);
        onCardFormProducedToken && onCardFormProducedTokenSet.delete(onCardFormProducedToken);
    };
};

const connectCardForm = (): (() => void) => {
    const onCardFormCanceled = cardFormEventEmitter.addListener("onCardFormCanceled", () => {
        onCardFormCanceledSet.forEach((observer) => observer());
    });
    const onCardFormCompleted = cardFormEventEmitter.addListener("onCardFormCompleted", () => {
        onCardFormCompletedSet.forEach((observer) => observer());
    });
    const onCardFormProducedToken = cardFormEventEmitter.addListener("onCardFormProducedToken", (token) => {
        onCardFormProducedTokenSet.forEach((observer) => observer(token));
    });
    return (): void => {
        onCardFormCanceled.remove();
        onCardFormCompleted.remove();
        onCardFormProducedToken.remove();
    };
};
