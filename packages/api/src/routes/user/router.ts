import { TRPCError } from "@trpc/server";

import { signInSchema } from "@millennicare/validators";

import { signOut } from "../../auth/user";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import { signIn } from "./services";

export const authRouter = createTRPCRouter({
  signIn: publicProcedure.input(signInSchema).mutation(signIn),
  // register
  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.sessionId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be signed in to sign out",
      });
    }
    return await signOut(ctx.sessionId);
  }),
});
