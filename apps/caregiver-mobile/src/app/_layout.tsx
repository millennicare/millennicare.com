import { StatusBar } from "expo-status-bar";

import { PortalHost } from "~/components/primitives/portal";
import { TRPCProvider } from "~/lib/api";

import "../styles.css";

import type { Theme } from "@react-navigation/native";
import * as React from "react";
import { SplashScreen, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider } from "@react-navigation/native";

import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
await SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      try {
        const theme = await AsyncStorage.getItem("theme");

        if (!theme) {
          await AsyncStorage.setItem("theme", colorScheme);
          setIsColorSchemeLoaded(true);
          return;
        }
        const colorTheme = theme === "dark" ? "dark" : "light";
        if (colorTheme !== colorScheme) {
          setColorScheme(colorTheme);

          setIsColorSchemeLoaded(true);
          return;
        }
        setIsColorSchemeLoaded(true);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    })().finally(async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error("An error occurred:", error);
      }
    });
  }, [colorScheme, setColorScheme]);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <TRPCProvider>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false }} />
        <PortalHost />
      </ThemeProvider>
    </TRPCProvider>
  );
}
