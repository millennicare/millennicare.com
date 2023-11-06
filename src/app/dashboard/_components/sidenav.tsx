"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  HomeIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  PersonIcon,
  ExitIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import { signOut } from "next-auth/react";

const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  { name: "Appointments", href: "/dashboard/appointments", icon: CalendarIcon },
  { name: "Search", href: "/dashboard/search", icon: MagnifyingGlassIcon },
  { name: "Profile", href: "/dashboard/profile", icon: PersonIcon },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <section className="min-h-scren w-20 border border-slate-300 bg-cream duration-300 md:w-72">
      <div className="flex w-full flex-row items-center justify-start py-4 md:pl-6">
        <Image
          src="/millennicare_logo.png"
          alt="Millennicare logo"
          height={40}
          width={40}
        />
        <h3 className="ml-3 hidden text-lg md:block">
          MILLENNI<span className="font-bold">CARE</span>
        </h3>
      </div>
      <div className="flex flex-col items-center justify-center">
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "flex w-full cursor-pointer flex-row items-center justify-center py-4 hover:bg-slate-200 md:justify-start md:pl-6",
                {
                  "bg-slate-300": pathname === link.href,
                },
              )}
            >
              <LinkIcon className="w-6" />
              <p className="ml-3 hidden md:block">{link.name}</p>
            </Link>
          );
        })}

        <span
          className="flex cursor-pointer flex-row items-center justify-start border-t border-slate-300 py-4 hover:bg-slate-300 md:w-full md:pl-6"
          onClick={() => signOut()}
          onKeyDown={() => signOut()}
        >
          <ExitIcon className="w-6" />
          <p className="ml-3 hidden md:block">Logout</p>
        </span>
      </div>
    </section>
  );
}
