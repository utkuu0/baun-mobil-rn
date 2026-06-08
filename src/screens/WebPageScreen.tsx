import React, { useState } from 'react';
import { View, ActivityIndicator, Pressable, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Linking from 'expo-linking';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { RouteProp } from '@react-navigation/native';
import { DrawerParamList } from '../navigation/DrawerNavigator';
import { commonStyles } from '../theme/commonStyles';
import { styles } from '../styles/WebPageScreen.styles';

type WebPageScreenRouteProp = RouteProp<DrawerParamList, 'WebPage'>;

interface WebPageScreenProps {
  route: WebPageScreenRouteProp;
  navigation: any;
}

const WebPageScreen: React.FC<WebPageScreenProps> = ({ route, navigation }) => {
  const { theme, isDark } = useAppTheme();
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
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()} style={{ marginLeft: 16, padding: 4 }}>
          <MaterialIcons name="arrow-back" size={24} color={colors.appbarText || '#FFFFFF'} />
        </Pressable>
      ),
      headerTitle: title,
      headerRight: () => (
        <Pressable onPress={openExternal} style={{ marginRight: 16, padding: 4 }}>
          <MaterialIcons name="open-in-new" size={22} color={colors.appbarText || '#FFFFFF'} />
        </Pressable>
      ),
    });
  }, [navigation, title, url, colors]);

  const injectedJsBeforeContent = `
    (function() {
      const isArticle = window.location.href.includes('/detay/') || window.location.href.includes('/haber/') || window.location.href.includes('/duyuru/');
      
      const css = \`
        \${isArticle ? \`
          header, footer, nav, aside, .header, .footer, .navigation, .sidebar, .menu, #header, #footer, #navigation, #sidebar, #menu, .navbar, .nav-menu {
            display: none !important;
          }
        \` : ''}

        \${${isDark} ? \`
          /* Set global dark background for body and html in dark mode */
          body, html {
            background-color: #0A1110 !important;
          }
          
          /* Target content containers specifically for dark background overrides */
          main, #main, .main, #content, .content, .container, .wrapper, article, section, .cstRow, .northwood-news, .northwood-events {
            background-color: #0A1110 !important;
          }
          
          /* Set dark background only for generic divs that are inside main content areas */
          main div, #main div, .main div, #content div, .content div, .container div, .wrapper div, article div, section div, .cstRow div, .northwood-news div, .northwood-events div {
            background-color: #0A1110 !important;
          }

          /* Target text elements only inside content areas to keep header/logo/language menu untouched */
          main p, main span, main li, main td, main th, main div,
          #main p, #main span, #main li, #main td, #main th, #main div,
          .main p, .main span, .main li, .main td, .main th, .main div,
          #content p, #content span, #content li, #content th, #content div,
          .content p, .content span, .content li, .content td, .content th, .content div,
          .container p, .container span, .container li, .container td, .container th, .container div,
          .wrapper p, .wrapper span, .wrapper li, .wrapper td, .wrapper th, .wrapper div,
          article p, article span, article li, article td, article th, article div,
          section p, section span, section li, section td, section th, section div,
          .cstRow p, .cstRow span, .cstRow li, .cstRow td, .cstRow th, .cstRow div,
          .northwood-news p, .northwood-news span, .northwood-news li, .northwood-news td, .northwood-news th, .northwood-news div,
          .northwood-events p, .northwood-events span, .northwood-events li, .northwood-events td, .northwood-events th, .northwood-events div {
            color: #E2EFEB !important;
          }

          /* Headings overrides inside content containers */
          main h1, main h2, main h3, main h4, main h5, main h6, main strong, main b,
          #main h1, #main h2, #main h3, #main h4, #main h5, #main h6, #main strong, #main b,
          .main h1, .main h2, .main h3, .main h4, .main h5, .main h6, .main strong, .main b,
          #content h1, #content h2, #content h3, #content h4, #content h5, #content h6, #content strong, #content b,
          .content h1, .content h2, .content h3, .content h4, .content h5, .content h6, .content strong, .content b,
          article h1, article h2, article h3, article h4, article h5, article h6, article strong, article b,
          section h1, section h2, section h3, section h4, section h5, section h6, section strong, section b,
          .cstRow h1, .cstRow h2, .cstRow h3, .cstRow h4, .cstRow h5, .cstRow h6, .cstRow strong, .cstRow b,
          .northwood-news h1, .northwood-news h2, .northwood-news h3, .northwood-news h4, .northwood-news h5, .northwood-news h6, .northwood-news strong, .northwood-news b,
          .northwood-events h1, .northwood-events h2, .northwood-events h3, .northwood-events h4, .northwood-events h5, .northwood-events h6, .northwood-events strong, .northwood-events b {
            color: #FFFFFF !important;
          }

          /* Link overrides inside content containers */
          main a, main a *,
          #main a, #main a *,
          .main a, .main a *,
          #content a, #content a *,
          .content a, .content a *,
          article a, article a *,
          section a, section a *,
          .cstRow a, .cstRow a *,
          .northwood-news a, .northwood-news a *,
          .northwood-events a, .northwood-events a * {
            color: #0BBEC2 !important;
          }
        \` : ''}
      \`;
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = css;
      
      const insertStyle = () => {
        if (document.head) {
          document.head.appendChild(style);
        } else {
          setTimeout(insertStyle, 10);
        }
      };
      insertStyle();
    })();
    true;
  `;

  const injectedJs = `
    (function() {
      const isArticle = window.location.href.includes('/detay/') || window.location.href.includes('/haber/') || window.location.href.includes('/duyuru/');
      if (!isArticle) return;

      const selectors = [
        'header', 'footer', 'nav', 'aside',
        '.header', '.footer', '.navigation', '.sidebar', '.menu',
        '#header', '#footer', '#navigation', '#sidebar', '#menu',
        '.navbar', '.nav-menu', '.mobile-header', '.site-header', '.site-footer'
      ];
      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          el.style.setProperty('display', 'none', 'important');
        });
      });
    })();
    true;
  `;

  return (
    <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
      <WebView
        source={{ uri: url }}
        onLoadEnd={() => setLoading(false)}
        style={styles.webView}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        injectedJavaScriptBeforeContentLoaded={injectedJsBeforeContent}
        injectedJavaScript={injectedJs}
        onShouldStartLoadWithRequest={(request) => {
          if (request.url.includes('lang=')) {
            Alert.alert(
              'Dil Seçeneği',
              'Bu içeriğin farklı bir dil seçeneği bulunmamaktadır.'
            );
            return false;
          }
          return true;
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
export default WebPageScreen;
