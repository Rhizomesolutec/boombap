import { createServerSupabaseClient } from '@/src/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

// Initialise Razorpay with your key_id and key_secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { buyer_name, buyer_email, buyer_phone, ticket_tier, quantity } = body

    // ── Server-side validation ────────────────────────────────────────────────
    if (!buyer_name || !buyer_email || !buyer_phone || !ticket_tier || !quantity) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json({ error: 'Invalid quantity.' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // ── 1. Fetch the real tier price from DB ───────────────────────────────
    const { data: tier, error: tierError } = await supabase
      .from('ticket_tiers')
      .select('price, available, quantity_limit, max_per_order')
      .eq('id', ticket_tier)
      .single()

    if (tierError || !tier) {
      return NextResponse.json({ error: 'Ticket tier not found.' }, { status: 404 })
    }
    if (!tier.available) {
      return NextResponse.json({ error: 'This ticket tier is no longer available.' }, { status: 409 })
    }

    // Compute remaining tickets the same way as /api/tickets
    const { data: soldOrders } = await supabase
      .from('orders')
      .select('quantity')
      .eq('ticket_tier', ticket_tier)
      .eq('status', 'paid')

    const sold = (soldOrders ?? []).reduce((sum, o) => sum + (o.quantity ?? 0), 0)
    const ticketsRemaining = Math.max(0, tier.quantity_limit - sold)

    if (quantity > ticketsRemaining) {
      return NextResponse.json({ error: 'Not enough tickets remaining.' }, { status: 409 })
    }
    const maxPerOrder = tier.max_per_order ?? 4
    if (quantity > maxPerOrder) {
      return NextResponse.json({ error: `Maximum ${maxPerOrder} tickets per order.` }, { status: 400 })
    }

    // Amount calculated server-side — cannot be tampered by the client
    const amount_paise: number = tier.price * quantity

    // ── 2. Create a Razorpay order ────────────────────────────────────────────
    // amount is in paise (₹499 = 49900 paise)
    const rzpOrder = await razorpay.orders.create({
      amount: amount_paise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        buyer_name,
        buyer_email,
        ticket_tier,
        quantity: String(quantity),
      },
    })

    // ── 3. Save a pending order in Supabase ───────────────────────────────────
    const { error: dbError } = await supabase.from('orders').insert({
      buyer_name,
      buyer_email,
      buyer_phone,
      ticket_tier,
      quantity,
      amount_paise,
      razorpay_order_id: rzpOrder.id,
      status: 'pending',
    })

    if (dbError) {
      console.error('Supabase insert error:', dbError)
      return NextResponse.json({ error: 'Could not save order. Try again.' }, { status: 500 })
    }

    // ── 4. Return the Razorpay order id + public key to the browser ───────────
    //    The browser uses these to open the Razorpay payment modal.
    return NextResponse.json({
      orderId: rzpOrder.id,
      amount: amount_paise,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID, // public key, safe to send
    })
  } catch (err) {
    console.error('Create order error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
