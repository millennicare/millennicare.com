import type { StateCreator } from "zustand";
import { z } from "zod";

import { createCareseekerSchema } from "@millennicare/validators";

// export const childrenSchema = createCareseekerSchema.pick({ children: true });
export const childrenSchema = z.object({
  children: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Name is required" }),
        age: z.coerce
          .number()
          .min(0, { message: "Age must be between 0 and 18" })
          .max(18, { message: "Age must be between 0 and 18." })
          .int(),
      }),
    )
    .min(1, { message: "At least one child is required to sign up." }),
});

type ChildrenInfo = z.infer<typeof childrenSchema>;

type ChildrenInfoSlice = {
  childrenInfo: ChildrenInfo;
  setChildrenInfo: (data: ChildrenInfo) => void;
};

const initialState: ChildrenInfo = {
  children: [],
};

const createChildrenInfoSlice: StateCreator<ChildrenInfoSlice> = (set) => ({
  childrenInfo: initialState,
  setChildrenInfo: (data) =>
    set((state) => ({ childrenInfo: { ...state.childrenInfo, ...data } })),
});

export default createChildrenInfoSlice;
export type { ChildrenInfo, ChildrenInfoSlice };
