import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { useStore } from '../store/useStore';
import { useTheme } from '../hooks/useTheme';
import { COLORS, FONT_SIZES } from '../constants/theme';
import { FontSize, Theme } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: Props) {
  const { settings, setTheme, setFontSize } = useStore();
  const { colors, fonts } = useTheme();

  const themes: { value: Theme; label: string; emoji: string }[] = [
    { value: 'light', label: 'Claro', emoji: '☀️' },
    { value: 'dark', label: 'Escuro', emoji: '🌙' },
  ];

  const fontSizes: { value: FontSize; label: string }[] = [
    { value: 'small', label: 'Pequeno' },
    { value: 'medium', label: 'Médio' },
    { value: 'large', label: 'Grande' },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { fontSize: fonts.heading, color: colors.text }]}>⚙️ Configurações</Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={[styles.done, { fontSize: fonts.base }]}>Fechar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Theme */}
          <Text style={[styles.sectionTitle, { fontSize: fonts.base, color: colors.subtext }]}>🌗 Tema</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {themes.map((t, i) => (
              <TouchableOpacity
                key={t.value}
                style={[styles.option, i < themes.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
                onPress={() => setTheme(t.value)}
              >
                <Text style={[styles.optionLabel, { fontSize: fonts.base, color: colors.text }]}>
                  {t.emoji} {t.label}
                </Text>
                {settings.theme === t.value && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>

          {/* Font Size */}
          <Text style={[styles.sectionTitle, { fontSize: fonts.base, color: colors.subtext }]}>🔠 Tamanho do Texto</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {fontSizes.map((fs, i) => (
              <TouchableOpacity
                key={fs.value}
                style={[styles.option, i < fontSizes.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
                onPress={() => setFontSize(fs.value)}
              >
                <Text style={[styles.optionLabel, { fontSize: fonts.base, color: colors.text }]}>
                  {fs.label}
                </Text>
                {settings.fontSize === fs.value && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>

          {/* About */}
          <Text style={[styles.sectionTitle, { fontSize: fonts.base, color: colors.subtext }]}>ℹ️ Sobre</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { fontSize: fonts.base, color: colors.subtext }]}>App</Text>
              <Text style={[styles.aboutValue, { fontSize: fonts.base, color: colors.text }]}>Lista de Compras</Text>
            </View>
            <View style={[styles.aboutRow, { borderTopWidth: 1, borderTopColor: colors.border }]}>
              <Text style={[styles.aboutLabel, { fontSize: fonts.base, color: colors.subtext }]}>Versão</Text>
              <Text style={[styles.aboutValue, { fontSize: fonts.base, color: colors.text }]}>1.0.0</Text>
            </View>
            <View style={[styles.aboutRow, { borderTopWidth: 1, borderTopColor: colors.border }]}>
              <Text style={[styles.aboutLabel, { fontSize: fonts.base, color: colors.subtext }]}>Recursos</Text>
              <Text style={[styles.aboutValue, { fontSize: fonts.base, color: colors.text }]}>Offline · Múltiplas listas · Histórico</Text>
            </View>
          </View>
        </ScrollView>
      </View>
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
  title: { fontWeight: '700' },
  done: { color: COLORS.primary, fontWeight: '700' },
  scroll: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontWeight: '600', marginTop: 20, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  optionLabel: { fontWeight: '500' },
  check: { color: COLORS.primary, fontSize: 20, fontWeight: '700' },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  aboutLabel: {},
  aboutValue: { fontWeight: '500', flex: 1, textAlign: 'right' },
});
