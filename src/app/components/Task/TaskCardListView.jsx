import UserAvatar from "../UserAvatar";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import getStatusSvg from "./getStatusSvg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { usePermissions } from "@/context/PermissionsContext";

const STATUS_ORDER = ["todo", "overdue", "in_progress", "done"];
const columns = [
  { title: "To Do", status: "todo" },
  { title: "Overdue", status: "overdue" },
  { title: "In Progress", status: "in_progress" },
  { title: "Done", status: "done" },
];


const TaskCardListView = ({ tasks, handleDelete, openViewModal, openUpdateModal }) => {
  const groupedTasks = tasks?.reduce((sections, task) => {
    if (!sections[task.status.name]) {
      sections[task.status.name] = {
        status: task.status,
        tasks: [],
      };
    }
    sections[task.status.name].tasks.push(task);
    return sections;
  }, {});

  return (
    <div>
      {STATUS_ORDER.map((statusName, index) => {
        const section = groupedTasks?.[statusName];
        const columnTitle = columns.find(c => c.status === statusName)?.title;

        return (
          <div key={index} className="mb-7">
            <div className="w-full mb-4 flex h-9 p-2 gap-2 items-center rounded-lg bg-gray-100 dark:bg-neutral-900">
              <div className="flex items-center gap-2">
                {getStatusSvg(statusName)}
              </div>
              {columnTitle}{" "}
              <span className="text-sm text-gray-500">
                ({section?.tasks.length || 0})
              </span>
            </div>
            {section?.tasks.length > 0 ? (
              section.tasks.map(task => (
                <TaskCard
                  key={task.id}
                  title={task.title}
                  date={task.updated_at}
                  priority={task.priority.label}
                  assignees={task.assignees}
                  status={task.status.label}
                  handleDelete={handleDelete}
                  thisTaskId={task.id}
                  openViewModal={openViewModal}
                  openUpdateModal={openUpdateModal}
                />
              ))
            ) : (
              <div className="text-gray-500 text-sm italic">No tasks in this category</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const TaskCard = ({
  title = "No Title",
  date = new Date().toISOString(),
  priority = "Low",
  assignees = [],
  status = "",
  thisTaskId = null,
  handleDelete,
  openViewModal,
  openUpdateModal
}) => {
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const { checkPermission } = usePermissions();
  const changeTask = checkPermission('change_task');
  const deleteTask = checkPermission('delete_task');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTaskClick = (id, action) => {
    if (action === "view") {
      openViewModal(id);
    } else if (action === "update") {
      openUpdateModal(id);
    }
  };

  const priorityColors = {
    High: "text-red-500 bg-red-100",
    Medium: "text-blue-500 bg-blue-100",
    Low: "text-gray-500 bg-gray-100",
  };

  const getPriorityColor = (priority) => {
    return priorityColors[priority] || "text-gray-500 bg-gray-100";
  };

  const getAssigneeName = (assignee) => {
    if (assignee?.username) return assignee?.username;
    if (assignee?.name) return assignee?.name;
    if (assignee?.first_name && assignee?.last_name) {
      return `${assignee.first_name} ${assignee.last_name}`;
    }
    return assignee?.email || "--";
  };

  return (
    <div onClick={() => handleTaskClick(thisTaskId, "view")} className="pointer flex p-4 justify-between items-center self-stretch rounded-lg border border-gray-300 body-theme shadow-md mb-3">
      <div className="flex items-center space-x-3">
        {status !== "done" ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9.5" stroke="#DFE1E6" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="#3EBF0F" />
          </svg>
        )}
        <span
          style={{
            textDecoration: status === "done" ? "line-through" : "none",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
          className="font-medium"
          title={title}
        >
          {title}
        </span>
      </div>

      <div className="flex justify-end items-center gap-6">
        <div className="flex gap-2 items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M5.33333 2.00016H4C2.89543 2.00016 2 2.89559 2 4.00016V6.00016M5.33333 2.00016V1.3335M5.33333 2.00016H10.6667M5.33333 2.00016V2.66683M10.6667 2.00016H12C13.1046 2.00016 14 2.89559 14 4.00016V6.00016M10.6667 2.00016V1.3335M10.6667 2.00016V2.66683M2 6.00016V12.6668C2 13.7714 2.89543 14.6668 4 14.6668H12C13.1046 14.6668 14 13.7714 14 12.6668V6.00016M2 6.00016H14M9 8.3335H11L9.33333 11.6668M7 9.3335V10.6668C7 11.2191 6.55228 11.6668 6 11.6668C5.44772 11.6668 5 11.2191 5 10.6668V9.3335C5 8.78121 5.44772 8.3335 6 8.3335C6.55228 8.3335 7 8.78121 7 9.3335Z"
              stroke="#808897"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm mr-4">{new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
          <span className={`text-xs px-2 py-1 mr-32 rounded ${getPriorityColor(priority)}`}>{priority}</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex -space-x-2 w-16 justify-end">
            {assignees.map((assignee, index) => {
              const assigneeName = getAssigneeName(assignee);
              if (assignee?.image) {
                return (
                  <Image
                    key={index}
                    alt="profile pic"
                    className="w-6 h-6 rounded-full border-2 border-white"
                    src={assignee.image}
                    width={24}
                    height={24}
                  />
                );
              } else {
                return (
                  <UserAvatar 
                    className="border-white border-2" 
                    key={index} 
                    name={assigneeName} 
                    width="w-6" 
                    height="h-6" 
                  />
                );
              }
            })}
          </div>

          <div className="relative">
            <button
              ref={buttonRef}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(menuOpen === thisTaskId ? null : thisTaskId);
              }}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full dark:hover:bg-gray-700 transition-colors"
            >
              <FontAwesomeIcon icon={faEllipsisH} className="text-gray-600" />
            </button>

            {menuOpen === thisTaskId && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
              >
                <div className="py-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskClick(thisTaskId, "view");
                      setMenuOpen(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    View task
                  </button>
                    {changeTask && (
                      <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaskClick(thisTaskId, "update");
                        setMenuOpen(null);
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
                        handleDelete(thisTaskId);
                        setMenuOpen(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Delete task
                    </button>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCardListView;
