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

  const cssOverride = [
    // Base layout
    'html { width: 100% !important; height: 100% !important; overflow-x: hidden !important; }',
    'body, body.igx-typography { display: block !important; width: 100% !important; min-width: 0 !important; max-width: none !important; height: 100% !important; margin: 0 !important; padding: 0 !important; overflow-x: hidden !important; box-sizing: border-box !important; }',
    // Angular root
    'app-root { display: flex !important; flex-direction: column !important; width: 100% !important; min-width: 0 !important; height: 100% !important; min-height: 100vh !important; }',
    'router-outlet { display: none !important; }',
    // Page components
    'app-wheremybus, app-layout, app-home, app-shell { display: flex !important; flex-direction: column !important; width: 100% !important; min-width: 0 !important; height: 100% !important; flex: 1 1 auto !important; }',
    // Side panels and nav - hide or full width
    '.side-nav, .sidenav, nav, .navbar, .toolbar, .header, .app-bar, .igx-nav-drawer { display: none !important; }',
    // Content areas
    '.shell, .black-layer, .main-content, .content-wrapper, .page-content, .container, .main-area, .map-viewer, .map, .content, .igx-content, .view, igx-tabs { width: 100% !important; max-width: none !important; min-width: 0 !important; height: 100% !important; margin: 0 !important; padding: 0 !important; box-sizing: border-box !important; }',
    // IGX overrides
    '.igx-layout { width: 100% !important; min-width: 0 !important; margin: 0 !important; }',
    '* { max-width: none !important; box-sizing: border-box !important; }',
  ].join(' ');

  const debugJs = `
    (function() {
      setTimeout(function() {
        try {
          var info = {};
          var body = document.body;
          info.bodyClass = body.className;
          info.bodyWidth = body.offsetWidth;
          info.bodyScrollWidth = body.scrollWidth;
          info.windowWidth = window.innerWidth;
          info.children = [];
          var walk = function(el, depth) {
            if (depth > 3) return;
            var tag = el.tagName ? el.tagName.toLowerCase() : '';
            var cls = el.className || '';
            var w = el.offsetWidth;
            var sw = el.scrollWidth;
            info.children.push({ tag: tag, cls: cls.toString().substring(0,60), w: w, sw: sw, depth: depth });
            for (var i = 0; i < el.children.length && i < 5; i++) {
              walk(el.children[i], depth + 1);
            }
          };
          walk(document.documentElement, 0);
          window.ReactNativeWebView.postMessage(JSON.stringify(info));
        } catch(e) {
          window.ReactNativeWebView.postMessage('ERR: ' + e.message);
        }
      }, 4000);
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
        injectedJavaScript={debugJs}
        onMessage={(event) => {
          console.log('[BUS DOM]', event.nativeEvent.data);
        }}
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
