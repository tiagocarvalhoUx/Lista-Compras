import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const MOBILE_MAX_WIDTH = 480;

interface Props {
  children: React.ReactNode;
}

export default function DesktopWrapper({ children }: Props) {
  const { colors, isDark } = useTheme();

  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View style={[styles.outerContainer, { backgroundColor: isDark ? '#0A0F1E' : '#E8EDF5' }]}>
      <View
        style={[
          styles.phoneFrame,
          {
            backgroundColor: colors.background,
            shadowColor: isDark ? '#000' : '#94A3B8',
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%' as any,
  },
  phoneFrame: {
    width: '100%' as any,
    maxWidth: MOBILE_MAX_WIDTH,
    height: '100%' as any,
    maxHeight: 900,
    overflow: 'hidden',
    borderRadius: Platform.OS === 'web' ? 24 : 0,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 16,
  },
});
