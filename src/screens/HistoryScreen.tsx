import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, FlatList,
} from 'react-native';
import { useStore } from '../store/useStore';
import { impactMedium, notifySuccess } from '../utils/haptics';
import { useTheme } from '../hooks/useTheme';
import { QUICK_ADD_ITEMS, CATEGORY_MAP } from '../constants/categories';
import { COLORS } from '../constants/theme';
import { CategoryId } from '../types';

export default function HistoryScreen() {
  const { items, activeListId, addItem } = useStore();
  const { colors, fonts } = useTheme();

  const listId = activeListId ?? '';
  const existingNames = new Set(items.filter((i) => i.listId === listId).map((i) => i.name.toLowerCase()));

  // Completed items from history (all lists)
  const historyItems = items.filter((i) => i.completed);

  // Recurring items
  const recurringItems = items.filter((i) => i.recurrence !== 'none' && i.listId === listId);

  const handleQuickAdd = (item: typeof QUICK_ADD_ITEMS[0]) => {
    if (existingNames.has(item.name.toLowerCase())) return;
    impactMedium();
    addItem({ ...item, completed: false, recurrence: 'none', listId });
  };

  const handleAddRecurring = (recurrence: 'weekly' | 'monthly') => {
    QUICK_ADD_ITEMS.slice(0, 4).forEach((item) => {
      if (!existingNames.has(item.name.toLowerCase())) {
        addItem({ ...item, completed: false, recurrence, listId });
      }
    });
    notifySuccess();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <Text style={[styles.headerTitle, { fontSize: fonts.heading }]}>🕒 Histórico</Text>
        <Text style={[styles.headerSub, { fontSize: fonts.small }]}>Itens recorrentes e adição rápida</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Recurring section */}
        <Text style={[styles.sectionTitle, { fontSize: fonts.base, color: colors.subtext }]}>🔁 Recorrentes</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.recBtn, { borderBottomWidth: 1, borderBottomColor: colors.border }]}
            onPress={() => handleAddRecurring('weekly')}
          >
            <View>
              <Text style={[styles.recTitle, { fontSize: fonts.base, color: colors.text }]}>📅 Adicionar Semana</Text>
              <Text style={[styles.recSub, { fontSize: fonts.small, color: colors.subtext }]}>Adiciona itens básicos semanais</Text>
            </View>
            <Text style={[styles.recArrow, { color: COLORS.primary }]}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.recBtn}
            onPress={() => handleAddRecurring('monthly')}
          >
            <View>
              <Text style={[styles.recTitle, { fontSize: fonts.base, color: colors.text }]}>🗓️ Adicionar Mês</Text>
              <Text style={[styles.recSub, { fontSize: fonts.small, color: colors.subtext }]}>Adiciona itens básicos mensais</Text>
            </View>
            <Text style={[styles.recArrow, { color: COLORS.primary }]}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Itens recorrentes na lista */}
        {recurringItems.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { fontSize: fonts.base, color: colors.subtext }]}>⚙️ Na sua lista atual</Text>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {recurringItems.map((item, i) => {
                const cat = CATEGORY_MAP[item.category];
                return (
                  <View key={item.id} style={[styles.histItem, i < recurringItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                    <Text style={{ fontSize: 20 }}>{cat?.emoji}</Text>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={[{ fontSize: fonts.base, color: colors.text, fontWeight: '600' }]}>{item.name}</Text>
                      <Text style={[{ fontSize: fonts.small, color: colors.subtext }]}>
                        {item.recurrence === 'weekly' ? 'Semanal' : 'Mensal'} · {item.completed ? 'Concluído' : 'Pendente'}
                      </Text>
                    </View>
                    <View style={[styles.recBadge, { backgroundColor: COLORS.primaryLight }]}>
                      <Text style={[{ fontSize: fonts.small, color: COLORS.primary, fontWeight: '600' }]}>
                        {item.recurrence === 'weekly' ? 'Sem.' : 'Men.'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Quick Add */}
        <Text style={[styles.sectionTitle, { fontSize: fonts.base, color: colors.subtext }]}>⚡ Adição Rápida</Text>
        <View style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {QUICK_ADD_ITEMS.map((item) => {
            const cat = CATEGORY_MAP[item.category];
            const added = existingNames.has(item.name.toLowerCase());
            return (
              <TouchableOpacity
                key={item.name}
                style={[styles.gridItem, { borderColor: added ? colors.border : cat.color, backgroundColor: added ? colors.background : cat.bgColor }]}
                onPress={() => handleQuickAdd(item)}
                disabled={added}
                activeOpacity={0.7}
              >
                <Text style={styles.gridEmoji}>{cat?.emoji}</Text>
                <Text style={[styles.gridLabel, { fontSize: fonts.base, color: added ? colors.subtext : cat.color }]}>{item.name}</Text>
                {added && <Text style={{ color: COLORS.success, fontSize: 16 }}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* History list */}
        {historyItems.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { fontSize: fonts.base, color: colors.subtext }]}>📋 Itens concluídos</Text>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {historyItems.slice(0, 15).map((item, i) => {
                const cat = CATEGORY_MAP[item.category];
                return (
                  <View key={item.id} style={[styles.histItem, i < Math.min(historyItems.length, 15) - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                    <Text style={{ fontSize: 20 }}>{cat?.emoji}</Text>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={[{ fontSize: fonts.base, color: colors.text, textDecorationLine: 'line-through', opacity: 0.6 }]}>{item.name}</Text>
                      <Text style={[{ fontSize: fonts.small, color: colors.subtext }]}>{cat?.label} · Qtd: {item.quantity}</Text>
                    </View>
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
  header: {
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20,
  },
  headerTitle: { color: '#FFF', fontWeight: '700', marginBottom: 4 },
  headerSub: { color: '#BFDBFE' },
  scroll: { padding: 16, paddingBottom: 60 },
  sectionTitle: { fontWeight: '600', marginTop: 20, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: {
    borderRadius: 14, borderWidth: 1, overflow: 'hidden',
  },
  recBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 16,
  },
  recTitle: { fontWeight: '600', marginBottom: 2 },
  recSub: {},
  recArrow: { fontSize: 22, fontWeight: '700' },
  recBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  gridCard: {
    borderRadius: 14, borderWidth: 1, overflow: 'hidden',
    flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 10,
  },
  gridItem: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 12,
    gap: 6, minWidth: '45%', flex: 1,
  },
  gridEmoji: { fontSize: 20 },
  gridLabel: { fontWeight: '600', flex: 1 },
  histItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
  },
});
