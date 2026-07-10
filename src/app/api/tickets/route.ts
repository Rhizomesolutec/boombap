import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/src/lib/supabase'

// ─── GET /api/tickets ───
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(req.url)
    const onlyAvailable = searchParams.get('available') === 'true'

    let query = supabase
      .from('ticket_tiers')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (onlyAvailable) {
      query = query.eq('available', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('List ticket tiers error:', error)
      return NextResponse.json({ error: 'Failed to fetch ticket tiers.' }, { status: 500 })
    }

    // Fetch paid orders to calculate remaining tickets dynamically
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('ticket_tier, quantity')
      .eq('status', 'paid')

    if (ordersError) {
      console.error('List ticket tiers: fetch orders error:', ordersError)
      // fallback to database values if orders fetch fails
    }

    const tiers = (data ?? []).map((tier) => {
      const sold = (orders ?? [])
        .filter((o) => o.ticket_tier === tier.id)
        .reduce((sum, o) => sum + (o.quantity ?? 0), 0)
      return {
        ...tier,
        tickets_remaining: Math.max(0, tier.quantity_limit - sold),
      }
    })

    return NextResponse.json({ tiers })
  } catch (err: any) {
    console.error('GET /api/tickets error:', err)
    
    // Fallback if Supabase is not configured yet (e.g. missing env variables)
    if (err.message && (err.message.includes('NEXT_PUBLIC_SUPABASE_URL') || err.message.includes('SUPABASE_SERVICE_ROLE_KEY'))) {
      return NextResponse.json({
        tiers: [
          {
            id: 'early-bird',
            name: 'Early Bird',
            price: 49900,
            description: 'Get in early for a discounted price.',
            perks: ['General Admission', '1 Free Drink'],
            available: true,
            quantity_limit: 100,
            tickets_remaining: 42,
            sort_order: 1,
            max_per_order: 4,
          },
          {
            id: 'general',
            name: 'General Admission',
            price: 99900,
            description: 'Standard entry to the event.',
            perks: ['General Admission'],
            available: true,
            quantity_limit: 500,
            tickets_remaining: 500,
            sort_order: 2,
            max_per_order: 4,
          },
          {
            id: 'vip',
            name: 'VIP Access',
            price: 199900,
            description: 'Premium experience with exclusive perks.',
            perks: ['Skip the line', 'VIP lounge access', 'Exclusive Merch'],
            available: true,
            quantity_limit: 50,
            tickets_remaining: 10,
            sort_order: 3,
            max_per_order: 2,
          }
        ]
      });
    }
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

// ─── POST /api/tickets ───
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      id,
      name,
      price,
      description,
      perks = [],
      available = true,
      quantity_limit,
      sort_order = 0,
      max_per_order = 4,
    } = body

    // ── Validation ────────────────────────────────────────────────────────────
    if (!id || !name || price === undefined || price === null || !quantity_limit) {
      return NextResponse.json(
        { error: 'Missing required fields: id, name, price, quantity_limit.' },
        { status: 400 }
      )
    }

    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json({ error: 'price must be a non-negative number.' }, { status: 400 })
    }

    if (typeof quantity_limit !== 'number' || quantity_limit < 1) {
      return NextResponse.json(
        { error: 'quantity_limit must be a positive integer.' },
        { status: 400 }
      )
    }

    if (typeof max_per_order !== 'number' || max_per_order < 1) {
      return NextResponse.json(
        { error: 'max_per_order must be a positive integer.' },
        { status: 400 }
      )
    }

    if (!Array.isArray(perks)) {
      return NextResponse.json({ error: 'perks must be an array of strings.' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from('ticket_tiers')
      .insert({
        id,
        name,
        price,
        description: description ?? '',
        perks,
        available,
        quantity_limit,
        sort_order,
        max_per_order,
      })
      .select()
      .single()

    if (error) {
      // Postgres unique-key violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: `A ticket tier with id "${id}" already exists.` },
          { status: 409 }
        )
      }
      console.error('Insert ticket tier error:', error)
      return NextResponse.json({ error: 'Failed to create ticket tier.' }, { status: 500 })
    }

    return NextResponse.json({ tier: data }, { status: 201 })
  } catch (err) {
    console.error('POST /api/tickets error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
