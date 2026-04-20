import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Modal, FlatList, Alert, Platform,
} from 'react-native';
import { useStore } from '../store/useStore';
import { notifySuccess } from '../utils/haptics';
import { useTheme } from '../hooks/useTheme';
import { COLORS } from '../constants/theme';
import { ShoppingList } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
}

function RenameModal({
  list,
  onConfirm,
  onCancel,
  colors,
  fonts,
}: {
  list: ShoppingList | null;
  onConfirm: (name: string) => void;
  onCancel: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
  fonts: ReturnType<typeof useTheme>['fonts'];
}) {
  const [value, setValue] = useState(list?.name ?? '');

  if (!list) return null;

  return (
    <Modal visible={!!list} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: colors.card }]}>
          <Text style={[styles.dialogTitle, { fontSize: fonts.base, color: colors.text }]}>
            Renomear lista
          </Text>
          <TextInput
            style={[styles.dialogInput, { fontSize: fonts.base, color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
            value={value}
            onChangeText={setValue}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => { if (value.trim()) onConfirm(value.trim()); }}
          />
          <View style={styles.dialogActions}>
            <TouchableOpacity style={styles.dialogBtn} onPress={onCancel}>
              <Text style={[styles.dialogBtnText, { color: colors.subtext, fontSize: fonts.base }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.dialogBtn, styles.dialogBtnConfirm]} onPress={() => { if (value.trim()) onConfirm(value.trim()); }}>
              <Text style={[styles.dialogBtnText, { color: '#FFF', fontSize: fonts.base }]}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function ListPickerModal({ visible, onClose }: Props) {
  const { lists, activeListId, addList, renameList, deleteList, setActiveList } = useStore();
  const { colors, fonts } = useTheme();
  const [newName, setNewName] = useState('');
  const [renamingList, setRenamingList] = useState<ShoppingList | null>(null);

  const handleAdd = () => {
    if (!newName.trim()) return;
    notifySuccess();
    addList(newName.trim());
    setNewName('');
    onClose();
  };

  const handleRenameConfirm = (name: string) => {
    if (renamingList) renameList(renamingList.id, name);
    setRenamingList(null);
  };

  const handleDelete = (list: ShoppingList) => {
    if (lists.length <= 1) {
      Alert.alert('Aviso', 'Você precisa ter ao menos uma lista.');
      return;
    }
    Alert.alert('Excluir lista', `Excluir "${list.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deleteList(list.id) },
    ]);
  };

  return (
    <>
      <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { fontSize: fonts.heading, color: colors.text }]}>🛒 Minhas Listas</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.done, { fontSize: fonts.base }]}>Fechar</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={lists}
            keyExtractor={(item) => item.id}
            style={{ flex: 1 }}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.listItem,
                  {
                    backgroundColor: colors.card,
                    borderColor: item.id === activeListId ? COLORS.primary : colors.border,
                  },
                ]}
                onPress={() => { setActiveList(item.id); onClose(); }}
              >
                <View style={styles.listItemLeft}>
                  {item.id === activeListId && <View style={styles.activeDot} />}
                  <Text style={[styles.listName, { fontSize: fonts.base, color: colors.text }]}>
                    {item.name}
                  </Text>
                </View>
                <View style={styles.listItemActions}>
                  <TouchableOpacity onPress={() => setRenamingList(item)} style={styles.actionBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Text style={{ fontSize: 18 }}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Text style={{ fontSize: 18 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              <View style={styles.newListRow}>
                <TextInput
                  style={[
                    styles.newListInput,
                    { fontSize: fonts.base, color: colors.text, backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                  placeholder="Nova lista..."
                  placeholderTextColor={colors.subtext}
                  value={newName}
                  onChangeText={setNewName}
                  returnKeyType="done"
                  onSubmitEditing={handleAdd}
                />
                <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                  <Text style={[styles.addBtnText, { fontSize: fonts.base }]}>+ Criar</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      </Modal>

      <RenameModal
        list={renamingList}
        onConfirm={handleRenameConfirm}
        onCancel={() => setRenamingList(null)}
        colors={colors}
        fonts={fonts}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1,
  },
  title: { fontWeight: '700' },
  done: { color: COLORS.primary, fontWeight: '700' },
  list: { padding: 16, gap: 10 },
  listItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: 14, borderWidth: 2, paddingHorizontal: 16, paddingVertical: 16,
  },
  listItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  activeDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary, marginRight: 10 },
  listName: { fontWeight: '600', flex: 1 },
  listItemActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 6 },
  newListRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  newListInput: {
    flex: 1, borderWidth: 1.5, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  addBtn: {
    backgroundColor: COLORS.primary, borderRadius: 12,
    paddingHorizontal: 18, paddingVertical: 14, justifyContent: 'center',
  },
  addBtnText: { color: '#FFF', fontWeight: '700' },
  // Dialog styles
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  dialog: {
    width: '100%', maxWidth: 400,
    borderRadius: 20, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2, shadowRadius: 16, elevation: 8,
  },
  dialogTitle: { fontWeight: '700', marginBottom: 16 },
  dialogInput: {
    borderWidth: 1.5, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16,
  },
  dialogActions: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
  dialogBtn: {
    paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10,
  },
  dialogBtnConfirm: { backgroundColor: COLORS.primary },
  dialogBtnText: { fontWeight: '700' },
});
