import SideNav from "./_components/Sidenav";
import Topnav from "./_components/Topnav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen flex-row bg-gray-200">
      <div className="h-full px-4 py-6">
        <SideNav />
      </div>
      <div className="h-full w-full px-4 py-6">
        <Topnav />
        <div className="h-4/5">{children}</div>
      </div>
    </div>
  );
}
