import React, { useState } from 'react';
import { BiSort, BiFilter, BiGridAlt } from 'react-icons/bi';
import Pagination from '../../components/pagination/Pagination';
import { FaPhone } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegClock } from "react-icons/fa6";

const UserTable = ({ searchQuery }) => {
  const users = [
    { name: 'Ogachi Arina', role: 'Manager', email: 'ogachiarina@gmail.com', phone: '+234 678 876 8767', lastActive: '23m ago', image: 'https://via.placeholder.com/50/FFB6C1/000000?text=OA' },
    { name: 'Johnson Adeyemi', role: 'Agent', email: 'johnsonadeyemi@gmail.com', phone: '+234 789 123 1234', lastActive: '1h ago', image: 'https://via.placeholder.com/50/87CEEB/000000?text=JA' },
    { name: 'Linda Chika', role: 'Team Member', email: 'lindachika@gmail.com', phone: '+234 765 432 1234', lastActive: '5h ago', image: 'https://via.placeholder.com/50/F4F0FF/000000?text=LC' },
    { name: 'Ahmed Bello', role: 'Admin', email: 'ahmedbello@gmail.com', phone: '+234 234 567 8901', lastActive: '1d ago', image: 'https://via.placeholder.com/50/FEF1ED/000000?text=AB' },
    { name: 'Grace Obi', role: 'Manager', email: 'graceobi@gmail.com', phone: '+234 321 456 7890', lastActive: '2d ago', image: 'https://via.placeholder.com/50/FFB6C1/000000?text=GO' },
    { name: 'Samuel Ifeanyi', role: 'Agent', email: 'samuelifeanyi@gmail.com', phone: '+234 456 789 1234', lastActive: '3d ago', image: 'https://via.placeholder.com/50/87CEEB/000000?text=SI' },
    { name: 'Mariam Sule', role: 'Team Member', email: 'mariamsule@gmail.com', phone: '+234 654 321 7890', lastActive: '4d ago', image: 'https://via.placeholder.com/50/F4F0FF/000000?text=MS' },
    { name: 'Emeka Nwosu', role: 'Admin', email: 'emekanwosu@gmail.com', phone: '+234 123 456 7890', lastActive: '1w ago', image: 'https://via.placeholder.com/50/FEF1ED/000000?text=EN' },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (page) => {
      setCurrentPage(page);
  };

  // Filter users based on searchQuery
  const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedUsers = filteredUsers.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
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
      <div className="p-6 bg-gray-100 min-h-screen">
          <div className="bg-white rounded-lg shadow-lg p-6">
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
              <div className="overflow-auto rounded-lg shadow">
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

              {/* Pagination */}
              <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
              />
          </div>
      </div>
  );
};

export default UserTable;
