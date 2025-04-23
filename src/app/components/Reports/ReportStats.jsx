import React, { useEffect, useState } from 'react';
import { usePermissions } from '@/context/PermissionsContext';
import { useApi } from '@/services/axiosConfig';

const ReportStats = () => {
  const { axiosInstance } = useApi();
  const { checkPermission } = usePermissions();

  const [summary, setSummary] = useState({
    activeAgents: 0,
  });


 useEffect(() => {
        fetchSummary(); 
    }, []);

  const fetchSummary = async () => {
  try {
      const response = await axiosInstance.get('/');
      if (response?.data.success) {
          const data = response.data.data;
      }
  } catch (error) {
      console.error("Error fetching :", error);
  }
  };

  const viewUser = checkPermission('view_user');
  const viewCustomer = checkPermission('view_customer');
  const viewTask = checkPermission('view_task');

  return (
    <div className="gap-5 mt-5 flex flex-wrap border border-[#DFE1E6] body-theme rounded-[16px] p-5">
      {viewCustomer && (
        <div className="h-[120px] flex cursor-pointer flex-col items-start gap-2 p-[16px_16px_14px] rounded-[16px] border border-[#DFE1E6] body-theme shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] flex-1">
        <div className="flex justify-center items-center gap-2 w-[36px] h-[36px] p-[8px] rounded-[8px] border border-[#0B6BEA] bg-[#1285FE] shadow-[0px_-4px_6px_0px_rgba(255,255,255,0.50)_inset,_0px_1px_2px_0px_rgba(13,13,18,0.10)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 22 20" fill="none" className="flex-shrink-0">
            <path d="M13.5 6.6665C13.5 8.04721 12.3807 9.1665 11 9.1665C9.61925 9.1665 8.5 8.04721 8.5 6.6665C8.5 5.2858 9.61925 4.1665 11 4.1665C12.3807 4.1665 13.5 5.2858 13.5 6.6665Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.1665 3.3335C16.5472 3.3335 17.6665 4.45279 17.6665 5.8335C17.6665 6.85274 17.0565 7.72952 16.1818 8.11875" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12.4286 11.6665H9.57143C7.59898 11.6665 6 13.2655 6 15.2379C6 16.0269 6.63959 16.6665 7.42857 16.6665H14.5714C15.3604 16.6665 16 16.0269 16 15.2379C16 13.2655 14.401 11.6665 12.4286 11.6665Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.5952 10.8335C18.5676 10.8335 20.1666 12.4325 20.1666 14.4049C20.1666 15.1939 19.527 15.8335 18.738 15.8335" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.8335 3.3335C5.45279 3.3335 4.3335 4.45279 4.3335 5.8335C4.3335 6.85274 4.94344 7.72952 5.81823 8.11875" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.26207 15.8335C2.47309 15.8335 1.8335 15.1939 1.8335 14.4049C1.8335 12.4325 3.43248 10.8335 5.40492 10.8335" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
        <span className="block font-[400] text-[14px] font-[Encode Sans] leading-[150%] tracking-[0.2px]">
            Total Users
        </span>
        <span className="font-[400] text-[14px] font-[Encode Sans] leading-[150%] tracking-[0.2px]">
            200
        </span>
        </div>

        <span className="font-[600] text-[18px] font-[Encode Sans] leading-[140%] tracking-[0.2px]">
          {summary.customers}
        </span>
      </div>
      )}

      {viewTask && (
        <div className="h-[120px] flex cursor-pointer flex-col items-start gap-2 p-[16px_16px_14px] rounded-[16px] border border-[#DFE1E6] body-theme shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] flex-1">
        <div className="flex justify-center items-center gap-2 w-[36px] h-[36px] p-[8px] rounded-[8px] border border-[#30A808] bg-[#3EBF0F] shadow-[0px_-4px_6px_0px_rgba(255,255,255,0.50)_inset,_0px_1px_2px_0px_rgba(13,13,18,0.10)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 22 20" fill="none" className="flex-shrink-0">
                <path d="M13.5 6.6665C13.5 8.04721 12.3807 9.1665 11 9.1665C9.61925 9.1665 8.5 8.04721 8.5 6.6665C8.5 5.2858 9.61925 4.1665 11 4.1665C12.3807 4.1665 13.5 5.2858 13.5 6.6665Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.1665 3.3335C16.5472 3.3335 17.6665 4.45279 17.6665 5.8335C17.6665 6.85274 17.0565 7.72952 16.1818 8.11875" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.4286 11.6665H9.57143C7.59898 11.6665 6 13.2655 6 15.2379C6 16.0269 6.63959 16.6665 7.42857 16.6665H14.5714C15.3604 16.6665 16 16.0269 16 15.2379C16 13.2655 14.401 11.6665 12.4286 11.6665Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.5952 10.8335C18.5676 10.8335 20.1666 12.4325 20.1666 14.4049C20.1666 15.1939 19.527 15.8335 18.738 15.8335" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.8335 3.3335C5.45279 3.3335 4.3335 4.45279 4.3335 5.8335C4.3335 6.85274 4.94344 7.72952 5.81823 8.11875" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.26207 15.8335C2.47309 15.8335 1.8335 15.1939 1.8335 14.4049C1.8335 12.4325 3.43248 10.8335 5.40492 10.8335" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
        <div>
          <span className="block font-[400] text-[14px] font-[Encode Sans] leading-[150%] tracking-[0.2px]">
          Active Users
          </span>
          <span className="font-[400] text-[14px] font-[Encode Sans] leading-[150%] tracking-[0.2px]">
              200
          </span>
        </div>

        <span className="font-[600] text-[18px] font-[Encode Sans] leading-[140%] tracking-[0.2px]">
          {summary.tasks}
        </span>
      </div>
      )}

      {viewUser && (
        <div className="h-[120px] flex cursor-pointer flex-col items-start gap-2 p-[16px_16px_14px] rounded-[16px] border border-[#DFE1E6] body-theme shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] flex-1">
        <div className="flex justify-center items-center gap-2 w-[36px] h-[36px] p-[8px] rounded-[8px] border border-[#F7921E] bg-[#F8B838] shadow-[0px_-4px_6px_0px_rgba(255,255,255,0.50)_inset,_0px_1px_2px_0px_rgba(13,13,18,0.10)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 22 20" fill="none" className="flex-shrink-0">
            <path d="M13.5 6.6665C13.5 8.04721 12.3807 9.1665 11 9.1665C9.61925 9.1665 8.5 8.04721 8.5 6.6665C8.5 5.2858 9.61925 4.1665 11 4.1665C12.3807 4.1665 13.5 5.2858 13.5 6.6665Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.1665 3.3335C16.5472 3.3335 17.6665 4.45279 17.6665 5.8335C17.6665 6.85274 17.0565 7.72952 16.1818 8.11875" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12.4286 11.6665H9.57143C7.59898 11.6665 6 13.2655 6 15.2379C6 16.0269 6.63959 16.6665 7.42857 16.6665H14.5714C15.3604 16.6665 16 16.0269 16 15.2379C16 13.2655 14.401 11.6665 12.4286 11.6665Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.5952 10.8335C18.5676 10.8335 20.1666 12.4325 20.1666 14.4049C20.1666 15.1939 19.527 15.8335 18.738 15.8335" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.8335 3.3335C5.45279 3.3335 4.3335 4.45279 4.3335 5.8335C4.3335 6.85274 4.94344 7.72952 5.81823 8.11875" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.26207 15.8335C2.47309 15.8335 1.8335 15.1939 1.8335 14.4049C1.8335 12.4325 3.43248 10.8335 5.40492 10.8335" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          </svg>
        </div>
        <div>
          <span className="block font-[400] text-[14px] font-[Encode Sans] leading-[150%] tracking-[0.2px]">
            Inactive Users
          </span>
          <span className="font-[400] text-[14px] font-[Encode Sans] leading-[150%] tracking-[0.2px]">
              200
          </span>
        </div>

        <span className="font-[600] text-[18px] font-[Encode Sans] leading-[140%] tracking-[0.2px]">
          {summary.users}
        </span>
      </div>
      )}
    </div>
  );
};

export default ReportStats;
