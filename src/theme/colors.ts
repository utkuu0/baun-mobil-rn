import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const BauColors = {
  turkuaz: '#0BBEC2', // Bright turquoise
  koyuTeal: '#006F68', // Dark teal
  beyaz: '#FFFFFF',
  acikZemin: '#F2F7F7',
  karanlikZemin: '#0E1413',
  koyuAppbar: '#00413C',
  karanlikKart: '#15201F',
  koyuCip: '#13322F',
  acikCip: '#E0F4F4',
  textAcik: '#333333',
  textKaranlik: '#E0E0E0',
  textMutedAcik: '#666666',
  textMutedKaranlik: '#A0A0A0',
  borderAcik: '#E0EAE9',
  borderKaranlik: '#243331',
};

export const lightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: BauColors.turkuaz,
    secondary: BauColors.koyuTeal,
    background: BauColors.acikZemin,
    card: '#FFFFFF',
    text: BauColors.textAcik,
    textMuted: BauColors.textMutedAcik,
    border: BauColors.borderAcik,
    chip: BauColors.acikCip,
    chipText: BauColors.koyuTeal,
    appbar: BauColors.koyuTeal,
    appbarText: '#FFFFFF',
    tabActive: BauColors.koyuTeal,
    tabInactive: 'rgba(0, 0, 0, 0.45)',
  },
};

export const darkTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: BauColors.turkuaz,
    secondary: BauColors.turkuaz,
    background: BauColors.karanlikZemin,
    card: BauColors.karanlikKart,
    text: BauColors.textKaranlik,
    textMuted: BauColors.textMutedKaranlik,
    border: BauColors.borderKaranlik,
    chip: BauColors.koyuCip,
    chipText: BauColors.turkuaz,
    appbar: BauColors.koyuAppbar,
    appbarText: '#FFFFFF',
    tabActive: BauColors.turkuaz,
    tabInactive: 'rgba(255, 255, 255, 0.54)',
  },
};
