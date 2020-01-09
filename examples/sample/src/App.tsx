/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
// import {hello} from 'payjp-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const App = (): React.ReactElement => {
  // const greeting = hello();
  return (
    <View style={styles.container}>
      <Text>Hello, Sample App.</Text>
      {/* <Text>{greeting}</Text> */}
    </View>
  );
};

export default App;
