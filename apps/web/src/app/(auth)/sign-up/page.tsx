import Link from "next/link";

import { Button } from "@millennicare/ui/button";

export default function SignUpPage() {
  return (
    <main className="bg-cream flex w-screen flex-col items-center justify-center space-y-4">
      <p className="font-mono text-2xl">Which one describes you?</p>

      <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-around md:space-x-4 md:space-y-0">
        <CardType
          type="careseeker"
          description="start your search"
          variant="care"
        />
        <CardType
          type="caregiver"
          description="search for a job"
          variant="jobs"
        />
      </div>
    </main>
  );
}

type CardTypeProps = {
  type: "careseeker" | "caregiver";
  description: string;
  variant: string;
};

function CardType({ type, description, variant }: CardTypeProps) {
  return (
    <div className="flex w-full min-w-fit flex-col space-y-3 rounded-xl border bg-background p-4 md:w-1/2">
      <p className="text-xl font-semibold">I am a {type}</p>
      <p>Create a profile and {description}</p>
      <Link href={`/sign-up/${type}`}>
        <Button variant="secondary" className="w-full text-background">
          Find {variant}
        </Button>
      </Link>
    </div>
  );
}
