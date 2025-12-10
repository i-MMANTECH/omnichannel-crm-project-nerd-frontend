import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Loader2 } from 'lucide-react';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';
import NoDataFound from "../../NoDataFound";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TaskCompletionChart = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  useEffect(() => {
    fetchCompletionRates();
  }, []);

  const fetchCompletionRates = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/analytics/tasks/completion-rate/');

      setData(response?.data?.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataPoint = data.completion_rates[context.dataIndex];
            return [
              `Completion Rate: ${context.raw.toFixed(1)}%`,
              `Tasks: ${dataPoint.completed_tasks}/${dataPoint.total_tasks}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[320px] body-theme rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gray-400"></div>
        </div>
      </div>
    );
  }

  if (!data || !data.completion_rates || data.completion_rates.length === 0) {
    return (
      <div className="w-full h-[320px] body-theme rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-center h-full">
          <NoDataFound message="No completion rate data available" />
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.completion_rates.map(item => item.period_label),
    datasets: [{
      data: data.completion_rates.map(item => item.completion_rate),
      backgroundColor: '#3EBF0F',
      borderRadius: 4,
    }]
  };

  return (
    <div className="w-full body-theme rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium ">Task Completion Rate</h3>
          <span className="text-sm ">
            Overall: {data.overall_statistics.overall_completion_rate.toFixed(1)}%
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="h-[300px]">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default TaskCompletionChart;