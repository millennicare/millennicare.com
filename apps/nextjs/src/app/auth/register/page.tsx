import Link from "next/link";

import { Button } from "~/components/ui/button";

export default function Page() {
  return (
    <div className="bg-palecream flex h-screen w-screen flex-col items-center justify-center">
      <p className="font-mono text-2xl">Which one describes you?</p>
      <div className="flex w-3/5 items-center space-x-8 p-4">
        <div className="flex w-1/2 flex-col space-y-3 rounded-xl border border-gray-500 bg-white p-4">
          <p className="text-xl font-semibold">I am a careseeker</p>
          <p>Create a profile and start your search</p>
          <Link href="/auth/register/careseeker">
            <Button variant="secondary" className="w-full">
              Find care
            </Button>
          </Link>
        </div>

        <div className="flex w-1/2 flex-col space-y-3 rounded-xl border border-gray-500 bg-white p-4">
          <p className="text-xl font-semibold">I am a caregiver</p>
          <p>Create a profile and search for jobs</p>
          <Link href="/auth/register/caregiver">
            <Button variant="secondary" className="w-full">
              Find jobs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
