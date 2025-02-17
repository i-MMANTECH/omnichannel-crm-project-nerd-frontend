import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserAvatar from "../UserAvatar";
import Image from "next/image";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { usePermissions } from "@/context/PermissionsContext";

const KanbanViewTaskCard = ({ task, handleDelete, openViewModal, openUpdateModal }) => {
  const [menuOpen, setMenuOpen] = useState(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const { checkPermission } = usePermissions();
  const changeTask = checkPermission('change_task');
  const deleteTask = checkPermission('delete_task');

  const handleTaskClick = (id, action) => {
    if (action === "view") {
        openViewModal(id);
    } else if (action === "update") {
        openUpdateModal(id);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getAssigneeName = (assignee) => {
    if (assignee?.username) {
      return assignee?.username;
    } else if (assignee?.name) {
      return assignee?.name;
    } else if (assignee.first_name) {
      return assignee?.first_name + " " + assignee?.last_name;
    } else {
      return '--';
    }
  };

  return (
    <div className="dark:bg-neutral-900 border rounded-lg p-4 shadow-sm hover:shadow-md task_card mt-3 pl-4">
      <div className="flex justify-between items-center mb-5">
        {task.title?.length > 20 ? `${task.title.substring(0, 20)}...` : task.title}
        <div className="relative">
          <button
                ref={buttonRef}
                onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(menuOpen === task?.id ? null : task?.id);
                }}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full dark:hover:bg-gray-700 transition-colors"
            >
                <FontAwesomeIcon icon={faEllipsisH} className="text-gray-600" />
            </button>
          {menuOpen === task?.id && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-100"
              >
                <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskClick(task?.id, "view");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    View task
                  </button>
                  {changeTask && (
                    <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskClick(task?.id, "update");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Update task
                  </button>
                  )}
                  {deleteTask && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(task.id)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Delete task
                  </button>
                  )}

              </div>
          )}
        </div>
      </div>

      <span
        className={`px-2 py-1 text-sm rounded ${
          task.priority?.label === "High"
            ? "bg-red-100 text-red-600"
            : task.priority?.label === "Medium"
            ? "bg-blue-100 text-blue-600"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {task.priority?.label}
      </span>

      <div className="flex -space-x-2 my-4">
        {task.assignees.map((assignee, index) => {
          const assigneeName = getAssigneeName(assignee);

          if (assignee?.image) {
            return (
              <Image 
                key={index}
                alt="profile pic"
                className="w-6 h-6 rounded-full border-2 border-white"
                src={assignee?.image}
                width={30}
                height={30}
              />
            );
          } else {
            return <UserAvatar className="border-white border-2" key={index} name={assigneeName} width="w-6" height="h-6" />;
          }
        })}
      </div>
      <div className="w-full mt-2 h-[1px] bg-[#DFE1E6]"></div>

      <div className="flex justify-between items-center mt-4 text-gray-500 text-xs">
        <div className="flex">
          <span>
            {new Date(task.updated_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default KanbanViewTaskCard; 