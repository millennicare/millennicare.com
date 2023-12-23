import { api } from "~/trpc/server";

export async function editChild(values: {
  childId: string;
  name: string;
  age: number;
}) {
  await api.children.update.mutate(values);
}

export async function getChildren() {
  const response = await api.children.getByCareseekerId.query();
  return response;
}
