import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks/useTheme';
import { COLORS } from '../constants/theme';

interface HeaderProgressProps {
  listName: string;
  total: number;
  completed: number;
  onSettingsPress: () => void;
  onListsPress: () => void;
}

function getGradientColors(progress: number): [string, string, string] {
  if (progress === 0)   return ['#FF6B6B', '#FF8E53', '#FFC300'];
  if (progress < 0.25)  return ['#FF6B6B', '#FF8E53', '#FFC300'];
  if (progress < 0.5)   return ['#FF8E53', '#FFC300', '#F7971E'];
  if (progress < 0.75)  return ['#F7971E', '#FFD200', '#56CCF2'];
  if (progress < 1)     return ['#43E97B', '#38F9D7', '#56CCF2'];
  return ['#43E97B', '#38F9D7', '#00B09B'];
}

function getProgressEmoji(progress: number): string {
  if (progress === 0)   return '🛒';
  if (progress < 0.25)  return '🔥';
  if (progress < 0.5)   return '💪';
  if (progress < 0.75)  return '⚡';
  if (progress < 1)     return '🚀';
  return '🎉';
}

export default function HeaderProgress({
  listName,
  total,
  completed,
  onSettingsPress,
  onListsPress,
}: HeaderProgressProps) {
  const { fonts } = useTheme();
  const progress = total > 0 ? completed / total : 0;
  const remaining = total - completed;
  const pct = Math.round(progress * 100);
  const gradientColors = getGradientColors(progress);
  const emoji = getProgressEmoji(progress);

  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const shimmerOpacity = shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.0, 0.25] });

  return (
    <View style={styles.container}>

      {/* ── Title row: [name+chevron] [icon centrado] [settings] ── */}
      <View style={styles.row}>

        {/* Esquerda: nome da lista */}
        <TouchableOpacity onPress={onListsPress} style={styles.titleBtn} activeOpacity={0.8}>
          <Text style={[styles.title, { fontSize: fonts.heading }]}>{listName}</Text>
          <Text style={styles.chevron}>▾</Text>
        </TouchableOpacity>

        {/* Centro: ícone centralizado absolutamente */}
        <View style={styles.iconCenter} pointerEvents="none">
          <Image
            source={require('../../src/icon/icone-lista-1.png')}
            style={styles.listIcon}
            resizeMode="contain"
          />
        </View>

        {/* Direita: configurações */}
        <TouchableOpacity onPress={onSettingsPress} style={styles.settingsBtn} activeOpacity={0.8}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Info row */}
      <View style={styles.infoRow}>
        <Text style={[styles.subtext, { fontSize: fonts.small }]}>
          {total === 0
            ? 'Nenhum item ainda'
            : remaining === 0
            ? '🎉 Tudo concluído!'
            : `${emoji} ${remaining} de ${total} itens restantes`}
        </Text>
        {total > 0 && (
          <View style={[styles.pctBadge, { backgroundColor: gradientColors[1] + '55' }]}>
            <Text style={[styles.pctBadgeText, { fontSize: fonts.small }]}>{pct}%</Text>
          </View>
        )}
      </View>

      {/* Progress bar */}
      {total > 0 && (
        <View style={styles.progressWrapper}>
          <View style={styles.progressBg}>
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${pct}%` as any }]}
            >
              <Animated.View style={[StyleSheet.absoluteFill, styles.shimmer, { opacity: shimmerOpacity }]} />
              <View style={styles.gloss} />
            </LinearGradient>
          </View>
          <LinearGradient
            colors={[gradientColors[0] + '55', gradientColors[2] + '00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.glow, { width: `${pct}%` as any }]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    // permite posicionamento absoluto do ícone central
    position: 'relative',
  },
  titleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  chevron: {
    color: '#BFDBFE',
    fontSize: 18,
    marginLeft: 2,
  },
  // Ícone absolutamente centralizado na row
  iconCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    // não captura eventos de toque (pointerEvents="none" acima)
  },
  listIcon: {
    width: 40,
    height: 40,
  },
  settingsBtn: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  subtext: {
    color: '#DBEAFE',
    fontWeight: '500',
    flex: 1,
  },
  pctBadge: {
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  pctBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  progressWrapper: {
    position: 'relative',
  },
  progressBg: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 99,
    height: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 99,
    overflow: 'hidden',
    minWidth: 8,
  },
  shimmer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 99,
  },
  gloss: {
    position: 'absolute',
    top: 2,
    left: 6,
    right: 6,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 99,
  },
  glow: {
    height: 6,
    borderRadius: 99,
    marginTop: 3,
    opacity: 0.7,
  },
});
