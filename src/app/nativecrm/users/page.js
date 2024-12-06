"use client";

import React, { useEffect, useState, useMemo } from 'react';
import UserGrid from '@/app/components/Users/UserGrid';
import UserTable from '@/app/components/Users/UserTable';
import CreateUserModal from '@/app/components/Users/CreateUserModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import Image from 'next/image';
import {
    faPhone,
    faClock,
    faTh,
    faSort,
    faFilter,
    faEnvelope,
    faCommentDots,
    faEllipsis,
    faUser,
  } from '@fortawesome/free-solid-svg-icons';
  import table from '/public/assets/table.svg'
  import grid from '/public/assets/grid.svg'
  import sort from '/public/assets/sort.svg'
  import filter from '/public/assets/filter.svg'
  import NoDataFound from '@/app/components/NoDataFound';
  import empty from '/public/assets/empty.svg'
  
const users = [
    {
      id: 1,
      name: 'Ogechi Arinze',
      email: 'ogecharinze@gmail.com',
      phone: '+234 810 179 0957',
      role: 'Manager',
      comments: 15,
      lastActive: '2d',
      image: 'https://via.placeholder.com/40',
      mark: 1,
    },
    {
      id: 2,
      name: 'Samuel Johnson',
      email: 'samuelj@gmail.com',
      phone: '+234 810 123 4567',
      role: 'Agent',
      comments: 10,
      lastActive: '5d',
      image: 'https://via.placeholder.com/40',
      mark: 1,
    },
    {
      id: 3,
      name: 'Amara Eze',
      email: 'amaraeze@gmail.com',
      phone: '+234 813 123 7890',
      role: 'Team Member',
      comments: 7,
      lastActive: '3h',
      image: 'https://via.placeholder.com/40',
      mark: 1,
    },
    {
      id: 4,
      name: 'Chidi Okafor',
      email: 'chidiokafor@gmail.com',
      phone: '+234 818 456 7890',
      role: 'Manager',
      comments: 20,
      lastActive: '1w',
      image: 'https://via.placeholder.com/40',
      mark: 1,
    },
    {
      id: 5,
      name: 'Fatima Bello',
      email: 'fatimabello@gmail.com',
      phone: '+234 802 987 6543',
      role: 'Agent',
      comments: 12,
      lastActive: '12h',
      image: 'https://via.placeholder.com/40',
      mark: 1,
    },
    {
      id: 6,
      name: 'Tunde Balogun',
      email: 'tundebalogun@gmail.com',
      phone: '+234 809 345 6789',
      role: 'Team Member',
      comments: 5,
      lastActive: '30m',
      image: 'https://via.placeholder.com/40',
      mark: 1,
      isActive: true,
    },
  ];

const Users = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [view, setView] = useState('list');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const { handleApiError } = useError()
    const { axiosInstance, loading } = useApi()

    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const { data } = await axiosInstance.get('/users');
            const users = data.results || [];

            console.log('users are', users)
            setUsers(users);
          } catch (error) {
            handleApiError(error);
          }
        };
    
        fetchUsers();

        const storedView = localStorage.getItem('view');
        console.log('stored view is ', storedView)
        if (storedView) {
          setView(storedView);
        }
    }, []);

    
    const toggleView = () => {
        const newView = view === 'grid' ? 'list' : 'grid';
        setView(newView);

        localStorage.setItem('view', newView);
    };

    return (
        <div className="overflow-x-hidden flex flex-row body-theme px-10 min-h-[83vh]">      
            <div className='relative body-theme flex-1 flex flex-col '>    
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleView}
                        className="flex items-center border border-gray-300 px-3 py-1.5 
                        rounded-lg shadow-sm  hover:bg-gray-50 hover:dark:bg-neutral-900 hover:bg-gray-100"
                    >
                        {view === 'grid' ? 
                            <Image src={table} className='mr-2' width={15} height={15}  /> : 
                            <Image src={grid} className='mr-2' width={15} height={15} />
                            }
                        <span className="text-sm font-medium">
                            {view === 'grid' ? 'List View' : 'Grid View'}
                        </span>
                    </button>
                    <button className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg 
                    shadow-sm hover:dark:bg-neutral-900 hover:bg-gray-100">
                        <Image src={sort} className='mr-2' width={15} height={15} />
                        <span className="text-sm font-medium">Sort by</span>
                    </button>
                    <button className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm 
                    hover:dark:bg-neutral-900 hover:bg-gray-100">
                        <Image src={filter} className='mr-2' width={15} height={15} />
                        <span className="text-sm font-medium">Filter</span>
                    </button>
                    </div>
                    <button 
                    onClick={openModal}
                    className="bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm">
                    + Invite User
                    </button>
                </div>

                {users.length > 0 ? (
                  view === 'list' ? (
                      <UserTable searchQuery={searchQuery} users={users} />
                  ) : (
                  <UserGrid searchQuery={searchQuery} users={users} />
                  )
                ): (
                  <div className="min-h-96 flex items-center justify-center">
                    <NoDataFound message='You do not have any users' icon={empty} />
                  </div>
                )
                }
                
            </div>
            <CreateUserModal isModalOpen={isModalOpen} closeModal={closeModal} />
        </div>
    );
};

export default Users;
