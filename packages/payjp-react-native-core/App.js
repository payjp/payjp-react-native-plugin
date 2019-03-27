import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  WebView,
  ActivityIndicator
} from 'react-native';

const html = `
<html>
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
<div id="hoge">hogeeeeeeeeeeee</div>
<div id="fuga">fugaaaaaaaaaaaa</div>
<div id="piyo">piyooooooooooooo</div>
<script type="text/javascript" src="https://js.pay.jp/">
<script>
  Payjp.setPublicKey("pk_test_0383a1b8f91e8a6e3ea0e2a9");
  document.getElementById('piyo').innerText = Payjp.getPublicKey();
</script>
`;
export default class App extends Component {
  render() {
    console.log('daraaaaaaaaaaaaaaaaaaaaaaaa');
    const { hoge } = this.props;
    const web = (
      <WebView
        ref={webview => (this.webview = webview)}
        style={styles.container}
        source={{html}}
        renderError={console.error}
        onError={console.error}
        mixedContentMode='always'
      />
    );
    return web;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  web: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: 0,
    height: 0,
  },
});

AppRegistry.registerComponent('Project', () => Project);
