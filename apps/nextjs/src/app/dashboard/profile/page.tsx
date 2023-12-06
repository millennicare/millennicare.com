"use client";

import Image from "next/image";
import { Pencil2Icon } from "@radix-ui/react-icons";
// import { Pencil2Icon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
// import { Button } from "~/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "~/components/ui/dropdown-menu";
import { api } from "~/utils/api";

export default function ProfilePage() {
  const userQuery = api.auth.getMe.useQuery();
  const childrenQuery = api.careseeker.getChildren.useQuery();

  const { data } = useQuery({
    queryKey: ["profilePicture", userQuery.data?.profilePicture],
    queryFn: getLink,
    enabled: !!userQuery.data?.profilePicture,
  });

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
      <div className="flex h-full w-full flex-col space-y-4">
        <div className="flex items-center gap-4 rounded-lg bg-white p-3">
          <Image
            src={data ?? "/default_profile_picture.png"}
            height={100}
            width={100}
            className="rounded-full"
            alt={`${userQuery.data.firstName} profile picture`}
          />

          <div>
            <p>
              {userQuery.data.firstName} {userQuery.data.lastName}
            </p>
            <p>{userQuery.data.email}</p>
            <p>{userQuery.data.address[0]?.zipCode}</p>
          </div>
        </div>

        <Card>
          <CardHeader>Household</CardHeader>
          <CardContent>
            <div className="flex flex-1 flex-col flex-wrap justify-between md:flex-row">
              {childrenQuery.data ? (
                childrenQuery.data.map((child) => (
                  <div
                    className="flex w-full items-center justify-between py-2 md:w-2/5"
                    key={child.name + "_" + child.age}
                  >
                    <div className="flex items-center space-x-3">
                      <p className="h-[40px] w-[40px] rounded-full bg-[#BDBDBD] text-center text-xl leading-10 text-white">
                        {child.name.charAt(0).toUpperCase()}
                      </p>
                      <p>{child.age} Years Old</p>
                    </div>
                    <DropdownMenu>
                      <Button variant="ghost" size="icon" className="" asChild>
                        <DropdownMenuTrigger>
                          <Pencil2Icon />
                        </DropdownMenuTrigger>
                      </Button>

                      <DropdownMenuContent>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">
                          Delete
                        </DropdownMenuItem>
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
      </div>
      //           <p>{userQuery.data.userType}</p>
      //           {/* <p>{formatAddress(user.location.address)}</p> */}
      //         </div>
      //         <Button size="sm">Edit Profile</Button>
      //       </div>

      //       <Card>
      //         <CardHeader>
      //           <CardTitle>
      //             Care Needs
      //             {/* on click will show render edit dialog */}
      //             <Button size="icon" variant="ghost">
      //               <Pencil2Icon />
      //             </Button>
      //           </CardTitle>
      //         </CardHeader>
      //         <CardContent>
      //           <h4 className="text-sm">{userQuery.data.biography}</h4>
      //         </CardContent>
      //       </Card>

      //       <Card>
      //         <CardHeader>
      //           <CardTitle>
      //             Household
      //             <Button size="icon" variant="ghost">
      //               <Pencil2Icon />
      //             </Button>
      //           </CardTitle>
      //         </CardHeader>
      //         <CardContent>
      //           {/* <div className="flex flex-1 flex-col flex-wrap justify-between sm:flex-row">
      //             {userQuery.data.careseeker?.children ? (
      //               userQuery.data.careseeker?.children.map((child) => (
      //                 <div
      //                   className="flex w-[45%] items-center justify-between py-2"
      //                   key={child.name + "_" + child.age}
      //                 >
      //                   <div className="flex items-center space-x-3">
      //                     <p className="h-[40px] w-[40px] rounded-full bg-[#BDBDBD] text-center text-xl leading-10 text-white">
      //                       {child.name.charAt(0).toUpperCase()}
      //                     </p>
      //                     <p>{child.age} Years Old</p>
      //                   </div>
      //                   <DropdownMenu>
      //                     <DropdownMenuTrigger>
      //                       <Button variant="ghost" size="icon" className="">
      //                         <Pencil2Icon />
      //                       </Button>
      //                     </DropdownMenuTrigger>
      //                     <DropdownMenuContent>
      //                       <DropdownMenuItem>Edit</DropdownMenuItem>
      //                       <DropdownMenuItem>Delete</DropdownMenuItem>
      //                     </DropdownMenuContent>
      //                   </DropdownMenu>
      //                 </div>
      //               ))
      //             ) : (
      //               <>No children</>
      //             )}
      //           </div> */}
      //         </CardContent>
      //       </Card>

      //       <Card>
      //         <CardHeader>
      //           <CardTitle>
      //             Payment Information
      //             <Button size="icon" variant="ghost">
      //               <Pencil2Icon />
      //             </Button>
      //           </CardTitle>
      //         </CardHeader>
      //         <CardContent>
      //           <div className="flex justify-start space-x-4">
      //             <p>Visa</p>
      //             <p>John Doe</p>
      //             <p>**** **** **** 1234</p>
      //             <p>10/2025</p>
      //           </div>
      //         </CardContent>
      //       </Card>
      //     </div>
    );
  }
}
