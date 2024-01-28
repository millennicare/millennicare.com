import { z } from "zod";
import { StateCreator } from "zustand";

import { createCareseekerSchema } from "@millennicare/validators";

export const childrenSchema = createCareseekerSchema.pick({ children: true });

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
