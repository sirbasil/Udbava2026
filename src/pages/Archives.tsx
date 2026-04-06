import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useItemStore } from '@/stores/itemStore';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';
import { ClaimItemModal } from '@/components/features/ClaimItemModal';
import { formatPrice, getConditionLabel, getConditionStyle, getTxStatusStyle, getTxStatusLabel } from '@/lib/utils';
import { CURRENCY_SYMBOL } from '@/constants/config';
import { Search, SlidersHorizontal, Grid, List, Clock, BookOpen, Award, TrendingDown, ArrowUpDown } from 'lucide-react';
import type { Item } from '@/types';

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'price_high' | 'price_low' | 'name';
type ArchiveTab = 'catalog' | 'sold' | 'transactions';

export default function Archives() {
  const navigate = useNavigate();
  const { items, transactions } = useItemStore();
  const { isAuthenticated, user } = useAuthStore();
  const { addToast } = useToastStore();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [tab, setTab] = useState<ArchiveTab>('catalog');
  const [claimItem, setClaimItem] = useState<Item | null>(null);
  const [showSort, setShowSort] = useState(false);

  const allItems = useMemo(() => {
    let filtered = [...items];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.category.replace('_', ' ').toLowerCase().includes(q) ||
        i.sellerName.toLowerCase().includes(q) ||
        i.provenance.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case 'newest': filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
      case 'oldest': filtered.sort((a, b) => a.createdAt.localeCompare(b.createdAt)); break;
      case 'price_high': filtered.sort((a, b) => b.price - a.price); break;
      case 'price_low': filtered.sort((a, b) => a.price - b.price); break;
      case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return filtered;
  }, [items, search, sortBy]);

  const soldItems = allItems.filter(i => i.stock <= 0);
  const catalogItems = allItems;

  const handleClaim = (item: Item) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setClaimItem(item);
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'name', label: 'Name A-Z' },
  ];

  const totalValue = items.reduce((s, i) => s + i.price * i.stock, 0);
  const totalItems = items.length;
  const totalSold = items.filter(i => i.stock <= 0).length;

  return (
    <div className="min-h-screen bg-[#0B0B0F]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display italic text-4xl lg:text-5xl text-[#F0E8D8] mb-2">The Archives</h1>
          <p className="text-xs font-mono tracking-[0.2em] text-[#6B6358] mb-1">COMPLETE CATALOG OF ALL ARTEFACTS</p>
          <div className="w-16 h-0.5 bg-[#D4A843] mb-8" />
        </motion.div>

        {/* Archive Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, label: 'TOTAL ARTEFACTS', value: totalItems, color: 'text-[#D4A843]' },
            { icon: Award, label: 'ARCHIVE VALUE', value: `${formatPrice(totalValue)} ${CURRENCY_SYMBOL}`, color: 'text-[#D4A843]' },
            { icon: TrendingDown, label: 'SOLD OUT', value: totalSold, color: 'text-red-400' },
            { icon: Clock, label: 'TRANSACTIONS', value: transactions.length, color: 'text-sky-400' },
          ].map(stat => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#111116] border border-[#2A2A36] rounded p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`size-4 ${stat.color}`} />
                <span className="text-[10px] font-mono text-[#6B6358] tracking-wider">{stat.label}</span>
              </div>
              <p className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-[#2A2A36] mb-6">
          {([
            { key: 'catalog' as ArchiveTab, label: 'Full Catalog', count: catalogItems.length },
            { key: 'sold' as ArchiveTab, label: 'Sold Archive', count: soldItems.length },
            { key: 'transactions' as ArchiveTab, label: 'Transaction Log', count: transactions.length },
          ]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-xs font-mono tracking-wider transition-colors ${
                tab === t.key
                  ? 'text-[#D4A843] border-b-2 border-[#D4A843]'
                  : 'text-[#6B6358] hover:text-[#A09888]'
              }`}>
              {t.label} <span className="ml-1 text-[10px] opacity-60">({t.count})</span>
            </button>
          ))}
        </div>

        {/* Search & Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="flex-1 flex items-center bg-[#111116] border border-[#2A2A36] rounded px-3 py-2 gap-2">
            <Search className="size-4 text-[#6B6358]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search all archives by name, category, seller, provenance..."
              className="bg-transparent text-sm text-[#F0E8D8] placeholder-[#6B6358] outline-none w-full" />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 px-3 py-2 border border-[#2A2A36] rounded text-xs font-mono text-[#A09888] hover:border-[#D4A843] transition-colors">
                <ArrowUpDown className="size-3.5" />
                {sortOptions.find(s => s.value === sortBy)?.label}
              </button>
              {showSort && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-[#141418] border border-[#2A2A36] rounded-lg shadow-2xl overflow-hidden z-20">
                  {sortOptions.map(opt => (
                    <button key={opt.value} onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                      className={`w-full px-3 py-2 text-xs text-left font-mono transition-colors ${sortBy === opt.value ? 'text-[#D4A843] bg-[#D4A843]/10' : 'text-[#A09888] hover:bg-white/5'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex border border-[#2A2A36] rounded overflow-hidden">
              <button onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-[#D4A843]/20 text-[#D4A843]' : 'text-[#6B6358] hover:text-[#A09888]'}`}>
                <Grid className="size-4" />
              </button>
              <button onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-[#D4A843]/20 text-[#D4A843]' : 'text-[#6B6358] hover:text-[#A09888]'}`}>
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {tab === 'transactions' ? (
          <div className="bg-[#111116] border border-[#2A2A36] rounded overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-[#2A2A36]">
                  {['TRANSACTION ID', 'ARTIFACT', 'STATUS', 'PROVENANCE', 'AMOUNT', 'DATE'].map(h => (
                    <th key={h} className="text-left text-[10px] font-mono tracking-[0.12em] text-[#A09888] p-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} className="border-b border-[#1E1E2A] hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-sm font-mono text-[#6B6358]">{tx.id}</td>
                    <td className="p-4 text-sm text-[#F0E8D8]">{tx.itemName}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider rounded-sm ${getTxStatusStyle(tx.status)}`}>
                        {getTxStatusLabel(tx.status)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-[#6B6358] italic">{tx.provenance}</td>
                    <td className="p-4 text-sm font-mono text-[#D4A843] tabular-nums">{formatPrice(tx.amount)} {CURRENCY_SYMBOL}</td>
                    <td className="p-4 text-xs font-mono text-[#6B6358]">{tx.createdAt}</td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-sm text-[#6B6358]">No transactions recorded</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {(tab === 'sold' ? soldItems : catalogItems).map((item, i) => (
                  <motion.div key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="group bg-[#141418] border border-[#2A2A36] overflow-hidden hover:border-[#D4A843]/20 transition-all">
                    <div className="relative aspect-square overflow-hidden bg-[#0D0D12]">
                      <img src={item.images[0]} alt={item.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <span className={`px-1.5 py-0.5 text-[9px] font-mono font-semibold tracking-wider rounded-sm border ${getConditionStyle(item.condition)}`}>
                          {getConditionLabel(item.condition)}
                        </span>
                      </div>
                      {item.stock <= 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-xs font-mono font-bold text-red-400 tracking-wider">SOLD OUT</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm text-[#F0E8D8] font-medium truncate">{item.name}</h3>
                      <p className="text-[10px] text-[#6B6358] font-mono mt-0.5">{item.provenance} · {item.year}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-mono text-[#D4A843] text-sm font-semibold">{formatPrice(item.price)} {CURRENCY_SYMBOL}</span>
                        {item.stock > 0 && (
                          <button onClick={() => handleClaim(item)}
                            className="px-2 py-1 text-[10px] font-mono font-semibold border border-[#D4A843] text-[#D4A843] hover:bg-[#D4A843] hover:text-[#0B0B0F] transition-all">
                            CLAIM
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-[#111116] border border-[#2A2A36] rounded overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-[#2A2A36]">
                      {['ARTIFACT', 'CATEGORY', 'CONDITION', 'YEAR', 'PROVENANCE', 'PRICE', 'STOCK', ''].map(h => (
                        <th key={h} className="text-left text-[10px] font-mono tracking-[0.12em] text-[#A09888] p-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(tab === 'sold' ? soldItems : catalogItems).map(item => (
                      <tr key={item.id} className="border-b border-[#1E1E2A] hover:bg-white/[0.02] transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={item.images[0]} alt="" className="size-8 rounded object-cover grayscale" />
                            <span className="text-sm text-[#F0E8D8] truncate max-w-[200px]">{item.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-xs text-[#6B6358] capitalize">{item.category.replace('_', ' ')}</td>
                        <td className="p-3">
                          <span className={`px-1.5 py-0.5 text-[9px] font-mono tracking-wider rounded-sm border ${getConditionStyle(item.condition)}`}>
                            {getConditionLabel(item.condition)}
                          </span>
                        </td>
                        <td className="p-3 text-xs font-mono text-[#6B6358]">{item.year}</td>
                        <td className="p-3 text-xs text-[#6B6358] italic">{item.provenance}</td>
                        <td className="p-3 text-sm font-mono text-[#D4A843] tabular-nums">{formatPrice(item.price)}</td>
                        <td className="p-3 text-sm font-mono text-[#F0E8D8] tabular-nums">{item.stock}</td>
                        <td className="p-3">
                          {item.stock > 0 && (
                            <button onClick={() => handleClaim(item)}
                              className="px-2 py-1 text-[10px] font-mono font-semibold border border-[#D4A843] text-[#D4A843] hover:bg-[#D4A843] hover:text-[#0B0B0F] transition-all">
                              CLAIM
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {(tab === 'sold' ? soldItems : catalogItems).length === 0 && (
              <div className="text-center py-16">
                <p className="font-display italic text-xl text-[#6B6358]">No artifacts found</p>
                <p className="text-xs text-[#6B6358] mt-2">Try adjusting your search query</p>
              </div>
            )}
          </>
        )}
      </div>

      <ClaimItemModal item={claimItem} isOpen={!!claimItem} onClose={() => setClaimItem(null)} />
    </div>
  );
}
