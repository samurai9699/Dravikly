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
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          tier: 'free' | 'starter' | 'pro' | 'enterprise'
          status: 'active' | 'cancelled' | 'canceled' | 'past_due' | 'trialing' | 'paused'
          paddle_customer_id: string | null
          paddle_subscription_id: string | null
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          analyses_used_today: number
          last_reset_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tier?: 'free' | 'starter' | 'pro' | 'enterprise'
          status?: 'active' | 'cancelled' | 'canceled' | 'past_due' | 'trialing' | 'paused'
          paddle_customer_id?: string | null
          paddle_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          analyses_used_today?: number
          last_reset_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tier?: 'free' | 'starter' | 'pro' | 'enterprise'
          status?: 'active' | 'cancelled' | 'canceled' | 'past_due' | 'trialing' | 'paused'
          paddle_customer_id?: string | null
          paddle_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          analyses_used_today?: number
          last_reset_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      analyses: {
        Row: {
          id: string
          user_id: string
          url: string
          results: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          url: string
          results?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          url?: string
          results?: Json | null
          created_at?: string
        }
      }
    }
  }
}
