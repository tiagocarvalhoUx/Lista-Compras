import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Share, Alert, Platform } from 'react-native';
import * as ExpoClipboard from 'expo-clipboard';
import { useStore } from '../store/useStore';
import { impactMedium, notifySuccess } from '../utils/haptics';
import { useTheme } from '../hooks/useTheme';
import { COLORS } from '../constants/theme';
import { shareText } from '../utils';
import { CATEGORY_MAP } from '../constants/categories';

export default function ShareScreen() {
  const { items, lists, activeListId } = useStore();
  const { colors, fonts } = useTheme();

  const listId = activeListId ?? '';
  const activeList = lists.find((l) => l.id === listId);
  const listItems = items.filter((i) => i.listId === listId);
  const pending = listItems.filter((i) => !i.completed);
  const completed = listItems.filter((i) => i.completed);

  const text = shareText(listItems, activeList?.name ?? 'Minha Lista');

  const handleShare = async () => {
    impactMedium();
    if (Platform.OS === 'web') {
      // Web: fallback to clipboard + alert
      await ExpoClipboard.setStringAsync(text);
      Alert.alert('📋 Copiado!', 'Cole no WhatsApp, email ou onde quiser.');
      return;
    }
    try {
      await Share.share({ message: text, title: activeList?.name });
    } catch {}
  };

  const handleCopy = async () => {
    await ExpoClipboard.setStringAsync(text);
    notifySuccess();
    Alert.alert('✅ Copiado!', 'Lista copiada para a área de transferência');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <Text style={[styles.headerTitle, { fontSize: fonts.heading }]}>👥 Compartilhar</Text>
        <Text style={[styles.headerSub, { fontSize: fonts.small }]}>{activeList?.name ?? 'Minha Lista'}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statNum, { fontSize: fonts.heading, color: COLORS.primary }]}>{listItems.length}</Text>
            <Text style={[styles.statLabel, { fontSize: fonts.small, color: colors.subtext }]}>Total</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statNum, { fontSize: fonts.heading, color: COLORS.success }]}>{completed.length}</Text>
            <Text style={[styles.statLabel, { fontSize: fonts.small, color: colors.subtext }]}>Concluídos</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statNum, { fontSize: fonts.heading, color: COLORS.warning }]}>{pending.length}</Text>
            <Text style={[styles.statLabel, { fontSize: fonts.small, color: colors.subtext }]}>Restantes</Text>
          </View>
        </View>

        {/* Preview */}
        <Text style={[styles.sectionTitle, { fontSize: fonts.base, color: colors.subtext }]}>👁️ Pré-visualização</Text>
        <View style={[styles.preview, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.previewText, { fontSize: fonts.base, color: colors.text }]}>{text || 'Lista vazia'}</Text>
        </View>

        {/* Actions */}
        <Text style={[styles.sectionTitle, { fontSize: fonts.base, color: colors.subtext }]}>📤 Compartilhar via</Text>

        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.primary }]} onPress={handleShare}>
          <Text style={styles.actionEmoji}>📱</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.actionTitle, { fontSize: fonts.base }]}>Compartilhar</Text>
            <Text style={[styles.actionSub, { fontSize: fonts.small }]}>WhatsApp, email, Telegram...</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]} onPress={handleCopy}>
          <Text style={styles.actionEmoji}>📋</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.actionTitle, { fontSize: fonts.base, color: colors.text }]}>Copiar lista</Text>
            <Text style={[styles.actionSub, { fontSize: fonts.small, color: colors.subtext }]}>Copia o texto da lista</Text>
          </View>
          <Text style={[styles.actionArrow, { color: colors.subtext }]}>→</Text>
        </TouchableOpacity>

        {/* Category summary */}
        {listItems.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { fontSize: fonts.base, color: colors.subtext }]}>📊 Por categoria</Text>
            <View style={[styles.catSummary, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {Array.from(new Set(listItems.map((i) => i.category))).map((cat, idx, arr) => {
                const config = CATEGORY_MAP[cat];
                const count = listItems.filter((i) => i.category === cat).length;
                return (
                  <View key={cat} style={[styles.catRow, idx < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                    <View style={[styles.catDot, { backgroundColor: config?.color }]} />
                    <Text style={styles.catEmoji}>{config?.emoji}</Text>
                    <Text style={[styles.catName, { fontSize: fonts.base, color: colors.text, flex: 1 }]}>{config?.label}</Text>
                    <Text style={[styles.catCount, { fontSize: fonts.base, color: colors.subtext }]}>{count} item{count !== 1 ? 's' : ''}</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  headerTitle: { color: '#FFF', fontWeight: '700', marginBottom: 4 },
  headerSub: { color: '#BFDBFE' },
  scroll: { padding: 16, paddingBottom: 60 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  statCard: {
    flex: 1, alignItems: 'center', paddingVertical: 16,
    borderRadius: 14, borderWidth: 1,
  },
  statNum: { fontWeight: '800', marginBottom: 4 },
  statLabel: { fontWeight: '500' },
  sectionTitle: { fontWeight: '600', marginTop: 20, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  preview: {
    borderRadius: 14, borderWidth: 1,
    padding: 16, marginBottom: 4,
  },
  previewText: { lineHeight: 22 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, padding: 16,
    marginBottom: 10, gap: 12,
  },
  actionEmoji: { fontSize: 24 },
  actionTitle: { color: '#FFF', fontWeight: '700', marginBottom: 2 },
  actionSub: { color: 'rgba(255,255,255,0.7)' },
  actionArrow: { color: '#FFF', fontSize: 22, fontWeight: '700' },
  catSummary: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  catRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 8 },
  catDot: { width: 8, height: 8, borderRadius: 4 },
  catEmoji: { fontSize: 18 },
  catName: { fontWeight: '500' },
  catCount: {},
});
