import type { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@millennicare/ui/form";
import { Input } from "@millennicare/ui/input";
import { toast } from "@millennicare/ui/toast";
import { createChildSchema } from "@millennicare/validators";

import { SubmitButton } from "~/app/_components/submit-btn";
import { editChild } from "../actions";

interface Props {
  readonly child: {
    id: string;
    name: string;
    age: number;
  };
  setOpenEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const schema = createChildSchema.pick({
  name: true,
  age: true,
});

export default function EditChildForm({ child, setOpenEditForm }: Props) {
  const form = useForm({
    schema: schema,
    defaultValues: {
      name: child.name,
      age: child.age,
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      const data = { ...values, id: child.id };
      await editChild(data);
      setOpenEditForm(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return (
    <>
      <h1>Edit child</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col justify-between space-y-4 md:flex-row md:space-y-0">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <SubmitButton value="Update" error={!form.formState.errors} />
        </form>
      </Form>
    </>
  );
}
