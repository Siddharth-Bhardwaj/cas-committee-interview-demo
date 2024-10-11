import type { Metadata } from "next";
import "./globals.css";
import perstare from "@/font/fonts";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Committee Scheduler",
  description:
    "A web app that takes in calendars from tutors and provides available time slots to students.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en" className={`${perstare.className}`}>
      <body className="min-h-screen flex flex-col">
        <SessionProvider session={session}>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
