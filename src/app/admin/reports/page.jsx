'use client';

import React, { useEffect, useState } from 'react';
import UsersReport from '@/app/components/admin/Reports/UsersReport';
import { FolderDown } from 'lucide-react';
import UserDropdown from '@/app/components/admin/Reports/UserDropdown';
import MessagesReport from '@/app/components/admin/Reports/MessagesReport';
import TasksReport from '@/app/components/admin/Reports/TasksReport';
import CustomersReport from '@/app/components/admin/Reports/CustomersReport';
import DateFilter from '@/app/components/admin/Reports/DateFilter';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';
import { Tooltip } from "react-tooltip";
import UserAvatar from "../../components/UserAvatar";
import Image from "next/image";
import FollowUp from '@/app/components/admin/Reports/FollowUp';

const Page = () => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const [isRotating, setIsRotating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedSection, setSelectedSection] = useState('messages');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [dateRange, setDateRange] = useState(null);

  const hasDateRange = !!(dateRange?.startDate && dateRange?.endDate);


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
    fetchUsers();
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
      // case 'Follow up':
      //   return <FollowUp {...commonProps} />;
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
    console.log('Date range changed:', newRange);

    // Support both:
    // - { startDate, endDate }
    // - [ { startDate, endDate, ... } ]
    const range = Array.isArray(newRange) ? newRange[0] : newRange;

    if (range?.startDate && range?.endDate) {
      setDateRange({
        startDate: range.startDate,
        endDate: range.endDate,
      });
    } else {
      setDateRange(null);
    }
  };


  const handleClearFilters = () => {
    setIsFilterActive(false);
    setDateRange(null);
    setSelectedUser(null);
  };

  const isClear = () => {
    return isFilterActive || (dateRange && dateRange.length > 0 && dateRange[0]?.startDate && dateRange[0]?.endDate);
  };

  return (
    <div className="overflow-x-hidden flex flex-row body-theme px-10 min-h-[83vh] mb-5">
      <div className="relative body-theme flex-1 flex flex-col">
        <div className="flex justify-center sm:justify-between">
          <div className="flex gap-4">
            <UserDropdown selectedSection={selectedSection} setSelectedSection={setSelectedSection} />
            <div className="flex h-[40px] w-fit p-[8px_12px] justify-center items-center gap-2 rounded-[10px] border border-[#DFE1E6] body-theme shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
                <path
                  d="M5.333 2H4A2 2 0 0 0 2 4v2M5.333 2v-.667M5.333 2h5.334M5.333 2v.667M10.667 2H12A2 2 0 0 1 14 4v2M10.667 2v-.667M10.667 2v.667M2 6v6.667A2 2 0 0 0 4 14.667h8A2 2 0 0 0 14 12.667V6H2Z"
                  stroke="#808897"
                  strokeWidth="1.333"
                  strokeLinecap="round"
                />
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
                <path
                  d="M8 2.667A5.333 5.333 0 1 0 13.333 8M8 2.667 6.667 1.333M8 2.667 7 4.333M8 13.333a5.333 5.333 0 1 0-5.333-5.333M8 13.333l1.333 1.334M8 13.333l1-1.667"
                  stroke="#3EBF0F"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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
                  onMouseEnter={(e) => e.currentTarget.classList.add('z-20')}
                  onMouseLeave={(e) => {
                    if (selectedUser !== assignee.id) e.currentTarget.classList.remove('z-20');
                  }}
                  data-tooltip-id={`tooltip-${assignee.id}`}
                >
                  {assignee?.image ? (
                    <Image
                      alt="profile pic"
                      className="w-8 h-8 rounded-full"
                      src={assignee.image}
                      width={36}
                      height={36}
                    />
                  ) : (
                    <UserAvatar
                      name={
                        assignee?.first_name
                          ? `${assignee.first_name} ${assignee?.last_name}`
                          : assignee?.email || '--'
                      }
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                  )}

                  <Tooltip className="mt-1" id={`tooltip-${assignee.id}`} place="top">
                    {assignee?.first_name} {assignee?.last_name || ''}
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <div className="hidden cursor-pointer flex h-[40px] px-3 gap-2 rounded-[10px] bg-[#3EBF0F] items-center">
              <FolderDown />
              <span className="text-[14px] font-medium tracking-[0.2px] text-white">Export</span>
            </div>
            <div className="flex gap-2">
              <div
                className={`cursor-pointer flex h-[40px] px-3 items-center gap-2 rounded-[10px] border shadow-sm transition-all ${hasDateRange ? 'border-[#3EBF0F] bg-[#3EBF0F]/10' : 'border-[#DFE1E6]'
                  }`}
                onClick={toggleDateFilter}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
                  <path
                    d="M13.333 2H2.667A.667.667 0 0 0 2 2.667v1.08a2.667 2.667 0 0 0 .698 1.518l3.27 2.803A2.667 2.667 0 0 1 6.667 12v1.333A.667.667 0 0 0 7.333 14h1.334a.667.667 0 0 0 .666-.667V12a2.667 2.667 0 0 1 .698-1.932l3.27-2.803A2.667 2.667 0 0 0 14 3.747V2.667a.667.667 0 0 0-.667-.667Z"
                    stroke={
                      dateRange && dateRange.length > 0 && dateRange[0]?.startDate && dateRange[0]?.endDate
                        ? '#3EBF0F'
                        : '#808897'
                    }
                    strokeLinecap="round"
                  />
                </svg>

                <span className="text-[14px] font-medium">
                  {hasDateRange ? (
                    <>
                      {new Date(dateRange.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      -{' '}
                      {new Date(dateRange.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </>
                  ) : (
                    'Filter'
                  )}
                </span>
              </div>


              <button
                className="cursor-pointer flex h-[40px] px-3 items-center gap-2 rounded-[10px] border border-[#DFE1E6] text-[#FF4D4F] hover:bg-[#ffecec] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleClearFilters}
                disabled={!isClear()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
                  <path d="M4 4L12 12M4 12L12 4" stroke="#FF4D4F" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-[14px] font-medium">Clear Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Display - Shows when filters are applied */}
        {(selectedUser || (dateRange && dateRange.length > 0 && dateRange[0]?.startDate && dateRange[0]?.endDate)) && (
          <div className="mt-4 flex items-center gap-2 flex-wrap bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Active Filters:</span>

            {/* Date Range Filter Tag */}
            {dateRange && dateRange.length > 0 && dateRange[0]?.startDate && dateRange[0]?.endDate && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#3EBF0F]/10 border border-[#3EBF0F] rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none">
                  <path
                    d="M4.667 1.75H3.5a1.167 1.167 0 0 0-1.167 1.167v1.166M4.667 1.75v-.583M4.667 1.75h4.666M4.667 1.75v.583M9.333 1.75h1.167A1.167 1.167 0 0 1 11.667 2.917v1.166M9.333 1.75v-.583M9.333 1.75v.583M2.333 4.083v5.834A1.167 1.167 0 0 0 3.5 11.083h7a1.167 1.167 0 0 0 1.167-1.166V4.083M2.333 4.083h9.334"
                    stroke="#3EBF0F"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm font-medium text-[#3EBF0F]">
                  {new Date(dateRange[0].startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  -{' '}
                  {new Date(dateRange[0].endDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <button
                  onClick={() => setDateRange(null)}
                  className="ml-1 hover:bg-[#3EBF0F]/20 rounded-full p-0.5 transition-colors"
                  title="Remove date filter"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none">
                    <path
                      d="M3.5 3.5L10.5 10.5M3.5 10.5L10.5 3.5"
                      stroke="#3EBF0F"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Selected User Filter Tag */}
            {selectedUser && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#3EBF0F]/10 border border-[#3EBF0F] rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none">
                  <path
                    d="M8.167 8.167H5.833A2.917 2.917 0 0 0 2.917 11.083v.584c0 .322.261.583.583.583h7c.322 0 .583-.261.583-.583v-.584a2.917 2.917 0 0 0-2.916-2.916Z"
                    stroke="#3EBF0F"
                  />
                  <path d="M7 6.417a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z" stroke="#3EBF0F" />
                </svg>
                <span className="text-sm font-medium text-[#3EBF0F]">
                  {users.find((u) => u.id === selectedUser)?.first_name}{' '}
                  {users.find((u) => u.id === selectedUser)?.last_name}
                </span>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setIsFilterActive(false);
                  }}
                  className="ml-1 hover:bg-[#3EBF0F]/20 rounded-full p-0.5 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none">
                    <path
                      d="M3.5 3.5L10.5 10.5M3.5 10.5L10.5 3.5"
                      stroke="#3EBF0F"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {showDateFilter && <DateFilter onDateChange={handleDateChange} />}

        <div className="mt-6">{renderSection()}</div>
      </div>
    </div>
  );
};

export default Page;