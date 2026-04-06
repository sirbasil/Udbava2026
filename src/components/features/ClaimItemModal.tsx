import { useState } from 'react';
import { Modal } from './Modal';
import type { Item } from '@/types';
import { useItemStore } from '@/stores/itemStore';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { formatPrice, getConditionLabel } from '@/lib/utils';
import { LOYALTY_POINTS_PER_PURCHASE, CURRENCY_SYMBOL } from '@/constants/config';
import { ShoppingBag, AlertTriangle, Star, Flag } from 'lucide-react';

interface ClaimItemModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClaimItemModal({ item, isOpen, onClose }: ClaimItemModalProps) {
  const [loading, setLoading] = useState(false);
  const { claimItem, reportItem } = useItemStore();
  const { user, addLoyaltyPoints } = useAuthStore();
  const { addToast } = useToastStore();
  const { addNotification } = useNotificationStore();

  if (!item) return null;

  const handleClaim = () => {
    if (!user) return;
    setLoading(true);
    setTimeout(() => {
      const result = claimItem(item.id, user.id);
      if (result.success) {
        addLoyaltyPoints(LOYALTY_POINTS_PER_PURCHASE);
        addToast(`Successfully claimed ${item.name}! +${LOYALTY_POINTS_PER_PURCHASE} XP`, 'success');
        addNotification({ title: 'Item Claimed', message: `${item.name} has been added to your acquisitions.`, type: 'success' });
        onClose();
      } else {
        addToast(result.error || 'Failed to claim item', 'error');
      }
      setLoading(false);
    }, 800);
  };

  const handleReport = () => {
    reportItem(item.id);
    addToast('Item has been flagged for review', 'warning');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Claim Artefact">
      <div className="flex gap-4 mb-5">
        <img src={item.images[0]} alt={item.name} className="size-24 rounded object-cover grayscale" />
        <div>
          <h3 className="font-body font-semibold text-[#F0E8D8] text-lg">{item.name}</h3>
          <p className="text-xs text-[#6B6358] mt-1">{getConditionLabel(item.condition)} · {item.year}</p>
          <p className="text-xs text-[#6B6358] mt-0.5">{item.provenance}</p>
          <div className="flex items-center gap-1 mt-2">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`size-3 ${s <= Math.round(item.rating) ? 'fill-[#D4A843] text-[#D4A843]' : 'text-[#2A2A36]'}`} />
            ))}
            <span className="text-xs text-[#6B6358] ml-1">{item.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-[#A09888] mb-4 leading-relaxed">{item.description}</p>
      <div className="flex items-center justify-between bg-[#0B0B0F] border border-[#2A2A36] p-4 rounded mb-5">
        <div>
          <p className="text-xs text-[#6B6358] font-mono">TOTAL</p>
          <p className="text-2xl font-display font-bold text-[#D4A843]">{formatPrice(item.price)} {CURRENCY_SYMBOL}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#6B6358] font-mono">STOCK</p>
          <p className="text-lg font-mono text-[#F0E8D8]">{item.stock} left</p>
        </div>
      </div>
      {item.stock <= 0 && (
        <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded mb-4">
          <AlertTriangle className="size-4" />
          <span className="text-sm">This item is currently out of stock.</span>
        </div>
      )}
      <div className="flex gap-3">
        <button
          onClick={handleReport}
          className="px-4 py-2.5 text-xs font-mono border border-[#2A2A36] text-[#6B6358] hover:text-red-400 hover:border-red-500/30 rounded transition-colors flex items-center gap-2"
        >
          <Flag className="size-3.5" /> REPORT
        </button>
        <button
          onClick={handleClaim}
          disabled={item.stock <= 0 || loading}
          className="flex-1 py-2.5 text-sm font-mono font-semibold tracking-wider bg-[#D4A843] text-[#0B0B0F] hover:bg-[#E8B84D] rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="size-4 border-2 border-[#0B0B0F] border-t-transparent rounded-full animate-spin" />
          ) : (
            <><ShoppingBag className="size-4" /> CONFIRM CLAIM</>
          )}
        </button>
      </div>
    </Modal>
  );
}
