import type { Metadata, Viewport } from "next";
import { Montserrat, Quicksand } from "next/font/google";

import { cn } from "@millennicare/ui";
import { Toaster } from "@millennicare/ui/toast";

import { env } from "~/env";
import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { ThemeProvider } from "@millennicare/ui/theme";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.NODE_ENV === "production"
      ? "https://millennicare.com"
      : "http://localhost:3000",
  ),
  title: "MillenniCare",
  description:
    "Providing childcare and other services to marginalized communities.",
  openGraph: {
    title: "MillenniCare",
    description:
      "Providing childcare and other services to marginalized communities.",
    url: "https://millennicare.com",
    siteName: "MillenniCare",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          montserrat.variable,
          quicksand.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <TRPCReactProvider>{props.children}</TRPCReactProvider>

          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
