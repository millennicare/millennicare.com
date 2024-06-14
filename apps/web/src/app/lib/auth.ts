import type { Session, User } from "lucia";
import { cache } from "react";
import { cookies } from "next/headers";

import { api } from "~/trpc/server";

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get("millennicare-session")?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const user = await api.auth.getSession();
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session?.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {
      /* empty */
    }
    return result;
  },
);
