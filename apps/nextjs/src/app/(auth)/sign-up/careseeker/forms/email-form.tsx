"use client";

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

import type { Email } from "../slices/email-slice";
import { SubmitButton } from "~/app/_components/submit-btn";
import { checkDuplicateEmail } from "../../actions";
import { emailSchema } from "../slices/email-slice";
import useFormStore from "../useFormStore";

export default function EmailForm() {
  const { step, increaseStep, email, setEmail } = useFormStore(
    (state) => state,
  );

  const form = useForm({
    schema: emailSchema,
    defaultValues: { ...email },
  });

  async function onSubmit(values: Email) {
    try {
      await checkDuplicateEmail(values.email);
      setEmail(values);
      increaseStep(step);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 px-3"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton value="Next" error={!form.formState.errors} />

        {/* <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or sign up with
            </span>
          </div>
        </div>
        <Button className="w-full" type="button" asChild>
          <Link href="/sign-in/google">
            <Icons.google className="mr-3 h-4 w-4" />
            Google
          </Link>
        </Button> */}
      </form>
    </Form>
  );
}
