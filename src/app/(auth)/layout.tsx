"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [title, setTitle] = useState<string>("");
  const name = usePathname();

  // @TODO: add more cases for "register", "forgot password" and "reset password"
  useEffect(() => {
    switch (name) {
      case "/login":
        setTitle("Sign In");
        break;
    }
  }, [name]);

  return (
    <div className="flex min-h-screen flex-col justify-center bg-palecream py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link className="flex items-center text-white" href="/">
            <Image
              className="h-24 w-auto"
              src="/millennicare_logo.png"
              alt="Workflow"
              height={300}
              width={300}
            />
          </Link>
        </div>
        <h2 className="mt-3 text-center text-3xl">{title}</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-2 py-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
