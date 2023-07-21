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
      submissions: {
        Row: {
          creation_time: string
          id: number
          problem_id: number
          rating: number
          user_handle: string
          verdict: string
        }
        Insert: {
          creation_time: string
          id?: never
          problem_id: number
          rating: number
          user_handle: string
          verdict: string
        }
        Update: {
          creation_time?: string
          id?: never
          problem_id?: number
          rating?: number
          user_handle?: string
          verdict?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          cf_handle: string | null
          discord_user_id: string | null
          id: number
          inserted_at: string
          last_fetched: number | null
          updated_at: string
        }
        Insert: {
          cf_handle?: string | null
          discord_user_id?: string | null
          id?: number
          inserted_at?: string
          last_fetched?: number | null
          updated_at?: string
        }
        Update: {
          cf_handle?: string | null
          discord_user_id?: string | null
          id?: number
          inserted_at?: string
          last_fetched?: number | null
          updated_at?: string
        }
        Relationships: []
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
