import Image from "next/image";
import Link from "next/link";

import { Button } from "~/components/ui/button";

const navLinks = [
  {
    title: "About",
    href: "#about",
  },
  {
    title: "Our Commitment",
    href: "#commitment",
  },
];

export default function Navbar() {
  const navItems = navLinks.map(({ href, title }) => {
    return (
      <div key={href}>
        <Link href={href}>
          <Button variant="link" size="lg" className="text-lg">
            {title}
          </Button>
        </Link>
      </div>
    );
  });

  return (
    <div
      id="navbar"
      className="bg-palecream flex w-full items-center justify-between px-4 py-6"
    >
      <Link href="/">
        <Image
          src="/millennicare_logo.png"
          height={50}
          width={50}
          alt="Millennicare Logo"
          className="block md:hidden"
          priority={true}
        />

        <Image
          className="hidden md:block"
          src="/millennicare_logo_with_text.svg"
          height={500}
          width={300}
          alt="Millennicare Logo"
        />
      </Link>

      <div className="flex">
        {navItems}
        <Button variant="secondary" size="lg" className="text-lg text-white">
          <Link href="/auth/login">Login</Link>
        </Button>
      </div>
    </div>
  );
}
