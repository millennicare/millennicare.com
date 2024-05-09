import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div
      id="footer"
      className="bg-palecream flex w-full flex-col content-around items-center py-10"
    >
      <Image
        src="/millennicare_logo_with_text.svg"
        alt="Millennicare logo"
        height={200}
        width={200}
      />

      <p className="pt-2 text-sm">Copyright © 2024 MillenniCare, Inc.</p>
      {/* Footer Links */}
      <div className="flex w-[390px] flex-col items-center justify-between pt-2 min-[420px]:flex-row">
        <Link href="/eula" className="hover:text-primary">
          EULA
        </Link>
        <p className="max-[420px]:hidden">|</p>
        <Link
          href="/privacy-policy"
          className="hover:text-primary max-[420px]:py-2"
        >
          Privacy Policy
        </Link>
        <p className="max-[420px]:hidden">|</p>
        <Link href="/contact-us" className="hover:text-primary">
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default Footer;
