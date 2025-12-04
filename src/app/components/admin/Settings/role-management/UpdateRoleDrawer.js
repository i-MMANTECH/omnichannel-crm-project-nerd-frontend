import React, { useState, useEffect } from 'react';
import Drawer from '@/app/components/Drawer';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import Pagination from '@/app/components/Pagination/Pagination';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDebounce } from "use-debounce";


const UpdateRoleDrawer = ({ show, onClose, roleId, onRoleUpdated }) => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryPage = Number(searchParams.get("dPage")) || 1;
  const queryLimit = Number(searchParams.get("dLimit")) || 10;

  const [currentPage, setCurrentPage] = useState(queryPage);
  const [pageSize, setPageSize] = useState(queryLimit);


  const queryRoleId = searchParams.get('roleId')

  const finalRoleId = roleId || queryRoleId;

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchPermissions()
  }, [debouncedSearchQuery])

  useEffect(() => {
    if (show) {
      fetchPermissions();
    }
  }, [show, currentPage, pageSize]);

  useEffect(() => {
    const fetchRoleDetails = async () => {
      try {
        const response = await axiosInstance.get(`/users/roles/${finalRoleId}/`);
        const roleData = response.data.role;

        setRoleName(roleData.name);
        setDescription(roleData.description);
        setSelectedPermissions(roleData.permissions.map((perm) => perm.id)); // Preselect assigned permissions
      } catch (error) {
        handleApiError(error);
      }
    };

    if (show) {
      fetchRoleDetails();
    }
  }, [show, finalRoleId]);

  const fetchPermissions = async () => {
    try {
      const response = await axiosInstance.get(`/users/permissions/?search=${debouncedSearchQuery}&limit=${pageSize}&page=${currentPage}`);
      setAvailablePermissions(response.data.results || []);
      setTotalPages(Math.ceil(response.data.count / pageSize));
    } catch (error) {
      handleApiError(error);
    }
  };

  // Handle permission selection
  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  // Handle role update submission
  const handleUpdateRole = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.patch(`/users/roles/${finalRoleId}/`, {
        name: roleName,
        description: description,
        permissions: selectedPermissions,
      });

      onRoleUpdated();
      onClose();
    } catch (error) {
      handleApiError(error);
    }
  };

  const updatePagination = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);

    const params = new URLSearchParams(searchParams);
    params.set("dPage", page);
    params.set("dLimit", size);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const footerContent = (
    <div className="flex justify-start gap-3">
      <button
        type="button"
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={onClose}
      >
        Cancel
      </button>
      <button
        onClick={handleUpdateRole}
        form="roleUpdateForm"
        className="px-4 py-2 bg-[#3EBF0F] text-white rounded-lg hover:bg-green-600"
      >
        Update
      </button>
    </div>
  );

  return (
    <Drawer
      show={show}
      onClose={onClose}
      title="Update Role"
      width="35%"
      footer={footerContent}
    >
      <form id="roleUpdateForm" onSubmit={handleUpdateRole} className="py-2">
        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">Role Name *</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="Role Name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            required
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            className="w-full border border-gray-300 body-theme rounded-lg p-2"
            placeholder="Give a short description of the role"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={100}
          />
          <div className="text-right text-sm text-gray-400">
            {description?.length}/100
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-4">Permissions</h3>
          <div className="relative mb-5">
            <input
              className="w-full body-theme bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Search Permissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="absolute top-1 right-1 flex items-center rounded body-theme py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow active:bg-gray-400 active:dark:bg-black hover:bg-gray-100 hover:dark:bg-gray-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="mt-3 px-3">
            {availablePermissions.map((perm) => (
              <div key={perm.id} className="flex items-center justify-between mb-8">
                <span>{perm.name}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm.id)}
                    onChange={() => handlePermissionChange(perm.id)}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors ${selectedPermissions.includes(perm.id) ? "bg-[#3EBF0F]" : "bg-gray-300"
                      }`}
                  >
                    <div
                      className={`w-6 h-6 body-theme rounded-full transition-transform ${selectedPermissions.includes(perm.id) ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </form>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => updatePagination(page, pageSize)}
        onPageSizeChange={(size) => updatePagination(1, size)}
        pageSize={pageSize}
        pageParam='dPage'
        limitParam='dLimit'
      />
    </Drawer>
  );
};

export default UpdateRoleDrawer;
