import { getServerAuthSession } from "~/server/auth";

import SideNav from "./_components/sidenav";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="flex h-screen w-screen flex-row">
      <SideNav />
      <div className="flex h-full w-full justify-center bg-palecream">
        <div className="m-auto h-5/6 w-[90%] overflow-auto">{children}</div>
      </div>
    </div>
  );
}
