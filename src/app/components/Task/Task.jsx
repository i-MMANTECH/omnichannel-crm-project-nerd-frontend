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
import getStatusSvg from "./getStatusSvg";
import KanbanView from "./KanbanView";
import TaskUpdateModal from "./TaskUpdateModal";
import TaskViewModal from "./TaskViewModal";
import useCustomAlert from "@/context/useCustomAlert";

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

const STATUS_ORDER = ["todo", "in_progress", "done", "overdue"];
const columns = [
  { title: "To Do", status: "todo" },
  { title: "Overdue", status: "overdue" },
  { title: "In Progress", status: "in_progress" },
  { title: "Done", status: "done" },
];

export default function Task() {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

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

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("tasks/list/");
      setTasks(data.tasks);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const { showAlert, AlertModal } = useCustomAlert();

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
  }, []);

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

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

  const renderListView = () => (
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
                <div key={task.id} className="mt-2">
                  <TaskCardListView
                    title={task.title}
                    date={task.updated_at}
                    priority={task.priority.label}
                    assignees={task.assignees}
                    status={task.status.label}
                    taskId={task.id}
                    handleDelete={handleDelete}
                  />
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm italic">No tasks in this category</div>
            )}
          </div>
        );
      })}
    </div>
  );

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
                    {view === "list" ? "List View" : view === "table" ? "Table View" : "Kanban View"}
                  </span>
                </button>
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
              <button
                onClick={openModal}
                className="bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm ml-auto"
              >
                + New Task
              </button>
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