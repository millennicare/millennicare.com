import { useState } from "react";
import { Pencil2Icon } from "@radix-ui/react-icons";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import EditChildForm from "./forms/EditChildForm";

type Props = {
  readonly child: {
    id: string;
    name: string;
    age: number;
  };
};

export default function ChildCard({ child }: Props) {
  const [openEditForm, setOpenEditForm] = useState(false);
  const { toast } = useToast();
  const utils = api.useUtils();

  const deleteMutation = api.children.delete.useMutation({
    onSuccess() {
      utils.children.invalidate();
    },
  });

  async function handleDelete(childId: string) {
    try {
      await deleteMutation.mutateAsync({ childId });
      toast({
        title: "Child deleted",
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card
      className="flex h-16 w-full items-center justify-around md:w-2/5"
      key={child.id}
    >
      <p>{child.name}</p>
      <p>{child.age} Years Old</p>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button asChild variant="ghost" size="icon" className="h-4 w-4">
            <Pencil2Icon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Dialog open={openEditForm} onOpenChange={setOpenEditForm}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Edit
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <EditChildForm child={child} setOpenEditForm={setOpenEditForm} />
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-red-500"
              >
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={() => handleDelete(child.id)}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
