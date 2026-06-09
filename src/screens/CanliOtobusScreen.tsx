import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  Pressable,
  Text,
  Animated,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { commonStyles } from '../theme/commonStyles';
import { styles } from '../styles/CanliOtobusScreen.styles';

const BUS_TRACK_URL = 'https://balikesirkart.asiselektronik.com.tr/wheremybus';

// Runs before Angular loads — wraps XHR/fetch to capture API responses,
// then applies CSS to fix mobile layout issues in the Angular SPA.
const BRIDGE_JS = `
(function() {
  // --- XHR interceptor ---
  var _open = XMLHttpRequest.prototype.open;
  var _send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function(m, url) { this._rnUrl = url; return _open.apply(this, arguments); };
  XMLHttpRequest.prototype.send = function() {
    var t = this;
    this.addEventListener('load', function() {
      if (!t._rnUrl) return;
      var ep = t._rnUrl.indexOf('stationapproachingvehicles') >= 0 ? 'approaching' : null;
      if (ep) try { window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({type:ep,data:t.responseText})); } catch(e){}
    });
    return _send.apply(this, arguments);
  };

  // --- fetch interceptor ---
  var _fetch = window.fetch;
  window.fetch = function(url, opts) {
    return _fetch.apply(this, arguments).then(function(resp) {
      var u = typeof url === 'string' ? url : (url&&url.url)||'';
      if (u.indexOf('stationapproachingvehicles') >= 0) {
        resp.clone().text().then(function(t) {
          try { window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({type:'approaching',data:t})); } catch(e){}
        });
      }
      return resp;
    });
  };

  // --- CSS: mobile layout fixes ---
  function injectCSS() {
    var s = document.createElement('style');
    s.textContent =
      'html,body,body.igx-typography{background:#fff!important;margin:0!important;padding:0!important;min-width:0!important;overflow-x:hidden!important;}' +
      'app-root,app-shell,app-wheremybus,app-layout,app-home{min-width:0!important;width:100%!important;}' +
      '.shell,.black-layer,.igx-layout,.igx-content,.container,.wrapper{box-shadow:none!important;border-radius:0!important;max-width:100%!important;min-width:0!important;}' +
      '.grecaptcha-badge{visibility:hidden!important;}' +
      'input,select,button{font-size:16px!important;}';
    (document.head || document.documentElement).appendChild(s);
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', injectCSS); }
  else { injectCSS(); }

  true;
})();
`;

interface ApproachingBus {
  busLineCode: string;
  busLineShortName: string;
  remainingTimeCurr: number;
  remainingNumberOfBusStops: number;
  busPlate: string;
}

type LoadState = 'loading' | 'ready' | 'error';

interface CanliOtobusScreenProps {
  navigation: any;
}

