import { useStore } from '../store/useStore';
import { COLORS, FONT_SIZES } from '../constants/theme';

export function useTheme() {
  const { settings } = useStore();
  const { theme, fontSize } = settings;

  const colors = theme === 'dark' ? COLORS.dark : COLORS.light;
  const fonts = FONT_SIZES[fontSize];

  return { colors, fonts, theme, fontSize, isDark: theme === 'dark' };
}
