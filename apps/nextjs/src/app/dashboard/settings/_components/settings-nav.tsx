"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

const links = [
  { name: "Profile", href: "/dashboard/settings" },
  { name: "Account", href: "/dashboard/settings/account" },
  { name: "Payment", href: "/dashboard/settings/payment" },
];

export function SettingsNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();

  return (
    <div className="bg-background relative rounded-lg py-3">
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
                  : "text-muted-foreground font-medium",
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
