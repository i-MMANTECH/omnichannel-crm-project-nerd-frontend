import React, { useState, useEffect } from 'react';
import Drawer from '../../Drawer';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import Pagination from '@/app/components/pagination/Pagination';

const CreateRoleDrawer = ({ show, onClose, onRoleCreated }) => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axiosInstance.get(`/users/permissions/?limit=${pageSize}&page=${currentPage}`);
        setAvailablePermissions(response.data.results);
        setTotalPages(Math.ceil(response.data.count / pageSize));
      } catch (error) {
        handleApiError(error);
      }
    };

    if (show) {
      fetchPermissions();
    }
  }, [show, currentPage, pageSize]);

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/users/roles/', {
        name: roleName,
        description: description,
        permissions: selectedPermissions
      });
      
      onRoleCreated();
      onClose();
      setRoleName("");
      setDescription("");
      setSelectedPermissions([]);
    } catch (error) {
      handleApiError(error);
    }
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
        onClick={handleSubmit}
        form="roleForm"
        className="px-4 py-2 bg-[#3EBF0F] text-white rounded-lg hover:bg-green-600"
      >
        Create
      </button>
    </div>
  );

  return (
    <Drawer
      show={show}
      onClose={onClose}
      title="Create New Role"
      width="35%"
      footer={footerContent}
    >
      <form id="roleForm" onSubmit={handleSubmit} className="py-2">
        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">New Role *</label>
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
            {description.length}/100
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSize={pageSize}
          />
        </div>
      </form>
    </Drawer>
  );
};

export default CreateRoleDrawer;