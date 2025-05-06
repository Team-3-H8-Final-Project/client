import { Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useWindowDimensions } from 'react-native';
import React from 'react';

const ConversationWeb = () => {
  const { width, height } = useWindowDimensions();

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <iframe
            src="https://yop-pub.web.app/"
            style={{ width, height, borderWidth: 0 }}
            title="Conversation Web"
            allow="microphone; camera"
            />
      </View>
    );
  }

  return (
    <WebView 
      style={styles.container}
      source={{ uri: 'https://yop-pub.web.app/' }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ConversationWeb;
