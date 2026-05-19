import React, { useState, useEffect } from 'react';
import Drawer from '@/app/components/Drawer';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import GroupedPermissionPicker from './GroupedPermissionPicker';


const CreateRoleDrawer = ({ show, onClose, onRoleCreated }) => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [allPermissions, setAllPermissions] = useState([]);
  const [permissionGroups, setPermissionGroups] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  useEffect(() => {
    if (show) {
      fetchPermissions();
    }
  }, [show]);

  const fetchPermissions = async () => {
    try {
      const response = await axiosInstance.get('/users/permissions/?limit=500');
      setAllPermissions(response.data.results || []);
      setPermissionGroups(response.data.groups || []);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post('/users/roles/', {
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
          <GroupedPermissionPicker
            permissions={allPermissions}
            groups={permissionGroups}
            selectedIds={selectedPermissions}
            onChange={setSelectedPermissions}
          />
        </div>
      </form>
    </Drawer>
  );
};

export default CreateRoleDrawer;
