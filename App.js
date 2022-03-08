import React from 'react';
import {
  View,
} from 'react-native';
import TwilioVideoChat from './src/screens/twilioVideoChat';

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <TwilioVideoChat />
    </View>
  );
};

export default App;
