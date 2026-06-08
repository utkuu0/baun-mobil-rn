import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Switch, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme/ThemeContext';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';

const AppDrawer: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
  const { isDark, theme, toggleTheme } = useAppTheme();
  const { colors } = theme;

  const navigateToTab = (tabName: string) => {
    navigation.closeDrawer();
    navigation.navigate('Tabs', { screen: tabName });
  };

  const pushScreen = (screenName: string) => {
    navigation.closeDrawer();
    navigation.navigate(screenName);
  };

  const showAbout = () => {
    navigation.closeDrawer();
    Alert.alert(
      'BAÜN Mobil',
      'Balıkesir Üniversitesi resmi olmayan öğrenci uygulaması.\n\nVeriler balikesir.edu.tr ve ilgili açık kaynaklardan alınmaktadır.\n\nSürüm: 1.0.0',
      [{ text: 'Tamam', style: 'cancel' }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Header */}
      <LinearGradient
        colors={colors.appbarGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>BAÜN Mobil</Text>
          <Text style={styles.headerSubtitle}>Balıkesir Üniversitesi</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Section: Menu */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>MENÜ</Text>
        
        <Pressable style={styles.menuItem} onPress={() => navigateToTab('Anasayfa')}>
          <MaterialIcons name="home" size={22} color={colors.secondary} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>Anasayfa</Text>
        </Pressable>

        <Pressable style={styles.menuItem} onPress={() => navigateToTab('Haberler')}>
          <MaterialIcons name="article" size={22} color={colors.secondary} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>Haberler</Text>
        </Pressable>

        <Pressable style={styles.menuItem} onPress={() => navigateToTab('Etkinlik')}>
          <MaterialIcons name="event" size={22} color={colors.secondary} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>Etkinlik & Takvim</Text>
        </Pressable>

        <Pressable style={styles.menuItem} onPress={() => navigateToTab('Harita')}>
          <MaterialIcons name="map" size={22} color={colors.secondary} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>Harita & Otobüs</Text>
        </Pressable>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Section: Student */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>ÖĞRENCİ</Text>

        <Pressable style={styles.menuItem} onPress={() => pushScreen('Yemekhane')}>
          <MaterialIcons name="restaurant" size={22} color={colors.secondary} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>Yemekhane Menüsü</Text>
        </Pressable>

        <Pressable style={styles.menuItem} onPress={() => pushScreen('OtobusTakip')}>
          <MaterialIcons name="directions-bus" size={22} color={colors.secondary} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>Canlı Otobüs Takibi</Text>
        </Pressable>

        <Pressable style={styles.menuItem} onPress={() => pushScreen('Rehber')}>
          <MaterialIcons name="contact-phone" size={22} color={colors.secondary} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>Rehber / Telefonlar</Text>
        </Pressable>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Theme and About */}
        <View style={styles.switchItem}>
          <View style={styles.switchLabelContainer}>
            <Ionicons name={isDark ? "moon" : "sunny"} size={22} color={colors.secondary} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Karanlık Mod</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor={isDark ? colors.secondary : '#f4f3f4'}
          />
        </View>

        <Pressable style={styles.menuItem} onPress={showAbout}>
          <MaterialIcons name="info-outline" size={22} color={colors.secondary} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>Hakkında</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  logoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  logo: {
    width: 52,
    height: 52,
    resizeMode: 'contain',
  },
  headerTextContainer: {
    marginLeft: 14,
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    marginTop: 2,
  },
  scrollContent: {
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 16,
    marginTop: 12,
    marginBottom: 6,
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 16,
  },
  divider: {
    height: 1,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  switchLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default AppDrawer;
