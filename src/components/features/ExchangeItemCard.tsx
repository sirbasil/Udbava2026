import type { Item } from '@/types';
import { formatPrice, getConditionStyle, getConditionLabel } from '@/lib/utils';
import { CURRENCY_SYMBOL } from '@/constants/config';

interface ExchangeItemCardProps {
  item: Item;
  onClaim: () => void;
}

export function ExchangeItemCard({ item, onClaim }: ExchangeItemCardProps) {
  return (
    <div className="group bg-[#141418] border border-[#2A2A36] overflow-hidden hover:border-[#D4A843]/20 transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0D0D12]">
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider rounded-sm border ${getConditionStyle(item.condition)}`}>
            {getConditionLabel(item.condition)}
          </span>
          <span className="font-mono text-[#D4A843] text-xs font-semibold">
            {formatPrice(item.price)} {CURRENCY_SYMBOL}
          </span>
        </div>
        <h3 className="font-body font-medium text-[#F0E8D8] text-base mb-1">{item.name}</h3>
        <p className="text-xs text-[#6B6358] line-clamp-2 mb-3 leading-relaxed">{item.description}</p>
        <div className="flex items-center justify-between pt-3 border-t border-[#1E1E2A]">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-full bg-[#2A2A36]" />
            <span className="text-xs text-[#6B6358] font-mono">@{item.sellerName}</span>
          </div>
          <button
            onClick={onClaim}
            disabled={item.stock <= 0}
            className="px-3 py-1.5 text-xs font-mono font-semibold tracking-wider border border-[#D4A843] text-[#D4A843] hover:bg-[#D4A843] hover:text-[#0B0B0F] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {item.stock <= 0 ? 'SOLD OUT' : 'CLAIM ITEM'}
          </button>
        </div>
      </div>
    </div>
  );
}
