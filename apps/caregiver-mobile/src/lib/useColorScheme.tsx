import { useColorScheme as useNativewindColorScheme } from "nativewind";

export function useColorScheme() {
  const colorSchemeObject = useNativewindColorScheme();

  return {
    colorScheme: colorSchemeObject.colorScheme ?? "dark",
    isDarkColorScheme: colorSchemeObject.colorScheme === "dark",
    setColorScheme: colorSchemeObject.setColorScheme,
    toggleColorScheme: colorSchemeObject.toggleColorScheme,
  };
}
