import type { z } from "zod";

import type { createContactSchema } from "@millennicare/validators";

export type CreateContactType = z.infer<typeof createContactSchema>;
