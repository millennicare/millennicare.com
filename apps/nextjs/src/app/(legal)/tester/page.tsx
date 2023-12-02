"use client";

import { api } from "~/utils/api";

export default function Page() {
  const mutation = api.service.getByZipCode.useMutation();

  async function handleSubmit() {
    try {
      await mutation.mutateAsync({
        zipCode: "94080",
        category: "housekeeping",
        radius: 5,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <button onClick={handleSubmit}>Click me</button>
    </div>
  );
}
