import type { ImageSourcePropType } from "react-native";
import { ImageBackground, View } from "react-native";
import { Link, Stack } from "expo-router";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function Index() {
  return (
    <View className="flex flex-1">
      <ImageBackground
        source={
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          require("../../assets/welcome_background.png") as ImageSourcePropType
        }
        resizeMode="cover"
        className="h-full flex-col justify-between pt-20"
      >
        <Stack.Screen options={{ headerShown: false }} />
        <View className="gap-y-2 pl-10">
          <Text className="self-start text-5xl font-light text-white">
            MILLENNI<Text className="text-5xl font-bold text-white">CARE</Text>
          </Text>
          <Text className="text-xl font-semibold">For Caregivers</Text>
        </View>
        <View className="flex flex-col justify-center gap-y-4 px-9 py-9">
          <Text className="pb-3 text-[30px] font-light text-white">
            Modern Childcare for the New Millennium
          </Text>

          <Button size="lg">
            <Text className="text-white">Get Started</Text>
          </Button>

          <Link asChild href="/auth/sign-in/">
            <Button size="lg" className="bg-white">
              <Text>Sign In</Text>
            </Button>
          </Link>
        </View>
      </ImageBackground>
    </View>
  );
}
