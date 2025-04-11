"use client";

import React, { useState, useRef } from "react";
import { Disclosure } from "@headlessui/react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { AlarmClock, FileText, Link, UserPlus } from "lucide-react";


function SettingsSidebar({ onSidebarClick, currentSection  }) {
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const activeStyle = "text-[#3EBF0F]";

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const isActive = (path) => currentSection && currentSection.startsWith(path);

  return (
    <div >
      <Disclosure as="nav" className="fixed">
        <div>
          <div className="mb-2">
            <h2 className="text-sm text-gray-500 dark:text-gray-400 pl-4 ">General Settings</h2>
            
            <div className="my-3 pb-3">
              <button
                  onClick={() => onSidebarClick('role-management')}
                  className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${currentSection === 'role-management' ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                <UserPlus 
                    size={18}
                  />
                <h3 className={`text-sm font-medium`}>
                  Role Management
                </h3>
              </button>  
              
              <button
                  onClick={() => onSidebarClick('sla-policies')}
                  className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${currentSection === 'sla-policies' ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                 <AlarmClock size={18} />
                <h3 className={`text-sm font-medium`}>
                Sla Policies
                </h3>
              </button>  

              <button
                  onClick={() => onSidebarClick('channels-integration')}
                  className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${currentSection === 'channels-integration' ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                <Link size={18} />
                <h3 className={`text-sm font-medium`}>
                  Channel Integration
                </h3>
              </button> 
              
              <button
                  onClick={() => onSidebarClick('report-settings')}
                  className={`hidden flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${currentSection === 'report-settings' ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
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
                  className={`hidden flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${currentSection === 'data-backup' ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
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
                  className={`hidden flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${currentSection === 'notification-settings' ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                <Image
                    src="/assets/bell.svg"
                    className={`${isActive("/notification-settings") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
                    alt="Bell"
                    width={20}
                    height={20}
                  />
                <h3 className={`text-sm font-medium`}>
                  Notification Settings
                </h3>
              </button>

              <button
                  onClick={() => onSidebarClick('task-management')}
                  className={`hidden flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${currentSection === 'task-management' ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                <Image
                    src="/assets/tasks.svg"
                    className={`${isActive("/task-management") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
                    alt="Tasks"
                    width={20}
                    height={20}
                  />
                <h3 className={`text-sm font-medium`}>
                  Task Management
                </h3>
              </button>

              <button
                  onClick={() => onSidebarClick('security-settings')}
                  className={`hidden flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${currentSection === 'security-settings' ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                <Image
                    src="/assets/security.svg"
                    className={`${isActive("/security-settings") ? activeStyle : "text-gray-600 dark:text-gray-400"}`}
                    style={{marginLeft: '2px'}}
                    alt="Users"
                    width={20}
                    height={20}
                  />
                <h3 className={`text-sm font-medium`}>
                  Security Settings
                </h3>
              </button>

              <button
                  onClick={() => onSidebarClick('plans-and-billings')}
                  className={`flex mb-3 items-center gap-3 pl-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${currentSection === 'plans-and-billings' ? activeStyle : "text-gray-800 dark:text-gray-200"}`}
              >
                <FileText size={18} />
                <h3 className={`text-sm font-medium`}>
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
