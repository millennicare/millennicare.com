import type { StateCreator } from "zustand";
import { z } from "zod";

import { createChildSchema } from "@millennicare/validators";

export const childrenSchema = z.array(createChildSchema.omit({ userId: true }));

type Children = z.infer<typeof childrenSchema>;

type ChildrenSlice = {
  children: Children;
  setChildren: (data: Children) => void;
};

const initialState: Children = [];

export const createChildrenInfoSlice: StateCreator<ChildrenSlice> = (set) => ({
  children: initialState,
  setChildren: (data) => set({ children: data }),
});

export default createChildrenInfoSlice;
export type { Children, ChildrenSlice };
