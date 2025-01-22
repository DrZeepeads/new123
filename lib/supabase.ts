import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common database operations
export async function saveConversation(userId: string, messages: any[]) {
  const { data, error } = await supabase
    .from('conversations')
    .insert([
      {
        user_id: userId,
        messages: messages,
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) throw error;
  return data;
}

export async function getConversations(userId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteConversation(conversationId: string) {
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId);

  if (error) throw error;
  return true;
}
