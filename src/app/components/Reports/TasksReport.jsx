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
import ReportStats from './ReportStats';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TasksReport = () => {
  const router = useRouter();

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
      <ReportStats/>
    </>

  );
};

export default TasksReport;
