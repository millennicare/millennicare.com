import Image from "next/image";

import { Button } from "@millennicare/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@millennicare/ui/dialog";

import WaitlistForm from "./waitlist-form";

const Hero = () => {
  return (
    <span className="flex w-full flex-col items-center justify-evenly space-y-3 md:flex-row md:space-y-0">
      <div className="flex flex-col">
        <div className="w-full space-y-3 self-center md:max-w-lg md:text-left ">
          <h1 className="font-mono text-2xl md:text-5xl">
            Modernizing Affordable Childcare for the New Millenium
          </h1>
          <h2 className="font-mono text-xl text-secondary md:text-3xl">
            COMING SOON
          </h2>
          <h3 className="pb-2 text-lg text-secondary/80 md:text-2xl">
            Low-monthly fee to access quality and affordable childcare services.
          </h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="text-lg text-background">
                Join the Waitlist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join the waitlist</DialogTitle>
              </DialogHeader>
              <WaitlistForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Image
        src="/welcome_screen_portrait.png"
        height={700}
        width={400}
        className="max-w-xs"
        alt="Welcome screen portrait"
        priority={true}
      />
    </span>
  );
};

export default Hero;
