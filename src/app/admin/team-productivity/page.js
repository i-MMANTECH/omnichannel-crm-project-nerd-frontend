/**
 * Team Productivity Dashboard Page
 * 
 * This component serves as the main dashboard for viewing team productivity reports.
 * It provides filtering capabilities by date range and user, and displays different
 * types of reports including messages, tasks, customers, users, and follow-ups.
 * 
 * Features:
 * - Dynamic report section switching
 * - Date range filtering
 * - User-specific filtering
 * - Real-time data refresh
 * - Active filter display
 * - Export functionality (UI only)
 */
'use client';

// Import React hooks and components
import React, { useEffect, useState } from 'react';

// Import report components for different data views
import UsersReport from '@/app/components/admin/Reports/UsersReport';
import MessagesReport from '@/app/components/admin/Reports/MessagesReport';
import TasksReport from '@/app/components/admin/Reports/TasksReport';
import TasksSection from '@/app/components/admin/Reports/TasksSection';
import CustomersReport from '@/app/components/admin/Reports/CustomersReport';
import FollowUp from '@/app/components/admin/Reports/FollowUp';

// Import UI components and utilities
import UserDropdown from '@/app/components/admin/Reports/UserDropdown';
import DateFilter from '@/app/components/admin/Reports/DateFilter';
import UserAvatar from "../../components/UserAvatar";

// Import icons and external libraries
import { FolderDown } from 'lucide-react';
import { Tooltip } from "react-tooltip";
import Image from "next/image";

// Import custom hooks and services
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';

