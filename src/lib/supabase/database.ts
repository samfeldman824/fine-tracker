import { supabase } from './client'
import {
  User,
  Fine,
  Credit,
  FineWithUsers,
  CreditWithUser,
  CreateFineData,
  UpdateFineData,
  CreateCreditData,
  ApiResponse,
  FineRealtimePayload,
  CreditRealtimePayload,
  UserRealtimePayload
} from '@/types'

// Connection test utility
export async function testConnection(): Promise<ApiResponse<boolean>> {
  try {
    const { error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data: true, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Connection test failed'
    }
  }
}

// User operations
export async function getUsers(): Promise<ApiResponse<User[]>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name')

    if (error) {
      return { data: null, error: error.message }
    }

    return { data: data || [], error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch users'
    }
  }
}

// Fine operations
export async function getFines(): Promise<ApiResponse<FineWithUsers[]>> {
  try {
    const { data, error } = await supabase
      .from('fines')
      .select(`
        *,
        offender:users!fines_offender_id_fkey(*),
        proposed_by:users!fines_proposed_by_id_fkey(*)
      `)
      .order('date', { ascending: false })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data: data || [], error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch fines'
    }
  }
}

export async function createFine(fineData: CreateFineData): Promise<ApiResponse<Fine>> {
  try {
    const { data, error } = await supabase
      .from('fines')
      .insert(fineData)
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to create fine'
    }
  }
}

export async function updateFine(id: string, fineData: UpdateFineData): Promise<ApiResponse<Fine>> {
  try {
    const { data, error } = await supabase
      .from('fines')
      .update(fineData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to update fine'
    }
  }
}

export async function deleteFine(id: string): Promise<ApiResponse<boolean>> {
  try {
    const { error } = await supabase
      .from('fines')
      .delete()
      .eq('id', id)

    if (error) {
      return { data: null, error: error.message }
    }

    return { data: true, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to delete fine'
    }
  }
}

// Credit operations
export async function getCredits(): Promise<ApiResponse<CreditWithUser[]>> {
  try {
    const { data, error } = await supabase
      .from('credits')
      .select(`
        *,
        person:users!credits_person_id_fkey(*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data: data || [], error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch credits'
    }
  }
}

export async function createCredit(creditData: CreateCreditData): Promise<ApiResponse<Credit>> {
  try {
    const { data, error } = await supabase
      .from('credits')
      .insert(creditData)
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to create credit'
    }
  }
}

// Real-time subscription utilities
export function subscribeFinesChanges(callback: (payload: FineRealtimePayload) => void) {
  return supabase
    .channel('fines-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'fines'
    }, (payload) => callback(payload as FineRealtimePayload))
    .subscribe()
}

export function subscribeCreditsChanges(callback: (payload: CreditRealtimePayload) => void) {
  return supabase
    .channel('credits-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'credits'
    }, (payload) => callback(payload as CreditRealtimePayload))
    .subscribe()
}

export function subscribeUsersChanges(callback: (payload: UserRealtimePayload) => void) {
  return supabase
    .channel('users-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'users'
    }, (payload) => callback(payload as UserRealtimePayload))
    .subscribe()
}

// Utility function to unsubscribe from all channels
export function unsubscribeAll() {
  return supabase.removeAllChannels()
}