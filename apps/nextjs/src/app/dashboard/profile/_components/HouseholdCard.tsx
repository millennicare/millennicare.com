"use client";

import { useState } from "react";
import { z } from "zod";

import { selectChildrenSchema } from "@millennicare/db";

import { Button } from "~/components/ui/button";
import { Card, CardHeader } from "~/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import ChildCard from "./ChildCard";
import AddChildForm from "./forms/AddChildForm";

interface HouseHoldCardProps {
  children: z.infer<typeof selectChildrenSchema>[];
}
export function HouseholdCard({ children }: HouseHoldCardProps) {
  const [openAddForm, setOpenAddForm] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <h1>Household</h1>
          <Dialog open={openAddForm} onOpenChange={setOpenAddForm}>
            <Button asChild variant="link" className="h-fit p-0">
              <DialogTrigger>Add child</DialogTrigger>
            </Button>
            <DialogContent>
              <AddChildForm setOpenAddForm={setOpenAddForm} />
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>
      <div className="flex flex-col flex-wrap space-y-2 md:flex-row md:justify-between md:space-y-0">
        {children.length !== 0 ? (
          children.map((child) => <ChildCard child={child} key={child.id} />)
        ) : (
          <>No children</>
        )}
      </div>
    </>
  );
}
