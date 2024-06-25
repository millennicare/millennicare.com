import type { SubmitHandler } from "react-hook-form";
import type { z } from "zod";
import { useState } from "react";
import { View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Controller, useForm } from "react-hook-form";

import { signUpSchema } from "@millennicare/validators";

import { Label } from "~/components/primitives/select";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Text } from "~/components/ui/text";
import { setToken } from "~/lib/api/session-store";
import { api } from "~/lib/api/trpc";

type IFormInputs = z.infer<typeof signUpSchema>;

/**
 * takes first name, last name, phone number, email, dob, and gender
 */
export default function SignUp() {
  const [errorMsg, setErrorMsg] = useState("");
  const [gender, setGender] = useState("");
  const { mutateAsync } = api.auth.register.useMutation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      birthdate: new Date(),
    },
  });

  function onLabelPress(label: string) {
    return () => {
      setGender(label);
    };
  }

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    console.log(data);
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
        name="birthdate"
        render={({ field: { onChange, value } }) => (
          <DateTimePicker
            mode="date"
            value={value}
            className="w-full"
            onChange={onChange}
          />
        )}
      />

      <RadioGroup value={gender} onValueChange={setGender} className="gap-3">
        <RadioGroupItemWithLabel
          value="Male"
          onLabelPress={onLabelPress("male")}
        />
        <RadioGroupItemWithLabel
          value="Female"
          onLabelPress={onLabelPress("female")}
        />
        <RadioGroupItemWithLabel
          value="Non-binary"
          onLabelPress={onLabelPress("non-binary")}
        />
      </RadioGroup>

      <Button className="w-full" onPress={handleSubmit(onSubmit)}>
        <Text className="text-white">Join now</Text>
      </Button>
      {errorMsg && (
        <Text className="w-full text-center text-red-500">{errorMsg}</Text>
      )}
    </View>
  );
}

function RadioGroupItemWithLabel({
  value,
  onLabelPress,
}: {
  value: string;
  onLabelPress: () => void;
}) {
  return (
    <View className={"flex-row items-center gap-2"}>
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
      <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
        {value}
      </Label>
    </View>
  );
}
