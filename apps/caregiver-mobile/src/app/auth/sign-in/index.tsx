import type { SubmitHandler } from "react-hook-form";
import type { z } from "zod";
import { useState } from "react";
import { SafeAreaView } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { signInSchema } from "@millennicare/validators";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { setToken } from "~/lib/api/session-store";
import { api } from "~/lib/api/trpc";

type IFormInputs = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [errorMsg, setErrorMsg] = useState("");
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: zodResolver(signInSchema),
  });
  const { mutateAsync } = api.auth.login.useMutation();

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    try {
      const response = await mutateAsync(data);
      setToken(response.session.id);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
        return;
      }
      setErrorMsg("Something went wrong, please try again later.");
    }
  };

  return (
    <SafeAreaView className="flex h-1/2 w-full flex-col items-center justify-center gap-y-3">
      <Controller
        control={control}
        name="email"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Email Address"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            className="w-full"
          />
        )}
      />
      {errors.email && (
        <Text className="text-error w-full text-red-500">
          Email is required.
        </Text>
      )}

      <Controller
        control={control}
        name="password"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            className="w-full"
            secureTextEntry={true}
          />
        )}
      />
      {errors.password && (
        <Text className="w-full text-left text-red-500">
          Password is required.
        </Text>
      )}
      <Button className="w-full" onPress={handleSubmit(onSubmit)}>
        <Text className="text-white">Sign In</Text>
      </Button>

      {!!errorMsg && (
        <Text className="w-full text-center text-red-500">{errorMsg}</Text>
      )}
    </SafeAreaView>
  );
}
