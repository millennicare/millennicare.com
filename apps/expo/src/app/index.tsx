import { SafeAreaView, Text, View } from "react-native";
import { Stack } from "expo-router";

export default function Index() {
  return (
    <SafeAreaView className="bg-[#1F104A]">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="h-full w-full p-4">
        <Text className="pb-2 text-center text-5xl font-bold text-white">
          Home Page
        </Text>
      </View>
    </SafeAreaView>
  );
}
