import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user.router";
import { appointmentRouter } from "./routers/appointment.router";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  appointment: appointmentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
