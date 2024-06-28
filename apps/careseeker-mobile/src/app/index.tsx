import type { ImageSourcePropType } from "react-native";
import { ImageBackground, Text, View } from "react-native";
import { Link, Stack } from "expo-router";

import { Button } from "~/components/ui/button";

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
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          require("../../assets/welcome_background.png") as ImageSourcePropType
        }
        resizeMode="cover"
        className="h-full flex-col justify-between pt-20"
      >
        {/* Changes page title visible on the header */}

        <Stack.Screen options={{ headerShown: false }} />
        <Text className="self-start pl-10 text-[40px] font-light text-white">
          MILLENNI<Text className="font-bold">CARE</Text>
        </Text>
        <View className="flex flex-col justify-center gap-y-4 px-9 py-9">
          <Text className="pb-3 text-[30px] font-light text-white">
            Modern Childcare for the New Millennium{" "}
          </Text>

          <Link asChild href="/auth/sign-up">
            <Button size="lg">
              <Text className="text-white">Get Started</Text>
            </Button>
          </Link>

          <Link asChild href="auth/sign-in">
            <Button size="lg">
              <Text className="text-white">Login</Text>
            </Button>
          </Link>
        </View>
      </ImageBackground>
    </View>
  );
}
