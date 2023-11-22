import "~/styles/globals.css";

import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/react";

import { Toaster } from "~/components/ui/toaster";
import { montserrat, quicksand } from "./fonts";
import { TRPCReactProvider } from "./providers";

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
