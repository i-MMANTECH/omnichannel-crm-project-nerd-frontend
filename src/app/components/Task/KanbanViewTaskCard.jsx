import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserAvatar from "../UserAvatar";
import Image from "next/image";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { usePermissions } from "@/context/PermissionsContext";
import { getSmartTimestamp } from "@/utils/timeUtils";

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
    } else if (assignee?.first_name && assignee?.last_name) {
      return `${assignee.first_name} ${assignee.last_name}`;
    } else if (assignee?.first_name) {
      return assignee.first_name;
    } else if (assignee?.email) {
      return assignee.email;
    } else {
      return '--';
    }
  };

  return (
    <div
      onClick={() => handleTaskClick(task.id, "view")}
      className="cursor-pointer bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header: Title and Menu */}
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white flex-1 mr-2 line-clamp-2">
          {task.title}
        </h4>
        <div className="relative flex-shrink-0">
          <button
            ref={buttonRef}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(menuOpen === task?.id ? null : task?.id);
            }}
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          >
            <FontAwesomeIcon icon={faEllipsisH} className="text-gray-500 text-xs" />
          </button>
          {menuOpen === task?.id && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-1 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
            >
              <div className="py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTaskClick(task?.id, "view");
                    setMenuOpen(null);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  View task
                </button>
                {changeTask && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskClick(task?.id, "update");
                      setMenuOpen(null);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Update task
                  </button>
                )}
                {deleteTask && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(task.id);
                      setMenuOpen(null);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Delete task
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Priority Badge */}
      <div className="mb-3">
        <span
          className={`inline-block px-2 py-1 text-xs font-medium rounded ${task.priority?.label === "High"
            ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            : task.priority?.label === "Medium"
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
            }`}
        >
          {task.priority?.label || 'No Priority'}
        </span>
      </div>

      {/* Assignees */}
      {task.assignees && task.assignees.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-col gap-1.5">
            {task.assignees.slice(0, 2).map((assignee, index) => {
              const assigneeName = getAssigneeName(assignee);
              const truncatedName = assigneeName.length > 12 ? `${assigneeName.substring(0, 12)}...` : assigneeName;

              return (
                <div key={index} className="flex items-center gap-2">
                  {assignee?.image ? (
                    <Image
                      alt="profile pic"
                      className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex-shrink-0"
                      src={assignee?.image}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <UserAvatar
                      className="border border-gray-200 dark:border-gray-700 flex-shrink-0"
                      name={assigneeName}
                    />
                  )}
                  <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {truncatedName}
                  </span>
                </div>
              );
            })}
            {task.assignees.length > 2 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 ml-7">
                +{task.assignees.length - 2} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-2"></div>

      {/* Footer: Date */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{getSmartTimestamp(task.created_at)}</span>
      </div>
    </div>
  );
};

export default KanbanViewTaskCard;