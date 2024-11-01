import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Provider from "./_trpc/provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Event Managment",
  description: "Evanty Managment System",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <SessionProvider>
          <Provider>{children} </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
