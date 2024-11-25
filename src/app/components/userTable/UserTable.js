import React, { useState, useEffect } from "react";
import Pagination from "../../components/pagination/Pagination";
import "./userTable.css";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";

const UserTable = ({ searchQuery }) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosInstance.get("/users", {
          params: { page: currentPage, pageSize },
        });
        if (data.success) {
          setUsers(data.results);
          setTotalCount(data.count);
        }
      } catch (error) {
        handleApiError(error);
      }
    };
    fetchUsers();
  }, [currentPage, pageSize]);
  

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
        <div className="p-6 body-theme min-h-screen border-l">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-1 border border-gray-500 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M14 6V4C14 2.89543 13.1046 2 12 2L8 2M14 6H8M14 6V10M2 6L2 4C2 2.89543 2.89543 2 4 2L8 2M2 6L8 6M2 6L2 10M8 6L8 2M8 6V10M8 14H12C13.1046 14 14 13.1046 14 12V10M8 14H4C2.89543 14 2 13.1046 2 12L2 10M8 14V10M8 10L14 10M8 10H2" stroke="#F36F4A" strokeWidth="1.33333" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-sm font-medium text-gray-600">Table View</span>
                            <span className="text-gray-500">&#x25BC;</span>
                        </button>

                        <span className="h-6 border-l border-gray-500 mx-2"></span>

                        <button className="flex items-center space-x-1 border border-gray-500 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4.99984 4L2.6665 6.33333M4.99984 4L7.33317 6.33333M4.99984 4V12M10.9998 12L8.6665 9.66667M10.9998 12L13.3332 9.66667M10.9998 12V4" stroke="#808897" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-sm font-medium text-gray-600">Sort by</span>
                        </button>

                        <button className="flex items-center space-x-1 border border-gray-500 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13.3333 2H2.66667C2.29848 2 2 2.29848 2 2.66667V3.7468C2 4.33065 2.25513 4.88535 2.69842 5.26531L5.96825 8.06802C6.41154 8.44799 6.66667 9.00269 6.66667 9.58654V14L9.33333 12.6667V9.58654C9.33333 9.00269 9.58846 8.44799 10.0318 8.06802L13.3016 5.26531C13.7449 4.88535 14 4.33065 14 3.7468V2.66667C14 2.29848 13.7015 2 13.3333 2Z" stroke="#808897" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-sm font-medium text-gray-600">Filter</span>
                        </button>
                        </div>
                    </div>

                <button className=" px-4 py-2 rounded-md shadow-sm" style={{ backgroundColor: '#3EBF0F' }}>
                    + New User
                </button>
                </div>


                {/* Table */}
                <div className="overflow-auto">
                    <table className="min-w-full body-theme">
                    <thead className="bg-gray-100 dark:bg-neutral-900">
                        <tr>
                            <th  className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">Name</th>
                            <th  className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                                        <path d="M3.46675 8.26683L8.66675 1.3335L8.00008 6.66683H12.0001C12.5494 6.66683 12.863 7.29401 12.5334 7.7335L7.33342 14.6668L8.00008 9.3335H4.00008C3.45072 9.3335 3.13713 8.70632 3.46675 8.26683Z" stroke="#808897" strokeLinejoin="round" />
                                    </svg>
                                    <span className="ml-1">Role</span>
                                </div>
                            </th>
                            <th  className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                                        <path d="M4 5.3335L6.80743 6.73721C7.55817 7.11258 8.44183 7.11258 9.19257 6.73721L12 5.3335M4 12.6668H12C13.1046 12.6668 14 11.7714 14 10.6668V5.3335C14 4.22893 13.1046 3.3335 12 3.3335H4C2.89543 3.3335 2 4.22893 2 5.3335V10.6668C2 11.7714 2.89543 12.6668 4 12.6668Z" stroke="#808897" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="ml-1">Email</span>
                                </div>
                            </th>
                            <th  className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                                        <path d="M7.86164 9.82798L6.16797 8.13712C5.62282 7.59287 5.62282 6.71048 6.16797 6.16623C6.65516 5.67985 6.71403 4.91134 6.30658 4.35665L4.9159 2.46343C4.50421 1.90296 3.68898 1.84072 3.19671 2.33217C2.44724 3.08039 1.94543 4.07059 2.00475 5.12706C2.29456 10.2884 6.33224 13.7386 10.8984 13.9953C11.9455 14.0542 12.9207 13.5486 13.6623 12.8082C14.1619 12.3094 14.0986 11.4834 13.5289 11.0663L11.6484 9.68959C11.0928 9.28282 10.323 9.34159 9.83581 9.82798C9.29066 10.3722 8.4068 10.3722 7.86164 9.82798Z" stroke="#808897" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="ml-1">Phone</span>
                                </div>
                            </th>
                            <th  className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                                        <path d="M7.99992 14.6668C11.6818 14.6668 14.6666 11.6821 14.6666 8.00016C14.6666 4.31826 11.6818 1.3335 7.99992 1.3335C4.31802 1.3335 1.33325 4.31826 1.33325 8.00016C1.33325 11.6821 4.31802 14.6668 7.99992 14.6668Z" stroke="#808897" />
                                        <path d="M8 5.3335V8.00016L9.33333 9.3335" stroke="#808897" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="ml-1">Last Active</span>
                                </div>
                            </th>
                        </tr>
                    </thead>


                        <tbody>
                            {displayedUsers.map((user, index) => (
                                <tr  
                                style={{
                                    width: '100px',
                                    flexShrink: 0,
                                    fontFamily: '"Encode Sans"',
                                    fontSize: '14px',
                                    fontStyle: 'normal',
                                    fontWeight: 500,
                                    lineHeight: '150%',
                                    letterSpacing: '0.2px'
                                }} 
                                key={index} className="hover:dark:bg-neutral-900 hover:bg-gray-100 cursor-pointer">
                                    <td className="py-3 px-4 border-b border-gray-500 flex items-center space-x-3">
                                        <img src={user.image}
                                            alt={`${user.name}'s avatar`}
                                            className="w-10 h-10 rounded-full"
                                            />
                                        <span>{user.name}</span>
                                    </td>
                                    <td className="py-3 px-4 border-b border-gray-500">
                                        <span
                                            className="px-2 py-1 rounded-full text-sm font-medium"
                                            style={getRoleStyle(user.role)}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 border-b border-gray-500">{user.email}</td>
                                    <td className="py-3 px-4 border-b border-gray-500">{user.phone}</td>
                                    <td className="py-3 px-4 border-b border-gray-500">{user.lastActive}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default UserTable;
