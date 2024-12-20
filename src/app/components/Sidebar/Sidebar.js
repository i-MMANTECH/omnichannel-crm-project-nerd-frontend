"use client";

import React, { useState, useRef, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import "./Sidebar.css";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";


function Sidebar() {
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const pathname = usePathname();
  const activeStyle = "active";

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

        <div className="body-theme sidebar z-20 p-6 pt-3 w-1/2 h-screen fixed top-0 -left-96 lg:left-0 lg:w-60 peer-focus:left-0 peer:transition ease-out delay-150 duration-200">
          <div className="flex flex-col justify-start items-start h-full relative">
            <div className="py-5">
              <Image src="/assets/nativetalk-logo.svg" 
              alt="Logo" 
              width={100}
              height={100}
              />
            </div>

            <div className="w-full mb-2 border-t border-gray-300 dark:border-gray-600 ">
              <h2 className="text-sm text-gray-500 dark:text-gray-400 pl-4 mt-4">Main Menu</h2>
            </div>

            <div className="mt-2  pb-3 w-full">
              <Link
                href="/nativecrm/dashboard"
                className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200`}
              >
                <Image
                    src="/assets/dashboard.svg"
                    className={`${isActive("/dashboard") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
                    style={{marginLeft: '2px'}}
                    alt="Users"
                    width={16}
                    height={16}
                  />
                <h3 className={`text-sm font-medium ${isActive("/dashboard") ? activeStyle : ""}`}>
                  Dashboard
                </h3>
              </Link>

              <Link
                href="/nativecrm/users"
                className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200`}
              >
                <Image
                    src="/assets/users-plus.svg"
                    className={`${isActive("/users") ? activeStyle : ""}`}
                    alt="Users"
                    width={20}
                    height={20}
                  />
                <h3 className={`text-sm font-medium ${isActive("/users") ? activeStyle : ""}`}>
                  Users
                </h3>
              </Link>

              <Link
                href="/nativecrm/messages"
                className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200`}
              >
                <Image
                    src="/assets/mail-icon.svg"
                    className={`${isActive("/messages") ? activeStyle : ""}`} 
                    alt="Messages"
                    width={20}
                    height={20}
                  />
                <h3 className={`text-sm font-medium ${isActive("/messages") ? activeStyle : ""}`}>
                  Messages
                </h3>
              </Link>

              <Link
                href="/nativecrm/tasks"
                className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200`}
              >
                <Image
                    src="/assets/tasks.svg"
                    className={`${isActive("/tasks") ? activeStyle : ""}`}
                    alt="Tasks"
                    width={20}
                    height={20}
                  />
                <h3 className={`text-sm font-medium ${isActive("/tasks") ? activeStyle : ""}`}>
                  Tasks
                </h3>
              </Link>

              <Link
                href="/nativecrm/customers"
                className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200`}
              >
                <Image
                    src="/assets/customers.svg"
                    className={`${isActive("/customers") ? activeStyle : ""}`}
                    alt="Customers"
                    width={20}
                    height={20}
                  />
                <h3 className={`text-sm font-medium ${isActive("/customers") ? activeStyle : ""}`}>
                  Customers
                </h3>
              </Link>

              <Link
                href="/nativecrm/reports"
                className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200`}
              >
                <Image
                    src="/assets/reports.svg"
                    className={`${isActive("/reports") ? activeStyle : ""}`}
                    alt="Reports"
                    width={20}
                    height={20}
                  />
                <h3 className={`text-sm font-medium ${isActive("/reports") ? activeStyle : ""}`}>
                  Reports
                </h3>
              </Link>

              <Link
                href="/nativecrm/notifications"
                className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200`}
              >
                <Image
                    src="/assets/bell.svg"
                    className={`${isActive("/notifications") ? activeStyle : ""}`}
                    alt="Bell"
                    width={20}
                    height={20}
                  />
                <h3 className={`text-sm font-medium ${isActive("/notifications") ? activeStyle : ""}`}>
                  Notifications
                </h3>
              </Link>
            </div>

            <div className="self-end mt-auto w-full">
              <div className="mb-5">
                <Link
                  href="/nativecrm/settings"
                  className={`flex mb-2 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200`}
                >
                  <Image
                    src="/assets/settings.svg"
                    className={`${isActive("/settings") ? activeStyle : ""}`}
                    alt="Settings"
                    width={20}
                    height={20}
                  />
                  <h3 className={`text-sm font-medium ${isActive("/settings") ? activeStyle : ""}`}>
                    Settings
                  </h3>
                </Link>

                <Link
                  href="/nativecrm/support"
                  className={`flex mb-2 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200`}
                >
                  <Image
                    src="/assets/support.svg"
                    className={`${isActive("/help") ? activeStyle : ""}`}
                    alt="Support"
                    width={20}
                    height={20}
                  />
                  <h3 className={`text-sm font-medium ${isActive("/help") ? activeStyle : ""}`}>
                    Help and Support
                  </h3>
                </Link>
              </div>

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
              <div className="modal-container fixed inset-0 w-60 px-2">
                <div
                  className="flex flex-col justify-center items-center body-theme absolute bottom-[120px] rounded p-3 border mx-6"
                  ref={modalRef}
                >
                  <div className="flex flex-col gap-4 px-2">
                    <Link
                      href="/nativecrm/agent-profile"
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
