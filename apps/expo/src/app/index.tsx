import { Image, SafeAreaView, Text, View } from "react-native";
import { Stack } from "expo-router";
import { Button } from "@/ui/Button";
import { Switch } from "@/ui/Switch";

export default function Index() {
  return (
    <SafeAreaView>
      <View>
        {/* Changes page title visible on the header */}
        <View style={{ backgroundColor: "#8a4040" }}>
          <Text>Hi</Text>
        </View>
        <Stack.Screen options={{ title: "Home Page" }} />
        <Image
          src={require("../../public/millennicare_logo.png")}
          className="h-10 w-10"
        />
        <Button label="Login" />
        <Button label="Sign Up" variant="default" />
      </View>
    </SafeAreaView>
  );
}
