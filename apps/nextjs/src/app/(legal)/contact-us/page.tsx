import ContactUsForm from "./form";

export default function Page() {
  return (
    <div className="bg-cream flex h-screen w-screen flex-col items-center justify-evenly md:flex-row">
      {/* Contact Us Message */}
      <div>
        <b className="font-sans text-5xl ">Contact Our Team</b>
        <p className="font-sans">Let Us Know How We Can Help</p>
      </div>

      {/* Contact Us Form */}
      <div className="">
        <ContactUsForm />
      </div>
    </div>
  );
}
