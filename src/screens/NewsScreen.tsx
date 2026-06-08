import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
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
import { commonStyles } from '../theme/commonStyles';
import { styles } from '../styles/NewsScreen.styles';
import { LinearGradient } from 'expo-linear-gradient';

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
    <Pressable style={[commonStyles.card, { backgroundColor: colors.card }]} onPress={() => openItem(item)}>
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
    <Pressable style={[commonStyles.card, { backgroundColor: colors.card }]} onPress={() => openItem(item)}>
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
    <SafeAreaView style={[commonStyles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header AppBar */}
      <LinearGradient
        colors={colors.appbarGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={commonStyles.appBar}
      >
        <View style={commonStyles.appBarLeft}>
          <Pressable style={commonStyles.appBarIcon} onPress={() => navigation.openDrawer()}>
            <MaterialIcons name="menu" size={26} color="#FFFFFF" />
          </Pressable>
          <Text style={commonStyles.appBarTitle}>Haberler & Duyurular</Text>
        </View>
      </LinearGradient>

      {renderHeader()}

      {loading ? (
        <View style={commonStyles.loadingContainer}>
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
export default NewsScreen;
