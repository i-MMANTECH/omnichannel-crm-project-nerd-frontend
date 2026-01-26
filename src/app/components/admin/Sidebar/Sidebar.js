"use client";

import React, { useState, useRef, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import "./Sidebar.css";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useNotification } from "@/context/NotificationContext";
import { useError } from "@/context/ErrorContext";
import { useApi } from "@/services/axiosConfig";
import { usePermissions } from "@/context/PermissionsContext";
import UserAvatar from "../../UserAvatar";
import { Bell, House, Mail, Settings, SquareCheck, SquareKanban, UserPlus, Users, Phone, Ticket } from 'lucide-react';

function Sidebar() {
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const modalRef = useRef(null);
  const { handleApiError } = useError();
  const { axiosInstance } = useApi();

  const pathname = usePathname();
  const activeStyle = "active";
  const openModal = () => setIsModalOpen(true);

  const isActive = (path) => pathname.includes(path);
  const { toggleNotification } = useNotification();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const resp = await axiosInstance.get(`/users/me`);
        setUserProfile(resp?.data?.user);
      } catch (error) {
        handleApiError(error);
      }
    };
    fetchUserProfile();
  }, []);

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
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hamburger-btn absolute top-4 right-4 inline-flex items-center justify-center rounded-md p-2 text-gray-800 dark:text-white hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
      >
        <GiHamburgerMenu className="block md:hidden h-6 w-6" aria-hidden="true" />
      </button>

      <div
        className={`body-theme sidebar z-20 p-6 pt-3 w-1/2 h-screen fixed top-0 ${isOpen ? "left-0" : "-left-96"
          } lg:left-0 lg:w-60 transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col justify-start items-start h-full relative">
          <Link href="/admin" >
            <div className="pt-5 pb-5 cursor-pointer">
              <Image src="/assets/nativetalk-logo.svg" alt="Logo" width={100} height={100} />
            </div>
          </Link>


          <div className="w-full mb-2 border-t border-gray-300 dark:border-gray-600 ">
            <h2 className="text-sm text-gray-500 dark:text-gray-400 pl-4 mt-4">Main Menu</h2>
          </div>

          <div className="mt-2  pb-3 w-full">
            <Link
              onClick={() => setIsOpen(false)} // Close sidebar on navigation

              href="/admin/dashboard"
              className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/dashboard") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
            >
              <House
                size={18}
              />
              <h3 className={`text-sm font-medium`}>
                Dashboard
              </h3>
            </Link>

            <Link
              onClick={() => setIsOpen(false)} // Close sidebar on navigation

              href="/admin/users"
              className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/users") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
            >
              <UserPlus
                size={18}
              />
              <h3 className={`text-sm font-medium`}>
                Users
              </h3>
            </Link>

            <Link
              onClick={() => setIsOpen(false)} // Close sidebar on navigation

              href="/admin/messages?chat=leads"
              className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/messages") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}

            >
              <Mail
                size={18}
              />
              <h3 className={`text-sm font-medium`}>
                Messages
              </h3>
            </Link>

            <Link
              onClick={() => setIsOpen(false)} // Close sidebar on navigation

              href="/admin/tasks"
              className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/tasks") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
            >
              <SquareCheck
                size={18}
              />
              <h3 className={`text-sm font-medium`}>
                Tasks
              </h3>
            </Link>

            <Link
              onClick={() => setIsOpen(false)} // Close sidebar on navigation

              href="/admin/tickets"
              className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/tickets") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
            >
              <Ticket size={18} />
              <h3 className={`text-sm font-medium`}>
                Tickets
              </h3>
            </Link>

            <Link
              onClick={() => setIsOpen(false)} // Close sidebar on navigation

              href="/admin/customers"
              className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/customers") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
            >
              <Users size={18} />

              <h3 className={`text-sm font-medium`}>
                Customers
              </h3>
            </Link>

            <Link
              onClick={() => setIsOpen(false)}
              href="/admin/call-center-admin#real-time-reports"
              className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/call-center-admin") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
            >
              <Phone size={18} />
              <h3 className="text-sm font-medium">Call Center</h3>
            </Link>

            <Link
              onClick={() => setIsOpen(false)}

              href="/admin/reports"
              className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/reports") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
            >
              <SquareKanban size={18} />
              <h3 className={`text-sm font-medium`}>
                Reports
              </h3>
            </Link>

            <div
              className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/notifications") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
              onClick={toggleNotification}
            >
              <Bell
                size={18}
              />
              <h3 className={`text-sm font-medium`}>
                Notifications
              </h3>
            </div>
          </div>

          <div className="self-end mt-auto w-full">
            <div className="mb-5">
              <Link
                onClick={(e) => {
                  setIsOpen(false); // Close sidebar
                  if (window.location.pathname === "/admin/settings") {
                    e.preventDefault(); // Prevent navigation if already on the same page
                  }
                }}
                href="/admin/settings#channels-integration"
                className={`flex mb-2 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/settings") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
              >
                <Settings size={18} />
                <h3 className={`text-sm font-medium`}>
                  Settings
                </h3>
              </Link>

              <Link
                onClick={() => setIsOpen(false)} // Close sidebar on navigation

                href="/admin/support"
                className={`hidden flex mb-2 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200`}
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
                {userProfile?.image ? (
                  <Image
                    src={userProfile?.image}
                    alt="User Profile"
                    width={100}
                    height={100}
                    className="w-8 h-8 rounded-full profile-icon cursor-pointer flex-shrink-0"
                  />
                ) : (
                  <UserAvatar
                    name={userProfile?.first_name ?
                      `${userProfile.first_name} ${userProfile?.last_name}` :
                      userProfile?.email || '--'
                    }
                    className="w-8 h-8 rounded-full profile-icon cursor-pointer flex-shrink-0"
                    width="w-8"
                    height="h-8"
                  />
                )}
                <div className="text-sm min-w-0 flex-1">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 truncate">
                    {userProfile?.first_name || userProfile?.last_name
                      ? `${userProfile.first_name} ${userProfile?.last_name}`
                      : (
                        <span title={userProfile?.email}>
                          {userProfile?.email}
                        </span>
                      )}
                  </h3>
                  <p
                    className="text-xs text-gray-500 dark:text-gray-400 truncate"
                    title={userProfile?.roles?.map(role => role.name).join(' • ')}
                  >
                    {userProfile?.roles?.map((role, index) => (
                      <span key={role.id}>
                        {index > 0 && <span className="mx-1">•</span>}
                        {role.name}
                      </span>
                    ))}
                  </p>
                </div>
                <Image
                  src="/assets/chevron-right.svg"
                  alt="Agent"
                  className="w-5 h-5 cursor-pointer flex-shrink-0"
                  width={30}
                  height={30}
                />
              </div>
            </div>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 w-60 px-2">
              <div
                className="flex flex-col justify-center items-center body-theme absolute bottom-[100px] rounded p-3 border mx-6"
                ref={modalRef}
              >
                <div className="flex flex-col gap-4 px-2">
                  <Link
                    onClick={() => setIsOpen(false)} // Close sidebar on navigation

                    href="/admin/profile"
                    className="flex items-center gap-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 no-underline hover:no-underline"
                  >
                    {userProfile?.image ? (
                      <Image
                        src={userProfile?.image}
                        alt="User Profile"
                        width={30}
                        height={30}
                        className="w-8 h-8 rounded-full profile-icon cursor-pointer flex-shrink-0"
                      />
                    ) : (
                      <UserAvatar
                        name={userProfile?.first_name ?
                          `${userProfile.first_name} ${userProfile?.last_name}` :
                          userProfile?.email || '--'
                        }
                        className="w-8 h-8 rounded-full profile-icon cursor-pointer flex-shrink-0"
                        width="w-8"
                        height="h-8"
                      />
                    )}
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
    </>
  );
}

export default Sidebar;
