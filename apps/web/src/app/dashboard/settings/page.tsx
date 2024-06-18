import { Separator } from "@millennicare/ui/separator";

export default function SettingsPage() {
  return (
    <div className="w-full space-y-6 px-2 py-3 lg:w-3/4">
      <div>
        <h3 className="font-medium text-muted-foreground">
          This is how others will see you on the site.
        </h3>
      </div>
      <Separator />
    </div>
  );
}
