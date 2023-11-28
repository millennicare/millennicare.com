import ContactUsForm from "./form";
export default function Page() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-evenly bg-cream px-10 md:flex-row">
      {/* Contact Us Message */}
      <div className="">
        <b className="font-sans text-5xl">Contact Our Team</b>
        <p className="font-sans">Let Us Know How We Can Help</p>
      </div>

      {/* Contact Us Form */}
      <div className="">
        <ContactUsForm />
      </div>
    </div>
  );
}
