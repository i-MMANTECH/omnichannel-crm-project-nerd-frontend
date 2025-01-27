import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";

const TaskViewModal = ({ isOpen, taskId, onClose }) => {
const { axiosInstance } = useApi();
const { handleApiError } = useError();

const [loading, setLoading] = useState(false);
const [task, setTask] = useState(null);

useEffect(() => {
  if (!isOpen || !taskId) return;

  const fetchTask = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`tasks/${taskId}`);
      setTask(data.task);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  fetchTask();
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

return (
  <Modal 
    isOpen={isOpen} 
    onClose={onClose} 
    title="Task Details" 
    footer={footer} width="600px">
    <div>
      <div className="max-w-full p-6">
        {loading ? (
          <p>Loading...</p>
        ) : task ? (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {task.title}
              </h2>
            
            </div>
            <p className="text-sm mb-4">
              {task.description || "No description"}
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Priority</span>
                <span className="text-red-500 font-semibold">
                  {task.priority.label}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Status</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {task.status.label}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Due Date</span>
                <span>{new Date(task.due_date).toLocaleDateString()}</span>
                
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Assigned Agents</span>
                <div className="flex -space-x-2">
                {task.assignees.map((agent) => (
                    <img
                      key={agent.id}
                      className="w-8 h-8 rounded-full border border-white"
                      src={agent.image || "https://via.placeholder.com/32"}
                      alt={agent.first_name || `Agent ${agent.id}`}
                      title={agent.email}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">SLA</span>
                <span className="text-red-500 font-semibold">{task.sla || "No SLA"}</span>
              </div>
            </div>
    
            <div className="mt-6">
              <ul className="flex border-b">
                <li className="mr-4">
                  <button className="border-b-2 border-green-500 text-green-500 pb-2">
                    Comments
                  </button>
                </li>
                <li className="mr-4">
                  <button className=" pb-2">
                    Activities
                  </button>
                </li>
                <li>
                  <button className="pb-2">
                    Members
                  </button>
                </li>
              </ul>
    
              <div className="mt-4 space-y-4">
                <div>
                  <textarea
                    placeholder="Comment"
                    className="w-full border rounded-lg p-2 text-sm"
                  ></textarea>
                </div>
                <div>
                  <div className="flex items-start mb-4">
                    <img
                      className="w-8 h-8 rounded-full mr-3"
                      src="https://via.placeholder.com/32"
                      alt="Aunt Viv"
                    />
                    <div>
                      <p className="text-sm">
                        <strong>Aunt Viv</strong>
                        <span className=" ml-2">5 mins ago</span>
                      </p>
                      <p className="text-sm ">
                        Hey Mone, can you please help review the latest design task
                        when you can?
                      </p>
                      <button className="text-blue-500 text-xs mt-1">
                        &#8634; Reply
                      </button>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <img
                      className="w-8 h-8 rounded-full mr-3"
                      src="https://via.placeholder.com/32"
                      alt="Brenda James"
                    />
                    <div>
                      <p className="text-sm">
                        <strong>Brenda James</strong>
                        <span className="ml-2">2 days ago</span>
                      </p>
                      <p className="text-sm ">
                        Hey Mone, can you please help review the latest design task
                        when you can?
                      </p>
                      <button className="text-blue-500 text-xs mt-1">
                        &#8634; Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </>
        ) : (
          <p>No task details found.</p>
        )}
      </div>
    </div>
  </Modal>
);
};

export default TaskViewModal;
