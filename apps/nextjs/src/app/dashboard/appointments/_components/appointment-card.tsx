"use client";

interface AppointmentCardParams {
  id: string;
}

export default function AppointmentCard({ id }: AppointmentCardParams) {
  return (
    <div>
      <h1>Appointment Card {id}</h1>
    </div>
  );
}
