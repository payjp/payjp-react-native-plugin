# React Native Plugin for PAY.JP SDK

![npm](https://img.shields.io/npm/v/payjp-react-native)
![Build and Test](https://github.com/payjp/payjp-react-native-plugin/workflows/Build%20and%20Test/badge.svg?branch=master)

オンライン決済サービス「[PAY.JP](https://pay.jp/)」をReact Nativeアプリケーションに組み込むためのプラグインです。
このプラグインは以下の機能を提供します。

- クレジットカード決済のためのカードフォーム
- Apple Payアプリ内決済（iOSのみ）

詳細は[公式オンラインドキュメント](https://pay.jp/docs/mobileapp-react-native)を確認ください。

## サンプルコード

exampleをご覧ください。

※Android Emulator環境で3Dセキュア機能を動作させる場合、Chromeアプリが初期画面になっていると3Dセキュアの認証画面が立ち上がらない場合がありますのでご注意ください。 ref: https://github.com/payjp/payjp-android/pull/61  
この事象が起こる場合、一度Chromeアプリを開き初期画面を完了しておくことで解決されます。

## Compatible Platforms

|Platform|CardForm          |ApplePay          |
|--------|------------------|------------------|
|iOS     |:white_check_mark:|:white_check_mark:|
|Android |:white_check_mark:|                  |


## API References

https://payjp.github.io/payjp-react-native-plugin/

## License

React Native Plugin for PAY.JP SDK is available under the MIT license. See the LICENSE file for more info.

## Development

```
yarn install
yarn build
```

```
cd example
yarn start
yarn ios or android
```
