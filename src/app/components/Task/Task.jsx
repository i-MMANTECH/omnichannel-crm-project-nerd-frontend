"use client";

import React, { useState, useEffect, Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTh, faSort, faFilter } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import TableView from "./TableView";
import TaskModal from "./AddTaskModal";
import SuccessModal from "../SuccessModal";
import { useError } from "@/context/ErrorContext";
import { useApi } from "@/services/axiosConfig";
import TaskCardListView from "./TaskCardListView";
import KanbanView from "./KanbanView";
import TaskUpdateModal from "./TaskUpdateModal";
import TaskViewModal from "./TaskViewModal";
import useCustomAlert from "@/context/useCustomAlert";
import { usePermissions } from "@/context/PermissionsContext";
import UserAvatar from "../UserAvatar";
import Image from "next/image";


const ModalController = ({ children }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    
    const isModalOpen = searchParams.get('action') === 'new-task';
    const isViewModalOpen = searchParams.get('action') === 'view-task';
    const isUpdateModalOpen = searchParams.get('action') === 'update-task';
    const taskId = searchParams.get('taskId');

    const openModal = () => {
        const params = new URLSearchParams(searchParams);
        params.set('action', 'new-task');
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const closeModal = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('action');
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const openViewModal = (taskId) => {
        const params = new URLSearchParams(searchParams);
        params.set('action', 'view-task');
        params.set('taskId', taskId);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const closeViewModal = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const params = new URLSearchParams(searchParams);
        params.delete('action');
        params.delete('taskId');
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const openUpdateModal = (taskId) => {
        const params = new URLSearchParams(searchParams);
        params.set('action', 'update-task');
        params.set('taskId', taskId);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const closeUpdateModal = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const params = new URLSearchParams(searchParams);
        params.delete('action');
        params.delete('taskId');
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return children({ 
        isModalOpen, 
        openModal, 
        closeModal, 
        isViewModalOpen, 
        isUpdateModalOpen,
        taskId,
        openViewModal,
        closeViewModal,
        openUpdateModal,
        closeUpdateModal 
    });
};

export default function Task() {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState([])
  const [isFilterActive, setIsFilterActive] = useState(false)

  const { checkPermission } = usePermissions();
  const addTask = checkPermission('add_task');

  const [view, setView] = useState(() => {
    if (typeof window !== "undefined") {
      const savedView = localStorage.getItem("view");
      return savedView || "list";
    }
    return "list";
  });

  const toggleView = () => {
    setView((prevView) => {
      switch(prevView) {
        case "list":
          return "table";
        case "table":
          return "kanban";
        case "kanban":
          return "list";
        default:
          return "list";
      }
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("view", view);
    }
  }, [view]);

  const fetchTasks = async (assignee = null) => {
    setLoading(true);
    try {
      let url = "tasks/list/";
      if (assignee) {
        url += `?assignee=${assignee}`;
      }
      const { data } = await axiosInstance.get(url);
      setTasks(data.tasks);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUsers = async () => {
    try {
        const { data } = await axiosInstance.get(`/users`);
        setUsers(data.results || []);
    } catch (error) {
        handleApiError(error);
    }
};

  const { showAlert, AlertModal } = useCustomAlert();

  const handleAssigneeClick = (userId) => {
    if (selectedUser === userId) {
      setSelectedUser(null);
      setIsFilterActive(false);
      fetchTasks();
    } else {
      setSelectedUser(userId);
      setIsFilterActive(true);
      fetchTasks(userId);
    }
  };

  const clearFilter = () => {
    setSelectedUser(null);
    setIsFilterActive(false);
    fetchTasks();
  };
  
  
  const handleDelete = (id) => {
    showAlert("Confirm Deletion", "Are you sure you want to delete this task?", async () => {
      try {
        await axiosInstance.delete(`/tasks/${id}/delete/`);
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      } catch (error) {
        handleApiError(error);
      }
    });
  };

  const handleUpdate = async (taskId, updatedData) => {
    try {
      const { data } = await axiosInstance.post(`tasks/${taskId}/update/`, updatedData);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, ...data.task } : task
        )
      );
      return data.task;
    } catch (err) {
      handleApiError(err);
    }
  };

  // New function to handle task update and refetch
  const handleTaskUpdate = async (taskId, updatedData) => {
    await handleUpdate(taskId, updatedData);
    fetchTasks(); // Refetch tasks after updating
  };

  useEffect(() => {
    fetchTasks();
  }, [isSuccessModalOpen]);

  useEffect(() => {
    fetchTasks();
    fetchUsers()
  }, []);

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };


  return (
    <Suspense fallback={<div>Loading...</div>}>    
      <ModalController>
        {({ 
          isModalOpen, 
          openModal, 
          closeModal, 
          isViewModalOpen, 
          isUpdateModalOpen,
          taskId,
          openViewModal,
          closeViewModal,
          openUpdateModal,
          closeUpdateModal 
        }) => (
          <div className="pt-10 relative body-theme">
            <div className="flex justify-between items-center fixed body-theme w-10/12 pr-10 mt-[-20px]">
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleView}
                  className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:dark:bg-neutral-900 hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faTh} className="text-blue-500 mr-2" />
                  <span className="text-sm font-medium">
                    {view === "list" ? "Table View" : view === "table" ? "Kanban View" : "List View"}
                  </span>
                </button>
                <div className="relative">
                <div className="relative flex items-center">
                  {users.map((assignee, index) => (
                    <div 
                      key={index}
                      className={`cursor-pointer rounded-full transition-all duration-300
                      ${selectedUser === assignee.id ? 'ring-2 dark:ring-white ring-gray-500 z-10' : ''}`}
                      style={{ marginLeft: index !== 0 ? '-7px' : '0px' }} 
                      onClick={() => handleAssigneeClick(assignee.id)}
                      onMouseEnter={(e) => e.currentTarget.classList.add("z-10")}
                      onMouseLeave={(e) => e.currentTarget.classList.remove("z-10")}
                    >
                      {assignee?.image ? (
                        <Image
                          alt="profile pic"
                          className="w-9 h-9 rounded-full border-2 border-white"
                          src={assignee.image} 
                          width={30}
                          height={30}
                        />
                      ) : (
                        <UserAvatar 
                          name={assignee?.first_name ? 
                            `${assignee.first_name} ${assignee?.last_name}` : 
                            assignee?.email || '--'
                          } 
                          className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-white"
                          width="w-9" 
                          height="h-9" 
                        />
                      )}
                    </div>
                  ))}
                  
                  {isFilterActive && (
                    <button 
                      className="ml-3 px-3 py-1.5 text-sm bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-neutral-700 transition"
                      onClick={clearFilter}
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
                </div>
                <div className="relative">
                  <button 
                  onClick={() => setIsSortModalOpen((prev) => !prev)}
                  className="hidden flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:dark:bg-neutral-900 hover:bg-gray-100">
                        <FontAwesomeIcon icon={faSort} className="text-gray-500 mr-2" />
                        <span className="text-sm font-medium">Sort by</span>
                  </button>
                    {isSortModalOpen && (
                  <div  className="absolute  top-full left-[-32px] mt-2 flex items-center justify-center z-50 ">
                    <div style={{width:220}} className="flex flex-col gap-2 p-4 rounded-lg border border-[#DFE1E6] bg-white">
                      <div className="flex items-center gap-3 cursor-pointer">
                        <p className="text-[#0D0D12] text-[14px] font-normal">Agent</p>
                      </div>
                      <div className="flex items-center gap-3 cursor-pointer">
                        <p className="text-[#0D0D12] text-[14px] font-normal">Date Range</p>
                      </div>
                      <div className="flex items-center gap-3 cursor-pointer">
                        <p className="text-[#0D0D12] text-[14px] font-normal">Task type</p>
                      </div>
                  </div>
                </div>
            )}
          </div>

          <button className="hidden flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:dark:bg-neutral-900 hover:bg-gray-100">
                  <FontAwesomeIcon icon={faFilter} className="text-gray-500 mr-2" />
                  <span className="text-sm font-medium">Filter</span>
                </button>
              </div>
              {addTask && (
                <button
                onClick={openModal}
                className="bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm ml-auto"
              >
                + New Task
              </button>
              )}
            </div>

            <div className="mt-16 h-4/5 overflow-auto">
              {loading ? (
                <div>Loading...</div>
              ) : view === "kanban" ? (
                <KanbanView 
                  tasks={tasks} 
                  updateTask={handleTaskUpdate} 
                  setTasks={setTasks} 
                  handleDelete={handleDelete} 
                  openViewModal={openViewModal} 
                  openUpdateModal={openUpdateModal} 
                />
              ) : view === "list" ? (
                <TaskCardListView 
                  tasks={tasks} 
                  handleDelete={handleDelete}
                  openViewModal={openViewModal}
                  openUpdateModal={openUpdateModal}
                />
              ) : (
                <TableView 
                  tasks={tasks} 
                  updateTask={handleTaskUpdate} 
                  handleDelete={handleDelete} 
                  openViewModal={openViewModal} 
                  openUpdateModal={openUpdateModal} 
                />
              )}
            </div>

            <TaskModal
              isOpen={isModalOpen}
              onClose={closeModal}
              setIsSuccessModalOpen={setIsSuccessModalOpen}
            />

            {isUpdateModalOpen && (
              <TaskUpdateModal
                isOpen={isUpdateModalOpen}
                onClose={closeUpdateModal}
                taskId={taskId}
                onUpdate={handleTaskUpdate}
              />
            )}

            {isViewModalOpen && (
              <TaskViewModal 
                isOpen={isViewModalOpen} 
                taskId={taskId}
                onClose={closeViewModal} 
              />
            )}

            <SuccessModal
              isOpen={isSuccessModalOpen}
              title="Success!"
              message="You have successfully created a Task"
              buttonText="Okay, thank you"
              onClose={closeSuccessModal}
            />

            {AlertModal()}
          </div>
        )}
      </ModalController>
    </Suspense>
  );
}