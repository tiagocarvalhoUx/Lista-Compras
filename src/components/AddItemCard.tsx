import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, Switch, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useStore } from '../store/useStore';
import { notifySuccess } from '../utils/haptics';
import { useTheme } from '../hooks/useTheme';
import { CATEGORIES } from '../constants/categories';
import { CategoryId, RecurrenceType } from '../types';
import { COLORS } from '../constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  listId: string;
}

export default function AddItemCard({ visible, onClose, listId }: Props) {
  const { addItem } = useStore();
  const { colors, fonts } = useTheme();

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [category, setCategory] = useState<CategoryId>('other');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  const [advanced, setAdvanced] = useState(false);

  const reset = () => {
    setName('');
    setQuantity('1');
    setCategory('other');
    setPrice('');
    setNotes('');
    setRecurrence('none');
    setAdvanced(false);
  };

  const handleAdd = useCallback(() => {
    if (!name.trim()) return;
    notifySuccess();
    addItem({
      name: name.trim(),
      quantity: parseInt(quantity) || 1,
      category,
      price: price ? parseFloat(price.replace(',', '.')) : undefined,
      notes: notes.trim() || undefined,
      recurrence,
      completed: false,
      listId,
    });
    reset();
    onClose();
  }, [name, quantity, category, price, notes, recurrence, listId]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => { reset(); onClose(); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.cancel, { fontSize: fonts.base, color: COLORS.primary }]}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={[styles.title, { fontSize: fonts.heading, color: colors.text }]}>Adicionar Item</Text>
            <TouchableOpacity onPress={handleAdd} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.add, { fontSize: fonts.base }]}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
            {/* Name */}
            <Text style={[styles.label, { fontSize: fonts.base, color: colors.subtext }]}>Nome *</Text>
            <TextInput
              style={[styles.input, { fontSize: fonts.base, color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
              placeholder="Ex: Leite integral"
              placeholderTextColor={colors.subtext}
              value={name}
              onChangeText={setName}
              returnKeyType="next"
              autoFocus
            />

            {/* Quantity */}
            <Text style={[styles.label, { fontSize: fonts.base, color: colors.subtext }]}>Quantidade</Text>
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={[styles.qtyBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setQuantity((q) => String(Math.max(1, parseInt(q) - 1)))}
              >
                <Text style={[styles.qtyBtnText, { color: colors.text, fontSize: fonts.heading }]}>−</Text>
              </TouchableOpacity>
              <TextInput
                style={[styles.qtyInput, { fontSize: fonts.heading, color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                keyboardType="number-pad"
                value={quantity}
                onChangeText={(v) => setQuantity(v.replace(/[^0-9]/g, '') || '1')}
              />
              <TouchableOpacity
                style={[styles.qtyBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setQuantity((q) => String(parseInt(q) + 1))}
              >
                <Text style={[styles.qtyBtnText, { color: colors.text, fontSize: fonts.heading }]}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Category */}
            <Text style={[styles.label, { fontSize: fonts.base, color: colors.subtext }]}>Categoria</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.catChip,
                    { backgroundColor: category === cat.id ? cat.color : colors.card, borderColor: cat.color },
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Text style={styles.catEmoji}>{cat.emoji}</Text>
                  <Text style={[styles.catLabel, { color: category === cat.id ? '#FFF' : cat.color, fontSize: fonts.small }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Advanced toggle */}
            <View style={[styles.advancedRow, { borderTopColor: colors.border }]}>
              <Text style={[styles.label, { fontSize: fonts.base, color: colors.subtext, marginBottom: 0 }]}>Modo avançado</Text>
              <Switch
                value={advanced}
                onValueChange={setAdvanced}
                trackColor={{ true: COLORS.primary }}
                thumbColor="#FFF"
              />
            </View>

            {advanced && (
              <>
                {/* Price */}
                <Text style={[styles.label, { fontSize: fonts.base, color: colors.subtext }]}>Preço (R$)</Text>
                <TextInput
                  style={[styles.input, { fontSize: fonts.base, color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                  placeholder="0,00"
                  placeholderTextColor={colors.subtext}
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={setPrice}
                />

                {/* Notes */}
                <Text style={[styles.label, { fontSize: fonts.base, color: colors.subtext }]}>Observações</Text>
                <TextInput
                  style={[styles.input, styles.notesInput, { fontSize: fonts.base, color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                  placeholder="Ex: Marca preferida..."
                  placeholderTextColor={colors.subtext}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                />

                {/* Recurrence */}
                <Text style={[styles.label, { fontSize: fonts.base, color: colors.subtext }]}>Recorrência</Text>
                <View style={styles.recRow}>
                  {(['none', 'weekly', 'monthly'] as RecurrenceType[]).map((r) => {
                    const labels = { none: 'Nenhuma', weekly: 'Semanal', monthly: 'Mensal' };
                    return (
                      <TouchableOpacity
                        key={r}
                        style={[styles.recChip, { backgroundColor: recurrence === r ? COLORS.primary : colors.card, borderColor: recurrence === r ? COLORS.primary : colors.border }]}
                        onPress={() => setRecurrence(r)}
                      >
                        <Text style={[styles.recLabel, { color: recurrence === r ? '#FFF' : colors.text, fontSize: fonts.small }]}>
                          {labels[r]}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  cancel: { color: '#6B7280' },
  title: { fontWeight: '700' },
  add: { color: COLORS.primary, fontWeight: '700' },
  scroll: { padding: 20, paddingBottom: 40 },
  label: { fontWeight: '600', marginBottom: 8, marginTop: 16 },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  notesInput: { height: 80, textAlignVertical: 'top' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: { fontWeight: '700' },
  qtyInput: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    textAlign: 'center',
    paddingVertical: 10,
    fontWeight: '700',
  },
  categoryScroll: { marginBottom: 4 },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    gap: 4,
  },
  catEmoji: { fontSize: 16 },
  catLabel: { fontWeight: '600' },
  advancedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 16,
  },
  recRow: { flexDirection: 'row', gap: 10 },
  recChip: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  recLabel: { fontWeight: '600' },
});
