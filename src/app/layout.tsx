import "~/styles/globals.css";

import { Analytics } from "@vercel/analytics/react";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";

import { montserrat, quicksand } from "./fonts";
import { Toaster } from "~/components/ui/toaster";

export const metadata = {
  title: "MillenniCare",
  description: "Providing childcare to under-represented communities",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${quicksand.variable}`}>
      <body>
        <TRPCReactProvider headers={headers()}>
          {children}
          <Analytics />
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
