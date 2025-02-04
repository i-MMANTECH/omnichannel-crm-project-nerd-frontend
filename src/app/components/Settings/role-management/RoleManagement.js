import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import CreateRoleDrawer from "./CreateRoleDrawer";
import UpdateRoleDrawer from "./UpdateRoleDrawer";
import { useApi } from "@/services/axiosConfig";
import { useRouter } from "next/navigation";
import useCustomAlert from "@/context/useCustomAlert";

const RoleManagement = () => {
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [roleToEdit, setRoleToEdit] = useState(null);
  const { axiosInstance } = useApi();
  const router = useRouter();
  const { showAlert, AlertModal } = useCustomAlert();

  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get('/users/roles/');
      setRoles(response.data.results);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleDeleteRole = (roleId) => {
    showAlert(
      "Confirm Deletion",
      "Are you sure you want to delete this role?",
      async () => {
        try {
          await axiosInstance.delete(`/users/roles/${roleId}/`);
          fetchRoles();
        } catch (error) {
          console.error("Error deleting role:", error);
        }
      }
    );
  };

  const handleEditRole = (roleId) => {
    setRoleToEdit(roleId);
    setIsUpdateDrawerOpen(true);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="overflow-x-hidden flex flex-col pr-10">
      <div className="main-container body-theme pl-10 w-full min-h-80">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Admin</h2>
            <p className="text-md mb-3">Admins can create new roles and assign permissions to these roles</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => router.push('/nativecrm/users?action=invite-user')}
              className="py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
              + Invite Users
            </button>
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="bg-[#3EBF0F] py-2 px-4 rounded-lg hover:bg-green-600">
              + New Role
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 ">
          {roles.map((role) => (
            <div
              key={role.id}
              className="border border-gray-300 rounded-lg p-4 relative body-theme shadow-sm"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{role.name}</h2>
                <div className="relative">
                  <button
                    ref={buttonRef}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(role.id);
                    }}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <FontAwesomeIcon icon={faEllipsisH} className="text-gray-600" />
                  </button>

                  {menuOpen === role.id && (
                    <div
                      ref={menuRef}
                      className="absolute z-50 right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 "
                    >
                      <button
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={() => handleEditRole(role.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRole(role.id);
                          setMenuOpen(null);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-2">{role.description ?? 'No description'}</p>
            </div>
          ))}
          {AlertModal()}
        </div>

        <CreateRoleDrawer 
          show={isDrawerOpen} 
          onClose={() => {
            setIsDrawerOpen(false);
            fetchRoles();
          }} 
          onRoleCreated={fetchRoles}
        />
        <UpdateRoleDrawer 
          show={isUpdateDrawerOpen} 
          onClose={() => setIsUpdateDrawerOpen(false)} 
          roleId={roleToEdit} 
          onRoleUpdated={fetchRoles}
        />
      </div>
    </div>
  );
};

export default RoleManagement;

