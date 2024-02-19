"use client";

import type { z } from "zod";
import { useState } from "react";

import type { selectChildSchema } from "@millennicare/validators";
import { Button } from "@millennicare/ui/button";
import { Card, CardHeader } from "@millennicare/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@millennicare/ui/dialog";

import AddChildForm from "../forms/add-child";
import ChildCard from "./child-card";

interface HouseHoldCardProps {
  data: z.infer<typeof selectChildSchema>[];
}

export function HouseholdCard({ data }: HouseHoldCardProps) {
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
        {data.length !== 0 ? (
          data.map((child) => <ChildCard child={child} key={child.id} />)
        ) : (
          <>No children</>
        )}
      </div>
    </>
  );
}
