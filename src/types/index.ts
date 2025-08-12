import { Database } from './database'
import { z } from 'zod'

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

// Zod validation schemas for forms
export const createFineSchema = z.object({
  offender_id: z.string()
    .min(1, 'Please select an offender')
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 'Please select a valid offender'),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  amount: z.number()
    .positive('Amount must be greater than 0')
    .max(10000, 'Amount must be less than $10,000')
    .multipleOf(0.01, 'Amount must be a valid currency value')
})

export const updateFineSchema = createFineSchema.extend({
  id: z.string()
    .min(1, 'Fine ID is required')
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 'Invalid fine ID')
})

export const createCreditSchema = z.object({
  person_id: z.string()
    .min(1, 'Please select a person')
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 'Please select a valid person'),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  amount: z.number()
    .positive('Amount must be greater than 0')
    .max(10000, 'Amount must be less than $10,000')
    .multipleOf(0.01, 'Amount must be a valid currency value')
})

// Real-time subscription payload types
export interface RealtimePayload<T = Record<string, unknown>> {
  schema: string
  table: string
  commit_timestamp: string
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: T | null
  old: T | null
  errors: string[] | null
}

export type FineRealtimePayload = RealtimePayload<Fine>
export type CreditRealtimePayload = RealtimePayload<Credit>
export type UserRealtimePayload = RealtimePayload<User>

// Infer types from Zod schemas
export type CreateFineSchemaType = z.infer<typeof createFineSchema>
export type UpdateFineSchemaType = z.infer<typeof updateFineSchema>
export type CreateCreditSchemaType = z.infer<typeof createCreditSchema>