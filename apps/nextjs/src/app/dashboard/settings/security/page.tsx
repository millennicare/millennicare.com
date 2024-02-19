import { Separator } from "@millennicare/ui/separator";

import UpdateSecurityForm from "./forms/update-security";

export default function SecurityPage() {
  return (
    <div className="w-full space-y-6 px-2 py-3 lg:w-3/4">
      <div>
        <h3 className="font-medium text-muted-foreground">
          Update your security settings.
        </h3>
      </div>
      <Separator />
      <UpdateSecurityForm />
    </div>
  );
}
