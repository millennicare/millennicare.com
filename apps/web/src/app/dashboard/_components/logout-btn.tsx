"use client";

import { Button } from "@millennicare/ui/button";
import { ExitIcon } from "@radix-ui/react-icons";

import { signOut } from "../actions";

export default function LogoutButton() {
  return (
    <form action={signOut} className="w-full">
      <Button className="flex w-full cursor-pointer items-center justify-center bg-background py-4 hover:bg-gray-300 md:justify-start md:pl-6">
        <ExitIcon className="w-6 text-foreground" />
        <p className="ml-3 hidden text-foreground md:block">Logout</p>
      </Button>
    </form>
  );
}
