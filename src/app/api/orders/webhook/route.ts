import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServerSupabaseClient } from '@/src/lib/supabase'
import { sendOrderConfirmationEmail } from '@/src/lib/email'

/**
 * POST /api/orders/webhook
 *
 * Razorpay sends signed webhook events here.
 * This is the reliable fallback for when a user's browser closes before
 * /api/orders/verify is called (network drop, tab crash, etc.).
 *
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature header.' }, { status: 400 })
    }

    // ── Verify webhook signature ──────────────────────────────────────────────
    // Razorpay signs webhooks with HMAC-SHA256(raw_body, webhook_secret)
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!
    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex')

    if (expectedSig !== signature) {
      console.warn('Webhook: signature mismatch — possible spoofed request')
      return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
    }

    const event = JSON.parse(rawBody)
    const eventType: string = event.event

    const supabase = createServerSupabaseClient()

    // ── payment.captured — payment went through ───────────────────────────────
    if (eventType === 'payment.captured') {
      const payment = event.payload?.payment?.entity
      const orderId: string | undefined = payment?.order_id
      const paymentId: string | undefined = payment?.id

      if (!orderId || !paymentId) {
        return NextResponse.json({ error: 'Missing payment data.' }, { status: 400 })
      }

      // Fetch current order status to avoid double-processing
      const { data: existing } = await supabase
        .from('orders')
        .select('status, ticket_tier, quantity')
        .eq('razorpay_order_id', orderId)
        .single()

      if (existing?.status === 'paid') {
        // Already marked paid (e.g. by /verify) — idempotent, do nothing
        return NextResponse.json({ received: true })
      }

      // Mark order as paid
      const { data: order, error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          razorpay_payment_id: paymentId,
        })
        .eq('razorpay_order_id', orderId)
        .select('ticket_tier, quantity, amount_paise, buyer_name, buyer_email')
        .single()

      if (updateError) {
        console.error('Webhook: order update error:', updateError)
        return NextResponse.json({ error: 'Order update failed.' }, { status: 500 })
      }

      // Decrement ticket inventory
      if (order?.ticket_tier && order?.quantity) {
        const { error: inventoryError } = await supabase.rpc('decrement_tickets', {
          tier_id: order.ticket_tier,
          qty: order.quantity,
        })
        if (inventoryError) {
          console.error('Webhook: inventory decrement error:', inventoryError)
        }
      }

      // ── Send confirmation email (webhook is fallback — verify may not have run) ──
      // The existing?.status check at the top already returns early if 'paid',
      // so reaching here means this webhook is the first to confirm the order.
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
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
        })
      }

      return NextResponse.json({ received: true })
    }

    // ── payment.failed — payment was declined / timed out ─────────────────────
    if (eventType === 'payment.failed') {
      const payment = event.payload?.payment?.entity
      const orderId: string | undefined = payment?.order_id

      if (!orderId) {
        return NextResponse.json({ error: 'Missing order id.' }, { status: 400 })
      }

      await supabase
        .from('orders')
        .update({ status: 'failed' })
        .eq('razorpay_order_id', orderId)
        .eq('status', 'pending') // only downgrade pending orders, never overwrite 'paid'

      return NextResponse.json({ received: true })
    }

    // Unknown event — acknowledge to stop retries
    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
