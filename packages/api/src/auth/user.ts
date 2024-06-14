import { db, eq, schema } from "@millennicare/db";

import { lucia } from ".";

export async function getUserByEmail(email: string) {
  return await db.query.userTable.findFirst({
    where: eq(schema.userTable.email, email),
  });
}

export async function signOut(sessionId: string) {
  await lucia.invalidateSession(sessionId);
  return { success: true };
}
