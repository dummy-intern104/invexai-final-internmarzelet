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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          email: string | null
          gst_number: string | null
          id: string
          name: string
          phone: string | null
          pincode: string | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          gst_number?: string | null
          id?: string
          name: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          gst_number?: string | null
          id?: string
          name?: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      delivery_challan_items: {
        Row: {
          challan_id: string
          created_at: string
          id: string
          product_name: string
          quantity: number
        }
        Insert: {
          challan_id: string
          created_at?: string
          id?: string
          product_name: string
          quantity: number
        }
        Update: {
          challan_id?: string
          created_at?: string
          id?: string
          product_name?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "delivery_challan_items_challan_id_fkey"
            columns: ["challan_id"]
            isOneToOne: false
            referencedRelation: "delivery_challans"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_challans: {
        Row: {
          challan_number: string
          client_id: string | null
          client_name: string
          created_at: string
          date: string
          delivery_address: string | null
          id: string
          notes: string | null
          status: string
          updated_at: string
          user_id: string
          vehicle_number: string | null
        }
        Insert: {
          challan_number: string
          client_id?: string | null
          client_name: string
          created_at?: string
          date?: string
          delivery_address?: string | null
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id: string
          vehicle_number?: string | null
        }
        Update: {
          challan_number?: string
          client_id?: string | null
          client_name?: string
          created_at?: string
          date?: string
          delivery_address?: string | null
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          vehicle_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_challans_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      estimate_items: {
        Row: {
          created_at: string
          estimate_id: string
          gst_rate: number
          id: string
          price: number
          product_name: string
          quantity: number
          total: number
        }
        Insert: {
          created_at?: string
          estimate_id: string
          gst_rate?: number
          id?: string
          price: number
          product_name: string
          quantity: number
          total: number
        }
        Update: {
          created_at?: string
          estimate_id?: string
          gst_rate?: number
          id?: string
          price?: number
          product_name?: string
          quantity?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "estimate_items_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
        ]
      }
      estimates: {
        Row: {
          client_id: string | null
          client_name: string
          created_at: string
          date: string
          estimate_number: string
          id: string
          notes: string | null
          status: string
          terms: string | null
          total_amount: number
          updated_at: string
          user_id: string
          valid_until: string | null
        }
        Insert: {
          client_id?: string | null
          client_name: string
          created_at?: string
          date?: string
          estimate_number: string
          id?: string
          notes?: string | null
          status?: string
          terms?: string | null
          total_amount?: number
          updated_at?: string
          user_id: string
          valid_until?: string | null
        }
        Update: {
          client_id?: string | null
          client_name?: string
          created_at?: string
          date?: string
          estimate_number?: string
          id?: string
          notes?: string | null
          status?: string
          terms?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estimates_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string
          date: string
          id: string
          notes: string | null
          payment_method: string | null
          receipt_url: string | null
          title: string
          user_id: string
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          receipt_url?: string | null
          title: string
          user_id: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          receipt_url?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          current_stock: number
          id: string
          last_updated: string
          local_stock: number
          location: string | null
          product_id: number
          product_name: string
          reorder_level: number
          reserved_stock: number
          user_id: string
          warehouse_stock: number
        }
        Insert: {
          current_stock?: number
          id?: string
          last_updated?: string
          local_stock?: number
          location?: string | null
          product_id: number
          product_name: string
          reorder_level?: number
          reserved_stock?: number
          user_id: string
          warehouse_stock?: number
        }
        Update: {
          current_stock?: number
          id?: string
          last_updated?: string
          local_stock?: number
          location?: string | null
          product_id?: number
          product_name?: string
          reorder_level?: number
          reserved_stock?: number
          user_id?: string
          warehouse_stock?: number
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          created_at: string
          gst_rate: number
          id: string
          invoice_id: string
          price: number
          product_name: string
          quantity: number
          total: number
        }
        Insert: {
          created_at?: string
          gst_rate?: number
          id?: string
          invoice_id: string
          price: number
          product_name: string
          quantity: number
          total: number
        }
        Update: {
          created_at?: string
          gst_rate?: number
          id?: string
          invoice_id?: string
          price?: number
          product_name?: string
          quantity?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_id: string | null
          client_name: string
          created_at: string
          date: string
          discount: number
          due_date: string | null
          gst_amount: number
          id: string
          invoice_number: string
          notes: string | null
          payment_mode: string
          status: string
          subtotal: number
          terms: string | null
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id?: string | null
          client_name: string
          created_at?: string
          date?: string
          discount?: number
          due_date?: string | null
          gst_amount?: number
          id?: string
          invoice_number: string
          notes?: string | null
          payment_mode?: string
          status?: string
          subtotal?: number
          terms?: string | null
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string | null
          client_name?: string
          created_at?: string
          date?: string
          discount?: number
          due_date?: string | null
          gst_amount?: number
          id?: string
          invoice_number?: string
          notes?: string | null
          payment_mode?: string
          status?: string
          subtotal?: number
          terms?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      keyboard_shortcuts: {
        Row: {
          action: string
          created_at: string
          description: string
          id: string
          shortcut_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          description: string
          id?: string
          shortcut_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string
          id?: string
          shortcut_key?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          client_id: string | null
          client_name: string
          created_at: string
          date: string
          id: string
          notes: string | null
          status: string
          time: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id?: string | null
          client_name: string
          created_at?: string
          date: string
          id?: string
          notes?: string | null
          status?: string
          time: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string | null
          client_name?: string
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          status?: string
          time?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string
          id: string
          notes: string | null
          payment_date: string
          payment_method: string
          reference_number: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method: string
          reference_number?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          reference_number?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      product_expiry: {
        Row: {
          batch_number: string | null
          created_at: string | null
          expiry_date: string
          id: string
          notes: string | null
          product_id: number
          product_name: string
          quantity: number | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          batch_number?: string | null
          created_at?: string | null
          expiry_date: string
          id?: string
          notes?: string | null
          product_id: number
          product_name: string
          quantity?: number | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          batch_number?: string | null
          created_at?: string | null
          expiry_date?: string
          id?: string
          notes?: string | null
          product_id?: number
          product_name?: string
          quantity?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          expiry_date: string | null
          id: string
          price: number
          product_name: string
          reorder_level: number
          supplier_address: string | null
          supplier_city: string | null
          supplier_company_name: string | null
          supplier_gst_number: string | null
          supplier_pincode: string | null
          supplier_state: string | null
          units: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          price?: number
          product_name: string
          reorder_level?: number
          supplier_address?: string | null
          supplier_city?: string | null
          supplier_company_name?: string | null
          supplier_gst_number?: string | null
          supplier_pincode?: string | null
          supplier_state?: string | null
          units?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          price?: number
          product_name?: string
          reorder_level?: number
          supplier_address?: string | null
          supplier_city?: string | null
          supplier_company_name?: string | null
          supplier_gst_number?: string | null
          supplier_pincode?: string | null
          supplier_state?: string | null
          units?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      purchase_order_items: {
        Row: {
          created_at: string
          id: string
          product_name: string
          purchase_order_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          product_name: string
          purchase_order_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          product_name?: string
          purchase_order_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string
          expected_delivery_date: string | null
          id: string
          notes: string | null
          order_date: string
          order_number: string
          status: string
          supplier_contact: string | null
          supplier_name: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          order_date?: string
          order_number: string
          status?: string
          supplier_contact?: string | null
          supplier_name: string
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          order_date?: string
          order_number?: string
          status?: string
          supplier_contact?: string | null
          supplier_name?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      purchase_return_items: {
        Row: {
          created_at: string
          id: string
          product_name: string
          quantity: number
          return_id: string
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          product_name: string
          quantity: number
          return_id: string
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          product_name?: string
          quantity?: number
          return_id?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_return_items_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "purchase_returns"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_returns: {
        Row: {
          created_at: string
          id: string
          purchase_order_id: string | null
          reason: string | null
          return_date: string
          return_number: string
          status: string
          supplier_id: string | null
          total_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          purchase_order_id?: string | null
          reason?: string | null
          return_date?: string
          return_number: string
          status?: string
          supplier_id?: string | null
          total_amount?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          purchase_order_id?: string | null
          reason?: string | null
          return_date?: string
          return_number?: string
          status?: string
          supplier_id?: string | null
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_returns_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_returns_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          client_id: string | null
          created_at: string
          id: string
          notes: string | null
          payment_method: string | null
          product_id: string | null
          quantity_sold: number
          sale_date: string
          selling_price: number
          total_amount: number
          user_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          product_id?: string | null
          quantity_sold: number
          sale_date?: string
          selling_price: number
          total_amount: number
          user_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          product_id?: string | null
          quantity_sold?: number
          sale_date?: string
          selling_price?: number
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_sales_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sales_product_id"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_returns: {
        Row: {
          client_id: string | null
          created_at: string
          id: string
          product_id: string | null
          quantity_returned: number
          reason: string | null
          return_amount: number
          return_date: string
          sale_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          id?: string
          product_id?: string | null
          quantity_returned: number
          reason?: string | null
          return_amount: number
          return_date?: string
          sale_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          id?: string
          product_id?: string | null
          quantity_returned?: number
          reason?: string | null
          return_amount?: number
          return_date?: string
          sale_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_returns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_returns_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_returns_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          city: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          gst_number: string | null
          id: string
          phone: string | null
          pincode: string | null
          state: string | null
          supplier_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          gst_number?: string | null
          id?: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          supplier_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          gst_number?: string | null
          id?: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          supplier_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string
          id: string
          priority: string
          resolution: string | null
          status: string
          subject: string
          ticket_number: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description: string
          id?: string
          priority?: string
          resolution?: string | null
          status?: string
          subject: string
          ticket_number: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string
          id?: string
          priority?: string
          resolution?: string | null
          status?: string
          subject?: string
          ticket_number?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_data: {
        Row: {
          clients: Json | null
          created_at: string | null
          id: string
          payments: Json | null
          products: Json | null
          purchase_returns: Json | null
          sales: Json | null
          sales_returns: Json | null
          suppliers: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          clients?: Json | null
          created_at?: string | null
          id?: string
          payments?: Json | null
          products?: Json | null
          purchase_returns?: Json | null
          sales?: Json | null
          sales_returns?: Json | null
          suppliers?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          clients?: Json | null
          created_at?: string | null
          id?: string
          payments?: Json | null
          products?: Json | null
          purchase_returns?: Json | null
          sales?: Json | null
          sales_returns?: Json | null
          suppliers?: Json | null
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
      get_user_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          clients: Json | null
          created_at: string | null
          id: string
          payments: Json | null
          products: Json | null
          purchase_returns: Json | null
          sales: Json | null
          sales_returns: Json | null
          suppliers: Json | null
          updated_at: string | null
          user_id: string
        }[]
      }
      user_owns_data: {
        Args: { data_user_id: string }
        Returns: boolean
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
