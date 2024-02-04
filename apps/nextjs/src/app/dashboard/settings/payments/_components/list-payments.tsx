"use client";

import { useState } from "react";
import { z } from "zod";

import { Button } from "@millennicare/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@millennicare/ui/dialog";
import { selectUserSchema } from "@millennicare/validators";

import { deletePayment } from "../actions";
import AddPaymentMethodForm from "../forms/add-payment";

type ListPaymentsProps = {
  payments: {
    id: string;
    brand?: string;
    last4?: string;
    exp_month?: number;
    exp_year?: number;
  }[];
  user: z.infer<typeof selectUserSchema>;
};

export default function ListPayments({ payments, user }: ListPaymentsProps) {
  const [openAddForm, setOpenAddForm] = useState(false);

  async function handleDelete(payment_method_id: string) {
    try {
      await deletePayment({ payment_method_id });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      {payments.length === 0 ? (
        <div>
          <Dialog open={openAddForm} onOpenChange={setOpenAddForm}>
            <h1>
              No payment methods, add one{" "}
              <Button variant="link" className="p-0" asChild>
                <DialogTrigger>here.</DialogTrigger>
              </Button>
            </h1>

            <DialogContent>
              <AddPaymentMethodForm
                user={user}
                setOpenAddForm={setOpenAddForm}
              />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div>
          {payments.map((payment) => (
            <pre>{JSON.stringify(payment, null, 2)}</pre>
          ))}
        </div>
      )}
    </div>
  );
}
