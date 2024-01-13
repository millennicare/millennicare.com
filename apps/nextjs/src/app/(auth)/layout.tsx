import Image from "next/image";

// export const runtime = "edge";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center space-y-6">
      <Image
        src="/millennicare_logo.png"
        alt="Millennicare Logo"
        height={96}
        width={96}
        priority={true}
      />
      {children}
    </div>
  );
}
