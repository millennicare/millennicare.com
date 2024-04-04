import type { ImageSourcePropType } from "react-native";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { Image } from "expo-image";

import LoginForm from "./form";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Login() {
  return (
    <SafeAreaView className="flex h-full w-full flex-1 items-center justify-center space-y-2 p-4">
      <Image
        style={styles.image}
        source={
          require("../../../../assets/millennicare_logo.png") as ImageSourcePropType
        }
        placeholder={blurhash}
        contentFit="contain"
      />
      <Text className="text-4xl">MillenniCare</Text>
      <LoginForm />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: "15%",
    width: "25%",
  },
});
