import { Separator } from "@millennicare/ui/separator";

import { SettingsNav } from "./_components/settings-nav";

interface SettingsLayoutProps {
  readonly children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="space-y-6 md:block">
      <div className="space-y-0.5 rounded-lg bg-background px-2 py-3">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings.</p>
        <Separator />
      </div>
      <div className="rounded-lg bg-background px-4">
        <SettingsNav />
        {children}
      </div>
    </div>
  );
}
