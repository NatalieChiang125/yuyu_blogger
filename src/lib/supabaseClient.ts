// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js"

// 前端只能用公開 key（Anon Key）
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
