'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

const MessagesReport = ({filters}) => {
  const router = useRouter();
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [loading, setLoading] = useState(true);
  const [messagesReportData, setMessagesReportData] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(filters || 'All Channels');

  const fetchData = async () => {
    setLoading(true);
    try {
      let params = {};

      if (filters?.startDate && filters?.endDate) {
        params.start_date = filters.startDate.toISOString().split("T")[0];
        params.end_date = filters.endDate.toISOString().split("T")[0];
      }

      if (selectedFilter && selectedFilter !== 'All Channels') {
        params.channel = selectedFilter;
      }

      const res = await axiosInstance.get('/analytics/messages/', { params });
      setMessagesReportData(res.data.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const [customerStats, setCustomerStats] = useState({
  total_customers: 0,
  new_customers: 0,
  drop_off_rate: 0
});


  useEffect(() => {
    fetchData();
  }, [filters, selectedFilter]);


  if (loading) return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-gray-400"></div>
    </div>
  );

  const monthlyChartData = {
    labels: messagesReportData.messages_by_period.map(item => item.period_label),
    datasets: [
      {
        label: 'Messages',
        data: messagesReportData.messages_by_period.map(item => item.total),
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
        max: Math.max(...messagesReportData.messages_by_period.map(item => item.total)) + 100,
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
      borderColor: '#DFE1E6',
      bgColor: '#1285FE',
    },
    {
      title: 'Total Messages Received',
      value: messagesReportData.total_received,
      icon: <PhoneCallIcon className="text-white" size={20} />,
      borderColor: '#DFE1E6',
      bgColor: '#3EBF0F',
    },
    {
      title: 'Total Messages Sent',
      value: messagesReportData.total_sent,
      icon: <MessageSquareIcon className="text-white" size={20} />,
      borderColor: '#DFE1E6',
      bgColor: '#FF7043',
    },
  ];

  return (
    <>
       <div className="gap-5 mt-5 flex flex-wrap border border-[#DFE1E6] body-theme rounded-[16px] p-5">
          {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
      <div className="mt-6 space-y-6">
        <div className="body-theme w-full rounded-lg border border-[#DFE1E6] shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium">Monthly Messages</h3>
            <Dropdown
              options={['All Channels', 'Email', 'WhatsApp', 'Facebook']}
              selected="All Channels"
              width="w-40"
            />
          </div>

          <div className="flex justify-center">
            <div className="h-[300px] w-[800px]">
              <Bar data={monthlyChartData} options={monthlyChartOptions} />
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
