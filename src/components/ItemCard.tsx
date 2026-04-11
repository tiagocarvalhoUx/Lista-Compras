import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { ShoppingItem } from '../types';
import { CATEGORY_MAP } from '../constants/categories';
import { useStore } from '../store/useStore';
import { useTheme } from '../hooks/useTheme';
import { formatPrice } from '../utils';
import { impactLight, notifyWarning } from '../utils/haptics';

interface ItemCardProps {
  item: ShoppingItem;
}

export default function ItemCard({ item }: ItemCardProps) {
  const { toggleItem, deleteItem } = useStore();
  const { colors, fonts } = useTheme();
  const opacity = useSharedValue(item.completed ? 0.5 : 1);
  const category = CATEGORY_MAP[item.category];

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const handleToggle = useCallback(() => {
    impactLight();
    opacity.value = withTiming(item.completed ? 1 : 0.5, { duration: 200 });
    toggleItem(item.id);
  }, [item.completed, item.id]);

  const handleDelete = useCallback(() => {
    Alert.alert('Remover item', `Remover "${item.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          notifyWarning();
          deleteItem(item.id);
        },
      },
    ]);
  }, [item.id, item.name]);

  return (
    <Animated.View style={[styles.card, animStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Category color bar */}
      <View style={[styles.colorBar, { backgroundColor: category?.color ?? '#6B7280' }]} />

      {/* Checkbox */}
      <TouchableOpacity onPress={handleToggle} style={styles.checkbox} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <View style={[styles.checkboxInner, item.completed && styles.checkboxChecked, { borderColor: category?.color ?? '#6B7280' }]}>
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[
            styles.name,
            { fontSize: fonts.base, color: colors.text },
            item.completed && styles.strikethrough,
          ]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <View style={styles.meta}>
          <View style={[styles.badge, { backgroundColor: category?.bgColor ?? '#F3F4F6' }]}>
            <Text style={[styles.badgeText, { color: category?.color ?? '#6B7280', fontSize: fonts.small }]}>
              {category?.emoji} {category?.label}
            </Text>
          </View>
          <Text style={[styles.qty, { color: colors.subtext, fontSize: fonts.small }]}>
            Qtd: {item.quantity}
          </Text>
          {item.price != null && item.price > 0 && (
            <Text style={[styles.price, { color: colors.subtext, fontSize: fonts.small }]}>
              {formatPrice(item.price)}
            </Text>
          )}
        </View>
        {item.notes ? (
          <Text style={[styles.notes, { color: colors.subtext, fontSize: fonts.small }]} numberOfLines={1}>
            📝 {item.notes}
          </Text>
        ) : null}
      </View>

      {/* Delete */}
      <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  colorBar: {
    width: 6,
    alignSelf: 'stretch',
  },
  checkbox: {
    padding: 14,
  },
  checkboxInner: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkmark: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingVertical: 12,
  },
  name: {
    fontWeight: '600',
    marginBottom: 4,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontWeight: '500',
  },
  qty: {
    fontWeight: '500',
  },
  price: {
    fontWeight: '500',
  },
  notes: {
    marginTop: 4,
    fontStyle: 'italic',
  },
  deleteBtn: {
    padding: 14,
  },
  deleteIcon: {
    fontSize: 20,
  },
});
