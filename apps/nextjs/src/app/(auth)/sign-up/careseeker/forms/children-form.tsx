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

import type { ChildrenInfo } from "../slices/children-slice";
import { SubmitButton } from "~/app/_components/submit-btn";
import { childrenSchema } from "../slices/children-slice";
import useFormStore from "../useFormStore";

export default function ChildrenForm() {
  const { childrenInfo, setChildrenInfo, increaseStep, decreaseStep } =
    useFormStore((state) => state);

  const form = useForm({
    schema: childrenSchema,
    // checks to see if 'children' field are already in and sets the default values
    defaultValues: {
      children:
        childrenInfo.children.length !== 0
          ? childrenInfo.children
          : [{ name: "", age: 1 }],
    },
    mode: "onBlur",
  });
  const { fields, append, remove } = useFieldArray({
    name: "children",
    control: form.control,
    rules: { minLength: 1 },
  });

  function onSubmit(values: ChildrenInfo) {
    setChildrenInfo({
      children: { ...childrenInfo.children, ...values.children },
    });
    increaseStep(2);
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4 px-2 py-4"
        onSubmit={form.handleSubmit(onSubmit)}
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
                      <Input {...field} type="number" />
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
            onClick={() => decreaseStep(2)}
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
