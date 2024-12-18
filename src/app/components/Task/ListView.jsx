import React from "react";
import getStatusSvg from "./getStatusSvg";
import UserAvatar from "../UserAvatar";
import Image from "next/image";


const TaskCard = ({ title, date, priority, assignees, status }) => {
    const priorityColors = {
      High: "text-red-500 bg-red-100",
      Medium: "text-blue-500 bg-blue-100",
      Low: "text-gray-500 bg-gray-100",
    };

    const getAssigneeName = (assignee) => {
      if (assignee?.username) {
        return assignee?.username
      } else if (assignee?.name) {
        return assignee?.name
      } else  if (assignee.first_name) {
        return assignee?.first_name + " " + assignee?.last_name
      } else {
        return '--'
      }
    }
  
    return (
      <div className="flex p-4 justify-between items-center self-stretch rounded-lg border border-gray-300 body-theme shadow-md mb-3">
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
            className="font-medium"
          >
            {title}
          </span>
        </div>
  
        <div className="flex justify-end items-center gap-6">
          <div className="flex gap-2 items-center">
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
  
            <span className="text-sm mr-4">
            {new Date(date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
            </span>
            <span className={`text-xs px-2 py-1 mr-32 rounded ${priorityColors[priority]}`}>
              {priority}
            </span>
          </div>

          <div className="flex items-center space-x-4 ">
            <div className="flex -space-x-2 w-16 justify-end">
              {assignees.map((assignee, index) => {
                const assigneeName = getAssigneeName(assignee)
                if (assignee?.image) {
                  return (
                    <Image 
                      key={index}
                      alt="profile pic"
                      className="w-6 h-6 rounded-full border-2 border-white"
                      source={{uri: assignee.profile}} 
                  />
                    )
                  } else {
                    return <UserAvatar className="border-white border-2" key={index} name={ assigneeName } width="w-6" height="h-6" />
                  }
              })}
            </div>
            <button style={{ marginTop: -10 }} className="hover:dark:bg-neutral-900 hover:bg-gray-100">
              <span>...</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default function ListView({ tasks }) {

    return (
      <div>
        {Object.values(tasks?.reduce((sections, task) => {
          if (!sections[task.status.name]) {
            sections[task.status.name] = {
              status: task.status,
              count: 0,
              tasks: [],
            };
          }
          sections[task.status.name].count += task.count;
          sections[task.status.name].tasks.push(task);
  
          return sections;
        }, {})).map((section, index) => (
          <div key={index} className="mb-7">
            <div className="w-full mb-4 flex h-9 p-2 gap-2 items-center rounded-lg bg-gray-100 dark:bg-neutral-900">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {getStatusSvg(section.status.name)}
              </div>
              {section.status.label} <span className="text-sm text-gray-500">({section.tasks.length})</span>
            </div>
  
            {section.tasks.map((task, taskIndex) => (
              <div key={taskIndex} className="mt-2">
                <TaskCard
                  title={task.title}
                  date={task.updated_at}
                  priority={task.priority.label}
                  assignees={task.assignees}
                  status={task.status.label}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
  