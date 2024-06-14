import { cache } from "react";
import { headers } from "next/headers";

import { createCaller, createTRPCContext } from "@millennicare/api";

import { validateRequest } from "~/app/lib/auth";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");
  const { session } = await validateRequest();

  return createTRPCContext({
    sessionId: session?.id,
    headers: heads as Headers,
  });
});

export const api = createCaller(createContext);
