import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/server";
import EditProfileForm from "./_components/profile-form";

export default async function SettingsPage() {
  const query = await api.auth.getMe.query();

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
