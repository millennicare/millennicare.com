"use client";

import Link from "next/link";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/utils/api";
import AppointmentCard from "./_components/AppointmentCard";

export default function DashboardPage() {
  const nextAppointment = api.appointment.getNextAppointment.useQuery();
  const lastAppointment =
    api.appointment.getLastCompletedAppointment.useQuery();

  return (
    <div className="flex h-full w-full flex-col">
      <main className="flex h-3/5 flex-wrap justify-between space-y-4 md:space-y-0">
        <Card className="h-2/5 w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Next Appointment</CardTitle>
            <CardDescription>
              <Button
                variant="link"
                className="p-0 text-gray-400 underline"
                asChild
              >
                <Link href="/dashboard/appointments">View All</Link>
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {nextAppointment.data ? (
              <Link href={`appointments/${nextAppointment.data.id}`}>
                <AppointmentCard id={nextAppointment.data.id} />
              </Link>
            ) : (
              <h4>No appointments</h4>
            )}
          </CardContent>
        </Card>
        <Card className="h-2/5 w-full md:w-2/5">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
        </Card>
        <Card className="h-2/5 w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Last Appointment</CardTitle>
            <CardDescription>
              <Button
                variant="link"
                className="p-0 text-gray-400 underline"
                asChild
              >
                <Link href="/dashboard/appointments">View All</Link>
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lastAppointment.data ? (
              <Link href={`appointments/${lastAppointment.data.id}`}>
                <AppointmentCard id={lastAppointment.data.id} />
              </Link>
            ) : (
              <h4>No appointments</h4>
            )}
          </CardContent>
        </Card>
        <Card className="h-2/5 w-full md:w-2/5">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

/**
 *  <div className="h-1/4 md:w-[45%]">
          <div className="mb-2 flex flex-col justify-between md:flex-row">
            <p>UPCOMING APPOINTMENTS</p>
            <Link href="/dashboard/appointments">
              <p className="text-primary hover:underline">VIEW ALL</p>
            </Link>
          </div>
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
 */
