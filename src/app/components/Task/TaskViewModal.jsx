import React, { use, useEffect, useState } from "react";
import Modal from "../Modal";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import getStatusSvg from "./getStatusSvg";
import Image from "next/image";
import UserAvatar from "../UserAvatar";
import { timeAgo } from "@/utils/timeUtils";
import { useRouter } from "next/navigation";
import SlaDetail from "../admin/Settings/sla-policies/SlaDetail";
import Link from "next/link";


const TaskViewModal = ({ isOpen, taskId, onClose }) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState(null);
  const [selectedTab, setSelectedTab] = useState("activities");
  const [activities, setActivities] = useState([]);
  const [comments, setComments] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [newComment, setNewComment] = useState("");
  const router = useRouter()
  const [slaId, setSlaId] = useState(null);
  const [isReview, setIsReview] = useState(false);

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/comments/?model=task&object_id=${taskId}`);
      setComments(response.data.comments);
    } catch (error) {
      handleApiError(error);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axiosInstance.post(`/comments/`, {
        model: "task",
        object_id: taskId,
        content: newComment,
      });

      setComments([response.data.comment, ...comments]);
      setNewComment("");
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

  const openConversation = () => {
    const chat = task?.conversation?.customer ? 'customers' : 'leads'
    const id = task?.conversation?.customer ? task?.conversation?.customer.id : task?.conversation?.lead.id

    router.push(`/nativecrm/messages?chat=${chat}&id=${id}`);
  }

  useEffect(() => {
    if (selectedTab === "comments") fetchComments();
  }, [selectedTab, taskId]);

  useEffect(() => {
    if (!isOpen || !taskId) return;

    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchTask = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/tasks/${taskId}`, { signal });
        setTask(data.task);
      } catch (err) {
        if (err.name !== "AbortError") {
          handleApiError(err);
        }
      } finally {
        if (!signal.aborted) setLoading(false); // ✅ Update state only if not aborted
      }
    };

    fetchTask();

    return () => {
      abortController.abort();
    };
  }, [taskId, isOpen]);


  useEffect(() => {
    const getActivityLogs = async () => {
      try {
        const response = await axiosInstance.get(`/activity-logs/?task_id=${taskId}`);
        setActivityLogs(response.data.logs);
      } catch (error) {
        handleApiError(error);
      }
    };

    if (taskId) {
      getActivityLogs();
    }
  }, [taskId]);

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
          <div className="flex mt-5 flex-col items-start gap-4 self-stretch rounded-lg ">
            {activityLogs.map((log, index) => (
              <div key={index} className="flex flex-row gap-2 p-3 justify-between items-center border-y  w-full mb-1">
                <div className='flex flex-col  gap-3'>
                  {log?.metadata?.updated_fields?.length > 0 && (
                    <>
                      <p className="text-sm font-medium mt-1">
                        Updated fields:
                      </p>
                      <div className="flex flex-col gap-3">
                        {log?.metadata?.updated_fields?.map((info, index) => {
                          return (
                            <div key={index} className="flex w-fit text-sm py-1 px-2 justify-center items-center gap-2 rounded-md bg-[#E7FEF8]">
                              <p className="text-[#40C4AA] text-xs">{info}</p>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}
                  {(log?.metadata?.updated_fields?.length == 0 || !log?.metadata?.updated_fields) && (
                    <>
                      <p className="text-sm font-medium mt-1">
                        {log?.description}
                      </p>
                    </>
                  )}
                  {log?.user && (
                    <div className="flex mt-1 items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 17 17" fill="none">
                        <path d="M9.38208 9.87435H6.71541C4.87446 9.87435 3.38208 11.3667 3.38208 13.2077V13.8743C3.38208 14.2425 3.68056 14.541 4.04875 14.541H12.0487C12.4169 14.541 12.7154 14.2425 12.7154 13.8743V13.2077C12.7154 11.3667 11.223 9.87435 9.38208 9.87435Z" stroke="#808897" strokeWidth="1.5" />
                        <path d="M8.04875 7.87435C9.52151 7.87435 10.7154 6.68044 10.7154 5.20768C10.7154 3.73492 9.52151 2.54102 8.04875 2.54102C6.57599 2.54102 5.38208 3.73492 5.38208 5.20768C5.38208 6.68044 6.57599 7.87435 8.04875 7.87435Z" stroke="#808897" strokeWidth="1.5" />
                      </svg>

                      <p className="text-[#808897] font-encodeSans text-sm font-medium">
                        Agent: {log?.user?.email}
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-sm font-normal text-gray-500 mt-1">{timeAgo(log.created_at)}</p>
              </div>
            ))}
            {activityLogs.length === 0 && <p>No activity logs available for this task.</p>}
          </div>
        );

      case "comments":
        return (
          <div className="mt-4 space-y-4">
            <div className="mb-7">
              <textarea
                placeholder="Add a comment..."
                className="w-full border rounded-lg p-2 text-sm body-theme"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addComment();
                  }
                }}
              />
              <button
                onClick={addComment}
                className="primary-bg mt-2 px-4 py-2  text-white rounded-md">
                Comment
              </button>
            </div>
            {comments.map((comment, index) => {
              const user = comment?.created_by
              const userName = getAssigneeName(user);
              return (
                <div key={index} className="flex items-start gap-3">
                  {user?.image ? (
                    <Image
                      alt="profile pic"
                      width={32}
                      height={32}
                      className="rounded-full w-8 h-8"
                      src={user.image}
                    />
                  ) : (
                    <UserAvatar
                      name={userName}
                      width="w-8"
                      height="h-8"
                    />
                  )}

                  <div className="flex-1">
                    <p className="text-sm">
                      <strong>
                        {comment?.created_by?.first_name?.trim() || comment?.created_by?.last_name?.trim()
                          ? `${comment?.created_by?.first_name || ''} ${comment?.created_by?.last_name || ''}`.trim()
                          : '--'}
                      </strong>
                      <span className="ml-2 text-gray-500">
                        {comment?.created_at ? timeAgo(comment.created_at) : '--'}
                      </span>
                    </p>
                    <p className="text-sm mt-1">{comment?.content || '--'}</p>

                  </div>
                </div>
              )
            })}
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
                      className="rounded-full w-8 h-8"
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
                        '--'
                      }
                    </p>
                    <p className="text-sm ">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 13.3332C10.9455 13.3332 13.3333 10.9454 13.3333 7.99984C13.3333 5.05432 10.9455 2.6665 8 2.6665C5.05448 2.6665 2.66666 5.05432 2.66666 7.99984C2.66666 10.9454 5.05448 13.3332 8 13.3332Z" stroke="#808897" strokeWidth="1.5" />
                    <path d="M8 5.33317V7.99984L9.33333 9.33317" stroke="#808897" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm ">Added to task</span>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  const handlereview = (id) => {
    setSlaId(id)
    setIsReview(true)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          {task && getStatusSvg(task.status.name)}
          {task && (
            <span className="text-sm font-medium text-gray-500">
              {task.task_id ?? `TSK-${task.id}`}
            </span>
          )}
          {task?.title}
        </div>
      }
      footer={footer} width="600px">
      <div>
        <div className="max-w-full ">
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gray-400"></div>
            </div>
          ) : task ? (
            <>
              {task.description && (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">
                      Description
                    </h2>
                  </div>
                  <p className="text-sm mb-4 mt-2">
                    {task.description || "No description"}
                  </p>
                </>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex justify-between items-center gap-2">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.33333 2.5H3.33333C2.59695 2.5 2 3.09695 2 3.83333V5.83333C2 6.56971 2.59695 7.16667 3.33333 7.16667H5.33333C6.06971 7.16667 6.66667 6.56971 6.66667 5.83333V3.83333C6.66667 3.09695 6.06971 2.5 5.33333 2.5Z" stroke="#808897" strokeWidth="1.5" />
                      <path d="M12.6667 2.5H10.6667C9.93029 2.5 9.33333 3.09695 9.33333 3.83333V5.83333C9.33333 6.56971 9.93029 7.16667 10.6667 7.16667H12.6667C13.403 7.16667 14 6.56971 14 5.83333V3.83333C14 3.09695 13.403 2.5 12.6667 2.5Z" stroke="#808897" strokeWidth="1.5" />
                      <path d="M5.33333 9.83333H3.33333C2.59695 9.83333 2 10.4303 2 11.1667V13.1667C2 13.903 2.59695 14.5 3.33333 14.5H5.33333C6.06971 14.5 6.66667 13.903 6.66667 13.1667V11.1667C6.66667 10.4303 6.06971 9.83333 5.33333 9.83333Z" stroke="#808897" strokeWidth="1.5" />
                      <path d="M12.6667 9.83333H10.6667C9.93029 9.83333 9.33333 10.4303 9.33333 11.1667V13.1667C9.33333 13.903 9.93029 14.5 10.6667 14.5H12.6667C13.403 14.5 14 13.903 14 13.1667V11.1667C14 10.4303 13.403 9.83333 12.6667 9.83333Z" stroke="#808897" strokeWidth="1.5" />
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
                      <path d="M7.99992 11.5002V14.1668M5.17149 10.3286L3.28587 12.2142M3.99992 7.50016H1.33325M11.9999 7.50016H14.6666M10.8283 10.3286L12.714 12.2142M7.99992 3.50016V0.833496M10.8283 4.67174L12.714 2.78612M5.17149 4.67174L3.28587 2.78612" stroke="#808897" strokeWidth="1.5" strokeLineCap="round" />
                    </svg>
                    <span className="font-medium">Status</span>
                  </div>
                  <span className={`${task.status.label.toLowerCase().replace(/\s+/g, '')} px-2 py-1 rounded`}>
                    {task.status.label}
                  </span>
                </div>
                {task.due_date && (
                  <div className="flex justify-between items-center">
                    <div className="flex justify-between items-center gap-2">
                      <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.33333 2.50016H4C2.89543 2.50016 2 3.39559 2 4.50016V6.50016M5.33333 2.50016V1.8335M5.33333 2.50016H10.6667M5.33333 2.50016V3.16683M10.6667 2.50016H12C13.1046 2.50016 14 3.39559 14 4.50016V6.50016M10.6667 2.50016V1.8335M10.6667 2.50016V3.16683M2 6.50016V13.1668C2 14.2714 2.89543 15.1668 4 15.1668H12C13.1046 15.1668 14 14.2714 14 13.1668V6.50016M2 6.50016H14M9 8.8335H11L9.33333 12.1668M7 9.8335V11.1668C7 11.7191 6.55228 12.1668 6 12.1668C5.44772 12.1668 5 11.7191 5 11.1668V9.8335C5 9.28121 5.44772 8.8335 6 8.8335C6.55228 8.8335 7 9.28121 7 9.8335Z" stroke="#808897" strokeWidth="1.5" strokeLineCap="round" strokeLinejoin="round" />
                      </svg>

                      <span className="font-medium">Due Date</span>
                    </div>
                    <span>{new Date(task.due_date).toLocaleDateString()}</span>

                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex justify-between items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.33325 9.33333H6.66659C4.82564 9.33333 3.33325 10.8257 3.33325 12.6667V13.3333C3.33325 13.7015 3.63173 14 3.99992 14H11.9999C12.3681 14 12.6666 13.7015 12.6666 13.3333V12.6667C12.6666 10.8257 11.1742 9.33333 9.33325 9.33333Z" stroke="#808897" strokeWidth="1.5" />
                      <path d="M7.99992 7.33333C9.47268 7.33333 10.6666 6.13943 10.6666 4.66667C10.6666 3.19391 9.47268 2 7.99992 2C6.52716 2 5.33325 3.19391 5.33325 4.66667C5.33325 6.13943 6.52716 7.33333 7.99992 7.33333Z" stroke="#808897" strokeWidth="1.5" />
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
                            className="w-9 h-9 rounded-full border-2 border-white"
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
                            width="w-9"
                            height="h-9"
                          />
                        );
                      }
                    })}
                  </div>
                </div>
                {task.sla && (
                  <div className="flex justify-between items-center">
                    <div className="flex justify-between items-center gap-2">
                      <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 15.1665C11.3137 15.1665 14 12.4802 14 9.1665C14 5.8528 11.3137 3.1665 8 3.1665C4.68629 3.1665 2 5.8528 2 9.1665C2 12.4802 4.68629 15.1665 8 15.1665Z" stroke="#808897" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M3.33333 13.1665L2 14.4998M12.6667 13.1665L14 14.4998" stroke="#808897" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.6666 2.8798L13.0636 2.6813C13.6271 2.39955 13.8388 2.43179 14.2868 2.8798C14.7348 3.3278 14.7671 3.53949 14.4853 4.103L14.2868 4.5M3.33325 2.8798L2.93625 2.6813C2.37275 2.39955 2.16105 2.43179 1.71305 2.8798C1.26505 3.3278 1.2328 3.53949 1.51455 4.103L1.71305 4.5" stroke="#808897" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M8 6.8335V9.50016L9.33333 10.8335" stroke="#808897" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 2.8335V1.8335" stroke="#808897" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6.66675 1.8335H9.33341" stroke="#808897" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>

                      <span className="font-medium">SLA</span>
                    </div>
                    <span
                      onClick={() => handlereview(task.sla?.id)}
                      className="cursor-pointer font-medium"
                    >
                      {task.sla?.title || "N/A"}
                    </span>
                  </div>
                )}



                {task?.conversation &&
                  <div className="flex justify-between items-center">
                    <Link onClick={openConversation} className="font-medium pointer mt-5">View related conversation</Link>
                  </div>
                }

              </div>


              <div className="mt-6">
                <div className="flex border-b">
                  {["activities", "comments", "members"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab)}
                      className={`mr-4 pb-2 capitalize ${selectedTab === tab
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

      {isReview &&
        <SlaDetail
          isOpen={isReview}
          onClose={() => setIsReview(false)}
          slaId={slaId} />
      }

    </Modal>
  );
};

export default TaskViewModal;

