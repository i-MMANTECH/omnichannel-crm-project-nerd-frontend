'use client'

import React, { useState, useEffect, Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTh, faSort, faFilter } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import KanbanView from "./KanbanView";
import ListView from "./ListView";
import TableView from "./TableView";
import TaskModal from "./TaskModal";
import SuccessModal from "../SuccessModal";
import { useError } from "@/context/ErrorContext";
import { useApi } from "@/services/axiosConfig";

const ModalController = ({ children }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    
    const isModalOpen = searchParams.get('action') === 'new-task';

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

    return children({ isModalOpen, openModal, closeModal });
};

export default function Task() {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [view, setView] = useState(() => {
    if (typeof window !== "undefined") {
      const savedView = localStorage.getItem("view");
      return savedView || "kanban";
    }
    return "kanban";
  });

  const toggleView = () => {
    setView((prevView) => {
      const nextView =
        prevView === "kanban"
          ? "list"
          : prevView === "list"
          ? "table"
          : "kanban";
      if (typeof window !== "undefined") {
        localStorage.setItem("view", nextView);
      }
      return nextView;
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

  const updateTask = async (taskId, updatedData) => {
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

  useEffect(() => {
    fetchTasks();
  }, [isSuccessModalOpen]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>    
      <ModalController>
        {({ isModalOpen, openModal, closeModal }) => (
          <div className="pt-10 relative body-theme">
            <div className="flex justify-between items-center fixed body-theme w-10/12 pr-10 mt-[-20px]">
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleView}
                  className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:dark:bg-neutral-900 hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faTh} className="text-blue-500 mr-2" />
                  <span className="text-sm font-medium">
                    {view === "kanban"
                      ? "List View"
                      : view === "list"
                      ? "Table View"
                      : "Kanban View"}
                  </span>
                </button>
                <button className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:dark:bg-neutral-900 hover:bg-gray-100">
                  <FontAwesomeIcon icon={faSort} className="text-gray-500 mr-2" />
                  <span className="text-sm font-medium">Sort by</span>
                </button>
                <button className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:dark:bg-neutral-900 hover:bg-gray-100">
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

            <div className="mt-16 h-4/5 overflow-auto body-theme">
              {loading ? (
                <div>Loading...</div>
              ) : view === "kanban" ? (
                <KanbanView tasks={tasks} updateTask={updateTask} setTasks={setTasks} />
              ) : view === "list" ? (
                <ListView tasks={tasks} updateTask={updateTask} />
              ) : (
                <TableView tasks={tasks} updateTask={updateTask} />
              )}
            </div>

            <TaskModal
              isOpen={isModalOpen}
              onClose={closeModal}
              setIsSuccessModalOpen={setIsSuccessModalOpen}
            />

            <SuccessModal
              isOpen={isSuccessModalOpen}
              title="Success!"
              message="You have successfully created a Task"
              buttonText="Okay, thank you"
              onClose={closeSuccessModal}
            />
          </div>
        )}
      </ModalController>
    </Suspense>
  );
}