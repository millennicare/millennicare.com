import { Separator } from "~/components/ui/separator";
import EditProfileForm from "./_components/profile-form";

export default function SettingsPage() {
  return (
    <div className="space-y-6 px-2 py-4">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-muted-foreground text-sm">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <EditProfileForm />
    </div>
  );
}
