export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      enrollment_attendance: {
        Row: {
          children_enrolled: number
          children_present: number
          created_at: string
          date: string
          id: string
          occupancy_rate: number
          planned_capacity: number | null
          site: string
          staff_attendance_rate: number
          staff_count: number
          updated_at: string
        }
        Insert: {
          children_enrolled: number
          children_present: number
          created_at?: string
          date: string
          id?: string
          occupancy_rate: number
          planned_capacity?: number | null
          site: string
          staff_attendance_rate?: number
          staff_count: number
          updated_at?: string
        }
        Update: {
          children_enrolled?: number
          children_present?: number
          created_at?: string
          date?: string
          id?: string
          occupancy_rate?: number
          planned_capacity?: number | null
          site?: string
          staff_attendance_rate?: number
          staff_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          created_at: string
          email: string
          full_name: string
          role: string
          submission_data: Json
          submitted_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          role: string
          submission_data: Json
          submitted_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          role?: string
          submission_data?: Json
          submitted_at?: string
        }
        Relationships: []
      }
      room_planner: {
        Row: {
          age_group: string
          created_at: string
          friday_children: number
          friday_staff: number
          id: string
          monday_children: number
          monday_staff: number
          ratio: string
          room_name: string
          site: string
          thursday_children: number
          thursday_staff: number
          tuesday_children: number
          tuesday_staff: number
          updated_at: string
          wednesday_children: number
          wednesday_staff: number
        }
        Insert: {
          age_group: string
          created_at?: string
          friday_children?: number
          friday_staff?: number
          id?: string
          monday_children?: number
          monday_staff?: number
          ratio: string
          room_name: string
          site: string
          thursday_children?: number
          thursday_staff?: number
          tuesday_children?: number
          tuesday_staff?: number
          updated_at?: string
          wednesday_children?: number
          wednesday_staff?: number
        }
        Update: {
          age_group?: string
          created_at?: string
          friday_children?: number
          friday_staff?: number
          id?: string
          monday_children?: number
          monday_staff?: number
          ratio?: string
          room_name?: string
          site?: string
          thursday_children?: number
          thursday_staff?: number
          tuesday_children?: number
          tuesday_staff?: number
          updated_at?: string
          wednesday_children?: number
          wednesday_staff?: number
        }
        Relationships: []
      }
      staff_child_ratios: {
        Row: {
          actual_ratio: string
          age_group: string
          branch: string
          children_count: number
          created_at: string
          id: string
          required_ratio: string
          room: string
          staff_count: number
          status: string
          updated_at: string
        }
        Insert: {
          actual_ratio: string
          age_group: string
          branch: string
          children_count: number
          created_at?: string
          id?: string
          required_ratio: string
          room: string
          staff_count: number
          status: string
          updated_at?: string
        }
        Update: {
          actual_ratio?: string
          age_group?: string
          branch?: string
          children_count?: number
          created_at?: string
          id?: string
          required_ratio?: string
          room?: string
          staff_count?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      pg_get_coldef: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
