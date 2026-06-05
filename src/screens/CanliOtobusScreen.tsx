import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Linking from 'expo-linking';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';

const BUS_TRACK_URL = 'https://balikesirkart.asiselektronik.com.tr/wheremybus';

interface CanliOtobusScreenProps {
  navigation: any;
}

const CanliOtobusScreen: React.FC<CanliOtobusScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { colors } = theme;
  const [loading, setLoading] = useState(true);

  const openExternal = async () => {
    try {
      await Linking.openURL(BUS_TRACK_URL);
    } catch (err) {
      console.warn("Couldn't open URL in external browser:", err);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={openExternal} style={{ marginRight: 16, padding: 4 }}>
          <MaterialIcons name="open-in-new" size={22} color={colors.appbarText || '#FFFFFF'} />
        </Pressable>
      ),
    });
  }, [navigation, colors]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <WebView
        source={{ uri: BUS_TRACK_URL }}
        onLoadEnd={() => setLoading(false)}
        style={styles.webView}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default CanliOtobusScreen;
