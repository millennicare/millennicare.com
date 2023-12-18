"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { api } from "~/utils/api";

const formSchema = z.object({
  email: z.string().email().optional(),
  biography: z.string().optional().nullish(),
  password: z.string(),
});

export default function EditProfileForm() {
  const me = api.auth.getMe.useQuery();
  const utils = api.useUtils();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: me.data?.email,
      password: "",
      biography: me.data?.biography ?? undefined,
    },
    mode: "onTouched",
  });

  if (me.isLoading) {
    return <>Loading...</>;
  }

  if (me.error) {
    return <>Error</>;
  }

  async function handleSubmit() {
    // if email has been changed, update stripe and clerk info
  }
  // shows profile info
  // first/last name, biography, profile picture
  return (
    <div>
      <h1>Settings page</h1>
      <pre>{me.data ? JSON.stringify(me.data, null, 2) : ""}</pre>
    </div>
  );
}
