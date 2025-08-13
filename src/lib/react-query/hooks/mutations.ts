import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../client'
import {
  createFine,
  updateFine,
  deleteFine,
  createCredit,
} from '@/lib/supabase/database'
import type {
  CreateFineData,
  UpdateFineData,
  CreateCreditData,
  FineWithUsers,
  CreditWithUser,
  User,
} from '@/types'

// Create fine mutation with optimistic updates
export function useCreateFine() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createFine,
    onMutate: async (newFineData: CreateFineData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.fines })
      
      // Snapshot the previous value
      const previousFines = queryClient.getQueryData<FineWithUsers[]>(queryKeys.fines)
      
      // Get users data for optimistic update
      const users = queryClient.getQueryData<User[]>(queryKeys.users) || []
      const offender = users.find(u => u.id === newFineData.offender_id)
      const proposedBy = users.find(u => u.id === newFineData.proposed_by_id)
      
      // Optimistically update the cache if we have the required user data
      if (offender && proposedBy && previousFines) {
        const optimisticFine: FineWithUsers = {
          id: `temp-${Date.now()}`, // Temporary ID
          date: new Date().toISOString().split('T')[0],
          description: newFineData.description,
          amount: newFineData.amount,
          replies: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          offender,
          proposed_by: proposedBy,
        }
        
        queryClient.setQueryData<FineWithUsers[]>(
          queryKeys.fines,
          [optimisticFine, ...previousFines]
        )
      }
      
      return { previousFines }
    },
    onError: (err, newFineData, context) => {
      // Rollback on error
      if (context?.previousFines) {
        queryClient.setQueryData(queryKeys.fines, context.previousFines)
      }
    },
    onSuccess: (response) => {
      if (response.error) {
        throw new Error(response.error)
      }
      // Invalidate and refetch fines to get the real data
      queryClient.invalidateQueries({ queryKey: queryKeys.fines })
    },
  })
}

// Update fine mutation with optimistic updates
export function useUpdateFine() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFineData }) => 
      updateFine(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.fines })
      
      // Snapshot the previous value
      const previousFines = queryClient.getQueryData<FineWithUsers[]>(queryKeys.fines)
      
      // Optimistically update the cache
      if (previousFines) {
        const users = queryClient.getQueryData<User[]>(queryKeys.users) || []
        const offender = users.find(u => u.id === data.offender_id)
        const proposedBy = users.find(u => u.id === data.proposed_by_id)
        
        const updatedFines = previousFines.map(fine => {
          if (fine.id === id && offender && proposedBy) {
            return {
              ...fine,
              description: data.description ?? fine.description,
              amount: data.amount ?? fine.amount,
              updated_at: new Date().toISOString(),
              offender,
              proposed_by: proposedBy,
            }
          }
          return fine
        })
        
        queryClient.setQueryData<FineWithUsers[]>(queryKeys.fines, updatedFines)
      }
      
      return { previousFines }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousFines) {
        queryClient.setQueryData(queryKeys.fines, context.previousFines)
      }
    },
    onSuccess: (response) => {
      if (response.error) {
        throw new Error(response.error)
      }
      // Invalidate and refetch fines to get the real data
      queryClient.invalidateQueries({ queryKey: queryKeys.fines })
    },
  })
}

// Delete fine mutation with optimistic updates
export function useDeleteFine() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteFine,
    onMutate: async (fineId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.fines })
      
      // Snapshot the previous value
      const previousFines = queryClient.getQueryData<FineWithUsers[]>(queryKeys.fines)
      
      // Optimistically remove the fine from the cache
      if (previousFines) {
        const updatedFines = previousFines.filter(fine => fine.id !== fineId)
        queryClient.setQueryData<FineWithUsers[]>(queryKeys.fines, updatedFines)
      }
      
      return { previousFines }
    },
    onError: (err, fineId, context) => {
      // Rollback on error
      if (context?.previousFines) {
        queryClient.setQueryData(queryKeys.fines, context.previousFines)
      }
    },
    onSuccess: (response) => {
      if (response.error) {
        throw new Error(response.error)
      }
      // Invalidate and refetch fines to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.fines })
    },
  })
}

// Create credit mutation with cache invalidation
export function useCreateCredit() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createCredit,
    onMutate: async (newCreditData: CreateCreditData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.credits })
      
      // Snapshot the previous value
      const previousCredits = queryClient.getQueryData<CreditWithUser[]>(queryKeys.credits)
      
      // Get users data for optimistic update
      const users = queryClient.getQueryData<User[]>(queryKeys.users) || []
      const person = users.find(u => u.id === newCreditData.person_id)
      
      // Optimistically update the cache if we have the required user data
      if (person && previousCredits) {
        const optimisticCredit: CreditWithUser = {
          id: `temp-${Date.now()}`, // Temporary ID
          description: newCreditData.description,
          amount: newCreditData.amount,
          created_at: new Date().toISOString(),
          person,
        }
        
        queryClient.setQueryData<CreditWithUser[]>(
          queryKeys.credits,
          [optimisticCredit, ...previousCredits]
        )
      }
      
      return { previousCredits }
    },
    onError: (err, newCreditData, context) => {
      // Rollback on error
      if (context?.previousCredits) {
        queryClient.setQueryData(queryKeys.credits, context.previousCredits)
      }
    },
    onSuccess: (response) => {
      if (response.error) {
        throw new Error(response.error)
      }
      // Invalidate and refetch credits to get the real data
      queryClient.invalidateQueries({ queryKey: queryKeys.credits })
    },
  })
}

// Utility hook to invalidate all queries (useful for manual refresh)
export function useInvalidateAll() {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.fines })
    queryClient.invalidateQueries({ queryKey: queryKeys.users })
    queryClient.invalidateQueries({ queryKey: queryKeys.credits })
  }
}