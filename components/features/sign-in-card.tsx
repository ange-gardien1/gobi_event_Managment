"use client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { signIn } from "next-auth/react";

export const SignInCard = () => {
  return (
    <div className="flex items-center justify-center min-h-screen"> 
      <Card className="w-full h-full md:w-[487px] border-none shadow-none">
        <CardHeader className="flex items-center justify-center text-center p-7">
          <CardTitle className="text-2xl">Welcome Back!</CardTitle>
        </CardHeader>
        <div className="p-2 mb-2">
          <Separator />
        </div>
        <CardContent className="p-7 flex-col gap-y-4">
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <FcGoogle className="mr-2 size-5" />
            Login With Google
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => signIn("github", { callbackUrl: "/" })}
          >
            <FaGithub className="mr-2 size-5" />
            Login With GitHub
          </Button>
        </CardContent>
        <div className="px-7">
          <Separator />
        </div>
        <CardContent className="p-7 flex items-center justify-center">
          <p>
            Don&apos;t have an account?
            <Link href="/sign-up">
              <span className="text-blue-500"> Sign Up </span>
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
