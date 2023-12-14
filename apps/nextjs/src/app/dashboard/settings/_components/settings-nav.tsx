"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

const links = [
  { name: "Profile", href: "/dashboard/settings" },
  { name: "Account", href: "/dashboard/settings/account" },
];

export function SettingsNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();

  return (
    <div className="relative">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className={cn("mb-4 flex items-center", className)} {...props}>
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className={cn(
                "flex items-center px-4",
                pathname === link.href
                  ? "font-bold"
                  : "text-muted-foreground font-medium",
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
