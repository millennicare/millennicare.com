"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  CalendarIcon,
  ExitIcon,
  GearIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import clsx from "clsx";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  { name: "Appointments", href: "/dashboard/appointments", icon: CalendarIcon },
  { name: "Search", href: "/dashboard/search", icon: MagnifyingGlassIcon },
  { name: "Profile", href: "/dashboard/profile", icon: PersonIcon },
  { name: "Settings", href: "/dashboard/settings", icon: GearIcon },
];

export function SideNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <section className="bg-background h-full space-y-8 rounded-lg px-2 py-6 duration-300 md:w-max md:px-4">
      <div className="flex w-full items-center justify-center">
        <Image
          src="/millennicare_logo.png"
          alt="MillenniCare logo"
          width={40}
          height={40}
          priority
        />
        <h3 className="ml-3 hidden text-xl md:block">
          MILLENNI<span className="font-bold">CARE</span>
        </h3>
      </div>

      <div className="flex flex-col items-center justify-center space-y-3">
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Button
              asChild
              className={clsx(
                "bg-background text-black shadow-none hover:bg-gray-300",
                {
                  "bg-gray-200": pathname === link.href,
                },
              )}
              size="lg"
              key={link.name}
            >
              <Link
                href={link.href}
                className="flex w-full cursor-pointer items-center justify-center py-4 md:justify-start md:pl-6"
              >
                <LinkIcon className="w-6" />
                <p className="ml-3 hidden md:block">{link.name}</p>
              </Link>
            </Button>
          );
        })}
        <Separator />
        <Button
          className="bg-background flex w-full cursor-pointer flex-row items-center justify-center py-4 text-black shadow-none hover:bg-gray-300 md:justify-start md:pl-6"
          onClick={() => signOut(() => router.push("/"))}
        >
          <ExitIcon className="w-6" />
          <p className="ml-3 hidden md:block">Logout</p>
        </Button>
      </div>
    </section>
  );
}
