import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { validateRequest } from "../lib/auth";
import { SideNav } from "./_components/side-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await validateRequest();

  if (!session) {
    redirect("/sign-in");
  }

  async function logout() {
    "use server";

    const session = await getSession();
    session.destroy();
    revalidatePath("/dashboard");
  }

  return (
    <div className="flex h-screen w-screen flex-row">
      <div className="h-full px-4 py-6">
        <SideNav logout={logout} />
      </div>
      <main className="h-full w-full px-4 py-6">
        <div className="h-full w-full rounded-lg border">{children}</div>
      </main>
    </div>
  );
}
