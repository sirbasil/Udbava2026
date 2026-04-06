import { ShoppingBag } from 'lucide-react';
import type { Item } from '@/types';
import { formatPrice, getItemStatusStyle, getItemStatusLabel } from '@/lib/utils';

interface ItemCardProps {
  item: Item;
  onClaim?: () => void;
}

export function ItemCard({ item, onClaim }: ItemCardProps) {
  return (
    <div className="group bg-[#141418] border border-[#2A2A36] overflow-hidden hover:border-[#D4A843]/30 transition-all duration-300">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
        />
        <span className={`absolute top-3 right-3 px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider rounded-sm ${getItemStatusStyle(item.status)}`}>
          {getItemStatusLabel(item.status)}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-[#F0E8D8] font-body text-sm mb-2 truncate">{item.name}</h3>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[#D4A843] text-sm font-semibold">${formatPrice(item.price)}</span>
          <button
            onClick={onClaim}
            disabled={item.stock <= 0}
            className="p-2 text-[#A09888] hover:text-[#D4A843] hover:bg-[#D4A843]/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label={`Add ${item.name} to cart`}
          >
            <ShoppingBag className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
