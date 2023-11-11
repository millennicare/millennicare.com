import { api } from "~/trpc/react";
import AppointmentCard from "../../_components/AppointmentCard";

export default function Page({ params }: { params: { id: string } }) {
  const query = api.appointment.getAppointmenyById.useQuery(params.id);
  if (query.isLoading) {
    return <>Loading...</>;
  }

  if (query.isError) {
    return <>Error fetching appointment details.</>;
  }

  if (query.isSuccess && query.data) {
    return (
      <div>
        <h1>Appointment</h1>
        <AppointmentCard id={query.data.id} />
      </div>
    );
  }
}
