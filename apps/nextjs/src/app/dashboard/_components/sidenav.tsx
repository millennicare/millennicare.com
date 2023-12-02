"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  CalendarIcon,
  ExitIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import clsx from "clsx";

const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  { name: "Appointments", href: "/dashboard/appointments", icon: CalendarIcon },
  { name: "Search", href: "/dashboard/search", icon: MagnifyingGlassIcon },
  { name: "Profile", href: "/dashboard/profile", icon: PersonIcon },
];

export default function SideNav() {
  const router = useRouter();
  const { signOut } = useClerk();

  return (
    <section className="min-h-scren bg-cream w-20 border border-slate-300 duration-300 md:w-72">
      <div className="flex w-full flex-row items-center justify-center py-4 md:justify-start md:pl-6">
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
              className="hover:bg-cream/100 flex w-full cursor-pointer flex-row items-center justify-center py-4 md:justify-start md:pl-6"
            >
              <LinkIcon className="w-6" />
              <p className="ml-3 hidden md:block">{link.name}</p>
            </Link>
          );
        })}

        <div
          className="flex w-full cursor-pointer flex-row items-center justify-center border-t border-slate-200 py-4 md:w-full md:justify-start md:pl-6"
          onClick={() => signOut(() => router.push("/"))}
        >
          <ExitIcon className="w-6" />
          <p className="ml-3 hidden md:block">Logout</p>
        </div>
      </div>
    </section>
  );
}
