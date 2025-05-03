import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
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

const TasksReport = () => {
  const router = useRouter();
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [loading, setLoading] = useState(true);
  const [tasksReportData, setTasksReportData] = useState(null);

  useEffect(() => {
    axiosInstance.get('/analytics/tasks/')
      .then(res => {
        setTasksReportData(res.data.data);
      })
      .catch(err => {
        handleApiError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;


  const monthlyChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: 'Tasks',
        data: [220, 310, 280, 260, 350, 230, 330, 360, 380, 250, 240, 300],
        backgroundColor: (ctx) => {
          return ctx.dataIndex === 4 ? '#3EBF0F' : '#EEEFF2';
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
          label: (context) => `${context.raw} tasks`,
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 500,
        ticks: {
          stepSize: 100
        }
      }
    }
  };

  const statsData = [
    {
      title: 'Tasks Completed',
      value: 200,
      icon: <UsersIcon className="text-white" size={20} />,
      borderColor: '#DFE1E6',
      bgColor: '#1285FE',
    },
    {
      title: 'Tasks Overdue',
      value: 76,
      icon: <PhoneCallIcon className="text-white" size={20} />,
      borderColor: '#DFE1E6',
      bgColor: '#3EBF0F',
    },
    {
      title: 'Completion Rate',
      value: "42%",
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
              <Dropdown
                options={['Completed', 'Pending', 'In Progress']}
                selected="Select Status"
                width="w-30"
              />
              <Dropdown
                options={['John Doe', 'Jane Smith', 'Michael Brown']}
                selected="Select User"
                width="w-30"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="h-[300px] w-[800px]">
              <Bar data={monthlyChartData} options={monthlyChartOptions} />
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
