import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Bell, MoreVertical } from "lucide-react";
import UserAvatar from "../UserAvatar";
import FollowUpQueue from "./FollowUpQueue";
import ActionMenu from "./ActionMenu";

const FollowUp = ({ filters, selectedUser, refreshKey }) => {
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const followUpData = [
    {
        customerName: "Ogechi Arinze",
        customerImage: null,
        subject: "Login issues with the dashboard",
        status: "Needs Attention",
        waitingTime: "about 1 hour",
        agent: "Deola Adebayo",
        agentImage: null
    },
    {
        customerName: "John Doe",
        customerImage: null,
        subject: "Issue with order",
        status: "Escalated",
        waitingTime: "15 mins",
        agent: "Agent Smith",
        agentImage: null
    },
    {
        customerName: "Jane Smith",
        customerImage: null,
        subject: "Refund request",
        status: "Completed",
        waitingTime: "5 mins",
        agent: "Agent Johnson",
        agentImage: null
    },
    {
        customerName: "Bob Wilson",
        customerImage: null,
        subject: "Product inquiry",
        status: "Needs Attention",
        waitingTime: "30 mins",
        agent: "Agent Davis",
        agentImage: null
    },
    {
        customerName: "Alice Brown",
        customerImage: null,
        subject: "Account access",
        status: "Customer Non-Responsive",
        waitingTime: "2 hours",
        agent: "Agent Miller",
        agentImage: null
    },
    {
        customerName: "Mike Taylor",
        customerImage: null,
        subject: "Payment issue",
        status: "Escalated",
        waitingTime: "45 mins",
        agent: "Agent Wilson",
        agentImage: null
    }
    ];

  const getStatusStyling = (status) => {
    switch (status) {
      case "Escalated":
        return { backgroundColor: "#FEEFF2", color: "#DF1C41" };
      case "Completed":
        return { backgroundColor: "#E7FEF8", color: "#40C4AA" };
      case "Needs Attention":
        return { backgroundColor: "#FFF6E0", color: "#FFBD4C" };
      case "Customer Non-Responsive":
        return { backgroundColor: "#EEEFF2", color: "#666D80" };
      default:
        return { backgroundColor: "transparent", color: "inherit" };
    }
  };
  
 const handleMenuClick = (event, index) => {
    event.preventDefault();
    event.stopPropagation();
    
    const rect = event.target.getBoundingClientRect();
    setMenuPosition({
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY + 4
    });
    setOpenMenuIndex(index);
  };

  const closeMenu = () => {
    setOpenMenuIndex(null);
  };

  // This is to prevent the body from scrolling 
  // when the action menu is open like how 
  // youtube does it
  useEffect(() => {
    if (openMenuIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [openMenuIndex]);

  return (
    <>
        <div className="body-theme">
            <div className="w-[1106px] h-[193px] rounded-[16px] border border-gray-300 dark:border-gray-700 flex justify-between p-4">
                <div className="w-[344px] h-[152px] rounded-[15px] border border-gray-300 dark:border-gray-700 p-4 shadow-sm flex flex-col justify-between relative">
                <div
                    className="flex justify-center items-center w-[36px] h-[36px] p-[8px] rounded-[8px] border"
                    style={{ backgroundColor: "#1285FE", borderColor: "#DFE1E6" }}
                >
                    <Bell/>
                </div>

                <div>
                    <h3 className="pt-2 text-sm font-medium text-gray-600 dark:text-gray-300">Pending Follow-ups</h3>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white mt-2">200</div>
                </div>
                <div className="text-xs flex justify-between items-center gap-1">
                    <span className="text-[#40C4AA] font-semibold">↑ 70%</span>
                    <span className="text-gray-500 dark:text-gray-400">Out of 300 total</span>
                </div>
                </div>
                <div className="w-[344px] h-[152px] rounded-[15px] border border-gray-300 dark:border-gray-700 p-4 shadow-sm flex flex-col justify-between relative">
                <div
                    className="flex justify-center items-center w-[36px] h-[36px] p-[8px] rounded-[8px] text-whit border"
                    style={{ backgroundColor: "#FFBD4C", borderColor: "#DFE1E6" }}
                >
                    <Bell/>
                </div>

                <div>
                    <h3 className="pt-2 text-sm font-medium text-gray-600 dark:text-gray-300">Urgent Follow-ups</h3>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white mt-2">100</div>
                </div>
                <div className="text-xs flex justify-between items-center gap-1">
                    <span className="text-[#DF1C41] font-semibold">↓ 20%</span>
                    <span className="text-gray-500 dark:text-gray-400">This month</span>
                </div>
                </div>

                <div className="w-[344px] h-[152px] rounded-[15px] border border-gray-300 dark:border-gray-700 p-4 shadow-sm flex flex-col justify-between relative">
                <div
                    className="flex justify-center items-center w-[36px] h-[36px] p-[8px] rounded-[8px] text-whit border"
                    style={{ backgroundColor: "#DF1C41", borderColor: "#DFE1E6" }}
                >
                    <Bell/>
                </div>

                <div>
                    <h3 className="pt-2 text-sm font-medium text-gray-600 dark:text-gray-300">Escalated to Supervisor</h3>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white mt-2">200</div>
                </div>
                    <div className="text-xs flex justify-between items-center gap-1">
                        <span className="text-[#40C4AA] font-semibold">↑ 15%</span>
                        <span className="text-gray-500 dark:text-gray-400">Before top-up needed</span>
                    </div>
                </div>
            </div>

            <FollowUpQueue/>

            <div className="w-[1106px] border rounded-[16px] border-gray-300 p-4 mt-4 overflow-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-gray-300 bg-[#F8F9FB] dark:bg-gray-800 rounded-lg overflow-hidden">
                            <th className="py-2 px-3 rounded-tl-lg">Customer Name</th>
                            <th className="py-2 px-3">Subject</th>
                            <th className="py-2 px-3">Status</th>
                            <th className="py-2 px-3">Waiting Time</th>
                            <th className="py-2 px-3 rounded-tr-lg">Agent</th>
                            <th className="py-2 px-3 rounded-tr-lg"></th>
                        </tr>
                    </thead>
                   <tbody>
                        {followUpData.map((item, index) => (
                            <tr
                            key={index}
                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <td className="py-2 px-3 flex items-center gap-2">
                                    {item.customerImage ? (
                                    <Image
                                        alt="profile pic"
                                        className="w-9 h-9 rounded-full"
                                        src={item.customerImage}
                                        width={36}
                                        height={36}
                                    />
                                    ) : (
                                    <UserAvatar
                                        name={item.customerName}
                                        className="w-9 h-9 rounded-full flex-shrink-0"
                                    />
                                    )}
                                    <span>{item.customerName}</span>
                                </td>

                                <td className="py-2 px-3">{item.subject}</td>

                                <td className="py-2 px-3 text-xs font-medium">
                                    <span
                                    className="px-2 py-1 rounded-md inline-block"
                                    style={getStatusStyling(item.status)}
                                    >
                                    {item.status}
                                    </span>
                                </td>

                                <td className="py-2 px-3">{item.waitingTime}</td>

                                <td className="py-2 px-3 flex items-center gap-2">
                                    {item.agentImage ? (
                                    <Image
                                        alt="profile pic"
                                        className="w-9 h-9 rounded-full"
                                        src={item.agentImage}
                                        width={36}
                                        height={36}
                                    />
                                    ) : (
                                    <UserAvatar
                                        name={item.agent}
                                        className="w-9 h-9 rounded-full flex-shrink-0"
                                    />
                                    )}
                                    <span>{item.agent}</span>
                                </td>

                                <td className="py-2 px-3 text-right relative">
                                    <MoreVertical
                                    className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700"
                                    onClick={(e) => handleMenuClick(e, index)}
                                    />
                                    {openMenuIndex === index && (
                                    <ActionMenu
                                        isOpen={openMenuIndex === index}
                                        onClose={closeMenu}
                                        position={menuPosition}
                                    />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </>
  );
};

export default FollowUp;

