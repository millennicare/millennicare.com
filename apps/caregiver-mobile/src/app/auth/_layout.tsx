import type { ImageSourcePropType } from "react-native";
import { SafeAreaView, Text, View } from "react-native";
import { Image } from "expo-image";
import { Slot } from "expo-router";

export default function AuthLayout() {
  return (
    <SafeAreaView className="h-screen w-screen">
      <View className="flex h-full w-full items-center justify-center p-6">
        <Image
          source={
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            require("../../../assets/millennicare_logo.png") as ImageSourcePropType
          }
          style={{ width: 72, height: 72 }}
        />
        <View className="mt-6 w-full">
          <Text className="text-center text-3xl font-semibold">
            MillenniCare
          </Text>
          <Slot />
        </View>
      </View>
    </SafeAreaView>
  );
}
