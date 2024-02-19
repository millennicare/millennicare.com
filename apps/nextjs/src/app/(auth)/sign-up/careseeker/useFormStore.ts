import { create } from "zustand";

import type { AdditionalInfoSlice } from "./slices/additional-info-slice";
import type { AddressSlice } from "./slices/address-slice";
import type { ChildrenSlice } from "./slices/children-slice";
import type { EmailSlice } from "./slices/email-slice";
import type { PasswordSlice } from "./slices/password-slice";
import type { StepSlice } from "./slices/step-slice";
import {
  createAdditionalInfoSlice,
  createAddressInfoSlice,
  createChildrenInfoSlice,
  createEmailInfoSlice,
  createPasswordInfoSlice,
  createStepSlice,
} from "./slices";

const useFormStore = create<
  StepSlice &
    AdditionalInfoSlice &
    EmailSlice &
    PasswordSlice &
    AddressSlice &
    ChildrenSlice
>()((...a) => ({
  ...createStepSlice(...a),
  ...createAdditionalInfoSlice(...a),
  ...createEmailInfoSlice(...a),
  ...createPasswordInfoSlice(...a),
  ...createAddressInfoSlice(...a),
  ...createChildrenInfoSlice(...a),
}));

export default useFormStore;
