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
    redirect("/dashboard/home");
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Image
        src="/millennicare_logo.png"
        alt="Millennicare Logo"
        height={90}
        width={90}
        priority={true}
      />
      {children}
    </div>
  );
}
