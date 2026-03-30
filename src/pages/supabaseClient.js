import { createClient } from "@supabase/supabase-js";

// Use variáveis de ambiente (Vite prefixo VITE_)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Supabase client não configurado: verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY"
  );
  // em tempo de dev, ainda podemos falhar silenciosamente com placeholder para evitar crash em build
}

export const supabase = createClient(supabaseUrl, supabaseKey);
