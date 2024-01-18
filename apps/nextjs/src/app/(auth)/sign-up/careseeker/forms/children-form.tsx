"use client";

import { z } from "zod";

import { Button } from "@millennicare/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFieldArray,
  useForm,
} from "@millennicare/ui/form";
import { Input } from "@millennicare/ui/input";

import { SubmitButton } from "~/app/_components/submit-btn";
import useFormStore from "../useFormStore";

const formSchema = z.object({
  children: z.array(
    z.object({ name: z.string(), age: z.coerce.number().min(0).max(18).int() }),
  ),
});

export default function ChildrenForm() {
  const { childrenInfo, setChildrenInfo, increaseStep, decreaseStep } =
    useFormStore((state) => state);

  const form = useForm({
    schema: formSchema,
    defaultValues: {
      children:
        childrenInfo.children.length !== 0
          ? childrenInfo.children
          : [{ name: "", age: 1 }],
    },
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    name: "children",
    control: form.control,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setChildrenInfo({ children: values.children });
    increaseStep(2);
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4 px-2 py-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {fields.map((item, index) => (
          <span key={item.id} className="flex space-x-2">
            <FormField
              control={form.control}
              name={`children.${index}.name`}
              render={({ field }) => (
                <FormItem className="w-2/3">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`children.${index}.age`}
              render={({ field }) => (
                <FormItem className="w-1/3">
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input placeholder="Age" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              variant="destructive"
              type="button"
              onClick={() => remove(index)}
              className="self-end"
            >
              Delete
            </Button>
          </span>
        ))}

        <div>
          <Button variant="ghost" onClick={() => append({ name: "", age: 0 })}>
            Add child
          </Button>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => decreaseStep(2)}
            className="disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none"
          >
            Back
          </Button>
          <SubmitButton
            value="Next"
            className="text-background"
            error={!form.formState.isValid}
          />
        </div>
      </form>
    </Form>
  );
}
