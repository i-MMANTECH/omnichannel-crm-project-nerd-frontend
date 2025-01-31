import React, { useState, useRef } from "react";
import UserAvatar from "../UserAvatar";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";

export default function TableView({ tasks, updateTask, handleDelete, openViewModal, openUpdateModal }) {
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const handleStatusChange = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
  };
  
  const getAssigneeName = (assignee) => {
    if (assignee?.username) {
      return assignee?.username
    } else if (assignee?.name) {
      return assignee?.name
    } else  if (assignee.first_name) {
      return assignee?.first_name + " " + assignee?.last_name
    } else {
      return '--'
    }
  }

  const handleTaskClick = (id, action) => {
    if (action === "view") {
      openViewModal(id);
    } else if (action === "update") {
      openUpdateModal(id);
    }
  };

  return (
    <div>
      <table className="min-w-full border-collapse shadow-sm">
      <thead className="bg-gray-100 dark:bg-neutral-900">
        <tr>
          <th className="hidden">
            <input
              type="checkbox"
              className="w-[16px] h-[16px] shrink-0 rounded-[4.8px] border border-[#DFE1E6] bg-white"
            />
          </th>
          <th className="flex items-center w-[340px] h-[40px] px-3">
            <span className="font-medium leading-[21px] tracking-[0.2px]">
              Task Name
            </span>
          </th>
          <th className="text-left font-medium leading-[21px] tracking-[0.2px]">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="w-[16px] h-[16px] shrink-0"
              >
                <g clipPath="url(#clip0_1745_8531)">
                  <path
                    d="M8.00004 12.0002V14.6668M5.17161 10.8286L3.286 12.7142M4.00004 8.00016H1.33337M12 8.00016H14.6667M10.8285 10.8286L12.7141 12.7142M8.00004 4.00016V1.3335M10.8285 5.17174L12.7141 3.28612M5.17161 5.17174L3.286 3.28612"
                    stroke="#808897"
                    strokeLinecap="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1745_8531">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span>Status</span>
            </div>
          </th>
          <th className="text-left font-medium leading-[21px] tracking-[0.2px]">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="w-[16px] h-[16px] shrink-0"
              >
                <path
                  d="M5.33333 2H3.33333C2.59695 2 2 2.59695 2 3.33333V5.33333C2 6.06971 2.59695 6.66667 3.33333 6.66667H5.33333C6.06971 6.66667 6.66667 6.06971 6.66667 5.33333V3.33333C6.66667 2.59695 6.06971 2 5.33333 2Z"
                  stroke="#808897"
                />
                <path
                  d="M12.6667 2H10.6667C9.93029 2 9.33333 2.59695 9.33333 3.33333V5.33333C9.33333 6.06971 9.93029 6.66667 10.6667 6.66667H12.6667C13.403 6.66667 14 6.06971 14 5.33333V3.33333C14 2.59695 13.403 2 12.6667 2Z"
                  stroke="#808897"
                />
                <path
                  d="M5.33333 9.33333H3.33333C2.59695 9.33333 2 9.93029 2 10.6667V12.6667C2 13.403 2.59695 14 3.33333 14H5.33333C6.06971 14 6.66667 13.403 6.66667 12.6667V10.6667C6.66667 9.93029 6.06971 9.33333 5.33333 9.33333Z"
                  stroke="#808897"
                />
                <path
                  d="M12.6667 9.33333H10.6667C9.93029 9.33333 9.33333 9.93029 9.33333 10.6667V12.6667C9.33333 13.403 9.93029 14 10.6667 14H12.6667C13.403 14 14 13.403 14 12.6667V10.6667C14 9.93029 13.403 9.33333 12.6667 9.33333Z"
                  stroke="#808897"
                />
              </svg>
              <span>Priority</span>
            </div>
          </th>
          <th className="text-left font-medium leading-[21px] tracking-[0.2px]">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="w-[16px] h-[16px] shrink-0"
              >
                <path
                  d="M9.33337 9.33333H6.66671C4.82576 9.33333 3.33337 10.8257 3.33337 12.6667V13.3333C3.33337 13.7015 3.63185 14 4.00004 14H12C12.3682 14 12.6667 13.7015 12.6667 13.3333V12.6667C12.6667 10.8257 11.1743 9.33333 9.33337 9.33333Z"
                  stroke="#808897"
                />
                <path
                  d="M8.00004 7.33333C9.4728 7.33333 10.6667 6.13943 10.6667 4.66667C10.6667 3.19391 9.4728 2 8.00004 2C6.52728 2 5.33337 3.19391 5.33337 4.66667C5.33337 6.13943 6.52728 7.33333 8.00004 7.33333Z"
                  stroke="#808897"
                />
              </svg>
              <span>Assign</span>
            </div>
          </th>
          <th className="text-left font-medium leading-[21px] tracking-[0.2px]">
            <div className="flex items-center gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="w-[16px] h-[16px] shrink-0"
              >
                <path
                  d="M5.33333 2.00016H4C2.89543 2.00016 2 2.89559 2 4.00016V6.00016M5.33333 2.00016V1.3335M5.33333 2.00016H10.6667M5.33333 2.00016V2.66683M10.6667 2.00016H12C13.1046 2.00016 14 2.89559 14 4.00016V6.00016M10.6667 2.00016V1.3335M10.6667 2.00016V2.66683M2 6.00016V12.6668C2 13.7714 2.89543 14.6668 4 14.6668H12C13.1046 14.6668 14 13.7714 14 12.6668V6.00016M2 6.00016H14M9 8.3335H11L9.33333 11.6668M7 9.3335V10.6668C7 11.2191 6.55228 11.6668 6 11.6668C5.44772 11.6668 5 11.2191 5 10.6668V9.3335C5 8.78121 5.44772 8.3335 6 8.3335C6.55228 8.3335 7 8.78121 7 9.3335Z"
                  stroke="#808897"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Due Date</span>
            </div>
          </th>
          <th className="text-left font-medium leading-[21px] tracking-[0.2px]">
            <div className="flex items-center gap-2">
              <span>Actions</span>
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        {tasks.map((task) => (
          <tr key={task.id} className="hover:dark:bg-neutral-900 hover:bg-gray-100">
            <td className="px-4 py-2 hidden">
              <input type="checkbox" className="form-checkbox" />
            </td>
            <td className="px-4 py-2">{task.title}</td>
            <td className="px-4 py-2">
              <select
                className={`px-2 py-1 text-sm rounded font-medium ${
                  task.status.name === "overdue"
                    ? "bg-red-100 text-red-600"
                    : task.status.name === "in_progress"
                    ? "bg-blue-100 text-blue-600"
                    : task.status.name === "done"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600"
                }`}
                
                value={task.status.name}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
              >
                <option value={1}>{task.status.label}</option>
                <option value={2}>In Progress</option>
                <option value={3}>Done</option>
                <option value={4}>Overdue</option>
              </select>
            </td>
            <td className="px-4 py-2">
              <span
                className={`px-2 py-1 text-sm rounded font-medium ${
                  task.priority.name === "high"
                    ? "bg-red-100 text-red-600"
                    : task.priority.name === "medium"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {task.priority.label}
              </span>
            </td>
            <td className="px-4 py-2">
              <div className="flex -space-x-2">
                {task.assignees.map((assignee, index) => {
                  const assigneeName = getAssigneeName(assignee)
                  if (assignee?.image) {
                    return (
                      <Image 
                        key={index}
                        alt="profile pic"
                        className="w-6 h-6 rounded-full border-2 border-white"
                        source={{uri: assignee.profile}} 
                    />
                      )
                    } else {
                      return <UserAvatar className="border-white border-2" key={index} name={ assigneeName } width="w-6" height="h-6" />
                    }
                  })}
              </div>
            </td>
            <td className="px-4 py-2">
              <div className="space-x-2">
                <span>
                  {new Date(task.updated_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </td>
            <td className="px-4 py-2">
              <div className="relative">
                <button
                  ref={buttonRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(menuOpen === task.id ? null : task.id);
                  }}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <FontAwesomeIcon icon={faEllipsisH} className="text-gray-600" />
                </button>

                {menuOpen === task.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                  >
                    <div className="py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskClick(task.id, "view");
                          setMenuOpen(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        View task
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskClick(task.id, "update");
                          setMenuOpen(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Update task
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(task.id);
                          setMenuOpen(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Delete task
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      </table>
    </div>
  );
}
