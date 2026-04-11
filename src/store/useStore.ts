import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShoppingItem, ShoppingList, AppSettings, CategoryId, RecurrenceType, SortType, FontSize, Theme } from '../types';

interface StoreState {
  // Lists
  lists: ShoppingList[];
  activeListId: string | null;

  // Items
  items: ShoppingItem[];

  // Settings
  settings: AppSettings;

  // UI state
  sortBy: SortType;
  filterCategory: CategoryId | 'all';
  searchQuery: string;

  // List actions
  addList: (name: string) => void;
  renameList: (id: string, name: string) => void;
  deleteList: (id: string) => void;
  setActiveList: (id: string) => void;

  // Item actions
  addItem: (item: Omit<ShoppingItem, 'id' | 'createdAt'>) => void;
  toggleItem: (id: string) => void;
  deleteItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<ShoppingItem>) => void;
  clearCompleted: (listId: string) => void;

  // Settings actions
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;

  // UI actions
  setSortBy: (sort: SortType) => void;
  setFilterCategory: (cat: CategoryId | 'all') => void;
  setSearchQuery: (q: string) => void;
}

const DEFAULT_LIST_ID = 'default';
const DEFAULT_LIST: ShoppingList = { id: DEFAULT_LIST_ID, name: 'Minha Lista', createdAt: Date.now() };

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      lists: [DEFAULT_LIST],
      activeListId: DEFAULT_LIST_ID,
      items: [],
      settings: { theme: 'light', fontSize: 'large' },
      sortBy: 'category',
      filterCategory: 'all',
      searchQuery: '',

      addList: (name) =>
        set((s) => {
          const newList: ShoppingList = { id: Date.now().toString(), name, createdAt: Date.now() };
          return { lists: [...s.lists, newList], activeListId: newList.id };
        }),

      renameList: (id, name) =>
        set((s) => ({ lists: s.lists.map((l) => (l.id === id ? { ...l, name } : l)) })),

      deleteList: (id) =>
        set((s) => {
          const newLists = s.lists.filter((l) => l.id !== id);
          const newActive = newLists.length > 0 ? newLists[0].id : null;
          return { lists: newLists, activeListId: newActive };
        }),

      setActiveList: (id) => set({ activeListId: id }),

      addItem: (item) =>
        set((s) => {
          const newItem: ShoppingItem = { ...item, id: Date.now().toString(), createdAt: Date.now() };
          return { items: [...s.items, newItem] };
        }),

      toggleItem: (id) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i)),
        })),

      deleteItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      updateItem: (id, updates) =>
        set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, ...updates } : i)) })),

      clearCompleted: (listId) =>
        set((s) => ({ items: s.items.filter((i) => !(i.listId === listId && i.completed)) })),

      setTheme: (theme) => set((s) => ({ settings: { ...s.settings, theme } })),
      setFontSize: (fontSize) => set((s) => ({ settings: { ...s.settings, fontSize } })),

      setSortBy: (sortBy) => set({ sortBy }),
      setFilterCategory: (filterCategory) => set({ filterCategory }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
    }),
    {
      name: 'lista-compras-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
