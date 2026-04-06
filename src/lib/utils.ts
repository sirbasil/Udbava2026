import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Condition, ItemStatus, TransactionStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function generateId(): string {
  return `RC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

export function generateRefId(): string {
  const num = Math.floor(Math.random() * 9000) + 1000;
  const suffix = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `#RTC-${num}-${suffix}`;
}

export function getConditionStyle(c: Condition): string {
  const map: Record<Condition, string> = {
    new: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    like_new: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    good: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    fair: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  };
  return map[c];
}

export function getConditionLabel(c: Condition): string {
  const map: Record<Condition, string> = { new: 'NEW', like_new: 'LIKE NEW', good: 'GOOD', fair: 'FAIR' };
  return map[c];
}

export function getItemStatusStyle(s: ItemStatus): string {
  const map: Record<ItemStatus, string> = {
    in_stock: 'bg-emerald-500/20 text-emerald-400',
    out_of_stock: 'bg-red-500/20 text-red-400',
    restock: 'bg-sky-500/20 text-sky-400',
    low_stock: 'bg-amber-500/20 text-amber-400',
  };
  return map[s];
}

export function getItemStatusLabel(s: ItemStatus): string {
  const map: Record<ItemStatus, string> = {
    in_stock: 'IN STOCK', out_of_stock: 'OUT OF STOCK', restock: 'RESTOCK', low_stock: 'LOW STOCK',
  };
  return map[s];
}

export function getTxStatusStyle(s: TransactionStatus): string {
  const map: Record<TransactionStatus, string> = {
    in_transit: 'bg-sky-500/20 text-sky-400',
    authenticated: 'bg-emerald-500/20 text-emerald-400',
    delivered: 'bg-emerald-500/20 text-emerald-400',
    pending: 'bg-amber-500/20 text-amber-400',
    cancelled: 'bg-red-500/20 text-red-400',
  };
  return map[s];
}

export function getTxStatusLabel(s: TransactionStatus): string {
  return s.replace('_', ' ').toUpperCase();
}

export function getLoyaltyTier(points: number): string {
  if (points >= 2000) return 'Platinum Archivist';
  if (points >= 1000) return 'Gold Archivist';
  if (points >= 500) return 'Silver Archivist';
  return 'Bronze Archivist';
}
