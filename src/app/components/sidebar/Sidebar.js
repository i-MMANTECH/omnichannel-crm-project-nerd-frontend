"use client";

import React, { useState, useRef, useEffect } from "react";
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
import { FiHelpCircle, FiLogOut } from "react-icons/fi";
import "./Sidebar.css";
import { useAuth } from "../../../context/AuthContext"; 


function Sidebar() {
  const { logout } = useAuth(); 
import { FiHelpCircle } from "react-icons/fi";
import "./Sidebar.css";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";


function Sidebar() {
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const pathname = usePathname();
  const activeStyle = "text-[#3EBF0F]";

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const isActive = (path) => pathname.startsWith(path);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <div>
      <Disclosure as="nav">
        <Disclosure.Button className="absolute top-4 right-4 inline-flex items-center peer justify-center rounded-md p-2 text-gray-800 dark:text-white hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white group">
          <GiHamburgerMenu className="block md:hidden h-6 w-6" aria-hidden="true" />
        </Disclosure.Button>

        <div className="body-theme p-6 w-1/2 h-screen z-20 fixed top-0 -left-96 lg:left-0 lg:w-60 peer-focus:left-0 peer:transition ease-out delay-150 duration-200">
          <div className="flex flex-col justify-start items-start h-full relative">
            <div className="mb-4">
              <Image src="/assets/nativetalk-logo.svg" 
              alt="Logo" 
              width={100}
              height={100}
              />
            </div>

            <div className="w-full mb-2 border-t border-gray-300 dark:border-gray-600">
              <h2 className="text-sm text-gray-500 dark:text-gray-400 pl-4 mt-2">Main Menu</h2>
            </div>

            <div className="my-3 pb-3 w-full">
              <Link
                href="/dashboard"
                className={`flex mb-2 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/dashboard") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                <MdOutlineSpaceDashboard className={`text-xl ${isActive("/dashboard") ? activeStyle : "text-gray-600 dark:text-gray-400"}`} />
                <h3 className={`text-sm font-medium ${isActive("/dashboard") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}>
                  Dashboard
                </h3>
              </Link>

              <Link
                href="/users"
                className={`flex mb-2 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/users") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                <MdOutlinePeople className={`text-xl ${isActive("/users") ? activeStyle : "text-gray-600 dark:text-gray-400"}`} />
                <h3 className={`text-sm font-medium ${isActive("/users") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}>
                  Users
                </h3>
              </Link>

              <Link
                href="/channels"
                className={`flex mb-2 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/channels") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                <MdOutlinePeople className={`text-xl ${isActive("/channels") ? activeStyle : "text-gray-600 dark:text-gray-400"}`} />
                <h3 className={`text-sm font-medium ${isActive("/channels") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}>
                  Channels
                </h3>
              </Link>

              <Link
                href="/messages"
                className={`flex mb-2 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/messages") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                <BiMessageSquareDots className={`text-xl ${isActive("/messages") ? activeStyle : "text-gray-600 dark:text-gray-400"}`} />
                <h3 className={`text-sm font-medium ${isActive("/messages") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}>
                  Messages
                </h3>
              </Link>

              <Link
                href="/tasks"
                className={`flex mb-2 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/tasks") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                <FaRegComments className={`text-xl ${isActive("/tasks") ? activeStyle : "text-gray-600 dark:text-gray-400"}`} />
                <h3 className={`text-sm font-medium ${isActive("/tasks") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}>
                  Tasks
                </h3>
              </Link>

              <Link
                href="/customers"
                className={`flex mb-2 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/customers") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                <AiOutlineUserAdd className={`text-xl ${isActive("/customers") ? activeStyle : "text-gray-600 dark:text-gray-400"}`} />
                <h3 className={`text-sm font-medium ${isActive("/customers") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}>
                  Customers
                </h3>
              </Link>

              <Link
                href="/reports"
                className={`flex mb-2 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/reports") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                <MdOutlineNotifications className={`text-xl ${isActive("/reports") ? activeStyle : "text-gray-600 dark:text-gray-400"}`} />
                <h3 className={`text-sm font-medium ${isActive("/reports") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}>
                  Reports
                </h3>
              </Link>

              <Link
                href="/notifications"
                className={`flex mb-2 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/notifications") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                <MdOutlineNotifications className={`text-xl ${isActive("/notifications") ? activeStyle : "text-gray-600 dark:text-gray-400"}`} />
                <h3 className={`text-sm font-medium ${isActive("/notifications") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}>
                  Notifications
                </h3>
              </Link>
            </div>

            <div className="self-end mt-auto w-full">
              <div className="mb-5">
                <Link
                  href="/settings"
                  className={`flex mb-2 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/settings") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
                >
                  <MdOutlineSettings className={`text-xl ${isActive("/settings") ? activeStyle : "text-gray-600 dark:text-gray-400"}`} />
                  <h3 className={`text-sm font-medium ${isActive("/settings") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}>
                    Settings
                  </h3>
                </Link>

                <Link
                  href="/help"
                  className={`flex mb-2 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/help") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
                >
                  <FiHelpCircle className={`text-xl ${isActive("/help") ? activeStyle : "text-gray-600 dark:text-gray-400"}`} />
                  <h3 className={`text-sm font-medium ${isActive("/help") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}>
                    Help and Support
                  </h3>
                </Link>
              </div>

            <div className="w-full mt- border-t border-gray-200 pt-3" onClick={openModal}>
              <div className="flex items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200">
                <img
                  src="../../assets/user-profile-image.png"
                  alt="Agent"
                  className="w-8 h-8 rounded-full profile-icon cursor-pointer"
                />
                <div className="text-sm">
                  <h3 className="font-medium text-gray-800">Denise Adebayo</h3>
                  <p className="text-xs text-gray-500">Agent</p>

              <div className="w-full border-t border-gray-200 dark:border-gray-600 pt-4 pointer" onClick={openModal}>
                <div className="flex items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                  <Image
                    src="/assets/user-profile-image.png"
                    alt="Agent"
                    className="w-8 h-8 rounded-full profile-icon cursor-pointer"
                    width={30}
                    height={30}
                  />
                  <div className="text-sm">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">Denise Adebayo</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Agent</p>
                  </div>
                  <Image
                    src="/assets/chevron-right.svg"
                    alt="Agent"
                    className="w-5 h-5 cursor-pointer"
                    width={30}
                    height={30}
                  />
                </div>
              </div>
            </div>

            {isModalOpen && (

              <div className="modal-container fixed inset-0">
                <div
                  className="modal-content bg-white mb-5"
                  ref={modalRef}
                >
                  <Link
                    href="/agent-profile"
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
                  >
                    <img
                      src="../../assets/user-profile-image.png"
                      alt="Agent"
                      className="w-8 h-8 rounded-full"
                    />
                    <h3 className="text-gray-800 font-medium">View Profile</h3>
                  </Link>

                  <div
                    className="flex items-center gap-3 rounded-md hover:bg-gray-100 cursor-pointer"
                    onClick={logout}
                  >
                    <FiLogOut className="text-red-500 text-xl" />
                    <h3 className="text-red-500 font-medium">Logout</h3>
              <div className="modal-container fixed inset-0 w-60 px-5">
                <div
                  className="modal-content body-theme mx-6"
                  ref={modalRef}
                >
                  <div className="flex flex-col gap-4 px-2">
                    <Link
                      href="/agent-profile"
                      className="flex items-center gap-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Image
                        src="/assets/user-profile-image.png"
                        alt="Agent"
                        className="w-8 h-8 rounded-full"
                        width={30}
                        height={30}
                      />
                      <h3 className="text-gray-800 dark:text-gray-200 font-medium">View Profile</h3>
                    </Link>

                    <div
                      onClick={logout}
                      className="flex items-center gap-3 pointer rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Image
                        src="/assets/logout-icon.svg"
                        alt="Agent"
                        className="w-8 h-8 rounded-full"
                        width={30}
                        height={30}
                      />
                      <h3 className="text-red-500 font-medium">Log out</h3>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Disclosure>
    </div>
  );
}

export default Sidebar;
