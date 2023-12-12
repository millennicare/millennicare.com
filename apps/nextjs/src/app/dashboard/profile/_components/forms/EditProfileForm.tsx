"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import validator from "validator";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";

type Props = {
  careseeker: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    biography: string | null;
    birthdate: Date;
  };
};

const formSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z
    .string()
    .refine(validator.isMobilePhone, { message: "Enter Valid Phone Number" }),
  biography: z.string().nullish(),
  profilePicture: z.string().url(),
  birthdate: z.coerce.date(),
});

export default function EditProfileForm({ careseeker }: Props) {
  const { toast } = useToast();
  const utils = api.useUtils();
  const updateMutation = api.careseeker.update.useMutation({
    onSuccess() {
      utils.auth.getMe.invalidate();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: careseeker.firstName,
      lastName: careseeker.lastName,
      phoneNumber: careseeker.phoneNumber,
      biography: careseeker.biography,
    },
  });

  return (
    <div>
      <pre>{JSON.stringify(careseeker, null, 2)}</pre>
    </div>
  );
}
