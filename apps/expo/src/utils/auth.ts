import * as SecureStore from "expo-secure-store";
import { lucia } from "@millennicare/auth";

/**
 * instead of saving a session inside cookies, store the session ID in expo secure store
 */
export const createSession = async (userId: string, email: string) => {
  const session = await lucia.createSession(userId, { email });
  await saveItem("session-id", session.id);
};

export const validateRequest = async () => {
  const sessionId = await SecureStore.getItemAsync("session-id");

  if (!sessionId) {
    return { user: null, session: null };
  }

  const result = await lucia.validateSession(sessionId);

  try {
    // session is still  "fresh" which means that expiration has been extended
    // and we can create a new session token
    if (result.session?.fresh) {
      await saveItem("session-id", result.session.id);
    }

    // session is invalid, so delete session-id
    if (!result.session) {
      await SecureStore.deleteItemAsync("session-id");
    }
  } catch (error) {
    throw new Error("Error setting session cookie");
  }

  return result;
};

export const logout = async () => {
  const { session } = await validateRequest();
  if (!session) {
    return { error: "Unauthorized" };
  }
  await lucia.invalidateSession(session.id);
};

const saveItem = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};
