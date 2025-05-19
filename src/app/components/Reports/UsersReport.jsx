import React, { useEffect, useState } from "react";
import NoDataFound from "../NoDataFound";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import RoleDistribution from "./RoleDistribution";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import StatCard from "./StatCard";
import { UsersIcon, PhoneCallIcon, MessageSquareIcon } from "lucide-react";

Chart.register(ArcElement);

export default function UsersReport({ filters, selectedUser }) {
  console.log("selectedUser", selectedUser)
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const [usersReportData, setUsersReportData] = useState(null);
  const [activityStatus, setActivityStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      let params = {};

      if (filters && filters.startDate && filters.endDate) {
        const formattedStart = filters.startDate.toISOString().split("T")[0];
        const formattedEnd = filters.endDate.toISOString().split("T")[0];
        
        params = {
          start_date: formattedStart,
          end_date: formattedEnd,
        };
      }

      if (selectedUser) {
        params.user_id = selectedUser;
      }

      const response = await axiosInstance.get("/analytics/users/", { params });
      const data = response.data.data;
      setUsersReportData(data);

      if (data?.users?.activity) {
        const active = data.users.activity.active.count;
        const inactive = data.users.activity.offline.count;

        setActivityStatus([
          {
            data: [active, inactive],
            backgroundColor: ["#3EBF0F", "#FFBD4C"],
            borderWidth: 1,
          },
        ]);
      } else {
        setActivityStatus([]);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, selectedUser]);

  const getTaskCount = (status) => {
    if (!usersReportData) return 0;
    const found = usersReportData.tasks?.status_distribution?.find(
      (s) => s.code === status
    );
    return found ? found.count : 0;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-gray-400"></div>
      </div>
    );

  if (!usersReportData) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <NoDataFound message="No user report data available." />
      </div>
    );
  }

  const statsData = [ 
    {
      title: "Total Users",
      value: usersReportData?.users?.total || 0,
      icon: <UsersIcon className="text-white" size={20} />,
      borderColor: "#DFE1E6",
      bgColor: "#1285FE",
    },
    {
      title: "Active Users",
      value: usersReportData?.users?.activity?.active?.count || 0,
      icon: <PhoneCallIcon className="text-white" size={20} />,
      borderColor: "#DFE1E6",
      bgColor: "#3EBF0F",
    },
    {
      title: "Inactive Users",
      value: usersReportData?.users?.activity?.offline?.count || 0,
      icon: <MessageSquareIcon className="text-white" size={20} />,
      borderColor: "#DFE1E6",
      bgColor: "#FF7043",
    },
  ];

  return (
    <>
      <div className="gap-5 mt-5 flex flex-wrap border border-[#DFE1E6] body-theme rounded-[16px] p-5">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="my-5 flex flex-wrap sm:flex-nowrap justify-between gap-5 w-full">
        <div className="body-theme w-full sm:w-10/12 md:w-8/12 lg:w-6/12 border border-[#DFE1E6] rounded-[16px] shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)]">
          <div className="flex flex-col items-start gap-6 p-4 border-b border-[#DFE1E6]">
            <span>Total Users</span>
          </div>
          <div className="flex flex-col gap-3 w-full justify-center items-center pt-4 px-3">
            {activityStatus.length === 0 ? (
              <NoDataFound message="No records found" />
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px]">
                  <Doughnut
                    data={{ datasets: activityStatus }}
                    options={options}
                  />
                </div>
                <div>
                  <p className="text-sm mb-1 flex items-center">
                    <span className="w-2 h-2 inline-block rounded-full bg-[#3EBF0F] mr-2"></span>
                    Active Users:{" "}
                    {usersReportData?.users?.activity?.active?.count || 0}
                  </p>
                  <p className="text-sm mb-1 flex items-center">
                    <span className="w-2 h-2 inline-block rounded-full bg-[#FFBD4C] mr-2"></span>
                    Inactive Users:{" "}
                    {usersReportData?.users?.activity?.offline?.count || 0}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full sm:w-[48%] md:w-full lg:w-6/12 flex flex-col border border-[#DFE1E6] body-theme shadow-md rounded-xl">
          <div className="flex flex-col items-start gap-6 p-4 border-b border-[#DFE1E6]">
            <span>Activities</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            <div className="flex flex-col items-start gap-2 p-4 rounded-xl border border-[#DFE1E6] shadow-sm cursor-pointer transition">
              {getTaskCount("done")}
              <span className="font-medium">Total Tasks Resolved</span>
            </div>

            <div className="flex flex-col items-start gap-2 p-4 rounded-xl border border-[#DFE1E6] shadow-sm cursor-pointer transition">
              {getTaskCount("todo")}
              <span className="font-medium">Total Tasks Pending</span>
            </div>

            <div className="cursor-pointer flex flex-col items-start gap-2 p-4 rounded-xl border border-[#DFE1E6] shadow-sm transition">
              {usersReportData?.tasks?.total || 0}
              <span className="font-medium">Total Tasks Assigned</span>
            </div>

            <div className="cursor-pointer flex flex-col items-start gap-2 p-4 rounded-xl border border-[#DFE1E6] shadow-sm transition">
              {usersReportData?.average_response_time?.formatted || "N/A"}
              <span className="font-medium">Average Response Time</span>
            </div>
          </div>
        </div>
      </div>

      {usersReportData?.roles_distribution && (
        <RoleDistribution roles={usersReportData.roles_distribution} />
      )}
    </>
  );
}
