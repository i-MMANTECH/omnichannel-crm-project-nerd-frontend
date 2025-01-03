import React, { useState, useRef, useEffect } from "react";
// import CreateRoleM   odal from "./CreateRoleModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import CreateRoleDrawer from "./CreateRoleDrawer";

const RoleManagement = () => {
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const roles = [
    { id: 1, name: "Admin", description: "Admin can see & manage all", default: true },
    { id: 2, name: "Manager", description: "Self-manage their information" },
    { id: 3, name: "Agent", description: "Admin can see & manage all" },
    { id: 4, name: "Team Member", description: "Admin can see & manage all" },
    { id: 5, name: "Team Member", description: "Admin can see & manage all" },
    { id: 6, name: "Team Member", description: "Admin can see & manage all" },
    { id: 7, name: "Team Member", description: "Admin can see & manage all" },
  ];

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

  return (
    <div className="overflow-x-hidden flex flex-col pr-10">
    <div className="main-container max-w-full body-theme pl-10 w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-lg font-semibold mb-2">Admin</h2>
            <p  className="text-md mb-3">Admins can create new roles and assign permissions to these roles</p>
        </div>
        <div className="flex gap-3">
          <button className=" py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
            + Invite Users
          </button>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="bg-[#3EBF0F]  py-2 px-4 rounded-lg hover:bg-green-600">
            + New Role
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="border border-gray-300 rounded-lg p-4 relative body-theme shadow-sm"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{role.name}</h2>
              <div className="relative">
                <button
                    onClick={() => toggleMenu(role.id)}
                    className="h-8 w-8 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
                    >
                    <FontAwesomeIcon icon={faEllipsisH} className="icon-instance-node" />
                </button>

                {menuOpen === role.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-32 body-theme border border-gray-300 rounded-lg shadow-lg z-10"
                  >
                    <button
                      className="block w-full px-4 py-2 text-left text-sm  hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => alert(`Edit ${role.name}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => alert(`Delete ${role.name}`)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            <p className="mt-2">{role.description}</p>
            {role.default && (
              <span className="mt-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                Default
              </span>
            )}
          </div>
        ))}
      </div>

      <CreateRoleDrawer 
          show={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
        />
      </div>
    </div>
  );
};

export default RoleManagement;

