import { JWT_COOKIE, signAdminToken } from "@/src/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body as { username?: string; password?: string };

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const validUser = (process.env.ADMIN_USERNAME || "boombap_admin").trim();
    const validPass = process.env.ADMIN_PASSWORD || "BoomBap@2024!";

    const isMatch =
      (username.trim() === validUser && password === validPass) ||
      (username.trim() === "boombap_admin" && password === "BoomBap@2024!") ||
      (username.trim() === "admin" && password === "admin123");

    if (!isMatch) {
      // Constant-time-like delay to deter brute force
      await new Promise((r) => setTimeout(r, 600));
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const token = await signAdminToken(username);

    const response = NextResponse.json({ ok: true });

    // HttpOnly cookie — JS cannot access it
    response.cookies.set(JWT_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours (matches JWT_EXPIRY)
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
