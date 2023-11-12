import Image from "next/image";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import Navbar from "./_components/Navbar";

export default function Page() {
  return (
    <div className="flex flex-col">
      <Navbar />

      <div
        id="hero"
        className="flex h-[80vh] w-full flex-col items-center justify-center bg-cream md:flex-row md:space-x-48"
      >
        <div className="flex flex-col">
          <div className="w-full space-y-3 self-center px-5 md:max-w-lg">
            <h1 className="py-5 font-mono text-4xl md:max-w-lg md:text-5xl lg:text-6xl">
              Modernizing Affordable Childcare for the New Millenium
            </h1>
            <h2 className="pb-2 font-mono text-2xl text-secondary md:text-3xl">
              COMING SOON
            </h2>
            <h3 className="pb-2 text-lg text-communityteal md:text-2xl">
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
        className="flex flex-col-reverse items-center justify-center bg-cream px-20 pt-10 md:flex-row  md:space-x-48 md:pb-5 lg:pb-0"
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

      <div
        id="commitment"
        className="flex h-full flex-col justify-center bg-palecream py-12 lg:h-[65vh] lg:px-36"
      >
        <h1 className="justify-center text-center text-4xl text-primary md:m-8">
          Our Commitment
        </h1>

        <div className="flex flex-col items-center justify-center sm:flex-row md:justify-evenly">
          <div className="flex w-full flex-col items-center justify-center space-y-4 md:w-1/3">
            <Image
              src="/safe-icon.png"
              alt="safe icon"
              height={80}
              width={80}
            />
            <h3>SAFE</h3>
            <p className="px-5 text-center text-base">
              Book a childcare session with an ease of mind. Our team makes sure
              that all of our caregivers are background checked, and we comply
              to DC licensing and compliance guidelines.
            </p>
          </div>
          <div className="mx-8 flex w-full flex-col items-center justify-center space-y-4 md:w-1/3">
            <Image
              src="/childcare-icon.png"
              alt="childcare icon"
              height={80}
              width={80}
            />
            <h3 className="text-center">AFFORDABLE CHILDCARE</h3>
            <p className="px-5 text-center text-base">
              Pay a low-monthly fee to access quality and affordable childcare
              service. We are aligned with the state and federal government
              initatives to reduce childcare cost from $1600 per month to only
              $500 per month.
            </p>
          </div>
          <div className="flex w-full flex-col items-center justify-center space-y-4 md:w-1/3">
            <Image
              src="/for-you-icon.png"
              alt="for you icon"
              height={80}
              width={80}
            />
            <h3>FOR YOU</h3>
            <p className="px-5 text-center text-base">
              Designed for working women, families of all kinds, as well as
              companies offering fringe benefits to increase retention and
              employee morale. MillenniCare addresses the flaws in our current
              fractured system.
            </p>
          </div>
        </div>
      </div>

      <div
        id="footer"
        className="flex w-full flex-col content-around items-center bg-palecream py-10"
      >
        <Image
          src="/millennicare_logo_with_text.svg"
          alt="Millennicare logo"
          height={200}
          width={200}
        />

        <p className="pt-2 text-sm">Copyright © 2023 MillenniCare, Inc.</p>
        {/* Footer Links */}
        <div className="flex w-[390px] flex-col items-center justify-between pt-2 min-[420px]:flex-row">
          <Link href="/eula">
            <p className="hover:text-primary">EULA</p>
          </Link>
          <p className="max-[420px]:hidden">|</p>
          <Link href="/privacy-policy">
            <p className="hover:text-primary max-[420px]:py-2">
              Privacy Policy
            </p>
          </Link>
          <p className="hover:text-primary max-[420px]:hidden">|</p>
          <Link href="/contact-us">
            <p>Contact Us</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
