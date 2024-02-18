"use client";

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
import { Children, childrenSchema } from "../slices/children-slice";
import useFormStore from "../useFormStore";

export default function ChildrenForm() {
  const { step, increaseStep, decreaseStep, children, setChildren } =
    useFormStore((state) => state);

  const form = useForm({
    schema: childrenSchema,
    defaultValues: {
      children:
        children.children.length === 0
          ? [{ name: "", age: 1 }]
          : children.children,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "children",
    rules: {
      minLength: 1,
    },
  });

  function onSubmit(values: Children) {
    setChildren(values);
    increaseStep(step);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 px-3"
      >
        <ul>
          {fields.map((item, index) => (
            <li key={item.id} className="flex space-x-2">
              <FormField
                control={form.control}
                name={`children.${index}.name`}
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
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
            </li>
          ))}
        </ul>

        <div>
          <Button
            className="p-0 text-black"
            variant="link"
            type="button"
            onClick={() => append({ name: "", age: 1 })}
          >
            Add child
          </Button>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => decreaseStep(step)}
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
