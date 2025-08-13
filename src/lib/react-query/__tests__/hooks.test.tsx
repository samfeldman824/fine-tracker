import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUsers, useFines, useCreateFine } from '../hooks'

// Mock the database functions
vi.mock('@/lib/supabase/database', () => ({
  getUsers: vi.fn(),
  getFines: vi.fn(),
  createFine: vi.fn(),
}))

// Import after mocking
const { getUsers, getFines, createFine } = await import('@/lib/supabase/database')

// Test wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

  const TestWrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  return TestWrapper
}

describe('React Query Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useUsers', () => {
    it('should fetch users successfully', async () => {
      const mockUsers = [
        {
          id: '1',
          name: 'John Doe',
          username: 'john',
          password_hash: 'hash',
          avatar_url: null,
          role: 'user' as const,
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Jane Smith',
          username: 'jane',
          password_hash: 'hash',
          avatar_url: null,
          role: 'admin' as const,
          created_at: '2024-01-01T00:00:00Z'
        },
      ]

      vi.mocked(getUsers).mockResolvedValue({
        data: mockUsers,
        error: null,
      })

      const { result } = renderHook(() => useUsers(), {
        wrapper: createWrapper(),
      })

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockUsers)
      expect(getUsers).toHaveBeenCalledTimes(1)
    })

    it('should handle errors gracefully', async () => {
      vi.mocked(getUsers).mockResolvedValue({
        data: null,
        error: 'Database connection failed',
      })

      const { result } = renderHook(() => useUsers(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeInstanceOf(Error)
      expect((result.current.error as Error).message).toBe('Database connection failed')
    })
  })

  describe('useFines', () => {
    it('should fetch fines successfully', async () => {
      const mockFines = [
        {
          id: '1',
          date: '2025-01-01',
          description: 'Speeding',
          amount: 100,
          offender_id: '1',
          proposed_by_id: '2',
          replies: 0,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          offender: {
            id: '1',
            name: 'John Doe',
            username: 'john',
            password_hash: 'hash',
            avatar_url: null,
            role: 'user' as const,
            created_at: '2024-01-01T00:00:00Z'
          },
          proposed_by: {
            id: '2',
            name: 'Jane Smith',
            username: 'jane',
            password_hash: 'hash',
            avatar_url: null,
            role: 'admin' as const,
            created_at: '2024-01-01T00:00:00Z'
          },
        },
      ]

      vi.mocked(getFines).mockResolvedValue({
        data: mockFines,
        error: null,
      })

      const { result } = renderHook(() => useFines(), {
        wrapper: createWrapper(),
      })

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockFines)
      expect(getFines).toHaveBeenCalledTimes(1)
    })
  })

  describe('useCreateFine', () => {
    it('should create a fine successfully', async () => {
      const newFine = {
        id: '3',
        date: '2025-01-02',
        description: 'Parking violation',
        amount: 50,
        offender_id: '1',
        proposed_by_id: '2',
        replies: 0,
        created_at: '2025-01-02T00:00:00Z',
        updated_at: '2025-01-02T00:00:00Z',
      }

      vi.mocked(createFine).mockResolvedValue({
        data: newFine,
        error: null,
      })

      const { result } = renderHook(() => useCreateFine(), {
        wrapper: createWrapper(),
      })

      const createFineData = {
        offender_id: '1',
        proposed_by_id: '2',
        description: 'Parking violation',
        amount: 50,
      }

      result.current.mutate(createFineData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(createFine).toHaveBeenCalledWith(createFineData)
    })

    it('should handle creation errors', async () => {
      vi.mocked(createFine).mockResolvedValue({
        data: null,
        error: 'Failed to create fine',
      })

      const { result } = renderHook(() => useCreateFine(), {
        wrapper: createWrapper(),
      })

      const createFineData = {
        offender_id: '1',
        proposed_by_id: '2',
        description: 'Parking violation',
        amount: 50,
      }

      result.current.mutate(createFineData)

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeInstanceOf(Error)
      expect((result.current.error as Error).message).toBe('Failed to create fine')
    })
  })
})