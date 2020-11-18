.PHONY: dependencies
dependencies:
	yarn --frozen-lockfile

.PHONY: check
check:
	yarn lint
	yarn test

.PHONY: dependencies-example
dependencies-example:
	cd example && yarn --frozen-lockfile

.PHONY: check-example
check-example:
	cd example && yarn lint && yarn test --ci

.PHONY: build-example-android
build-example-android:
	cd example/android && ./gradlew build --stacktrace

.PHONY: e2e-android
e2e-android:
	cd example && detox build --configuration android.emu.release
	cd example && detox test --configuration android.emu.release --cleanup

.PHONY: dependencies-example-ios
dependencies-example-ios:
	cd example/ios && pod install

.PHONY: e2e-ios
e2e-ios:
	cd example && detox build --configuration ios.sim.release
	cd example && detox test --configuration ios.sim.release --cleanup
