"use client";

import React, { useState, useRef, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";


function SettingsSidebar({ onSidebarClick }) {
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const pathname = usePathname();
  const activeStyle = "text-[#3EBF0F]";

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const isActive = (path) => pathname.startsWith(path)

  return (
    <div >
      <Disclosure as="nav" className="fixed">
        <div >
          <div className="mb-2">
            <h2 className="text-sm text-gray-500 dark:text-gray-400 pl-4 ">General Settings</h2>
            
            <div className="my-3 pb-3">
              <button
                  onClick={() => onSidebarClick('role-management')}
                  className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${pathname.includes('role-management') ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                <Image
                    src="/assets/users-plus.svg"
                    alt="Users"
                    width={20}
                    height={20}
                  />
                <h3 className={`text-sm font-medium`}>
                  Role Management
                </h3>
              </button>  

              <button
                  onClick={() => onSidebarClick('channels-integration')}
                  className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${pathname.includes('channels-integration') ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                <Image
                    src="/assets/channels.svg"
                    style={{marginLeft: '2px'}}
                    alt="Users"
                    width={20}
                    height={20}
                  />
                <h3 className={`text-sm font-medium`}>
                  Channel Integration
                </h3>
              </button> 
              
              <button
                  onClick={() => onSidebarClick('report-settings')}
                  className={`hidden flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${pathname.includes('report-settings') ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                <Image
                    src="/assets/reports.svg"
                    className={`${isActive("/report-settings") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
                    alt="Reports"
                    width={20}
                    height={20}
                  />
                <h3 className={`text-sm font-medium`}>
                  Report Settings
                </h3>
              </button>

              <button
                  onClick={() => onSidebarClick('data-backup')}
                  className={`hidden flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${pathname.includes('data-backup') ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                <Image
                    src="/assets/cloud-upload.svg"
                    className={`${isActive("/data-backup") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
                    style={{marginLeft: '2px'}}
                    alt="Users"
                    width={20}
                    height={20}
                  />
                <h3 className={`text-sm font-medium`}>
                  Data backup & Export
                </h3>
              </button>
              <button
                  onClick={() => onSidebarClick('notification-settings')}
                  className={`hidden flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${pathname.includes('notification-settings') ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                <Image
                    src="/assets/bell.svg"
                    className={`${isActive("/notification-settings") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
                    alt="Bell"
                    width={20}
                    height={20}
                  />
                <h3 className={`text-sm font-medium ${isActive("/notification-settings") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}>
                  Notification Settings
                </h3>
              </button>

              <button
                  onClick={() => onSidebarClick('task-management')}
                  className={`hidden flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${pathname.includes('task-management') ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                <Image
                    src="/assets/tasks.svg"
                    className={`${isActive("/task-management") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
                    alt="Tasks"
                    width={20}
                    height={20}
                  />
                <h3 className={`text-sm font-medium ${isActive("/task-management") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}>
                  Task Management
                </h3>
              </button>

              <button
                  onClick={() => onSidebarClick('security-settings')}
                  className={`hidden flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${pathname.includes('security-settings') ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                <Image
                    src="/assets/security.svg"
                    className={`${isActive("/security-settings") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
                    style={{marginLeft: '2px'}}
                    alt="Users"
                    width={20}
                    height={20}
                  />
                <h3 className={`text-sm font-medium ${isActive("/security-settings") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}>
                  Security Settings
                </h3>
              </button>

              <button
                  onClick={() => onSidebarClick('plans-and-billings')}
                  className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${pathname.includes('plans-and-billings') ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                <Image
                    src="/assets/invoice.svg"
                    className={`${isActive("/plans-and-billings") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
                    style={{marginLeft: '2px'}}
                    alt="Users"
                    width={20}
                    height={20}
                  />
                <h3 className={`text-sm font-medium ${isActive("/plans-and-billings") ? activeStyle : "text-gray-800 dark:text-gray-200"}`}>
                  Plans & Billing
                </h3>
              </button>
            </div>            
          </div>
        </div>
      </Disclosure>
    </div>
  );
}

export default SettingsSidebar;
