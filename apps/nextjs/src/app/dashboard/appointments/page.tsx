"use client";

import { api } from "~/trpc/react";

export default function Page() {
  const apptQuery = api.appointment.getAppointmentsByUserId.useQuery();

  if (apptQuery.isLoading) {
    return <>Loading...</>;
  }

  if (apptQuery.isError) {
    return <>Error fetching appointments</>;
  }

  if (apptQuery.data) {
    console.log(apptQuery.data);
    return (
      <>
        <p>Appointments Page</p>
      </>
    );
  }
}
