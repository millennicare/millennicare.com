import { StateCreator } from "zustand";

type ChildrenInfo = {
  children: {
    name: string;
    age: number;
  }[];
};

type ChildrenInfoSlice = {
  childrenInfo: ChildrenInfo;
  setChildrenInfo: (data: ChildrenInfo) => void;
};

const initialState = {
  children: [],
};

const createChildrenInfoSlice: StateCreator<ChildrenInfoSlice> = (set) => ({
  childrenInfo: initialState,
  setChildrenInfo: (data) =>
    set((state) => ({ childrenInfo: { ...state.childrenInfo, ...data } })),
});

export default createChildrenInfoSlice;
export type { ChildrenInfo, ChildrenInfoSlice };
