import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import useCustomAlert from "@/context/useCustomAlert";
import Pagination from "@/app/components/Pagination/Pagination";
import CreateCategoryDrawer from "./CreateCategoryDrawer";
import UpdateCategoryDrawer from "./UpdateCategoryDrawer";
import { useDebounce } from "use-debounce";
import { Search, SlidersHorizontal } from "lucide-react";
import Image from "next/image";

const Categories = () => {
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const { showAlert, AlertModal } = useCustomAlert();

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  // Pagination states
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchCategories = async (page = currentPage, limit = pageSize) => {
    setLoading(true);
    try {
      const params = {
        limit,
        page,
      };
      if (debouncedSearchQuery) {
        params.search = debouncedSearchQuery;
      }
      const response = await axiosInstance.get("/tickets/categories/", { params });

      if (response.data.success && response.data.categories) {
        // API returns { success: true, categories: [...] } without pagination
        setCategories(response.data.categories);
        setTotalCount(response.data.categories.length);
        setTotalPages(1);
      } else if (response.data.results) {
        // Paginated API response
        setCategories(response.data.results);
        setTotalCount(response.data.count || 0);
        setTotalPages(Math.ceil((response.data.count || 0) / limit));
      } else {
        setCategories([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage, pageSize);
  }, [currentPage, pageSize, debouncedSearchQuery]);

  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditCategory = (category) => {
    setCategoryToEdit(category.id);
    setIsUpdateDrawerOpen(true);
    setMenuOpen(null);
  };

  const handleDeleteCategory = (categoryId) => {
    setMenuOpen(null);
    showAlert(
      "Confirm Deletion",
      "Are you sure you want to delete this category?",
      async () => {
        try {
          await axiosInstance.delete(`/tickets/categories/${categoryId}/`);
          fetchCategories(currentPage, pageSize);
        } catch (error) {
          handleApiError(error);
        }
      }
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-4">
        <Image
          src="/assets/empty-state.svg"
          alt="No categories"
          width={150}
          height={150}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
      <h3 className="text-lg font-semibold mb-2">You do not have any categories</h3>
      <p className="text-gray-500 mb-6 text-center">
        Every category created will<br />appear here
      </p>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="bg-[#3EBF0F] text-white px-6 py-2 rounded-md shadow-sm hover:bg-green-600"
      >
        + Create New Category
      </button>
    </div>
  );

  const renderTable = () => (
    <>
      <div className="body-theme overflow-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-neutral-900">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    disabled
                  />
                  Category Name
                </div>
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
                Number of Tickets
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
                Number of Tasks
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
                Date Created
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="hover:bg-gray-50 dark:hover:bg-neutral-900 cursor-pointer"
              >
                <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{category.label}</span>
                  </div>
                </td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 text-sm">
                  {category.ticket_count ?? category.tickets_count ?? 0}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 text-sm">
                  {category.task_count ?? category.tasks_count ?? 0}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 text-sm">
                  {formatDate(category.created_at || category.date_created)}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">
                  <div className="relative" ref={menuOpen === category.id ? menuRef : null}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(category.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    >
                      <FontAwesomeIcon icon={faEllipsisH} className="text-gray-600 dark:text-gray-400" />
                    </button>

                    {menuOpen === category.id && (
                      <div className="absolute z-50 right-0 mt-2 w-36 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                        <button
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                          onClick={() => handleEditCategory(category)}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSize={pageSize}
          />
        </div>
      )}
    </>
  );

  return (
    <div className="overflow-x-hidden flex flex-col pr-10 h-full justify-between">
      <div className="body-theme pl-10 w-full min-h-80">
        {/* Header with search and buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-lg font-semibold">Categories</h2>
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg body-theme text-sm w-[250px] focus:outline-none focus:border-[#3EBF0F]"
              />
            </div>

            {/* Filter button */}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
              <SlidersHorizontal size={16} />
              Filter
            </button>

            {/* New Category button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="bg-[#3EBF0F] text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-600 text-sm whitespace-nowrap"
            >
              + New Category
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gray-400"></div>
          </div>
        ) : categories.length === 0 && !debouncedSearchQuery ? (
          renderEmptyState()
        ) : categories.length === 0 && debouncedSearchQuery ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 text-lg">No categories found matching &quot;{debouncedSearchQuery}&quot;</p>
          </div>
        ) : (
          renderTable()
        )}

        {AlertModal()}

        {/* Create Category Drawer */}
        <CreateCategoryDrawer
          show={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onCategoryCreated={() => fetchCategories(currentPage, pageSize)}
        />

        {/* Update Category Drawer */}
        <UpdateCategoryDrawer
          show={isUpdateDrawerOpen}
          onClose={() => {
            setIsUpdateDrawerOpen(false);
            setCategoryToEdit(null);
          }}
          categoryId={categoryToEdit}
          onCategoryUpdated={() => fetchCategories(currentPage, pageSize)}
        />
      </div>
    </div>
  );
};

export default Categories;
