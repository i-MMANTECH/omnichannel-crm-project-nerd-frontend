import React, { useState, useEffect } from 'react';
import Drawer from '../../Drawer';
import { useApi } from '@/services/axiosConfig';
import Pagination from '@/app/components/pagination/Pagination';

const UpdateRoleDrawer = ({ show, onClose, roleId, onRoleUpdated }) => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const { axiosInstance } = useApi();

  useEffect(() => {
    const fetchRoleDetails = async () => {
      try {
        const response = await axiosInstance.get(`/users/roles/${roleId}`);
        const { name, permissions } = response.data.role;
        setRoleName(name);
        setDescription(response.data.role.description || "");
        setSelectedPermissions(permissions.map(perm => perm.id)); // Assuming permissions are returned as an array of objects
      } catch (error) {
        console.error("Error fetching role details:", error);
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
        permissions: selectedPermissions,
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
                    onChange={() => {
                      setSelectedPermissions(prev => {
                        if (prev.includes(perm.id)) {
                          return prev.filter(id => id !== perm.id);
                        } else {
                          return [...prev, perm.id];
                        }
                      });
                    }}
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
    </Drawer>
  );
};

export default UpdateRoleDrawer; 