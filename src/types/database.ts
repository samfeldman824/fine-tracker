export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          username: string
          password_hash: string
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          username: string
          password_hash: string
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          username?: string
          password_hash?: string
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
        }
        Relationships: []
      }
      fines: {
        Row: {
          id: string
          date: string
          offender_id: string
          description: string
          amount: number
          proposed_by_id: string
          replies: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date?: string
          offender_id: string
          description: string
          amount: number
          proposed_by_id: string
          replies?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          offender_id?: string
          description?: string
          amount?: number
          proposed_by_id?: string
          replies?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fines_offender_id_fkey"
            columns: ["offender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fines_proposed_by_id_fkey"
            columns: ["proposed_by_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      credits: {
        Row: {
          id: string
          person_id: string
          description: string
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          person_id: string
          description: string
          amount: number
          created_at?: string
        }
        Update: {
          id?: string
          person_id?: string
          description?: string
          amount?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credits_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}