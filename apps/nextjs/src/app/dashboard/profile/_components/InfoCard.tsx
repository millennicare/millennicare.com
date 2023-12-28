"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import type { z } from "zod";

import type { selectUserSchema } from "@millennicare/db";

type InfoCardProps = {
  user: z.infer<typeof selectUserSchema>;
};

export function InfoCard({ user }: InfoCardProps) {
  const { data } = useQuery({
    queryKey: ["profilePicture", user.profilePicture],
    queryFn: getLink,
    enabled: !!user.profilePicture,
  });

  async function getLink() {
    const res = await fetch(`/api/documents?key=${user.profilePicture}`);
    if (!res.ok) {
      throw new Error("Error fetching profile picture");
    }
    const json = (await res.json()) as { url: string };
    return json.url;
  }

  return (
    <div className="bg-background flex flex-col items-center justify-between gap-4 rounded-lg p-3 md:flex-row">
      <div className="flex w-full flex-col items-center space-y-4 text-center md:flex-row md:space-x-4 md:space-y-0 md:text-left">
        <Image
          src={data ?? "/default_profile_picture.png"}
          height={80}
          width={80}
          className="rounded-full"
          alt={`${user.firstName} profile picture`}
          priority
        />

        <div>
          <p>
            {user.firstName} {user.lastName}
          </p>
          <p>{user.email}</p>
        </div>
      </div>
    </div>
  );
}
