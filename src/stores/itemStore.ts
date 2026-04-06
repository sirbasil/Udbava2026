import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Item, Transaction, Category } from '@/types';
import { SEED_ITEMS, SEED_TRANSACTIONS } from '@/constants/mockData';
import { generateId } from '@/lib/utils';

interface ItemState {
  items: Item[];
  transactions: Transaction[];
  searchQuery: string;
  selectedCategory: Category;
  priceRange: [number, number];
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (c: Category) => void;
  setPriceRange: (r: [number, number]) => void;
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'reported' | 'rating' | 'status'>) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  claimItem: (itemId: string, buyerId: string) => { success: boolean; error?: string };
  reportItem: (id: string) => void;
  getFilteredItems: () => Item[];
}

export const useItemStore = create<ItemState>()(
  persist(
    (set, get) => ({
      items: SEED_ITEMS,
      transactions: SEED_TRANSACTIONS,
      searchQuery: '',
      selectedCategory: 'all',
      priceRange: [0, 25000],

      setSearchQuery: (q) => set({ searchQuery: q }),
      setSelectedCategory: (c) => set({ selectedCategory: c }),
      setPriceRange: (r) => set({ priceRange: r }),

      addItem: (item) => {
        const newItem: Item = {
          ...item,
          id: generateId(),
          createdAt: new Date().toISOString().split('T')[0],
          reported: false,
          rating: 0,
          status: item.stock > 0 ? 'in_stock' : 'out_of_stock',
        };
        set(s => ({ items: [newItem, ...s.items] }));
      },

      updateItem: (id, updates) => {
        set(s => ({ items: s.items.map(i => i.id === id ? { ...i, ...updates } : i) }));
      },

      deleteItem: (id) => {
        set(s => ({ items: s.items.filter(i => i.id !== id) }));
      },

      claimItem: (itemId, buyerId) => {
        const item = get().items.find(i => i.id === itemId);
        if (!item) return { success: false, error: 'Item not found' };
        if (item.stock <= 0) return { success: false, error: 'Item is out of stock' };

        const newStock = item.stock - 1;
        const newStatus = newStock === 0 ? 'out_of_stock' as const : newStock <= 2 ? 'low_stock' as const : 'in_stock' as const;

        const tx: Transaction = {
          id: `#RC-${Date.now().toString().slice(-4)}-${String(get().transactions.length + 1).padStart(2, '0')}`,
          buyerId,
          itemId,
          itemName: item.name,
          status: 'pending',
          provenance: item.provenance,
          amount: item.price,
          createdAt: new Date().toISOString().split('T')[0],
        };

        set(s => ({
          items: s.items.map(i => i.id === itemId ? { ...i, stock: newStock, status: newStatus } : i),
          transactions: [tx, ...s.transactions],
        }));
        return { success: true };
      },

      reportItem: (id) => {
        set(s => ({ items: s.items.map(i => i.id === id ? { ...i, reported: true } : i) }));
      },

      getFilteredItems: () => {
        const { items, searchQuery, selectedCategory, priceRange } = get();
        return items.filter(item => {
          const matchSearch = !searchQuery ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
          const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
          const matchPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
          return matchSearch && matchCategory && matchPrice;
        });
      },
    }),
    { name: 'retcom-items' }
  )
);
