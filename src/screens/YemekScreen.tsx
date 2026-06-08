import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import ApiService from '../services/apiService';
import { YemekHaftasi, YemekGunu } from '../types';
import { sampleYemek } from '../data/sampleData';
import { commonStyles } from '../theme/commonStyles';
import { styles } from '../styles/YemekScreen.styles';

const YemekScreen: React.FC = () => {
  const { theme, isDark } = useAppTheme();
  const { colors } = theme;

  const [menu, setMenu] = useState<YemekHaftasi | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async (force = false) => {
    if (!force) setLoading(true);
    setErrorMsg(null);
    setIsOffline(false);
    try {
      const api = ApiService.getInstance();
      const res = await api.fetchYemek(force);
      if (res && res.gunler && res.gunler.length > 0) {
        setMenu(res);
      } else {
        setMenu(sampleYemek);
        setIsOffline(true);
      }
    } catch (err: any) {
      setMenu(sampleYemek);
      setIsOffline(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadMenu(true);
  };

  const titleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .filter(w => w.length > 0)
      .map(w => {
        let first = w[0];
        if (first === 'i') first = 'İ';
        else if (first === 'ı') first = 'I';
        else if (first === 'ş') first = 'Ş';
        else if (first === 'ğ') first = 'Ğ';
        else if (first === 'ü') first = 'Ü';
        else if (first === 'ö') first = 'Ö';
        else if (first === 'ç') first = 'Ç';
        else first = first.toUpperCase();
        return first + w.substring(1);
      })
      .join(' ');
  };

  const getMealIconName = (index: number): keyof typeof MaterialIcons.glyphMap => {
    const icons: (keyof typeof MaterialIcons.glyphMap)[] = [
      'soup-kitchen',
      'dinner-dining',
      'rice-bowl',
      'local-drink',
    ];
    return icons[index % icons.length];
  };

  const renderGunCard = (g: YemekGunu, index: number) => (
    <View key={index} style={[styles.gunCard, { backgroundColor: colors.card }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <MaterialIcons name="today" size={18} color="#FFFFFF" />
        </View>
        <Text style={[styles.gunTitle, { color: colors.text }]}>{g.gun}</Text>
      </View>
      <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />
      {g.ogunler.map((ogun, oIdx) => (
        <View key={oIdx} style={styles.ogunRow}>
          <MaterialIcons name={getMealIconName(oIdx)} size={18} color={colors.secondary} style={styles.ogunIcon} />
          <Text style={[styles.ogunText, { color: colors.text }]}>{titleCase(ogun)}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} />}
        >
          {isOffline && (
            <View style={[
              styles.offlineBanner, 
              { 
                backgroundColor: isDark ? '#3E2723' : '#FFF3E0', 
                borderColor: isDark ? '#5D4037' : '#FFE0B2' 
              }
            ]}>
              <MaterialIcons name="cloud-off" size={18} color={isDark ? '#FFB74D' : '#E65100'} style={{ marginRight: 8 }} />
              <Text style={[styles.offlineBannerText, { color: isDark ? '#FFB74D' : '#E65100' }]}>
                Üniversite sunucusuna bağlanılamadı. Çevrimdışı/Örnek menü gösteriliyor.
              </Text>
            </View>
          )}

          {/* Header Card */}
          <View style={[styles.menuHeaderCard, { backgroundColor: colors.secondary }]}>
            <MaterialIcons name="restaurant-menu" size={24} color="#FFFFFF" />
            <Text style={styles.menuHeaderTitle}>{menu?.baslik}</Text>
          </View>

          {/* Daily Cards */}
          {menu?.gunler.map((g, idx) => renderGunCard(g, idx))}

          <Text style={styles.sourceText}>Kaynak: balikesir.edu.tr/yemek-listesi</Text>
          <View style={{ height: 16 }} />
        </ScrollView>
      )}
    </View>
  );
};
export default YemekScreen;
