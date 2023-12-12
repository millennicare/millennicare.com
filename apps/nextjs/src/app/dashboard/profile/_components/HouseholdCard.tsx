"use client";

import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Card, CardHeader } from "~/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { api } from "~/utils/api";
import ChildCard from "./ChildCard";
import AddChildForm from "./forms/AddChildForm";

export function HouseholdCard() {
  const [openAddForm, setOpenAddForm] = useState(false);
  const childrenQuery = api.children.getByCareseekerId.useQuery();

  if (childrenQuery.data) {
    return (
      <>
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <>Household</>
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
        <div className="flex flex-col space-y-2 md:space-y-0 flex-wrap md:justify-between md:flex-row">
          {childrenQuery.data.length !== 0 ? (
            childrenQuery.data.map((child) => (
              <ChildCard child={child} key={child.id} />
            ))
          ) : (
            <>No children</>
          )}
        </div>
      </>
    );
  }
}
