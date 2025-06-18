import React from 'react';
import { usePermissions } from '@/context/PermissionsContext';

const StatsCard = ({ summary }) => {
  const { checkPermission } = usePermissions();

  const viewUser = checkPermission('view_user');
  const viewCustomer = checkPermission('view_customer');
  const viewTask = checkPermission('view_task');
  const viewMessage = checkPermission('view_message');

  return (
    <div className="gap-5 mt-5 flex flex-wrap">
      {viewMessage && (
          <a href="/admin/messages?chat=leads" className="flex cursor-pointer flex-col items-start gap-4 p-[16px_16px_14px] rounded-[16px] border border-[#DFE1E6] body-theme shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] flex-1">
          <div className="flex justify-center items-center gap-2 w-[36px] h-[36px] p-[8px] rounded-[8px] border border-[#30A808] bg-[#3EBF0F] shadow-[0px_-4px_6px_0px_rgba(255,255,255,0.50)_inset,_0px_1px_2px_0px_rgba(13,13,18,0.10)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
              <path d="M6.66667 6.66667H9.16667M6.66667 10H11.6667M4.16667 2.5H15.8333C16.7538 2.5 17.5 3.24289 17.5 4.15929V12.4594C17.5 13.3758 16.7538 14.1187 15.8333 14.1187H6.23385C5.9807 14.1187 5.74127 14.2333 5.58313 14.4301L3.24203 17.3435C2.99598 17.6497 2.5 17.4765 2.5 17.0844V4.15929C2.5 3.24289 3.24619 2.5 4.16667 2.5Z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-[400] text-[14px] font-[Encode Sans] leading-[150%] tracking-[0.2px]">
            Messages
          </span>
  
          <span className="font-[600] text-[18px] font-[Encode Sans] leading-[140%] tracking-[0.2px]">
            {summary.messages}
          </span>
        </a>
        )}

      {viewCustomer && (
        <a href="/admin/customers" className="flex cursor-pointer flex-col items-start gap-4 p-[16px_16px_14px] rounded-[16px] border border-[#DFE1E6] body-theme shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] flex-1">
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
        <span className="font-[400] text-[14px] font-[Encode Sans] leading-[150%] tracking-[0.2px]">
          Customers
        </span>

        <span className="font-[600] text-[18px] font-[Encode Sans] leading-[140%] tracking-[0.2px]">
          {summary.customers}
        </span>
      </a>
      )}

      {viewTask && (
        <a href="/admin/tasks" className="flex cursor-pointer flex-col items-start gap-4 p-[16px_16px_14px] rounded-[16px] border border-[#DFE1E6] body-theme shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] flex-1">
        <div className="flex justify-center items-center gap-2 w-[36px] h-[36px] p-[8px] rounded-[8px] border border-[#5F41B4] bg-[#936DFF] shadow-[0px_-4px_6px_0px_rgba(255,255,255,0.50)_inset,_0px_1px_2px_0px_rgba(13,13,18,0.10)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
            <path d="M6.25 10.4167L8.75 12.9167L13.75 7.91667M15 2.5H5C3.61929 2.5 2.5 3.61929 2.5 5V15C2.5 16.3807 3.61929 17.5 5 17.5H15C16.3807 17.5 17.5 16.3807 17.5 15V5C17.5 3.61929 16.3807 2.5 15 2.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="font-[400] text-[14px] font-[Encode Sans] leading-[150%] tracking-[0.2px]">
          Tasks
        </span>

        <span className="font-[600] text-[18px] font-[Encode Sans] leading-[140%] tracking-[0.2px]">
          {summary.tasks}
        </span>
      </a>
      )}

      {viewUser && (
        <a href="/admin/users" className="flex cursor-pointer flex-col items-start gap-4 p-[16px_16px_14px] rounded-[16px] border border-[#DFE1E6] body-theme shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] flex-1">
        <div className="flex justify-center items-center gap-2 w-[36px] h-[36px] p-[8px] rounded-[8px] border border-[#F7921E] bg-[#F8B838] shadow-[0px_-4px_6px_0px_rgba(255,255,255,0.50)_inset,_0px_1px_2px_0px_rgba(13,13,18,0.10)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
            <path d="M9.98335 5.83333C9.99381 5.86465 10.0042 5.89601 10.0145 5.92741L14.3505 14.4274C14.4235 14.5953 14.3075 14.8 14.1335 14.8H5.86684C5.69284 14.8 5.57684 14.5953 5.64984 14.4274L9.98584 5.92741C9.99611 5.89601 10.0065 5.86465 10.0168 5.83333H9.98335Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 15.8333C7.59667 15.8333 5.83333 14.07 5.83333 11.6667C5.83333 9.26337 7.59667 7.5 10 7.5C12.4033 7.5 14.1667 9.26337 14.1667 11.6667C14.1667 14.07 12.4033 15.8333 10 15.8333Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="font-[400] text-[14px] font-[Encode Sans] leading-[150%] tracking-[0.2px]">
          Users
        </span>

        <span className="font-[600] text-[18px] font-[Encode Sans] leading-[140%] tracking-[0.2px]">
          {summary.users}
        </span>
      </a>
      )}
    </div>
  );
};

export default StatsCard;
