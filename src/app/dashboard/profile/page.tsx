"use client";

import Image from "next/image";
import { Pencil2Icon } from "@radix-ui/react-icons";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export default function ProfilePage() {
  const userQuery = api.user.getMe.useQuery();

  // function formatAddress(address: string) {
  //   const city = address.split(",")[0];
  //   const state = address.split(",")[1]?.split(" ")[1];

  //   return city + ", " + state;
  // }

  if (userQuery.isLoading) {
    return <>Loading...</>;
  }

  if (userQuery.isError) {
    return <>Error fetching data.</>;
  }

  if (userQuery.isSuccess && userQuery.data) {
    return (
      <div className="flex h-full max-w-xl flex-col gap-2">
        <div className="flex items-center gap-4 border-b border-slate-300 p-3">
          <Image
            src={
              userQuery.data.profilePicture ?? "/default_profile_picture.png"
            }
            height={80}
            width={80}
            className="rounded-full"
            alt="Profile picture"
          />
          <div className="flex flex-col">
            <h4>
              {userQuery.data.firstName} {userQuery.data.lastName}
            </h4>
            <p>
              {userQuery.data.type === "careseeker"
                ? "Careseeker"
                : "Caregiver"}
            </p>
            {/* <p>{formatAddress(user.location.address)}</p> */}
          </div>
          <Button size="sm">Edit Profile</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Care Needs
              {/* on click will show render edit dialog */}
              <Button size="icon" variant="ghost">
                <Pencil2Icon />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h4 className="text-sm">{userQuery.data.biography}</h4>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Household
              <Button size="icon" variant="ghost">
                <Pencil2Icon />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-1 flex-col flex-wrap justify-between sm:flex-row">
              {userQuery.data.careseeker?.children ? (
                userQuery.data.careseeker?.children.map((child) => (
                  <div
                    className="flex w-[45%] items-center justify-between py-2"
                    key={child.name + "_" + child.age}
                  >
                    <div className="flex items-center space-x-3">
                      <p className="h-[40px] w-[40px] rounded-full bg-[#BDBDBD] text-center text-xl leading-10 text-white">
                        {child.name.charAt(0).toUpperCase()}
                      </p>
                      <p>{child.age} Years Old</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="">
                          <Pencil2Icon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))
              ) : (
                <>No children</>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Payment Information
              <Button size="icon" variant="ghost">
                <Pencil2Icon />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-start space-x-4">
              <p>Visa</p>
              <p>John Doe</p>
              <p>**** **** **** 1234</p>
              <p>10/2025</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
