"use client";

import { useState } from "react";
import { Pencil2Icon, PlusCircledIcon } from "@radix-ui/react-icons";

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
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import AddChildForm from "./forms/AddChildForm";
import EditChildForm from "./forms/EditChildForm";

export function HouseholdCard() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const utils = api.useUtils();
  const childrenQuery = api.children.getByCareseekerId.useQuery();
  const deleteMutation = api.children.delete.useMutation({
    onSuccess() {
      // clear child cache so it will refetch after deletion
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

  if (childrenQuery.data) {
    return (
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <>Household</>
          <Dialog open={open} onOpenChange={setOpen}>
            <Button asChild variant="link" className="h-fit p-0 underline">
              <DialogTrigger>Add child</DialogTrigger>
            </Button>
            <DialogContent>
              <AddChildForm setOpen={setOpen} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex flex-1 flex-col flex-wrap justify-between md:flex-row">
            {childrenQuery.data.length !== 0 ? (
              childrenQuery.data.map((child) => (
                <div
                  className="flex w-full items-center justify-between py-2 md:w-2/5"
                  key={child.id}
                >
                  <div className="flex items-center space-x-3">
                    <p className="h-[40px] w-[40px] rounded-full bg-[#BDBDBD] text-center text-xl leading-10 text-white">
                      {child.name.charAt(0).toUpperCase()}
                    </p>
                    <p>{child.age} Years Old</p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4"
                      >
                        <Pencil2Icon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <Dialog>
                        <DialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            Edit
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                          <EditChildForm childId={child.id} />
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
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
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
                </div>
              ))
            ) : (
              <>No children</>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
}
