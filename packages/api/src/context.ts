import type { DatabaseType } from "@millennicare/db";
import type { Lucia, User } from "lucia";

export interface ApiContextProps {
  user?: User;
  sessionId?: string;
  db: DatabaseType;
  auth: Lucia;
}
