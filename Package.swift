// swift-tools-version: 6.0

import PackageDescription

// Swift Package Manager support for React Native's SwiftPM autolinking
// (introduced in react-native 0.87, experimental; verified with 0.88). CocoaPods users are unaffected; see the podspec.
// The two React Native packages are resolved by the autolinker relative to
// build/generated/autolinking/libs/PayjpReactNative in the app (default autolinking layout only).

let package = Package(
    name: "PayjpReactNative",
    platforms: [.iOS(.v15)],
    products: [
        .library(name: "PayjpReactNative", targets: ["PayjpReactNative"]),
    ],
    dependencies: [
        .package(name: "ReactNative", path: "../../../../xcframeworks"),
        .package(name: "React-GeneratedCode", path: "../../../ios"),
        // sdkconfig.json の ios と同じバージョンに合わせること (scripts/check_sdk_version.sh で検証)
        .package(url: "https://github.com/payjp/payjp-ios.git", .upToNextMinor(from: "2.2.4")),
        .package(url: "https://github.com/google/GoogleUtilities.git", "8.0.0"..<"9.0.0"),
    ],
    targets: [
        .target(
            name: "PayjpReactNative",
            dependencies: [
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
                .product(name: "ReactAppHeaders", package: "React-GeneratedCode"),
                .product(name: "PAYJP", package: "payjp-ios"),
                .product(name: "GULAppDelegateSwizzler", package: "GoogleUtilities"),
            ],
            path: "ios/Classes",
            publicHeadersPath: ".",
            linkerSettings: [
                .linkedFramework("UIKit"),
                .linkedFramework("Foundation"),
                .linkedFramework("PassKit"),
            ]
        ),
    ]
)
