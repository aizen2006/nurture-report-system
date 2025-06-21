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
