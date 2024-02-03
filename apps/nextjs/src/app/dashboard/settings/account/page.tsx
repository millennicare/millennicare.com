import { Separator } from "@millennicare/ui/separator";

export default function AccountPage() {
  return (
    <div className="w-full space-y-6 px-2 py-3 lg:w-3/4">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings.
        </p>
      </div>
      <Separator />
    </div>
  );
}
