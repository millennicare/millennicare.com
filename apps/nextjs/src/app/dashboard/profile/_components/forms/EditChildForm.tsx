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
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";

interface Props {
  readonly childId: string;
}

const formSchema = z.object({
  age: z.number().int().min(0).max(18),
  name: z.string(),
});

export default function EditChildForm({ childId }: Props) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const updateMutation = api.children.update.useMutation();
  const child = api.children.getById.useQuery({ childId });

  if (child.isLoading) {
    return <>Loading...</>;
  }

  if (child.isError) {
    return <>Error</>;
  }

  if (child.data) {
    return (
      <div>
        <pre>{JSON.stringify(child.data, null, 2)}</pre>
      </div>
    );
  }
}
