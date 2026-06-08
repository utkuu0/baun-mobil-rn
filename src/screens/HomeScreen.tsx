import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import ApiService from '../services/apiService';
import { sampleNews, sampleEvents } from '../data/sampleData';
import { WebNewsItem, ApiEvent } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import { commonStyles } from '../theme/commonStyles';
import { styles, CAROUSEL_WIDTH } from '../styles/HomeScreen.styles';
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');


interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme, isDark } = useAppTheme();
  const { colors } = theme;

  const [news, setNews] = useState<WebNewsItem[]>([]);
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadNews();
    loadEvents();
  }, []);

  const loadNews = async () => {
    try {
      const api = ApiService.getInstance();
      const res = await api.fetchHaberler(5);
      if (res && res.length > 0) {
        setNews(res);
      } else {
        setNews(sampleNews.map(n => ({
          title: n.title,
          url: 'https://www.balikesir.edu.tr/haberler',
          imageUrl: n.imageUrl,
          date: n.date,
          isDuyuru: false,
        })));
      }
    } catch (_) {
      // Fallback to sample data
      setNews(sampleNews.map(n => ({
        title: n.title,
        url: 'https://www.balikesir.edu.tr/haberler',
        imageUrl: n.imageUrl,
        date: n.date,
        isDuyuru: false,
      })));
    } finally {
      setLoadingNews(false);
    }
  };

  const loadEvents = async () => {
    try {
      const api = ApiService.getInstance();
      const res = await api.fetchEvents();
      if (res && res.length > 0) {
        setEvents(res);
      } else {
        setEvents(sampleEvents.map(e => ({
          id: Number(e.id),
          name: e.title,
          description: e.description,
          start: e.start,
          place: e.location,
          unit: e.category,
        })));
      }
    } catch (_) {
      setEvents(sampleEvents.map(e => ({
        id: Number(e.id),
        name: e.title,
        description: e.description,
        start: e.start,
        place: e.location,
        unit: e.category,
      })));
    } finally {
      setLoadingEvents(false);
    }
  };

  const openNews = (item: WebNewsItem) => {
    navigation.navigate('WebPage', { title: 'Haber', url: item.url });
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (activeSlide !== roundIndex) {
      setActiveSlide(roundIndex);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatEventDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleString('tr-TR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderCarouselItem = ({ item }: { item: WebNewsItem }) => (
    <Pressable style={styles.carouselItem} onPress={() => openNews(item)}>
      <View style={styles.carouselCard}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.carouselImage} />
        ) : (
          <View style={[styles.carouselImageFallback, { backgroundColor: colors.secondary }]}>
            <MaterialIcons name="article" size={48} color="#FFFFFF" />
          </View>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)']}
          style={styles.gradient}
        >
          <View style={styles.carouselTextContainer}>
            {item.date && (
              <View style={[styles.dateBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.dateBadgeText}>{formatDate(item.date)}</Text>
              </View>
            )}
            <Text style={styles.carouselTitle} numberOfLines={2}>
              {item.title}
            </Text>
          </View>
        </LinearGradient>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={[commonStyles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* AppBar */}
      <LinearGradient
        colors={colors.appbarGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[commonStyles.appBar, { justifyContent: 'space-between' }]}
      >
        <View style={commonStyles.appBarLeft}>
          <Pressable style={commonStyles.appBarIcon} onPress={() => navigation.openDrawer()}>
            <MaterialIcons name="menu" size={26} color="#FFFFFF" />
          </Pressable>
          <View style={styles.appBarLogoContainer}>
            <Image source={require('../../assets/logo.png')} style={styles.appBarLogo} />
          </View>
          <Text style={commonStyles.appBarTitle}>BAÜN Mobil</Text>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Section: Featured News */}
        <Text style={[styles.sectionHeader, { color: colors.text }]}>Öne Çıkan Haberler</Text>
        
        {loadingNews ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <View>
            <FlatList
              ref={flatListRef}
              data={news}
              renderItem={renderCarouselItem}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              snapToAlignment="center"
              snapToInterval={width}
              decelerationRate="fast"
              onScroll={onScroll}
              scrollEventThrottle={16}
            />
            {/* Dots */}
            <View style={styles.dotsContainer}>
              {news.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: index === activeSlide ? colors.secondary : (isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)'),
                      width: index === activeSlide ? 22 : 8,
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {/* Section: Shortcuts */}
        <Text style={[styles.sectionHeader, { color: colors.text }]}>Hızlı Erişim</Text>
        <View style={styles.shortcutsContainer}>
          {/* Shortcut 1 */}
          <Pressable 
            style={[styles.shortcutCard, { backgroundColor: colors.card }]} 
            onPress={() => navigation.navigate('Tabs', { screen: 'Etkinlik' })}
          >
            <View style={[styles.shortcutIconContainer, { backgroundColor: colors.chip }]}>
              <MaterialIcons name="event" size={24} color={colors.secondary} />
            </View>
            <Text style={[styles.shortcutText, { color: colors.text }]}>Etkinlikler</Text>
          </Pressable>

          {/* Shortcut 2 */}
          <Pressable 
            style={[styles.shortcutCard, { backgroundColor: colors.card }]} 
            onPress={() => navigation.navigate('Yemekhane')}
          >
            <View style={[styles.shortcutIconContainer, { backgroundColor: colors.chip }]}>
              <MaterialIcons name="restaurant" size={24} color={colors.secondary} />
            </View>
            <Text style={[styles.shortcutText, { color: colors.text }]}>Yemekhane</Text>
          </Pressable>

          {/* Shortcut 3 */}
          <Pressable 
            style={[styles.shortcutCard, { backgroundColor: colors.card }]} 
            onPress={() => navigation.navigate('Tabs', { screen: 'Etkinlik' })}
          >
            <View style={[styles.shortcutIconContainer, { backgroundColor: colors.chip }]}>
              <MaterialIcons name="calendar-month" size={24} color={colors.secondary} />
            </View>
            <Text style={[styles.shortcutText, { color: colors.text }]}>Akademik{"\n"}Takvim</Text>
          </Pressable>

          {/* Shortcut 4 */}
          <Pressable 
            style={[styles.shortcutCard, { backgroundColor: colors.card }]} 
            onPress={() => navigation.navigate('Tabs', { screen: 'Harita' })}
          >
            <View style={[styles.shortcutIconContainer, { backgroundColor: colors.chip }]}>
              <MaterialIcons name="directions-bus" size={24} color={colors.secondary} />
            </View>
            <Text style={[styles.shortcutText, { color: colors.text }]}>Otobüs &{"\n"}Harita</Text>
          </Pressable>
        </View>

        {/* Section: Events Header */}
        <View style={styles.eventsHeaderRow}>
          <Text style={[styles.sectionHeader, { color: colors.text, marginBottom: 0 }]}>Yaklaşan Etkinlikler</Text>
          <Pressable onPress={() => navigation.navigate('Tabs', { screen: 'Etkinlik' })}>
            <Text style={[styles.allLink, { color: colors.primary }]}>Tümü</Text>
          </Pressable>
        </View>

        {/* Section: Events List */}
        {loadingEvents ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          events.slice(0, 4).map((item, index) => (
            <Pressable 
              key={index} 
              style={[styles.eventCard, { backgroundColor: colors.card }]}
              onPress={() => navigation.navigate('Tabs', { screen: 'Etkinlik' })}
            >
              <View style={[styles.eventAvatar, { backgroundColor: colors.chip }]}>
                <MaterialIcons name="event" size={20} color={colors.secondary} />
              </View>
              <View style={styles.eventTextContainer}>
                <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={[styles.eventSubtitle, { color: colors.textMuted }]}>
                  {formatEventDate(item.start)} • {item.place}
                </Text>
              </View>
            </Pressable>
          ))
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
};
export default HomeScreen;
