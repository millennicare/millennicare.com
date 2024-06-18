import Image from "next/image";
import Link from "next/link";

import { Button } from "@millennicare/ui/button";

const navLinks = [
  { title: "About", href: "#about" },
  { title: "Our Commitment", href: "#commitment" },
];

const Navbar = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <nav className="bg-cream flex w-full items-center justify-between px-4 py-6">
      <Link href="/">
        <Image
          src="/millennicare_logo.png"
          height={50}
          width={50}
          alt="MillenniCare Logo"
          className="block md:hidden"
          priority={true}
        />

        <Image
          className="hidden md:block"
          src="/millennicare_logo_with_text.svg"
          alt="MillenniCare Logo"
          height={500}
          width={300}
        />
      </Link>

      <div className="flex">
        {navLinks.map(({ href, title }) => (
          <span key={href}>
            <Link href={href}>
              <Button variant="link" size="lg" className="text-lg">
                {title}
              </Button>
            </Link>
          </span>
        ))}
        <Button variant="secondary" size="lg" className="text-lg text-white">
          <Link href={isLoggedIn ? "/dashboard/home" : "/auth/sign-in"}>
            {isLoggedIn ? "Dashboard" : "Sign In"}
          </Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
