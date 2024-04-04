import { Text, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/button";
import { Input } from "~/components/input";

const createUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,32}$/, // eslint-disable-line
      {
        message:
          "Password must be minimum 8 characters and at least one uppercase letter, one lowercase letter, and one number.",
      },
    )
    .min(8, { message: "Password must be between 8 and 32 characters." })
    .max(32, { message: "Password must be between 8 and 32 characters." })
    .nullish(),
  type: z.enum(["caregiver", "careseeker", "admin"]),
});

export default function LoginForm() {
  const form = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      type: "caregiver",
    },
  });

  return (
    <View>
      <Text>Form</Text>
    </View>
  );
}
