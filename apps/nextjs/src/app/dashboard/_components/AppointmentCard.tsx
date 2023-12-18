// import Image from "next/image";
// import moment from "moment";

// import { api } from "~/utils/api";

interface Params {
  id: string;
}

// const monthNames = [
//   "JAN",
//   "FEB",
//   "MAR",
//   "APR",
//   "MAY",
//   "JUN",
//   "JUL",
//   "AUG",
//   "SEP",
//   "OCT",
//   "NOV",
//   "DEC",
// ];

const AppointmentCard = ({ id }: Params) => {
  return <div>appointment card {id}</div>;
  // const formatTime = (time: Date) => moment(time).format("LT");

  // const query = api.appointment.getAppointmenyById.useQuery(id);

  // if (query.isLoading) {
  //   return <>Loading...</>;
  // }

  // if (query.isError) {
  //   return <>Error fetching appointment details.</>;
  // }

  // const caregiverId = query.data?.caregiverId;
  // const caregiverQuery = api.caregiver.getById.useQuery(caregiverId!, {
  //   enabled: !!caregiverId,
  // });

  // if (
  //   query.isSuccess &&
  //   query.data &&
  //   caregiverQuery.isSuccess &&
  //   caregiverQuery.data
  // ) {
  //   return (
  //     <div className="flex h-max w-full flex-row justify-between rounded-md border bg-background p-4 shadow-md">
  //       <div className="flex flex-row items-center">
  //         <Image
  //           src={
  //             caregiverQuery.data.profilePicture ??
  //             "/default_profile_picture.png"
  //           }
  //           height={48}
  //           width={48}
  //           alt="Caregiver profile photo"
  //         />
  //         <div className="flex flex-col pl-3">
  //           <p>Appointment with {caregiverQuery.data.name}</p>
  //           <p>Amount: ${query.data.Service.price.toString()}</p>
  //         </div>
  //       </div>
  //       <div className="flex flex-col items-center justify-center pl-2">
  //         <h4 className="text-xs">
  //           {monthNames[new Date(query.data.startTime).getMonth()]}
  //         </h4>
  //         <h3 className="font-sans">
  //           {new Date(query.data.startTime).getDate()}{" "}
  //         </h3>
  //         <h4 className="text-xs">
  //           {new Date(query.data.startTime).getFullYear()}
  //         </h4>
  //         <h4 className="text-xs">
  //           {formatTime(new Date(query.data.startTime))}{" "}
  //         </h4>
  //       </div>
  //     </div>
  //   );
  // }
};

export default AppointmentCard;
