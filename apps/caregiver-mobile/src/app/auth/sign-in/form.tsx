import { Text, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { useToast } from "~/components/toast";
import { api } from "~/lib/api";
import { createSession } from "~/lib/auth";

const schema = z.object({
  email: z.string().email().min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function SignInForm() {
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { mutateAsync } = api.auth.login.useMutation();

  async function onSubmit(data: z.infer<typeof schema>) {
    try {
      const { session } = await mutateAsync(data);
      console.log(session);
      await createSession(session.id);
      toast("Signed in successfully", "success", 4000, "bottom", false);
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast(error.message, "destructive", 4000, "bottom", false);
        return;
      }
      toast("An error occurred", "destructive", 4000, "bottom", false);
    }
  }

  return (
    <View className="flex w-full items-center justify-center gap-y-4 p-6">
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <Input
            className="w-full"
            label="Email address"
            onChangeText={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />
      {errors.email && <Text className="text">{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <Input
            className="w-full"
            label="Password"
            secureTextEntry={true}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />
      {errors.password && (
        <Text className="text">{errors.password.message}</Text>
      )}

      <Button
        label="Sign in"
        onPress={handleSubmit(onSubmit)}
        className="w-full"
        labelClasses="text-white"
      />
    </View>
  );
}
