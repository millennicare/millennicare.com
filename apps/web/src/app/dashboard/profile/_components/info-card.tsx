"use client";

import Image from "next/image";

import type { User, UserInfo } from "@millennicare/validators";

interface InfoCardProps {
  user: User;
  userInfo: UserInfo;
  proflePictureUrl?: string;
}

export function InfoCard({ user, userInfo, proflePictureUrl }: InfoCardProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-lg bg-background p-3 md:flex-row">
      <div className="flex w-full flex-col items-center space-y-4 text-center md:flex-row md:space-x-4 md:space-y-0 md:text-left">
        <Image
          src={proflePictureUrl ?? "/default_profile_picture.png"}
          height={80}
          width={80}
          className="rounded-full"
          alt={`${userInfo.name} profile picture`}
          priority
        />

        <div>
          <p>{userInfo.name}</p>
          <p>{user.email}</p>
        </div>
      </div>
    </div>
  );
}
