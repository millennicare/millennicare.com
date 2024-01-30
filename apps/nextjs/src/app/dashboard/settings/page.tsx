import { Separator } from "@millennicare/ui/separator";

import { api } from "~/trpc/server";
import EditCareseekerForm from "./_components/edit-careseeker-form";

export const runtime = "edge";

export default async function SettingsPage() {
  const user = await api.auth.getMe();
  const careseeker = await api.careseeker.getCareseeker();

  return (
    <div className="w-full space-y-6 px-2 py-3 lg:w-3/4">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <EditCareseekerForm user={user} careseeker={careseeker} />
    </div>
  );
}
