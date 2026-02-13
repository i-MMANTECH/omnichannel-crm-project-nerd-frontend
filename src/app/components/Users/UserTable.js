import React, { useState, useEffect } from "react";
import Pagination from "../Pagination/Pagination";
import "./UserTable.css";
import { useRouter } from "next/navigation";
import UserAvatar from "../UserAvatar";
import { getRoleStyle } from "@/utils/getRoleStyle";
import Image from "next/image";


const UserTable = ({ searchQuery, users }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter()

  const handlePageChange = (page) => setCurrentPage(page);

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };


  return (
    < >
      <div >
        <div className="overflow-auto ">
          <table className="min-w-full body-theme ">
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
              {users.map((user, index) => {
                if (user?.first_name === 'Artificial' && user?.last_name === 'Intelligence') {
                  return null;
                }
                return (
                  <tr key={index} onClick={() => router.push(`users/${user.id}`)} className="hover:dark:bg-neutral-900 hover:bg-gray-100 cursor-pointer">
                    <td className="py-3 px-4 border-b flex items-center space-x-3">
                      {user?.image && <Image
                        className="user-left-image mt-2 w-10 h-10 rounded-full"
                        alt="bio"
                        src={user?.image}
                        width={50}
                        height={50}
                      />}
                      {!user?.image &&
                        <UserAvatar
                          name={user.first_name ?
                            `${user.first_name} ${user.last_name}` :
                            user.email || '--'
                          }
                          width="w-8"
                          height="h-8"
                        />
                      }
                      <span>{user.first_name ?
                        `${user.first_name} ${user.last_name}` :
                        '--'
                      } </span>
                    </td>
                    <td className="py-3 px-4 border-b">
                      {user.roles.map((role) => (
                        <span
                          key={role.id}
                          className="px-2 py-1 rounded ml-1 text-sm"
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
                )
              })}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
};

export default UserTable;
