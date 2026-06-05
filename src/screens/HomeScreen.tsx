import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  Dimensions,
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

const { width } = Dimensions.get('window');
const CAROUSEL_WIDTH = width * 0.92;

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme();
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* AppBar */}
      <View style={[styles.appBar, { backgroundColor: colors.appbar }]}>
        <View style={styles.appBarLeft}>
          <Pressable style={styles.appBarIcon} onPress={() => navigation.openDrawer()}>
            <MaterialIcons name="menu" size={26} color="#FFFFFF" />
          </Pressable>
          <View style={styles.appBarLogoContainer}>
            <Image source={require('../../assets/logo.png')} style={styles.appBarLogo} />
          </View>
          <Text style={styles.appBarTitle}>BAÜN Mobil</Text>
        </View>
      </View>

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
              contentContainerStyle={{ paddingHorizontal: (width - CAROUSEL_WIDTH) / 2 }}
            />
            {/* Dots */}
            <View style={styles.dotsContainer}>
              {news.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: index === activeSlide ? colors.secondary : 'rgba(0,0,0,0.2)',
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginRight: 10,
  },
  appBarLogoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 2,
    marginRight: 10,
  },
  appBarLogo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  appBarTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingTop: 8,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 10,
  },
  loadingContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselItem: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselCard: {
    width: CAROUSEL_WIDTH,
    height: 210,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.2,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  carouselImageFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
    justifyContent: 'flex-end',
  },
  carouselTextContainer: {
    padding: 14,
  },
  dateBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 6,
  },
  dateBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  carouselTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  shortcutsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  shortcutCard: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  shortcutIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  shortcutText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 15,
  },
  eventsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 16,
    marginTop: 16,
    marginBottom: 10,
  },
  allLink: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 4,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 5,
    padding: 12,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  eventAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventTextContainer: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  eventSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },
});

export default HomeScreen;
