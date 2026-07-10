import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServerSupabaseClient } from '@/src/lib/supabase'
import { sendOrderConfirmationEmail } from '@/src/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details.' }, { status: 400 })
    }

    // ── Signature verification ────────────────────────────────────────────────
    // Razorpay signs the response with: HMAC-SHA256(order_id + "|" + payment_id, key_secret)
    // We verify this server-side so it can't be faked by the browser.
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      // Signature mismatch — payment may be tampered
      return NextResponse.json({ error: 'Payment verification failed.' }, { status: 400 })
    }

    // ── Mark the order as paid in Supabase ───────────────────────────────────
    const supabase = createServerSupabaseClient()
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        razorpay_payment_id,
        razorpay_signature,
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .select('ticket_tier, quantity, amount_paise, buyer_name, buyer_email')
      .single()

    if (dbError) {
      console.error('Supabase update error:', dbError)
      return NextResponse.json({ error: 'Order update failed.' }, { status: 500 })
    }

    // ── Decrement ticket inventory ────────────────────────────────────────────
    // Use rpc to safely decrement so concurrent requests don't race
    if (order?.ticket_tier && order?.quantity) {
      const { error: inventoryError } = await supabase.rpc('decrement_tickets', {
        tier_id: order.ticket_tier,
        qty: order.quantity,
      })
      if (inventoryError) {
        // Non-fatal — order is paid; log and continue
        console.error('Inventory decrement error:', inventoryError)
      }
    }

    // ── Send confirmation email ───────────────────────────────────────────────
    if (order?.buyer_email && order?.buyer_name) {
      const { data: tier } = await supabase
        .from('ticket_tiers')
        .select('name')
        .eq('id', order.ticket_tier)
        .single()

      await sendOrderConfirmationEmail({
        to: order.buyer_email,
        buyerName: order.buyer_name,
        tierName: tier?.name ?? order.ticket_tier,
        quantity: order.quantity,
        amountPaise: order.amount_paise,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Verify order error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
