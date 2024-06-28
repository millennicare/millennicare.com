import { SafeAreaView } from "react-native-safe-area-context";
import { Slot } from "expo-router";

export default function HomeLayout() {
  return (
    <SafeAreaView className="h-screen w-screen">
      <Slot />
    </SafeAreaView>
  );
}
