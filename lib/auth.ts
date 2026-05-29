import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const getSecret = () =>
  new TextEncoder().encode(
    process.env.ADMIN_JWT_SECRET ?? "dev-secret-change-in-production-min-32-chars"
  );

export async function signToken(payload: {
  userId: number;
  email: string;
  role: string;
}) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(getSecret());
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as { userId: number; email: string; role: string };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
