import { SettingsNav } from "./_components/settings-nav";

interface SettingsLayoutProps {
  readonly children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div>
      <div className="hidden space-y-6 md:block">
        <div className="bg-background space-y-0.5 rounded-lg px-2 py-4">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your account</p>
        </div>
        <SettingsNav />
        <div className="bg-background overflow-hidden rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
