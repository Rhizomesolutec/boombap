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
    const { buyer_name, buyer_email, buyer_phone, ticket_tier, quantity, amount_paise } = body

    // server-side validation
    if (!buyer_name || !buyer_email || !buyer_phone || !ticket_tier || !quantity || !amount_paise) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    // 1. Create a Razorpay order
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

    // 2. Save a pending order in Supabase
    const supabase = createServerSupabaseClient()
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

    // 3. Return the Razorpay order id + public key to the browser
    //    The browser uses these to open the Razorpay payment modal.
    return NextResponse.json({
      orderId: rzpOrder.id,
      amount: amount_paise,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID, // public key, safe to send
    });
  } catch (err) {
    console.error('Create order error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
