"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";

export default function ForgotPasswordPage() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [complete, setComplete] = useState(false);
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const { toast } = useToast();

  async function create(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!isLoaded) return null;

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setSuccessfulCreation(true);
    } catch (error: unknown) {
      toast({
        title: "Uh-oh, something went wrong.",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  }

  async function reset() {
    if (!isLoaded) return null;
    await signIn
      .attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      .then((result) => {
        if (result.status === "complete") {
          setActive({ session: result.createdSessionId });
          setComplete(true);
          router.push("/dashboard");
        } else {
          console.log(result);
        }
      })
      .catch((err) => console.error("error", err.errors[0].longMessage));
  }

  return (
    <div className="bg-palecream h-screen w-screen">
      {/* nav buttons */}
      <div className="flex justify-between px-4">
        <Button variant="link" className="p-0" onClick={() => router.back()}>
          Go back
        </Button>
        <p>
          Not a member?{" "}
          <Link href="sign-up">
            <Button variant="link" className="p-0">
              Sign up now
            </Button>
          </Link>
        </p>
      </div>
      <div className="flex h-full w-full flex-col justify-center">
        <div className="space-y-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Image
              src="/millennicare_logo.png"
              alt="Millennicare logo"
              height={96}
              width={96}
              priority={true}
            />
          </div>
          <h2 className="text-center text-2xl">Forgot password?</h2>
        </div>

        <div className="mt-4 px-4 sm:mx-auto sm:w-full sm:max-w-md md:p-0">
          <div className="rounded-lg bg-white px-2 py-4 shadow sm:px-10">
            <div className="flex flex-col">
              {!successfulCreation ? (
                <p className="text-sm">
                  Enter the email address you used when you joined and we'll
                  send you a code to reset your password.
                </p>
              ) : (
                <p>yer</p>
              )}
              <form
                onSubmit={!successfulCreation ? create : reset}
                className="mt-6"
              >
                {!successfulCreation && !complete && (
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="email" className="font-medium">
                      Email Address
                    </label>

                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button type="submit" size="lg" className="w-full">
                      Send Reset Instructions
                    </Button>
                  </div>
                )}

                {successfulCreation && !complete && (
                  <>
                    <label htmlFor="password">New password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <label htmlFor="password">Reset password code</label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />

                    <Button type="submit" size="lg" className="w-full">
                      Reset Password
                    </Button>
                  </>
                )}

                {complete && "You successfully changed you password"}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
