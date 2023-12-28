import { getAllAppointments } from "../_actions/appointment";

export const runtime = "edge";

export default async function AppointmentsPage() {
  const appointments = await getAllAppointments();
  console.log(appointments);
  return (
    <div>
      <h1>Appointment page</h1>
    </div>
  );
}
