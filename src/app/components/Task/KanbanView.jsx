import React from "react";
import TaskColumn from "./TaskColumn";

const getStatusSvg = (status) => {
  switch (status) {
    case "todo":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          style={{ width: "20px", height: "20px" }}
        >
          <path
            d="M6.25 10.4167L8.75 12.9167L13.75 7.91667M15 2.5H5C3.61929 2.5 2.5 3.61929 2.5 5V15C2.5 16.3807 3.61929 17.5 5 17.5H15C16.3807 17.5 17.5 16.3807 17.5 15V5C17.5 3.61929 16.3807 2.5 15 2.5Z"
            stroke="#808897"
            strokeWidth="1.875"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "inProgress":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 21"
          fill="none"
        >
          <path
            d="M6.66663 15.5H13.3333M5.83329 3H14.1666C15.0871 3 15.8333 3.74619 15.8333 4.66667V5.56458C15.8333 6.5772 15.373 7.53491 14.5823 8.16748L12.48 9.84928C12.063 10.1829 12.063 10.8171 12.48 11.1507L14.5823 12.8325C15.373 13.4651 15.8333 14.4228 15.8333 15.4354V16.3333C15.8333 17.2538 15.0871 18 14.1666 18H5.83329C4.91282 18 4.16663 17.2538 4.16663 16.3333V15.4354C4.16663 14.4228 4.62693 13.4651 5.41764 12.8325L7.51989 11.1507C7.93689 10.8171 7.93689 10.1829 7.51989 9.84928L5.41764 8.16748C4.62693 7.53491 4.16663 6.5772 4.16663 5.56458V4.66667C4.16663 3.74619 4.91282 3 5.83329 3Z"
            stroke="#1285FE"
            strokeWidth="1.66667"
            strokeLinecap="round"
          />
        </svg>
      );
    case "done":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M6.25 10.4167L8.75 12.9167L13.75 7.91667M15 2.5H5C3.61929 2.5 2.5 3.61929 2.5 5V15C2.5 16.3807 3.61929 17.5 5 17.5H15C16.3807 17.5 17.5 16.3807 17.5 15V5C17.5 3.61929 16.3807 2.5 15 2.5Z"
            stroke="#40C4AA"
            strokeWidth="1.875"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "overdue":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
        >
          <path
            d="M9.20642 14.2222H8.03181M9.20642 14.2222H10.5235C11.1844 14.2222 11.8182 13.9624 12.2855 13.5L15.3732 10.4444C15.8597 9.96296 16.6486 9.96296 17.1351 10.4444C17.6216 10.9259 17.6216 11.7066 17.1351 12.188L13.6974 15.59C12.1372 17.1339 10.0308 18 7.83573 18H2.5M9.20642 14.2222C9.85515 14.2222 10.381 13.7018 10.381 13.0598C10.381 12.4179 9.85515 11.8974 9.20642 11.8974H6.71468C6.05383 11.8974 5.42005 12.1572 4.95276 12.6197L4.55102 13.0172C3.97326 13.589 3.27119 13.9748 2.5 14.1365M6.66667 3H4.16667C3.70643 3 3.33333 3.3731 3.33333 3.83333V8C3.33333 8.46024 3.70643 8.83333 4.16667 8.83333H12.5C12.9602 8.83333 13.3333 8.46024 13.3333 8V3.83333C13.3333 3.3731 12.9602 3 12.5 3H10M6.66667 3V6.33333L8.33333 5.91667L10 6.33333V3M6.66667 3H10"
            stroke="#DF1C41"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
};

export default function KanbanView() {
  const sections = [
    {
      title: "To Do",
      count: 2,
      status: "todo",
    },
    {
      title: "Overdue",
      count: 3,
      status: "overdue",
    },
    {
      title: "In Progress",
      count: 1,
      status: "inProgress",
    },
    {
      title: "Done",
      count: 2,
      status: "done",
    },
  ];

  return (
    <>
      <div className="flex justify-between p-2 mb-4">
        {sections.map((section) => (
          <div
            key={section.status}
            className="flex justify-start w-[220px] h-10 p-2.5 items-center rounded-lg bg-gray-100"
          >
            {getStatusSvg(section.status)}
            <div className="flex items-center gap-1">
              <h3 className="text-lg">{section.title}</h3>
              <span className="text-xs text-gray-600 font-semibold tracking-[0.4px] text-center font-encode">
                {section.count}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-6 ms-1">
        <TaskColumn
            tasks={sections}
            status="todo"
          />
          <TaskColumn
            tasks={sections}
            status="overdue"
          />
          <TaskColumn
            tasks={sections}
            status="inProgress"
          />
          <TaskColumn
            tasks={sections}
            status="done"
          />
      </div>
    </>
  );
}
