import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/src/lib/supabase'

// ─── GET /api/tickets/[id]/orders ─────────────────────────────────────────────
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = createServerSupabaseClient()

    // Verify the tier exists first
    const { data: tier, error: tierError } = await supabase
      .from('ticket_tiers')
      .select('id, name')
      .eq('id', id)
      .single()

    if (tierError || !tier) {
      return NextResponse.json({ error: 'Ticket tier not found.' }, { status: 404 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const limit = Math.min(Number(searchParams.get('limit') ?? 50), 200)
    const offset = Number(searchParams.get('offset') ?? 0)

    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('ticket_tier', id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && ['paid', 'pending', 'failed'].includes(status)) {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('List tier orders error:', error)
      return NextResponse.json({ error: 'Failed to fetch orders for tier.' }, { status: 500 })
    }

    return NextResponse.json({
      tier,
      orders: data ?? [],
      total: count ?? 0,
      limit,
      offset,
    })
  } catch (err) {
    console.error('GET /api/tickets/[id]/orders error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
