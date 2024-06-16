import * as SecureStore from "expo-secure-store";

import { lucia } from "@millennicare/auth";

export async function createSession(sessionId: string) {
  await SecureStore.setItemAsync("session-id", sessionId);
}

export async function validateRequest() {
  const sessionId = await SecureStore.getItemAsync("session-id");
  if (!sessionId) {
    return { user: null, session: null };
  }

  const result = await lucia.validateSession(sessionId);
  try {
    if (result.session?.fresh) {
      await SecureStore.setItemAsync("session-id", result.session.id);
    }

    if (!result.session) {
      await SecureStore.deleteItemAsync("session-id");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error setting session");
  }
}
