"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

import { api } from "~/trpc/react";

export function InfoCard() {
  const userQuery = api.auth.getMe.useQuery();

  const { data } = useQuery({
    queryKey: ["profilePicture", userQuery.data?.profilePicture],
    queryFn: getLink,
    enabled: !!userQuery.data?.profilePicture,
  });

  if (userQuery.isLoading) {
    return <>Loading...</>;
  }

  if (userQuery.isError) {
    return <>Error fetching data.</>;
  }

  async function getLink() {
    const res = await fetch(
      `/api/documents?key=${userQuery.data?.profilePicture}`,
    );
    if (!res.ok) {
      throw new Error("Error fetching profile picture");
    }
    const json = (await res.json()) as { url: string };
    return json.url;
  }

  if (userQuery.isSuccess && userQuery.data) {
    return (
      <div className="bg-background flex flex-col items-center justify-between gap-4 rounded-lg p-3 md:flex-row">
        <div className="flex w-full flex-col items-center space-y-4 text-center md:flex-row md:space-x-4 md:space-y-0 md:text-left">
          <Image
            src={data ?? "/default_profile_picture.png"}
            height={100}
            width={100}
            className="rounded-full"
            alt={`${userQuery.data.firstName} profile picture`}
            priority
          />

          <div>
            <p>
              {userQuery.data.firstName} {userQuery.data.lastName}
            </p>
            <p>{userQuery.data.email}</p>
            <p>{userQuery.data.address[0]?.zipCode}</p>
          </div>
        </div>
      </div>
    );
  }
}
