import { create } from "zustand";

import type { AdditionalInfoSlice } from "./slices/additional-info-slice";
import type { ChildrenInfoSlice } from "./slices/children-slice";
import type { PersonalInfoSlice } from "./slices/personal-info-slice";
import type { StepSlice } from "./slices/step-slice";
import {
  createAdditionalInfoSlice,
  createChildrenInfoSlice,
  createPersonalInfoSlice,
  createStepSlice,
} from "./slices";

const useFormStore = create<
  PersonalInfoSlice & StepSlice & AdditionalInfoSlice & ChildrenInfoSlice
>()((...a) => ({
  ...createPersonalInfoSlice(...a),
  ...createStepSlice(...a),
  ...createAdditionalInfoSlice(...a),
  ...createChildrenInfoSlice(...a),
}));

export default useFormStore;
