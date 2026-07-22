import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/src/lib/supabase'

async function ensureDefaultSAB6Tiers(supabase: any) {
  try {
    const defaultTiers = [
      {
        id: 'sab6-test',
        name: 'SAB6 TEST',
        price: 100, // ₹1
        description: 'Test ticket for payment and email verification.',
        perks: ['Test Access', 'Payment Verification'],
        available: true,
        quantity_limit: 100,
        sort_order: 0,
        max_per_order: 4
      },
      {
        id: 'sab6-show',
        name: 'SAB6 SHOW',
        price: 6600, // ₹66
        description: 'Get in early for an exclusive experience.',
        perks: ['General Admission', 'Early Access', 'Exclusive Merch'],
        available: true,
        quantity_limit: 100,
        sort_order: 1,
        max_per_order: 4
      }
    ];

    for (const t of defaultTiers) {
      const { data } = await supabase
        .from('ticket_tiers')
        .select('id')
        .eq('id', t.id)
        .maybeSingle();

      if (!data) {
        await supabase
          .from('ticket_tiers')
          .insert(t);
        console.log(`[seeding] Inserted default tier: ${t.id}`);
      }
    }
  } catch (err) {
    console.error('[seeding] Failed to seed default SAB6 tiers:', err);
  }
}

// ─── GET /api/tickets/stats ───
export async function GET(_req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    await ensureDefaultSAB6Tiers(supabase)

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

      const paid = tierOrders.filter((o) => o.status === 'paid')
      const pending = tierOrders.filter((o) => o.status === 'pending')
      const failed = tierOrders.filter((o) => o.status === 'failed')

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
