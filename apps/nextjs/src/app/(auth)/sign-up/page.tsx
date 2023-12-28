import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { Button } from "~/components/ui/button";

export default function Page() {
  const { userId } = auth();
  if (userId) {
    redirect("/dashboard");
  }
  return (
    <div className="bg-palecream flex h-screen w-screen flex-col items-center justify-center space-y-4">
      <p className="font-mono text-2xl">Which one describes you?</p>
      <div className="flex h-2/5 flex-col items-center space-y-4 md:h-1/4 md:w-1/2 md:flex-row md:justify-around md:space-x-4 md:space-y-0">
        <div className="bg-background flex w-full min-w-fit flex-col space-y-3 rounded-xl border border-gray-500 p-4 md:w-1/2">
          <p className="text-xl font-semibold">I am a careseeker</p>
          <p>Create a profile and start your search</p>
          <Link href="/sign-up/careseeker">
            <Button variant="secondary" className="w-full">
              Find care
            </Button>
          </Link>
        </div>

        <div className="bg-background flex w-full min-w-fit flex-col space-y-3 rounded-xl border border-gray-500 p-4 md:w-1/2">
          <p className="text-xl font-semibold">I am a caregiver</p>
          <p>Create a profile and search for jobs</p>
          <Link href="/sign-up/caregiver">
            <Button variant="secondary" className="w-full">
              Find jobs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
