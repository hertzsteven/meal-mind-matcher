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
      diet_recommendations: {
        Row: {
          created_at: string
          generated_at: string
          id: string
          profile_id: string | null
          recommendation_text: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          generated_at?: string
          id?: string
          profile_id?: string | null
          recommendation_text: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          generated_at?: string
          id?: string
          profile_id?: string | null
          recommendation_text?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diet_recommendations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_diet_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_diet_profiles: {
        Row: {
          activity_level: string | null
          additional_info: string | null
          age: number | null
          budget: string | null
          cooking_time: string | null
          created_at: string
          current_diet: string | null
          current_recommendation_id: string | null
          dietary_restrictions: string[] | null
          food_preferences: string | null
          gender: string | null
          health_goals: string | null
          height: number | null
          id: string
          meals_per_day: string | null
          medical_conditions: string | null
          name: string
          updated_at: string
          user_id: string
          version: number
          weight: number | null
        }
        Insert: {
          activity_level?: string | null
          additional_info?: string | null
          age?: number | null
          budget?: string | null
          cooking_time?: string | null
          created_at?: string
          current_diet?: string | null
          current_recommendation_id?: string | null
          dietary_restrictions?: string[] | null
          food_preferences?: string | null
          gender?: string | null
          health_goals?: string | null
          height?: number | null
          id?: string
          meals_per_day?: string | null
          medical_conditions?: string | null
          name: string
          updated_at?: string
          user_id: string
          version?: number
          weight?: number | null
        }
        Update: {
          activity_level?: string | null
          additional_info?: string | null
          age?: number | null
          budget?: string | null
          cooking_time?: string | null
          created_at?: string
          current_diet?: string | null
          current_recommendation_id?: string | null
          dietary_restrictions?: string[] | null
          food_preferences?: string | null
          gender?: string | null
          health_goals?: string | null
          height?: number | null
          id?: string
          meals_per_day?: string | null
          medical_conditions?: string | null
          name?: string
          updated_at?: string
          user_id?: string
          version?: number
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_diet_profiles_current_recommendation_id_fkey"
            columns: ["current_recommendation_id"]
            isOneToOne: false
            referencedRelation: "diet_recommendations"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
