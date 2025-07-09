import React, { useEffect, useState } from "react";
import NoDataFound from "../../NoDataFound";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import StatCard from "./StatCard";
import { 
  UsersIcon, 
  PhoneCallIcon, 
  ClockIcon,
  UserCheckIcon,
  UserXIcon,
  Timer,
  PhoneIcon,
  PhoneIncoming,
  PhoneOutgoing,
  TimerIcon,
  TimerOffIcon,
  TimerReset
} from "lucide-react";

export default function RealTimeReports({ filters, selectedAgent, refreshKey }) {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const [dashboardData, setDashboardData] = useState(null);
  const [agentList, setAgentList] = useState([]);
  const [customerQueue, setCustomerQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRotating, setIsRotating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await axiosInstance.get('/call-center/overview');
      
      if (response.data.success) {
        const apiData = response.data.data;
        
        setDashboardData(apiData);
        setAgentList(apiData.agents_list || []);
        
        // Update last updated time
        const now = new Date();
        setLastUpdated(now.toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }));
        
        // Keep sample customer queue data for now
        setCustomerQueue([
          { name: "John Doe", wait_time: "2:00", reason: "Billing issue", priority: "high" },
          { name: "Jane Smith", wait_time: "1:45", reason: "Technical support", priority: "medium" },
        ]);
      }
    } catch (error) {
      console.error("API fetch failed", error);
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, selectedAgent, refreshKey]);

  const getStatusColor = (status) => {
    // Map API status codes to colors
    switch (status) {
      case '1': // Available/Logged In
        return 'text-green-500 bg-green-100';
      case '2': // On Call
        return 'text-orange-500 bg-orange-100';
      case '3': // Break
        return 'text-yellow-500 bg-yellow-100';
      case '0': // Offline/Away
      default:
        return 'text-red-500 bg-red-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case '1':
        return 'Available';
      case '2':
        return 'On Call';
      case '3':
        return 'On Break';
      case '0':
      default:
        return 'Offline';
    }
  };

  const handleRefreshClick = async () => {
    setIsRotating(true);
    await fetchData();
    setIsRotating(false);
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

  const calculateAnswerRate = (answered, total) => {
    if (total === 0) return 0;
    return Math.round((answered / total) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#3EBF0F]"></div>
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
      title: "Total Calls",
      value: dashboardData.totalCalls || 0,
      subtitle: "All calls today",
      icon: <PhoneIcon className="text-white" size={20} />,
      bgColor: "#666D80",
      borderColor: "#DFE1E6",
    },
    {
      title: "Answered Calls",
      value: dashboardData.answeredCalls || 0,
      subtitle: `${calculateAnswerRate(dashboardData.answeredCalls, dashboardData.totalCalls)}% answer rate`,
      icon: <PhoneCallIcon className="text-white" size={20} />,
      bgColor: "#3EBF0F",
      borderColor: "#DFE1E6",
    },
    {
      title: "Inbound Calls",
      value: dashboardData.inboundCalls || 0,
      subtitle: `${dashboardData.agents_live_data?.callAgentWaiting?.inboundCount || 0} waiting`,
      icon: <PhoneIncoming className="text-white" size={20} />,
      bgColor: "#3B82F6",
      borderColor: "#DFE1E6",
    },
    {
      title: "Outbound Calls",
      value: dashboardData.outboundCalls || 0,
      subtitle: `${dashboardData.agents_live_data?.callAgentWaiting?.outboundCount || 0} waiting`,
      icon: <PhoneOutgoing className="text-white" size={20} />,
      bgColor: "#9333EA",
      borderColor: "#DFE1E6",
    },
    {
      title: "Average Call Duration",
      value: `${Math.round(dashboardData.acd || 0)}s`,
      subtitle: "Per call",
      icon: <TimerIcon className="text-white" size={20} />,
      bgColor: "#F59E0B",
      borderColor: "#DFE1E6",
    },
    {
      title: "Active Calls",
      value: dashboardData.agents_live_data?.activeCalls || 0,
      subtitle: `${dashboardData.agents_live_data?.agentOnCall || 0} agents on call`,
      icon: <PhoneCallIcon className="text-white" size={20} />,
      bgColor: "#EF4444",
      borderColor: "#DFE1E6",
    },
    {
      title: "Agents Logged In",
      value: dashboardData.agents_live_data?.activeLogin || 0,
      subtitle: "Currently logged in",
      icon: <UsersIcon className="text-white" size={20} />,
      bgColor: "#0D9488",
      borderColor: "#DFE1E6",
    }
    
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Last Updated Info */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="flex h-[40px] w-fit p-[8px_12px] justify-center items-center gap-2 rounded-[10px] border border-[#DFE1E6] body-theme shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5.33333 2.00016H4C2.89543 2.00016 2 2.89559 2 4.00016V6.00016M5.33333 2.00016V1.3335M5.33333 2.00016H10.6667M5.33333 2.00016V2.66683M10.6667 2.00016H12C13.1046 2.00016 14 2.89559 14 4.00016V6.00016M10.6667 2.00016V1.3335M10.6667 2.00016V2.66683M2 6.00016V12.6668C2 13.7714 2.89543 14.6668 4 14.6668H12C13.1046 14.6668 14 13.7714 14 12.6668V6.00016M2 6.00016H14" stroke="#808897" strokeWidth="1.33333" strokeLinecap="round"/>
          </svg>
          <span className="text-center font-[500] text-[14px] font-[Encode Sans] leading-[150%] tracking-[0.2px]">
            Last updated: {lastUpdated || 'Never'}
          </span>
          <svg
            className={`cursor-pointer ${isRotating ? 'animate-spin' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            onClick={handleRefreshClick}
          >
            <path d="M7.99984 2.66683C5.05432 2.66683 2.6665 5.05464 2.6665 8.00016C2.6665 9.97425 3.73903 11.6978 5.33317 12.62M7.99984 2.66683L6.6665 1.3335M7.99984 2.66683L6.99984 4.3335M7.99984 13.3335C10.9454 13.3335 13.3332 10.9457 13.3332 8.00016C13.3332 6.02608 12.2606 4.30249 10.6665 3.38033M7.99984 13.3335L9.33317 14.6668M7.99984 13.3335L8.99984 11.6668" stroke="#3EBF0F" strokeLinecap="round" strokeLinejoin="round"/>
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
      <div className="grid grid-cols-1 gap-6">
        {/* Agent Status */}
        <div className="bg-white border border-[#DFE1E6] rounded-2xl shadow-sm">
          <div className="flex items-center justify-between px-6 pb-3 pt-5 border-b border-[#DFE1E6] mb-4">
            <h3 className="text-lg font-semibold">Agent Status</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {dashboardData.agents_live_data?.activeLogin || 0} active
              </span>
              <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                <option>All</option>
                <option>Available</option>
                <option>On Call</option>
                <option>On Break</option>
                <option>Offline</option>
              </select>
            </div>
          </div>
          
          <div>
            {/* Headers */}
            <div className="flex justify-between items-center gap-4 mb-4 text-sm font-medium text-gray-600 bg-gray-100 rounded p-3 px-6">
              <div>Agent</div>
              <div>Campaign</div>
              <div className="text-right">Status</div>
            </div>

            {/* Agent List */}
            <div className="space-y-4 pb-6">
              {agentList.length === 0 ? (
                <div className="px-6">
                  <NoDataFound message="No agents found" />
                </div>
              ) : (
                agentList.map((agent, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 items-center pt-2 pb-4 border-b px-6">
                    {/* Agent Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${agent.agent_name}&background=random`}
                          alt={agent.agent_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-medium block">{agent.agent_name}</span>
                        <span className="text-xs text-gray-500">Ext: {agent.extension_name}</span>
                      </div>
                    </div>

                    {/* Campaign Info */}
                    <div className="text-sm">
                      <div className="font-medium">{agent.campaign_name}</div>
                      <div className="text-xs text-gray-500">
                        Logged in: {agent.from_last_logged_in || '0:00'}
                      </div>
                    </div>

                    {/* Agent Status */}
                    <div className="flex justify-end">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                        {getStatusText(agent.status)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Customer Queue */}
        <div className="hidden bg-white border border-[#DFE1E6] rounded-2xl shadow-sm">
          <div className="flex items-center justify-between px-6 pb-3 pt-5 border-b border-[#DFE1E6]">
            <h3 className="text-lg font-semibold">Customer Queue</h3>
            <span className="text-blue-500 font-medium bg-blue-100 py-1 px-2 rounded-lg">
              {customerQueue.length} waiting
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
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total waiting: {dashboardData.agents_live_data?.callAgentWaiting?.inboundCount + dashboardData.agents_live_data?.callAgentWaiting?.outboundCount || 0}</span>
                <span>Active calls: {dashboardData.agents_live_data?.activeCalls || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Performance Table */}
      <div className="bg-white w-full border border-[#DFE1E6] rounded-2xl shadow-sm mt-10">
        <div className="flex items-center justify-between px-6 pb-3 pt-5 border-b border-[#DFE1E6] mb-4">
          <h3 className="text-lg font-semibold">Agent Performance</h3>
        </div>
        {agentList.length === 0 ? (
          <div className="py-10 flex justify-center items-center">
            <NoDataFound message="No agent performance data available" />
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full table-auto body-theme">
              <thead className="bg-gray-100">
                <tr>
                  <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-300">Agent</th>
                  <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-300">Status</th>
                  <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-300">Total Calls</th>
                  <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-300">Campaign</th>
                  <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-300">Login Time</th>
                  <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-300">Extension</th>
                  <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-300">Break Code</th>
                </tr>
              </thead>
              <tbody>
                {agentList.map((agent, index) => (
                  <tr key={index} className="hover:bg-gray-100 cursor-pointer">
                    <td className="py-3 px-4 border-b flex items-center space-x-3">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${agent.agent_name}&background=random`}
                        alt={agent.agent_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{agent.agent_name}</span>
                    </td>
                    <td className="py-3 px-4 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                        {getStatusText(agent.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b">{agent.total_calls || 0}</td>
                    <td className="py-3 px-4 border-b">
                      <div>
                        <div className="font-medium">{agent.campaign_name}</div>
                        <div className="text-xs text-gray-500">Type: {agent.campaign_type === '1' ? 'Inbound' : 'Outbound'}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 border-b">
                      <div>
                        <div className="text-sm">{agent.from_last_logged_in || '0:00'}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(agent.agent_logged_in_time).toLocaleTimeString()}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 border-b">{agent.extension_name}</td>
                    <td className="py-3 px-4 border-b">
                      {agent.breakcode ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                          {agent.breakcode}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}