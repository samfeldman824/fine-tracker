import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../client'
import {
  getUsers,
  getFines,
  getCredits,
  testConnection,
} from '@/lib/supabase/database'
import type {
  User,
  FineWithUsers,
  CreditWithUser,
  ApiResponse,
} from '@/types'

// Connection test hook
export function useConnection() {
  return useQuery({
    queryKey: queryKeys.connection,
    queryFn: testConnection,
    // Test connection less frequently
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    // Don't retry connection tests as aggressively
    retry: 1,
    retryDelay: 5000,
  })
}

// Users data hook
export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: getUsers,
    // Users change infrequently, cache longer
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    // Transform the response to handle errors gracefully
    select: (response: ApiResponse<User[]>) => {
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data || []
    },
  })
}

// Fines data hook with real-time updates
export function useFines() {
  return useQuery({
    queryKey: queryKeys.fines,
    queryFn: getFines,
    // Fines change frequently, shorter cache time
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    // Transform the response to handle errors gracefully
    select: (response: ApiResponse<FineWithUsers[]>) => {
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data || []
    },
    // Enable refetching for real-time feel
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds when tab is active
    refetchIntervalInBackground: false,
  })
}

// Credits data hook
export function useCredits() {
  return useQuery({
    queryKey: queryKeys.credits,
    queryFn: getCredits,
    // Credits change less frequently than fines
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    // Transform the response to handle errors gracefully
    select: (response: ApiResponse<CreditWithUser[]>) => {
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data || []
    },
  })
}

// Hook to get a specific user by ID (useful for forms)
export function useUser(id: string | undefined) {
  const { data: users, ...rest } = useUsers()
  
  return {
    ...rest,
    data: id ? users?.find(user => user.id === id) : undefined,
  }
}

// Hook to get users formatted for dropdowns
export function useUsersForDropdown() {
  const { data: users, ...rest } = useUsers()
  
  return {
    ...rest,
    data: users?.map(user => ({
      value: user.id,
      label: user.name,
      user,
    })) || [],
  }
}