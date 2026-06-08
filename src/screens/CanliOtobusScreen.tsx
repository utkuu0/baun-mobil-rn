import React, { useState } from 'react';
import { View, ActivityIndicator, Pressable } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Linking from 'expo-linking';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { commonStyles } from '../theme/commonStyles';
import { styles } from '../styles/CanliOtobusScreen.styles';

const BUS_TRACK_URL = 'https://balikesirkart.asiselektronik.com.tr/wheremybus';

interface CanliOtobusScreenProps {
  navigation: any;
}

const CanliOtobusScreen: React.FC<CanliOtobusScreenProps> = ({ navigation }) => {
  const { theme, isDark } = useAppTheme();
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

  const injectedJs = `
    (function() {
      setTimeout(function() {
        try {
          const css = 'html, body, app-root, router-outlet, app-wheremybus, app-layout { display: block !important; height: 100% !important; min-height: 100% !important; margin: 0 !important; padding: 0 !important; } .shell, .black-layer, .main-content, .container, .main-area, .map-viewer, .map { height: 100% !important; min-height: 100% !important; margin: 0 !important; padding: 0 !important; }';
          const style = document.createElement('style');
          style.type = 'text/css';
          style.appendChild(document.createTextNode(css));
          document.head.appendChild(style);
        } catch (e) {
          console.error(e);
        }
      }, 1000);
    })();
    true;
  `;

  return (
    <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
      <WebView
        source={{ uri: BUS_TRACK_URL }}
        onLoadEnd={() => setLoading(false)}
        style={styles.webView}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        injectedJavaScript={injectedJs}
      />
      {loading && (
        <View style={[styles.loadingContainer, { backgroundColor: isDark ? 'rgba(10, 17, 16, 0.8)' : 'rgba(255, 255, 255, 0.8)' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
};
export default CanliOtobusScreen;
