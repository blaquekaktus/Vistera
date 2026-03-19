// Auto-generated types from Supabase schema
// Re-run `npx supabase gen types typescript --local > src/lib/supabase/types.ts` to update

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          role: 'buyer' | 'seller' | 'agent' | 'admin';
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          role?: 'buyer' | 'seller' | 'agent' | 'admin';
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      agent_profiles: {
        Row: {
          id: string;
          agency: string;
          region: string | null;
          languages: string[];
          bio: string | null;
          rating: number;
          review_count: number;
          verified: boolean;
          plan: 'starter' | 'professional' | 'enterprise';
          plan_expires_at: string | null;
        };
        Insert: Partial<Database['public']['Tables']['agent_profiles']['Row']> & { id: string; agency: string };
        Update: Partial<Database['public']['Tables']['agent_profiles']['Row']>;
      };
      properties: {
        Row: {
          id: string;
          agent_id: string;
          title: string;
          title_de: string | null;
          description: string | null;
          description_de: string | null;
          type: 'apartment' | 'house' | 'villa' | 'chalet' | 'penthouse' | 'commercial';
          listing_type: 'sale' | 'rent';
          price: number;
          currency: 'EUR' | 'CHF';
          price_per_sqm: number | null;
          street: string | null;
          city: string;
          region: string | null;
          country: 'AT' | 'DE' | 'CH';
          postal_code: string | null;
          lat: number | null;
          lng: number | null;
          rooms: number | null;
          bedrooms: number | null;
          bathrooms: number | null;
          area: number;
          plot_area: number | null;
          floor: number | null;
          total_floors: number | null;
          year_built: number | null;
          parking: boolean;
          elevator: boolean;
          balcony: boolean;
          garden: boolean;
          cellar: boolean;
          energy_class: string | null;
          amenities: string[];
          images: string[];
          status: 'active' | 'reserved' | 'sold' | 'rented';
          featured: boolean;
          views: number;
          vr_views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['properties']['Row'], 'id' | 'created_at' | 'updated_at' | 'views' | 'vr_views'>;
        Update: Partial<Database['public']['Tables']['properties']['Insert']>;
      };
      vr_tours: {
        Row: {
          id: string;
          property_id: string;
          panorama_url: string;
          thumbnail_url: string | null;
          room_name: string | null;
          room_name_de: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['vr_tours']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['vr_tours']['Insert']>;
      };
      inquiries: {
        Row: {
          id: string;
          property_id: string;
          agent_id: string;
          name: string;
          email: string;
          phone: string | null;
          message: string | null;
          type: 'inquiry' | 'viewing' | 'vr_tour';
          status: 'new' | 'read' | 'responded' | 'closed';
          reply_message: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['inquiries']['Row'], 'id' | 'created_at' | 'status' | 'reply_message'>;
        Update: Partial<Database['public']['Tables']['inquiries']['Row']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
