.PHONY: prepare-lint
prepare-lint:
	brew update
	brew bundle

.PHONY: dependencies
dependencies:
	yarn --frozen-lockfile

.PHONY: check
check: dependencies
	yarn lint
	yarn test

.PHONY: dependencies-example
dependencies-example: dependencies
	cd example2 && yarn --frozen-lockfile

.PHONY: check-example
check-example: dependencies-example
	cd example2 && yarn lint

.PHONY: build-example-android
build-example-android: dependencies-example
	cd example2 && yes | yarn prebuild
	cd example2/android && /gradlew assembleDebug

.PHONY: e2e-android
e2e-android: dependencies-example
	cd example2 && detox build --configuration android.emu.release
	cd example2 && detox test --configuration android.emu.release --cleanup

.PHONY: dependencies-example-ios
dependencies-example-ios: dependencies-example
	cd example2 && yes | yarn prebuild

.PHONY: e2e-ios
e2e-ios: dependencies-example
	cd example2 && detox build --configuration ios.sim.release
	cd example2 && detox test --configuration ios.sim.release --cleanup
