import type { Lucia, User } from "lucia";

import type { DatabaseType } from "@millennicare/db";

export interface ApiContextProps {
  user?: User;
  sessionId?: string;
  db: DatabaseType;
  auth: Lucia;
}
