import React, { useState, useRef } from "react";
import UserAvatar from "../UserAvatar";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { getSmartTimestamp } from "@/utils/timeUtils";

export default function TableView({
  tasks,
  updateTask,
  handleDelete,
  openViewModal,
  openUpdateModal,
  allStatuses = []
}) {
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const handleStatusChange = (taskId, newStatusId) => {
    updateTask(taskId, { status: parseInt(newStatusId) });
  };

  const getAssigneeName = (assignee) => {
    if (assignee?.username) {
      return assignee?.username;
    } else if (assignee?.name) {
      return assignee?.name;
    } else if (assignee?.first_name && assignee?.last_name) {
      return assignee?.first_name + " " + assignee?.last_name;
    } else if (assignee?.first_name) {
      return assignee?.first_name;
    } else if (assignee?.email) {
      return assignee?.email;
    } else {
      return '--';
    }
  };

  const handleTaskClick = (id, action) => {
    if (action === "view") {
      openViewModal(id);
    } else if (action === "update") {
      openUpdateModal(id);
    }
  };

  const getStatusColor = (statusName) => {
    switch (statusName) {
      case "todo":
        return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
      case "in_progress":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      case "overdue":
        return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      case "done":
        return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priorityName) => {
    switch (priorityName) {
      case "high":
        return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      case "medium":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      case "low":
        return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const renderPeopleCell = (people) => {
    if (!people || people.length === 0) {
      return <span className="text-gray-400">—</span>;
    }
    return (
      <div className="flex flex-col gap-1.5">
        {people.map((person, index) => {
          const fullName = getAssigneeName(person);
          const truncatedName = fullName.length > 12 ? `${fullName.substring(0, 12)}...` : fullName;
          return (
            <div key={person?.id ?? index} className="flex items-center gap-2">
              {person?.image ? (
                <Image
                  alt="profile pic"
                  className="w-9 h-9 rounded-full border-2 border-white"
                  src={person.image}
                  width={24}
                  height={24}
                />
              ) : (
                <UserAvatar className="border-white border-2" name={fullName} />
              )}
              <span className="text-sm">{truncatedName}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="hidden">
                <input
                  type="checkbox"
                  className="w-[16px] h-[16px] shrink-0 rounded-[4.8px] border border-[#DFE1E6] bg-white"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Task ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Task Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Assignee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Followers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => openViewModal(task.id)}
              >
                <td className="px-6 py-4 hidden">
                  <input type="checkbox" className="form-checkbox" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#3EBF0F]">
                  {task.task_id ?? `TSK-${task.id}`}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                  {task.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    className={`px-2 py-1 text-sm rounded font-medium cursor-pointer ${getStatusColor(task.status?.name)}`}
                    value={task.status?.id || ''}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {allStatuses.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-sm rounded font-medium ${getPriorityColor(task.priority?.name)}`}
                  >
                    {task.priority?.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {renderPeopleCell(task.assignees)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {renderPeopleCell(task.followers)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {getSmartTimestamp(task.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div className="relative">
                    <button
                      ref={buttonRef}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(menuOpen === task.id ? null : task.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    >
                      <FontAwesomeIcon icon={faEllipsisH} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    {menuOpen === task.id && (
                      <div
                        ref={menuRef}
                        className="absolute z-50 right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
                      >
                        <div className="py-1 flex flex-col">
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
    </div>
  );
}
