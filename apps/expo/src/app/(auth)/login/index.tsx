import { Image, Text, View } from "react-native";
import { Stack } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";

import { Button } from "~/components/ui/Button";
import { Card, CardContent } from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";

export default function SignInPage() {
  const headerHeight = useHeaderHeight();
  return (
    <View
      className={`flex w-full flex-col items-center pt-[${headerHeight}px]`}
    >
      <Stack.Screen options={{ headerTransparent: true }} />
      <Image source={require("&/millennicare_logo.png")} />
      <Text className="pb-5 text-[25px] font-light">Welcome Back</Text>
      <Card className="w-3/4 py-4">
        <CardContent>
          <Input placeholder="Email" />
        </CardContent>
        <CardContent>
          <Input placeholder="Password" />
        </CardContent>
        <CardContent>
          <Button label="Sign In" labelClasses="text-white" />
        </CardContent>
      </Card>
    </View>
  );
}
