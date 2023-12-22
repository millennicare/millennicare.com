"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import validator from "validator";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

type Props = {
  readonly careseeker: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    biography: string | null;
    birthdate: Date;
  };
};

const formSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z
    .string()
    .refine(validator.isMobilePhone, { message: "Enter Valid Phone Number" })
    .optional(),
  biography: z.string().nullish().optional(),
  profilePicture: z.string().url().optional(),
  birthdate: z.coerce.date().optional(),
});

export default function EditProfileForm({ careseeker }: Props) {
  const { toast } = useToast();
  const utils = api.useUtils();
  const updateMutation = api.auth.update.useMutation({
    onSuccess() {
      utils.auth.getMe.invalidate();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: careseeker.firstName,
      lastName: careseeker.lastName,
      email: careseeker.email,
      phoneNumber: careseeker.phoneNumber,
      biography: careseeker.biography,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // if email has changed, change in clerk
      if (values.email && values.email !== careseeker.email) {
        const res = await fetch("/api/auth", {
          method: "POST",
          body: JSON.stringify({ email: values.email }),
        });

        if (!res.ok) {
        }

        const json = await res.json();
      }
      // if profile picture has been changed/uploaded, delete current pfp in s3
      // then upload new one
      // then use generated key and update user profile picture
      // then send
      console.log(values);
      //await updateMutation.mutateAsync(values);
    } catch (error) {}
  }

  // <div>
  //   <h1>Edit profile</h1>
  //   <Form {...form}>
  //     <form
  //       onSubmit={form.handleSubmit(onSubmit)}
  //       className="flex flex-col space-y-4"
  //     >
  //       <div className="flex flex-col space-y-4 md:flex-row md:space-x-2 md:space-y-0">
  //         <FormField
  //           control={form.control}
  //           name="firstName"
  //           render={({ field }) => (
  //             <FormItem className="w-full md:w-1/2">
  //               <FormLabel>First Name</FormLabel>
  //               <FormControl>
  //                 <Input type="text" {...field} />
  //               </FormControl>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />
  //         <FormField
  //           control={form.control}
  //           name="lastName"
  //           render={({ field }) => (
  //             <FormItem className="w-full md:w-1/2">
  //               <FormLabel>Last Name</FormLabel>
  //               <FormControl>
  //                 <Input type="text" {...field} />
  //               </FormControl>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />
  //       </div>

  //       <FormField
  //         control={form.control}
  //         name="email"
  //         render={({ field }) => (
  //           <FormItem>
  //             <FormLabel>Email Address</FormLabel>
  //             <FormControl>
  //               <Input type="email" {...field} />
  //             </FormControl>
  //           </FormItem>
  //         )}
  //       />
  //       <div className="flex justify-end">
  //         <Button type="submit" size="lg" className="w-1/3">
  //           Save
  //         </Button>
  //       </div>
  //     </form>
  //   </Form>
  // </div>
  return (
    <Tabs defaultValue="account" className="py-3">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="@peduarte" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
