import { Separator } from "@millennicare/ui/separator";

import { api } from "~/trpc/server";
import ListPayments from "./_components/list-payments";

export default async function PaymentPage() {
  const user = await api.auth.getMe();
  const payments = await api.careseeker.getPaymentMethodsByCustomerId();

  return (
    <div className="w-full space-y-6 px-2 py-3 lg:w-3/4">
      <div>
        <h3 className="text-lg font-medium">Payments</h3>
        <p className="text-sm text-muted-foreground">
          View, edit, or delete your payment methods.
        </p>
      </div>
      <Separator />
      {/*  */}
      <ListPayments payments={payments} user={user} />
    </div>
  );
}
