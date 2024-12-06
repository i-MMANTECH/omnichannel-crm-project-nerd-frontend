import React, { useState, useEffect } from "react";
import Pagination from "../Pagination/Pagination";
import "./UserTable.css";
import { useRouter } from "next/navigation";
import UserAvatar from "../UserAvatar";


const UserTable = ({ searchQuery, users }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter()

  const handlePageChange = (page) => setCurrentPage(page);

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case "Manager":
        return { backgroundColor: "#E7FEF8", color: "#40C4AA" };
      case "Agent":
        return { backgroundColor: "#EDF9FF", color: "#1285FE" };
      case "Team Member":
        return { backgroundColor: "#F4F0FF", color: "#936DFF" };
      case "Admin":
        return { backgroundColor: "#FEF1ED", color: "#F36F4A" };
      default:
        return {};
    }
  };

  return (
    <div>
        <div>
          <div className="overflow-auto">
          <table className="min-w-full bg-theme">
            <thead className="bg-gray-100 dark:bg-neutral-900">
              <tr>
                <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                  Name
                </th>
                <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                  Role
                </th>
                <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                  Email
                </th>
                <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                  Phone
                </th>
                <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                  Last Active
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} onClick={() => router.push(`users/user-details/${user.id}`)} className="hover:dark:bg-neutral-900 hover:bg-gray-100 cursor-pointer">
                  <td className="py-3 px-4 border-b flex items-center space-x-3">
                    <UserAvatar
                      name={user.name || "--"}
                    />
                    <span>{user.name || "--"}</span>
                  </td>
                  <td className="py-3 px-4 border-b">
                    {user.roles.map((role) => (
                      <span
                        key={role.id}
                        className="px-2 py-1 rounded"
                        style={getRoleStyle(role.name)}
                      >
                        {role.name}
                      </span>
                    ))}
                  </td>
                  <td className="py-3 px-4 border-b">
                      <span style={{ color: "inherit", textDecoration: "none" }}>
                        {user.email}
                      </span>
                  </td>
                  <td className="py-3 px-4 border-b">
                      <span style={{ color: "inherit", textDecoration: "none" }}>
                        {user.phone_number}
                      </span>
                  </td>
                  <td className="py-3 px-4 border-b">
                      <span style={{ color: "inherit", textDecoration: "none" }}>
                        {user.lastActive || "--"}
                      </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(users.length / pageSize)}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default UserTable;
