// LICENSE : MIT
import { NativeModules } from "react-native";

const { RNPAYCore } = NativeModules;

type InitOption = {
    /**
     * PAY.JPのパブリックキー
     * PAY.JPダッシュボードで取得します
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
        locale: options.locale || null,
        debugEnabled: options.debugEnabled || false,
    });
};
