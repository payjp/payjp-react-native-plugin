# example構成

* Expoプロジェクト

## iOS の依存管理の切り替え（CocoaPods / Swift Package Manager）

`ios/` は `prebuild` で生成します。
CocoaPods 版と Swift Package Manager（SwiftPM）版は、次のスクリプトで切り替えます。

```bash
# CocoaPods 版（既定）
yarn prebuild:ios       # ios/ を生成する
yarn ios                # 起動する

# SwiftPM 版（実験的。Expo SDK 58 以降・React Native 0.88 以降）
yarn prebuild:ios:spm   # ios/ を生成する
yarn ios:spm            # 起動する
```

- `prebuild` は `ios/` を作り直します。もう一方の版に切り替えるときは、その版の `prebuild` を実行してください。
- `yarn ios` と `yarn ios:spm` は、それぞれ CocoaPods 版・SwiftPM 版の `ios/` でのみ動きます。
- SwiftPM 版でも CocoaPods（`pod` コマンド）が必要です。`pod deintegrate` に使います。
- Detox による E2E テスト（`make e2e-ios`）は CocoaPods 版でのみ動きます。
- example が使うネイティブライブラリは、すべて自前の `Package.swift` を持っているため、SwiftPM 版でも回避策は入れていません。
  - `Package.swift` を持たないライブラリを追加すると、`yarn prebuild:ios:spm` が「Package.swift is missing for library」というエラーで止まります。

