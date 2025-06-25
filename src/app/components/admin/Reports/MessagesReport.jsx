'use client';

import { useEffect, useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import Dropdown from './Dropdown';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';
import StatCard from './StatCard';
import { MessageSquareIcon, PhoneCallIcon, UsersIcon } from 'lucide-react';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MessagesReport = ({filters, selectedUser, refreshKey}) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [loading, setLoading] = useState(true);
  const [messagesReportData, setMessagesReportData] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All Channels');
  const [analysisReport, setAnalysisReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [showSummary, setShowSummary] = useState(true);


  const handleGenerateReport = async () => {
    try {
      setLoadingReport(true);
  
      const now = new Date();
      const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
  
      const params = {
        start_date: lastMonth.toISOString().split("T")[0],
        end_date: now.toISOString().split("T")[0],
        send_email: true,
      };
  
      const res = await axiosInstance.post(
        `/analytics/conversations/report/?start_date=${params.start_date}&end_date=${params.end_date}&send_email=true`
      );
  
      setAnalysisReport(res.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoadingReport(false);
    }
  };
  

  const fetchData = async () => {
    setLoading(true);
    try {
      let params = {};

      if (filters?.startDate && filters?.endDate) {
        params.start_date = filters.startDate.toISOString().split("T")[0];
        params.end_date = filters.endDate.toISOString().split("T")[0];
      }

      if (selectedUser) {
        params.user_id = selectedUser;
      }

      const res = await axiosInstance.get('/analytics/messages/', { params });
      setMessagesReportData(res.data.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, selectedUser, refreshKey]);

  // Create dropdown options dynamically based on available channels in the data
  const dropdownOptions = useMemo(() => {
    if (!messagesReportData || !messagesReportData.messages_by_period.length) {
      return ['All Channels'];
    }

    // Get all channel names from the first period (they should be consistent)
    const firstPeriod = messagesReportData.messages_by_period[0];
    const channelNames = Object.keys(firstPeriod).filter(key => 
      key !== 'period' && key !== 'period_label' && key !== 'total'
    );

    return ['All Channels', ...channelNames];
  }, [messagesReportData]);

  const monthlyChartData = useMemo(() => {
    if (!messagesReportData) return null;
  
    const chartData = messagesReportData.messages_by_period.map(item => {
      if (selectedFilter === 'All Channels') {
        return item.total;
      } else {
        return item[selectedFilter] || 0;
      }
    });

    return {
      labels: messagesReportData.messages_by_period.map(item => item.period_label),
      datasets: [
        {
          label: selectedFilter === 'All Channels' ? 'Messages' : `${selectedFilter} Messages`,
          data: chartData,
          backgroundColor: (ctx) => {
            const index = ctx.dataIndex;
            return index === (messagesReportData.messages_by_period.length - 1)
              ? '#3EBF0F'
              : '#EEEFF2';
          },
          borderRadius: 8,
        }
      ]
    };
  }, [messagesReportData, selectedFilter]);

  if (loading) return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-gray-400"></div>
    </div>
  );

  const monthlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw} messages`,
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(...messagesReportData.messages_by_period.map(item =>
          selectedFilter === 'All Channels'
            ? item.total
            : item[selectedFilter] || 0
        )) + 100,
        ticks: {
          stepSize: 100
        }
      }
    }
  };

  const channelChartData = {
    labels: messagesReportData.channel_usage.map(c => c.channel_name),
    datasets: [
      {
        label: 'Usage %',
        data: messagesReportData.channel_usage.map(c => c.percentage),
        backgroundColor: [
          '#936DFF', '#F36F4A', '#3EBF0F', '#808897', '#40C4AA', '#1285FE', '#EEEFF2'
        ],
        borderRadius: 8,
      }
    ]
  };

  const channelChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw}%`,
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    }
  };

  const statsData = [
    {
      title: 'Total Messages',
      value: messagesReportData.total_messages,
      icon: <UsersIcon className="text-white" size={20} />,
      bgColor: '#1285FE',
    },
    {
      title: 'Total Messages Received',
      value: messagesReportData.total_received,
      icon: <PhoneCallIcon className="text-white" size={20} />,
      bgColor: '#3EBF0F',
    },
    {
      title: 'Total Messages Sent',
      value: messagesReportData.total_sent,
      icon: <MessageSquareIcon className="text-white" size={20} />,
      bgColor: '#FF7043',
    },
  ];

  return (
    <>
       <div className="gap-5 mt-5 flex flex-wrap border border-[#DFE1E6] body-theme rounded-t-[16px] p-5">
          {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
      </div>
        {/* AI Summary Generator */}
        <div className="body-theme w-full rounded-b-lg border border-[#DFE1E6] shadow-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-medium">NativeAi Summary</h3>
              <button
                onClick={handleGenerateReport}
                disabled={loadingReport}
                className="px-4 py-2 rounded bg-[#3EBF0F] text-white text-sm font-medium hover:bg-green-600 disabled:opacity-50"
              >
                {loadingReport ? "Generating..." : "Generate Summary"}
              </button>
            </div>
            {analysisReport && showSummary && (
              <div className="p-4 mt-4 border rounded-md bg-gray-50 dark:bg-[#111111] whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200 relative">
                <button
                  onClick={() => setShowSummary(false)}
                  className="absolute top-2 right-2 text-xs text-black hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                >
                  ✕ Hide
                </button>
                {analysisReport}
              </div>
            )}
            {analysisReport && !showSummary && (
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => setShowSummary(true)}
                  className="text-xs  hover:text-gray-700 dark:text-gray-300 dark:hover:text-white underline"
                >
                  Show Summary Again
                </button>
              </div>
            )}
        </div>
        <div className="mt-6 space-y-6">
          <div className="body-theme w-full rounded-lg border border-[#DFE1E6] shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium">Monthly Messages</h3>
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-[#0D0D12] text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >

                {dropdownOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <div className="h-[300px] w-[800px]">
              {monthlyChartData && (
                <Bar data={monthlyChartData} options={monthlyChartOptions} />
              )}
            </div>
          </div>
        </div>

        <div className="body-theme w-full rounded-lg border border-gray-200 shadow-lg p-4">
          <h3 className="text-base font-medium mb-4">Most Used Channels</h3>
          <div className="flex justify-center">
            <div className="h-[300px] w-[800px]">
              <Bar data={channelChartData} options={channelChartOptions} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessagesReport;