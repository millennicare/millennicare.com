import ContactUsForm from "./contact-form";

export default function Page() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center space-y-4 px-4 py-6 md:flex-row md:justify-evenly md:space-y-0">
      <span className="w-full text-center md:w-1/3">
        <b className="font-sans text-5xl">Contact Us</b>
        <p className="font-sans">Let us know how we can help</p>
      </span>
      <div className="w-full md:w-1/3">
        <ContactUsForm />
      </div>
    </div>
  );
}
