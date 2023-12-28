import "~/styles/globals.css";

import { cache } from "react";
import { headers } from "next/headers";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";

import { Toaster } from "~/components/ui/toaster";
import { TRPCReactProvider } from "~/trpc/react";
import { montserrat, quicksand } from "./fonts";

export const metadata = {
  title: "MillenniCare",
  description: "Providing childcare to under-represented communities",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

// Lazy load headers
const getHeaders = cache(() => Promise.resolve(headers()));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${montserrat.variable} ${quicksand.variable}`}
      >
        <body>
          <TRPCReactProvider headersPromise={getHeaders()}>
            {children}
            <Analytics />
            <Toaster />
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
