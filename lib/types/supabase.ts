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
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          actor: string | null
          commission_id: string | null
          created_at: string | null
          details: Json | null
          id: string
        }
        Insert: {
          action: string
          actor?: string | null
          commission_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
        }
        Update: {
          action?: string
          actor?: string | null
          commission_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_commission_id_fkey"
            columns: ["commission_id"]
            isOneToOne: false
            referencedRelation: "commissions"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_addons: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          price_php: number | null
          price_usd: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          price_php?: number | null
          price_usd?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          price_php?: number | null
          price_usd?: number | null
          title?: string
        }
        Relationships: []
      }
      commission_tiers: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          price_php: number | null
          price_usd: number | null
          slot_limit: number | null
          thumbnail_url: string | null
          variant: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          price_php?: number | null
          price_usd?: number | null
          slot_limit?: number | null
          thumbnail_url?: string | null
          variant?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          price_php?: number | null
          price_usd?: number | null
          slot_limit?: number | null
          thumbnail_url?: string | null
          variant?: string | null
        }
        Relationships: []
      }
      commissions: {
        Row: {
          amount_paid: number | null
          base_price: number | null
          client_email: string
          client_name: string
          commission_type: string
          created_at: string | null
          details: string | null
          external_id: string | null
          form_data: Json | null
          id: string
          internal_notes: string | null
          is_commercial: boolean | null
          net_earnings_php: number | null
          or_number: string | null
          payment_status:
          | Database["public"]["Enums"]["payment_status_enum"]
          | null
          payment_url: string | null
          portal_accessed_at: string | null
          portal_slug: string | null
          priority_level:
          | Database["public"]["Enums"]["priority_level_enum"]
          | null
          reference_images: Json | null
          revision_count: number | null
          status: Database["public"]["Enums"]["commission_status"] | null
          tax_amount: number | null
          tier_id: string | null
          total_price: number | null
          updated_at: string | null
          xendit_fee: number | null
        }
        Insert: {
          amount_paid?: number | null
          base_price?: number | null
          client_email: string
          client_name: string
          commission_type: string
          created_at?: string | null
          details?: string | null
          external_id?: string | null
          form_data?: Json | null
          id?: string
          internal_notes?: string | null
          is_commercial?: boolean | null
          net_earnings_php?: number | null
          or_number?: string | null
          payment_status?:
          | Database["public"]["Enums"]["payment_status_enum"]
          | null
          payment_url?: string | null
          portal_accessed_at?: string | null
          portal_slug?: string | null
          priority_level?:
          | Database["public"]["Enums"]["priority_level_enum"]
          | null
          reference_images?: Json | null
          revision_count?: number | null
          status?: Database["public"]["Enums"]["commission_status"] | null
          tax_amount?: number | null
          tier_id?: string | null
          total_price?: number | null
          updated_at?: string | null
          xendit_fee?: number | null
        }
        Update: {
          amount_paid?: number | null
          base_price?: number | null
          client_email?: string
          client_name?: string
          commission_type?: string
          created_at?: string | null
          details?: string | null
          external_id?: string | null
          form_data?: Json | null
          id?: string
          internal_notes?: string | null
          is_commercial?: boolean | null
          net_earnings_php?: number | null
          or_number?: string | null
          payment_status?:
          | Database["public"]["Enums"]["payment_status_enum"]
          | null
          payment_url?: string | null
          portal_accessed_at?: string | null
          portal_slug?: string | null
          priority_level?:
          | Database["public"]["Enums"]["priority_level_enum"]
          | null
          reference_images?: Json | null
          revision_count?: number | null
          status?: Database["public"]["Enums"]["commission_status"] | null
          tax_amount?: number | null
          tier_id?: string | null
          total_price?: number | null
          updated_at?: string | null
          xendit_fee?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "commissions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "commission_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_items: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string
          is_featured: boolean | null
          published_at: string | null
          tags: string[] | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url: string
          is_featured?: boolean | null
          published_at?: string | null
          tags?: string[] | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string
          is_featured?: boolean | null
          published_at?: string | null
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string | null
          cover_image: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          slug: string
          title: string
        }
        Insert: {
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug: string
          title: string
        }
        Update: {
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug?: string
          title?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          commercial_multiplier: number | null
          extra_character_multiplier: number | null
          id: number
          rush_multiplier: number | null
          tax_rate: number | null
          updated_at: string | null
          xendit_fee_fixed: number | null
          xendit_fee_percent: number | null
        }
        Insert: {
          commercial_multiplier?: number | null
          extra_character_multiplier?: number | null
          id?: number
          rush_multiplier?: number | null
          tax_rate?: number | null
          updated_at?: string | null
          xendit_fee_fixed?: number | null
          xendit_fee_percent?: number | null
        }
        Update: {
          commercial_multiplier?: number | null
          extra_character_multiplier?: number | null
          id?: number
          rush_multiplier?: number | null
          tax_rate?: number | null
          updated_at?: string | null
          xendit_fee_fixed?: number | null
          xendit_fee_percent?: number | null
        }
        Relationships: []
      }
      webhooks_log: {
        Row: {
          event_type: string | null
          id: string
          payload: Json | null
          processed: boolean | null
          received_at: string | null
          source: string | null
        }
        Insert: {
          event_type?: string | null
          id?: string
          payload?: Json | null
          processed?: boolean | null
          received_at?: string | null
          source?: string | null
        }
        Update: {
          event_type?: string | null
          id?: string
          payload?: Json | null
          processed?: boolean | null
          received_at?: string | null
          source?: string | null
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
      commission_status:
      | "PENDING"
      | "IN_PROGRESS"
      | "IN_REVISION"
      | "AWAITING_FINAL_PAYMENT"
      | "COMPLETED"
      | "EXPIRED"
      | "REFUNDED"
      | "REJECTED"
      payment_status_enum: "UNPAID" | "DEPOSIT_PAID" | "FULLY_PAID"
      priority_level_enum: "STANDARD" | "RUSH" | "VIP"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      commission_status: [
        "PENDING",
        "IN_PROGRESS",
        "IN_REVISION",
        "AWAITING_FINAL_PAYMENT",
        "COMPLETED",
        "EXPIRED",
        "REFUNDED",
        "REJECTED",
      ],
      payment_status_enum: ["UNPAID", "DEPOSIT_PAID", "FULLY_PAID"],
      priority_level_enum: ["STANDARD", "RUSH", "VIP"],
    },
  },
} as const
