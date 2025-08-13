import { QueryClient } from '@tanstack/react-query'

// Create a client with optimized settings for the fines dashboard
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      // Keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests up to 3 times
      retry: 3,
      // Retry with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for real-time data
      refetchOnWindowFocus: true,
      // Don't refetch on reconnect to avoid unnecessary requests
      refetchOnReconnect: false,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      // Shorter retry delay for mutations
      retryDelay: 1000,
    },
  },
})

// Query keys for consistent cache management
export const queryKeys = {
  // User-related queries
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  
  // Fine-related queries
  fines: ['fines'] as const,
  fine: (id: string) => ['fines', id] as const,
  
  // Credit-related queries
  credits: ['credits'] as const,
  credit: (id: string) => ['credits', id] as const,
  
  // Connection test
  connection: ['connection'] as const,
} as const

// Type for query keys
export type QueryKeys = typeof queryKeys