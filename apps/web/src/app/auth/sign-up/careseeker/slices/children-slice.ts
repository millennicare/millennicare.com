import type { StateCreator } from "zustand";
import { z } from "zod";

import { createChildSchema } from "@millennicare/validators";

export const childrenSchema = z.object({
  children: z
    .array(createChildSchema.pick({ name: true, age: true }))
    .min(1, { message: "At least one child is required." }),
});

type Children = z.infer<typeof childrenSchema>;

interface ChildrenSlice {
  children: Children;
  setChildren: (data: Children) => void;
}

const initialState: Children = { children: [] };

export const createChildrenInfoSlice: StateCreator<ChildrenSlice> = (set) => ({
  children: initialState,
  setChildren: (data) => set({ children: data }),
});

export default createChildrenInfoSlice;
export type { Children, ChildrenSlice };
