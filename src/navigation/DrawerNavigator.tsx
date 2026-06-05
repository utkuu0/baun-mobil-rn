import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAppTheme } from '../theme/ThemeContext';
import AppDrawer from '../widgets/AppDrawer';
import BottomTabNavigator from './BottomTabNavigator';

// Import Screens (we will create them next)
import YemekScreen from '../screens/YemekScreen';
import CanliOtobusScreen from '../screens/CanliOtobusScreen';
import RehberScreen from '../screens/RehberScreen';
import WebPageScreen from '../screens/WebPageScreen';

export type DrawerParamList = {
  Tabs: { screen?: string } | undefined;
  Yemekhane: undefined;
  OtobusTakip: undefined;
  Rehber: undefined;
  WebPage: { title: string; url: string };
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator: React.FC = () => {
  const { theme } = useAppTheme();
  const { colors } = theme;

  return (
    <Drawer.Navigator
      drawerContent={(props) => <AppDrawer {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.appbar,
          elevation: 0, // Android shadow
          shadowOpacity: 0, // iOS shadow
        },
        headerTintColor: colors.appbarText,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen 
        name="Tabs" 
        component={BottomTabNavigator} 
        options={{ headerShown: false }}
      />
      <Drawer.Screen 
        name="Yemekhane" 
        component={YemekScreen} 
        options={{ title: 'Yemekhane Menüsü' }}
      />
      <Drawer.Screen 
        name="OtobusTakip" 
        component={CanliOtobusScreen} 
        options={{ title: 'Canlı Otobüs Takibi' }}
      />
      <Drawer.Screen 
        name="Rehber" 
        component={RehberScreen} 
        options={{ title: 'Rehber / Telefonlar' }}
      />
      <Drawer.Screen 
        name="WebPage" 
        component={WebPageScreen} 
        options={({ route }) => ({ title: route.params?.title || 'Detay' })}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
