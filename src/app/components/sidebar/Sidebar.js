"use client";

import React from "react";
import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  MdOutlineSpaceDashboard,
  MdOutlinePeople,
  MdOutlineNotifications,
  MdOutlineSettings,
} from "react-icons/md";
import { FaRegComments } from "react-icons/fa";
import { BiMessageSquareDots } from "react-icons/bi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FiHelpCircle } from "react-icons/fi";

function Sidebar() {
  const pathname = usePathname();
  const activeStyle = "text-[#3EBF0F]";

  const isActive = (path) => pathname.startsWith(path);

  return (
    <div>
      <Disclosure as="nav">
        <Disclosure.Button className="absolute top-4 right-4 inline-flex items-center peer justify-center rounded-md p-2 text-gray-800 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white group">
          <GiHamburgerMenu className="block md:hidden h-6 w-6" aria-hidden="true" />
        </Disclosure.Button>

        <div className="p-6 w-1/2 h-screen bg-white z-20 fixed top-0 -left-96 lg:left-0 lg:w-60 peer-focus:left-0 peer:transition ease-out delay-150 duration-200">
          <div className="flex flex-col justify-start items-center">
            <h1 className="text-lg font-bold text-blue-800 mb-4">
              <img src="../../assets/logo.png" alt="Logo" />
            </h1>

            <div className="w-full mb-2 border-t border-gray-300">
              <h2 className="text-sm text-gray-500 pl-4 mt-2">Main Menu</h2>
            </div>

            <div className="my-3 pb-3 w-full">
              <Link
                href="/dashboard"
                className={`flex mb-1 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 ${
                  isActive("/dashboard") ? activeStyle : "text-gray-800"
                }`}>
                <MdOutlineSpaceDashboard className={`text-xl ${isActive("/dashboard") ? activeStyle : "text-gray-600"}`} />
                <h3 className={`text-sm font-medium ${isActive("/dashboard") ? activeStyle : "text-gray-800"}`}>
                  Dashboard
                </h3>
              </Link>

              <Link
                href="/users"
                className={`flex mb-1 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 ${
                  isActive("/users") ? activeStyle : "text-gray-800"
                }`}>
                <MdOutlinePeople className={`text-xl ${isActive("/users") ? activeStyle : "text-gray-600"}`} />
                <h3 className={`text-sm font-medium ${isActive("/users") ? activeStyle : "text-gray-800"}`}>
                  Users
                </h3>
              </Link>
              <Link
                href="/channels"
                className={`flex mb-1 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 ${
                  isActive("/channels") ? activeStyle : "text-gray-800"
                }`}>
                <MdOutlinePeople className={`text-xl ${isActive("/channels") ? activeStyle : "text-gray-600"}`} />
                <h3 className={`text-sm font-medium ${isActive("/channels") ? activeStyle : "text-gray-800"}`}>
                Channels
                </h3>
              </Link>

              <Link
                href="/messages"
                className={`flex mb-1 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 ${
                  isActive("/messages") ? activeStyle : "text-gray-800"
                }`}>
                <BiMessageSquareDots className={`text-xl ${isActive("/messages") ? activeStyle : "text-gray-600"}`} />
                <h3 className={`text-sm font-medium ${isActive("/messages") ? activeStyle : "text-gray-800"}`}>
                  Messages
                </h3>
              </Link>

              <Link
                href="/tasks"
                className={`flex mb-1 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 ${
                  isActive("/tasks") ? activeStyle : "text-gray-800"
                }`}>
                <FaRegComments className={`text-xl ${isActive("/tasks") ? activeStyle : "text-gray-600"}`} />
                <h3 className={`text-sm font-medium ${isActive("/tasks") ? activeStyle : "text-gray-800"}`}>
                  Tasks
                </h3>
              </Link>

              <Link
                href="/customers"
                className={`flex mb-1 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 ${
                  isActive("/customers") ? activeStyle : "text-gray-800"
                }`}>
                <AiOutlineUserAdd className={`text-xl ${isActive("/customers") ? activeStyle : "text-gray-600"}`} />
                <h3 className={`text-sm font-medium ${isActive("/customers") ? activeStyle : "text-gray-800"}`}>
                  Customers
                </h3>
              </Link>

              <Link
                href="/reports"
                className={`flex mb-1 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 ${
                  isActive("/reports") ? activeStyle : "text-gray-800"
                }`}>
                <MdOutlineNotifications className={`text-xl ${isActive("/reports") ? activeStyle : "text-gray-600"}`} />
                <h3 className={`text-sm font-medium ${isActive("/reports") ? activeStyle : "text-gray-800"}`}>
                  Reports
                </h3>
              </Link>

              <Link
                href="/notifications"
                className={`flex mb-1 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 ${
                  isActive("/notifications") ? activeStyle : "text-gray-800"
                }`}>
                <MdOutlineNotifications className={`text-xl ${isActive("/notifications") ? activeStyle : "text-gray-600"}`} />
                <h3 className={`text-sm font-medium ${isActive("/notifications") ? activeStyle : "text-gray-800"}`}>
                  Notifications
                </h3>
              </Link>
            </div>

            <div className="w-full mt-6 pt-6">
              <Link
                href="/settings"
                className={`flex mb-1 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 ${
                  isActive("/settings") ? activeStyle : "text-gray-800"
                }`}>
                <MdOutlineSettings className={`text-xl ${isActive("/settings") ? activeStyle : "text-gray-600"}`} />
                <h3 className={`text-sm font-medium ${isActive("/settings") ? activeStyle : "text-gray-800"}`}>
                  Settings
                </h3>
              </Link>

              <Link
                href="/help"
                className={`flex mb-1 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 ${
                  isActive("/help") ? activeStyle : "text-gray-800"
                }`}>
                <FiHelpCircle className={`text-xl ${isActive("/help") ? activeStyle : "text-gray-600"}`} />
                <h3 className={`text-sm font-medium ${isActive("/help") ? activeStyle : "text-gray-800"}`}>
                  Help and Support
                </h3>
              </Link>
            </div>

            <div className="w-full mt-3 border-t border-gray-200 pt-3">
              <Link
                href="/agent-profile"
                className="flex items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200">
                <img
                  src="../../assets/user-profile-image.png"
                  alt="Agent"
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-sm">
                  <h3 className="font-medium text-gray-800">Denise Adebayo</h3>
                  <p className="text-xs text-gray-500">Agent</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </Disclosure>
    </div>
  );
}

export default Sidebar;
