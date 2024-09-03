// LICENSE : MIT
import { NativeModules, NativeEventEmitter, ColorValue, processColor, ProcessedColorValue } from 'react-native';
import { Token } from './models';

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
    labelTextColor?: ColorValue;
    inputTextColor?: ColorValue;
    errorTextColor?: ColorValue;
    tintColor?: ColorValue;
    inputFieldBackgroundColor?: ColorValue;
    submitButtonColor?: ColorValue;
    highlightColor?: ColorValue;
};

/**
 * カードフォームの表示タイプ
 */
export type CardFormType = 'multiLine' | 'cardDisplay';

type ExtraAttributeEmail = { type: 'email'; preset?: string };
type ExtraAttributePhone = { type: 'phone'; presetRegion?: string; presetNumber?: string };
/**
 * カードフォームの追加属性
 */
export type ExtraAttribute = ExtraAttributeEmail | ExtraAttributePhone;
/**
 * カードフォームのオプション
 */
type CardFormOption = {
    /**
     * PAY.JP Platform Marketplace 利用の場合のみ必要です (cf. {@link https://pay.jp/docs/platform-tenant-checkout} ).
     */
    tenantId?: string;
    /**
     * カードフォームの表示タイプ（デフォルトはmultiLine）
     */
    cardFormType?: CardFormType;
    /**
     * カードフォームに追加の属性項目を設定できます。デフォルトはメールアドレスと電話番号が表示されます。
     * 入力した内容はカードオブジェクトにセットされ、 3Dセキュア認証実施時に送信されます。
     *
     * 3Dセキュア認証実施時の連携項目追加については以下のドキュメントを参照してください。
     * https://help.pay.jp/ja/articles/9556161
     */
    extraAttributes?: ExtraAttribute[];
};

const { RNPAYCardForm } = NativeModules;
const cardFormEventEmitter = new NativeEventEmitter(RNPAYCardForm);
const onCardFormCanceledSet: Set<OnCardFormCanceled> = new Set();
const onCardFormCompletedSet: Set<OnCardFormCompleted> = new Set();
const onCardFormProducedTokenSet: Set<OnCardFormProducedToken> = new Set();

/**
 * カードフォームを開始します。
 * 更新を受け取るには {@link onCardFormUpdate} にリスナーを登録してください。
 *
 * @param options カードフォームのオプション
 */
export const startCardForm = async (options?: CardFormOption): Promise<void> => {
    const extraAttributes = options?.extraAttributes ?? [{ type: 'email' }, { type: 'phone' }];
    const extraAttributeEmail = extraAttributes.find(attribute => attribute.type === 'email') as ExtraAttributeEmail;
    const extraAttributePhone = extraAttributes.find(attribute => attribute.type === 'phone') as ExtraAttributePhone;
    await RNPAYCardForm.startCardForm(
        options?.tenantId,
        options?.cardFormType,
        !!extraAttributeEmail,
        !!extraAttributePhone,
        extraAttributeEmail?.preset,
        extraAttributePhone?.presetRegion,
        extraAttributePhone?.presetNumber,
    );
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
    const styleConverted: { [P in keyof IOSCardFormStyle]: ProcessedColorValue } = {};
    for (const key in style) {
        const styleKey = key as keyof IOSCardFormStyle;
        const styleValue = style[styleKey];
        const processedValue = processColor(styleValue);
        if (processedValue !== null && processedValue !== undefined) {
            styleConverted[styleKey] = processedValue;
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
    const onCardFormCanceled = cardFormEventEmitter.addListener('onCardFormCanceled', () => {
        onCardFormCanceledSet.forEach(observer => observer());
    });
    const onCardFormCompleted = cardFormEventEmitter.addListener('onCardFormCompleted', () => {
        onCardFormCompletedSet.forEach(observer => observer());
    });
    const onCardFormProducedToken = cardFormEventEmitter.addListener('onCardFormProducedToken', token => {
        onCardFormProducedTokenSet.forEach(observer => observer(token));
    });
    return (): void => {
        onCardFormCanceled.remove();
        onCardFormCompleted.remove();
        onCardFormProducedToken.remove();
    };
};
