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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          body: string | null
          category: string | null
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean | null
          read_time: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          category?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          read_time?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          category?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          read_time?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          markup_percent: number
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          markup_percent?: number
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          markup_percent?: number
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      clips: {
        Row: {
          city: string | null
          created_at: string
          description: string | null
          first_name: string | null
          id: string
          last_name: string | null
          likes: number | null
          player_handle: string
          social_handle: string | null
          social_network: string | null
          status: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string
          video_url: string | null
          views: number | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          description?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          likes?: number | null
          player_handle: string
          social_handle?: string | null
          social_network?: string | null
          status?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          user_id: string
          video_url?: string | null
          views?: number | null
        }
        Update: {
          city?: string | null
          created_at?: string
          description?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          likes?: number | null
          player_handle?: string
          social_handle?: string | null
          social_network?: string | null
          status?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          video_url?: string | null
          views?: number | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          product_image: string | null
          product_name: string
          product_slug: string
          quantity: number
          subtotal: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_image?: string | null
          product_name: string
          product_slug: string
          quantity: number
          subtotal: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_image?: string | null
          product_name?: string
          product_slug?: string
          quantity?: number
          subtotal?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          city: string
          created_at: string
          currency: string
          email: string
          full_name: string
          id: string
          notes: string | null
          payment_id: string | null
          payment_provider: string
          phone: string
          preference_id: string | null
          region: string
          rut: string | null
          shipping: number
          status: string
          subtotal: number
          total: number
          tracking_code: string | null
          tracking_url: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          currency?: string
          email: string
          full_name: string
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_provider?: string
          phone: string
          preference_id?: string | null
          region: string
          rut?: string | null
          shipping?: number
          status?: string
          subtotal: number
          total: number
          tracking_code?: string | null
          tracking_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          currency?: string
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_provider?: string
          phone?: string
          preference_id?: string | null
          region?: string
          rut?: string | null
          shipping?: number
          status?: string
          subtotal?: number
          total?: number
          tracking_code?: string | null
          tracking_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          badge: string | null
          brand: string
          cost_usd: number | null
          created_at: string
          description: string | null
          exchange_rate: number | null
          featured: boolean | null
          id: string
          image_url: string | null
          images: Json | null
          level: string | null
          markup_percent: number | null
          name: string
          old_price: number | null
          price: number
          published: boolean
          shipping_cost_usd: number | null
          slug: string
          source_url: string | null
          specs: Json | null
          stock: number | null
          style: string | null
          type: string
          updated_at: string
        }
        Insert: {
          badge?: string | null
          brand: string
          cost_usd?: number | null
          created_at?: string
          description?: string | null
          exchange_rate?: number | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          images?: Json | null
          level?: string | null
          markup_percent?: number | null
          name: string
          old_price?: number | null
          price: number
          published?: boolean
          shipping_cost_usd?: number | null
          slug: string
          source_url?: string | null
          specs?: Json | null
          stock?: number | null
          style?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          badge?: string | null
          brand?: string
          cost_usd?: number | null
          created_at?: string
          description?: string | null
          exchange_rate?: number | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          images?: Json | null
          level?: string | null
          markup_percent?: number | null
          name?: string
          old_price?: number | null
          price?: number
          published?: boolean
          shipping_cost_usd?: number | null
          slug?: string
          source_url?: string | null
          specs?: Json | null
          stock?: number | null
          style?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          display_name: string | null
          id: string
          level: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          level?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          level?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      rankings: {
        Row: {
          category: string
          club: string | null
          country: string | null
          created_at: string
          flag: string | null
          id: string
          photo_url: string | null
          player_name: string
          points: number | null
          position: number
          source_url: string | null
          synced_at: string | null
          trend: string | null
          updated_at: string
        }
        Insert: {
          category: string
          club?: string | null
          country?: string | null
          created_at?: string
          flag?: string | null
          id?: string
          photo_url?: string | null
          player_name: string
          points?: number | null
          position: number
          source_url?: string | null
          synced_at?: string | null
          trend?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          club?: string | null
          country?: string | null
          created_at?: string
          flag?: string | null
          id?: string
          photo_url?: string | null
          player_name?: string
          points?: number | null
          position?: number
          source_url?: string | null
          synced_at?: string | null
          trend?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tournaments: {
        Row: {
          category: string
          city: string
          created_at: string
          date: string
          description: string | null
          id: string
          name: string
          register_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          category: string
          city: string
          created_at?: string
          date: string
          description?: string | null
          id?: string
          name: string
          register_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          category?: string
          city?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          name?: string
          register_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
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
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
