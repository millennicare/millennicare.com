import { Separator } from "~/components/ui/separator";

export default async function AccountPage() {
  return (
    <div className="w-3/4 space-y-6 px-2 py-4">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-muted-foreground text-sm">
          Update your account settings.
        </p>
      </div>
      <Separator />
    </div>
  );
}
