import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useStore } from '../store/useStore';
import { impactMedium } from '../utils/haptics';
import { useTheme } from '../hooks/useTheme';
import { QUICK_ADD_ITEMS, CATEGORY_MAP } from '../constants/categories';
import { COLORS } from '../constants/theme';

interface Props {
  listId: string;
}

export default function QuickAdd({ listId }: Props) {
  const { addItem, items } = useStore();
  const { colors, fonts } = useTheme();

  const existingNames = new Set(items.filter((i) => i.listId === listId).map((i) => i.name.toLowerCase()));

  const handleAdd = (item: typeof QUICK_ADD_ITEMS[0]) => {
    if (existingNames.has(item.name.toLowerCase())) return;
    impactMedium();
    addItem({ ...item, completed: false, recurrence: 'none', listId });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: fonts.base, color: colors.subtext }]}>⚡ Adição Rápida</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {QUICK_ADD_ITEMS.map((item) => {
          const cat = CATEGORY_MAP[item.category];
          const added = existingNames.has(item.name.toLowerCase());
          return (
            <TouchableOpacity
              key={item.name}
              style={[
                styles.chip,
                { borderColor: added ? colors.border : cat.color, backgroundColor: added ? colors.card : cat.bgColor },
              ]}
              onPress={() => handleAdd(item)}
              disabled={added}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{cat.emoji}</Text>
              <Text style={[styles.label, { fontSize: fonts.small, color: added ? colors.subtext : cat.color }]}>
                {item.name}
              </Text>
              {added && <Text style={[styles.added, { color: COLORS.success }]}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 12 },
  title: { fontWeight: '600', marginBottom: 10, paddingHorizontal: 16 },
  scroll: { paddingHorizontal: 16, gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderRadius: 99,
    paddingHorizontal: 14, paddingVertical: 10, gap: 4,
  },
  emoji: { fontSize: 16 },
  label: { fontWeight: '600' },
  added: { fontSize: 14, fontWeight: '700' },
});
