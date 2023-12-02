"use client";

import { BellIcon } from "@radix-ui/react-icons";

import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

export default function TopNav() {
  const user = api.auth.getMe.useQuery();

  if (user.isLoading) {
    return <>Loading</>
  }

  if (user.isError) {
    return <>Error fetching data</>;
  }

  if (user.isSuccess && user.data) {
    return (
      <div className="flex items-center justify-between py-6">
        <h2 className="font-mono text-xl font-semibold">
          Good Morning, {user.data.firstName}
        </h2>
        <Button
          size="icon"
          className="h-10 w-10 rounded-full bg-white p-2 text-black hover:bg-gray-300"
        >
          <BellIcon className="h-full w-full" />
        </Button>
      </div>
    );
  }
}
