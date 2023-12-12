"use client";

import { useState } from "react";
import Image from "next/image";
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
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setComplete(true);
        router.push("/dashboard");
      }
    } catch (error) {
      // @TODO: fix error feedback
      console.log(error);
    }
  }

  return (
    <div className="bg-palecream flex h-screen w-screen flex-col items-center justify-center">
      <div className="flex h-full w-full flex-col justify-center">
        <div className="space-y-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Image
              src="/millennicare_logo.png"
              alt="Millennicare logo"
              height={80}
              width={80}
              priority={true}
            />
          </div>
          <h2 className="text-center text-2xl">Forgot password?</h2>
        </div>

        <div className="mx-auto w-2/5 rounded-lg bg-white px-4 py-3 shadow">
          <div className="flex flex-col space-y-2">
            {!successfulCreation && (
              <p className="text-sm">
                Enter the email address you used when you created an account and
                we&apos;ll send you a code to reset your password.
              </p>
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
                  <div className="flex justify-end space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => router.back()}
                      className="disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none"
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Submit</Button>
                  </div>
                </div>
              )}

              {successfulCreation && !complete && (
                <>
                  <label htmlFor="password">New password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <label htmlFor="password">Reset password code</label>
                  <Input
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
  );
}
