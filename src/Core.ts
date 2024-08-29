// LICENSE : MIT
import {NativeModules} from 'react-native';

const {RNPAYCore} = NativeModules;

type InitOption = {
    /**
     * PAY.JPのパブリックキー
     * PAY.JP管理画面で取得します
     */
    publicKey: string;

    /**
     * 表示やエラーメッセージに用いるロケール情報（
     * `ja`, `en` のみ対応
     */
    locale?: string;

    /**
     * デバッグログを出力するオプション
     * Androidのみ有効
     */
    debugEnabled?: boolean;

    /**
     * 3Dセキュア利用時のみ必要なオプション
     * PAY.JP管理画面で設定したリダイレクトURLと識別子を指定します
     */
    threeDSecureRedirect?: {url: string; key: string};
};

/**
 * PAY.JPのSDKの初期設定
 * カードフォームなどを利用する前にコールする必要があります。
 *
 * @param options オプション
 */
export const init = async (options: InitOption): Promise<void> => {
    await RNPAYCore.initialize({
        publicKey: options.publicKey,
        locale: options.locale ?? null,
        debugEnabled: options.debugEnabled ?? false,
        threeDSecureRedirectUrl: options.threeDSecureRedirect?.url ?? null,
        threeDSecureRedirectKey: options.threeDSecureRedirect?.key ?? null,
    });
};
