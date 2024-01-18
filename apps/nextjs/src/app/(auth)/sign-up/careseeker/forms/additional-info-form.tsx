"use client";

import { z } from "zod";

import { useForm } from "@millennicare/ui/form";
import {
  createAddressSchema,
  createUserSchema,
} from "@millennicare/validators";

// const formSchema = createAddressSchema.pick({ zipCode: true }).and(
//   createUserSchema.pick({
//     firstName: true,
//     lastName: true,
//     profilePicture: true,
//     birthdate: true,
//   }),
// );

const formSchema = createUserSchema
  .pick({
    firstName: true,
    lastName: true,
    profilePicture: true,
    birthdate: true,
    phoneNumber: true,
  })
  .and(
    z.object({
      address: createAddressSchema.pick({ zipCode: true }),
    }),
  );

export default function AdditionalInfoForm() {
  const form = useForm({
    schema: formSchema,
  });
}
