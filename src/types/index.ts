import { Database } from './database'

// Database row types
export type User = Database['public']['Tables']['users']['Row']
export type Fine = Database['public']['Tables']['fines']['Row']
export type Credit = Database['public']['Tables']['credits']['Row']

// Insert types for forms
export type CreateFineData = Database['public']['Tables']['fines']['Insert']
export type UpdateFineData = Database['public']['Tables']['fines']['Update']
export type CreateCreditData = Database['public']['Tables']['credits']['Insert']

// Extended types with relationships
export interface FineWithUsers extends Omit<Fine, 'offender_id' | 'proposed_by_id'> {
  offender: User
  proposed_by: User
}

export interface CreditWithUser extends Omit<Credit, 'person_id'> {
  person: User
}

// Form data types
export interface CreateFineFormData {
  offender_id: string
  description: string
  amount: number
}

export interface UpdateFineFormData extends CreateFineFormData {
  id: string
}

export interface CreateCreditFormData {
  person_id: string
  description: string
  amount: number
}

// API response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  error: string | null
}