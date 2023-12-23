"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { Textarea } from "~/components/ui/textarea";

type EditProfileFormProps = {
  email: string;
  biography: string | null;
  profilePicture: string | null;
};

const formSchema = z.object({
  email: z.string().email(),
  biography: z.string().optional(),
  password: z.string(),
  profilePicutre: z.any(),
});

export default function EditProfileForm({
  email,
  biography,
}: EditProfileFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
      password: "",
      biography: biography ?? undefined,
    },
    mode: "onTouched",
  });

  async function onSubmit() {
    // if email has been changed, update stripe and clerk info
  }

  // shows profile info
  // first/last name, biography, profile picture

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="profilePicture"
          render={() => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files?.item(0) !== undefined) {
                      setFile(files[0] ?? null);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="biography"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biography</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Update</Button>
        </div>
      </form>
    </Form>
  );
}
