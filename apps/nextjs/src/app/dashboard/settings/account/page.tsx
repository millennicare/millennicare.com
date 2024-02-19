import { Separator } from "@millennicare/ui/separator";

export default function AccountPage() {
  return (
    <div className="w-full space-y-6 px-2 py-3 lg:w-3/4">
      <div>
        <h3 className="font-medium text-muted-foreground">
          Manage your account settings.
        </h3>
      </div>
      <Separator />
    </div>
  );
}
