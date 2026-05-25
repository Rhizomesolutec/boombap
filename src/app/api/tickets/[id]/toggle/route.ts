import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/src/lib/supabase'

// ─── PATCH /api/tickets/[id]/toggle ──────────────────────────────────────────
export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = createServerSupabaseClient()

    // Fetch current state first
    const { data: current, error: fetchError } = await supabase
      .from('ticket_tiers')
      .select('available')
      .eq('id', id)
      .single()

    if (fetchError || !current) {
      return NextResponse.json({ error: 'Ticket tier not found.' }, { status: 404 })
    }

    const newAvailable = !current.available

    const { data, error } = await supabase
      .from('ticket_tiers')
      .update({ available: newAvailable })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Toggle availability error:', error)
      return NextResponse.json({ error: 'Failed to toggle availability.' }, { status: 500 })
    }

    return NextResponse.json({ tier: data, available: newAvailable })
  } catch (err) {
    console.error('PATCH /api/tickets/[id]/toggle error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
