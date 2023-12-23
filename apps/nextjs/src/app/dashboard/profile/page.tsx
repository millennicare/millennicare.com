import { getUserData } from "../_actions/auth";
import { getChildren } from "../_actions/child";
import { HouseholdCard } from "./_components/HouseholdCard";
import { InfoCard } from "./_components/InfoCard";

export default async function ProfilePage() {
  const user = await getUserData();
  const children = await getChildren();

  return (
    <div className="flex h-full w-full flex-col space-y-4">
      <InfoCard user={user} />
      <HouseholdCard data={children} />
    </div>
  );
}
