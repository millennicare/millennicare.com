import type { SubmitHandler } from "react-hook-form";
import type { z } from "zod";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { signUpSchema } from "@millennicare/validators";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { setToken } from "~/lib/api/session-store";
import { api } from "~/lib/api/trpc";

// const milleniCareImage = require("&/millennicare_logo_with_text.png");

type IFormInputs = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [errorMsg, setErrorMsg] = useState("");
  const { mutateAsync } = api.auth.register.useMutation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    try {
      const response = await mutateAsync({
        email: data.email,
        password: data.password,
        type: "caregiver",
      });
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex h-full w-full flex-col items-center justify-center gap-y-3 bg-background"
    >
      <Image
        // only doing this to import the logo in to use
        // tried importing without using the require function however I could not
        // only disabling for importing images
        // eslint-disable-next-line
        source={require("&/millennicare_logo_with_text.png")}
        className="mb-4"
      />
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
            className="w-11/12"
          />
        )}
      />
      {errors.email && (
        <Text className="text-error w-full text-red-500">
          {errors.email.message}
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
            className="w-11/12"
            secureTextEntry={true}
          />
        )}
      />
      {errors.password && (
        <Text className="w-full text-left text-red-500">
          {errors.password.message}
        </Text>
      )}

      <Controller
        control={control}
        name="confirm"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Confirm password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            className="w-11/12"
            secureTextEntry={true}
          />
        )}
      />
      {errors.confirm && (
        <Text className="w-full text-left text-red-500">
          {errors.confirm.message}
        </Text>
      )}

      <Button className="w-11/12" onPress={handleSubmit(onSubmit)}>
        <Text className="text-white">Sign Up</Text>
      </Button>
      {errorMsg && (
        <Text className="w-full text-center text-red-500">{errorMsg}</Text>
      )}
    </KeyboardAvoidingView>
  );
}
