
# react-native-payjp-library

## Getting started

`$ npm install react-native-payjp-library --save`

### Mostly automatic installation

`$ react-native link react-native-payjp-library`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-payjp-library` and add `RNPayjpLibrary.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNPayjpLibrary.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNPayjpLibraryPackage;` to the imports at the top of the file
  - Add `new RNPayjpLibraryPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-payjp-library'
  	project(':react-native-payjp-library').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-payjp-library/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-payjp-library')
  	```


## Usage
```javascript
import RNPayjpLibrary from 'react-native-payjp-library';

// TODO: What to do with the module?
RNPayjpLibrary;
```
  