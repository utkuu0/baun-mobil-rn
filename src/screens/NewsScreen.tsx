import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import ApiService, { HABERLER_URL, DUYURULAR_URL } from '../services/apiService';
import { WebNewsItem } from '../types';
import { sampleNews } from '../data/sampleData';

interface NewsScreenProps {
  navigation: any;
}

const NewsScreen: React.FC<NewsScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { colors } = theme;

  const [activeTab, setActiveTab] = useState<'news' | 'announcements'>('news');
  const [news, setNews] = useState<WebNewsItem[]>([]);
  const [announcements, setAnnouncements] = useState<WebNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFeed(true);
  }, [activeTab]);

  const loadFeed = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const api = ApiService.getInstance();
      if (activeTab === 'news') {
        const res = await api.fetchHaberler(8, refreshing);
        setNews(res);
      } else {
        const res = await api.fetchDuyurular(8, refreshing);
        setAnnouncements(res);
      }
    } catch (err) {
      console.warn('Feed load error:', err);
      // Fallback to sample data on error
      if (activeTab === 'news') {
        setNews(sampleNews.map(n => ({
          title: n.title,
          url: 'https://www.balikesir.edu.tr/haberler',
          imageUrl: n.imageUrl,
          date: n.date,
          isDuyuru: false,
        })));
      } else {
        setAnnouncements(sampleNews.filter(n => n.category === 'Duyuru').map(n => ({
          title: n.title,
          url: 'https://www.balikesir.edu.tr/duyurular',
          date: n.date,
          isDuyuru: true,
        })));
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadFeed(false);
  };

  const openItem = (item: WebNewsItem) => {
    const title = activeTab === 'news' ? 'Haber' : 'Duyuru';
    navigation.navigate('WebPage', { title, url: item.url });
  };

  const openAll = () => {
    const title = activeTab === 'news' ? 'Tüm Haberler' : 'Tüm Duyurular';
    const url = activeTab === 'news' ? HABERLER_URL : DUYURULAR_URL;
    navigation.navigate('WebPage', { title, url });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const renderNewsCard = ({ item }: { item: WebNewsItem }) => (
    <Pressable style={[styles.card, { backgroundColor: colors.card }]} onPress={() => openItem(item)}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      ) : (
        <View style={[styles.cardImageFallback, { backgroundColor: colors.secondary }]}>
          <MaterialIcons name="article" size={40} color="#FFFFFF" />
        </View>
      )}
      <View style={styles.cardContent}>
        {item.date && (
          <Text style={[styles.cardDate, { color: colors.textMuted }]}>{formatDate(item.date)}</Text>
        )}
        <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </Pressable>
  );

  const renderAnnouncementCard = ({ item }: { item: WebNewsItem }) => (
    <Pressable style={[styles.card, { backgroundColor: colors.card }]} onPress={() => openItem(item)}>
      <View style={styles.announcementRow}>
        <View style={[styles.announcementIconContainer, { backgroundColor: colors.chip }]}>
          <MaterialIcons name="campaign" size={24} color={colors.secondary} />
        </View>
        <View style={styles.announcementTextContainer}>
          {item.date && (
            <Text style={[styles.cardDate, { color: colors.textMuted }]}>{formatDate(item.date)}</Text>
          )}
          <Text style={[styles.announcementTitle, { color: colors.text }]} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={colors.textMuted} />
      </View>
    </Pressable>
  );

  const renderHeader = () => (
    <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
      <Pressable
        style={[
          styles.tabButton,
          { 
            borderBottomColor: activeTab === 'news' ? colors.primary : 'transparent',
            borderBottomWidth: activeTab === 'news' ? 3 : 0
          }
        ]}
        onPress={() => setActiveTab('news')}
      >
        <MaterialIcons 
          name="article" 
          size={18} 
          color={activeTab === 'news' ? colors.primary : colors.textMuted} 
        />
        <Text 
          style={[
            styles.tabButtonText, 
            { color: activeTab === 'news' ? colors.primary : colors.textMuted }
          ]}
        >
          Haberler
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.tabButton,
          { 
            borderBottomColor: activeTab === 'announcements' ? colors.primary : 'transparent',
            borderBottomWidth: activeTab === 'announcements' ? 3 : 0
          }
        ]}
        onPress={() => setActiveTab('announcements')}
      >
        <MaterialIcons 
          name="campaign" 
          size={18} 
          color={activeTab === 'announcements' ? colors.primary : colors.textMuted} 
        />
        <Text 
          style={[
            styles.tabButtonText, 
            { color: activeTab === 'announcements' ? colors.primary : colors.textMuted }
          ]}
        >
          Duyurular
        </Text>
      </Pressable>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <Pressable 
        style={[styles.outlinedButton, { borderColor: colors.secondary }]} 
        onPress={openAll}
      >
        <MaterialIcons name="open-in-new" size={18} color={colors.secondary} style={styles.buttonIcon} />
        <Text style={[styles.outlinedButtonText, { color: colors.secondary }]}>
          {activeTab === 'news' ? 'Tüm Haberler' : 'Tüm Duyurular'}
        </Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header AppBar */}
      <View style={[styles.appBar, { backgroundColor: colors.appbar }]}>
        <View style={styles.appBarLeft}>
          <Pressable style={styles.appBarIcon} onPress={() => navigation.openDrawer()}>
            <MaterialIcons name="menu" size={26} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.appBarTitle}>Haberler & Duyurular</Text>
        </View>
      </View>

      {renderHeader()}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={activeTab === 'news' ? news : announcements}
          renderItem={activeTab === 'news' ? renderNewsCard : renderAnnouncementCard}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} />
          }
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2.5,
  },
  appBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appBarIcon: {
    padding: 4,
    marginRight: 12,
  },
  appBarTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 12,
  },
  card: {
    borderRadius: 16,
    marginVertical: 6,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  cardImage: {
    width: '100%',
    height: 170,
    resizeMode: 'cover',
  },
  cardImageFallback: {
    width: '100%',
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 12,
  },
  cardDate: {
    fontSize: 12,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  announcementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  announcementIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  announcementTextContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 6,
  },
  announcementTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  footerContainer: {
    marginTop: 12,
    marginBottom: 24,
  },
  outlinedButton: {
    height: 46,
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  outlinedButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default NewsScreen;
