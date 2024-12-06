import React from "react";

const TaskCard = ({ title, date, priority, users, status }) => {
    const priorityColors = {
      High: "text-red-500 bg-red-100",
      Medium: "text-blue-500 bg-blue-100",
      Low: "text-gray-500 bg-gray-100",
    };
  
    return (
      <div className="flex p-4 justify-between items-center self-stretch rounded-lg border border-gray-300 bg-white shadow-md mb-3">
        <div className="flex items-center space-x-3">
          {status !== "done" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <circle cx="10" cy="10" r="9.5" stroke="#DFE1E6" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              style={{ flexShrink: 0 }}
            >
              <circle cx="10" cy="10" r="10" fill="#3EBF0F" />
            </svg>
          )}
  
          <span
            style={{ textDecoration: status === "done" ? "line-through" : "none" }}
            className="font-medium text-gray-700"
          >
            {title}
          </span>
        </div>
  
        <div className="w-[300px] flex justify-between items-center">
          <div className="flex gap-2 align-items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              style={{ width: '16px', height: '16px', flexShrink: 0 }}
            >
              <path
                d="M5.33333 2.00016H4C2.89543 2.00016 2 2.89559 2 4.00016V6.00016M5.33333 2.00016V1.3335M5.33333 2.00016H10.6667M5.33333 2.00016V2.66683M10.6667 2.00016H12C13.1046 2.00016 14 2.89559 14 4.00016V6.00016M10.6667 2.00016V1.3335M10.6667 2.00016V2.66683M2 6.00016V12.6668C2 13.7714 2.89543 14.6668 4 14.6668H12C13.1046 14.6668 14 13.7714 14 12.6668V6.00016M2 6.00016H14M9 8.3335H11L9.33333 11.6668M7 9.3335V10.6668C7 11.2191 6.55228 11.6668 6 11.6668C5.44772 11.6668 5 11.2191 5 10.6668V9.3335C5 8.78121 5.44772 8.3335 6 8.3335C6.55228 8.3335 7 8.78121 7 9.3335Z"
                stroke="#808897"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
  
            <span className="text-sm text-gray-500">{date}</span>
            <span className={`text-xs px-2 py-1 rounded ${priorityColors[priority]}`}>
              {priority}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-2">
              {users.map((user, index) => (
                <img
                  key={index}
                  src="/assets/check-square.png"
                  alt={`User ${index}`}
                  className="w-6 h-6 rounded-full border-2 border-white"
                />
              ))}
            </div>
            <button style={{ marginTop: -10 }} className="text-gray-400 hover:text-gray-600">
              <span>...</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default function ListView() {
    const sections = [
      {
        title: "To Do",
        count: 2,
        tasks: [
          {
            title: "Competitive Targeting",
            date: "Oct 23",
            priority: "Medium",
            users: ["/assets/user1.png", "/assets/user2.png"],
            status: "todo",
          },
          {
            title: "Redesign Landing Page",
            date: "Oct 23",
            priority: "Medium",
            users: ["/assets/user3.png", "/assets/user4.png"],
            status: "todo",
          },
        ],
      },
      {
        title: "Overdue",
        count: 3,
        tasks: [
          {
            title: "Sustainability Awareness",
            date: "Oct 23",
            priority: "High",
            users: ["/assets/user1.png", "/assets/user5.png"],
            status: "overdue",
          },
          {
            title: "Competitive Targeting",
            date: "Oct 23",
            priority: "High",
            users: ["/assets/user2.png", "/assets/user6.png"],
            status: "overdue",
          },
        ],
      },
      {
        title: "In Progress",
        count: 1,
        tasks: [
          {
            title: "Competitive Targeting",
            date: "Oct 23",
            priority: "Low",
            users: ["/assets/user3.png", "/assets/user4.png"],
            status: "inProgress",
          },
        ],
      },
      {
        title: "Done",
        count: 2,
        tasks: [
          {
            title: "Competitive Targeting",
            date: "Oct 23",
            priority: "High",
            users: ["/assets/user1.png", "/assets/user2.png"],
            status: "done",
          },
          {
            title: "Competitive Targeting",
            date: "Oct 23",
            priority: "Medium",
            users: ["/assets/user3.png", "/assets/user4.png"],
            status: "done",
          },
        ],
      },
    ];
  
    const getStatusSvg = (status) => {
      switch (status) {
        case "todo":
          return (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ width: '20px', height: '20px' }}>
              <path d="M6.25 10.4167L8.75 12.9167L13.75 7.91667M15 2.5H5C3.61929 2.5 2.5 3.61929 2.5 5V15C2.5 16.3807 3.61929 17.5 5 17.5H15C16.3807 17.5 17.5 16.3807 17.5 15V5C17.5 3.61929 16.3807 2.5 15 2.5Z" stroke="#808897" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          );
        case "inProgress":
          return (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 21" fill="none">
                <path d="M6.66663 15.5H13.3333M5.83329 3H14.1666C15.0871 3 15.8333 3.74619 15.8333 4.66667V5.56458C15.8333 6.5772 15.373 7.53491 14.5823 8.16748L12.48 9.84928C12.063 10.1829 12.063 10.8171 12.48 11.1507L14.5823 12.8325C15.373 13.4651 15.8333 14.4228 15.8333 15.4354V16.3333C15.8333 17.2538 15.0871 18 14.1666 18H5.83329C4.91282 18 4.16663 17.2538 4.16663 16.3333V15.4354C4.16663 14.4228 4.62693 13.4651 5.41764 12.8325L7.51989 11.1507C7.93689 10.8171 7.93689 10.1829 7.51989 9.84928L5.41764 8.16748C4.62693 7.53491 4.16663 6.5772 4.16663 5.56458V4.66667C4.16663 3.74619 4.91282 3 5.83329 3Z" stroke="#1285FE" strokeWidth="1.66667" strokeLinecap="round"/>
            </svg>

          );
        case "done":
          return (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6.25 10.4167L8.75 12.9167L13.75 7.91667M15 2.5H5C3.61929 2.5 2.5 3.61929 2.5 5V15C2.5 16.3807 3.61929 17.5 5 17.5H15C16.3807 17.5 17.5 16.3807 17.5 15V5C17.5 3.61929 16.3807 2.5 15 2.5Z" stroke="#40C4AA" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

          );
        case "overdue":
          return (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                <path d="M9.20642 14.2222H8.03181M9.20642 14.2222H10.5235C11.1844 14.2222 11.8182 13.9624 12.2855 13.5L15.3732 10.4444C15.8597 9.96296 16.6486 9.96296 17.1351 10.4444C17.6216 10.9259 17.6216 11.7066 17.1351 12.188L13.6974 15.59C12.1372 17.1339 10.0308 18 7.83573 18H2.5M9.20642 14.2222C9.85515 14.2222 10.381 13.7018 10.381 13.0598C10.381 12.4179 9.85515 11.8974 9.20642 11.8974H6.71468C6.05383 11.8974 5.42005 12.1572 4.95276 12.6197L4.55102 13.0172C3.97326 13.589 3.27119 13.9748 2.5 14.1365M6.66667 3H4.16667C3.70643 3 3.33333 3.3731 3.33333 3.83333V8C3.33333 8.46024 3.70643 8.83333 4.16667 8.83333H12.5C12.9602 8.83333 13.3333 8.46024 13.3333 8V3.83333C13.3333 3.3731 12.9602 3 12.5 3H10M6.66667 3V6.33333L8.33333 5.91667L10 6.33333V3M6.66667 3H10" stroke="#DF1C41" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

          );
        default:
          return null;
      }
    };
  
    return (
      <div className="space-y-8">
        {sections.map((section, index) => {
          const renderedStatuses = new Set();
  
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-full flex h-9 p-2 gap-2 items-start self-stretch rounded-lg bg-[#F8F9FB]">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {section.tasks.map((task, taskIndex) => {
                      if (!renderedStatuses.has(task.status)) {
                        renderedStatuses.add(task.status);
                        return (
                            <div key={`${taskIndex}-${task.status}`}>
                              {getStatusSvg(task.status)}
                            </div>
                          );
                      }
                      return null;
                    })}
                  </div>
                  {section.title} <span className="text-sm text-gray-500">({section.count})</span>
                </div>
              </div>
              <div>
                {section.tasks.map((task, taskIndex) => (
                  <TaskCard
                    key={taskIndex}
                    title={task.title}
                    date={task.date}
                    priority={task.priority}
                    users={task.users}
                    status={task.status}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  