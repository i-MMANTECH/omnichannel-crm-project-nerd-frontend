'use client';

import { useEffect } from 'react';
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
import ReportStats from './ReportStats';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MessagesReport = () => {
  const router = useRouter();

  useEffect(() => {
    // router.push('/nativecrm/reports/messages-report');
  }, []);

  const monthlyChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: 'Messages',
        data: [220, 310, 280, 260, 350, 230, 330, 360, 380, 250, 240, 300],
        backgroundColor: (ctx) => (ctx.dataIndex === 4 ? '#3EBF0F' : '#EEEFF2'),
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
        max: 500,
        ticks: {
          stepSize: 100
        }
      }
    }
  };

  const channelChartData = {
    labels: ['Facebook', 'E-mail', 'Whatsapp', 'Livechat', 'SMS', 'Telegram', 'Others'],
    datasets: [
      {
        label: 'Usage %',
        data: [47.5, 89.17, 55.02, 55.02, 55.02, 47.5, 47.5],
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

  return (
    <>
      <ReportStats/>
      <div className="mt-6 space-y-6">
        <div className="body-theme w-full rounded-lg border border-[#DFE1E6] shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium">Channels</h3>
            <Dropdown
              options={['Instagram', 'Facebook', 'Whatsapp']}
              selected="Instagram"
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
