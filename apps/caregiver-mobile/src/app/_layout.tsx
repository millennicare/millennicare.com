import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "~/lib/api";

import "../styles.css";

import { ToastProvider } from "~/components/toast";

export default function RootLayout() {
  return (
    <TRPCProvider>
      <ToastProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
        <StatusBar />
      </ToastProvider>
    </TRPCProvider>
  );
}
