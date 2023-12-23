import { api } from "~/trpc/server";
import { HouseholdCard } from "./_components/HouseholdCard";
import { InfoCard } from "./_components/InfoCard";

export default async function ProfilePage() {
  const user = await api.auth.getMe.query();

  return (
    <div className="flex h-full w-full flex-col space-y-4">
      <InfoCard user={user} />
      <HouseholdCard />
    </div>
  );
}
