import { redirect } from "next/navigation";

import { validateRequest } from "../lib/auth";
import { SideNav } from "./_components/side-nav";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const { session } = await validateRequest();
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex h-screen w-screen flex-row">
      <div className="h-full px-4 py-6">
        <SideNav />
      </div>
      <main className="h-full w-full px-4 py-6">
        <div className="h-full w-full rounded-lg border">{children}</div>
      </main>
    </div>
  );
}
