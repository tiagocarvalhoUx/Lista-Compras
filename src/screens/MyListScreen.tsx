import React, { useState, useMemo } from 'react';
import {
  View, Text, SectionList, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { useStore } from '../store/useStore';
import { useTheme } from '../hooks/useTheme';
import HeaderProgress from '../components/HeaderProgress';
import ItemCard from '../components/ItemCard';
import AddItemCard from '../components/AddItemCard';
import SettingsModal from '../components/SettingsModal';
import ListPickerModal from '../components/ListPickerModal';
import FilterBar from '../components/FilterBar';
import QuickAdd from '../components/QuickAdd';
import { CATEGORY_MAP } from '../constants/categories';
import { ShoppingItem } from '../types';
import { sortItems } from '../utils';
import { COLORS } from '../constants/theme';

export default function MyListScreen() {
  const { items, lists, activeListId, sortBy, filterCategory, searchQuery, clearCompleted } = useStore();
  const { colors, fonts } = useTheme();

  const [addVisible, setAddVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [listsVisible, setListsVisible] = useState(false);

  const activeList = lists.find((l) => l.id === activeListId);
  const listId = activeListId ?? '';

  const listItems = useMemo(() => {
    return items.filter((i) => i.listId === listId);
  }, [items, listId]);

  const filteredItems = useMemo(() => {
    let result = listItems;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((i) => i.name.toLowerCase().includes(q));
    }
    if (filterCategory !== 'all') {
      result = result.filter((i) => i.category === filterCategory);
    }
    return sortItems(result, sortBy);
  }, [listItems, searchQuery, filterCategory, sortBy]);

  const pending = filteredItems.filter((i) => !i.completed);
  const completed = filteredItems.filter((i) => i.completed);

  // Build sections
  const sections = useMemo(() => {
    const result: { title: string; data: ShoppingItem[]; color: string }[] = [];

    if (sortBy === 'category') {
      const groups: Record<string, ShoppingItem[]> = {};
      pending.forEach((item) => {
        if (!groups[item.category]) groups[item.category] = [];
        groups[item.category].push(item);
      });
      for (const [cat, catItems] of Object.entries(groups)) {
        const config = CATEGORY_MAP[cat as keyof typeof CATEGORY_MAP];
        result.push({ title: `${config?.emoji} ${config?.label}`, data: catItems, color: config?.color ?? '#6B7280' });
      }
    } else {
      if (pending.length > 0) result.push({ title: '🛒 Itens', data: pending, color: COLORS.primary });
    }

    if (completed.length > 0) {
      result.push({ title: '✅ Concluídos', data: completed, color: COLORS.success });
    }

    return result;
  }, [pending, completed, sortBy]);

  const totalList = listItems.length;
  const completedList = listItems.filter((i) => i.completed).length;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <HeaderProgress
        listName={activeList?.name ?? 'Minha Lista'}
        total={totalList}
        completed={completedList}
        onSettingsPress={() => setSettingsVisible(true)}
        onListsPress={() => setListsVisible(true)}
      />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemCard item={item} />}
        renderSectionHeader={({ section }) => (
          <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
            <View style={[styles.sectionDot, { backgroundColor: section.color }]} />
            <Text style={[styles.sectionTitle, { fontSize: fonts.base, color: section.color }]}>
              {section.title}
            </Text>
          </View>
        )}
        ListHeaderComponent={
          <>
            <FilterBar />
            <QuickAdd listId={listId} />
            {pending.length === 0 && completed.length === 0 && (
              <View style={styles.empty}>
                <Text style={styles.emptyEmoji}>🛒</Text>
                <Text style={[styles.emptyTitle, { fontSize: fonts.heading, color: colors.text }]}>Lista vazia</Text>
                <Text style={[styles.emptyText, { fontSize: fonts.base, color: colors.subtext }]}>
                  Adicione itens usando o botão abaixo ou a adição rápida
                </Text>
              </View>
            )}
          </>
        }
        ListFooterComponent={
          completed.length > 0 ? (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => clearCompleted(listId)}
            >
              <Text style={[styles.clearBtnText, { fontSize: fonts.base }]}>
                🗑️ Limpar concluídos ({completed.length})
              </Text>
            </TouchableOpacity>
          ) : null
        }
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setAddVisible(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <AddItemCard visible={addVisible} onClose={() => setAddVisible(false)} listId={listId} />
      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
      <ListPickerModal visible={listsVisible} onClose={() => setListsVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: { paddingBottom: 100 },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 6,
  },
  sectionDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  sectionTitle: { fontWeight: '700' },
  empty: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontWeight: '700', marginBottom: 8 },
  emptyText: { textAlign: 'center', lineHeight: 24 },
  clearBtn: {
    marginHorizontal: 16, marginTop: 16, marginBottom: 8,
    paddingVertical: 14, borderRadius: 12,
    backgroundColor: '#FEE2E2', alignItems: 'center',
  },
  clearBtnText: { color: '#EF4444', fontWeight: '700' },
  fab: {
    position: 'absolute', right: 20, bottom: 24,
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  fabText: { color: '#FFF', fontSize: 32, fontWeight: '700', lineHeight: 36 },
});
