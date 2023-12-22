"use client";

import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/react";
import EditProfileForm from "./_components/profile-form";

export default function SettingsPage() {
  const query = api.auth.getMe.useQuery();

  if (query.isLoading) {
    return <>Loading...</>;
  }

  if (query.isError) {
    return <>Error fetching data.</>;
  }

  if (query.data) {
    return (
      <div className="w-3/4 space-y-6 px-2 py-4">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-muted-foreground text-sm">
            This is how others will see you on the site.
          </p>
        </div>
        <Separator />
        <EditProfileForm
          email={query.data.email}
          biography={query.data.biography}
          firstName={query.data.firstName}
          lastName={query.data.lastName}
        />
      </div>
    );
  }
}
