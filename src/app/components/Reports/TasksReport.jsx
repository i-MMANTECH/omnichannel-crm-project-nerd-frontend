import { useEffect, useState, useMemo } from 'react';
import Dropdown from './Dropdown';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';
import StatCard from './StatCard';
import { MessageSquareIcon, PhoneCallIcon, UsersIcon } from 'lucide-react';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TasksReport = ({filters, selectedUser, refreshKey}) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [loading, setLoading] = useState(true);
  const [tasksReportData, setTasksReportData] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All Status');

  const fetchData = async () => {
    setLoading(true);
    try {
      let params = {};

      if (filters && filters.startDate && filters.endDate) {
        params.start_date = filters.startDate.toISOString().split("T")[0];
        params.end_date = filters.endDate.toISOString().split("T")[0];
      }

      if (selectedUser) {
        params.user_id = selectedUser;
      }

      const res = await axiosInstance.get('/analytics/tasks/', { params });
      setTasksReportData(res.data.data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, selectedUser, refreshKey]);

  // Create dropdown options dynamically based on available statuses in the data
  const statusOptions = useMemo(() => {
    if (!tasksReportData || !tasksReportData.tasks_by_period?.length) {
      return ['All Status'];
    }

    // Get all status names from the first period (they should be consistent)
    const firstPeriod = tasksReportData.tasks_by_period[0];
    const statusNames = Object.keys(firstPeriod).filter(key => 
      key !== 'period' && key !== 'period_label' && key !== 'total'
    );

    return ['All Status', ...statusNames];
  }, [tasksReportData]);

  const monthlyChartData = useMemo(() => {
    if (!tasksReportData?.tasks_by_period) return null;

    const chartData = tasksReportData.tasks_by_period.map(item => {
      if (statusFilter === 'All Status') {
        return item.total;
      } else {
        return item[statusFilter] || 0;
      }
    });

    return {
      labels: tasksReportData.tasks_by_period.map(item => item.period_label),
      datasets: [
        {
          label: statusFilter === 'All Status' ? 'Total Tasks' : `${statusFilter} Tasks`,
          data: chartData,
          backgroundColor: (ctx) => {
            const index = ctx.dataIndex;
            return index === (tasksReportData.tasks_by_period.length - 1)
              ? '#3EBF0F'
              : '#EEEFF2';
          },
          borderRadius: 8,
        }
      ]
    };
  }, [tasksReportData, statusFilter]);

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
          label: (context) => `${context.raw} tasks`,
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(...tasksReportData.tasks_by_period.map(item =>
          statusFilter === 'All Status'
            ? item.total
            : item[statusFilter] || 0
        )) + 100,
        ticks: {
          stepSize: 100
        }
      }
    }
  };

  const statsData = [
    {
      title: 'Tasks Completed',
      value: tasksReportData.completion_rate.completed,
      icon: <UsersIcon className="text-white" size={20} />,
      borderColor: '#DFE1E6',
      bgColor: '#1285FE',
    },
    {
      title: 'Tasks Total',
      value: tasksReportData.completion_rate.total,
      icon: <PhoneCallIcon className="text-white" size={20} />,
      borderColor: '#DFE1E6',
      bgColor: '#3EBF0F',
    },
    {
      title: 'Completion Rate',
      value: `${tasksReportData.completion_rate.rate}%`,
      icon: <MessageSquareIcon className="text-white" size={20} />,
      borderColor: '#DFE1E6',
      bgColor: '#FF7043',
    },
  ];

  return (
    <>
      <div className="mt-6">
        <div className="body-theme w-full rounded-lg border border-[#DFE1E6] shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium">Tasks</h3>
            <div className="flex gap-4">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-[#0D0D12] text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="h-[300px] w-[800px]">
              {monthlyChartData && (
                <Bar data={monthlyChartData} options={monthlyChartOptions} />
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="gap-5 mt-5 flex flex-wrap border border-[#DFE1E6] body-theme rounded-[16px] p-5">
        {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
        ))}
      </div>
    </>

  );
};

export default TasksReport;