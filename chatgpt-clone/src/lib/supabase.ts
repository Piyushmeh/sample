import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Message {
  id: string;
  user_id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
  image_url?: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}
