import { api } from "~/trpc/server";
import ContactUsForm from "./contact-form";

export default function Page() {
  const create = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    message: string;
  }) => {
    "use server";

    await api.contactUs.sendMessage(values);
  };

  return (
    <div className="bg-cream flex h-screen w-screen flex-col items-center justify-evenly md:flex-row">
      <div>
        <b className="font-sans text-5xl ">Contact Our Team</b>
        <p className="font-sans">Let Us Know How We Can Help</p>
      </div>
      <ContactUsForm create={create} />
    </div>
  );
}
