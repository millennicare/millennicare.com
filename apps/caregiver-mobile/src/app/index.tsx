import type { ImageSourcePropType } from "react-native";
import { ImageBackground, Platform, Text, View } from "react-native";
import { Link, Stack } from "expo-router";

import { Button } from "~/components/button";

export default function Index() {
  return (
    <View className="flex flex-1">
      <ImageBackground
        source={
          require("../../assets/welcome_background.png") as ImageSourcePropType
        }
        resizeMode="cover"
        className="h-full flex-col justify-between pt-20"
      >
        {/* Changes page title visible on the header */}

        <Stack.Screen options={{ headerShown: false }} />
        <View className="gap-y-2 pl-10">
          <Text className="self-start text-5xl font-light text-white">
            MILLENNI<Text className="text-5xl font-bold">CARE</Text>
          </Text>
          <Text className="text-xl font-semibold">For Caregivers</Text>
        </View>
        <View className="flex flex-col justify-center gap-y-4 px-9 py-9">
          <Text className="pb-3 text-[30px] font-light text-white">
            Modern Childcare for the New Millennium
          </Text>

          <Link asChild href="/auth/register/">
            <Button
              label="Get Started"
              size="lg"
              className="rounded"
              labelClasses="text-white"
            />
          </Link>
          <Link asChild href="/auth/login/">
            <Button label="Sign In" size="lg" className="rounded bg-white" />
          </Link>
        </View>
      </ImageBackground>
    </View>
  );
}
