import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const BauColors = {
  turkuaz: '#0BBEC2', // Bright turquoise
  koyuTeal: '#006F68', // Dark teal
  beyaz: '#FFFFFF',
  acikZemin: '#F5FAF9', // Cleaner, more premium light teal-gray
  karanlikZemin: '#0A1110', // Deep midnight teal-black for modern dark mode
  koyuAppbar: '#004A45', // Deeper starting teal for dark app bar
  karanlikKart: '#142220', // Lighter container card in dark mode
  koyuCip: '#173D39', // Clean glowing chip in dark mode
  acikCip: '#E4F6F6', // Soft pastel teal chip in light mode
  textAcik: '#2D3E3B', // Rich dark slate-teal text
  textKaranlik: '#E2EFEB', // Soft white-teal text
  textMutedAcik: '#5E7471', // Soft muted text in light mode
  textMutedKaranlik: '#8AA3A0', // Soft muted text in dark mode
  borderAcik: '#E6EFEF', // Softer border lines in light mode
  borderKaranlik: '#203432', // Clean sharp border lines in dark mode
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
    appbarGradient: [BauColors.koyuTeal, '#00978E'] as readonly [string, string], // deep teal to medium teal-green
    appbarText: '#FFFFFF',
    tabActive: BauColors.koyuTeal,
    tabInactive: 'rgba(45, 62, 59, 0.45)',
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
    appbarGradient: [BauColors.koyuAppbar, '#005E56'] as readonly [string, string], // dark teal to light teal
    appbarText: '#FFFFFF',
    tabActive: BauColors.turkuaz,
    tabInactive: 'rgba(226, 239, 235, 0.45)',
  },
};
