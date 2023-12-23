import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/server";
import { getUserData } from "../_actions/auth";
import EditProfileForm from "./_components/profile-form";

export const runtime = "edge";

export default async function SettingsPage() {
  const query = await getUserData();

  return (
    <div className="w-3/4 space-y-6 px-2 py-3">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-muted-foreground text-sm">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <EditProfileForm
        profilePicture={query.profilePicture}
        email={query.email}
        biography={query.biography}
      />
    </div>
  );
}
