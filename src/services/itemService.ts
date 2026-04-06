import { supabase } from '@/lib/supabase';
import type { Item, Category } from '@/types';

export const itemService = {
  async getAllItems() {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('createdAt', { ascending: false });
      if (error) throw error;
      return { success: true, data: data as Item[] };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch items' };
    }
  },

  async getItemsByCategory(category: Category) {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('category', category)
        .order('createdAt', { ascending: false });
      if (error) throw error;
      return { success: true, data: data as Item[] };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch items' };
    }
  },

  async getItemById(id: string) {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return { success: true, data: data as Item };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch item' };
    }
  },

  async createItem(item: Omit<Item, 'id' | 'createdAt' | 'reported' | 'rating' | 'status'>) {
    try {
      const newItem = {
        ...item,
        reported: false,
        rating: 0,
        status: item.stock > 0 ? 'in_stock' : 'out_of_stock',
        createdAt: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('items')
        .insert([newItem])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: data as Item };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create item' };
    }
  },

  async updateItem(id: string, updates: Partial<Item>) {
    try {
      const { data, error } = await supabase
        .from('items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: data as Item };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update item' };
    }
  },

  async deleteItem(id: string) {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to delete item' };
    }
  },

  async reportItem(id: string) {
    try {
      const { error } = await supabase
        .from('items')
        .update({ reported: true })
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to report item' };
    }
  },

  async searchItems(query: string, category?: Category, priceRange?: [number, number]) {
    try {
      let queryBuilder = supabase
        .from('items')
        .select('*');

      if (query) {
        queryBuilder = queryBuilder.or(
          `name.ilike.%${query}%,description.ilike.%${query}%,sellerName.ilike.%${query}%`
        );
      }

      if (category && category !== 'all') {
        queryBuilder = queryBuilder.eq('category', category);
      }

      if (priceRange) {
        queryBuilder = queryBuilder.gte('price', priceRange[0]).lte('price', priceRange[1]);
      }

      const { data, error } = await queryBuilder.order('createdAt', { ascending: false });

      if (error) throw error;
      return { success: true, data: data as Item[] };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to search items' };
    }
  },
};
