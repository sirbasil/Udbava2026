import { supabase } from '@/lib/supabase';
import type { Transaction } from '@/types';

export const transactionService = {
  async getAllTransactions() {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('createdAt', { ascending: false });
      if (error) throw error;
      return { success: true, data: data as Transaction[] };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch transactions' };
    }
  },

  async getTransactionById(id: string) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return { success: true, data: data as Transaction };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch transaction' };
    }
  },

  async getTransactionsByBuyer(buyerId: string) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('buyerId', buyerId)
        .order('createdAt', { ascending: false });
      if (error) throw error;
      return { success: true, data: data as Transaction[] };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch transactions' };
    }
  },

  async getTransactionsByItem(itemId: string) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('itemId', itemId)
        .order('createdAt', { ascending: false });
      if (error) throw error;
      return { success: true, data: data as Transaction[] };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch transactions' };
    }
  },

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>) {
    try {
      const newTransaction = {
        ...transaction,
        createdAt: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert([newTransaction])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: data as Transaction };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create transaction' };
    }
  },

  async updateTransaction(id: string, updates: Partial<Transaction>) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: data as Transaction };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update transaction' };
    }
  },

  async claimItem(itemId: string, buyerId: string, amount: number, itemName: string) {
    try {
      // Create transaction
      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert([
          {
            buyerId,
            itemId,
            itemName,
            status: 'pending',
            amount,
            provenance: 'in_transit',
            createdAt: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (txError) throw txError;

      // Update item status
      const { error: itemError } = await supabase
        .from('items')
        .update({ status: 'out_of_stock', stock: 0 })
        .eq('id', itemId);

      if (itemError) throw itemError;

      return { success: true, transaction: transaction as Transaction };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to claim item' };
    }
  },
};
