# React Native Plugin for PAY.JP SDK

![npm](https://img.shields.io/npm/v/payjp-react-native)
[![Build Status](https://travis-ci.org/payjp/payjp-react-native-plugin.svg?branch=master)](https://travis-ci.org/payjp/payjp-react-native-plugin)

オンライン決済サービス「[PAY.JP](https://pay.jp/)」をReact Nativeアプリケーションに組み込むためのプラグインです。
このプラグインは以下の機能を提供します。

- クレジットカード決済のためのカードフォーム
- Apple Payアプリ内決済（iOSのみ）

詳細は[公式オンラインドキュメント](https://pay.jp/docs/mobileapp-react-native)を確認ください。

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
