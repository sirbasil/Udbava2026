import { useState, useRef } from 'react';
import { Modal } from './Modal';
import { useItemStore } from '@/stores/itemStore';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';
import { CATEGORIES, CONDITIONS, MIN_IMAGES_REQUIRED, LOYALTY_POINTS_PER_LISTING } from '@/constants/config';
import { Upload, X, ImagePlus } from 'lucide-react';
import type { Category, Condition } from '@/types';

interface NewListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLACEHOLDER_IMGS = [
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop',
];

export function NewListingModal({ isOpen, onClose }: NewListingModalProps) {
  const { addItem } = useItemStore();
  const { user, addLoyaltyPoints } = useAuthStore();
  const { addToast } = useToastStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [fileCount, setFileCount] = useState(0);
  const [form, setForm] = useState({
    name: '', category: 'electronics' as Category, year: new Date().getFullYear(),
    condition: 'good' as Condition, description: '', price: 0, stock: 1,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setFileCount(files.length);
    const urls: string[] = [];
    Array.from(files).slice(0, 5).forEach(f => urls.push(URL.createObjectURL(f)));
    setPreviews(urls);
    if (files.length < MIN_IMAGES_REQUIRED) {
      setErrors(p => ({ ...p, images: `Exactly ${MIN_IMAGES_REQUIRED} images required (${files.length} selected)` }));
    } else {
      setErrors(p => { const n = { ...p }; delete n.images; return n; });
    }
  };

  const removePreview = (idx: number) => {
    setPreviews(p => p.filter((_, i) => i !== idx));
    setFileCount(c => c - 1);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (form.price <= 0) e.price = 'Price must be greater than 0';
    if (!form.description.trim()) e.description = 'Description is required';
    if (form.year < 1800 || form.year > new Date().getFullYear()) e.year = 'Invalid year';
    if (fileCount < MIN_IMAGES_REQUIRED) e.images = `Minimum ${MIN_IMAGES_REQUIRED} images required`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate() || !user) return;
    setLoading(true);
    setTimeout(() => {
      addItem({
        name: form.name,
        category: form.category,
        price: form.price,
        condition: form.condition,
        year: form.year,
        description: form.description,
        sellerId: user.id,
        sellerName: user.name.toUpperCase().replace(/\s/g, '_'),
        images: PLACEHOLDER_IMGS.slice(0, 3),
        stock: form.stock,
        provenance: 'Campus Exchange',
      });
      addLoyaltyPoints(LOYALTY_POINTS_PER_LISTING);
      addToast(`"${form.name}" listed successfully! +${LOYALTY_POINTS_PER_LISTING} XP`, 'success');
      setForm({ name: '', category: 'electronics', year: new Date().getFullYear(), condition: 'good', description: '', price: 0, stock: 1 });
      setPreviews([]);
      setFileCount(0);
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit New Artifact" wide>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[#A09888] mb-1.5">PRODUCT NAME *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full bg-[#0B0B0F] border border-[#2A2A36] rounded px-3 py-2.5 text-sm text-[#F0E8D8] placeholder-[#6B6358] focus:border-[#D4A843] focus:outline-none transition-colors"
              placeholder="e.g. Vintage Compass" />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs font-mono text-[#A09888] mb-1.5">CATEGORY *</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as Category }))}
              className="w-full bg-[#0B0B0F] border border-[#2A2A36] rounded px-3 py-2.5 text-sm text-[#F0E8D8] focus:border-[#D4A843] focus:outline-none transition-colors">
              {CATEGORIES.filter(c => c.value !== 'all').map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-[#A09888] mb-1.5">PRICE (RC) *</label>
            <input type="number" value={form.price || ''} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))}
              className="w-full bg-[#0B0B0F] border border-[#2A2A36] rounded px-3 py-2.5 text-sm text-[#F0E8D8] focus:border-[#D4A843] focus:outline-none transition-colors" placeholder="0" />
            {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-xs font-mono text-[#A09888] mb-1.5">YEAR *</label>
            <input type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: Number(e.target.value) }))}
              className="w-full bg-[#0B0B0F] border border-[#2A2A36] rounded px-3 py-2.5 text-sm text-[#F0E8D8] focus:border-[#D4A843] focus:outline-none transition-colors" />
            {errors.year && <p className="text-xs text-red-400 mt-1">{errors.year}</p>}
          </div>
          <div>
            <label className="block text-xs font-mono text-[#A09888] mb-1.5">STOCK</label>
            <input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: Number(e.target.value) }))}
              className="w-full bg-[#0B0B0F] border border-[#2A2A36] rounded px-3 py-2.5 text-sm text-[#F0E8D8] focus:border-[#D4A843] focus:outline-none transition-colors" min={1} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-mono text-[#A09888] mb-1.5">CONDITION *</label>
          <div className="flex gap-2">
            {CONDITIONS.map(c => (
              <button key={c.value} onClick={() => setForm(p => ({ ...p, condition: c.value as Condition }))}
                className={`px-3 py-2 text-xs font-mono border rounded transition-all ${form.condition === c.value ? 'bg-[#D4A843]/20 border-[#D4A843] text-[#D4A843]' : 'border-[#2A2A36] text-[#6B6358] hover:border-[#A09888]'}`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-mono text-[#A09888] mb-1.5">DESCRIPTION *</label>
          <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
            className="w-full bg-[#0B0B0F] border border-[#2A2A36] rounded px-3 py-2.5 text-sm text-[#F0E8D8] placeholder-[#6B6358] focus:border-[#D4A843] focus:outline-none transition-colors resize-none"
            placeholder="Describe the item's history, condition, and provenance..." />
          {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
        </div>
        <div>
          <label className="block text-xs font-mono text-[#A09888] mb-1.5">IMAGES ({MIN_IMAGES_REQUIRED} REQUIRED) *</label>
          <div className="flex flex-wrap gap-3">
            {previews.map((url, i) => (
              <div key={i} className="relative size-20 rounded border border-[#2A2A36] overflow-hidden">
                <img src={url} className="w-full h-full object-cover" alt={`Preview ${i + 1}`} />
                <button onClick={() => removePreview(i)} className="absolute top-0.5 right-0.5 p-0.5 bg-black/70 rounded-full text-white">
                  <X className="size-3" />
                </button>
              </div>
            ))}
            <button onClick={() => fileRef.current?.click()}
              className="size-20 rounded border-2 border-dashed border-[#2A2A36] flex flex-col items-center justify-center text-[#6B6358] hover:border-[#D4A843] hover:text-[#D4A843] transition-colors">
              <ImagePlus className="size-5 mb-1" />
              <span className="text-[10px] font-mono">ADD</span>
            </button>
          </div>
          <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
          {errors.images && <p className="text-xs text-red-400 mt-1">{errors.images}</p>}
        </div>
        <button onClick={handleSubmit} disabled={loading}
          className="w-full py-3 text-sm font-mono font-semibold tracking-wider bg-[#D4A843] text-[#0B0B0F] hover:bg-[#E8B84D] rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <div className="size-4 border-2 border-[#0B0B0F] border-t-transparent rounded-full animate-spin" /> : <><Upload className="size-4" /> SUBMIT ARTIFACT</>}
        </button>
      </div>
    </Modal>
  );
}
