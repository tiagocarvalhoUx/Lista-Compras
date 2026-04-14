export type CategoryId =
  | 'produce'
  | 'dairy'
  | 'meat'
  | 'bakery'
  | 'pantry'
  | 'frozen'
  | 'beverages'
  | 'snacks'
  | 'other';

export type RecurrenceType = 'none' | 'weekly' | 'monthly';

export type UnitType = 'un' | 'g' | 'kg' | 'ml' | 'L';

export type SortType = 'category' | 'name' | 'date';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: UnitType;
  category: CategoryId;
  price?: number;
  notes?: string;
  recurrence: RecurrenceType;
  completed: boolean;
  createdAt: number;
  listId: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  createdAt: number;
}

export type FontSize = 'small' | 'medium' | 'large';
export type Theme = 'light' | 'dark';

export interface AppSettings {
  theme: Theme;
  fontSize: FontSize;
}
