"use client";

import React, { useState, useEffect, Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTh, faSort, faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Download } from "lucide-react"; // Add this import
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
import { Tooltip } from "react-tooltip";
import Pagination from "../Pagination/Pagination";
import ExportTasksModal from "./ExportTaskModal";


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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false); // Add this
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [allStatuses, setAllStatuses] = useState([]);


  // Search state
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page')) || 1
  );
  const [pageSize, setPageSize] = useState(
    parseInt(searchParams.get('page_size')) || 10
  );
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const { checkPermission } = usePermissions();
  const addTask = checkPermission('add_task');

  const [view, setView] = useState(() => {
    if (typeof window !== "undefined") {
      const savedView = localStorage.getItem("view");
      return savedView || "table";
    }
    return "table";
  });

  const toggleView = () => {
    setView((prevView) => {
      switch (prevView) {
        case "table":
          return "list";
        case "list":
          return "kanban";
        case "kanban":
          return "table";
        default:
          return "table";
      }
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("view", view);
    }
  }, [view]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== searchParams.get('search')) {
      const params = new URLSearchParams(searchParams);
      if (debouncedSearch) {
        params.set('search', debouncedSearch);
      } else {
        params.delete('search');
      }
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      setCurrentPage(1);
    }
  }, [debouncedSearch]);

  const fetchStatuses = async () => {
    try {
      const { data } = await axiosInstance.get('/tasks/statuses/');
      setAllStatuses(data.statuses || []);
    } catch (error) {
      handleApiError(error);
    }
  };


  const fetchTasks = async (assignee = null, page = currentPage, page_size = pageSize, search = debouncedSearch) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      // params.append('page', page);
      // params.append('page_size', page_size);

      if (assignee) {
        params.append('assignee', assignee);
      }

      if (search) {
        params.append('search', search);
      }

      const { data } = await axiosInstance.get(`/tasks/list/?${params.toString()}`);

      setTasks(data.tasks || data.results || []);

      if (data.total_pages) {
        setTotalPages(data.total_pages);
      } else if (data.count) {
        setTotalPages(Math.ceil(data.count / page_size));
      }

      if (data.count !== undefined) {
        setTotalCount(data.count);
      }

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

  // Export function
  const handleExport = async (startDate, endDate) => {
    try {
      const params = new URLSearchParams();
      params.append('start_date', startDate);
      params.append('end_date', endDate);

      const response = await axiosInstance.get(`/tasks/export/?${params.toString()}`, {
        responseType: 'blob', // Important for downloading files
      });

      // Create a blob from the CSV data
      const blob = new Blob([response.data], { type: 'text/csv' });

      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tasks_export_${startDate}_to_${endDate}.csv`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      handleApiError(err);
      throw err; // Re-throw to let modal handle the error
    }
  };

  const { showAlert, AlertModal } = useCustomAlert();

  const handleAssigneeClick = (userId) => {
    if (selectedUser === userId) {
      setSelectedUser(null);
      setIsFilterActive(false);
      setCurrentPage(1);
      fetchTasks(null, 1, pageSize, debouncedSearch);
    } else {
      setSelectedUser(userId);
      setIsFilterActive(true);
      setCurrentPage(1);
      fetchTasks(userId, 1, pageSize, debouncedSearch);
    }
  };

  const clearFilter = () => {
    setSelectedUser(null);
    setIsFilterActive(false);
    setCurrentPage(1);
    fetchTasks(null, 1, pageSize, debouncedSearch);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedSearch('');
  };

  const handleDelete = (id) => {
    showAlert("Confirm Deletion", "Are you sure you want to delete this task?", async () => {
      try {
        await axiosInstance.delete(`/tasks/${id}/delete/`);
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

        fetchTasks(selectedUser, currentPage, pageSize, debouncedSearch);
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

  const handleTaskUpdate = async (taskId, updatedData) => {
    await handleUpdate(taskId, updatedData);
    fetchTasks(selectedUser, currentPage, pageSize, debouncedSearch);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchTasks(selectedUser, page, pageSize, debouncedSearch);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    fetchTasks(selectedUser, 1, newPageSize, debouncedSearch);
  };

  useEffect(() => {
    const urlPage = parseInt(searchParams.get('page')) || 1;
    const urlPageSize = parseInt(searchParams.get('page_size')) || 10;
    const urlSearch = searchParams.get('search') || '';

    setCurrentPage(urlPage);
    setPageSize(urlPageSize);
    setSearchQuery(urlSearch);
    setDebouncedSearch(urlSearch);

    fetchTasks(selectedUser, urlPage, urlPageSize, urlSearch);
  }, [searchParams.get('page'), searchParams.get('page_size'), searchParams.get('search')]);

  useEffect(() => {
    fetchUsers();
    fetchStatuses();
  }, []);

  useEffect(() => {
    if (isSuccessModalOpen === false) {
      fetchTasks(selectedUser, currentPage, pageSize, debouncedSearch);
    }
  }, [isSuccessModalOpen]);

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gray-400"></div>
      </div>}>
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
          <div className="pt-10 relative body-theme flex flex-col h-full">
            <div className="flex justify-between items-center fixed body-theme w-10/12 pr-10 mt-[-20px] z-10">
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
                  <div className="flex items-center border border-gray-300 rounded-lg shadow-sm bg-white dark:bg-neutral-800 px-3 py-1.5">
                    <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="outline-none bg-transparent text-sm w-48 dark:text-white"
                    />
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

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
                        data-tooltip-id={`tooltip-${assignee.id}`}
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
                        <Tooltip className="mt-1" id={`tooltip-${assignee.id}`} place="top">
                          {assignee?.first_name} {assignee?.last_name || ""}
                        </Tooltip>
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
                    className="hidden flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:dark:bg-neutral-900 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faSort} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium">Sort by</span>
                  </button>
                  {isSortModalOpen && (
                    <div className="absolute top-full left-[-32px] mt-2 flex items-center justify-center z-50">
                      <div style={{ width: 220 }} className="flex flex-col gap-2 p-4 rounded-lg border border-[#DFE1E6] bg-white">
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

              <div className="flex justify-between gap-3">
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                {addTask && (
                  <button
                    onClick={openModal}
                    className="bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm"
                  >
                    + New Task
                  </button>
                )}
              </div>
            </div>

            <div className="mt-16 flex-1 overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gray-400"></div>
                </div>
              ) : tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <FontAwesomeIcon icon={faSearch} className="text-4xl mb-4" />
                  <p className="text-lg">No tasks found</p>
                  {(searchQuery || selectedUser) && (
                    <p className="text-sm mt-2">Try adjusting your filters or search query</p>
                  )}
                </div>
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
                  allStatuses={allStatuses}
                />
              )}
            </div>

            {!loading && totalPages > 1 && (
              <div className="mt-4 mb-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  pageParam="page"
                  pageSizeParam="page_size"
                />
              </div>
            )}

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

            {/* Export Modal */}
            <ExportTasksModal
              isOpen={isExportModalOpen}
              onClose={() => setIsExportModalOpen(false)}
              onExport={handleExport}
            />

            {AlertModal()}
          </div>
        )}
      </ModalController>
    </Suspense>
  );
}