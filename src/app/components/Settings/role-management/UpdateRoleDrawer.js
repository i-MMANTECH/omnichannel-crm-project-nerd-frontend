import React, { useState, useEffect } from 'react';
import Drawer from '../../Drawer';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import Pagination from '../../Pagination/Pagination';

const UpdateRoleDrawer = ({ show, onClose, roleId, onRoleUpdated }) => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  useEffect(() => {
    const fetchRoleDetails = async () => {
      try {
        const response = await axiosInstance.get(`/roles/${roleId}`);
        setRoleName(response.data.name);
        setDescription(response.data.description);
      } catch (error) {
        handleApiError(error);
      }
    };

    if (show) {
      fetchRoleDetails();
    }
  }, [show, roleId]);

  const handleUpdateRole = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.patch(`/users/roles/${roleId}/`, {
        name: roleName,
        description: description,
      });
      onRoleUpdated(); // Call the function to refresh roles
      onClose(); // Close the drawer
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <Drawer
      show={show}
      onClose={onClose}
      title="Update Role"
      width="35%"
      footer={
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
            className="px-4 py-2 bg-[#3EBF0F] text-white rounded-lg hover:bg-green-600"
          >
            Update
          </button>
        </div>
      }
    >
      <form onSubmit={handleUpdateRole} className="py-2">
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
            {description.length}/100
          </div>
        </div>

        <Pagination data={{ count: totalCount }} limit={limit} onPageChange={setCurrentPage} />
      </form>
    </Drawer>
  );
};

export default UpdateRoleDrawer; 