import type { SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { setToken } from "~/lib/api/session-store";
import { api } from "~/lib/api/trpc";

const CodeSchema = z.object({
  code: z
    .string({ required_error: "Code is required" })
    .min(1, "Code is required"),
});

type IFormInputs = z.infer<typeof CodeSchema>;

export default function VerifyCode() {
  const [errorMsg, setErrorMsg] = useState("");

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: zodResolver(CodeSchema),
  });

  const { mutateAsync, isPending } = api.auth.verifyCode.useMutation();

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    try {
      const response = await mutateAsync({ code: data.code });
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
    <View>
      <Controller
        control={control}
        name="code"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Code"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Button
        className="w-full"
        onPress={handleSubmit(onSubmit)}
        disabled={isPending || errors.code !== undefined}
      />
      {errorMsg && (
        <Text className="w-full text-center text-red-500">{errorMsg}</Text>
      )}
    </View>
  );
}
