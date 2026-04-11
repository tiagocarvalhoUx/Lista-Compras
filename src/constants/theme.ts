import { FontSize } from '../types';

export const FONT_SIZES: Record<FontSize, { label: string; base: number; heading: number; small: number }> = {
  small: { label: 'Pequeno', base: 14, heading: 20, small: 12 },
  medium: { label: 'Médio', base: 17, heading: 24, small: 14 },
  large: { label: 'Grande', base: 20, heading: 28, small: 16 },
};

export const COLORS = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#DBEAFE',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',

  // Light theme
  light: {
    background: '#F8FAFC',
    card: '#FFFFFF',
    text: '#1E293B',
    subtext: '#64748B',
    border: '#E2E8F0',
    header: '#2563EB',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E2E8F0',
  },

  // Dark theme
  dark: {
    background: '#0F172A',
    card: '#1E293B',
    text: '#F1F5F9',
    subtext: '#94A3B8',
    border: '#334155',
    header: '#1D4ED8',
    tabBar: '#1E293B',
    tabBarBorder: '#334155',
  },
};
