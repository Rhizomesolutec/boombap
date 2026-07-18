import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/src/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(req.url)

    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const limit = Math.min(Number(searchParams.get('limit') ?? 50), 10000)
    const offset = Number(searchParams.get('offset') ?? 0)

    // 1. Fetch tiers for display name lookup
    const { data: tiers, error: tiersError } = await supabase
      .from('ticket_tiers')
      .select('id, name')

    if (tiersError) {
      console.error('Orders API: fetch tiers error:', tiersError)
    }

    // 2. Fetch orders
    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && ['paid', 'pending', 'failed'].includes(status)) {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`buyer_name.ilike.%${search}%,buyer_email.ilike.%${search}%,buyer_phone.ilike.%${search}%,razorpay_order_id.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Orders API: fetch orders error:', error)
      return NextResponse.json({ error: `Failed to fetch orders: ${error.message}` }, { status: 500 })
    }

    // 3. Map display names
    const enrichedOrders = (data ?? []).map((order) => {
      const tier = (tiers ?? []).find((t) => t.id === order.ticket_tier)
      return {
        ...order,
        ticket_tier_name: tier ? tier.name : order.ticket_tier,
        ticket_category: tier ? tier.id : 'general'
      }
    })

    return NextResponse.json({
      orders: enrichedOrders,
      total: count ?? 0,
      limit,
      offset,
    })
  } catch (err) {
    console.error('GET /api/orders error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
