import React from "react";

const TicketNotification = ({ type, ticketNumber, agentName, timestamp }) => {
  const isCreated = type === "created";
  const isClosed = type === "closed";

  const backgroundColor = isCreated 
    ? "bg-green-50 dark:bg-green-900/20" 
    : "bg-gray-50 dark:bg-gray-700/50";
  
  const textColor = isCreated 
    ? "text-green-800 dark:text-green-300" 
    : "text-gray-800 dark:text-gray-300";

  return (
    <div className={`flex items-center justify-center py-2 px-4 my-2 rounded-lg ${backgroundColor}`}>
      <div className={`flex items-center gap-2 text-sm ${textColor}`}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="none"
          className={isCreated ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"}
        >
          <rect x="2" y="4" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M2 7h12" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M5 2v4M11 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span className="font-medium">
          Ticket #{ticketNumber} {isCreated ? "created" : "closed"} by {agentName}
        </span>
        <span className="text-gray-500 dark:text-gray-400">• {timestamp}</span>
      </div>
    </div>
  );
};

export default TicketNotification;