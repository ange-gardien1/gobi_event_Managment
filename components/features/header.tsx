"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import NavBar from "./navBar";
import MobileNavBar from "./mobileav";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Separator,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { LogOut } from "lucide-react";
import Spinner from "./spinner";

const Header = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const avatarFallback = session?.user?.name?.charAt(0) || "U";

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut();
  };

  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="w-36">
          <Image
            src="/assets/images/logo.png"
            width={128}
            height={38}
            alt="Evently logo"
          />
        </Link>

        <nav className="md:flex-between hidden w-full max-w-xs">
          <NavBar />
        </nav>

        <div className="flex w-32 justify-end gap-3">
          <MobileNavBar />

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none relative">
                <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300 cursor-pointer">
                  {isLoading ? (
                    <Spinner className="w-10 h-10" />
                  ) : (
                    <>
                      <AvatarImage
                        src={session.user.image || "/assets/images/logo.png"}
                        alt={session.user.name || "Profile"}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                        {avatarFallback}
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                side="bottom"
                className="w-60 bg-white shadow-lg rounded-md border border-neutral-300 z-10"
                sideOffset={10}
              >
                <div className="flex flex-col items-center gap-2 px-2.5 py-4">
                  <Avatar className="size-[52px] border border-neutral-300">
                    {isLoading ? (
                      <Spinner className="w-10 h-10" />
                    ) : (
                      <AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center">
                        {avatarFallback}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-neutral-900">
                      {session?.user?.name || "User"}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {session?.user?.email || "email@example.com"}
                    </p>
                  </div>
                </div>
                <Separator className="my-1 border-neutral-300" />
                <DropdownMenuItem
                  className={`h-10 flex items-center justify-center ${
                    isLoading
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-amber-700 font-medium cursor-pointer hover:bg-amber-100 transition duration-200"
                  }`}
                  onClick={isLoading ? undefined : handleLogout}
                >
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2" />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="size-4 mr-2" />
                      Log out
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="rounded-full" size="lg">
              <Link href="/signin">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
