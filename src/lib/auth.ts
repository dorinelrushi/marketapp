import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment.");
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function signToken(userId: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { sub: string };
}

export function getTokenFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  const [type, token] = authHeader.split(" ");
  if (type === "Bearer" && token) {
    return token;
  }
  return null;
}
