import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/src/lib/supabase'

// ─── GET /api/tickets/stats ───
export async function GET(_req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Fetch all tiers
    const { data: tiers, error: tiersError } = await supabase
      .from('ticket_tiers')
      .select('id, name, price, quantity_limit, available, sort_order')
      .order('sort_order', { ascending: true })

    if (tiersError) {
      console.error('Stats: tiers fetch error:', tiersError)
      return NextResponse.json({ error: `Failed to fetch tiers: ${tiersError.message}` }, { status: 500 })
    }

    // Fetch all orders grouped by ticket_tier and status
    // We use a raw select and aggregate in JS to avoid needing a DB function
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('ticket_tier, status, quantity, amount_paise')

    if (ordersError) {
      console.error('Stats: orders fetch error:', ordersError)
      return NextResponse.json({ error: 'Failed to fetch orders.' }, { status: 500 })
    }

    // Build per-tier aggregates
    const stats = (tiers ?? []).map((tier) => {
      const tierOrders = (orders ?? []).filter((o) => o.ticket_tier === tier.id)

      const paid    = tierOrders.filter((o) => o.status === 'paid')
      const pending = tierOrders.filter((o) => o.status === 'pending')
      const failed  = tierOrders.filter((o) => o.status === 'failed')

      const total_sold = paid.reduce((sum, o) => sum + (o.quantity ?? 0), 0)
      const total_pending = pending.reduce((sum, o) => sum + (o.quantity ?? 0), 0)
      const total_failed = failed.reduce((sum, o) => sum + (o.quantity ?? 0), 0)
      const total_revenue_paise = paid.reduce((sum, o) => sum + (o.amount_paise ?? 0), 0)
      
      const tickets_remaining = Math.max(0, tier.quantity_limit - total_sold)

      return {
        id: tier.id,
        name: tier.name,
        price: tier.price,
        quantity_limit: tier.quantity_limit,
        available: tier.available,
        sort_order: tier.sort_order,
        total_sold,
        total_pending,
        total_failed,
        total_revenue_paise,
        total_revenue_rupees: total_revenue_paise / 100,
        tickets_remaining,
        sold_percentage:
          tier.quantity_limit > 0
            ? Math.round((total_sold / tier.quantity_limit) * 100)
            : 0,
      }
    })

    // Overall summary
    const summary = {
      total_tiers: stats.length,
      total_sold: stats.reduce((s, t) => s + t.total_sold, 0),
      total_pending: stats.reduce((s, t) => s + t.total_pending, 0),
      total_failed: stats.reduce((s, t) => s + t.total_failed, 0),
      total_revenue_paise: stats.reduce((s, t) => s + t.total_revenue_paise, 0),
      total_revenue_rupees: stats.reduce((s, t) => s + t.total_revenue_rupees, 0),
      total_capacity: stats.reduce((s, t) => s + t.quantity_limit, 0),
      tickets_remaining: stats.reduce((s, t) => s + t.tickets_remaining, 0),
    }

    return NextResponse.json({ summary, tiers: stats })
  } catch (err) {
    console.error('GET /api/tickets/stats error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
