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
import { api } from "~/trpc/react";
import AppointmentCard from "../appointments/_components/appointment-card";

interface AppointmentTileProps {
  id?: string;
  title: string;
}

export default function AppointmentTile({ id, title }: AppointmentTileProps) {
  if (!id) {
    return (
      <Card className="h-fit w-full md:w-1/2">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <>{title}</>
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
  const query = api.appointment.getAppointmentById.useQuery({ id });
  if (query.isLoading) {
    return <>Loading...</>;
  }

  if (query.isError) {
    return <>Error fetching data.</>;
  }

  if (query.data) {
    return (
      <Card className="h-fit w-full md:w-1/2">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <>{title}</>
            <Button
              variant="link"
              className="p-0 text-gray-400 underline"
              asChild
            >
              <Link href="/dashboard/appointments">View All</Link>
            </Button>
          </CardTitle>

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
          <Link href={`appointments/${query.data.id}`}>
            <AppointmentCard id={query.data.id} />
          </Link>
        </CardContent>
      </Card>
    );
  }
}
