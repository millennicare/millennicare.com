"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { useToast } from "~/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function Page() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function showToast(
    title: string,
    description: string,
    variant: "default" | "destructive",
  ) {
    return toast({
      title,
      description,
      variant,
    });
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await signIn("credentials", { ...values, redirect: false });
    if (res?.ok) {
      showToast("Success!", "Going to dashboard", "default");
      void router.push("/dashboard");
    }
    if (res?.status === 401 && res.error) {
      showToast("Something went wrong.", res.error, "destructive");
    }
    if (res?.status === 500) {
      showToast(
        "Uh-oh, something went wrong.",
        "Please try again later.",
        "destructive",
      );
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-palecream py-12 sm:px-6 lg:px-8">
      <div className="space-y-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link className="flex items-center text-white" href="/">
            <Image
              className="h-24 w-auto"
              src="/millennicare_logo.png"
              alt="Workflow"
              height={300}
              width={300}
              priority={true}
            />
          </Link>
        </div>
        <h2 className="text-center text-3xl">Welcome Back</h2>
      </div>
      <div className="mt-4 px-4 sm:mx-auto sm:w-full sm:max-w-md md:p-0">
        <div className="rounded-lg bg-white px-2 py-4 shadow sm:px-10">
          <div className="flex flex-col">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john.doe@email.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="******"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="w-full">
                  Sign In
                </Button>

                <Separator />
              </form>
            </Form>

            <div className="mb-2 mt-4 flex items-center justify-between">
              <Button variant="link" className="p-0">
                <Link href="/forgot-password">
                  <p className="text-center text-sm">Forgot password?</p>
                </Link>
              </Button>

              <Button variant="link" className="p-0">
                <Link href="register">
                  <p className="text-center text-sm">
                    Don&apos;t have an account?
                  </p>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