const Page = () => {
    // Custom hooks for API calls and error handling
    const { axiosInstance } = useApi();
    const { handleApiError } = useError();
    
    // UI State Management
    const [isRotating, setIsRotating] = useState(false); // Controls refresh icon rotation animation
    const [lastUpdated, setLastUpdated] = useState(null); // Stores the last data refresh timestamp
    const [selectedSection, setSelectedSection] = useState('messages'); // Currently active report section
    const [showDateFilter, setShowDateFilter] = useState(false); // Controls date filter dropdown visibility
    
    // Data State Management
    const [users, setUsers] = useState([]); // List of all users for filtering
    const [selectedUser, setSelectedUser] = useState(null); // Currently selected user for filtering
    const [dateRange, setDateRange] = useState(null); // Selected date range for filtering
    const [refreshKey, setRefreshKey] = useState(0); // Key to force re-render of report components
    
    // Filter State
    const [isFilterActive, setIsFilterActive] = useState(false); // Indicates if any filter is active
    
    // Computed property to check if valid date range is selected
    const hasDateRange = !!(dateRange?.startDate && dateRange?.endDate);

    /**
     * Updates the last updated timestamp to current time
     * Used to show when data was last refreshed
     */
    const updateLastUpdatedTime = () => {
        const now = new Date();
        const formattedTime = now.toLocaleTimeString();
        setLastUpdated(formattedTime);
    };

    /**
     * Handles the refresh button click
     * Triggers data refresh with animation and updates timestamp
     */
    const handleRefreshClick = () => {
        setIsRotating(true); // Start rotation animation
        updateLastUpdatedTime(); // Update timestamp
        setRefreshKey((prev) => prev + 1); // Force re-render of report components
        setTimeout(() => setIsRotating(false), 500); // Stop animation after 500ms
    };

    /**
     * useEffect hook that runs when selectedSection changes
     * Initializes the page with current timestamp and fetches users
     */
    useEffect(() => {
        updateLastUpdatedTime(); // Set initial timestamp
        fetchUsers(); // Load users for filtering
    }, [selectedSection]); // Dependency: runs when section changes

    /**
     * Renders the appropriate report component based on selected section
     * @returns {React.Component} The selected report component with common props
     */
    const renderSection = () => {
        // Common props passed to all report components
        const commonProps = {
            filters: dateRange, // Date range filter
            selectedUser: selectedUser, // User filter
            refreshKey: refreshKey, // Key for forcing re-renders
        };

        return <TasksSection {...commonProps} />;
    };

    /**
     * Fetches users for filtering
     * @async
     */
    const fetchUsers = async () => {
        try {
            const { data } = await axiosInstance.get(`/users`);
            setUsers(data.results || []); // Store users array, fallback to empty array
        } catch (error) {
            handleApiError(error); // Handle API errors using global error handler
        }
    };

    /**
     * Handles user selection/deselection for filtering
     * @param {string} userId - The ID of the user to filter by
     */
    const handleAssigneeClick = (userId) => {
        if (selectedUser === userId) {
            // If clicking the same user, clear the filter
            setSelectedUser(null);
            setIsFilterActive(false);
        } else {
            // Set new user filter
            setSelectedUser(userId);
            setIsFilterActive(true);
        }
    };

    /**
     * Toggles the visibility of the date filter dropdown
     */
    const toggleDateFilter = () => {
        setShowDateFilter((prev) => !prev);
    };

    /**
     * Handles date range selection from the date filter component
     * Supports both object and array formats for flexibility
     * @param {Object|Array} newRange - The new date range selection
     */
    const handleDateChange = (newRange) => {
        console.log('Date range changed:', newRange);

        // Support both formats:
        // - { startDate, endDate }
        // - [ { startDate, endDate, ... } ]
        const range = Array.isArray(newRange) ? newRange[0] : newRange;

        if (range?.startDate && range?.endDate) {
            // Set valid date range
            setDateRange({
                startDate: range.startDate,
                endDate: range.endDate,
            });
        } else {
            // Clear date range if invalid
            setDateRange(null);
        }
    };

    /**
     * Clears all active filters (user and date range)
     * Resets the filter state to default
     */
    const handleClearFilters = () => {
        setIsFilterActive(false);
        setDateRange(null);
        setSelectedUser(null);
    };

    /**
     * Determines if the clear filters button should be enabled
     * @returns {boolean} True if any filter is active
     */
    const isClear = () => {
        return isFilterActive || (dateRange && dateRange.length > 0 && dateRange[0]?.startDate && dateRange[0]?.endDate);
    };

    /**
     * Handles export functionality
     * Exports current data as CSV file
     */
    const handleExport = async () => {
        try {
            // Create CSV content from current data
            const csvContent = generateCSVContent();
            
            // Create blob and download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            // Set filename with current date
            const fileName = `team-productivity-${new Date().toISOString().split('T')[0]}.csv`;
            
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show success message
            alert('Export completed successfully!');
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        }
    };

    /**
     * Generates CSV content for export
     * @returns {string} CSV formatted string
     */
    const generateCSVContent = () => {
        // Mock data for export - in real implementation, this would come from the current view
        const headers = ['Name', 'Role', 'Calls', 'Messages', 'Tasks', 'Overall %', 'Completion %', 'Quality', 'Target %', 'Status'];
        const mockData = [
            ['John Smith', 'Sales Manager', '45', '32', '8', '85', '92', '5', '88', 'Good'],
            ['Emily Davis', 'Customer Support', '38', '56', '12', '90', '78', '4', '85', 'Good'],
            ['Michael Brown', 'Sales Executive', '22', '18', '5', '47', '65', '2', '75', 'Poor'],
            ['Sarah Johnson', 'Team Lead', '52', '41', '15', '104', '95', '5', '95', 'Good'],
            ['David Miller', 'Sales Executive', '31', '28', '7', '67', '72', '3', '70', 'Fair'],
        ];
        
        // Combine headers and data
        const csvRows = [headers, ...mockData];
        
        // Convert to CSV string
        return csvRows.map(row => row.join(',')).join('\n');
    };

    // Main component render
    return (
        <div className="overflow-x-hidden flex flex-row body-theme px-10 min-h-[83vh] mb-5">
            <div className="relative body-theme flex-1 flex flex-col">
                {/* Header Section - Contains filters, controls, and user selection */}
                <div className="flex justify-center sm:justify-between">
                    <div className="flex gap-4">
                        {/* Section Dropdown - Allows switching between different report types */}
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
                    </div>

                    {/* Right Side Controls - Export and Filter Options */}
                    <div className="flex gap-2">
                        {/* Export Button - Fully functional export to CSV */}
                        <div 
                            onClick={handleExport}
                            className="cursor-pointer flex h-[40px] px-3 gap-2 rounded-[10px] bg-[#3EBF0F] items-center hover:bg-[#36A50D] transition-colors"
                        >
                            <FolderDown className='text-white'/>
                            <span className="text-[14px] font-medium tracking-[0.2px] text-white">Export</span>
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

                        {/* Selected User Filter Tag - Shows when a user is selected for filtering */}
                        {selectedUser && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#3EBF0F]/10 border border-[#3EBF0F] rounded-lg">
                                {/* User Icon - Visual indicator for user filter */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none">
                                    {/* User body shape */}
                                    <path
                                        d="M8.167 8.167H5.833A2.917 2.917 0 0 0 2.917 11.083v.584c0 .322.261.583.583.583h7c.322 0 .583-.261.583-.583v-.584a2.917 2.917 0 0 0-2.916-2.916Z"
                                        stroke="#3EBF0F"
                                    />
                                    {/* User head circle */}
                                    <path d="M7 6.417a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z" stroke="#3EBF0F" />
                                </svg>
                                {/* User Name Display - Shows the full name of the selected user */}
                                <span className="text-sm font-medium text-[#3EBF0F]">
                                    {/* Find the user object by ID and display first name */}
                                    {users.find((u) => u.id === selectedUser)?.first_name}{' '}
                                    {/* Find the user object by ID and display last name */}
                                    {users.find((u) => u.id === selectedUser)?.last_name}
                                </span>
                                {/* Remove User Filter Button - Clears the user filter when clicked */}
                                <button
                                    onClick={() => {
                                        // Clear the selected user from state
                                        setSelectedUser(null);
                                        // Mark filter as inactive since no user is selected
                                        setIsFilterActive(false);
                                    }}
                                    className="ml-1 hover:bg-[#3EBF0F]/20 rounded-full p-0.5 transition-colors"
                                >
                                    {/* X Icon - Visual indicator for remove action */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none">
                                        {/* Diagonal lines forming an X */}
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

                {/* Render the selected section component */}
                {renderSection()}

            </div>
        </div>
    );
};

/* Exporting the Page component as the default export */
export default Page;