import { api } from "~/trpc/server";

export default async function AppointmentsPage() {
  const appointments = await api.appointment.getAppointmentsByUserId();

  console.log(appointments);
  return (
    <div>
      <h1>Appointment page</h1>
    </div>
  );
}
