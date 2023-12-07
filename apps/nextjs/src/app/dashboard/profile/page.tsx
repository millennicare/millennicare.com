import { HouseholdCard } from "./_components/HouseholdCard";
import { InfoCard } from "./_components/InfoCard";

export default function ProfilePage() {
  return (
    <div className="flex h-full w-full flex-col space-y-4">
      <InfoCard />
      <HouseholdCard />
    </div>
  );
}
