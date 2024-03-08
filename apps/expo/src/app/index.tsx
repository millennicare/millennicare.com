import {  Text, View, ImageBackground } from "react-native";
import { Stack } from "expo-router";
import { Button } from "~/components/ui/Button";


export default function Index() {
  return (
    <View className="flex flex-1">
      <ImageBackground source={require("../../assets/welcome_background.png")} resizeMode="cover" className="justify-between flex-col h-full py-20 ">
      
        {/* Changes page title visible on the header */}
  
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-white self-start pl-10 text-[40px] font-light">MILLENNI<Text className="font-bold">CARE</Text></Text>
        <View className="flex flex-col gap-y-4 justify-center px-9">
          <Text className="text-white text-[30px] font-light">Modern Childcare for the New Millennium </Text>

          <Button label="Get Started" size="lg" className="rounded" labelClasses="text-white"/>
          <Button label="Login" size="lg" className="rounded " labelClasses="text-white"/>
        </View>
      </ImageBackground>
  </View>
  );
}
