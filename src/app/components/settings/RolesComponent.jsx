'use client';

import React, { useState, useRef, useEffect } from "react";
import CreateRoleModal from "./CreateRoleModal";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";

const RolesComponent = () => {
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
    const { axiosInstance } = useApi();
    const { handleApiError } = useError();

  const [roles, setRoles] = useState([
    { id: 1, name: "Admin", description: "Admin can see & manage all", default: true },
    { id: 2, name: "Manager", description: "Self-manage their information" },
    { id: 3, name: "Agent", description: "Admin can see & manage all" },
    { id: 4, name: "Team Member", description: "Admin can see & manage all" },
    { id: 5, name: "Team Member", description: "Admin can see & manage all" },
    { id: 6, name: "Team Member", description: "Admin can see & manage all" },
    { id: 7, name: "Team Member", description: "Admin can see & manage all" },
  ]);

  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = async (id) => {
    const originalRoles = [...roles]; 
    setRoles(roles.filter((role) => role.id !== id));
  
    try {
      await axiosInstance.delete(`/roles/${id}`);
    } catch (error) {
      setRoles(originalRoles);
      handleApiError(error);
    }
  };
  

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Admin</h1>
          <p className="text-gray-500">Admins can create new roles and assign permissions to these roles</p>
        </div>
        <div className="flex gap-3">
          <button className="text-black py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-200">
            + Invite Users
          </button>
          <button 
            onClick={() => setIsModalOpen1(true)}
            className="bg-[#3EBF0F] text-white py-2 px-4 rounded-lg hover:bg-green-600">
            + New Role
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="border border-gray-300 rounded-lg p-4 relative bg-white shadow-sm"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{role.name}</h2>
              <div className="relative">
                <button
                  onClick={() => toggleMenu(role.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &#x22EE;
                </button>
                {menuOpen === role.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
                  >
                    <button
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => alert(`Edit ${role.name}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleDelete(role.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            <p className="text-gray-500 mt-2">{role.description}</p>
            {role.default && (
              <span className="mt-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                Default
              </span>
            )}
          </div>
        ))}
      </div>

      <CreateRoleModal
        isOpen={isModalOpen1}
        onClose={() => setIsModalOpen1(false)}
      />
    </div>
  );
};

export default RolesComponent;
