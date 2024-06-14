import { appointmentRouter } from "./router/appointment.router";
import { caregiverRouter } from "./router/caregiver.router";
import { careseekerRouter } from "./router/careseeker.router";
import { childRouter } from "./router/child.router";
import { contactUsRouter } from "./router/contact-us.router";
import { serviceRouter } from "./router/service.router";
import { userRouter } from "./router/user.router";
import { waitlistRouter } from "./router/waitlist.router";
import { authRouter } from "./routes/auth";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  caregiver: caregiverRouter,
  careseeker: careseekerRouter,
  contactUs: contactUsRouter,
  appointment: appointmentRouter,
  service: serviceRouter,
  children: childRouter,
  user: userRouter,
  waitlist: waitlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
