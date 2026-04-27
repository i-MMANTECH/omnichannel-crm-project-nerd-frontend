"use client";

import React, { useState, useRef, useEffect } from "react";
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
import UserAvatar from "../UserAvatar";
import { Bell, House, Mail, Settings, SquareCheck, SquareKanban, UserPlus, Users, Phone, Ticket, User, PlayCircle } from 'lucide-react';
import { useOnboarding } from "../Onboarding/OnboardingContext";

function Sidebar() {
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const modalRef = useRef(null);
  const { handleApiError } = useError();
  const { axiosInstance } = useApi();

  const { checkPermission } = usePermissions();

  const viewUser = checkPermission("view_user");
  const viewCustomer = checkPermission("view_customer");
  const viewLead = checkPermission("view_lead");
  const viewTask = checkPermission("view_task");

  const pathname = usePathname();
  const activeStyle = "active";
  const openModal = () => setIsModalOpen(true);

  const isActive = (path) => pathname.includes(path);
  const { toggleNotification } = useNotification();
  const { replay: replayOnboarding } = useOnboarding();

  useEffect(() => {
    const openHandler = () => setIsOpen(true);
    window.addEventListener("onboarding:open-sidebar", openHandler);
    return () => window.removeEventListener("onboarding:open-sidebar", openHandler);
  }, []);

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
        aria-label="Toggle menu"
        className="lg:hidden fixed top-3 left-3 z-40 inline-flex items-center justify-center rounded-md p-2 text-gray-800 dark:text-white bg-white/80 dark:bg-neutral-900/80 backdrop-blur border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#3EBF0F]"
      >
        <GiHamburgerMenu className="h-5 w-5" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 z-20"
          aria-hidden="true"
        />
      )}

      <div
        className={`body-theme sidebar z-30 p-6 pt-3 w-72 max-w-[85vw] h-screen fixed top-0 ${isOpen ? "left-0" : "-left-96"
          } lg:left-0 lg:w-60 lg:max-w-none transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col justify-start items-start h-full relative">
          <Link href="/nativecrm" legacyBehavior>
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

              data-tour="nav-dashboard"
              href="/nativecrm/dashboard"
              className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/dashboard") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
            >
              <House
                size={18}
              />
              <h3 className={`text-sm font-medium`}>
                Dashboard
              </h3>
            </Link>

            {viewUser && (
              <Link
                onClick={() => setIsOpen(false)} // Close sidebar on navigation

                data-tour="nav-users"
                href="/nativecrm/users"
                className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/users") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
              >
                <UserPlus
                  size={18}
                />
                <h3 className={`text-sm font-medium`}>
                  Users
                </h3>
              </Link>
            )}

            <Link
              onClick={() => setIsOpen(false)} // Close sidebar on navigation

              data-tour="nav-messages"
              href="/nativecrm/messages?chat=leads"
              className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/messages") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}

            >
              <Mail
                size={18}
              />
              <h3 className={`text-sm font-medium`}>
                Messages
              </h3>
            </Link>

            {viewTask && (
              <Link
                onClick={() => setIsOpen(false)} // Close sidebar on navigation

                data-tour="nav-tasks"
                href="/nativecrm/tasks"
                className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/tasks") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
              >
                <SquareCheck
                  size={18}
                />
                <h3 className={`text-sm font-medium`}>
                  Tasks
                </h3>
              </Link>
            )}

            <Link
              onClick={() => setIsOpen(false)} // Close sidebar on navigation

              data-tour="nav-tickets"
              href="/nativecrm/tickets"
              className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/tickets") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
            >
              <Ticket size={18} />
              <h3 className={`text-sm font-medium`}>
                Tickets
              </h3>
            </Link>

            {viewCustomer && (
              <Link
                onClick={() => setIsOpen(false)} // Close sidebar on navigation

                data-tour="nav-customers"
                href="/nativecrm/customers"
                className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/customers") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
              >
                <Users size={18} />

                <h3 className={`text-sm font-medium`}>
                  Customers
                </h3>
              </Link>
            )}

            {viewLead && (
              <Link
                onClick={() => setIsOpen(false)}

                data-tour="nav-leads"
                href="/nativecrm/leads"
                className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/leads") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
              >
                <User
                  size={18}
                />
                <h3 className={`text-sm font-medium`}>
                  Leads
                </h3>
              </Link>
            )}

            <Link
              onClick={() => setIsOpen(false)}
              data-tour="nav-call-center"
              href="/nativecrm/call-center#call-detail-records"
              className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/call-center") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
            >
              <Phone size={18} />
              <h3 className="text-sm font-medium">Call Center</h3>
            </Link>

            {/* <Link
              onClick={() => setIsOpen(false)} // Close sidebar on navigation

              href="/nativecrm/notifications"
              className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive("/notifications") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
            >
              <Bell
                size={18}
              />

              <h3 className={`text-sm font-medium ${isActive("/notifications") ? activeStyle : ""}`}>
                Notifications
              </h3>
            </Link> */}

            <div
              data-tour="nav-notifications"
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
                onClick={() => setIsOpen(false)} // Close sidebar on navigation

                href="/nativecrm/support"
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

            <div data-tour="profile" className="w-full border-t border-gray-200 dark:border-gray-600 pt-4 pointer" onClick={openModal}>
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
                    onClick={() => setIsOpen(false)}

                    href="/nativecrm/profile"
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

                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      replayOnboarding();
                    }}
                    className="flex items-center gap-3 pointer rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#3EBF0F]/10 flex items-center justify-center text-[#3EBF0F] flex-shrink-0">
                      <PlayCircle size={18} />
                    </div>
                    <h3 className="text-gray-800 dark:text-gray-200 font-medium">Replay tour</h3>
                  </button>

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
