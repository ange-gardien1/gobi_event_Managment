"use client";

import { headerLinks } from "@/app/headerLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react"; 
import React from "react";

const NavBar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <ul className="md:flex-between flex w-full flex-col items-start gap-5 md:flex-row">
      {session ? ( 
        headerLinks.map((link) => {
          const isActive = pathname === link.route;

          return (
            <li
              key={link.route}
              className={`${
                isActive && "text-primary-500"
              } flex-center p-medium-16 whitespace-nowrap`}
            >
              <Link href={link.route}>{link.label}</Link>
            </li>
          );
        })
      ) : (
        <li className="flex-center p-medium-16">Login for more access</li> 
      )}
    </ul>
  );
};

export default NavBar;
