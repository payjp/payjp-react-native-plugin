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
	yarn build

.PHONY: dependencies-example
dependencies-example: dependencies
	yarn build
	cd example && yarn --frozen-lockfile

.PHONY: check-example
check-example: dependencies-example
	cd example && yarn lint

.PHONY: build-example-android
build-example-android: dependencies-example
	cd example && yes | yarn prebuild
	cd example/android && ./gradlew assembleDebug -Dorg.gradle.jvmargs="-Xmx4g"

.PHONY: e2e-android
e2e-android: dependencies-example
	cd example && detox build --configuration android.emu.debug
	cd example && detox test --configuration android.emu.debug --cleanup

.PHONY: dependencies-example-ios
dependencies-example-ios: dependencies-example
	cd example && yes | yarn prebuild

.PHONY: e2e-ios
e2e-ios: dependencies-example
	cd example && detox build --configuration ios.sim.debug
	cd example && detox test --configuration ios.sim.debug --cleanup
