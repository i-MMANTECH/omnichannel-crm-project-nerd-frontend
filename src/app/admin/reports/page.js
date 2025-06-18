'use client';

import React, { useEffect, useState } from 'react';
import UsersReport from '@/app/components/Reports/UsersReport';
import { FolderDown } from 'lucide-react';
import UserDropdown from '@/app/components/Reports/UserDropdown';
import MessagesReport from '@/app/components/Reports/MessagesReport';
import TasksReport from '@/app/components/Reports/TasksReport';
import CustomersReport from '@/app/components/Reports/CustomersReport';
import DateFilter from '@/app/components/Reports/DateFilter';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';
import { Tooltip } from "react-tooltip";
import UserAvatar from "../../components/UserAvatar";
import Image from "next/image";

const Page = () => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const [isRotating, setIsRotating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedSection, setSelectedSection] = useState('messages');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState([])
  const [isFilterActive, setIsFilterActive] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0);

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
    },
  ]);

  const updateLastUpdatedTime = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString();
    setLastUpdated(formattedTime);
  };

  const handleRefreshClick = () => {
    setIsRotating(true);
    updateLastUpdatedTime();
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => setIsRotating(false), 500);
  };
  

  useEffect(() => {
    updateLastUpdatedTime();
    fetchUsers()
  }, [selectedSection]);

  const renderSection = () => {
    const commonProps = {
      filters: dateRange,
      selectedUser: selectedUser,
      refreshKey: refreshKey,
    };
    

    switch (selectedSection) {
      case 'users':
        return <UsersReport {...commonProps} />;
      case 'messages':
        return <MessagesReport {...commonProps} />;
      case 'tasks':
        return <TasksReport {...commonProps} />;
      case 'customers':
        return <CustomersReport {...commonProps} />;
      default:
        return null;
    }
  };


  const fetchUsers = async () => {
  try {
      const { data } = await axiosInstance.get(`/users`);
      setUsers(data.results || []);
  } catch (error) {
      handleApiError(error);
  }
  };

  const handleAssigneeClick = (userId) => {
  if (selectedUser === userId) {
    setSelectedUser(null);
    setIsFilterActive(false);
  } else {
    setSelectedUser(userId);
    setIsFilterActive(true);
  }
  };
  
  const toggleDateFilter = () => {
    setShowDateFilter((prev) => !prev);
  };

  const handleDateChange = (newRange) => {
    setDateRange(newRange);
  };

  const handleClearFilters = () => {
    if (isFilterActive || (dateRange && dateRange.startDate && dateRange.endDate)) {
      setIsFilterActive(false);
      setDateRange(null); 
      setSelectedUser(null); 
    }
  };


  const isClear = () => {
    return isFilterActive || (dateRange && dateRange.startDate && dateRange.endDate)
  }
  
  return (
    <div className="overflow-x-hidden flex flex-row body-theme px-10 min-h-[83vh] mb-5">
      <div className='relative body-theme flex-1 flex flex-col'>
        <div className="flex justify-center sm:justify-between">
          <div className='flex gap-4'>
            <UserDropdown
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
            />
            <div className="flex h-[40px] w-fit p-[8px_12px] justify-center items-center gap-2 rounded-[10px] border border-[#DFE1E6] body-theme shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
                <path d="M5.333 2H4A2 2 0 0 0 2 4v2M5.333 2v-.667M5.333 2h5.334M5.333 2v.667M10.667 2H12A2 2 0 0 1 14 4v2M10.667 2v-.667M10.667 2v.667M2 6v6.667A2 2 0 0 0 4 14.667h8A2 2 0 0 0 14 12.667V6H2Z" stroke="#808897" strokeWidth="1.333" strokeLinecap="round"/>
              </svg>
              <span className="text-[14px] font-medium leading-[150%] tracking-[0.2px]">
                Last updated: {lastUpdated || 'Never'}
              </span>
              <svg
                className={`cursor-pointer ${isRotating ? 'rotate' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                onClick={handleRefreshClick}
              >
                <path d="M8 2.667A5.333 5.333 0 1 0 13.333 8M8 2.667 6.667 1.333M8 2.667 7 4.333M8 13.333a5.333 5.333 0 1 0-5.333-5.333M8 13.333l1.333 1.334M8 13.333l1-1.667" stroke="#3EBF0F" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <div className="flex items-center">
              {users.map((assignee, index) => (
                <div 
                  key={index}
                  className={`relative cursor-pointer rounded-full border-2 border-white transition-all duration-300 
                    ${selectedUser === assignee.id ? 'z-20 ring-2 dark:ring-white ring-gray-500' : 'z-10'}
                  `}
                  style={{ marginLeft: index !== 0 ? '-10px' : '0px' }}
                  onClick={() => handleAssigneeClick(assignee.id)}
                  onMouseEnter={(e) => e.currentTarget.classList.add("z-20")}
                  onMouseLeave={(e) => {
                    if (selectedUser !== assignee.id) e.currentTarget.classList.remove("z-20");
                  }}
                  data-tooltip-id={`tooltip-${assignee.id}`}
                >
                  {assignee?.image ? (
                    <Image
                      alt="profile pic"
                      className="w-9 h-9 rounded-full"
                      src={assignee.image} 
                      width={36}
                      height={36}
                    />
                  ) : (
                    <UserAvatar 
                      name={
                        assignee?.first_name ? 
                        `${assignee.first_name} ${assignee?.last_name}` : 
                        assignee?.email || '--'
                      } 
                      className="w-9 h-9 rounded-full flex-shrink-0"
                    />
                  )}

                  <Tooltip className="mt-1" id={`tooltip-${assignee.id}`} place="top">
                    {assignee?.first_name} {assignee?.last_name || ""}
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>

          <div className='flex gap-2'>
            <div className="hidden cursor-pointer flex h-[40px] px-3 gap-2 rounded-[10px] bg-[#3EBF0F] items-center">
              <FolderDown />
              <span className="text-[14px] font-medium tracking-[0.2px] text-white">Export</span>
            </div>
            <div className='flex gap-2'>
            <div
              className="cursor-pointer flex h-[40px] px-3 items-center gap-2 rounded-[10px] border border-[#DFE1E6] shadow-sm"
              onClick={toggleDateFilter}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
                <path d="M13.333 2H2.667A.667.667 0 0 0 2 2.667v1.08a2.667 2.667 0 0 0 .698 1.518l3.27 2.803A2.667 2.667 0 0 1 6.667 12v1.333A.667.667 0 0 0 7.333 14h1.334a.667.667 0 0 0 .666-.667V12a2.667 2.667 0 0 1 .698-1.932l3.27-2.803A2.667 2.667 0 0 0 14 3.747V2.667a.667.667 0 0 0-.667-.667Z" stroke="#808897" strokeLinecap="round"/>
              </svg>
              <span className="text-[14px] font-medium">Filter</span>
            </div>

            <button
              className="cursor-pointer flex h-[40px] px-3 items-center gap-2 rounded-[10px] border border-[#DFE1E6] text-[#FF4D4F] hover:bg-[#ffecec] transition-all"
              onClick={handleClearFilters}
              disabled={!isClear()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
                <path d="M4 4L12 12M4 12L12 4" stroke="#FF4D4F" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-[14px] font-medium">Clear Filter</span>
            </button>
          </div>
          </div>
        </div>

        {showDateFilter && <DateFilter onDateChange={handleDateChange} />}
        
        <div className="mt-6">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default Page;
