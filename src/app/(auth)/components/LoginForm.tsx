"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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

export default function LoginForm() {
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    // call trpc action
    console.log(values);
  }

  return (
    <div>
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
                    <Input placeholder="******" {...field} type="password" />
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
          <Button variant="link">
            <Link href="/forgot-password">
              <p className="text-center text-sm">Forgot password?</p>
            </Link>
          </Button>

          <Button variant="link">
            <Link href="register">
              <p className="text-center text-sm">Don&apos;t have an account?</p>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
