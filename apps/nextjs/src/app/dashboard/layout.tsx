import { redirect } from "next/navigation";

import { auth } from "@millennicare/auth";

import SideNav from "./_components/sidenav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="flex h-screen w-screen flex-row">
      <SideNav />
      <div className="bg-palecream flex h-full w-full justify-center">
        <div className="m-auto h-[90%] w-[90%] overflow-auto">{children}</div>
      </div>
    </div>
  );
}