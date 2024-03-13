import {  Text, View, ImageBackground } from "react-native";
import { Stack } from "expo-router";
import { Button } from "~/components/ui/Button";
import type {ImageSourcePropType} from "react-native";

export default function Index() {
 
  return (
    <View className="flex flex-1">
      {/* Put a bandaid solution on there for the time being. 

When first lint error "require has 'any' type" is fixed by giving it a type (ImageSourcePropType) it give another lint error "require statement not part of import statement". 

Trying to import the image also does not seem to work as the image isn't found. 

Using the ESLint disable comment for now. 

https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-var-requires.md */}
      {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
      <ImageBackground source={require("../../assets/welcome_background.png") as ImageSourcePropType} resizeMode="cover" className="justify-between flex-col h-full py-20 ">
      
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
