"use client";

import { ExitIcon } from "@radix-ui/react-icons";

import { Button } from "@millennicare/ui/button";

import { signOut } from "../actions";

export default function LogoutButton() {
  return (
    <form action={signOut} className="w-full">
      <Button className="flex w-full cursor-pointer items-center justify-center bg-muted-foreground py-4 lg:justify-start lg:pl-6">
        <ExitIcon className="w-6" />
        <p className="ml-3 hidden lg:block">Logout</p>
      </Button>
    </form>
  );
}
