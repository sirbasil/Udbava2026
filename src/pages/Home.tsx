import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Microscope, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useItemStore } from '@/stores/itemStore';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';
import { ItemCard } from '@/components/features/ItemCard';
import { ClaimItemModal } from '@/components/features/ClaimItemModal';
import type { Item } from '@/types';

const HERO_CATEGORIES = [
  { label: 'USED BOOKS', icon: BookOpen, category: 'books' },
  { label: 'LAB GEAR', icon: Microscope, category: 'lab_gear' },
  { label: 'MERCHANDISE', icon: ShoppingBag, category: 'merchandise' },
];

export default function Home() {
  const navigate = useNavigate();
  const { items, setSearchQuery, setSelectedCategory } = useItemStore();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const [localSearch, setLocalSearch] = useState('');
  const [claimItem, setClaimItem] = useState<Item | null>(null);
  const [subscribeEmail, setSubscribeEmail] = useState('');

  const featuredItems = items.slice(5, 8); // Physics, Lens Set, Hoodie

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    navigate('/exchange');
  };

  const handleCategory = (cat: string) => {
    setSelectedCategory(cat as Item['category']);
    navigate('/exchange');
  };

  const handleClaim = (item: Item) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setClaimItem(item);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail.trim()) return;
    addToast('Subscribed! We\'ll notify you of restocks.', 'success');
    setSubscribeEmail('');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(180deg, transparent 0%, #0B0B0F 75%),
            radial-gradient(ellipse 100% 60% at 50% -5%, rgba(236,72,153,0.3) 0%, transparent 55%),
            radial-gradient(ellipse 70% 45% at 25% -5%, rgba(234,179,8,0.2) 0%, transparent 45%),
            radial-gradient(ellipse 70% 45% at 75% -5%, rgba(20,184,166,0.22) 0%, transparent 45%)
          `
        }} />
        {/* Teal wave */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg viewBox="0 0 1440 100" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 100L1440 100L1440 50C1200 85 960 15 720 35C480 55 240 85 0 50L0 100Z" fill="rgba(20,184,166,0.08)" />
          </svg>
        </div>
        {/* Gold line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4A843] to-transparent" />

        <div className="relative px-4 pt-20 pb-28 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="font-display italic text-6xl sm:text-7xl lg:text-8xl text-[#D4A843] mb-4">
            RetCom
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            className="text-xs sm:text-sm font-mono tracking-[0.25em] text-[#A09888] mb-10">
            RETAIL COMMUNITY — SR UNIVERSITY
          </motion.p>

          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSearch}
            className="max-w-md mx-auto mb-8">
            <div className="flex items-center border border-[#D4A843]/40 bg-[#0B0B0F]/60 backdrop-blur-sm rounded px-4 py-3 gap-3">
              <Search className="size-5 text-[#D4A843]" />
              <input value={localSearch} onChange={e => setLocalSearch(e.target.value)}
                placeholder="Search books, gear, supplies..."
                className="bg-transparent text-sm text-[#F0E8D8] placeholder-[#6B6358] outline-none w-full" />
            </div>
          </motion.form>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap justify-center gap-3">
            {HERO_CATEGORIES.map(c => (
              <button key={c.label} onClick={() => handleCategory(c.category)}
                className="flex items-center gap-2 px-4 py-2 border border-[#D4A843]/50 text-[#D4A843] text-xs font-mono tracking-wider hover:bg-[#D4A843]/10 transition-colors">
                <c.icon className="size-3.5" /> {c.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="px-4 lg:px-12 py-16">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="font-display italic text-3xl text-[#F0E8D8] mb-1">Featured Items</h2>
          <div className="w-16 h-0.5 bg-[#D4A843] mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map(item => (
              <ItemCard key={item.id} item={item} onClaim={() => handleClaim(item)} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Never Miss a Restock */}
      <section className="px-4 lg:px-12 pb-16">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-[#111116] border border-[#2A2A36] rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8 p-8">
            <div className="flex-1">
              <div className="w-1 h-16 bg-[#D4A843] mb-4 rounded-full" />
              <h3 className="font-display italic text-2xl text-[#F0E8D8] mb-2">Never Miss a Restock</h3>
              <p className="text-sm text-[#6B6358] leading-relaxed">
                The archives are vast but limited. Leave your credentials and we shall summon you when your desired artifacts reappear.
              </p>
            </div>
            <div className="w-full md:w-64">
              <form onSubmit={handleSubscribe}>
                <div className="relative mb-3">
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#D4A843]/40" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#D4A843]/40" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#D4A843]/40" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#D4A843]/40" />
                  <input value={subscribeEmail} onChange={e => setSubscribeEmail(e.target.value)}
                    placeholder="Email or Student ID"
                    className="w-full bg-[#0B0B0F] border border-[#2A2A36] rounded px-4 py-3 text-sm text-[#F0E8D8] placeholder-[#6B6358] outline-none focus:border-[#D4A843] transition-colors" />
                </div>
                <button type="submit"
                  className="w-full py-2.5 text-xs font-mono font-semibold tracking-[0.15em] bg-[#D4A843] text-[#0B0B0F] hover:bg-[#E8B84D] rounded transition-colors">
                  SUBSCRIBE
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </section>

      <ClaimItemModal item={claimItem} isOpen={!!claimItem} onClose={() => setClaimItem(null)} />
    </div>
  );
}
