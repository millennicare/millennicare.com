"use client";

import Link from "next/link";

import { api } from "~/trpc/react";
import AppointmentCard from "./_components/AppointmentCard";

export default function Page() {
  const user = api.user.getMe.useQuery();
  const nextAppointment = api.appointment.getNextAppointment.useQuery();
  const lastAppointment =
    api.appointment.getLastCompletedAppointment.useQuery();

  // @TODO: create getNextAppointment and getLastCompletedAppointment
  // in appointment.router
  if (user.isLoading) {
    return <>Loading...</>;
  }

  if (user.isError) {
    return <>Error fetching data</>;
  }

  if (user.isSuccess && user.data) {
    return (
      <div className="flex h-full w-full flex-1 flex-wrap justify-between">
        <div className="mb-2 h-12 w-full border-b border-slate-300">
          <h2 className="font-mono text-xl font-semibold">
            Hello, {user.data.firstName}!
          </h2>
        </div>
        <div className="h-1/4 md:w-[45%]">
          <div className="mb-2 flex flex-col justify-between md:flex-row">
            <p>UPCOMING APPOINTMENTS</p>
            <Link href="/dashboard/appointments">
              <p className="text-primary hover:underline">VIEW ALL</p>
            </Link>
          </div>
          {/** if there is an id received, render a card */}
          {nextAppointment.data ? (
            <Link href={`appointments/${nextAppointment.data.id}`}>
              <AppointmentCard id={nextAppointment.data.id} />
            </Link>
          ) : (
            <h4>No appointments</h4>
          )}
        </div>
        <div className="h-1/4 md:w-[45%]">
          <div className="mb-2 flex flex-col justify-between md:flex-row">
            <p>PAST APPOINTMENTS</p>
            <Link href="/dashboard/appointments">
              <p className="text-primary hover:underline">VIEW ALL</p>
            </Link>
          </div>
          {lastAppointment.data ? (
            <Link href={`appointments/${lastAppointment.data.id}`}>
              <AppointmentCard id={lastAppointment.data.id} />
            </Link>
          ) : (
            <h4>No appointments</h4>
          )}
        </div>
        <div className="h-1/4 w-[45%]">
          <p className="mb-2">FAVORITES</p>
          <div className="h-[140px] rounded-md bg-white shadow-md">{"  "}</div>
        </div>

        <div className="h-1/4 w-[45%]">
          <p className="mb-2">MILLENNICARE CREDITS</p>
          <div className="h-[140px] rounded-md bg-white shadow-md">{"  "}</div>
        </div>
        <div className="mb-2 h-1/4 w-full">
          <p className="mb-2">RECCOMENDED</p>
          <div className="flex flex-row space-x-2 overflow-x-hidden">
            <div className="h-[140px] w-1/5 rounded-md bg-white shadow-md">
              {"  "}
            </div>
            <div className="h-[140px] w-1/5 rounded-md bg-white shadow-md">
              {"  "}
            </div>
            <div className="h-[140px] w-1/5 rounded-md bg-white shadow-md">
              {"  "}
            </div>
            <div className="h-[140px] w-1/5 rounded-md bg-white shadow-md">
              {"  "}
            </div>
            <div className="h-[140px] w-1/5 rounded-md bg-white shadow-md">
              {"  "}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