const CanliOtobusScreen: React.FC<CanliOtobusScreenProps> = ({ navigation }) => {
  const { theme, isDark } = useAppTheme();
  const { colors } = theme;

  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [buses, setBuses] = useState<ApproachingBus[]>([]);
  const panelAnim = useRef(new Animated.Value(0)).current;
  const panelOpen = useRef(false);
  const webViewRef = useRef<WebView>(null);

  const openExternal = useCallback(async () => {
    try { await Linking.openURL(BUS_TRACK_URL); } catch {}
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={openExternal} style={{ marginRight: 16, padding: 4 }}>
          <MaterialIcons name="open-in-new" size={22} color={colors.appbarText || '#FFFFFF'} />
        </Pressable>
      ),
    });
  }, [navigation, colors, openExternal]);

  const togglePanel = useCallback((open: boolean) => {
    if (panelOpen.current === open) return;
    panelOpen.current = open;
    Animated.spring(panelAnim, {
      toValue: open ? 1 : 0,
      useNativeDriver: true,
      bounciness: 5,
    }).start();
  }, [panelAnim]);

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'approaching') {
        const parsed = JSON.parse(msg.data);
        const list: ApproachingBus[] = parsed?.result?.route ?? [];
        setBuses(list);
        togglePanel(list.length > 0);
      }
    } catch {}
  }, [togglePanel]);

  const panelTranslateY = panelAnim.interpolate({ inputRange: [0, 1], outputRange: [220, 0] });

  const gradientColors: [string, string] = isDark
    ? ['#004A45', '#0A1110']
    : ['#006F68', '#0BBEC2'];

  return (
    <View style={commonStyles.container}>
      {/* WebView — her zaman render edilir, loadState'e göre gizlenmez (Angular init'i beklemesin) */}
      <WebView
        ref={webViewRef}
        source={{ uri: BUS_TRACK_URL }}
        style={[styles.webView, loadState !== 'ready' && { opacity: 0, height: 0 }]}
        javaScriptEnabled
        domStorageEnabled
        geolocationEnabled
        injectedJavaScriptBeforeContentLoaded={BRIDGE_JS}
        onMessage={handleMessage}
        onLoadEnd={() => setLoadState('ready')}
        onError={() => setLoadState('error')}
        onHttpError={({ nativeEvent }) => {
          if (nativeEvent.statusCode >= 500) setLoadState('error');
        }}
      />

      {/* Yükleniyor ekranı */}
      {loadState === 'loading' && (
        <LinearGradient colors={gradientColors} style={styles.fullScreen}>
          <MaterialIcons name="directions-bus" size={72} color="rgba(255,255,255,0.9)" />
          <Text style={styles.loadTitle}>Canlı Otobüs Takibi</Text>
          <Text style={styles.loadSubtitle}>BTT verisi yükleniyor…</Text>
          <ActivityIndicator size="large" color="rgba(255,255,255,0.8)" style={{ marginTop: 24 }} />
        </LinearGradient>
      )}

      {/* Hata ekranı */}
      {loadState === 'error' && (
        <LinearGradient colors={gradientColors} style={styles.fullScreen}>
          <MaterialIcons name="wifi-off" size={64} color="rgba(255,255,255,0.85)" />
          <Text style={styles.loadTitle}>Bağlantı Kurulamadı</Text>
          <Text style={styles.loadSubtitle}>İnternet bağlantınızı{'\n'}kontrol edin</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => {
              setLoadState('loading');
              webViewRef.current?.reload();
            }}
          >
            <MaterialIcons name="refresh" size={18} color="#006F68" />
            <Text style={styles.retryText}>Tekrar Dene</Text>
          </Pressable>
        </LinearGradient>
      )}

      {/* Yaklaşan otobüsler paneli — durağa dokunulduğunda Angular API'yi yakalar */}
      <Animated.View
        style={[
          styles.panel,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            transform: [{ translateY: panelTranslateY }],
          },
        ]}
        pointerEvents={panelOpen.current ? 'auto' : 'none'}
      >
        <View style={styles.panelHandle} />
        <View style={styles.panelHeader}>
          <View style={styles.panelTitleRow}>
            <MaterialIcons name="directions-bus" size={18} color={colors.primary} />
            <Text style={[styles.panelTitle, { color: colors.text }]}>Yaklaşan Otobüsler</Text>
          </View>
          <Pressable onPress={() => togglePanel(false)} hitSlop={12}>
            <MaterialIcons name="close" size={20} color={colors.textMuted ?? colors.text} />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.busRow}>
          {buses.map((bus, i) => (
            <View key={i} style={[styles.busCard, { backgroundColor: isDark ? '#1A2E2C' : '#F0FAF9', borderColor: colors.border }]}>
              <View style={[styles.lineBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.lineCode}>{bus.busLineCode}</Text>
              </View>
              <Text style={[styles.busTime, { color: colors.text }]}>
                {bus.remainingTimeCurr === 0 ? 'Durumda' : `${bus.remainingTimeCurr} dk`}
              </Text>
              <Text style={[styles.busStops, { color: colors.textMuted ?? colors.text }]}>
                {bus.remainingTimeCurr > 0 ? `${bus.remainingNumberOfBusStops} durak` : ''}
              </Text>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default CanliOtobusScreen;
