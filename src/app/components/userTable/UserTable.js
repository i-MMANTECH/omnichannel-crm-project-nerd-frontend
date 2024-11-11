import React, { useState, useMemo } from 'react';
import { BiSort, BiFilter, BiGridAlt } from 'react-icons/bi';
import Pagination from '../../components/pagination/Pagination';
import { FaPhone } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegClock } from "react-icons/fa6";

const UserTable = ({ searchQuery, users }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); 
    const totalPages = Math.ceil(users.length / pageSize);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1); 
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, users]);

    const displayedUsers = filteredUsers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const getRoleStyle = (role) => {
        switch (role) {
            case 'Manager':
                return { backgroundColor: '#E7FEF8', color: '#40C4AA' };
            case 'Agent':
                return { backgroundColor: '#EDF9FF', color: '#1285FE' };
            case 'Team Member':
                return { backgroundColor: '#F4F0FF', color: '#936DFF' };
            case 'Admin':
                return { backgroundColor: '#FEF1ED', color: '#F36F4A' };
            default:
                return {};
        }
    };

    return (
        <div className="p-6 bg-white min-h-screen border-l">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-2xl font-bold text-gray-700">Users</h2>
                        <div className="flex items-center space-x-2">
                            <button className="flex items-center space-x-1 border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
                                <BiGridAlt size={18} className="text-orange-500" />
                                <span className="text-sm font-medium text-gray-600">Table View</span>
                                <span className="text-gray-500">&#x25BC;</span>
                            </button>
                            <span className="h-6 border-l border-gray-300 mx-2"></span>
                            <button className="flex items-center space-x-1 border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
                                <BiSort size={18} className="text-gray-500" />
                                <span className="text-sm font-medium text-gray-600">Sort by</span>
                            </button>
                            <button className="flex items-center space-x-1 border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
                                <BiFilter size={18} className="text-gray-500" />
                                <span className="text-sm font-medium text-gray-600">Filter</span>
                            </button>
                        </div>
                    </div>
                    <button className="text-white px-4 py-2 rounded-md shadow-sm" style={{ backgroundColor: '#3EBF0F' }}>+ New User</button>
                </div>

                {/* Table */}
                <div className="overflow-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600 border-b">Name</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600 border-b">Role</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600 border-b">
                                    <div className="flex items-center">
                                        <MdOutlineEmail className="text-gray-500 mr-1" size={16} />
                                        Email
                                    </div>
                                </th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600 border-b">
                                    <div className="flex items-center">
                                        <FaPhone className="text-gray-500 mr-1" size={16} />
                                        Phone
                                    </div>
                                </th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600 border-b">
                                    <div className="flex items-center">
                                        <FaRegClock className="text-gray-500 mr-1" size={16} />
                                        Last Active
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedUsers.map((user, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 border-b flex items-center space-x-3">
                                        <img
                                            src={user.image}
                                            alt={`${user.name}'s avatar`}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <span>{user.name}</span>
                                    </td>
                                    <td className="py-3 px-4 border-b">
                                        <span
                                            className="px-2 py-1 rounded-full text-sm font-medium"
                                            style={getRoleStyle(user.role)}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 border-b">{user.email}</td>
                                    <td className="py-3 px-4 border-b">{user.phone}</td>
                                    <td className="py-3 px-4 border-b">{user.lastActive}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    pageSize={pageSize}
                />
            </div>
        </div>
    );
};

export default UserTable;
