import React, { useEffect, useState } from "react";
import NoDataFound from "../NoDataFound";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import StatCard from "./StatCard";
import { 
  UsersIcon, 
  PhoneCallIcon, 
  ClockIcon,
  UserCheckIcon,
  UserXIcon,
  Timer
} from "lucide-react";

export default function CallCenterDashboard({ filters, selectedAgent, refreshKey }) {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const [dashboardData, setDashboardData] = useState(null);
  const [agentList, setAgentList] = useState([]);
  const [customerQueue, setCustomerQueue] = useState([]);
  const [loading, setLoading] = useState(true);

//   const fetchData = async () => {
//     setLoading(true);

//     try {
//       let params = {};

//       if (filters && filters.startDate && filters.endDate) {
//         const formattedStart = filters.startDate.toISOString().split("T")[0];
//         const formattedEnd = filters.endDate.toISOString().split("T")[0];
        
//         params = {
//           start_date: formattedStart,
//           end_date: formattedEnd,
//         };
//       }

//       if (selectedAgent) {
//         params.agent_id = selectedAgent;
//       }

//       // Fetch call center analytics data
//       const response = await axiosInstance.get("/analytics/call-center/", { params });
//       const data = response.data.data;
//       setDashboardData(data);

//       // Set agent list
//       if (data?.agents) {
//         setAgentList(data.agents);
//       }

//       // Set customer queue
//       if (data?.queue) {
//         setCustomerQueue(data.queue);
//       }

//     } catch (error) {
//       handleApiError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

const fetchData = async () => {
    setLoading(true);
    try {
      // Sample mock data
      const sampleData = {
        last_updated: "2025-06-10 12:30 PM",
        agents: {
          total: 5,
          available: 3,
          list: [
            { name: "Alice Johnson", status: "Available", avatar: "" },
            { name: "Bob Smith", status: "On Call", avatar: "" },
            { name: "Charlie Rose", status: "Away", avatar: "" },
            { name: "Diana Prince", status: "Available", avatar: "" },
            { name: "Ethan Hunt", status: "On Call", avatar: "" },
          ],
        },
        queue: {
          total: 4,
          waiting: 2,
          average_wait: "2:15",
          longest_wait: "4:40",
          list: [
            { name: "John Doe", wait_time: "2:00", reason: "Billing issue", priority: "high" },
            { name: "Jane Smith", wait_time: "1:45", reason: "Technical support", priority: "medium" },
          ],
        },
        metrics: {
          average_wait_time: "1 min",
          wait_time_status: "Normal",
        },
      };
  
      setDashboardData({
        ...sampleData,
        agents: {
          ...sampleData.agents,
          ...sampleData.agents,
          list: sampleData.agents.list,
        },
        queue: {
          ...sampleData.queue,
          list: sampleData.queue.list,
        },
      });
  
      setAgentList(sampleData.agents.list);
      setCustomerQueue(sampleData.queue.list);
  
    } catch (error) {
      console.error("Mock data fetch failed", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, [filters, selectedAgent, refreshKey]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'text-green-500 bg-green-100';
      case 'on call':
        return 'text-orange-500 bg-orange-100';
      case 'away':
        return 'text-red-500 bg-red-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const handleRefreshClick = () => {
    // setIsRotating(true);
    // updateLastUpdatedTime();
    // setRefreshKey((prev) => prev + 1);
    // setTimeout(() => setIsRotating(false), 500);
  };

  const getQueueItemColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-orange-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <NoDataFound message="No call center data available." />
      </div>
    );
  }

  const statsData = [
    {
      title: "Available Agents",
      value: `${dashboardData?.agents?.available || 0}/${dashboardData?.agents?.total || 0}`,
      subtitle: `${Math.round((dashboardData?.agents?.available / dashboardData?.agents?.total) * 100) || 0}%`,
      icon: <UserCheckIcon className="text-white" size={20} />,
      bgColor: "#3B82F6",
      borderColor: "#DFE1E6",
    },
    {
      title: "Customers in Queue",
      value: dashboardData?.queue?.total || 0,
      subtitle: `${dashboardData?.queue?.waiting || 0} waiting`,
      icon: <PhoneCallIcon className="text-white" size={20} />,
      bgColor: "#F59E0B",
      borderColor: "#DFE1E6",
    },
    {
      title: "Average Wait Time",
      value: dashboardData?.metrics?.average_wait_time || "0 mins",
      subtitle: dashboardData?.metrics?.wait_time_status || "Normal",
      icon: <ClockIcon className="text-white" size={20} />,
      bgColor: "#8B5CF6",
      borderColor: "#DFE1E6",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Last Updated Info */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="flex h-[40px] w-fit p-[8px_12px] justify-center items-center gap-2 rounded-[10px] border border-[#DFE1E6] body-theme shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
            <path d="M5.333 2H4A2 2 0 0 0 2 4v2M5.333 2v-.667M5.333 2h5.334M5.333 2v.667M10.667 2H12A2 2 0 0 1 14 4v2M10.667 2v-.667M10.667 2v.667M2 6v6.667A2 2 0 0 0 4 14.667h8A2 2 0 0 0 14 12.667V6H2Z" stroke="#808897" strokeWidth="1.333" strokeLinecap="round"/>
            </svg>
            <span className="text-[14px] font-medium leading-[150%] tracking-[0.2px]">
                Last updated: {'Never'}
            </span>
            <svg
            className={`cursor-pointer`}
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Agent Status and Customer Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Status */}
        <div className="bg-white border border-[#DFE1E6] rounded-2xl shadow-sm">
          <div className="flex items-center justify-between px-6 pb-3 pt-5 border-b border-[#DFE1E6] mb-4">
            <h3 className="text-lg font-semibold">Agent Status</h3>
            <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
              <option>All</option>
              <option>Available</option>
              <option>On Call</option>
              <option>Away</option>
            </select>
          </div>
          
          <div >
            {/* Headers */}
            <div className="flex justify-between items-center gap-4 mb-4 text-sm font-medium text-gray-600 bg-gray-100 rounded p-3 px-6">
                <div>Agent</div>
                <div className="text-right">Status</div>
            </div>


            {/* Agent List */}
            <div className="space-y-4  pb-6">
              {agentList.length === 0 ? (
                <NoDataFound message="No agents found" />
              ) : (
                agentList.map((agent, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 items-center pt-2 pb-4 border-b px-6">
                        {/* Agent Info */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            <img 
                                src={agent.avatar || `https://ui-avatars.com/api/?name=${agent.name}&background=random`}
                                alt={agent.name}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            </div>
                            <span className="font-medium">{agent.name}</span>
                        </div>

                        {/* Agent Status aligned right */}
                        <div className="flex justify-end">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                            {agent.status}
                            </span>
                        </div>
                    </div>

                ))
              )}
            </div>
          </div>
        </div>

        {/* Customer Queue */}
        <div className="bg-white border border-[#DFE1E6] rounded-2xl shadow-sm">
          <div className="flex items-center justify-between px-6 pb-3 pt-5 border-b border-[#DFE1E6]">
            <h3 className="text-lg font-semibold">Customer Queue</h3>
            <span className="text-blue-500 font-medium bg-blue-100 py-1 px-2 rounded-lg">
              {dashboardData?.queue?.waiting || 0} waiting
            </span>
          </div>
          
          <div className="p-5">
            <div className="space-y-2">
              {customerQueue.length === 0 ? (
                <NoDataFound message="No customers in queue" />
              ) : (
                customerQueue.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border rounded p-4 rounded-lg border-gray-300 last:border-b-0">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{customer.name}</h4>
                        <span className="flex items-center gap-1">
                            <Timer size={12} />
                            {customer.wait_time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{customer.reason}</p>
                      
                      {/* Priority Bar */}
                      <div className="mt-4 flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full ${getQueueItemColor(customer.priority)}`}
                            style={{ width: customer.priority === 'high' ? '100%' : customer.priority === 'medium' ? '60%' : '30%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Queue Statistics */}
            {dashboardData?.queue && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Longest wait: {dashboardData.queue.longest_wait || '0:00'}</span>
                  <span>Average: {dashboardData.queue.average_wait || '0:00'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}