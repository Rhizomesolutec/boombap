import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const JWT_COOKIE = "bb_admin_token";
const JWT_EXPIRY = "8h"; // 8-hour sessions

export { JWT_COOKIE };

export interface AdminPayload extends JWTPayload {
  username: string;
  role: "admin";
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

/** Sign a new JWT for an authenticated admin */
export async function signAdminToken(username: string): Promise<string> {
  return new SignJWT({ username, role: "admin" } satisfies Omit<AdminPayload, keyof JWTPayload>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .setIssuer("boombap-admin")
    .setAudience("boombap-admin")
    .sign(getSecret());
}

/** Verify and decode a JWT. Returns null if invalid / expired. */
export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify<AdminPayload>(token, getSecret(), {
      issuer: "boombap-admin",
      audience: "boombap-admin",
    });
    return payload;
  } catch {
    return null;
  }
}
