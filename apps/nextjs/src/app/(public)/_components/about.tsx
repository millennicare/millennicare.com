import Image from "next/image";

const About = () => {
  return (
    <main
      id="about"
      className="bg-cream flex flex-col-reverse items-center justify-evenly space-y-2 md:flex-row md:space-y-0"
    >
      <Image
        className="max-w-xs"
        src="/dashboard_screen.png"
        height={700}
        width={400}
        alt="Dashboard screenshot"
      />
      <div className="w-full space-y-3 px-5 text-center md:max-w-lg md:px-0 lg:text-left">
        <h1 className="flex justify-center text-2xl text-primary md:text-4xl">
          About Us
        </h1>
        <h2 className="flex justify-center text-xl md:text-2xl">
          MILLENNICARE
        </h2>
        <p className="text-center md:text-lg">
          Founded in 2020, MillenniCare was born on the understanding that
          quality childcare is a fundamental human need and that not all
          families will have the luxury to afford or access this resource.
        </p>
        <p className="text-center md:text-lg">
          Sound like a you-problem? Well, worry no more! With our unique prime
          package and simple-to-use Mobile App, MillenniCare offers a solution
          to both of these problems by enabling families to connect with quality
          caregivers at an affordable and convenient rate. Sign up now to become
          a part of the first 100 founding families to be eligible for subsidy!
        </p>
      </div>
    </main>
  );
};

export default About;
