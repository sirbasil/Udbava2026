import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/features/ProtectedRoute';
import { useItemStore } from '@/stores/itemStore';
import { useToastStore } from '@/stores/toastStore';
import { formatPrice, getConditionLabel, getConditionStyle, getItemStatusStyle, getItemStatusLabel } from '@/lib/utils';
import { Pencil, Trash2, Search, Plus } from 'lucide-react';
import { Modal } from '@/components/features/Modal';
import type { Item } from '@/types';

export default function Inventory() {
  const { items, updateItem, deleteItem } = useItemStore();
  const { addToast } = useToastStore();
  const [search, setSearch] = useState('');
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (item: Item) => {
    deleteItem(item.id);
    addToast(`${item.name} removed from inventory`, 'success');
  };

  const handleEdit = (item: Item) => {
    setEditItem(item);
    setEditPrice(String(item.price));
    setEditStock(String(item.stock));
  };

  const handleSaveEdit = () => {
    if (!editItem) return;
    const price = Number(editPrice);
    const stock = Number(editStock);
    if (isNaN(price) || isNaN(stock)) { addToast('Invalid values', 'error'); return; }
    const status = stock === 0 ? 'out_of_stock' as const : stock <= 2 ? 'low_stock' as const : 'in_stock' as const;
    updateItem(editItem.id, { price, stock, status });
    addToast(`${editItem.name} updated successfully`, 'success');
    setEditItem(null);
  };

  return (
    <ProtectedRoute allowedRoles={['manager', 'admin']}>
      <DashboardLayout>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl text-[#F0E8D8] mb-1">Inventory Management</h1>
          <div className="w-16 h-0.5 bg-[#D4A843] mb-6" />
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 flex items-center bg-[#111116] border border-[#2A2A36] rounded px-3 py-2 gap-2">
            <Search className="size-4 text-[#6B6358]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search inventory..."
              className="bg-transparent text-sm text-[#F0E8D8] placeholder-[#6B6358] outline-none w-full" />
          </div>
          <div className="text-xs font-mono text-[#6B6358] self-center">{filtered.length} items</div>
        </div>

        <div className="bg-[#111116] border border-[#2A2A36] rounded overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#2A2A36]">
                {['ITEM', 'CATEGORY', 'CONDITION', 'PRICE', 'STOCK', 'STATUS', 'ACTIONS'].map(h => (
                  <th key={h} className="text-left text-[10px] font-mono tracking-[0.12em] text-[#A09888] p-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 20).map(item => (
                <tr key={item.id} className="border-b border-[#1E1E2A] hover:bg-white/[0.02] transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={item.images[0]} alt="" className="size-8 rounded object-cover grayscale" />
                      <span className="text-sm text-[#F0E8D8] truncate max-w-[180px]">{item.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-xs text-[#6B6358] capitalize">{item.category.replace('_', ' ')}</td>
                  <td className="p-3">
                    <span className={`px-1.5 py-0.5 text-[9px] font-mono tracking-wider rounded-sm border ${getConditionStyle(item.condition)}`}>
                      {getConditionLabel(item.condition)}
                    </span>
                  </td>
                  <td className="p-3 text-sm font-mono text-[#D4A843] tabular-nums">{formatPrice(item.price)}</td>
                  <td className="p-3 text-sm font-mono text-[#F0E8D8] tabular-nums">{item.stock}</td>
                  <td className="p-3">
                    <span className={`px-1.5 py-0.5 text-[9px] font-mono tracking-wider rounded-sm ${getItemStatusStyle(item.status)}`}>
                      {getItemStatusLabel(item.status)}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(item)} className="p-1.5 text-[#6B6358] hover:text-[#D4A843] transition-colors" aria-label="Edit">
                        <Pencil className="size-3.5" />
                      </button>
                      <button onClick={() => handleDelete(item)} className="p-1.5 text-[#6B6358] hover:text-red-400 transition-colors" aria-label="Delete">
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title={`Edit: ${editItem?.name}`}>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-[#A09888] mb-1.5">PRICE (RC)</label>
              <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)}
                className="w-full bg-[#0B0B0F] border border-[#2A2A36] rounded px-3 py-2.5 text-sm text-[#F0E8D8] focus:border-[#D4A843] outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-[#A09888] mb-1.5">STOCK</label>
              <input type="number" value={editStock} onChange={e => setEditStock(e.target.value)} min={0}
                className="w-full bg-[#0B0B0F] border border-[#2A2A36] rounded px-3 py-2.5 text-sm text-[#F0E8D8] focus:border-[#D4A843] outline-none transition-colors" />
            </div>
            <button onClick={handleSaveEdit}
              className="w-full py-2.5 text-sm font-mono font-semibold bg-[#D4A843] text-[#0B0B0F] hover:bg-[#E8B84D] rounded transition-colors">
              SAVE CHANGES
            </button>
          </div>
        </Modal>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
