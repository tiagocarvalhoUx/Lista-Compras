import { CategoryId } from '../types';

export interface CategoryConfig {
  id: CategoryId;
  label: string;
  color: string;
  bgColor: string;
  emoji: string;
}

export const CATEGORIES: CategoryConfig[] = [
  { id: 'produce', label: 'Hortifruti', color: '#16A34A', bgColor: '#DCFCE7', emoji: '🥦' },
  { id: 'dairy', label: 'Laticínios', color: '#0891B2', bgColor: '#CFFAFE', emoji: '🥛' },
  { id: 'meat', label: 'Carnes', color: '#DC2626', bgColor: '#FEE2E2', emoji: '🥩' },
  { id: 'bakery', label: 'Padaria', color: '#D97706', bgColor: '#FEF3C7', emoji: '🍞' },
  { id: 'pantry', label: 'Mercearia', color: '#7C3AED', bgColor: '#EDE9FE', emoji: '🥫' },
  { id: 'frozen', label: 'Congelados', color: '#2563EB', bgColor: '#DBEAFE', emoji: '🧊' },
  { id: 'beverages', label: 'Bebidas', color: '#DB2777', bgColor: '#FCE7F3', emoji: '🧃' },
  { id: 'snacks', label: 'Lanches', color: '#EA580C', bgColor: '#FFEDD5', emoji: '🍿' },
  { id: 'other', label: 'Outros', color: '#6B7280', bgColor: '#F3F4F6', emoji: '📦' },
];

export const CATEGORY_MAP: Record<CategoryId, CategoryConfig> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<CategoryId, CategoryConfig>;

export const QUICK_ADD_ITEMS = [
  { name: 'Leite', category: 'dairy' as CategoryId, quantity: 1 },
  { name: 'Pão', category: 'bakery' as CategoryId, quantity: 1 },
  { name: 'Ovos', category: 'dairy' as CategoryId, quantity: 12 },
  { name: 'Manteiga', category: 'dairy' as CategoryId, quantity: 1 },
  { name: 'Queijo', category: 'dairy' as CategoryId, quantity: 1 },
  { name: 'Frango', category: 'meat' as CategoryId, quantity: 1 },
  { name: 'Arroz', category: 'pantry' as CategoryId, quantity: 1 },
  { name: 'Macarrão', category: 'pantry' as CategoryId, quantity: 1 },
];
