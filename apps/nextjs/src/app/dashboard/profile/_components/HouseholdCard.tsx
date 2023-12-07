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
  const [openAddForm, setOpenAddForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const { toast } = useToast();
  const utils = api.useUtils();
  const childrenQuery = api.children.getByCareseekerId.useQuery();
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

  if (childrenQuery.data) {
    return (
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <>Household</>
          <Dialog open={openAddForm} onOpenChange={setOpenAddForm}>
            <Button asChild variant="link" className="h-fit p-0 underline">
              <DialogTrigger>Add child</DialogTrigger>
            </Button>
            <DialogContent>
              <AddChildForm setOpenAddForm={setOpenAddForm} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex flex-1 flex-wrap justify-between md:flex-row">
            {childrenQuery.data.length !== 0 ? (
              childrenQuery.data.map((child) => (
                <div
                  className="flex w-2/5 items-center justify-between py-2"
                  key={child.id}
                >
                  <p className="h-10 w-10 rounded-full bg-gray-500 text-center text-xl leading-10 text-white">
                    {child.name.charAt(0).toUpperCase()}
                  </p>
                  <p>{child.age} Years Old</p>

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
                      <Dialog
                        open={openEditForm}
                        onOpenChange={setOpenEditForm}
                      >
                        <DialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            Edit
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                          <EditChildForm
                            child={child}
                            setOpenEditForm={setOpenEditForm}
                          />
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
