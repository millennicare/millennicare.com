import { Separator } from "~/components/ui/separator";
import { getCareseekerData, getUserData } from "../_actions/auth";
import EditProfileForm from "./_components/profile-form";

export const runtime = "edge";

export default async function SettingsPage() {
  const user = await getUserData();
  const careseeker = await getCareseekerData();

  return (
    <div className="w-full space-y-6 px-2 py-3 lg:w-3/4">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-muted-foreground text-sm">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <EditProfileForm user={user} careseeker={careseeker} />
    </div>
  );
}
