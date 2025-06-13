import React from "react";
import { useAuth } from "@/context/AuthContext";
import {
  FileText,
  PhoneMissed,
  PhoneCall,
  LayoutDashboard,
  ArrowLeft,
  FolderOpen,
  Phone
} from "lucide-react";

function CallCenterSidebar({ onSidebarClick, currentSection }) {
  const activeStyle = "bg-gray-100 text-[#3EBF0F] font-medium";
  const defaultStyle = "text-gray-600 hover:bg-gray-100";

  const menuItems = [
    // {
    //   key: "call-overview",
    //   label: "Call Real Time Report",
    //   icon: <PhoneCall size={18} />,
    // },
    // {
    //   key: "call-center-dashboard",
    //   label: "Call Centre Dashboard",
    //   icon: <LayoutDashboard size={18} />,
    // },
    {
      key: "real-time-reports",
      label: "Real Time Reports",
      icon: <LayoutDashboard size={18} />,
    },
    {
      key: "call-detail-records",
      label: "Call Detail Records",
      icon: <FolderOpen size={18} />,
    },
    {
      key: "missed-call-report",
      label: "Missed Call Report",
      icon: <PhoneMissed size={18} />,
    },
    {
      key: "live-calls",
      label: "Live Calls",
      icon: <Phone size={18} />,
    },
   
    {
      key: "ivr",
      label: "IVR",
      icon: <Phone size={18} />,
    },
  ];

  return (
    <div className="w-full px-4 py-3">
      {/* Menu */}
      <div className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onSidebarClick(item.key)}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm transition ${
              currentSection === item.key ? activeStyle : defaultStyle
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CallCenterSidebar;
