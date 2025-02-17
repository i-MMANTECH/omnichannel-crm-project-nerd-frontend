import React, { useState, useEffect } from 'react';
import Drawer from '../../Drawer';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import Pagination from '../../Pagination/Pagination';
import { useSearchParams, useRouter } from 'next/navigation';


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

  // Fetch all available permissions
  useEffect(() => {
    if (show) {
      fetchPermissions();
    }
  }, [show, currentPage, pageSize]);

  // Fetch role details including permissions
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
      const response = await axiosInstance.get(`/users/permissions/?limit=${pageSize}&page=${currentPage}`);
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
          <h3 className="font-semibold text-lg mb-6">Permissions</h3>
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
                    className={`w-11 h-6 rounded-full transition-colors ${
                      selectedPermissions.includes(perm.id) ? "bg-[#3EBF0F]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 body-theme rounded-full transition-transform ${
                        selectedPermissions.includes(perm.id) ? "translate-x-5" : "translate-x-0"
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
