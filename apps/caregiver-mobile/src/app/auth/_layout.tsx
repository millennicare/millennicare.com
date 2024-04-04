import { Image } from "expo-image";
import { Slot } from "expo-router";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function AuthLayout() {
  return (
    <>
      <Image
        alt="Millennicare Logo"
        source={require("../../../assets/millennicare_logo.png") as string}
        placeholder={blurhash}
        contentFit="cover"
        transition={1000}
        className="w-full"
      />
      <Slot
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
}
