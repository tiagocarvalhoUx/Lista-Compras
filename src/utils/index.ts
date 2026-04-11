import { ShoppingItem, SortType } from '../types';
import { CATEGORY_MAP } from '../constants/categories';

export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).slice(2, 7);
}

export function sortItems(items: ShoppingItem[], sortBy: SortType): ShoppingItem[] {
  return [...items].sort((a, b) => {
    if (sortBy === 'category') return a.category.localeCompare(b.category);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return b.createdAt - a.createdAt;
  });
}

export function groupByCategory(items: ShoppingItem[]): Record<string, ShoppingItem[]> {
  return items.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
    const key = item.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

export function formatPrice(price: number): string {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function shareText(list: ShoppingItem[], listName: string): string {
  const groups = groupByCategory(list);
  let text = `🛒 ${listName}\n\n`;
  for (const [cat, catItems] of Object.entries(groups)) {
    const config = CATEGORY_MAP[cat as keyof typeof CATEGORY_MAP];
    text += `${config?.emoji ?? ''} ${config?.label ?? cat}\n`;
    catItems.forEach((item) => {
      text += `  • ${item.name} (${item.quantity}x)${item.completed ? ' ✅' : ''}\n`;
    });
    text += '\n';
  }
  return text;
}
