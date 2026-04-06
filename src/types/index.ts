export type Role = 'student' | 'manager' | 'admin';
export type Condition = 'new' | 'like_new' | 'good' | 'fair';
export type Category = 'all' | 'electronics' | 'apparel' | 'media' | 'furniture' | 'lab_gear' | 'books' | 'merchandise';
export type ItemStatus = 'in_stock' | 'out_of_stock' | 'restock' | 'low_stock';
export type TransactionStatus = 'in_transit' | 'authenticated' | 'delivered' | 'pending' | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  loyaltyPoints: number;
  loyaltyTier: string;
  joinedAt: string;
}

export interface Item {
  id: string;
  name: string;
  category: Category;
  price: number;
  condition: Condition;
  year: number;
  description: string;
  sellerId: string;
  sellerName: string;
  images: string[];
  stock: number;
  status: ItemStatus;
  provenance: string;
  createdAt: string;
  reported: boolean;
  rating: number;
}

export interface Transaction {
  id: string;
  buyerId: string;
  itemId: string;
  itemName: string;
  status: TransactionStatus;
  provenance: string;
  amount: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface InventoryManifest {
  referenceId: string;
  name: string;
  status: 'stable' | 'in_transit' | 'low_stock' | 'depleted';
  valuation: number;
}

export interface ActivityLog {
  id: string;
  message: string;
  highlight?: string;
  type: 'admin' | 'system' | 'user';
  timestamp: string;
}

export interface Alert {
  id: string;
  type: 'stock_depletion' | 'manifest_update' | 'security';
  title: string;
  message: string;
  timestamp: string;
}
