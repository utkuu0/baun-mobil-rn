import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import * as Linking from 'expo-linking';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { sampleRehber } from '../data/sampleData';
import { RehberKaydi } from '../types';
import { commonStyles } from '../theme/commonStyles';
import { styles } from '../styles/RehberScreen.styles';

const KATEGORI_SIRA = ['Acil', 'Genel', 'Fakülte'];

const RehberScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const { colors } = theme;

  const [searchQuery, setSearchQuery] = useState('');

  const makeCall = async (phone: string) => {
    try {
      await Linking.openURL(`tel:${phone}`);
    } catch (_) {
      Alert.alert('Hata', `Arama başlatılamadı: ${phone}`);
    }
  };

  const sendEmail = async (email: string) => {
    try {
      await Linking.openURL(`mailto:${email}`);
    } catch (_) {
      Alert.alert('Hata', `E-posta uygulaması açılamadı: ${email}`);
    }
  };

  const formatTel = (t: string) => {
    const d = t.replace(/\D/g, '');
    if (d.startsWith('90') && d.length === 12) {
      const n = d.substring(2);
      return `0${n.substring(0, 3)} ${n.substring(3, 6)} ${n.substring(6, 8)} ${n.substring(8)}`;
    }
    return t;
  };

  const getKatIcon = (k: string): keyof typeof MaterialIcons.glyphMap => {
    switch (k) {
      case 'Acil': return 'emergency';
      case 'Fakülte': return 'school';
      default: return 'apartment';
    }
  };

  const getKatColor = (k: string) => {
    switch (k) {
      case 'Acil': return '#D32F2F';
      case 'Fakülte': return colors.primary;
      default: return colors.secondary;
    }
  };

  // Filter entries based on search query
  const filteredRehber = sampleRehber.filter(r => 
    r.birim.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.telefon.includes(searchQuery)
  );

  // Group by category
  const byKat: { [key: string]: RehberKaydi[] } = {};
  for (const r of filteredRehber) {
    if (!byKat[r.kategori]) byKat[r.kategori] = [];
    byKat[r.kategori].push(r);
  }

  // Sort categories
  const categories = [
    ...KATEGORI_SIRA.filter(k => byKat[k] !== undefined),
    ...Object.keys(byKat).filter(k => !KATEGORI_SIRA.includes(k))
  ];

  return (
    <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
      {/* Search Input */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <MaterialIcons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            placeholder="Rehberde ara (örn: Öğrenci, Dekanlık...)"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: colors.text }]}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <MaterialIcons name="clear" size={18} color={colors.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {categories.length === 0 ? (
          <View style={styles.noResultContainer}>
            <MaterialIcons name="search-off" size={48} color={colors.textMuted} />
            <Text style={[styles.noResultText, { color: colors.textMuted }]}>Aramanızla eşleşen kayıt bulunamadı.</Text>
          </View>
        ) : (
          categories.map((kat, idx) => {
            const katColor = getKatColor(kat);
            return (
              <View key={idx} style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons name={getKatIcon(kat)} size={20} color={katColor} />
                  <Text style={[styles.sectionTitle, { color: katColor }]}>{kat}</Text>
                </View>
                {byKat[kat].map((item, rIdx) => (
                  <View key={rIdx} style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={[styles.avatar, { backgroundColor: `${katColor}22` }]}>
                      <MaterialIcons name="account-balance" size={20} color={katColor} />
                    </View>
                    <View style={styles.infoContainer}>
                      <Text style={[styles.unitTitle, { color: colors.text }]}>{item.birim}</Text>
                      <Text style={[styles.unitPhone, { color: colors.textMuted }]}>
                        {formatTel(item.telefon)}
                        {item.email ? `\n${item.email}` : ''}
                      </Text>
                    </View>
                    <View style={styles.actionsContainer}>
                      {item.email && (
                        <Pressable style={styles.actionButton} onPress={() => sendEmail(item.email!)}>
                          <MaterialIcons name="email" size={20} color={colors.secondary} />
                        </Pressable>
                      )}
                      <Pressable style={styles.actionButton} onPress={() => makeCall(item.telefon)}>
                        <MaterialIcons name="phone" size={20} color="#2E7D32" />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};
export default RehberScreen;
