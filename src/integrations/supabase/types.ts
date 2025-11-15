export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      affiliate_clicks: {
        Row: {
          affiliate_link_id: string
          clicked_at: string | null
          id: string
          ip_address: string | null
        }
        Insert: {
          affiliate_link_id: string
          clicked_at?: string | null
          id?: string
          ip_address?: string | null
        }
        Update: {
          affiliate_link_id?: string
          clicked_at?: string | null
          id?: string
          ip_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_affiliate_link_id_fkey"
            columns: ["affiliate_link_id"]
            isOneToOne: false
            referencedRelation: "affiliate_links"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_earnings: {
        Row: {
          affiliate_link_id: string | null
          affiliate_user_id: string
          ecocoins_earned: number
          id: string
          listing_id: string | null
          sale_date: string | null
        }
        Insert: {
          affiliate_link_id?: string | null
          affiliate_user_id: string
          ecocoins_earned: number
          id?: string
          listing_id?: string | null
          sale_date?: string | null
        }
        Update: {
          affiliate_link_id?: string | null
          affiliate_user_id?: string
          ecocoins_earned?: number
          id?: string
          listing_id?: string | null
          sale_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_earnings_affiliate_link_id_fkey"
            columns: ["affiliate_link_id"]
            isOneToOne: false
            referencedRelation: "affiliate_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_earnings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_links: {
        Row: {
          affiliate_user_id: string
          created_at: string | null
          id: string
          link_code: string
          listing_id: string
        }
        Insert: {
          affiliate_user_id: string
          created_at?: string | null
          id?: string
          link_code: string
          listing_id: string
        }
        Update: {
          affiliate_user_id?: string
          created_at?: string | null
          id?: string
          link_code?: string
          listing_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_links_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      escrow: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          order_id: string
          released_at: string | null
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          order_id: string
          released_at?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          order_id?: string
          released_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "escrow_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          category: string
          condition: string
          created_at: string | null
          description: string | null
          id: string
          photos: string[] | null
          price_ecocoins: number
          status: string | null
          sustainability_impact: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          condition: string
          created_at?: string | null
          description?: string | null
          id?: string
          photos?: string[] | null
          price_ecocoins: number
          status?: string | null
          sustainability_impact?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          condition?: string
          created_at?: string | null
          description?: string | null
          id?: string
          photos?: string[] | null
          price_ecocoins?: number
          status?: string | null
          sustainability_impact?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          affiliate_link_id: string | null
          amount_ecocoins: number
          buyer_id: string
          buyer_notes: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          listing_id: string
          seller_id: string
          shipped_at: string | null
          status: string | null
          tracking_number: string | null
        }
        Insert: {
          affiliate_link_id?: string | null
          amount_ecocoins: number
          buyer_id: string
          buyer_notes?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          listing_id: string
          seller_id: string
          shipped_at?: string | null
          status?: string | null
          tracking_number?: string | null
        }
        Update: {
          affiliate_link_id?: string | null
          amount_ecocoins?: number
          buyer_id?: string
          buyer_notes?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          listing_id?: string
          seller_id?: string
          shipped_at?: string | null
          status?: string | null
          tracking_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_affiliate_link_id_fkey"
            columns: ["affiliate_link_id"]
            isOneToOne: false
            referencedRelation: "affiliate_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          order_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          order_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          order_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "affiliate" | "admin"
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
    Enums: {
      app_role: ["user", "affiliate", "admin"],
    },
  },
} as const
