import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import UserAvatar from "../UserAvatar";
import Image from "next/image";
import TaskUpdateModal from "./TaskUpdateModal";
import ViewTask from "./TaskViewModal";

const TaskCard = ({ task, handleDelete }) => {
  const [menuOpen, setMenuOpen] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewTask, setShowViewTask] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const menuRef = useRef(null);

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

  const toggleMenu = (id) => {
    console.log("ID", id)
    setMenuOpen(menuOpen === id ? null : id);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleCloseViewTask = () => {
    setShowViewTask(false);
  };

  const handleSaveTask = (taskData) => {
    console.log("Task saved:", taskData);
    setShowUpdateModal(false);
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
      return assignee?.username
    } else if (assignee?.name) {
      return assignee?.name
    } else if (assignee.first_name) {
      return assignee?.first_name + " " + assignee?.last_name
    } else {
      return '--'
    }
  }

  return (
    <div className="bg-gray-100 dark:bg-neutral-900 border rounded-lg p-4 shadow-sm hover:shadow-md task_card mt-3 pl-4">
      <div className="flex justify-between items-center mb-5">
        {task.title?.length > 20 ? `${task.title.substring(0, 20)}...` : task.title}
        <div className="relative">
          <FontAwesomeIcon
            icon={faEllipsis}
            className="text-gray-400 cursor-pointer"
            onClick={() => toggleMenu(task.id)}
          />
          {menuOpen === task?.id && (
            <div className="absolute top-[-20px] left-[-195px] mt-10 flex items-center justify-center">
              <div
                style={{ width: 220 }}
                className="flex flex-col gap-2 p-4 rounded-lg border border-[#DFE1E6] bg-white"
              >
                <div
                  onClick={() => handleTaskClick(task?.id, "view")}
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
                  onClick={() => handleTaskClick(task?.id, "update")}
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
                  onClick={() => handleDelete(task.id)}
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
      <div className="w-full mt-2 h-[1px] bg-[#DFE1E6]"></div>

      <div className="flex justify-between items-center mt-4 text-gray-500 text-xs">
        <div className="flex">
          <div className="flex items-center me-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 17"
              fill="none"
              style={{ width: '16px', height: '16px' }}
            >
              <path
                d="M8.00001 1.9755C7.81622 1.88313 7.61151 1.8335 7.40125 1.8335H4.66667C3.5621 1.8335 2.66667 2.72893 2.66667 3.8335V13.1668C2.66667 14.2714 3.5621 15.1668 4.66667 15.1668H11.3333C12.4379 15.1668 13.3333 14.2714 13.3333 13.1668V8.34043C13.3333 8.16509 13.2988 7.99303 13.2332 7.8335M8.00001 1.9755C8.14912 2.05044 8.28446 2.15351 8.3978 2.28101L12.9966 7.45461C13.097 7.56763 13.1767 7.69591 13.2332 7.8335M8.00001 1.9755V5.8335C8.00001 6.93807 8.89544 7.8335 10 7.8335H13.2332"
                stroke="#808897"
                strokeWidth="1.5"
              />
            </svg>
            <span>{task.mark}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 17" fill="none">
              <mask id="path-1-inside-1_220_7327" fill="white">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.35076 1.1665C4.49446 1.1665 1.36831 4.29266 1.36831 8.14896C1.36831 9.07888 1.55045 9.96791 1.88162 10.7811C1.97033 10.9989 1.97805 11.205 1.92257 11.3679L1.13903 13.6687C0.782259 14.7163 1.78339 15.7175 2.83101 15.3607L5.13178 14.5772C5.2947 14.5217 5.50079 14.5294 5.71862 14.6181C6.53181 14.9493 7.42085 15.1314 8.35076 15.1314C12.2071 15.1314 15.3332 12.0053 15.3332 8.14896C15.3332 4.29266 12.2071 1.1665 8.35076 1.1665ZM2.70164 8.14896C2.70164 5.02904 5.23084 2.49984 8.35076 2.49984C11.4707 2.49984 13.9999 5.02904 13.9999 8.14896C13.9999 11.2689 11.4707 13.7981 8.35076 13.7981C7.5962 13.7981 6.87776 13.6505 6.22151 13.3832C5.76725 13.1982 5.22599 13.1365 4.70195 13.315L2.40118 14.0985L3.18472 11.7978C3.36318 11.2737 3.30148 10.7325 3.11648 10.2782C2.84922 9.62196 2.70164 8.90352 2.70164 8.14896ZM6.33338 8.1665C6.33338 8.53469 6.0349 8.83317 5.66671 8.83317C5.29852 8.83317 5.00005 8.53469 5.00005 8.1665C5.00005 7.79831 5.29852 7.49984 5.66671 7.49984C6.0349 7.49984 6.33338 7.79831 6.33338 8.1665ZM9.00005 8.1665C9.00005 8.53469 8.70157 8.83317 8.33338 8.83317C7.96519 8.83317 7.66671 8.53469 7.66671 8.1665C7.66671 7.79831 7.96519 7.49984 8.33338 7.49984C8.70157 7.49984 9.00005 7.79831 9.00005 8.1665ZM11 8.83317C11.3682 8.83317 11.6667 8.53469 11.6667 8.1665C11.6667 7.79831 11.3682 7.49984 11 7.49984C10.6319 7.49984 10.3334 7.79831 10.3334 8.1665C10.3334 8.53469 10.6319 8.83317 11 8.83317Z" />
              </mask>
              <path fillRule="evenodd" clipRule="evenodd" d="M8.35076 1.1665C4.49446 1.1665 1.36831 4.29266 1.36831 8.14896C1.36831 9.07888 1.55045 9.96791 1.88162 10.7811C1.97033 10.9989 1.97805 11.205 1.92257 11.3679L1.13903 13.6687C0.782259 14.7163 1.78339 15.7175 2.83101 15.3607L5.13178 14.5772C5.2947 14.5217 5.50079 14.5294 5.71862 14.6181C6.53181 14.9493 7.42085 15.1314 8.35076 15.1314C12.2071 15.1314 15.3332 12.0053 15.3332 8.14896C15.3332 4.29266 12.2071 1.1665 8.35076 1.1665ZM2.70164 8.14896C2.70164 5.02904 5.23084 2.49984 8.35076 2.49984C11.4707 2.49984 13.9999 5.02904 13.9999 8.14896C13.9999 11.2689 11.4707 13.7981 8.35076 13.7981C7.5962 13.7981 6.87776 13.6505 6.22151 13.3832C5.76725 13.1982 5.22599 13.1365 4.70195 13.315L2.40118 14.0985L3.18472 11.7978C3.36318 11.2737 3.30148 10.7325 3.11648 10.2782C2.84922 9.62196 2.70164 8.90352 2.70164 8.14896ZM6.33338 8.1665C6.33338 8.53469 6.0349 8.83317 5.66671 8.83317C5.29852 8.83317 5.00005 8.53469 5.00005 8.1665C5.00005 7.79831 5.29852 7.49984 5.66671 7.49984C6.0349 7.49984 6.33338 7.79831 6.33338 8.1665ZM9.00005 8.1665C9.00005 8.53469 8.70157 8.83317 8.33338 8.83317C7.96519 8.83317 7.66671 8.53469 7.66671 8.1665C7.66671 7.79831 7.96519 7.49984 8.33338 7.49984C8.70157 7.49984 9.00005 7.79831 9.00005 8.1665ZM11 8.83317C11.3682 8.83317 11.6667 8.53469 11.6667 8.1665C11.6667 7.79831 11.3682 7.49984 11 7.49984C10.6319 7.49984 10.3334 7.79831 10.3334 8.1665C10.3334 8.53469 10.6319 8.83317 11 8.83317Z" fill="#808897" />
            </svg>
            <span>{task.comments}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 17" fill="none">
            <path d="M5.33333 2.50016H4C2.89543 2.50016 2 3.39559 2 4.50016V6.50016M5.33333 2.50016V1.8335M5.33333 2.50016H10.6667M5.33333 2.50016V3.16683M10.6667 2.50016H12C13.1046 2.50016 14 3.39559 14 4.50016V6.50016M10.6667 2.50016V1.8335M10.6667 2.50016V3.16683M2 6.50016V13.1668C2 14.2714 2.89543 15.1668 4 15.1668H12C13.1046 15.1668 14 14.2714 14 13.1668V6.50016M2 6.50016H14M9 8.8335H11L9.33333 12.1668M7 9.8335V11.1668C7 11.7191 6.55228 12.1668 6 12.1668C5.44772 12.1668 5 11.7191 5 11.1668V9.8335C5 9.28121 5.44772 8.8335 6 8.8335C6.55228 8.8335 7 9.28121 7 9.8335Z" stroke="#808897" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>
            {new Date(task.updated_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {showUpdateModal && selectedTaskId === task?.id && (
        <TaskUpdateModal
          isOpen={showUpdateModal}
          onClose={handleCloseUpdateModal}
          onSave={handleSaveTask}
          taskId={selectedTaskId}
        />
      )}
      {showViewTask && selectedTaskId === task?.id && (
        <ViewTask 
          isOpen={showViewTask} 
          taskId={selectedTaskId}
          onClose={handleCloseViewTask} 
        />
      )}
    </div>
  );
};

export default TaskCard;
