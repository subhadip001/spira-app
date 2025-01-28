export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_chat: {
        Row: {
          ai_chat_messages: Json
          ai_starter_questions: Json
          created_at: string
          id: string
          is_chat_active: boolean
          published_form_id: string
        }
        Insert: {
          ai_chat_messages?: Json
          ai_starter_questions?: Json
          created_at?: string
          id?: string
          is_chat_active?: boolean
          published_form_id?: string
        }
        Update: {
          ai_chat_messages?: Json
          ai_starter_questions?: Json
          created_at?: string
          id?: string
          is_chat_active?: boolean
          published_form_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_published_form_id_fkey"
            columns: ["published_form_id"]
            isOneToOne: false
            referencedRelation: "published_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      form_responses: {
        Row: {
          created_at: string
          id: string
          published_form_id: string
          response_data: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          published_form_id?: string
          response_data?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          published_form_id?: string
          response_data?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_responses_published_form_id_fkey"
            columns: ["published_form_id"]
            isOneToOne: false
            referencedRelation: "published_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      form_versions: {
        Row: {
          created_at: string
          form_id: string
          form_schema_string: string
          id: string
          query: string
          status: Database["public"]["Enums"]["FORM_VERSION_STATUS"]
          version_number: number
        }
        Insert: {
          created_at?: string
          form_id?: string
          form_schema_string: string
          id?: string
          query: string
          status?: Database["public"]["Enums"]["FORM_VERSION_STATUS"]
          version_number: number
        }
        Update: {
          created_at?: string
          form_id?: string
          form_schema_string?: string
          id?: string
          query?: string
          status?: Database["public"]["Enums"]["FORM_VERSION_STATUS"]
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "form_versions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          created_at: string
          id: string
          query: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          query: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          query?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      published_forms: {
        Row: {
          created_at: string
          form_base_id: string
          form_title: string
          form_version_id: string
          id: string
          short_id: string
          status: Database["public"]["Enums"]["pub_form_status"]
          user_id: string
        }
        Insert: {
          created_at?: string
          form_base_id: string
          form_title?: string
          form_version_id: string
          id?: string
          short_id?: string
          status?: Database["public"]["Enums"]["pub_form_status"]
          user_id: string
        }
        Update: {
          created_at?: string
          form_base_id?: string
          form_title?: string
          form_version_id?: string
          id?: string
          short_id?: string
          status?: Database["public"]["Enums"]["pub_form_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "published_forms_form_base_id_fkey"
            columns: ["form_base_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "published_forms_form_version_id_fkey"
            columns: ["form_version_id"]
            isOneToOne: false
            referencedRelation: "form_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "published_forms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      response_analytics: {
        Row: {
          created_at: string
          id: string
          published_formId: string
          title: string
          transformed_xml: string
          updated_at: string
          uploaded_csv_url: string
          user_id: string
          version: string
        }
        Insert: {
          created_at?: string
          id?: string
          published_formId?: string
          title?: string
          transformed_xml?: string
          updated_at?: string
          uploaded_csv_url?: string
          user_id?: string
          version?: string
        }
        Update: {
          created_at?: string
          id?: string
          published_formId?: string
          title?: string
          transformed_xml?: string
          updated_at?: string
          uploaded_csv_url?: string
          user_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "response_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      uploaded_csv_chat: {
        Row: {
          ai_chat_messages: Json
          ai_starter_questions: string
          created_at: string
          id: string
          is_chat_active: boolean
          response_analytics_id: string
        }
        Insert: {
          ai_chat_messages?: Json
          ai_starter_questions: string
          created_at?: string
          id?: string
          is_chat_active?: boolean
          response_analytics_id?: string
        }
        Update: {
          ai_chat_messages?: Json
          ai_starter_questions?: string
          created_at?: string
          id?: string
          is_chat_active?: boolean
          response_analytics_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uploaded_csv_chat_response_analytics_id_fkey"
            columns: ["response_analytics_id"]
            isOneToOne: false
            referencedRelation: "response_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      user_onboardings: {
        Row: {
          created_at: string
          id: string
          profession: string
          referred_from: string
          usecase: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          profession?: string
          referred_from?: string
          usecase?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          profession?: string
          referred_from?: string
          usecase?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_onboardings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
      FORM_VERSION_STATUS: "DRAFT" | "PUBLISHED" | "DELETED" | "UNPUBLISHED"
      pub_form_status: "ACTIVE" | "CLOSED" | "UNPUBLISHED"
      PUB_FORM_STATUS: "ACTIVE" | "CLOSED" | "UNPUBLISHED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
