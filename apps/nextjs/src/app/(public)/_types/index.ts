import { z } from "zod";

import { createContactSchema } from "@millennicare/validators";

export type CreateContactType = z.infer<typeof createContactSchema>;
