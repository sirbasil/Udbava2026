import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useItemStore } from '@/stores/itemStore';
import { useAuthStore } from '@/stores/authStore';
import { ExchangeItemCard } from '@/components/features/ExchangeItemCard';
import { ClaimItemModal } from '@/components/features/ClaimItemModal';
import { NewListingModal } from '@/components/features/NewListingModal';
import { CATEGORIES } from '@/constants/config';
import type { Item, Category } from '@/types';

export default function Exchange() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, searchQuery, selectedCategory, setSelectedCategory, priceRange, setPriceRange } = useItemStore();
  const [claimItem, setClaimItem] = useState<Item | null>(null);
  const [listingOpen, setListingOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    return items.filter(item => {
      const matchSearch = !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
      return matchSearch && matchCategory && matchPrice;
    });
  }, [items, searchQuery, selectedCategory, priceRange]);

  const handleClaim = (item: Item) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setClaimItem(item);
  };

  const maxPrice = Math.max(...items.map(i => i.price), 5000);

  const sidebar = (
    <>
      <div className="mb-6">
        <h3 className="text-xs font-mono tracking-[0.15em] text-[#A09888] mb-3">CLASSIFICATIONS</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.filter(c => ['all','electronics','apparel','media','furniture'].includes(c.value)).map(c => (
            <button key={c.value} onClick={() => setSelectedCategory(c.value as Category)}
              className={`px-3 py-1.5 text-xs font-mono tracking-wider border rounded-sm transition-all ${
                selectedCategory === c.value
                  ? 'bg-[#D4A843]/20 border-[#D4A843] text-[#D4A843]'
                  : 'border-[#2A2A36] text-[#6B6358] hover:border-[#A09888] hover:text-[#A09888]'}`}>
              {c.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-[#D4A843]/30 bg-[#D4A843]/5 rounded p-4 mb-6">
        <h4 className="font-display italic text-sm text-[#D4A843] mb-2">Curator's Note</h4>
        <p className="text-xs text-[#A09888] leading-relaxed">
          Every piece in the Exchange has been verified for historical authenticity.
          Ensure your listing follows the Archivist's Protocol.
        </p>
      </div>

      <div>
        <h3 className="text-xs font-mono tracking-[0.15em] text-[#A09888] mb-3">PRICE RANGE</h3>
        <input type="range" min={0} max={maxPrice} value={priceRange[1]}
          onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-[#D4A843] mb-2" />
        <div className="flex justify-between text-[10px] font-mono text-[#6B6358]">
          <span>0.00 RC</span>
          <span>{priceRange[1].toLocaleString()}.00 RC</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#0B0B0F]">
      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 shrink-0 p-6 border-r border-[#1E1E2A] min-h-[calc(100vh-3.5rem)]">
          {sidebar}
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 p-4 lg:p-8">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4">
            <button onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-3 py-2 border border-[#2A2A36] rounded text-xs text-[#A09888]">
              <SlidersHorizontal className="size-3.5" /> Filters
            </button>
            {filterOpen && <div className="mt-4 p-4 bg-[#111116] border border-[#2A2A36] rounded">{sidebar}</div>}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display italic text-4xl lg:text-6xl text-[#F0E8D8] mb-2">The Exchange</h1>
            <p className="text-xs font-mono tracking-[0.2em] text-[#6B6358] mb-8">
              AUTHENTIC PEER-TO-PEER ARTEFACT TRADING
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <motion.div key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}>
                <ExchangeItemCard item={item} onClaim={() => handleClaim(item)} />
              </motion.div>
            ))}

            {/* Submit Artefact CTA */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: filtered.length * 0.05 }}>
              <button onClick={() => {
                if (!isAuthenticated) { navigate('/login'); return; }
                setListingOpen(true);
              }}
                className="w-full h-full min-h-[320px] bg-[#111116] border border-dashed border-[#2A2A36] rounded flex flex-col items-center justify-center gap-3 hover:border-[#D4A843]/40 hover:bg-[#D4A843]/5 transition-all group">
                <div className="size-12 rounded-full border border-[#2A2A36] flex items-center justify-center group-hover:border-[#D4A843] transition-colors">
                  <Plus className="size-6 text-[#6B6358] group-hover:text-[#D4A843] transition-colors" />
                </div>
                <p className="font-display text-lg text-[#A09888] group-hover:text-[#F0E8D8] transition-colors">Submit Artefact</p>
                <p className="text-[10px] font-mono text-[#6B6358] tracking-wider">JOIN THE EXCHANGE</p>
              </button>
            </motion.div>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="font-display italic text-xl text-[#6B6358]">No artifacts found</p>
              <p className="text-xs text-[#6B6358] mt-2">Try adjusting your filters or search query</p>
            </div>
          )}
        </main>
      </div>

      <ClaimItemModal item={claimItem} isOpen={!!claimItem} onClose={() => setClaimItem(null)} />
      <NewListingModal isOpen={listingOpen} onClose={() => setListingOpen(false)} />
    </div>
  );
}
