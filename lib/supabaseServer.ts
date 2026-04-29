// lib/supabaseServer.ts
import { createClient } from '@supabase/supabase-js';

// Never expose this client to the browser
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // ← service role, not anon key
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);