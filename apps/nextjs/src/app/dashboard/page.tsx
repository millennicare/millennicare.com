import { getLastAppointment, getNextAppointment } from "./_actions/appointment";
import { getUserData } from "./_actions/auth";
import AppointmentTile from "./_components/appointment-tile";
import TopNav from "./_components/top-nav";

export const runtime = "edge";

export default async function DashboardPage() {
  const user = await getUserData();
  const nextAppt = await getNextAppointment();
  const lastAppt = await getLastAppointment();

  return (
    <div className="flex h-full w-full flex-col">
      <TopNav firstName={user.firstName} />
      <main className="flex h-3/5 flex-wrap justify-between">
        <AppointmentTile title="Next Appointment" id={nextAppt?.id} />
        <AppointmentTile title="Last Appointment" id={lastAppt?.id} />
      </main>
    </div>
  );
}
