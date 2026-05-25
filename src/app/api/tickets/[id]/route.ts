import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/src/lib/supabase'

type Params = { params: Promise<{ id: string }> }

// ─── GET /api/tickets/[id] ───
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from('ticket_tiers')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Ticket tier not found.' }, { status: 404 })
    }

    return NextResponse.json({ tier: data })
  } catch (err) {
    console.error('GET /api/tickets/[id] error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

// ─── PATCH /api/tickets/[id] ───
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await req.json()

    // Whitelist of patchable fields
    const ALLOWED: string[] = [
      'name',
      'price',
      'description',
      'perks',
      'available',
      'quantity_limit',
      'sort_order',
      'max_per_order',
    ]

    const updates: Record<string, unknown> = {}
    for (const key of ALLOWED) {
      if (key in body) updates[key] = (body as Record<string, unknown>)[key]
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields provided for update.' },
        { status: 400 }
      )
    }

    // Field-level validation for provided values
    if ('price' in updates && (typeof updates.price !== 'number' || (updates.price as number) < 0)) {
      return NextResponse.json({ error: 'price must be a non-negative number.' }, { status: 400 })
    }

    if (
      'quantity_limit' in updates &&
      (typeof updates.quantity_limit !== 'number' || (updates.quantity_limit as number) < 1)
    ) {
      return NextResponse.json(
        { error: 'quantity_limit must be a positive integer.' },
        { status: 400 }
      )
    }

    if (
      'max_per_order' in updates &&
      (typeof updates.max_per_order !== 'number' || (updates.max_per_order as number) < 1)
    ) {
      return NextResponse.json(
        { error: 'max_per_order must be a positive integer.' },
        { status: 400 }
      )
    }

    if ('perks' in updates && !Array.isArray(updates.perks)) {
      return NextResponse.json({ error: 'perks must be an array of strings.' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from('ticket_tiers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      if (error?.code === 'PGRST116') {
        return NextResponse.json({ error: 'Ticket tier not found.' }, { status: 404 })
      }
      console.error('PATCH ticket tier error:', error)
      return NextResponse.json({ error: 'Failed to update ticket tier.' }, { status: 500 })
    }

    return NextResponse.json({ tier: data })
  } catch (err) {
    console.error('PATCH /api/tickets/[id] error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

// ─── PUT /api/tickets/[id] ───
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name, price, description, perks, available, quantity_limit, sort_order, max_per_order = 4 } = body

    if (!name || price === undefined || price === null || !quantity_limit) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, quantity_limit.' },
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

    if (perks !== undefined && !Array.isArray(perks)) {
      return NextResponse.json({ error: 'perks must be an array of strings.' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from('ticket_tiers')
      .update({
        name,
        price,
        description: description ?? '',
        perks: perks ?? [],
        available: available ?? true,
        quantity_limit,
        sort_order: sort_order ?? 0,
        max_per_order,
      })
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      if (error?.code === 'PGRST116') {
        return NextResponse.json({ error: 'Ticket tier not found.' }, { status: 404 })
      }
      console.error('PUT ticket tier error:', error)
      return NextResponse.json({ error: 'Failed to replace ticket tier.' }, { status: 500 })
    }

    return NextResponse.json({ tier: data })
  } catch (err) {
    console.error('PUT /api/tickets/[id] error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}