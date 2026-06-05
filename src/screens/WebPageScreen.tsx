import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Pressable, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Linking from 'expo-linking';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { RouteProp } from '@react-navigation/native';
import { DrawerParamList } from '../navigation/DrawerNavigator';

type WebPageScreenRouteProp = RouteProp<DrawerParamList, 'WebPage'>;

interface WebPageScreenProps {
  route: WebPageScreenRouteProp;
  navigation: any;
}

const WebPageScreen: React.FC<WebPageScreenProps> = ({ route, navigation }) => {
  const { theme } = useAppTheme();
  const { colors } = theme;
  const { title, url } = route.params;

  const [loading, setLoading] = useState(true);

  const openExternal = async () => {
    try {
      await Linking.openURL(url);
    } catch (err) {
      console.warn("Couldn't open URL in external browser:", err);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: title,
      headerRight: () => (
        <Pressable onPress={openExternal} style={{ marginRight: 16, padding: 4 }}>
          <MaterialIcons name="open-in-new" size={22} color={colors.appbarText || '#FFFFFF'} />
        </Pressable>
      ),
    });
  }, [navigation, title, url, colors]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <WebView
        source={{ uri: url }}
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

export default WebPageScreen;
