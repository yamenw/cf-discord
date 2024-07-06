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
      scores: {
        Row: {
          cf_rating: number
          weight: number | null
        }
        Insert: {
          cf_rating?: number
          weight?: number | null
        }
        Update: {
          cf_rating?: number
          weight?: number | null
        }
        Relationships: []
      }
      submissions: {
        Row: {
          creation_time: string
          problem_id: string
          rating: number | null
          user_handle: string
          verdict: string
        }
        Insert: {
          creation_time: string
          problem_id: string
          rating?: number | null
          user_handle: string
          verdict: string
        }
        Update: {
          creation_time?: string
          problem_id?: string
          rating?: number | null
          user_handle?: string
          verdict?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_rating_fkey"
            columns: ["rating"]
            referencedRelation: "scores"
            referencedColumns: ["cf_rating"]
          },
          {
            foreignKeyName: "submissions_user_handle_fkey"
            columns: ["user_handle"]
            referencedRelation: "users"
            referencedColumns: ["cf_handle"]
          }
        ]
      }
      users: {
        Row: {
          cf_handle: string | null
          discord_user_id: string
          id: number
          inserted_at: string
          last_fetched: number | null
          nickname: string | null
          profile_picture: string | null
          updated_at: string
        }
        Insert: {
          cf_handle?: string | null
          discord_user_id: string
          id?: number
          inserted_at?: string
          last_fetched?: number | null
          nickname?: string | null
          profile_picture?: string | null
          updated_at?: string
        }
        Update: {
          cf_handle?: string | null
          discord_user_id?: string
          id?: number
          inserted_at?: string
          last_fetched?: number | null
          nickname?: string | null
          profile_picture?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_scores: {
        Args: {
          days: number
        }
        Returns: {
          user_handle: string
          count: number
          score: number
        }[]
      }
      get_user_scores_rest: {
        Args: {
          days: number
        }
        Returns: {
          user_handle: string
          count: number
          score: number
          pfp: string
        }[]
      }
      insert_submission_models:
        | {
            Args: {
              new_submissions: Database["public"]["CompositeTypes"]["isubmissionmodel"][]
            }
            Returns: undefined
          }
        | {
            Args: {
              new_submissions: Database["public"]["CompositeTypes"]["isubmissionmodel"][]
              cf_handle: string
              sub_count: number
              user_id: string
            }
            Returns: undefined
          }
    }
    Enums: {
      verdictenum: "WRONG_ANSWER" | "OK"
    }
    CompositeTypes: {
      isubmissionmodel: {
        rating: number
        creation_time: string
        verdict: Database["public"]["Enums"]["verdictenum"]
        user_handle: string
        problem_id: string
      }
    }
  }
}
