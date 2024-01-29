import { getPresignedUrl } from "@millennicare/lib";

import { api } from "~/trpc/server";
import { HouseholdCard } from "./_components/household-card";
import { InfoCard } from "./_components/info-card";

export default async function ProfilePage() {
  const user = await api.auth.getMe();
  const children = await api.children.getByCareseekerId();
  const proflePictureUrl = await getUrl(user?.profilePicture);

  async function getUrl(key: string | null) {
    if (!key) return;
    const url = await getPresignedUrl(key);
    return url;
  }

  return (
    <div className="flex h-full w-full flex-col space-y-4">
      <InfoCard user={user} proflePictureUrl={proflePictureUrl} />
      <HouseholdCard data={children} />
    </div>
  );
}
