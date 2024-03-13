import type { ImageSourcePropType } from "react-native";
import { ImageBackground, Text, View } from "react-native";
import { Stack } from "expo-router";

import { Button } from "~/components/ui/Button";

export default function Index() {
  return (
    <View className="flex flex-1">
      {/* Put a bandaid solution on there for the time being. 

When first lint error "require has 'any' type" is fixed by giving it a type (ImageSourcePropType) it give another lint error "require statement not part of import statement". 

Trying to import the image also does not seem to work as the image isn't found. 

Using the ESLint disable comment for now. 

https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-var-requires.md */}

      <ImageBackground
        source={
          require("../../assets/welcome_background.png") as ImageSourcePropType
        }
        resizeMode="cover"
        className="h-full flex-col justify-between py-20 "
      >
        {/* Changes page title visible on the header */}

        <Stack.Screen options={{ headerShown: false }} />
        <Text className="self-start pl-10 text-[40px] font-light text-white">
          MILLENNI<Text className="font-bold">CARE</Text>
        </Text>
        <View className="flex flex-col justify-center gap-y-4 px-9">
          <Text className="text-[30px] font-light text-white">
            Modern Childcare for the New Millennium{" "}
          </Text>

          <Button
            label="Get Started"
            size="lg"
            className="rounded"
            labelClasses="text-white"
          />
          <Button
            label="Login"
            size="lg"
            className="rounded "
            labelClasses="text-white"
          />
        </View>
      </ImageBackground>
    </View>
  );
}
