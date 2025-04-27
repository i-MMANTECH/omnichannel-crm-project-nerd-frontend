import React, {useState} from "react";
import NoDataFound from "../NoDataFound";
import { Doughnut } from "react-chartjs-2";
import {Chart, ArcElement} from 'chart.js'
import ReportStats from "./ReportStats";
import RoleDistribution from "./RoleDistribution";
Chart.register(ArcElement);


export default function Reports() {
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
            <div className="my-5 flex flex-wrap sm:flex-nowrap justify-between gap-5 w-full">
                <div className="body-theme w-full sm:w-10/12 md:w-8/12 lg:w-6/12 border border-[#DFE1E6] rounded-[16px] shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)]">
                    <div className="flex flex-col items-start gap-6 p-4 border-b border-[#DFE1E6]">
                        <span>Total Users</span>
                    </div>
                    <div className="flex flex-col gap-3 w-full justify-center items-center pt-4 px-3">
                        {agentsData.length === 0 ? (
                        <NoDataFound message="No records found" />
                        ) : (
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px]">
                                <Doughnut
                                    data={{datasets: agentsData}} 
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

                <div className="w-full sm:w-[48%] md:w-full lg:w-6/12 flex flex-col border border-[#DFE1E6] body-theme shadow-md rounded-xl">
                    <div className="flex flex-col items-start gap-6 p-4 border-b border-[#DFE1E6]">
                        <span>Activities</span>
                    </div>
            
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                        <div
                        className="flex flex-col items-start gap-2 p-4 rounded-xl border border-[#DFE1E6] shadow-sm cursor-pointer transition"
                        >
                        12
                        <span className="font-medium">Total Tasks Resolved</span>
                        </div>

                        <div
                        className="flex flex-col items-start gap-2 p-4 rounded-xl border border-[#DFE1E6] shadow-sm cursor-pointer transition"
                        >
                        12
                        <span className="font-medium">Total Tasks Pending</span>
                        </div>
                    
                        <div
                        className="cursor-pointer flex flex-col items-start gap-2 p-4 rounded-xl border border-[#DFE1E6] shadow-sm transition"
                        >
                        12
                        <span className="font-medium">Total Tasks Assigned</span>
                        </div>
                        <div
                        className="cursor-pointer flex flex-col items-start gap-2 p-4 rounded-xl border border-[#DFE1E6] shadow-sm transition"
                        >
                        12
                        <span className="font-medium">Average Response Time</span>
                        </div>
                    </div>
                </div>
            </div> 
            <RoleDistribution />
        </>
           
    )}