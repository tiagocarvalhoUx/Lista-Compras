import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Share, Platform, Animated,
} from 'react-native';
import * as ExpoClipboard from 'expo-clipboard';
import { useStore } from '../store/useStore';
import { impactMedium, notifySuccess } from '../utils/haptics';
import { useTheme } from '../hooks/useTheme';
import { COLORS } from '../constants/theme';
import { shareText } from '../utils';
import { CATEGORY_MAP } from '../constants/categories';

// Toast simples para feedback sem Alert
function Toast({ message, visible }: { message: string; visible: boolean }) {
  if (!visible) return null;
  return (
    <View style={toastStyles.container}>
      <Text style={toastStyles.text}>{message}</Text>
    </View>
  );
}

const toastStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    backgroundColor: 'rgba(15,23,42,0.92)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 99,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  text: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});

export default function ShareScreen() {
  const { items, lists, activeListId } = useStore();
  const { colors, fonts } = useTheme();

  const listId = activeListId ?? '';
  const activeList = lists.find((l) => l.id === listId);
  const listItems = items.filter((i) => i.listId === listId);
  const pending = listItems.filter((i) => !i.completed);
  const completed = listItems.filter((i) => i.completed);
  const text = shareText(listItems, activeList?.name ?? 'Minha Lista');

  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }, []);

  // Copia para clipboard (funciona em todas as plataformas)
  const copyToClipboard = useCallback(async () => {
    try {
      await ExpoClipboard.setStringAsync(text);
      return true;
    } catch {
      return false;
    }
  }, [text]);

  // Botão "Compartilhar" — usa Web Share API no web, Share nativo no mobile
  const handleShare = useCallback(async () => {
    if (listItems.length === 0) { showToast('⚠️ Lista vazia'); return; }
    impactMedium();

    if (Platform.OS === 'web') {
      // Tenta Web Share API (funciona no Chrome/Safari mobile e alguns desktops)
      if (typeof navigator !== 'undefined' && navigator.share) {
        try {
          await navigator.share({ title: activeList?.name ?? 'Lista de Compras', text });
          showToast('✅ Compartilhado!');
          return;
        } catch (e: any) {
          // Usuário cancelou ou não suportado → cai no clipboard
          if (e?.name === 'AbortError') return;
        }
      }
      // Fallback: clipboard
      const ok = await copyToClipboard();
      showToast(ok ? '📋 Copiado! Cole onde quiser.' : '❌ Erro ao copiar');
      return;
    }

    // Mobile nativo
    try {
      await Share.share({ message: text, title: activeList?.name });
    } catch {}
  }, [listItems.length, text, activeList?.name]);

  // Botão "Copiar lista"
  const handleCopy = useCallback(async () => {
    if (listItems.length === 0) { showToast('⚠️ Lista vazia'); return; }
    notifySuccess();
    const ok = await copyToClipboard();
    showToast(ok ? '✅ Lista copiada!' : '❌ Erro ao copiar');
  }, [listItems.length, copyToClipboard]);

  // Detecta se Web Share API está disponível
  const hasNativeShare = Platform.OS !== 'web' ||
    (typeof navigator !== 'undefined' && !!navigator.share);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <Text style={[styles.headerTitle, { fontSize: fonts.heading }]}>👥 Compartilhar</Text>
        <Text style={[styles.headerSub, { fontSize: fonts.small }]}>
          {activeList?.name ?? 'Minha Lista'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Total', value: listItems.length, color: COLORS.primary },
            { label: 'Feitos', value: completed.length, color: COLORS.success },
            { label: 'Faltam', value: pending.length, color: COLORS.warning },
          ].map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.statNum, { fontSize: fonts.heading, color: s.color }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { fontSize: fonts.small, color: colors.subtext }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Preview */}
        <Text style={[styles.sectionTitle, { fontSize: fonts.small, color: colors.subtext }]}>👁️ Pré-visualização</Text>
        <View style={[styles.preview, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.previewText, { fontSize: fonts.base, color: colors.text }]} selectable>
            {text || 'Nenhum item na lista ainda.'}
          </Text>
        </View>

        {/* Ações */}
        <Text style={[styles.sectionTitle, { fontSize: fonts.small, color: colors.subtext }]}>📤 Compartilhar via</Text>

        {/* Botão Compartilhar */}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: COLORS.primary }]}
          onPress={handleShare}
          activeOpacity={0.85}
        >
          <View style={styles.actionIcon}>
            <Text style={{ fontSize: 22 }}>
              {hasNativeShare ? '📱' : '📋'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.actionTitle, { fontSize: fonts.base }]}>
              {hasNativeShare ? 'Compartilhar' : 'Copiar para área de transferência'}
            </Text>
            <Text style={[styles.actionSub, { fontSize: fonts.small }]}>
              {hasNativeShare ? 'WhatsApp, email, Telegram...' : 'Depois cole onde quiser'}
            </Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>

        {/* Botão Copiar */}
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnOutline, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={handleCopy}
          activeOpacity={0.85}
        >
          <View style={styles.actionIcon}>
            <Text style={{ fontSize: 22 }}>📄</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.actionTitle, { fontSize: fonts.base, color: colors.text }]}>Copiar lista</Text>
            <Text style={[styles.actionSub, { fontSize: fonts.small, color: colors.subtext }]}>
              Copia o texto formatado
            </Text>
          </View>
          <Text style={[styles.actionArrow, { color: COLORS.primary }]}>→</Text>
        </TouchableOpacity>

        {/* Por categoria */}
        {listItems.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { fontSize: fonts.small, color: colors.subtext }]}>📊 Por categoria</Text>
            <View style={[styles.catSummary, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {Array.from(new Set(listItems.map((i) => i.category))).map((cat, idx, arr) => {
                const config = CATEGORY_MAP[cat];
                const count = listItems.filter((i) => i.category === cat).length;
                return (
                  <View
                    key={cat}
                    style={[
                      styles.catRow,
                      idx < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                    ]}
                  >
                    <View style={[styles.catDot, { backgroundColor: config?.color }]} />
                    <Text style={{ fontSize: 18 }}>{config?.emoji}</Text>
                    <Text style={[styles.catName, { fontSize: fonts.base, color: colors.text, flex: 1 }]}>
                      {config?.label}
                    </Text>
                    <Text style={[{ fontSize: fonts.base, color: colors.subtext }]}>
                      {count} item{count !== 1 ? 's' : ''}
                    </Text>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      {/* Toast de feedback */}
      <Toast message={toast} visible={toastVisible} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  headerTitle: { color: '#FFF', fontWeight: '700', marginBottom: 4 },
  headerSub: { color: '#BFDBFE' },
  scroll: { padding: 16, paddingBottom: 80 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 14, borderWidth: 1 },
  statNum: { fontWeight: '800', marginBottom: 4 },
  statLabel: { fontWeight: '500' },
  sectionTitle: { fontWeight: '700', marginTop: 20, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.8 },
  preview: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 4 },
  previewText: { lineHeight: 22 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, padding: 16, marginBottom: 10, gap: 14,
  },
  actionBtnOutline: { borderWidth: 1.5 },
  actionIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  actionTitle: { color: '#FFF', fontWeight: '700', marginBottom: 3 },
  actionSub: { color: 'rgba(255,255,255,0.7)' },
  actionArrow: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  catSummary: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  catRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
  catDot: { width: 8, height: 8, borderRadius: 4 },
  catName: { fontWeight: '500' },
});
