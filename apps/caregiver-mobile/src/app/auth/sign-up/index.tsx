import type { SubmitHandler } from "react-hook-form";
import type { z } from "zod";
import { useState } from "react";
import { View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { signUpSchema } from "@millennicare/validators";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { setToken } from "~/lib/api/session-store";
import { api } from "~/lib/api/trpc";

type IFormInputs = z.infer<typeof signUpSchema>;

/**
 * takes first name, last name, phone number, email, dob, and gender
 */
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
        ...data,
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
    <View className="flex h-fit w-full flex-col items-center justify-center gap-y-3">
      <Controller
        control={control}
        name="firstName"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="First name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            className="w-full"
          />
        )}
      />
      {errors.firstName && (
        <Text className="text-error w-full text-red-500">
          {errors.firstName.message}
        </Text>
      )}
      <Controller
        control={control}
        name="lastName"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Last name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            className="w-full"
          />
        )}
      />
      {errors.lastName && (
        <Text className="text-error w-full text-red-500">
          {errors.lastName.message}
        </Text>
      )}
      <Controller
        control={control}
        name="phoneNumber"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Phone number"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            className="w-full"
            keyboardType="phone-pad"
          />
        )}
      />
      {errors.phoneNumber && (
        <Text className="text-error w-full text-red-500">
          {errors.phoneNumber.message}
        </Text>
      )}
      <Controller
        control={control}
        name="email"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            className="w-full"
            keyboardType="email-address"
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
            className="w-full"
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
            className="w-full"
            secureTextEntry={true}
          />
        )}
      />
      {errors.confirm && (
        <Text className="w-full text-left text-red-500">
          {errors.confirm.message}
        </Text>
      )}

      <Button className="w-full" onPress={handleSubmit(onSubmit)}>
        <Text className="text-white">Join now</Text>
      </Button>
      {errorMsg && (
        <Text className="w-full text-center text-red-500">{errorMsg}</Text>
      )}
    </View>
  );
}
