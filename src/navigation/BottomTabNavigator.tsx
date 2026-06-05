import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';

// Import Screens (we will create them next)
import HomeScreen from '../screens/HomeScreen';
import NewsScreen from '../screens/NewsScreen';
import EventsScreen from '../screens/EventsScreen';
import MapScreen from '../screens/MapScreen';

export type BottomTabParamList = {
  Anasayfa: undefined;
  Haberler: undefined;
  Etkinlik: undefined;
  Harita: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator: React.FC = () => {
  const { theme } = useAppTheme();
  const { colors } = theme;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap = 'home';

          if (route.name === 'Anasayfa') {
            iconName = 'home';
          } else if (route.name === 'Haberler') {
            iconName = focused ? 'article' : 'library-books';
          } else if (route.name === 'Etkinlik') {
            iconName = focused ? 'event' : 'event-note';
          } else if (route.name === 'Harita') {
            iconName = 'map';
          }

          return <MaterialIcons name={iconName} size={focused ? 24 : 22} color={color} />;
        },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Anasayfa" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Anasayfa' }}
      />
      <Tab.Screen 
        name="Haberler" 
        component={NewsScreen} 
        options={{ tabBarLabel: 'Haberler' }}
      />
      <Tab.Screen 
        name="Etkinlik" 
        component={EventsScreen} 
        options={{ tabBarLabel: 'Etkinlik' }}
      />
      <Tab.Screen 
        name="Harita" 
        component={MapScreen} 
        options={{ tabBarLabel: 'Harita' }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
