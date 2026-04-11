import React from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useStore } from '../store/useStore';
import { useTheme } from '../hooks/useTheme';
import { CATEGORIES } from '../constants/categories';
import { CategoryId, SortType } from '../types';
import { COLORS } from '../constants/theme';

export default function FilterBar() {
  const { searchQuery, setSearchQuery, filterCategory, setFilterCategory, sortBy, setSortBy } = useStore();
  const { colors, fonts } = useTheme();

  const sorts: { value: SortType; label: string }[] = [
    { value: 'category', label: 'Categoria' },
    { value: 'name', label: 'Nome' },
    { value: 'date', label: 'Data' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search */}
      <View style={[styles.searchRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { fontSize: fonts.base, color: colors.text }]}
          placeholder="Buscar itens..."
          placeholderTextColor={colors.subtext}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={[styles.clear, { color: colors.subtext }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Sort */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortRow} contentContainerStyle={styles.sortContent}>
        <Text style={[styles.sortLabel, { fontSize: fonts.small, color: colors.subtext }]}>Ordenar:</Text>
        {sorts.map((s) => (
          <TouchableOpacity
            key={s.value}
            style={[styles.sortChip, { backgroundColor: sortBy === s.value ? COLORS.primary : colors.card, borderColor: sortBy === s.value ? COLORS.primary : colors.border }]}
            onPress={() => setSortBy(s.value)}
          >
            <Text style={[styles.sortChipText, { color: sortBy === s.value ? '#FFF' : colors.text, fontSize: fonts.small }]}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Category filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catContent}>
        <TouchableOpacity
          style={[styles.catChip, { backgroundColor: filterCategory === 'all' ? COLORS.primary : colors.card, borderColor: filterCategory === 'all' ? COLORS.primary : colors.border }]}
          onPress={() => setFilterCategory('all')}
        >
          <Text style={[styles.catText, { color: filterCategory === 'all' ? '#FFF' : colors.text, fontSize: fonts.small }]}>Todos</Text>
        </TouchableOpacity>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.catChip, { backgroundColor: filterCategory === cat.id ? cat.color : colors.card, borderColor: cat.color }]}
            onPress={() => setFilterCategory(filterCategory === cat.id ? 'all' : cat.id as CategoryId)}
          >
            <Text style={styles.catEmoji}>{cat.emoji}</Text>
            <Text style={[styles.catText, { color: filterCategory === cat.id ? '#FFF' : cat.color, fontSize: fonts.small }]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 8 },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginVertical: 10,
    borderRadius: 12, borderWidth: 1.5,
    paddingHorizontal: 14, paddingVertical: 12,
    gap: 8,
  },
  searchIcon: { fontSize: 18 },
  searchInput: { flex: 1 },
  clear: { fontSize: 16 },
  sortRow: { marginBottom: 6 },
  sortContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  sortLabel: { fontWeight: '600' },
  sortChip: {
    borderWidth: 1.5, borderRadius: 99,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  sortChipText: { fontWeight: '600' },
  catContent: { paddingHorizontal: 16, gap: 8 },
  catChip: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderRadius: 99,
    paddingHorizontal: 12, paddingVertical: 6, gap: 4,
  },
  catEmoji: { fontSize: 14 },
  catText: { fontWeight: '600' },
});
