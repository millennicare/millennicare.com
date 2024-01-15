import { create } from "zustand";

import {
  createAdditionalInfoSlice,
  createChildrenInfoSlice,
  createPersonalInfoSlice,
  createStepSlice,
} from "./slices";
import { AdditionalInfoSlice } from "./slices/additional-info-slice";
import { ChildrenInfoSlice } from "./slices/children-slice";
import { PersonalInfoSlice } from "./slices/personal-info-slice";
import { StepSlice } from "./slices/step-slice";

const useFormStore = create<
  PersonalInfoSlice & StepSlice & AdditionalInfoSlice & ChildrenInfoSlice
>()((...a) => ({
  ...createPersonalInfoSlice(...a),
  ...createStepSlice(...a),
  ...createAdditionalInfoSlice(...a),
  ...createChildrenInfoSlice(...a),
}));

export default useFormStore;
