import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
    <Pressable style={[styles.card, { backgroundColor: colors.card }]} onPress={() => setSelectedEvent(item)}>
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* AppBar */}
      <View style={[styles.appBar, { backgroundColor: colors.appbar }]}>
        <View style={styles.appBarLeft}>
          <Pressable style={styles.appBarIcon} onPress={() => navigation.openDrawer()}>
            <MaterialIcons name="menu" size={26} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.appBarTitle}>Etkinlik & Takvim</Text>
        </View>
      </View>

      {renderHeader()}

      {activeTab === 'events' ? (
        loading ? (
          <View style={styles.loadingContainer}>
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
  offlineNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(230, 81, 0, 0.08)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(230, 81, 0, 0.2)',
  },
  offlineText: {
    fontSize: 12,
    color: '#E65100',
    marginLeft: 10,
    flex: 1,
  },
  card: {
    borderRadius: 16,
    marginVertical: 6,
    overflow: 'hidden',
    elevation: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  cardImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dateBadgeContainer: {
    marginRight: 12,
  },
  dateBadge: {
    width: 54,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  dateBadgeDay: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  dateBadgeMonth: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '600',
  },
  textDetails: {
    flex: 1,
  },
  chip: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 6,
  },
  chipText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 20,
    marginBottom: 6,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  iconRowText: {
    fontSize: 12,
    marginLeft: 6,
    flex: 1,
  },
  calendarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    padding: 14,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
  },
  calendarAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  calendarTextContainer: {
    flex: 1,
  },
  calendarTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  calendarSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '80%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  modalHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  modalPadding: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 26,
    marginVertical: 6,
  },
  modalDivider: {
    height: 1,
    marginVertical: 14,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  modalInfoTextContainer: {
    marginLeft: 14,
    flex: 1,
  },
  modalInfoLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  descriptionContainer: {
    marginTop: 18,
  },
  descriptionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionBody: {
    fontSize: 14,
    lineHeight: 22,
  },
});

export default EventsScreen;
