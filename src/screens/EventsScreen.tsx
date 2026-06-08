import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import ApiService from '../services/apiService';
import { sampleCalendar, sampleEvents } from '../data/sampleData';
import { ApiEvent, CalendarItem } from '../types';
import { commonStyles } from '../theme/commonStyles';
import { styles } from '../styles/EventsScreen.styles';
import { LinearGradient } from 'expo-linear-gradient';

interface EventsScreenProps {
  navigation: any;
}

const EventsScreen: React.FC<EventsScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { colors } = theme;

  const [activeTab, setActiveTab] = useState<'events' | 'calendar'>('events');
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLive, setIsLive] = useState(true);
  
  // Detail Modal State
  const [selectedEvent, setSelectedEvent] = useState<ApiEvent | null>(null);

  useEffect(() => {
    if (activeTab === 'events') {
      loadEvents(true);
    }
  }, [activeTab]);

  const loadEvents = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const api = ApiService.getInstance();
      const res = await api.fetchEvents(refreshing);
      if (res && res.length > 0) {
        setEvents(res);
        setIsLive(true);
      } else {
        useFallbackEvents();
      }
    } catch (_) {
      useFallbackEvents();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const useFallbackEvents = () => {
    setIsLive(false);
    const sorted = [...sampleEvents].sort((a, b) => a.start.localeCompare(b.start));
    setEvents(sorted.map(e => ({
      id: Number(e.id),
      name: e.title,
      description: e.description,
      start: e.start,
      place: e.location,
      unit: e.category,
      typeName: e.category,
    })));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadEvents(false);
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleString('tr-TR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCalendarRange = (startStr: string, endStr?: string) => {
    const start = new Date(startStr);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    const startFormatted = isNaN(start.getTime()) ? startStr : start.toLocaleDateString('tr-TR', options);
    
    if (!endStr) return startFormatted;
    
    const end = new Date(endStr);
    const endFormatted = isNaN(end.getTime()) ? endStr : end.toLocaleDateString('tr-TR', options);
    return `${startFormatted} - ${endFormatted}`;
  };

  const getMonthAbbr = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    return months[date.getMonth()];
  };

  const getDayNum = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.getDate().toString();
  };

  const renderEventCard = ({ item }: { item: ApiEvent }) => (
    <Pressable style={[commonStyles.card, { backgroundColor: colors.card }]} onPress={() => setSelectedEvent(item)}>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      )}
      <View style={styles.cardContent}>
        <View style={styles.row}>
          <View style={styles.dateBadgeContainer}>
            <View style={[styles.dateBadge, { backgroundColor: colors.secondary }]}>
              <Text style={styles.dateBadgeDay}>{getDayNum(item.start)}</Text>
              <Text style={styles.dateBadgeMonth}>{getMonthAbbr(item.start)}</Text>
            </View>
          </View>
          <View style={styles.textDetails}>
            {item.typeName && (
              <View style={[styles.chip, { backgroundColor: colors.chip }]}>
                <Text style={[styles.chipText, { color: colors.chipText }]}>{item.typeName}</Text>
              </View>
            )}
            <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
              {item.name}
            </Text>
            <View style={styles.iconRow}>
              <MaterialIcons name="schedule" size={14} color={colors.textMuted} />
              <Text style={[styles.iconRowText, { color: colors.textMuted }]}>{formatDateTime(item.start)}</Text>
            </View>
            {item.place && (
              <View style={styles.iconRow}>
                <MaterialIcons name="place" size={14} color={colors.textMuted} />
                <Text style={[styles.iconRowText, { color: colors.textMuted }]} numberOfLines={1}>{item.place}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );

  const renderCalendarCard = ({ item }: { item: CalendarItem }) => {
    const isRange = !!item.end;
    return (
      <View style={[styles.calendarCard, { backgroundColor: colors.card }]}>
        <View style={[styles.calendarAvatar, { backgroundColor: colors.chip }]}>
          <MaterialIcons name={isRange ? "date-range" : "event-note"} size={22} color={colors.secondary} />
        </View>
        <View style={styles.calendarTextContainer}>
          <Text style={[styles.calendarTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.calendarSubtitle, { color: colors.textMuted }]}>
            {formatCalendarRange(item.start, item.end)}
          </Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
      <Pressable
        style={[
          styles.tabButton,
          { 
            borderBottomColor: activeTab === 'events' ? colors.primary : 'transparent',
            borderBottomWidth: activeTab === 'events' ? 3 : 0
          }
        ]}
        onPress={() => setActiveTab('events')}
      >
        <MaterialIcons 
          name="event" 
          size={18} 
          color={activeTab === 'events' ? colors.primary : colors.textMuted} 
        />
        <Text 
          style={[
            styles.tabButtonText, 
            { color: activeTab === 'events' ? colors.primary : colors.textMuted }
          ]}
        >
          Etkinlikler
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.tabButton,
          { 
            borderBottomColor: activeTab === 'calendar' ? colors.primary : 'transparent',
            borderBottomWidth: activeTab === 'calendar' ? 3 : 0
          }
        ]}
        onPress={() => setActiveTab('calendar')}
      >
        <MaterialIcons 
          name="calendar-month" 
          size={18} 
          color={activeTab === 'calendar' ? colors.primary : colors.textMuted} 
        />
        <Text 
          style={[
            styles.tabButtonText, 
            { color: activeTab === 'calendar' ? colors.primary : colors.textMuted }
          ]}
        >
          Akademik Takvim
        </Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={[commonStyles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* AppBar */}
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
          <Text style={commonStyles.appBarTitle}>Etkinlik & Takvim</Text>
        </View>
      </LinearGradient>

      {renderHeader()}

      {activeTab === 'events' ? (
        loading ? (
          <View style={commonStyles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={events}
            renderItem={renderEventCard}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} />
            }
            ListHeaderComponent={
              !isLive ? (
                <View style={styles.offlineNotice}>
                  <MaterialIcons name="cloud-off" size={20} color="#E65100" />
                  <Text style={styles.offlineText}>
                    Canlı etkinlikler yüklenemedi. Çevrimdışı kayıtlar gösteriliyor.
                  </Text>
                </View>
              ) : null
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        <FlatList
          data={[...sampleCalendar].sort((a, b) => a.start.localeCompare(b.start))}
          renderItem={renderCalendarCard}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Detail Modal */}
      {selectedEvent && (
        <Modal
          visible={!!selectedEvent}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSelectedEvent(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
              <View style={[styles.modalHeader, { backgroundColor: colors.appbar }]}>
                <Text style={styles.modalHeaderTitle} numberOfLines={1}>Etkinlik Detayı</Text>
                <Pressable onPress={() => setSelectedEvent(null)} style={styles.modalCloseButton}>
                  <MaterialIcons name="close" size={24} color="#FFFFFF" />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {selectedEvent.imageUrl && (
                  <Image source={{ uri: selectedEvent.imageUrl }} style={styles.modalImage} />
                )}
                
                <View style={styles.modalPadding}>
                  {selectedEvent.typeName && (
                    <View style={[styles.chip, { backgroundColor: colors.chip, alignSelf: 'flex-start', marginBottom: 8 }]}>
                      <Text style={[styles.chipText, { color: colors.chipText }]}>{selectedEvent.typeName}</Text>
                    </View>
                  )}
                  
                  <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedEvent.name}</Text>
                  
                  <View style={[styles.modalDivider, { backgroundColor: colors.border }]} />

                  <View style={styles.modalInfoRow}>
                    <MaterialIcons name="schedule" size={20} color={colors.secondary} />
                    <View style={styles.modalInfoTextContainer}>
                      <Text style={[styles.modalInfoLabel, { color: colors.textMuted }]}>Tarih & Saat</Text>
                      <Text style={[styles.modalInfoValue, { color: colors.text }]}>{formatDateTime(selectedEvent.start)}</Text>
                    </View>
                  </View>

                  {selectedEvent.place && (
                    <View style={styles.modalInfoRow}>
                      <MaterialIcons name="place" size={20} color={colors.secondary} />
                      <View style={styles.modalInfoTextContainer}>
                        <Text style={[styles.modalInfoLabel, { color: colors.textMuted }]}>Yer / Konum</Text>
                        <Text style={[styles.modalInfoValue, { color: colors.text }]}>{selectedEvent.place}</Text>
                      </View>
                    </View>
                  )}

                  {selectedEvent.unit && (
                    <View style={styles.modalInfoRow}>
                      <MaterialIcons name="apartment" size={20} color={colors.secondary} />
                      <View style={styles.modalInfoTextContainer}>
                        <Text style={[styles.modalInfoLabel, { color: colors.textMuted }]}>Düzenleyen Birim</Text>
                        <Text style={[styles.modalInfoValue, { color: colors.text }]}>{selectedEvent.unit}</Text>
                      </View>
                    </View>
                  )}

                  {selectedEvent.description && (
                    <View style={styles.descriptionContainer}>
                      <Text style={[styles.descriptionHeader, { color: colors.text }]}>Etkinlik Açıklaması</Text>
                      <Text style={[styles.descriptionBody, { color: colors.text }]}>{selectedEvent.description}</Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};
export default EventsScreen;
