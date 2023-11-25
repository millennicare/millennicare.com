import { userRouter } from "./router/user.router";
import { router } from "./trpc";

export const appRouter = router({
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
