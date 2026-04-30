import React, { useState, useRef, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { X } from "lucide-react";
import CreateRoleDrawer from "./CreateRoleDrawer";
import UpdateRoleDrawer from "./UpdateRoleDrawer";
import { useApi } from "@/services/axiosConfig";
import { useRouter, useSearchParams } from "next/navigation";
import useCustomAlert from "@/context/useCustomAlert";
import Pagination from "@/app/components/Pagination/Pagination";
import UserAvatar from "@/app/components/UserAvatar";
import Image from "next/image";

const RoleManagement = () => {
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [roleToEdit, setRoleToEdit] = useState(null);
  const { axiosInstance } = useApi();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showAlert, AlertModal } = useCustomAlert();

  // Role list pagination
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selected role + users table
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleUsers, setRoleUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userPageSize, setUserPageSize] = useState(10);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const usersTableRef = useRef(null);

  const isUpdateDrawerOpen = searchParams.get("action") === "update-role";

  const openUpdateDrawer = (roleId) => {
    const params = new URLSearchParams(searchParams);
    params.set("action", "update-role");
    params.set("roleId", roleId);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const closeUpdateDrawer = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("action");
    params.delete("roleId");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  const fetchRoles = async (page = 1, limit = pageSize) => {
    try {
      const response = await axiosInstance.get(`/users/roles/?limit=${limit}&page=${page}`);
      setRoles(response.data.results);
      setTotalPages(Math.ceil(response.data.count / limit));
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchRoleUsers = useCallback(async (roleId, page = 1, limit = userPageSize, search = userSearch) => {
    setUserLoading(true);
    try {
      const params = new URLSearchParams({ role_id: roleId, page, limit });
      if (search) params.set("search", search);
      const response = await axiosInstance.get(`/users/?${params.toString()}`);
      setRoleUsers(response.data.results || []);
      setUserTotalPages(Math.ceil((response.data.count || 0) / limit));
    } catch (error) {
      console.error("Error fetching role users:", error);
    } finally {
      setUserLoading(false);
    }
  }, [axiosInstance, userPageSize, userSearch]);

  const handleSelectRole = (role) => {
    if (selectedRole?.id === role.id) return;
    setSelectedRole(role);
    setUserPage(1);
    setUserSearch("");
    setRoleUsers([]);
    setTimeout(() => usersTableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleClearSelection = () => {
    setSelectedRole(null);
    setRoleUsers([]);
    setUserSearch("");
    setUserPage(1);
  };

  const handleDeleteRole = (roleId) => {
    showAlert(
      "Confirm Deletion",
      "Are you sure you want to delete this role?",
      async () => {
        try {
          await axiosInstance.delete(`/users/roles/${roleId}/`);
          if (selectedRole?.id === roleId) handleClearSelection();
          fetchRoles(currentPage);
        } catch (error) {
          console.error("Error deleting role:", error);
        }
      }
    );
  };

  const handleEditRole = (roleId) => {
    setRoleToEdit(roleId);
    openUpdateDrawer(roleId);
  };

  useEffect(() => {
    fetchRoles(currentPage);
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (!selectedRole) return;
    fetchRoleUsers(selectedRole.id, userPage, userPageSize, userSearch);
  }, [selectedRole, userPage, userPageSize]);

  // Debounce search
  useEffect(() => {
    if (!selectedRole) return;
    const t = setTimeout(() => fetchRoleUsers(selectedRole.id, 1, userPageSize, userSearch), 350);
    return () => clearTimeout(t);
  }, [userSearch]);

  return (
    <div className="overflow-x-hidden flex flex-col pr-10 h-full justify-between">
      <div className="body-theme pl-10 w-full min-h-80">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Role Management</h2>
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

        <div className="grid grid-cols-3 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => handleSelectRole(role)}
              className={`border rounded-lg p-4 relative body-theme shadow-sm cursor-pointer transition-colors
                ${selectedRole?.id === role.id
                  ? "border-[#3EBF0F] ring-1 ring-[#3EBF0F]"
                  : "border-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
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
                      className="absolute z-50 right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
                    >
                      <button
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={(e) => { e.stopPropagation(); handleEditRole(role.id); }}
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
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {role.description ?? "No description"}
              </p>
            </div>
          ))}
          {AlertModal()}
        </div>

        {/* Users with selected role */}
        {selectedRole && (
          <div ref={usersTableRef} className="mt-10">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-semibold">
                  Users with role: <span className="text-[#3EBF0F]">{selectedRole.name}</span>
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {roleUsers.length === 0 && !userLoading ? "No users assigned to this role" : "Click a row to view the user"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-[#3EBF0F]"
                />
                <button
                  onClick={handleClearSelection}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X size={14} /> Clear
                </button>
              </div>
            </div>

            <div className="overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full body-theme">
                <thead className="bg-gray-100 dark:bg-neutral-900">
                  <tr>
                    <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">Name</th>
                    <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">Email</th>
                    <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">Phone</th>
                    <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">Roles</th>
                  </tr>
                </thead>
                <tbody>
                  {userLoading ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400 text-sm">Loading...</td>
                    </tr>
                  ) : roleUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400 text-sm">No users found</td>
                    </tr>
                  ) : (
                    roleUsers.map((user) => {
                      if (user?.first_name === "Artificial" && user?.last_name === "Intelligence") return null;
                      return (
                        <tr
                          key={user.id}
                          onClick={() => router.push(`/nativecrm/users/${user.id}`)}
                          className="hover:dark:bg-neutral-900 hover:bg-gray-100 cursor-pointer"
                        >
                          <td className="py-3 px-4 border-b flex items-center space-x-3">
                            {user?.image ? (
                              <Image
                                src={user.image}
                                alt={user.first_name || user.email}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <UserAvatar
                                name={user.first_name ? `${user.first_name} ${user.last_name}` : user.email || "--"}
                                width="w-8"
                                height="h-8"
                              />
                            )}
                            <span>{user.first_name ? `${user.first_name} ${user.last_name}` : "--"}</span>
                          </td>
                          <td className="py-3 px-4 border-b text-sm">{user.email}</td>
                          <td className="py-3 px-4 border-b text-sm">{user.phone_number || "--"}</td>
                          <td className="py-3 px-4 border-b text-sm">
                            <div className="flex flex-wrap gap-1">
                              {user.roles?.map((r) => (
                                <span key={r.id} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                  {r.name}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {userTotalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={userPage}
                  totalPages={userTotalPages}
                  onPageChange={setUserPage}
                  onPageSizeChange={(s) => { setUserPageSize(s); setUserPage(1); }}
                  pageSize={userPageSize}
                />
              </div>
            )}
          </div>
        )}

        <CreateRoleDrawer
          show={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            fetchRoles();
          }}
          onRoleCreated={() => fetchRoles(currentPage)}
        />
        <UpdateRoleDrawer
          show={isUpdateDrawerOpen}
          onClose={closeUpdateDrawer}
          roleId={roleToEdit}
          onRoleUpdated={() => {
            fetchRoles(currentPage);
            if (selectedRole?.id === roleToEdit) {
              fetchRoleUsers(roleToEdit, userPage, userPageSize, userSearch);
            }
          }}
        />
      </div>

      <div className="mt-10 pl-10">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default RoleManagement;
