

import { sendOrderConfirmationEmail } from "@/src/lib/email";
import { NextResponse } from "next/server";

export async function GET() {
  await sendOrderConfirmationEmail({
    to: "haneenep134@gmail.com",
    buyerName: "Muhammed Haneen",
    tierName: "Premium",
    quantity: 2,
    amountPaise: 499 * 100,
    razorpayOrderId: "order_1234567890",
    razorpayPaymentId: "payment_1234567890",
  });

  return NextResponse.json({
    success: true,
    message: "Test email sent",
  });
}