import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import getStatusSvg from "./getStatusSvg";
import Image from "next/image";
import UserAvatar from "../UserAvatar";

const TaskViewModal = ({ isOpen, taskId, onClose }) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState(null);
  const [selectedTab, setSelectedTab] = useState("activities");
  const [activities, setActivities] = useState([]);
  const [comments, setComments] = useState([]);

  const fetchActivities = async () => {
    try {
      const response = await axiosInstance.get(`/tasks/${taskId}/activities`);
      setActivities(response.data.activities);
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/tasks/${taskId}/comments`);
      setComments(response.data.comments);
    } catch (error) {
      handleApiError(error);
    }
  };

  const getAssigneeName = (assignee) => {
    if (assignee?.username) return assignee?.username;
    if (assignee?.name) return assignee?.name;
    if (assignee?.first_name && assignee?.last_name) {
      return `${assignee.first_name} ${assignee.last_name}`;
    }
    return assignee?.email || "--";
  };


  useEffect(() => {
    if (selectedTab === "activities") fetchActivities();
    if (selectedTab === "comments") fetchComments();
  }, [selectedTab, taskId]);

  useEffect(() => {
    if (!isOpen || !taskId) return;

    const abortController = new AbortController();
    
    const fetchTask = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`tasks/${taskId}`, {
          signal: abortController.signal
        });
        setTask(data.task);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          handleApiError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTask();

    return () => {
      abortController.abort();
    };
  }, [taskId, isOpen]);

  if (!isOpen) return null;

  const footer = (
    <>
       <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 body-theme text-black rounded-md mr-2 border border-gray-300"
        >
          Cancel
        </button>
    </>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case "activities":
        return (
          <div className="mt-4 space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex flex-col gap-2 p-4 rounded-lg border border-[#DFE1E6] w-full">
                <div className="flex items-center gap-3">
                  {activity?.user?.image ? (
                    <Image
                      alt="profile pic"
                      width={32}
                      height={32}
                      className="rounded-full"
                      src={activity.user.image}
                    />
                  ) : (
                    <UserAvatar 
                      name={activity?.user?.first_name ? 
                        `${activity.user.first_name} ${activity.user.last_name}` : 
                        activity?.user?.email || '--'
                      } 
                      width="w-8" 
                      height="h-8" 
                    />
                  )}
                  <p className="font-medium">{activity.description}</p>
                </div>
                {activity?.metadata?.updated_fields && (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">Updated fields:</p>
                    <div className="flex flex-wrap gap-2">
                      {activity.metadata.updated_fields.map((field, idx) => (
                        <div key={idx} className="px-2 py-1 text-sm rounded-md bg-[#E7FEF8]">
                          <p className="text-[#40C4AA]">{field}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-[#808897] text-sm">{activity.timestamp}</p>
              </div>
            ))}
          </div>
        );

      case "comments":
        return (
          <div className="mt-4 space-y-4">
            <div>
              <textarea
                placeholder="Add a comment..."
                className="w-full border rounded-lg p-2 text-sm body-theme"
                rows={3}
              />
              <button className="primary-bg mt-2 px-4 py-2  text-white rounded-md">
                Comment
              </button>
            </div>
            {comments.map((comment, index) => (
              <div key={index} className="flex items-start gap-3">
                {comment.user?.image ? (
                  <Image
                    alt="profile pic"
                    width={32}
                    height={32}
                    className="rounded-full"
                    src={comment.user.image}
                  />
                ) : (
                  <UserAvatar 
                    name={comment.user?.name || comment.user?.email || '--'} 
                    width="w-8" 
                    height="h-8" 
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm">
                    <strong>{comment.user?.name}</strong>
                    <span className="ml-2 text-gray-500">{comment.created_at}</span>
                  </p>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case "members":
        return (
          <div className="mt-4 space-y-4">
            {task?.assignees.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-[#DFE1E6]">
                <div className="flex items-center gap-3">
                  {member.image ? (
                    <Image
                      alt="profile pic"
                      width={32}
                      height={32}
                      className="rounded-full"
                      src={member.image}
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <UserAvatar 
                      name={member.first_name ? 
                        `${member.first_name} ${member.last_name}` : 
                        member.email || '--'
                      } 
                      width="w-8" 
                      height="h-8" 
                    />
                  )}
                  <div>
                    <p className="font-medium">
                      {member.first_name ? 
                        `${member.first_name} ${member.last_name}` : 
                        'Unnamed User'
                      }
                    </p>
                    <p className="text-sm ">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 13.3332C10.9455 13.3332 13.3333 10.9454 13.3333 7.99984C13.3333 5.05432 10.9455 2.6665 8 2.6665C5.05448 2.6665 2.66666 5.05432 2.66666 7.99984C2.66666 10.9454 5.05448 13.3332 8 13.3332Z" stroke="#808897" strokeWidth="1.5"/>
                    <path d="M8 5.33317V7.99984L9.33333 9.33317" stroke="#808897" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm ">Added to task</span>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={
        <div className="flex items-center gap-2">
          {task && getStatusSvg(task.status.name)}
          {task?.title}
        </div>
      }
      footer={footer} width="600px">
      <div>
        <div className="max-w-full ">
          {loading ? (
            <div>Loading...</div>
          ) : task ? (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">
                  Description
                </h2>
              </div>
              <p className="text-sm mb-4 mt-2">
                {task.description || "No description"}
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex justify-between items-center gap-2">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.33333 2.5H3.33333C2.59695 2.5 2 3.09695 2 3.83333V5.83333C2 6.56971 2.59695 7.16667 3.33333 7.16667H5.33333C6.06971 7.16667 6.66667 6.56971 6.66667 5.83333V3.83333C6.66667 3.09695 6.06971 2.5 5.33333 2.5Z" stroke="#808897" strokeWidth="1.5"/>
                      <path d="M12.6667 2.5H10.6667C9.93029 2.5 9.33333 3.09695 9.33333 3.83333V5.83333C9.33333 6.56971 9.93029 7.16667 10.6667 7.16667H12.6667C13.403 7.16667 14 6.56971 14 5.83333V3.83333C14 3.09695 13.403 2.5 12.6667 2.5Z" stroke="#808897" strokeWidth="1.5"/>
                      <path d="M5.33333 9.83333H3.33333C2.59695 9.83333 2 10.4303 2 11.1667V13.1667C2 13.903 2.59695 14.5 3.33333 14.5H5.33333C6.06971 14.5 6.66667 13.903 6.66667 13.1667V11.1667C6.66667 10.4303 6.06971 9.83333 5.33333 9.83333Z" stroke="#808897" strokeWidth="1.5"/>
                      <path d="M12.6667 9.83333H10.6667C9.93029 9.83333 9.33333 10.4303 9.33333 11.1667V13.1667C9.33333 13.903 9.93029 14.5 10.6667 14.5H12.6667C13.403 14.5 14 13.903 14 13.1667V11.1667C14 10.4303 13.403 9.83333 12.6667 9.83333Z" stroke="#808897" strokeWidth="1.5"/>
                    </svg>
                    <span className="font-medium">                
                      Priority
                    </span>
                  </div>
                  <span className={`${task.priority.label.toLowerCase()} font-medium p-1 rounded-md`}>
                    {task.priority.label}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex justify-between items-center gap-2">
                    <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.99992 11.5002V14.1668M5.17149 10.3286L3.28587 12.2142M3.99992 7.50016H1.33325M11.9999 7.50016H14.6666M10.8283 10.3286L12.714 12.2142M7.99992 3.50016V0.833496M10.8283 4.67174L12.714 2.78612M5.17149 4.67174L3.28587 2.78612" stroke="#808897" strokeWidth="1.5" stroke-linecap="round"/>
                    </svg>
                    <span className="font-medium">Status</span>
                  </div>
                  <span className={`${task.status.label.toLowerCase().replace(/\s+/g, '')} px-2 py-1 rounded`}>
                    {task.status.label}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex justify-between items-center gap-2">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.33333 2.50016H4C2.89543 2.50016 2 3.39559 2 4.50016V6.50016M5.33333 2.50016V1.8335M5.33333 2.50016H10.6667M5.33333 2.50016V3.16683M10.6667 2.50016H12C13.1046 2.50016 14 3.39559 14 4.50016V6.50016M10.6667 2.50016V1.8335M10.6667 2.50016V3.16683M2 6.50016V13.1668C2 14.2714 2.89543 15.1668 4 15.1668H12C13.1046 15.1668 14 14.2714 14 13.1668V6.50016M2 6.50016H14M9 8.8335H11L9.33333 12.1668M7 9.8335V11.1668C7 11.7191 6.55228 12.1668 6 12.1668C5.44772 12.1668 5 11.7191 5 11.1668V9.8335C5 9.28121 5.44772 8.8335 6 8.8335C6.55228 8.8335 7 9.28121 7 9.8335Z" stroke="#808897" strokeWidth="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>

                    <span className="font-medium">Due Date</span>
                  </div>
                  <span>{new Date(task.due_date).toLocaleDateString()}</span>
                  
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex justify-between items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.33325 9.33333H6.66659C4.82564 9.33333 3.33325 10.8257 3.33325 12.6667V13.3333C3.33325 13.7015 3.63173 14 3.99992 14H11.9999C12.3681 14 12.6666 13.7015 12.6666 13.3333V12.6667C12.6666 10.8257 11.1742 9.33333 9.33325 9.33333Z" stroke="#808897" strokeWidth="1.5"/>
                      <path d="M7.99992 7.33333C9.47268 7.33333 10.6666 6.13943 10.6666 4.66667C10.6666 3.19391 9.47268 2 7.99992 2C6.52716 2 5.33325 3.19391 5.33325 4.66667C5.33325 6.13943 6.52716 7.33333 7.99992 7.33333Z" stroke="#808897" strokeWidth="1.5"/>
                    </svg>

                    <span className="font-medium">Assigned Agents</span>
                  </div>
                  <div className="flex -space-x-2">
                    {task.assignees.map((assignee, index) => {
                      const assigneeName = getAssigneeName(assignee);
                      if (assignee?.image) {
                        return (
                          <Image
                            key={index}
                            alt={`Agent ${assignee.id}`}
                            className="w-6 h-6 rounded-full border-2 border-white"
                            src={assignee.image}
                            width={24}
                            height={24}
                          />
                        );
                      } else {
                        return (
                          <UserAvatar
                            className="border-white border-2" 
                            key={index} 
                            name={assigneeName} 
                            width="w-6" 
                            height="h-6" 
                          />
                        );
                      }
                    })}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex justify-between items-center gap-2">
                  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 15.1665C11.3137 15.1665 14 12.4802 14 9.1665C14 5.8528 11.3137 3.1665 8 3.1665C4.68629 3.1665 2 5.8528 2 9.1665C2 12.4802 4.68629 15.1665 8 15.1665Z" stroke="#808897" strokeWidth="1.5" stroke-linecap="round"/>
                        <path d="M3.33333 13.1665L2 14.4998M12.6667 13.1665L14 14.4998" stroke="#808897" strokeWidth="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12.6666 2.8798L13.0636 2.6813C13.6271 2.39955 13.8388 2.43179 14.2868 2.8798C14.7348 3.3278 14.7671 3.53949 14.4853 4.103L14.2868 4.5M3.33325 2.8798L2.93625 2.6813C2.37275 2.39955 2.16105 2.43179 1.71305 2.8798C1.26505 3.3278 1.2328 3.53949 1.51455 4.103L1.71305 4.5" stroke="#808897" strokeWidth="1.5" stroke-linecap="round"/>
                        <path d="M8 6.8335V9.50016L9.33333 10.8335" stroke="#808897" strokeWidth="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 2.8335V1.8335" stroke="#808897" strokeWidth="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6.66675 1.8335H9.33341" stroke="#808897" strokeWidth="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>


                    <span className="font-medium">SLA</span>
                  </div>
                  <span className="font-medium">{task.sla || "None"}</span>
                </div>
              </div>
      
              <div className="mt-6">
                <div className="flex border-b">
                  {["activities", "comments", "members"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab)}
                      className={`mr-4 pb-2 capitalize ${
                        selectedTab === tab
                          ? "border-b-2 border-green-500 primary-text font-medium"
                          : ""
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                {renderTabContent()}
              </div>
          </>
          ) : (
            <div>No task details found.</div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TaskViewModal;

