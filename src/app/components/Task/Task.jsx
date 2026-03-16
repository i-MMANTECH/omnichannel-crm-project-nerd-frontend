"use client";

import React, { useState, useEffect, Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTh, faSort, faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Download } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import TableView from "./TaskTableView";
import TaskModal from "./AddTaskModal";
import SuccessModal from "../SuccessModal";
import { useError } from "@/context/ErrorContext";
import { useApi } from "@/services/axiosConfig";
import TaskCardListView from "./TaskCardListView";
import KanbanView from "./TaskKanbanView";
import TaskUpdateModal from "./TaskUpdateModal";
import TaskViewModal from "./TaskViewModal";
import useCustomAlert from "@/context/useCustomAlert";
import { usePermissions } from "@/context/PermissionsContext";
import UserAvatar from "../UserAvatar";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import Pagination from "../Pagination/Pagination";
import ExportTasksModal from "./ExportTaskModal";
import table from '@/public/assets/table.svg';
import grid from '@/public/assets/grid.svg';


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
  const [showMoreUsers, setShowMoreUsers] = useState(false);

  const filterableUsers = users.filter(user => {
    const email = user?.email || '';
    // Exclude system users (e.g., system_user_16@nativetalk.com)
    return !email.match(/^system_user_\d+@nativetalk\.com$/i);
  });

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
    parseInt(searchParams.get('page_size')) || 50
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMoreUsers && !event.target.closest('.relative')) {
        setShowMoreUsers(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoreUsers]);

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
      params.append('page', page);
      params.append('page_size', page_size);

      if (assignee) {
        params.append('assignee', assignee);
      }

      if (search) {
        params.append('search', search);
      }

      const { data } = await axiosInstance.get(`/tasks/list/?${params.toString()}`);

      setTasks(data.tasks || data.results || []);

      if (data.pagination.total_pages) {
        setTotalPages(data.pagination.total_pages);
      } else if (data.pagination.count) {
        setTotalPages(Math.ceil(data.count / page_size));
      }

      if (data.count !== undefined) {
        setTotalCount(data.pagination.count);
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
    const urlPageSize = parseInt(searchParams.get('page_size')) || 50;
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
          <div className=" relative body-theme flex flex-col h-full">
            <div className="w-full">
              {/* Top Controls - Responsive */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 body-theme">

                {/* Left Controls Group */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    onClick={toggleView}
                    className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:dark:bg-neutral-900 hover:bg-gray-100 whitespace-nowrap"
                  >
                    {view === 'table' ?
                      <Image src={table} alt='tbl' className='mr-2' width={15} height={15} /> :
                      <Image src={grid} alt='grd' className='mr-2' width={15} height={15} />
                    }
                    <span className="text-sm font-medium hidden sm:inline">
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
                        className="outline-none bg-transparent text-sm w-32 sm:w-48 dark:text-white"
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

                  {/* User Avatars with Dropdown for overflow */}
                  <div className="relative">
                    <div className="relative flex items-center">
                      {/* Show first 8 users */}
                      {filterableUsers.slice(0, 8).map((assignee, index) => {
                        const tooltipName = (() => {
                          const fullName = `${assignee?.first_name || ""} ${assignee?.last_name || ""}`.trim();
                          if (fullName) return fullName;
                          if (assignee?.email) return assignee.email;
                          if (assignee?.phone_number) return assignee.phone_number;
                          return "User";
                        })();

                        return (
                          <div
                            key={assignee.id}
                            className={`cursor-pointer rounded-full transition-all duration-300 flex-shrink-0
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
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white"
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
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex-shrink-0 border-2 border-white"
                                width="w-8 sm:w-9"
                                height="h-8 sm:h-9"
                              />
                            )}
                            <Tooltip className="mt-1" id={`tooltip-${assignee.id}`} place="top">
                              {tooltipName}
                            </Tooltip>
                          </div>
                        );
                      })}

                      {/* +N More Users Dropdown */}
                      {users.length > 8 && (
                        <div className="relative">
                          <button
                            onClick={() => setShowMoreUsers(!showMoreUsers)}
                            className="ml-2 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0 hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
                          >
                            +{users.length - 8}
                          </button>

                          {/* Dropdown with remaining users */}
                          {showMoreUsers && (
                            <div className="absolute top-full left-0 mt-2 w-64 max-h-80 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                              <div className="p-2">
                                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1">
                                  More Users ({filterableUsers.length - 8})
                                </div>
                                {filterableUsers.slice(8).map((assignee) => {
                                  const tooltipName = (() => {
                                    const fullName = `${assignee?.first_name || ""} ${assignee?.last_name || ""}`.trim();
                                    if (fullName) return fullName;
                                    if (assignee?.email) return assignee.email;
                                    if (assignee?.phone_number) return assignee.phone_number;
                                    return "User";
                                  })();

                                  return (
                                    <div
                                      key={assignee.id}
                                      onClick={() => {
                                        handleAssigneeClick(assignee.id);
                                        setShowMoreUsers(false);
                                      }}
                                      className={`flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition
                            ${selectedUser === assignee.id ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
                                    >
                                      {assignee?.image ? (
                                        <Image
                                          alt="profile pic"
                                          className="w-8 h-8 rounded-full"
                                          src={assignee.image}
                                          width={32}
                                          height={32}
                                        />
                                      ) : (
                                        <UserAvatar
                                          name={tooltipName}
                                          width="w-8"
                                          height="h-8"
                                        />
                                      )}
                                      <span className="text-sm flex-1 truncate">{tooltipName}</span>
                                      {selectedUser === assignee.id && (
                                        <span className="text-green-600 text-xs">✓</span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {isFilterActive && (
                    <button
                      className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-neutral-700 transition whitespace-nowrap"
                      onClick={clearFilter}
                    >
                      Clear Filter
                    </button>
                  )}
                </div>

                {/* Right Controls Group */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setIsExportModalOpen(true)}
                    className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2 whitespace-nowrap"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                  {addTask && (
                    <button
                      onClick={openModal}
                      className="bg-[#3EBF0F] text-white px-3 sm:px-4 py-2 rounded-md shadow-sm whitespace-nowrap"
                    >
                      + New Task
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex-1 overflow-auto">
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