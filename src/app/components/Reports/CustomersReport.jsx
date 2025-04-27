import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Dropdown from './Dropdown';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import ReportStats from './ReportStats';
import NoDataFound from '../NoDataFound';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


const CustomersReport = () => {
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

   const [agentsData, setAgentsData] = useState([
              {
                data: [20, 18],
                backgroundColor: ["#3EBF0F", "#FFBD4C"],
                borderWidth: 1,
              }
            ]);
          
            const options = {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
            };

  return (
    <>
      <ReportStats/>
      <div className="mt-6">
        <div className="body-theme w-full rounded-lg border border-[#DFE1E6] shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium">Customer Growth</h3>
          </div>

          <div className="flex justify-center">
            <div className="h-[300px] w-[800px]">
              <Bar data={monthlyChartData} options={monthlyChartOptions} />
            </div>
          </div>
          <div>
          </div>
        </div>
      </div>

      <div className="body-theme w-full rounded-lg border border-[#DFE1E6] shadow-lg p-4 mt-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium">Customer Category</h3>
        <Dropdown
          options={[]}
          selected="Select Region"
          width="w-30"
        />
      </div>

      <div className="flex justify-center items-center w-full pt-4 px-3">
        {agentsData.length === 0 ? (
          <NoDataFound message="No records found" />
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px]">
              <Doughnut
                data={{ datasets: agentsData }}
                options={options}
              />
            </div>
            <div>
              <p className="text-sm mb-1 flex items-center">
                <span className="w-2 h-2 inline-block rounded-full bg-[#3EBF0F] mr-2"></span>
                Active Users: 0
              </p>
              <p className="text-sm mb-1 flex items-center">
                <span className="w-2 h-2 inline-block rounded-full bg-[#FFBD4C] mr-2"></span>
                Inactive Users: 0
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default CustomersReport;
