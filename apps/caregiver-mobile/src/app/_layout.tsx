import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "~/lib/api";

import "../styles.css";

export default function RootLayout() {
  return (
    <TRPCProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <StatusBar />
    </TRPCProvider>
  );
}
