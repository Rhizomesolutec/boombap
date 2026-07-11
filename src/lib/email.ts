import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// ── Transporter ───────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: process.env.SMTP_SECURE !== 'false',
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
})

// ── Logo via Supabase Storage ──────────────────────────────────────────────────
let cachedLogoUrl: string | null = null

async function getLogoUrl(): Promise<string> {
  if (cachedLogoUrl) return cachedLogoUrl

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const bucketName = 'email-assets'
    const fileName   = 'bmbp-green-logo.png'

    await supabase.storage.createBucket(bucketName, { public: true })

    const logoBuffer = fs.readFileSync(path.join(process.cwd(), 'public', fileName))

    await supabase.storage
      .from(bucketName)
      .upload(fileName, logoBuffer, { contentType: 'image/png', upsert: true })

    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName)
    cachedLogoUrl = data.publicUrl
    console.log('[email] Logo URL:', cachedLogoUrl)
    return cachedLogoUrl
  } catch (err) {
    console.error('[email] Failed to get logo URL:', err)
    return ''
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface SendConfirmationEmailArgs {
  to: string
  buyerName: string
  tierName: string
  quantity: number
  amountPaise: number
  razorpayOrderId: string
  razorpayPaymentId: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatINR(paise: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(paise / 100)
}

// ── HTML Template ─────────────────────────────────────────────────────────────
// Font: Montserrat from Google Fonts (= Proxima Nova equivalent used on the site)
// Layout: Dark card centered on a dark outer bg
function buildConfirmationHtml(args: SendConfirmationEmailArgs, logoUrl: string): string {
  const { buyerName, tierName, quantity, amountPaise, razorpayOrderId, razorpayPaymentId } = args
  const total = formatINR(amountPaise)
  const supportEmail = process.env.SMTP_USER || 'support@boombap.in'

  const font = `'Sarpanch',-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Arial,sans-serif`

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>Booking Confirmed — SAB6 Show</title>
  <link href="https://fonts.googleapis.com/css2?family=Sarpanch:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <style type="text/css">
    :root { color-scheme: dark; }
    body, html { margin: 0 !important; padding: 0 !important; }
    * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
    table { border-collapse: collapse !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }

    /* Gmail dark bg selectors */
    body,
    #MessageViewBody,
    #MessageWebViewDiv,
    .ii.gt div,
    .a3s.aiL { 
      background-color: #0a0a0a !important; 
      background-image: linear-gradient(#0a0a0a,#0a0a0a) !important;
    }
    div[style*="margin: 16px 0"]  { margin: 0 !important; }
    div[style*="margin: 16px 0px"] { margin: 0 !important; }

    @media (prefers-color-scheme: dark) {
      body, .outer-bg { 
        background-color: #0a0a0a !important; 
        background-image: linear-gradient(#0a0a0a,#0a0a0a) !important;
      }
      .card-bg { 
        background-color: #111111 !important; 
        background-image: linear-gradient(#111111,#111111) !important;
      }
    }
  </style>
</head>
<body id="body" bgcolor="#0a0a0a" style="margin:0;padding:0;background-color:#0a0a0a;background-image:linear-gradient(#0a0a0a,#0a0a0a);width:100% !important;">
<div style="background-color:#0a0a0a;background-image:linear-gradient(#0a0a0a,#0a0a0a);margin:0;padding:0;">
<table class="outer-bg" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0a0a0a" style="background-color:#0a0a0a;background-image:linear-gradient(#0a0a0a,#0a0a0a);">
  <tr>
    <td class="outer-bg" bgcolor="#0a0a0a" align="center" style="background-color:#0a0a0a;background-image:linear-gradient(#0a0a0a,#0a0a0a);padding:40px 16px 48px;">

      <!-- ── CARD ── -->
      <table class="card-bg" role="presentation" width="480" cellpadding="0" cellspacing="0" border="0"
             style="max-width:480px;width:100%;background-color:#111111;background-image:linear-gradient(#111111,#111111);border-radius:16px;border:1px solid #222222;overflow:hidden;">

        <!-- Card header band -->
        <tr>
          <td class="card-bg" bgcolor="#111111" align="center"
              style="background-color:#111111;background-image:linear-gradient(#111111,#111111);padding:32px 32px 24px;border-bottom:1px solid #1e1e1e;">

            <!-- Logo -->
            <div style="margin-bottom:4px;">
              ${logoUrl
                ? `<img src="${logoUrl}" alt="SAB6" width="180" style="display:inline-block;border:0;height:auto;width:180px;" />`
                : `<span style="font-size:22px;font-weight:800;letter-spacing:3px;color:#DE1818;font-family:${font};">SAB6</span>`
              }
            </div>

            <!-- Event label -->
            <div style="font-family:${font};font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#555555;margin-bottom:4px;">
              SAB6 Show
            </div>
            <div style="font-family:${font};font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#DE1818;">
              Booking Confirmed
            </div>
          </td>
        </tr>

        <!-- Card body -->
        <tr>
          <td class="card-bg" bgcolor="#111111" style="background-color:#111111;background-image:linear-gradient(#111111,#111111);padding:28px 32px 8px;">

            <!-- Greeting -->
            <p style="font-family:${font};font-size:14px;font-weight:500;color:#999999;margin:0 0 24px;letter-spacing:0.3px;">
              Hey <strong style="color:#e0e0e0;font-weight:600;">${buyerName}</strong>, your spot is locked in.
            </p>

            <!-- Ticket row -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:0;">
              <tr>
                <td style="font-family:${font};font-size:13px;font-weight:600;color:#cccccc;letter-spacing:0.5px;padding-bottom:8px;">
                  ${tierName}
                </td>
                <td align="right" style="font-family:${font};font-size:13px;font-weight:500;color:#888888;padding-bottom:8px;">
                  &times;&thinsp;${quantity}
                </td>
              </tr>
            </table>

            <!-- Divider -->
            <div style="border-top:1px solid #222222;margin-bottom:10px;"></div>

            <!-- Total -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
              <tr>
                <td style="font-family:${font};font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#555555;">Total Paid</td>
                <td align="right" style="font-family:${font};font-size:20px;font-weight:800;color:#A0EF46;letter-spacing:-0.5px;">${total}</td>
              </tr>
            </table>

            <!-- Divider -->
            <div style="border-top:1px solid #1a1a1a;margin-bottom:20px;"></div>

            <!-- Payment ref block -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="background-color:#0d0d0d;background-image:linear-gradient(#0d0d0d,#0d0d0d);border-radius:8px;border:1px solid #1e1e1e;margin-bottom:24px;">
              <tr>
                <td bgcolor="#0d0d0d" style="background-color:#0d0d0d;background-image:linear-gradient(#0d0d0d,#0d0d0d);padding:14px 16px;">
                  <div style="font-family:${font};font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#444444;margin-bottom:8px;">Payment Reference</div>
                  <div style="font-family:monospace;font-size:11px;color:#555555;margin-bottom:4px;">${razorpayPaymentId}</div>
                  <div style="font-family:monospace;font-size:11px;color:#444444;">${razorpayOrderId}</div>
                </td>
              </tr>
            </table>

            <!-- Venue block -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="background-color:#0d0d0d;background-image:linear-gradient(#0d0d0d,#0d0d0d);border-radius:8px;border:1px solid #1e1e1e;margin-bottom:28px;">
              <tr>
                <td bgcolor="#0d0d0d" style="background-color:#0d0d0d;background-image:linear-gradient(#0d0d0d,#0d0d0d);padding:14px 16px;">
                  <div style="font-family:${font};font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#A0EF46;margin-bottom:8px;">Venue</div>
                  <div style="font-family:${font};font-size:13px;font-weight:600;color:#cccccc;margin-bottom:3px;">TBA &mdash; Chennai</div>
                  <div style="font-family:${font};font-size:11px;color:#555555;">Address will be announced soon.</div>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Card footer -->
        <tr>
          <td bgcolor="#0d0d0d" align="center"
              style="background-color:#0d0d0d;background-image:linear-gradient(#0d0d0d,#0d0d0d);padding:16px 32px;border-top:1px solid #1a1a1a;">
            <span style="font-family:${font};font-size:10px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:#444444;">
              Bring a valid ID to the venue &nbsp;&middot;&nbsp;
              <a href="mailto:${supportEmail}" style="color:#555555;text-decoration:none;">${supportEmail}</a>
            </span>
          </td>
        </tr>

      </table>
      <!-- ── END CARD ── -->

    </td>
  </tr>
</table>
</div>
</body>
</html>`
}

// ── Public API ─────────────────────────────────────────────────────────────────
export async function sendOrderConfirmationEmail(
  args: SendConfirmationEmailArgs
): Promise<boolean> {
  try {
    const logoUrl = await getLogoUrl()
    const html    = buildConfirmationHtml(args, logoUrl)

    await transporter.sendMail({
      from: `"SAB6" <${process.env.SMTP_USER}>`,
      to: args.to,
      subject: `Booking Confirmed — SAB6 Show | ${args.quantity}x ${args.tierName}`,
      html,
    })

    console.log(`[email] Confirmation sent to ${args.to}`)
    return true
  } catch (err) {
    console.error('[email] Failed to send confirmation:', err)
    return false
  }
}
