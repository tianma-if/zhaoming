export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          auth_provider: string;
          locale: string | null;
          timezone: string | null;
          stripe_customer_id: string | null;
          subscription_status: string;
          credits: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["users"]["Row"]> & {
          id: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Row"]>;
      };
      divinations: {
        Row: {
          id: string;
          user_id: string;
          divination_type: string;
          subject_name: string | null;
          birth_gregorian: string | null;
          birth_lunar: Json | null;
          gender: string | null;
          question: string;
          input_params: Json;
          chart_json: Json;
          ai_result_markdown: string | null;
          ai_model: string | null;
          credits_consumed: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["divinations"]["Row"]> & {
          user_id: string;
          divination_type: string;
          question: string;
        };
        Update: Partial<Database["public"]["Tables"]["divinations"]["Row"]>;
      };
      posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          content: string;
          meta_description: string | null;
          cover_image_url: string | null;
          tags: string[];
          author_id: string | null;
          source: string;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["posts"]["Row"]> & {
          slug: string;
          title: string;
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["posts"]["Row"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
