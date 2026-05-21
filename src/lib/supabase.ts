import { createClient } from '@supabase/supabase-js'

// ─── Browser client (uses anon key — safe for frontend) ────────────────────────
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ─── Server client (uses service-role key — only used in API routes) ──────────
export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ─── TypeScript types that mirror our Supabase tables ─────────────────────────

export type TicketTier = {
  id: string                 // e.g. 'general' | 'supporter' | 'vip'
  name: string               // Display name
  price: number              // Amount in paise (₹499 = 49900)
  description: string
  perks: string[]
  available: boolean
  quantity_limit: number     // Max tickets per order
}

export type Order = {
  id?: string
  buyer_name: string
  buyer_email: string
  buyer_phone: string
  ticket_tier: string        // references TicketTier.id
  quantity: number
  amount_paise: number       // Total in paise
  razorpay_order_id: string
  razorpay_payment_id?: string
  razorpay_signature?: string
  status: 'pending' | 'paid' | 'failed'
  created_at?: string
}
