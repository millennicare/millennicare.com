import Image from "next/image";

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
  return (
    <div className="flex h-screen w-screen flex-col">
      <div id="navbar">
        <p>ya</p>
      </div>
      <div
        id="hero"
        className="flex h-4/5 w-full items-center justify-center space-x-48 bg-red-200"
      >
        <div className="flex flex-col">
          <div className="w-full space-y-3 self-center px-5 md:max-w-lg">
            <h1 className="py-5 text-4xl md:max-w-lg md:text-5xl lg:text-6xl">
              Modernizing Affordable Childcare for the New Millenium
            </h1>
            <h2 className="text-trustblue pb-2 text-2xl md:text-3xl">
              COMING SOON
            </h2>
            <h3 className="text-communityteal pb-2 text-lg md:text-2xl">
              Low-monthly fee to access quality and affordable childcare
              services.
            </h3>

            <Button variant="default">Join the Waitlist</Button>
          </div>
        </div>
        <div>
          <p>photo</p>
        </div>
      </div>
    </div>
  );
}
