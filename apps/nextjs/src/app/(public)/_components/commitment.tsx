import Image from "next/image";

const Commitment = () => {
  return (
    <div
      id="commitment"
      className="bg-palecream flex h-full flex-col justify-center py-12 lg:h-[65vh] lg:px-36"
    >
      <h1 className="justify-center text-center text-4xl text-primary md:m-8">
        Our Commitment
      </h1>

      <div className="flex flex-col items-center justify-center sm:flex-row md:justify-evenly">
        <div className="flex w-full flex-col items-center justify-center space-y-4 md:w-1/3">
          <Image src="/safe-icon.png" alt="safe icon" height={80} width={80} />
          <h3>SAFE</h3>
          <p className="px-5 text-center text-base">
            Book a childcare session with an ease of mind. Our team makes sure
            that all of our caregivers are background checked, and we comply to
            DC licensing and compliance guidelines.
          </p>
        </div>
        <div className="mx-8 flex w-full flex-col items-center justify-center space-y-4 md:w-1/3">
          <Image
            src="/childcare-icon.png"
            alt="childcare icon"
            height={80}
            width={80}
          />
          <h3 className="text-center">AFFORDABLE CHILDCARE</h3>
          <p className="px-5 text-center text-base">
            Pay a low-monthly fee to access quality and affordable childcare
            service. We are aligned with the state and federal government
            initatives to reduce childcare cost from $1600 per month to only
            $500 per month.
          </p>
        </div>
        <div className="flex w-full flex-col items-center justify-center space-y-4 md:w-1/3">
          <Image
            src="/for-you-icon.png"
            alt="for you icon"
            height={80}
            width={80}
          />
          <h3>FOR YOU</h3>
          <p className="px-5 text-center text-base">
            Designed for working women, families of all kinds, as well as
            companies offering fringe benefits to increase retention and
            employee morale. MillenniCare addresses the flaws in our current
            fractured system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Commitment;
