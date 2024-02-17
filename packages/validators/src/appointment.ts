import { z } from "zod";

const statusEnum = z.enum(["cancelled", "pending", "confirmed", "finished"]);

export const createAppointmentSchema = z.object({
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  status: statusEnum,
  serviceId: z.string().cuid2(),
  careseekerId: z.string().cuid2(),
  caregiverId: z.string().cuid2(),
});

export const selectAppointmentSchema = createAppointmentSchema.extend({
  id: z.string().cuid2(),
});

export type Appointment = z.infer<typeof selectAppointmentSchema>;
