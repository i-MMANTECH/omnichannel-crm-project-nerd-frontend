import React, {useState} from 'react';
import { Doughnut } from "react-chartjs-2";
import NoDataFound from '../NoDataFound';
import './style.css';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/context/PermissionsContext';

export default function ChatData(){
    const router = useRouter();
    const { checkPermission } = usePermissions();

    const viewUser = checkPermission('view_user');
    const addUser = checkPermission('add_user');
    const viewCustomer = checkPermission('view_customer');
    const addCustomer = checkPermission('add_customer');
    const viewTask = checkPermission('view_task');
    const addTask = checkPermission('add_task');

    const hasQuickActionsPermissions = (viewUser && addUser) || (viewCustomer && addCustomer) || (viewTask && addTask)

    const [agentsData, setAgentsData] = useState([
        {
          data: [71, 27, 23],
          backgroundColor: ["#3EBF0F", "#115BC7", "#808897"],
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
    <div className="my-5 flex flex-wrap sm:flex-nowrap justify-between gap-5 w-full">

    {hasQuickActionsPermissions && (
      <div className="w-full sm:w-[48%] md:w-full lg:w-6/12 flex flex-col border border-[#DFE1E6] body-theme shadow-md rounded-xl">
        <div className="flex flex-col items-start gap-6 p-4 border-b border-[#DFE1E6]">
          <span>Quick Actions</span>
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          {viewUser && addUser && (
            <div
              onClick={() => router.push('/nativecrm/users?action=invite-user')}
              className="flex flex-col items-start gap-2 p-4 rounded-xl border border-[#DFE1E6] shadow-sm cursor-pointer transition"
            >
              <div className="flex w-6 h-6 justify-center items-center rounded-md border border-[#30A808] bg-[#3EBF0F] shadow-md">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="rounded-[5.333px] border border-[#30A808] bg-[#3EBF0F] shadow-[0px_-2.667px_4px_0px_rgba(255,_255,_255,_0.50)_inset,_0px_0.667px_1.333px_0px_rgba(13,_13,_18,_0.10)]"
              >
                  <path
                  d="M11.9877 6.44603H10.6023M9.21686 6.44603H10.6023M10.6023 6.44603V5.06061M10.6023 6.44603V7.83144M4.78353 8.10853H7.00019C8.53048 8.10853 9.77103 9.34907 9.77103 10.8794V11.4335C9.77103 11.7396 9.52292 11.9877 9.21686 11.9877H2.56686C2.2608 11.9877 2.0127 11.7396 2.0127 11.4335V10.8794C2.0127 9.34907 3.25324 8.10853 4.78353 8.10853ZM8.10853 4.22936C8.10853 5.45359 7.11609 6.44603 5.89186 6.44603C4.66763 6.44603 3.6752 5.45359 3.6752 4.22936C3.6752 3.00513 4.66763 2.0127 5.89186 2.0127C7.11609 2.0127 8.10853 3.00513 8.10853 4.22936Z"
                  stroke="white"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  />
              </svg>
              </div>
              <span className="font-medium">Create New User</span>
            </div>
          )}
          {viewTask && addTask && (
            <div
              onClick={() => router.push('/nativecrm/tasks?action=new-task')}
              className="flex flex-col items-start gap-2 p-4 rounded-xl border border-[#DFE1E6] shadow-sm cursor-pointer transition"
            >
              <div className="flex w-6 h-6 justify-center items-center rounded-md border border-[#5F41B4] bg-[#936DFF] shadow-md">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13.333px"
                  height="13.333px"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="flex-shrink-0"
              >
                  <path
                  d="M8.66683 4.778C8.66683 5.69847 7.92066 6.44466 7.00016 6.44466C6.07966 6.44466 5.3335 5.69847 5.3335 4.778C5.3335 3.85752 6.07966 3.11133 7.00016 3.11133C7.92066 3.11133 8.66683 3.85752 8.66683 4.778Z"
                  stroke="white"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  />
                  <path
                  d="M9.77783 2.55566C10.6983 2.55566 11.4445 3.30186 11.4445 4.22233C11.4445 4.90183 11.0378 5.48635 10.4547 5.74583"
                  stroke="white"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  />
                  <path
                  d="M7.95273 8.11133H6.04795C4.73298 8.11133 3.66699 9.17733 3.66699 10.4923C3.66699 11.0183 4.09339 11.4447 4.61937 11.4447H9.38128C9.90728 11.4447 10.3337 11.0183 10.3337 10.4923C10.3337 9.17733 9.26767 8.11133 7.95273 8.11133Z"
                  stroke="white"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  />
                  <path
                  d="M10.7305 7.55566C12.0454 7.55566 13.1114 8.62166 13.1114 9.93661C13.1114 10.4626 12.685 10.889 12.159 10.889"
                  stroke="white"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  />
                  <path
                  d="M4.22233 2.55566C3.30186 2.55566 2.55566 3.30186 2.55566 4.22233C2.55566 4.90183 2.96229 5.48635 3.54549 5.74583"
                  stroke="white"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  />
                  <path
                  d="M1.84154 10.889C1.31555 10.889 0.88916 10.4626 0.88916 9.93661C0.88916 8.62166 1.95515 7.55566 3.27011 7.55566"
                  stroke="white"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  />
              </svg>
              </div>
              <span className="font-medium">Create New Task</span>
            </div>
          )}
          {viewCustomer && addCustomer && (
            <div
              onClick={() => router.push('/nativecrm/customers?action=new-customer')}
              className="cursor-pointer flex flex-col items-start gap-2 p-4 rounded-xl border border-[#DFE1E6] shadow-sm transition"
            >
              <div className="flex w-6 h-6 justify-center items-center rounded-md border border-[#0B6BEA] bg-[#1285FE] shadow-md">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13.333px"
                  height="13.333px"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="flex-shrink-0"
              >
                  <path
                  d="M10.0613 10.0613C11.9055 8.2172 11.9055 5.22725 10.0613 3.38311C8.2172 1.53896 5.22725 1.53896 3.38311 3.38311C1.53896 5.22725 1.53896 8.2172 3.38311 10.0613C5.22725 11.9055 8.2172 11.9055 10.0613 10.0613ZM10.0613 10.0613L12 12"
                  stroke="white"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  />
              </svg>
              </div>
              <span className="font-medium">Create New Customer</span>
            </div>
          )}
        </div>
      </div>
    )}

    <div className="body-theme w-full sm:w-10/12 md:w-8/12 lg:w-6/12 border border-[#DFE1E6] rounded-[16px] shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)]">
      <div className="flex flex-col items-start gap-6 sm:gap-10 p-4 border-b border-[#DFE1E6]">
        <span className="text-base sm:text-lg font-semibold">Total Agents</span>
      </div>
      <div className="flex flex-col gap-3 w-full justify-center items-center pt-4 px-3">
        {agentsData.length === 0 ? (
          <NoDataFound message="No records found" />
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px]">
              <Doughnut data={{ datasets: agentsData }} options={options} />
            </div>
            <div>
              <p className="text-sm mb-1 flex items-center">
                <span className="w-2 h-2 inline-block rounded-full bg-green-500 mr-2"></span>
                Active Agents: 0
              </p>
              <p className="text-sm mb-1 flex items-center">
                <span className="w-2 h-2 inline-block rounded-full bg-blue-500 mr-2"></span>
                Agents on Break: 0
              </p>
              <p className="text-sm mb-1 flex items-center">
                <span className="w-2 h-2 inline-block rounded-full bg-gray-500 mr-2"></span>
                Idle Agents: 0
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>    
)}

  