"use client";
import { Cross2Icon, RowsIcon } from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const router = usePathname();
  const [nav, setNav] = useState(false);

  const links = [
    {
      id: 1,
      link: "home",
    },
    {
      id: 2,
      link: "appointments",
    },
    {
      id: 3,
      link: "createSchedule",
    },
  ];

  const adminLinks = [
    {
      id: 1,
      link: "tutors",
    },
    {
      id: 2,
      link: "courses",
    },
    {
      id: 3,
      link: "departments",
    },
  ];

  const tutorLinks = [
    {
      id: 1,
      link: "courses",
    },
    {
      id: 2,
      link: "appointments",
    },
  ];

  if (router.includes("login")) {
    return <></>;
  }

  return (
    <nav className="flex justify-between items-center w-full h-20 px-28 text-white bg-nyu-nv nav">
      <div>
        <h1 className="text-2xl font-signature ml-2">
          <Link className="font-medium" href="/home">
            NYU
          </Link>
        </h1>
      </div>

      <ul className="hidden md:flex">
        {links.map(({ id, link }) => (
          <li
            key={id}
            className="nav-links px-4 cursor-pointer capitalize font-medium hover:scale-105 hover:text-white duration-200 link-underline"
          >
            <Link href={`/${link}`}>{link}</Link>
          </li>
        ))}
        <li
          onClick={() => signOut()}
          className="nav-links px-4 cursor-pointer capitalize font-medium hover:scale-105 hover:text-white duration-200 link-underline"
        >
          Logout
        </li>
      </ul>

      <div
        onClick={() => setNav(!nav)}
        className="cursor-pointer pr-4 z-20 md:hidden text-white"
      >
        {nav ? <Cross2Icon width={30} /> : <RowsIcon width={30} />}
      </div>

      {nav && (
        <div className="absolute top-0 left-0 w-full h-screen bg-nyu-nv flex flex-col justify-center items-center z-10">
          <ul className="space-y-6">
            {links.map(({ id, link }) => (
              <li
                key={id}
                className="text-4xl px-4 cursor-pointer capitalize py-6"
              >
                <Link onClick={() => setNav(!nav)} href={`/${link}`}>
                  {link}
                </Link>
              </li>
            ))}
            <li
              onClick={() => signOut()}
              className="text-4xl px-4 cursor-pointer capitalize py-6"
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
