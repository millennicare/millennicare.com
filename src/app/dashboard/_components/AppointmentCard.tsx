import { api } from "~/trpc/react";

type Params = {
  id: string;
};

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
  const query = api.appointment.getAppointmenyById.useQuery(id);
  // @TODO: create caregiver/careseeker routers
  if (query.isLoading) {
    return <>Loading...</>;
  }

  if (query.isError) {
    return <>Error fetching appointment details.</>;
  }

  if (query.isSuccess && query.data) {
    return <div>Appointment {id}</div>;
  }
};

export default AppointmentCard;
