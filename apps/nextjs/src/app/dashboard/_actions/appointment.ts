"use server";

import { api } from "~/trpc/server";

export async function getAppointmentData(id: string) {
  const response = await api.appointment.getAppointmentById.query({
    id,
  });

  return response;
}

export async function getNextAppointment() {
  const nextAppointment = await api.appointment.getNextAppointment.query();
  return nextAppointment;
}

export async function getLastAppointment() {
  const lastAppointment =
    await api.appointment.getLastCompletedAppointment.query();

  return lastAppointment;
}

export async function getAllAppointments() {
  const response = await api.appointment.getAppointmentsByUserId.query();
  return response;
}
