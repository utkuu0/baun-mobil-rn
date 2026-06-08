import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { sampleCampuses, sampleBusStops } from '../data/sampleData';
import { CampusLocation, BusStop } from '../types';
import { commonStyles } from '../theme/commonStyles';
import { styles } from '../styles/MapScreen.styles';
import { LinearGradient } from 'expo-linear-gradient';

const MapScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme, isDark } = useAppTheme();
  const { colors } = theme;

  const webViewRef = useRef<WebView>(null);
  const [showCampus, setShowCampus] = useState(true);
  const [showBus, setShowBus] = useState(true);

  // Bottom Sheet States
  const [selectedCampus, setSelectedCampus] = useState<CampusLocation | null>(null);
  const [selectedBusStop, setSelectedBusStop] = useState<BusStop | null>(null);

  // Update WebView theme when theme changes
  useEffect(() => {
    webViewRef.current?.postMessage(JSON.stringify({ type: 'setTheme', isDark }));
  }, [isDark]);

  const toggleCampus = () => {
    const next = !showCampus;
    setShowCampus(next);
    webViewRef.current?.postMessage(JSON.stringify({ type: 'toggleCampus', value: next }));
  };

  const toggleBus = () => {
    const next = !showBus;
    setShowBus(next);
    webViewRef.current?.postMessage(JSON.stringify({ type: 'toggleBus', value: next }));
  };

  const resetCamera = () => {
    webViewRef.current?.postMessage(JSON.stringify({ type: 'recenter' }));
  };

  const getCampusTypeLabel = (type: string) => {
    switch (type) {
      case 'kampus': return 'Yerleşke';
      case 'fakulte': return 'Fakülte';
      case 'yurt': return 'Yurt';
      case 'kutuphane': return 'Kütüphane';
      case 'hastane': return 'Hastane';
      default: return type;
    }
  };

  // Generate Leaflet HTML Map
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html, #map {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          background-color: ${isDark ? '#0E1413' : '#F2F7F7'};
        }
        .campus-pin {
          background: ${colors.secondary};
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justifyContent: center;
          color: white;
          font-size: 14px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        .bus-pin {
          background: #E65100;
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justifyContent: center;
          color: white;
          font-size: 14px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', {
          zoomControl: false,
          attributionControl: false
        }).setView([39.5377, 28.0072], 14);

        var tileUrl = ${isDark} 
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
          
        var tileLayer = L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

        var campuses = ${JSON.stringify(sampleCampuses)};
        var busStops = ${JSON.stringify(sampleBusStops)};
        var showCampuses = ${showCampus};
        var showBusStops = ${showBus};

        var markers = [];

        function renderMarkers() {
          markers.forEach(function(m) { map.removeLayer(m); });
          markers = [];

          if (showCampuses) {
            campuses.forEach(function(c) {
              var icon = L.divIcon({
                className: 'campus-pin',
                html: '🎓',
                iconSize: [26, 26],
                iconAnchor: [13, 13]
              });
              var marker = L.marker([c.lat, c.lng], {icon: icon});
              marker.on('click', function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({type: 'campus', data: c}));
              });
              marker.addTo(map);
              markers.push(marker);
            });
          }

          if (showBusStops) {
            busStops.forEach(function(b) {
              var icon = L.divIcon({
                className: 'bus-pin',
                html: '🚌',
                iconSize: [26, 26],
                iconAnchor: [13, 13]
              });
              var marker = L.marker([b.lat, b.lng], {icon: icon});
              marker.on('click', function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({type: 'busStop', data: b}));
              });
              marker.addTo(map);
              markers.push(marker);
            });
          }
        }

        renderMarkers();

        window.addEventListener('message', function(event) {
          try {
            var msg = JSON.parse(event.data);
            if (msg.type === 'toggleCampus') {
              showCampuses = msg.value;
              renderMarkers();
            } else if (msg.type === 'toggleBus') {
              showBusStops = msg.value;
              renderMarkers();
            } else if (msg.type === 'recenter') {
              map.setView([39.5377, 28.0072], 14);
            } else if (msg.type === 'setTheme') {
              var newTileUrl = msg.isDark 
                ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
              
              map.eachLayer(function(layer) {
                if (layer instanceof L.TileLayer) {
                  map.removeLayer(layer);
                }
              });
              L.tileLayer(newTileUrl, { maxZoom: 19 }).addTo(map);
            }
          } catch(e) {}
        });
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
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
          <Text style={commonStyles.appBarTitle}>Harita</Text>
        </View>
        <View style={styles.appBarRight}>
          <Pressable 
            style={styles.appBarActionIcon} 
            onPress={() => navigation.navigate('OtobusTakip')}
            accessibilityLabel="Canlı Otobüs Takibi"
          >
            <MaterialIcons name="directions-bus" size={22} color="#FFFFFF" />
          </Pressable>
          <Pressable 
            style={styles.appBarActionIcon} 
            onPress={resetCamera}
            accessibilityLabel="Merkeze odaklan"
          >
            <MaterialIcons name="my-location" size={22} color="#FFFFFF" />
          </Pressable>
        </View>
      </LinearGradient>

      {/* Map View Container */}
      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: mapHtml }}
          style={styles.map}
          onMessage={(event) => {
            try {
              const msg = JSON.parse(event.nativeEvent.data);
              if (msg.type === 'campus') {
                setSelectedCampus(msg.data);
              } else if (msg.type === 'busStop') {
                setSelectedBusStop(msg.data);
              }
            } catch (err) {
              console.error(err);
            }
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />

        {/* Top Filters overlay */}
        <View style={[styles.filtersOverlay, { backgroundColor: isDark ? 'rgba(21, 32, 31, 0.95)' : 'rgba(255, 255, 255, 0.9)' }]}>
          <Pressable
            style={[
              styles.filterChip,
              { backgroundColor: showCampus ? colors.chip : 'transparent' }
            ]}
            onPress={toggleCampus}
          >
            <MaterialIcons name="school" size={16} color={showCampus ? colors.chipText : colors.textMuted} />
            <Text style={[styles.filterChipText, { color: showCampus ? colors.chipText : colors.text }]}>Yerleşkeler</Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterChip,
              { backgroundColor: showBus ? colors.chip : 'transparent' }
            ]}
            onPress={toggleBus}
          >
            <MaterialIcons name="directions-bus" size={16} color={showBus ? colors.chipText : colors.textMuted} />
            <Text style={[styles.filterChipText, { color: showBus ? colors.chipText : colors.text }]}>Duraklar</Text>
          </Pressable>
        </View>

        {/* Legend Panel overlay */}
        <View style={[styles.legendOverlay, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: colors.secondary }]}>
              <MaterialIcons name="school" size={10} color="#FFFFFF" />
            </View>
            <Text style={[styles.legendText, { color: colors.text }]}>Yerleşke / Fakülte</Text>
          </View>
          <View style={[styles.legendRow, { marginTop: 6 }]}>
            <View style={[styles.legendDot, { backgroundColor: '#E65100' }]}>
              <MaterialIcons name="directions-bus" size={10} color="#FFFFFF" />
            </View>
            <Text style={[styles.legendText, { color: colors.text }]}>Otobüs durağı</Text>
          </View>
        </View>
      </View>

      {/* Campus Location Bottom Sheet Modal */}
      {selectedCampus && (
        <Modal
          visible={!!selectedCampus}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedCampus(null)}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setSelectedCampus(null)}>
            <View style={[styles.sheetContent, { backgroundColor: colors.card }]}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetRow}>
                <MaterialIcons name="school" size={24} color={colors.secondary} />
                <Text style={[styles.sheetTitle, { color: colors.text }]}>{selectedCampus.name}</Text>
              </View>
              <Text style={[styles.sheetInfo, { color: colors.textMuted, marginTop: 10 }]}>
                Tür: {getCampusTypeLabel(selectedCampus.type)}
              </Text>
              <Text style={[styles.sheetInfo, { color: colors.textMuted, marginTop: 4 }]}>
                Konum: {selectedCampus.lat.toFixed(4)}, {selectedCampus.lng.toFixed(4)}
              </Text>
            </View>
          </Pressable>
        </Modal>
      )}

      {/* Bus Stop Bottom Sheet Modal */}
      {selectedBusStop && (
        <Modal
          visible={!!selectedBusStop}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedBusStop(null)}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setSelectedBusStop(null)}>
            <View style={[styles.sheetContent, { backgroundColor: colors.card }]}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetRow}>
                <MaterialIcons name="directions-bus" size={24} color="#E65100" />
                <Text style={[styles.sheetTitle, { color: colors.text }]}>{selectedBusStop.name}</Text>
              </View>
              
              <Text style={[styles.linesTitle, { color: colors.text, marginTop: 14 }]}>Geçen Hatlar:</Text>
              <View style={styles.linesContainer}>
                {selectedBusStop.lines.map((line, idx) => (
                  <View key={idx} style={styles.lineChip}>
                    <Text style={styles.lineChipText}>{line}</Text>
                  </View>
                ))}
              </View>

              <Pressable 
                style={styles.sheetButton}
                onPress={() => {
                  setSelectedBusStop(null);
                  navigation.navigate('OtobusTakip');
                }}
              >
                <MaterialIcons name="directions-bus" size={18} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.sheetButtonText}>Canlı Otobüs Takibi</Text>
              </Pressable>
              <Text style={styles.sheetTipText}>
                Resmi BTT canlı haritası uygulama içinde açılır; üniversite hattını seçerek kampüse gelen otobüsleri görebilirsiniz.
              </Text>
            </View>
          </Pressable>
        </Modal>
      )}
    </SafeAreaView>
  );
};
export default MapScreen;
