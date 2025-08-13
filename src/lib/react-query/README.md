# React Query Setup for Fines Dashboard

This directory contains the React Query configuration and hooks for managing server state in the fines dashboard application.

## Overview

React Query is configured to provide:
- Intelligent caching with automatic background updates
- Optimistic updates for better user experience
- Error handling and retry logic
- Loading states and cache invalidation
- Real-time data synchronization

## Structure

```
src/lib/react-query/
├── client.ts          # Query client configuration and query keys
├── provider.tsx       # React Query provider component
├── hooks/
│   ├── index.ts       # Export all hooks
│   ├── queries.ts     # Data fetching hooks
│   └── mutations.ts   # Data mutation hooks
├── examples/
│   └── FinesExample.tsx  # Example usage component
└── __tests__/
    └── hooks.test.tsx    # Tests for React Query hooks
```

## Configuration

### Query Client Settings

- **Stale Time**: 5 minutes (data considered fresh)
- **GC Time**: 10 minutes (cache retention)
- **Retry**: 3 attempts with exponential backoff
- **Refetch on Window Focus**: Enabled for real-time feel

### Cache Keys

Consistent cache keys are defined in `client.ts`:
- `users`: All users data
- `fines`: All fines data
- `credits`: All credits data
- `connection`: Connection test status

## Available Hooks

### Query Hooks (Data Fetching)

#### `useUsers()`
Fetches all users with 15-minute cache time.
```tsx
const { data: users, isLoading, error } = useUsers()
```

#### `useFines()`
Fetches all fines with relationships, 2-minute cache time, and automatic refetch every 30 seconds.
```tsx
const { data: fines, isLoading, error } = useFines()
```

#### `useCredits()`
Fetches all credits with relationships, 5-minute cache time.
```tsx
const { data: credits, isLoading, error } = useCredits()
```

#### `useConnection()`
Tests database connection, 30-minute cache time.
```tsx
const { data: isConnected, isLoading, error } = useConnection()
```

#### `useUsersForDropdown()`
Returns users formatted for dropdown components.
```tsx
const { data: userOptions } = useUsersForDropdown()
// Returns: [{ value: "id", label: "name", user: User }]
```

### Mutation Hooks (Data Modification)

#### `useCreateFine()`
Creates a new fine with optimistic updates.
```tsx
const createFine = useCreateFine()

createFine.mutate({
  offender_id: "user-id",
  proposed_by_id: "admin-id", 
  description: "Speeding violation",
  amount: 100
}, {
  onSuccess: () => console.log('Fine created!'),
  onError: (error) => console.error('Failed:', error)
})
```

#### `useUpdateFine()`
Updates an existing fine with optimistic updates.
```tsx
const updateFine = useUpdateFine()

updateFine.mutate({
  id: "fine-id",
  data: { description: "Updated description", amount: 150 }
})
```

#### `useDeleteFine()`
Deletes a fine with optimistic removal.
```tsx
const deleteFine = useDeleteFine()

deleteFine.mutate("fine-id")
```

#### `useCreateCredit()`
Creates a new credit with optimistic updates.
```tsx
const createCredit = useCreateCredit()

createCredit.mutate({
  person_id: "user-id",
  description: "Payment received",
  amount: 50
})
```

## Optimistic Updates

All mutation hooks implement optimistic updates:

1. **Immediate UI Update**: Changes appear instantly
2. **Background Sync**: Real API call happens in background
3. **Error Rollback**: UI reverts if API call fails
4. **Cache Refresh**: Fresh data fetched after successful mutation

## Error Handling

- **Network Errors**: Automatic retry with exponential backoff
- **API Errors**: Thrown as Error objects with descriptive messages
- **Validation Errors**: Handled at the form level with Zod schemas
- **Optimistic Rollback**: Failed mutations revert UI changes

## Usage in Components

### Basic Data Fetching
```tsx
function FinesList() {
  const { data: fines, isLoading, error } = useFines()
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      {fines?.map(fine => (
        <div key={fine.id}>{fine.description}</div>
      ))}
    </div>
  )
}
```

### Mutations with Loading States
```tsx
function AddFineForm() {
  const createFine = useCreateFine()
  
  const handleSubmit = (data) => {
    createFine.mutate(data, {
      onSuccess: () => {
        // Handle success (e.g., close form, show toast)
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button 
        type="submit" 
        disabled={createFine.isPending}
      >
        {createFine.isPending ? 'Creating...' : 'Create Fine'}
      </button>
      {createFine.error && (
        <div>Error: {createFine.error.message}</div>
      )}
    </form>
  )
}
```

## Development Tools

React Query DevTools are enabled in development mode:
- Press the React Query icon in the bottom of the screen
- Inspect cache state, query status, and mutations
- Debug performance and caching behavior

## Testing

Tests are provided in `__tests__/hooks.test.tsx` demonstrating:
- Successful data fetching
- Error handling
- Mutation behavior
- Mock setup for Supabase integration

Run tests with:
```bash
npm test -- --run src/lib/react-query/__tests__/hooks.test.tsx
```

## Integration with Supabase

React Query hooks wrap the Supabase database functions from `src/lib/supabase/database.ts`:
- All database operations return `ApiResponse<T>` format
- Errors are transformed into Error objects
- Real-time subscriptions can be added for live updates

## Performance Considerations

- **Background Refetching**: Keeps data fresh without blocking UI
- **Intelligent Caching**: Reduces unnecessary API calls
- **Optimistic Updates**: Immediate feedback for better UX
- **Automatic Retries**: Handles temporary network issues
- **Memory Management**: Automatic garbage collection of unused cache

## Future Enhancements

Potential improvements:
- Real-time subscriptions using Supabase channels
- Infinite queries for pagination
- Prefetching for anticipated user actions
- Offline support with cache persistence
- More granular cache invalidation strategies