"use client";

import { BellIcon } from "@radix-ui/react-icons";

import { Button } from "~/components/ui/button";

export default function TopNav({ firstName }: { firstName: string }) {
  return (
    <div className="flex items-center justify-between py-6">
      <h2 className="font-mono text-xl font-semibold">
        Hello {firstName ?? ""}!
      </h2>

      <Button
        size="icon"
        variant="ghost"
        className="h-10 w-10 rounded-full bg-transparent p-2 text-black hover:bg-gray-300"
      >
        <BellIcon className="h-full w-full" />
      </Button>
    </div>
  );
}
