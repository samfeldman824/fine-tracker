# Database Setup

This directory contains the Supabase configuration and database utilities for the Fines Dashboard application.

## Files Overview

- `client.ts` - Browser-side Supabase client configuration
- `server.ts` - Server-side Supabase client for Next.js App Router
- `database.ts` - Database service functions for CRUD operations
- `config.ts` - Configuration constants and environment validation
- `migrations/` - SQL migration files for database schema

## Setup Instructions

### 1. Environment Variables

Ensure your `.env.local` file contains the required Supabase variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Schema

Run the migration file `migrations/001_initial_schema.sql` in your Supabase SQL editor to create the required tables:

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `migrations/001_initial_schema.sql`
4. Execute the query

This will create:
- `users` table with sample data
- `fines` table with foreign key relationships
- `credits` table with foreign key relationships
- Necessary indexes for performance
- Triggers for automatic `updated_at` timestamps

### 3. Row Level Security (Optional)

For production use, consider enabling Row Level Security (RLS) policies:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE fines ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;

-- Example policies (customize based on your auth requirements)
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can view all fines" ON fines FOR SELECT USING (true);
CREATE POLICY "Admins can manage fines" ON fines FOR ALL USING (auth.role() = 'admin');
```

## Usage

### Client-side Usage

```typescript
import { supabase } from '@/lib/supabase/client'
import { getFines, createFine } from '@/lib/supabase/database'

// Direct client usage
const { data, error } = await supabase.from('fines').select('*')

// Using service functions (recommended)
const finesResult = await getFines()
if (finesResult.error) {
  console.error('Error:', finesResult.error)
} else {
  console.log('Fines:', finesResult.data)
}
```

### Server-side Usage

```typescript
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('fines').select('*')
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  
  return Response.json({ data })
}
```

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `name` (Text, Required)
- `username` (Text, Unique, Required)
- `password_hash` (Text, Required)
- `avatar_url` (Text, Optional)
- `role` (Text, Default: 'user', Options: 'user' | 'admin')
- `created_at` (Timestamp)

### Fines Table
- `id` (UUID, Primary Key)
- `date` (Date, Default: Current Date)
- `offender_id` (UUID, Foreign Key to users.id)
- `description` (Text, Required)
- `amount` (Decimal, Required, >= 0)
- `proposed_by_id` (UUID, Foreign Key to users.id)
- `replies` (Integer, Default: 0, >= 0)
- `created_at` (Timestamp)
- `updated_at` (Timestamp, Auto-updated)

### Credits Table
- `id` (UUID, Primary Key)
- `person_id` (UUID, Foreign Key to users.id)
- `description` (Text, Required)
- `amount` (Decimal, Required, >= 0)
- `created_at` (Timestamp)

## Error Handling

All database service functions return a consistent `ApiResponse<T>` format:

```typescript
interface ApiResponse<T> {
  data: T | null
  error: string | null
}
```

Always check for errors before using the data:

```typescript
const result = await getFines()
if (result.error) {
  // Handle error
  console.error(result.error)
  return
}

// Use result.data safely
const fines = result.data
```