import React from 'react';
import { WebView, StyleSheet, ActivityIndicator } from 'react-native';

const html = `
<html>
<head>
<script type="text/javascript" src="https://js.pay.jp/">
<script type="text/javascript">
    console.log('fugaaaaaaaaaaaa')
</script>
<body>
<div id="mynetwork">hogehogehoge</div>`;

export default class App extends React.Component {
  render() {
    return (
      <WebView
        style={styles.container}
        source={{html}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        renderError={console.log}
        renderLoading={()=>{return(<ActivityIndicator style={styles2.container} size="large" color="#1a237e" />)}}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
});
