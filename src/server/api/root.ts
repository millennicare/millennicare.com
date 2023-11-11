import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user.router";
import { appointmentRouter } from "./routers/appointment.router";
import { serviceRouter } from "./routers/service.router";
import { caregiverRouter } from "./routers/caregiver.router";

export const appRouter = createTRPCRouter({
  user: userRouter,
  appointment: appointmentRouter,
  service: serviceRouter,
  caregiver: caregiverRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
