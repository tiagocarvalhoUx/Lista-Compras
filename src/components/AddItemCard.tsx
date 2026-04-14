import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store/useStore';
import { notifySuccess } from '../utils/haptics';
import { useTheme } from '../hooks/useTheme';
import { CATEGORIES } from '../constants/categories';
import { CategoryId, RecurrenceType, UnitType } from '../types';
import { COLORS } from '../constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  listId: string;
}

export default function AddItemCard({ visible, onClose, listId }: Props) {
  const { addItem } = useStore();
  const { colors, fonts } = useTheme();

  const [name, setName]           = useState('');
  const [quantity, setQuantity]   = useState('1');
  const [unit, setUnit]           = useState<UnitType>('un');
  const [category, setCategory]   = useState<CategoryId>('other');
  const [price, setPrice]         = useState('');
  const [notes, setNotes]         = useState('');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  const [advanced, setAdvanced]   = useState(false);

  const UNITS: { value: UnitType; label: string; decimal: boolean }[] = [
    { value: 'un', label: 'un',  decimal: false },
    { value: 'g',  label: 'g',   decimal: false },
    { value: 'kg', label: 'kg',  decimal: true  },
    { value: 'ml', label: 'ml',  decimal: false },
    { value: 'L',  label: 'L',   decimal: true  },
  ];

  const isDecimalUnit = UNITS.find(u => u.value === unit)?.decimal ?? false;

  const reset = () => {
    setName(''); setQuantity('1'); setUnit('un'); setCategory('other');
    setPrice(''); setNotes(''); setRecurrence('none'); setAdvanced(false);
  };

  const handleAdd = useCallback(() => {
    if (!name.trim()) return;
    notifySuccess();
    addItem({
      name: name.trim(),
      quantity: parseFloat(quantity.replace(',', '.')) || 1,
      unit,
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

  // Quantity handlers
  const handleQtyChange = (v: string) => {
    const pattern = isDecimalUnit ? /[^0-9.,]/g : /[^0-9]/g;
    const cleaned = v.replace(pattern, '').replace(',', '.');
    setQuantity(cleaned);
  };

  const handleQtyBlur = () => {
    const val = parseFloat(quantity.replace(',', '.'));
    if (!quantity || isNaN(val) || val < 0.001) setQuantity('1');
  };

  const decrement = () => {
    const step = isDecimalUnit ? 0.5 : 1;
    const cur = parseFloat(quantity.replace(',', '.')) || 1;
    const next = Math.max(step, parseFloat((cur - step).toFixed(3)));
    setQuantity(String(next));
  };
  const increment = () => {
    const step = isDecimalUnit ? 0.5 : 1;
    const cur = parseFloat(quantity.replace(',', '.')) || 0;
    setQuantity(String(parseFloat((cur + step).toFixed(3))));
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
            {/* Cancelar — texto simples, discreto */}
            <TouchableOpacity
              onPress={() => { reset(); onClose(); }}
              style={styles.cancelBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.6}
            >
              <Text style={[styles.cancelText, { fontSize: 15 }]}>Cancelar</Text>
            </TouchableOpacity>

            {/* Título — tamanho fixo, 1 linha */}
            <View style={styles.headerCenter}>
              <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
                🛒 Novo Item
              </Text>
            </View>

            {/* Adicionar — pill colorido */}
            <TouchableOpacity
              onPress={handleAdd}
              style={styles.addPill}
              activeOpacity={0.85}
            >
              <Text style={styles.addPillText}>+ Adicionar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>

            {/* Nome */}
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

            {/* Quantidade — responsivo, digitação livre */}
            <View style={styles.qtyLabelRow}>
              <Text style={[styles.label, { fontSize: fonts.base, color: colors.subtext, marginTop: 16, marginBottom: 8 }]}>Quantidade</Text>
              <Text style={[styles.qtyLabelHint, { fontSize: fonts.small, color: colors.subtext }]}>
                Selecione a unidade →
              </Text>
            </View>

            <View style={styles.qtySection}>
              {/* Stepper */}
              <View style={styles.qtyRow}>
                {/* Botão − */}
                <TouchableOpacity
                  style={[styles.qtyBtn, { backgroundColor: colors.card, borderColor: COLORS.primary }]}
                  onPress={decrement}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.qtyBtnText, { color: COLORS.primary, fontSize: fonts.heading + 4 }]}>−</Text>
                </TouchableOpacity>

                {/* Campo numérico — largura fixa, digitação livre */}
                <TextInput
                  style={[styles.qtyInput, { fontSize: fonts.heading, color: colors.text, backgroundColor: colors.card, borderColor: COLORS.primary }]}
                  keyboardType={isDecimalUnit ? 'decimal-pad' : 'number-pad'}
                  value={quantity}
                  onChangeText={handleQtyChange}
                  onBlur={handleQtyBlur}
                  selectTextOnFocus
                />

                {/* Botão + */}
                <TouchableOpacity
                  style={[styles.qtyBtn, { backgroundColor: COLORS.primary }]}
                  onPress={increment}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.qtyBtnText, { color: '#FFF', fontSize: fonts.heading + 4 }]}>+</Text>
                </TouchableOpacity>
              </View>

              {/* Seletor de unidade */}
              <View style={styles.unitSelector}>
                {UNITS.map((u) => {
                  const active = unit === u.value;
                  return (
                    <TouchableOpacity
                      key={u.value}
                      onPress={() => {
                        setUnit(u.value);
                        // Reseta para valor inteiro se trocar p/ unidade sem decimal
                        if (!u.decimal) {
                          const cur = parseFloat(quantity.replace(',', '.')) || 1;
                          setQuantity(String(Math.max(1, Math.round(cur))));
                        }
                      }}
                      activeOpacity={0.75}
                      style={[
                        styles.unitChip,
                        {
                          backgroundColor: active ? COLORS.primary : colors.card,
                          borderColor: active ? COLORS.primary : colors.border,
                        },
                      ]}
                    >
                      <Text style={[styles.unitChipText, { color: active ? '#FFF' : colors.subtext, fontSize: fonts.small }]}>
                        {u.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Categoria */}
            <Text style={[styles.label, { fontSize: fonts.base, color: colors.subtext }]}>Categoria</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catChip, { backgroundColor: category === cat.id ? cat.color : colors.card, borderColor: cat.color }]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Text style={styles.catEmoji}>{cat.emoji}</Text>
                  <Text style={[styles.catLabel, { color: category === cat.id ? '#FFF' : cat.color, fontSize: fonts.small }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* ── Botão Modo Avançado colorido ── */}
            <View style={[styles.advancedRow, { borderTopColor: colors.border }]}>
              <View style={styles.advancedLeft}>
                <Text style={styles.advancedEmoji}>{advanced ? '🧠' : '⚡'}</Text>
                <View>
                  <Text style={[styles.advancedLabel, { fontSize: fonts.base, color: colors.text }]}>
                    {advanced ? 'Modo avançado' : 'Modo simples'}
                  </Text>
                  <Text style={[styles.advancedSub, { fontSize: fonts.small, color: colors.subtext }]}>
                    {advanced ? 'Preço, notas e recorrência' : 'Toque para mais opções'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity onPress={() => setAdvanced(v => !v)} activeOpacity={0.85}>
                <LinearGradient
                  colors={advanced ? ['#7C3AED', '#EC4899'] : ['#94A3B8', '#CBD5E1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.advancedToggle}
                >
                  {/* Thumb */}
                  <View style={[styles.advancedThumb, { transform: [{ translateX: advanced ? 22 : 0 }] }]} />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Campos avançados */}
            {advanced && (
              <>
                {/* Preço */}
                <Text style={[styles.label, { fontSize: fonts.base, color: colors.subtext }]}>Preço (R$)</Text>
                <TextInput
                  style={[styles.input, { fontSize: fonts.base, color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                  placeholder="0,00"
                  placeholderTextColor={colors.subtext}
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={setPrice}
                />

                {/* Observações */}
                <Text style={[styles.label, { fontSize: fonts.base, color: colors.subtext }]}>Observações</Text>
                <TextInput
                  style={[styles.input, styles.notesInput, { fontSize: fonts.base, color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                  placeholder="Ex: Marca preferida..."
                  placeholderTextColor={colors.subtext}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />

                {/* Recorrência */}
                <Text style={[styles.label, { fontSize: fonts.base, color: colors.subtext }]}>Recorrência</Text>
                <View style={styles.recRow}>
                  {(['none', 'weekly', 'monthly'] as RecurrenceType[]).map((r) => {
                    const labels = { none: '🚫 Nenhuma', weekly: '📅 Semanal', monthly: '🗓️ Mensal' };
                    const active = recurrence === r;
                    return (
                      <TouchableOpacity
                        key={r}
                        style={[styles.recChip, { backgroundColor: active ? COLORS.primary : colors.card, borderColor: active ? COLORS.primary : colors.border }]}
                        onPress={() => setRecurrence(r)}
                      >
                        <Text style={[styles.recLabel, { color: active ? '#FFF' : colors.text, fontSize: fonts.small }]}>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  cancelBtn: {
    minWidth: 80,
  },
  cancelText: {
    color: '#94A3B8',
    fontWeight: '500',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  addPill: {
    backgroundColor: COLORS.primary,
    borderRadius: 99,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  addPillText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  scroll: { padding: 20, paddingBottom: 50 },
  label: { fontWeight: '600', marginBottom: 8, marginTop: 16 },
  input: {
    borderWidth: 1.5, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  notesInput: { height: 80 },

  // Quantidade
  qtyLabelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  qtyLabelHint: {
    fontWeight: '400',
    marginTop: 16,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  qtySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  unitSelector: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'flex-end',
  },
  unitChip: {
    borderWidth: 1.5,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
  },
  unitChipText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  qtyBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  qtyBtnText: { fontWeight: '800', lineHeight: 36 },
  qtyInput: {
    width: 90,
    height: 52,
    borderWidth: 2,
    borderRadius: 14,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },

  // Categorias
  categoryScroll: { marginBottom: 4 },
  catChip: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderRadius: 99,
    paddingHorizontal: 14, paddingVertical: 8,
    marginRight: 8, gap: 4,
  },
  catEmoji: { fontSize: 16 },
  catLabel: { fontWeight: '600' },

  // Modo avançado
  advancedRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderTopWidth: 1, paddingTop: 18, marginTop: 18, gap: 12,
  },
  advancedLeft: {
    flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1,
  },
  advancedEmoji: { fontSize: 28 },
  advancedLabel: { fontWeight: '700', marginBottom: 2 },
  advancedSub: {},
  advancedToggle: {
    width: 52, height: 30, borderRadius: 99,
    justifyContent: 'center', paddingHorizontal: 4,
  },
  advancedThumb: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#FFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2, shadowRadius: 2, elevation: 2,
  },

  // Recorrência
  recRow: { flexDirection: 'row', gap: 8 },
  recChip: {
    flex: 1, borderWidth: 1.5, borderRadius: 10,
    paddingVertical: 12, alignItems: 'center',
  },
  recLabel: { fontWeight: '600' },
});
