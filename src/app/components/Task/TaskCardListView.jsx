import UserAvatar from "../UserAvatar";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import TaskUpdateModal from "./TaskUpdateModal";
import ViewTask from "./ViewTask";

const TaskCardListView = ({
  title = "No Title",
  date = new Date().toISOString(),
  priority = "Low",
  assignees = [],
  status = "",
  taskId,
  handleDelete
}) => {

  const [menuOpen, setMenuOpen] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewTask, setShowViewTask] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const menuRef = useRef(null);

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
    return "--";
  };

  const handleTaskClick = (id, action) => {
    setSelectedTaskId(id);
    if (action === "view") {
      setShowViewTask(true);
      setShowUpdateModal(false);
    } else if (action === "update") {
      setShowUpdateModal(true);
      setShowViewTask(false);
    }
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleCloseViewTask = () => {
    setShowViewTask(false);
  };

  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
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

  return (
    <div className="flex p-4 justify-between items-center self-stretch rounded-lg border border-gray-300 body-theme shadow-md mb-3">
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
                  <UserAvatar className="border-white border-2" key={index} name={assigneeName} width="w-6" height="h-6" />
                );
              }
            })}
          </div>

          <div className="relative">
            <button
              onClick={() => toggleMenu(taskId)}
              style={{ marginTop: -10 }}
              className="hover:dark:bg-neutral-900 hover:bg-gray-100"
              aria-label="More options"
            >
              <span>...</span>
            </button>
            {menuOpen === taskId && (
              <div className="absolute top-full left-[-200px] mt-10 flex items-center justify-center z-50">
                <div
                  style={{ width: 220 }}
                  className="flex flex-col gap-2 p-4 rounded-lg border border-[#DFE1E6] bg-white"
                >
                  <div
                    onClick={() => handleTaskClick(taskId, "view")}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21.544 11.045C21.848 11.4713 22 11.6845 22 12C22 12.3155 21.848 12.5287 21.544 12.955C20.1779 14.8706 16.6892 19 12 19C7.31078 19 3.8221 14.8706 2.45604 12.955C2.15201 12.5287 2 12.3155 2 12C2 11.6845 2.15201 11.4713 2.45604 11.045C3.8221 9.12944 7.31078 5 12 5C16.6892 5 20.1779 9.12944 21.544 11.045Z"
                        stroke="#808897"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12Z"
                        stroke="#808897"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <p className="text-[#0D0D12] text-[14px] font-normal">View details</p>
                  </div>

                  <div
                    onClick={() => handleTaskClick(taskId, "update")}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M17 7L7 17L4 17L4 14L15 3L17 7Z"
                        stroke="#808897"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <p className="text-[#0D0D12] text-[14px] font-normal">Update task</p>
                  </div>
                  <div 
                    onClick={() => handleDelete(taskId)}
                    className="flex items-center gap-3 cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5"
                        stroke="#DF1C41"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5"
                        stroke="#DF1C41"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.5 16.5V10.5"
                        stroke="#DF1C41"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M14.5 16.5V10.5"
                        stroke="#DF1C41"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <p className="text-[#0D0D12] text-[14px] font-normal">Delete task</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showUpdateModal && selectedTaskId === taskId && (
        <TaskUpdateModal
          isOpen={showUpdateModal}
          onClose={handleCloseUpdateModal}
          taskId={selectedTaskId}
        />
      )}
      {showViewTask && selectedTaskId === taskId && (
        <ViewTask 
        isOpen={showViewTask} 
        taskId={selectedTaskId}
        onClose={handleCloseViewTask} />
      )}
    </div>
  );
};

export default TaskCardListView;
