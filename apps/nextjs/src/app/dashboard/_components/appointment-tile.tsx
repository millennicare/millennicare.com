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
import { getAppointmentData } from "../_actions/appointment";
import AppointmentCard from "../appointments/_components/appointment-card";

interface AppointmentTileProps {
  id?: string;
  title: string;
}

export default async function AppointmentTile({
  id,
  title,
}: AppointmentTileProps) {
  if (!id) {
    return (
      <Card className="h-fit w-full md:w-1/2">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <h1>{title}</h1>
            <Button
              variant="link"
              className="p-0 text-gray-400 underline"
              asChild
            >
              <Link href="/dashboard/appointments">View All</Link>
            </Button>
          </CardTitle>
          <CardContent>No appointments. Book one today!</CardContent>
        </CardHeader>
      </Card>
    );
  }
  const data = await getAppointmentData(id);

  return (
    <Card className="h-fit w-full md:w-1/2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
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
        <Link href={`appointments/${data.id}`}>
          <AppointmentCard id={data.id} />
        </Link>
      </CardContent>
    </Card>
  );
}
