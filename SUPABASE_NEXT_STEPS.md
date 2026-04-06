# Supabase Integration - Next Steps Guide

## What's Been Set Up

✅ **Supabase Client** - `src/lib/supabase.ts`
✅ **Authentication Service** - `src/services/authService.ts`
✅ **Item Service** - `src/services/itemService.ts`
✅ **Transaction Service** - `src/services/transactionService.ts` 
✅ **Updated Auth Store** - `src/stores/authStore.ts` (now uses Supabase)
✅ **Database Schema** - `SUPABASE_SCHEMA.sql`
✅ **Setup Guide** - `SUPABASE_SETUP.md`

## Step 1: Set Environment Variables

1. Copy your Supabase credentials:
   - Go to your Supabase project dashboard
   - Settings → API
   - Copy **Project URL** and **Anon Key**

2. Update `.env.local`:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 2: Create Database Schema

1. Go to Supabase dashboard → SQL Editor
2. Click "New Query"
3. Copy entire content from `SUPABASE_SCHEMA.sql`
4. Execute the query

## Step 3: Update Components to Use Async Auth

### Login Component Example
```typescript
import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';

export function LoginForm() {
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      // Redirect to dashboard
    } else {
      console.error(result.error);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
```

## Step 4: Update Item Store

The `itemStore.ts` needs to be updated to use `itemService`. Here's the pattern:

```typescript
import { create } from 'zustand';
import { itemService } from '@/services/itemService';
import type { Item, Category } from '@/types';

interface ItemState {
  items: Item[];
  isLoading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  searchItems: (query: string, category: Category, priceRange: [number, number]) => Promise<void>;
  // ... other methods
}

export const useItemStore = create<ItemState>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true });
    const result = await itemService.getAllItems();
    if (result.success) {
      set({ items: result.data, error: null });
    } else {
      set({ error: result.error });
    }
    set({ isLoading: false });
  },

  searchItems: async (query, category, priceRange) => {
    set({ isLoading: true });
    const result = await itemService.searchItems(query, category, priceRange);
    if (result.success) {
      set({ items: result.data, error: null });
    } else {
      set({ error: result.error });
    }
    set({ isLoading: false });
  },
}));
```

## Step 5: Load Initial Data

Update your `App.tsx` to load current user on mount:

```typescript
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export function App() {
  const { loadCurrentUser } = useAuthStore();

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  // ... rest of app
}
```

## Step 6: Update Component Imports

Change imports in your components from static services to the stores:

Before:
```typescript
import { SEED_USERS } from '@/constants/mockData';
const user = SEED_USERS[0];
```

After:
```typescript
import { useAuthStore } from '@/stores/authStore';
const { user } = useAuthStore();
```

## Important Changes in Auth Store

### Before (Local State):
```typescript
const { success } = login(email, password);  // Synchronous
```

### After (Supabase):
```typescript
const { success } = await login(email, password);  // Async - use await!
```

## Files to Update Next

1. **src/pages/Login.tsx** - Update to handle async login
2. **src/stores/itemStore.ts** - Replace mock data with `itemService` calls
3. **src/components/features/NewListingModal.tsx** - Use `itemService.createItem()`
4. **src/components/features/ClaimItemModal.tsx** - Use `transactionService.claimItem()`
5. **All components using mock data** - Replace with store calls

## Testing the Connection

Once setup is complete, test the connection:

```typescript
import { supabase } from '@/lib/supabase';

// Test query
const { data, error } = await supabase.from('users').select('*').limit(1);
console.log('Connection test:', { data, error });
```

## Helpful Commands

- **Clear browser cache** if you see old mock data
- **Check browser console** for any Supabase errors
- **Verify `.env.local`** is loaded correctly
- **Restart dev server** after updating environment variables

## Common Issues

| Issue | Solution |
|-------|----------|
| "Missing environment variables" | Check `.env.local` is set and dev server restarted |
| "Auth error" | Verify Supabase URL and Anon Key are correct |
| "Table doesn't exist" | Check schema was created in SQL Editor |
| "CORS error" | Enable CORS in Supabase settings |
| "Still seeing mock data" | Clear store persistence: `localStorage.clear()` |

## What's Using Services Now

- ✅ Authentication (`authStore`)
- ⏳ Items (needs `itemStore` update)
- ⏳ Transactions (needs `transactionStore` or integration)
- ⏳ Notifications (optional)

Proceed with updating each store to complete the Supabase integration!
