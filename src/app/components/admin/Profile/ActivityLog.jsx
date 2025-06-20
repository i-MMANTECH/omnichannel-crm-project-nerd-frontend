import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import React, { useEffect, useState } from 'react';
import UserAvatar from '../../UserAvatar';
import Image from 'next/image';
import { timeAgo } from '@/utils/timeUtils';
import Pagination from '@/app/components/Pagination/Pagination';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { User, ClipboardList, Contact } from "lucide-react";


const ActivityLog = () => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const [activityLogs, setActivityLogs] = useState([]);

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
        setTotalPages(Math.ceil(resp.data.count / pageSize));
      } catch (error) {
        handleApiError(error);
      }
    };

    getActivityLogs();
  }, [currentPage, pageSize]);

  return (
    <div className="flex flex-col mt-5 p-6 items-start gap-4 rounded-lg border border-gray-300 w-full max-w-5xl mx-auto">
      {activityLogs.map((log, index) => (
        <div key={index} className='w-full rounded-lg border border-gray-300 p-4'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
            <div className="flex flex-col gap-2 w-full">
              <div className='flex items-center gap-3'>
                {log?.user ? (
                  log.user.image ? (
                    <Image
                      alt="profile pic"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                      src={log.user.image}
                    />
                  ) : (
                    <UserAvatar 
                      width="w-8" 
                      height="h-8" 
                      name={
                        log.user.first_name ? 
                        `${log.user.first_name} ${log.user.last_name}` : 
                        log.user.email || '--'
                      }
                    />
                  )
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {log.action_type === "user" && <User className="w-4 h-4 text-gray-500" />}
                    {log.action_type === "lead" && <Contact className="w-4 h-4 text-gray-500" />}
                    {log.action_type === "task" && <ClipboardList className="w-4 h-4 text-gray-500" />}
                  </div>
                )}
                <p className="font-medium text-sm sm:text-base">{log.description}</p>
              </div>

              {log?.metadata?.updated_fields?.length > 0 && (
                <div className="flex flex-col justify-between">
                  <p className="text-sm font-medium mb-2">Updated fields:</p>
                  <div className="flex flex-wrap gap-2">
                    {log.metadata.updated_fields.map((info) => (
                      <div key={info} className="px-2 py-1 rounded-md bg-green-100 text-green-600 text-xs sm:text-sm">
                        {info}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {log?.user && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 17 17" fill="none">
                    <path d="M9.38208 9.87435H6.71541C4.87446 9.87435 3.38208 11.3667 3.38208 13.2077V13.8743C3.38208 14.2425 3.68056 14.541 4.04875 14.541H12.0487C12.4169 14.541 12.7154 14.2425 12.7154 13.8743V13.2077C12.7154 11.3667 11.223 9.87435 9.38208 9.87435Z" stroke="#808897" strokeWidth="1.5"/>
                    <path d="M8.04875 7.87435C9.52151 7.87435 10.7154 6.68044 10.7154 5.20768C10.7154 3.73492 9.52151 2.54102 8.04875 2.54102C6.57599 2.54102 5.38208 3.73492 5.38208 5.20768C5.38208 6.68044 6.57599 7.87435 8.04875 7.87435Z" stroke="#808897" strokeWidth="1.5"/>
                  </svg>
                  <p>Agent: {log?.user?.email}</p>
                </div>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">{timeAgo(log.created_at)}</p>
          </div>
        </div>
      ))}

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
