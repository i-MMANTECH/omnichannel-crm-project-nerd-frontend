import React, { useState } from 'react';
import Drawer from '../../Drawer';

const CreateRoleDrawer = ({ show, onClose }) => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState({
    messaging: false,
    taskManagement: true,
    reportsAnalytics: false,
  });

  const handlePermissionChange = (permission) => {
    setPermissions({
      ...permissions,
      [permission]: !permissions[permission],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log({ roleName, description, permissions });
    onClose();
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
        type="submit"
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
            {[
              { label: "Messaging", key: "messaging" },
              { label: "Task Management", key: "taskManagement" },
              { label: "Reports and Analytics", key: "reportsAnalytics" },
            ].map((perm) => (
              <div key={perm.key} className="flex items-center justify-between mb-8">
                <span>{perm.label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions[perm.key]}
                    onChange={() => handlePermissionChange(perm.key)}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors ${
                      permissions[perm.key] ? "bg-[#3EBF0F]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 body-theme rounded-full transition-transform ${
                        permissions[perm.key] ? "translate-x-5" : "translate-x-0"
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

export default CreateRoleDrawer;