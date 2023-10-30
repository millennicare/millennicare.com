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
  {
    title: "Meet Our Team",
    href: "#team",
  },
];

export default function Page() {
  const navItems = navLinks.map(({ href, title }) => {
    return (
      <div key={href}>
        <Link href={href}>
          <Button variant="link" size="lg">
            {title}
          </Button>
        </Link>
      </div>
    );
  });

  return (
    <div className="flex flex-col">
      <div
        id="navbar"
        className="bg-palecream flex w-full items-center justify-between px-4 py-6"
      >
        <Image
          src="/millennicare_logo.png"
          height={50}
          width={50}
          alt="Millennicare Logo"
          className="block md:hidden"
        />

        <Image
          className="hidden md:block"
          src="/millennicare_logo_with_text.svg"
          height={500}
          width={300}
          alt="Millennicare Logo"
        />

        <div className="flex ">
          {navItems}

          <Button variant="secondary" size="lg" className="text-white">
            Login
          </Button>
        </div>
      </div>

      <div
        id="hero"
        className="bg-cream flex h-[80vh] w-full flex-col items-center justify-center md:flex-row md:space-x-48"
      >
        <div className="flex flex-col">
          <div className="w-full space-y-3 self-center px-5 md:max-w-lg">
            <h1 className="py-5 font-mono text-4xl md:max-w-lg md:text-5xl lg:text-6xl">
              Modernizing Affordable Childcare for the New Millenium
            </h1>
            <h2 className="pb-2 font-mono text-2xl text-secondary md:text-3xl">
              COMING SOON
            </h2>
            <h3 className="text-communityteal pb-2 text-lg md:text-2xl">
              Low-monthly fee to access quality and affordable childcare
              services.
            </h3>
            {/* display a modal onclick to sign up for a waitlist */}
            <Button variant="default" size="lg" className="text-lg text-white">
              Join the Waitlist
            </Button>
          </div>
        </div>

        <Image
          className="max-h-2xl h-auto min-w-[20rem] max-w-xs self-center px-5 pt-3"
          src="/welcome_screen_portrait.png"
          height={700}
          width={400}
          alt="Welcome screen portrait"
        />
      </div>

      <div
        id="about"
        className="bg-cream flex flex-col-reverse items-center justify-center px-20 pt-10 md:flex-row  md:space-x-48 md:pb-5 lg:pb-0"
      >
        <Image
          className="max-h-2xl h-auto min-w-[20rem] max-w-xs self-center px-5 pt-3"
          src="/dashboard_screen.png"
          height={700}
          width={400}
          alt="Dashboard screenshot"
        />
        <div className="w-full space-y-3 px-5 text-center md:max-w-lg md:px-0 lg:text-left">
          <h1 className="flex justify-center text-4xl text-primary">
            About Us
          </h1>
          <h2 className="flex justify-center text-2xl">MILLENNICARE</h2>
          <p className="text-center text-lg">
            Founded in 2020, MillenniCare was born on the understanding that
            quality childcare is a fundamental human need and that not all
            families will have the luxury to afford or access this resource.
          </p>
          <p className="text-center text-lg">
            Sound like a you-problem? Well, worry no more! With our unique prime
            package and simple-to-use Mobile App, MillenniCare offers a solution
            to both of these problems by enabling families to connect with
            quality caregivers at an affordable and convenient rate. Sign up now
            to become a part of the first 100 founding families to be eligible
            for subsidy!
          </p>
        </div>
      </div>
    </div>
  );
}
