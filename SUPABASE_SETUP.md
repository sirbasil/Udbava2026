# Supabase Integration Guide

## Setup Steps

### 1. Create a Supabase Project
- Go to [https://supabase.com](https://supabase.com) and sign up/login
- Create a new project
- Note your **Project URL** and **Anon Key** from the API settings

### 2. Add Environment Variables
Update `.env.local` with your Supabase credentials:
```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Create Database Schema
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Click "New Query" and paste the contents from `SUPABASE_SCHEMA.sql`
4. Run the query

### 4. Insert Sample Data (Optional)
You can use the mock data from `src/constants/mockData.ts` to seed your database:
```sql
-- Example: Insert sample users
INSERT INTO users (name, email, role, avatar, loyaltyPoints, loyaltyTier, joinedAt)
VALUES 
  ('John Doe', 'john@sru.edu.in', 'student', 'https://ui-avatars.com/api/?name=John+Doe&background=D4A843&color=0B0B0F&size=80', 150, 'Silver', NOW()),
  ('Manager Admin', 'manager@retcom.edu', 'manager', 'https://ui-avatars.com/api/?name=Manager+Admin&background=D4A843&color=0B0B0F&size=80', 500, 'Gold', NOW());
```

### 5. Authentication Setup
- Enable Email/Password authentication in Supabase Auth settings
- Users are automatically created in the `users` table when signing up

## File Structure

### Created Files:
- `.env.local` - Environment variables for Supabase credentials
- `src/lib/supabase.ts` - Supabase client initialization
- `src/services/authService.ts` - Authentication operations
- `src/services/itemService.ts` - Item/Product operations
- `src/services/transactionService.ts` - Transaction operations

### Next Steps:
1. Update store files to use the services instead of local state
2. Replace mock data with database calls
3. Implement real-time subscriptions (optional)

## Usage Examples

### Authentication
```typescript
import { authService } from '@/services/authService';

// Register
const result = await authService.register('John Doe', 'john@sru.edu.in', 'password123');

// Login
const result = await authService.login('john@sru.edu.in', 'password123');

// Get current user
const user = await authService.getCurrentUser();

// Logout
await authService.logout();
```

### Items
```typescript
import { itemService } from '@/services/itemService';

// Get all items
const { data, error } = await itemService.getAllItems();

// Search items
const { data } = await itemService.searchItems('laptop', 'electronics', [5000, 50000]);

// Create item
const { data } = await itemService.createItem({
  name: 'Laptop',
  category: 'electronics',
  price: 30000,
  // ... other fields
});
```

### Transactions
```typescript
import { transactionService } from '@/services/transactionService';

// Claim item
const { transaction } = await transactionService.claimItem(itemId, buyerId, amount, itemName);

// Get buyer transactions
const { data } = await transactionService.getTransactionsByBuyer(buyerId);
```

## Updating Store Files

The Zustand stores still use local state. To fully integrate Supabase:

1. Modify `src/stores/authStore.ts` to use `authService`
2. Modify `src/stores/itemStore.ts` to use `itemService`
3. Load initial data from Supabase on app startup

## Security Notes
- Never commit `.env.local` to git (already in `.gitignore`)
- Use Row Level Security (RLS) policies configured in the schema
- Supabase handles password hashing automatically
- Consider adding rate limiting for sensitive operations

## Troubleshooting
- Ensure environment variables are set correctly
- Check Supabase authentication settings
- Verify table names match in your queries
- Enable CORS in Supabase settings if needed
