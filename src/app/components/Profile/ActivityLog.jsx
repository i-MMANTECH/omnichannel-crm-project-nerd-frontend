import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import React, { useEffect, useState } from 'react';
import UserAvatar from '../UserAvatar';
import Image from 'next/image';
import { timeAgo } from '@/utils/timeUtils';
import Pagination from '@/app/components/Pagination/Pagination';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const ActivityLog = () => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const [activityLogs, setActivityLogs] = useState([]);

  // Pagination state management
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = parseInt(searchParams.get("limit")) || 10;

  useEffect(() => {
    const getActivityLogs = async () => {
      try {
        const resp = await axiosInstance.get(`/activity-logs/?limit=${pageSize}&page=${currentPage}`);
        setActivityLogs(resp.data.logs);
        setTotalPages(Math.ceil(resp.data.count / pageSize)); // Calculate total pages
      } catch (error) {
        handleApiError(error);
      }
    };

    getActivityLogs();
  }, [currentPage, pageSize]);

  return (
    <div className="flex mt-5 flex-col p-6 items-start gap-4 self-stretch rounded-lg border border-[#DFE1E6] ">
      {activityLogs.map((log, index) => 
      {
      return (
        <div key={index} className='w-full rounded-[8px] border border-[#DFE1E6] p-[16.049px]'>
          <div className='flex justify-between items-center'>
            <div className="flex flex-col gap-2 w-full mb-1">
              <div className='flex items-center gap-3'>
                {log?.user?.image ? (
                  <Image
                    alt="profile pic"
                    width={8}
                    height={8}
                    className="customer-left-image mt-2 w-8 h-8 rounded-full"
                    src={log.user.image}
                  />
                ) : (
                  <UserAvatar name={log?.user?.first_name ? `${log?.user.first_name} ${log?.user.last_name}` : '--'} width="w-8" height="h-8" />
                )}
                <p className="font-medium">{log.description}</p>
              </div>

              {log?.metadata?.updated_fields && log.metadata.updated_fields.length > 0 && (
                <div className="flex flex-col justify-between">
                  <p className="text-sm font-medium mb-3">Updated fields:</p>
                  <div className="flex flex-wrap gap-3">
                    {log.metadata.updated_fields.map((info) => (
                      <div key={info} className="flex w-fit text-sm p-1 justify-center items-center gap-2 rounded-md bg-[#E7FEF8]">
                        <p className="text-[#40C4AA]">{info}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {log?.user && 
                <div className="flex mt-1 items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 17 17" fill="none">
                    <path d="M9.38208 9.87435H6.71541C4.87446 9.87435 3.38208 11.3667 3.38208 13.2077V13.8743C3.38208 14.2425 3.68056 14.541 4.04875 14.541H12.0487C12.4169 14.541 12.7154 14.2425 12.7154 13.8743V13.2077C12.7154 11.3667 11.223 9.87435 9.38208 9.87435Z" stroke="#808897" strokeWidth="1.5"/>
                    <path d="M8.04875 7.87435C9.52151 7.87435 10.7154 6.68044 10.7154 5.20768C10.7154 3.73492 9.52151 2.54102 8.04875 2.54102C6.57599 2.54102 5.38208 3.73492 5.38208 5.20768C5.38208 6.68044 6.57599 7.87435 8.04875 7.87435Z" stroke="#808897" strokeWidth="1.5"/>
                  </svg>
                  <p className="text-[#808897] font-encodeSans text-sm font-medium">Agent: {log?.user?.email}</p>
                </div>
              }
            </div>
            <p className="w-fit text-sm font-normal leading-[21px] tracking-[0.2px] whitespace-nowrap">{timeAgo(log.created_at)}</p>
          </div>
        </div>
      )})}

      <div className="mt-6 w-full">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", page);
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
          }}
          onPageSizeChange={(limit) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("limit", limit);
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
          }}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default ActivityLog;
