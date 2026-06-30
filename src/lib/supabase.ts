import { createClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase usado para autenticação (Supabase Auth).
 * A sessão é persistida automaticamente pelo SDK no localStorage e o header
 * `apikey` é injetado internamente em todas as requisições do próprio SDK.
 */
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);
