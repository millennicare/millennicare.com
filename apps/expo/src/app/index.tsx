import type { ImageSourcePropType } from "react-native";
import { ImageBackground, Text, View } from "react-native";
import { router, Stack } from "expo-router";

import { Button } from "~/components/ui/Button";

export default function Index() {
  return (
    <View className="flex flex-1">
      <ImageBackground
        source={require("&/welcome_background.png") as ImageSourcePropType}
        resizeMode="cover"
        className="h-full flex-col justify-between pt-20 "
      >
        {/* Changes page title visible on the header */}
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="self-start pl-10 text-[40px] font-light text-white">
          MILLENNI<Text className="font-bold">CARE</Text>
        </Text>
        <View className="flex flex-col justify-center gap-y-4 px-9 py-9">
          <Text className="pb-3 text-[30px] font-light text-white">
            Modern Childcare for the New Millennium{" "}
          </Text>

          <Button
            label="Get Started"
            size="lg"
            className="rounded"
            labelClasses="text-white"
            onPress={() => router.push("/sign-up/")}
          />

          <Button
            label="Login"
            size="lg"
            className="rounded "
            labelClasses="text-white"
            onPress={() => router.push("/login/")}
          />
        </View>
      </ImageBackground>
    </View>
  );
}
