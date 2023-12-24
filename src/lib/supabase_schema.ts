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
      settings: {
        Row: {
          album_privacy_enabled: boolean | null
          calendar_privacy_enabled: boolean | null
          data_sharing_enabled: boolean | null
          email_notifications_enabled: boolean | null
          google_calendar_integration: boolean
          language_preference: string | null
          marketing_emails_enabled: boolean | null
          profile_visibility_public: boolean | null
          push_notifications_enabled: boolean | null
          theme_dark_mode_enabled: boolean | null
          timezone_offset: number | null
          two_factor_auth_enabled: boolean | null
          user_uuid: string
        }
        Insert: {
          album_privacy_enabled?: boolean | null
          calendar_privacy_enabled?: boolean | null
          data_sharing_enabled?: boolean | null
          email_notifications_enabled?: boolean | null
          google_calendar_integration?: boolean
          language_preference?: string | null
          marketing_emails_enabled?: boolean | null
          profile_visibility_public?: boolean | null
          push_notifications_enabled?: boolean | null
          theme_dark_mode_enabled?: boolean | null
          timezone_offset?: number | null
          two_factor_auth_enabled?: boolean | null
          user_uuid: string
        }
        Update: {
          album_privacy_enabled?: boolean | null
          calendar_privacy_enabled?: boolean | null
          data_sharing_enabled?: boolean | null
          email_notifications_enabled?: boolean | null
          google_calendar_integration?: boolean
          language_preference?: string | null
          marketing_emails_enabled?: boolean | null
          profile_visibility_public?: boolean | null
          push_notifications_enabled?: boolean | null
          theme_dark_mode_enabled?: boolean | null
          timezone_offset?: number | null
          two_factor_auth_enabled?: boolean | null
          user_uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_settings_user_uuid"
            columns: ["user_uuid"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "settings_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          }
        ]
      }
      users: {
        Row: {
          about: string | null
          account_type: string | null
          birthday: string | null
          created_at: string | null
          email: string
          email_confirmed_at: string | null
          end_date: string | null
          facebook_url: string | null
          first_name: string | null
          image_url: string | null
          instagram_url: string | null
          language: string | null
          last_login_at: string | null
          last_name: string | null
          linkedin_url: string | null
          phone: string | null
          role: string | null
          subscription_end: string | null
          subscription_start: string | null
          subscription_type: string | null
          time_zone: string | null
          twitter_url: string | null
          updated_at: string | null
          user_uuid: string
          username: string | null
        }
        Insert: {
          about?: string | null
          account_type?: string | null
          birthday?: string | null
          created_at?: string | null
          email: string
          email_confirmed_at?: string | null
          end_date?: string | null
          facebook_url?: string | null
          first_name?: string | null
          image_url?: string | null
          instagram_url?: string | null
          language?: string | null
          last_login_at?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          phone?: string | null
          role?: string | null
          subscription_end?: string | null
          subscription_start?: string | null
          subscription_type?: string | null
          time_zone?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          user_uuid?: string
          username?: string | null
        }
        Update: {
          about?: string | null
          account_type?: string | null
          birthday?: string | null
          created_at?: string | null
          email?: string
          email_confirmed_at?: string | null
          end_date?: string | null
          facebook_url?: string | null
          first_name?: string | null
          image_url?: string | null
          instagram_url?: string | null
          language?: string | null
          last_login_at?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          phone?: string | null
          role?: string | null
          subscription_end?: string | null
          subscription_start?: string | null
          subscription_type?: string | null
          time_zone?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          user_uuid?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_users_user_uuid"
            columns: ["user_uuid"]
            isOneToOne: true
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
