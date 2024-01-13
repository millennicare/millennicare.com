import Image from "next/image";
import { redirect } from "next/navigation";

import { getSession } from "../actions";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session.isLoggedIn) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center space-y-6">
      <Image
        src="/millennicare_logo.png"
        alt="Millennicare Logo"
        height={96}
        width={96}
        priority={true}
      />
      {children}
    </div>
  );
}
