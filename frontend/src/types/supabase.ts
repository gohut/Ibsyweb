export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          legacy_id: string | null;
          name: string;
          slug: string;
          category: string;
          short_blurb: string;
          description_html: string;
          images: string[];
          youtube_urls: string[];
          original_price_inr: number;
          price_inr: number;
          original_price_usd: number;
          price_usd: number;
          likes: number;
          downloads: number;
          avg_rating: number;
          review_count: number;
          status: "active" | "hidden";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          legacy_id?: string | null;
          name: string;
          slug: string;
          category: string;
          short_blurb: string;
          description_html: string;
          images?: string[];
          youtube_urls?: string[];
          original_price_inr: number;
          price_inr: number;
          original_price_usd: number;
          price_usd: number;
          likes?: number;
          downloads?: number;
          avg_rating?: number;
          review_count?: number;
          status?: "active" | "hidden";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          legacy_id?: string | null;
          name?: string;
          slug?: string;
          category?: string;
          short_blurb?: string;
          description_html?: string;
          images?: string[];
          youtube_urls?: string[];
          original_price_inr?: number;
          price_inr?: number;
          original_price_usd?: number;
          price_usd?: number;
          likes?: number;
          downloads?: number;
          avg_rating?: number;
          review_count?: number;
          status?: "active" | "hidden";
          created_at?: string;
          updated_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          site_name: string;
          tagline: string;
          logo_url: string;
          instagram_handle: string | null;
          instagram_url: string | null;
          terms_url: string | null;
          copyright_name: string | null;
          accent_color: string;
          background_color: string;
          text_color: string;
          font_pair: string;
          admin_username: string;
          admin_password: string;
          contact_email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_name: string;
          tagline: string;
          logo_url: string;
          instagram_handle?: string | null;
          instagram_url?: string | null;
          terms_url?: string | null;
          copyright_name?: string | null;
          accent_color: string;
          background_color: string;
          text_color: string;
          font_pair: string;
          admin_username: string;
          admin_password: string;
          contact_email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          site_name?: string;
          tagline?: string;
          logo_url?: string;
          instagram_handle?: string | null;
          instagram_url?: string | null;
          terms_url?: string | null;
          copyright_name?: string | null;
          accent_color?: string;
          background_color?: string;
          text_color?: string;
          font_pair?: string;
          admin_username?: string;
          admin_password?: string;
          contact_email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      slider_images: {
        Row: {
          id: string;
          image_url: string;
          title: string | null;
          subtitle: string | null;
          product_slug: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          title?: string | null;
          subtitle?: string | null;
          product_slug?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string;
          title?: string | null;
          subtitle?: string | null;
          product_slug?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          buyer_name: string;
          buyer_email: string;
          product_id: string;
          amount: number;
          currency: "INR" | "USD";
          payment_method: string;
          status: "completed" | "processing" | "refunded";
          payment_reference: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          buyer_name: string;
          buyer_email: string;
          product_id: string;
          amount: number;
          currency: "INR" | "USD";
          payment_method: string;
          status?: "completed" | "processing" | "refunded";
          payment_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          buyer_name?: string;
          buyer_email?: string;
          product_id?: string;
          amount?: number;
          currency?: "INR" | "USD";
          payment_method?: string;
          status?: "completed" | "processing" | "refunded";
          payment_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          currency: "INR" | "USD";
          line_total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity?: number;
          unit_price: number;
          currency: "INR" | "USD";
          line_total: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          currency?: "INR" | "USD";
          line_total?: number;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          author: string;
          rating: number;
          review_text: string;
          reviewed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          author: string;
          rating: number;
          review_text: string;
          reviewed_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          author?: string;
          rating?: number;
          review_text?: string;
          reviewed_at?: string;
          created_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          display_name: string | null;
          full_name: string | null;
          avatar_url: string | null;
          role: "customer" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "customer" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "customer" | "admin";
          created_at?: string;
          updated_at?: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          status: "completed" | "pending" | "refunded";
          purchased_at: string;
          download_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          status?: "completed" | "pending" | "refunded";
          purchased_at?: string;
          download_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          status?: "completed" | "pending" | "refunded";
          purchased_at?: string;
          download_count?: number;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
