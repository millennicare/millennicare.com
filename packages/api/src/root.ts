import { appointmentRouter } from "./router/appointment.router";
import { authRouter } from "./router/auth.router";
import { caregiverRouter } from "./router/caregiver.router";
import { careseekerRouter } from "./router/careseeker.router";
import { contactUsRouter } from "./router/contact-us.router";
import { router } from "./trpc";

export const appRouter = router({
  auth: authRouter,
  caregiver: caregiverRouter,
  careseeker: careseekerRouter,
  contactUs: contactUsRouter,
  appointment: appointmentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
