import AppointmentTile from "./_components/appointment-tile";
import TopNav from "./_components/top-nav";
import { getLastAppointment, getNextAppointment } from "./actions/appointment";
import { getUserData } from "./actions/auth";

export default async function DashboardPage() {
  const user = await getUserData();
  const nextAppt = await getNextAppointment();
  const lastAppt = await getLastAppointment();

  return (
    <div className="flex h-full w-full flex-col">
      <TopNav firstName={user.firstName} />
      <main className="flex h-3/5 flex-wrap justify-between">
        <AppointmentTile
          title="Next Appointment"
          id={nextAppt ? nextAppt.id : undefined}
        />
        <AppointmentTile
          title="Last Appointment"
          id={lastAppt ? lastAppt.id : undefined}
        />
      </main>
    </div>
  );
}
