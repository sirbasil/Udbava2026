-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('student', 'manager', 'admin')),
  avatar TEXT,
  loyaltyPoints INT DEFAULT 0,
  loyaltyTier TEXT DEFAULT 'Bronze',
  joinedAt TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Items table
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('all', 'electronics', 'apparel', 'media', 'furniture', 'lab_gear', 'books', 'merchandise')),
  price DECIMAL(10, 2) NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('new', 'like_new', 'good', 'fair')),
  year INT,
  description TEXT,
  sellerId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sellerName TEXT NOT NULL,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  stock INT DEFAULT 1,
  status TEXT DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'out_of_stock', 'restock', 'low_stock')),
  provenance TEXT,
  reported BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3, 2) DEFAULT 0,
  createdAt TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyerId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  itemId UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  itemName TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('in_transit', 'authenticated', 'delivered', 'pending', 'cancelled')),
  provenance TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_items_sellerId ON items(sellerId);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_transactions_buyerId ON transactions(buyerId);
CREATE INDEX idx_transactions_itemId ON transactions(itemId);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_notifications_userId ON notifications(userId);

-- Enable RLS (Row Level Security) for sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- RLS Policies for items table
CREATE POLICY "Items are viewable by everyone"
  ON items FOR SELECT
  USING (true);

CREATE POLICY "Users can create items"
  ON items FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own items"
  ON items FOR UPDATE
  USING (auth.uid()::text = sellerId::text);

-- RLS Policies for transactions table
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid()::text = buyerId::text OR auth.uid()::text IN (
    SELECT sellerId::text FROM items WHERE id = transactions.itemId
  ));

CREATE POLICY "Users can create transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for notifications table
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid()::text = userId::text);
