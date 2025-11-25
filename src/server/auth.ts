import { cookies } from "next/headers";
import { type NextRequest } from "next/server";
import { db } from "~/server/db";

export interface Session {
  userId: string;
  email: string;
}

export async function getSessionFromRequest(
  req: NextRequest,
): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await db.session.findUnique({
    where: { token: sessionToken },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return {
    userId: session.userId,
    email: session.user.email,
  };
}

export async function createSession(userId: string): Promise<string> {
  const { getSessionToken } = await import("~/lib/utils");
  const token = getSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await db.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  return token;
}

export async function deleteSession(token: string): Promise<void> {
  await db.session.deleteMany({
    where: { token },
  });
}
