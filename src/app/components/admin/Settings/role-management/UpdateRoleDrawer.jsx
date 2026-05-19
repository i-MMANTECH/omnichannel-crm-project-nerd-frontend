import React, { useState, useEffect } from 'react';
import Drawer from '@/app/components/Drawer';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import { useSearchParams, useRouter } from 'next/navigation';
import GroupedPermissionPicker from './GroupedPermissionPicker';


const UpdateRoleDrawer = ({ show, onClose, roleId, onRoleUpdated }) => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [allPermissions, setAllPermissions] = useState([]);
  const [permissionGroups, setPermissionGroups] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryRoleId = searchParams.get('roleId');
  const finalRoleId = roleId || queryRoleId;

  useEffect(() => {
    if (show) {
      fetchPermissions();
      fetchRoleDetails();
    }
  }, [show, finalRoleId]);

  const fetchPermissions = async () => {
    try {
      const response = await axiosInstance.get('/users/permissions/?limit=500');
      setAllPermissions(response.data.results || []);
      setPermissionGroups(response.data.groups || []);
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchRoleDetails = async () => {
    try {
      const response = await axiosInstance.get(`/users/roles/${finalRoleId}/`);
      const roleData = response.data.role;
      setRoleName(roleData.name);
      setDescription(roleData.description);
      setSelectedPermissions(roleData.permissions.map((perm) => perm.id));
    } catch (error) {
      handleApiError(error);
    }
  };

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

export default UpdateRoleDrawer;
