"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@millennicare/ui";
import { ScrollArea } from "@millennicare/ui/scroll-area";
import { Separator } from "@millennicare/ui/separator";

const links = [
  { name: "Profile", href: "/dashboard/settings" },
  { name: "Account", href: "/dashboard/settings/account" },
  { name: "Payment", href: "/dashboard/settings/payment" },
  { name: "Password and Security", href: "/dashboard/settings/security" },
];

export function SettingsNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();

  return (
    <div className="relative rounded-lg bg-background py-3">
      <ScrollArea className="mb-3 max-w-[600px] lg:max-w-none">
        <div
          className={cn("flex items-center space-x-4", className)}
          {...props}
        >
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className={cn(
                "flex items-center",
                pathname === link.href
                  ? "font-bold"
                  : "font-medium text-muted-foreground",
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </ScrollArea>
      <Separator />
    </div>
  );
}
