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
      books: {
        Row: {
          author: string | null
          cover_url: string | null
          created_at: string
          google_books_id: string | null
          id: string
          language: string | null
          title: string
        }
        Insert: {
          author?: string | null
          cover_url?: string | null
          created_at?: string
          google_books_id?: string | null
          id?: string
          language?: string | null
          title: string
        }
        Update: {
          author?: string | null
          cover_url?: string | null
          created_at?: string
          google_books_id?: string | null
          id?: string
          language?: string | null
          title?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          time: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          time: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          time?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          completed: boolean | null
          created_at: string
          id: string
          period: string
          title: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          id?: string
          period: string
          title: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          id?: string
          period?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      habit_history: {
        Row: {
          amount: number | null
          completed: boolean | null
          created_at: string
          date: string
          failed: boolean | null
          habit_id: string
          id: string
          time: number | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          completed?: boolean | null
          created_at?: string
          date: string
          failed?: boolean | null
          habit_id: string
          id?: string
          time?: number | null
          user_id: string
        }
        Update: {
          amount?: number | null
          completed?: boolean | null
          created_at?: string
          date?: string
          failed?: boolean | null
          habit_id?: string
          id?: string
          time?: number | null
          user_id?: string
        }
        Relationships: []
      }
      habits: {
        Row: {
          amount_target: number | null
          checks_per_day: number | null
          color: string | null
          created_at: string
          emoji: string | null
          id: string
          order: number | null
          repeat_days: string[] | null
          time_target: number | null
          title: string
          tracking_type: string
          type: string
          user_id: string
        }
        Insert: {
          amount_target?: number | null
          checks_per_day?: number | null
          color?: string | null
          created_at?: string
          emoji?: string | null
          id?: string
          order?: number | null
          repeat_days?: string[] | null
          time_target?: number | null
          title: string
          tracking_type?: string
          type?: string
          user_id: string
        }
        Update: {
          amount_target?: number | null
          checks_per_day?: number | null
          color?: string | null
          created_at?: string
          emoji?: string | null
          id?: string
          order?: number | null
          repeat_days?: string[] | null
          time_target?: number | null
          title?: string
          tracking_type?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      investments: {
        Row: {
          created_at: string
          id: string
          name: string
          portfolio_id: string
          purchase_price: number
          quantity: number
          symbol: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          portfolio_id: string
          purchase_price: number
          quantity: number
          symbol: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          portfolio_id?: string
          purchase_price?: number
          quantity?: number
          symbol?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "investments_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      physical_data: {
        Row: {
          age: number | null
          allergies: string[] | null
          blood_type: string | null
          created_at: string
          height: number | null
          id: string
          medications: string[] | null
          user_id: string
          weight: number | null
        }
        Insert: {
          age?: number | null
          allergies?: string[] | null
          blood_type?: string | null
          created_at?: string
          height?: number | null
          id?: string
          medications?: string[] | null
          user_id: string
          weight?: number | null
        }
        Update: {
          age?: number | null
          allergies?: string[] | null
          blood_type?: string | null
          created_at?: string
          height?: number | null
          id?: string
          medications?: string[] | null
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          pin: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          pin?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          pin?: string
        }
        Relationships: []
      }
      reading_list: {
        Row: {
          book_id: string
          created_at: string
          id: string
          rating: number | null
          status: string | null
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          rating?: number | null
          status?: string | null
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          rating?: number | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_list_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_items: {
        Row: {
          category_id: string
          completed: boolean | null
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          category_id: string
          completed?: boolean | null
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          category_id?: string
          completed?: boolean | null
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          archived: boolean | null
          completed: boolean | null
          created_at: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          archived?: boolean | null
          completed?: boolean | null
          created_at?: string
          id?: string
          title: string
          user_id: string
        }
        Update: {
          archived?: boolean | null
          completed?: boolean | null
          created_at?: string
          id?: string
          title?: string
          user_id?: string
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
