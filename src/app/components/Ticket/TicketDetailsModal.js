import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import UserAvatar from '../UserAvatar';
import Image from 'next/image';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';
import { timeAgo } from '@/utils/timeUtils';
import { Calendar, Grid, User, CheckCircle, Circle } from 'lucide-react';
import { selectStyles } from '../selectStyles';
import Select from "react-select";
import TextInput from '../TextInput';


const TicketDetailsModal = ({ isOpen, onClose, ticketId, onUpdate }) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [selectedTab, setSelectedTab] = useState('details');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignees: [],
    status: 1,
    priority: 2,
    due_date: null
  });
  const [submittingTask, setSubmittingTask] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [newAssignees, setNewAssignees] = useState([]);
  const [dueDate, setDueDate] = useState("")

  const [taskPriorities, setTaskPriorities] = useState([]);
  const [taskStatuses, setTaskStatuses] = useState([]);

  // Compute selected values only when dependencies change
  const selectedPriority = React.useMemo(() => {
    return taskPriorities.find(p => p.value === newTask.priority) || null;
  }, [taskPriorities, newTask.priority]);

  const selectedStatus = React.useMemo(() => {
    return taskStatuses.find(s => s.value === newTask.status) || null;
  }, [taskStatuses, newTask.status]);


  useEffect(() => {
    if (isOpen && ticketId) {
      fetchTicket();
      fetchUsers();
      fetchTasks();
      fetchComments();
    }
  }, [ticketId, isOpen]);

  useEffect(() => {
    fetchTaskPriorities();
    fetchTaskStatuses();
  }, [])

  useEffect(() => {
    if (!ticket) return;

    setNewTask(prev => ({
      ...prev,
      priority: ticket?.priority?.id ?? prev.priority,
      status: ticket?.status?.id ?? prev.status,
    }));
  }, [ticket?.priority?.id, ticket?.status?.id]);



  const fetchTicket = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/tickets/${ticketId}/`);
      if (response.data.success) {
        setTicket(response.data.ticket);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const response = await axiosInstance.get(`/tickets/${ticketId}/tasks/`, {
        params: { page: 1 }
      });
      if (response.data.success) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/users/');

      setAllUsers(response.data.results.map((user) => ({
        value: user.id,
        label: user.email,
      })) || []);
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchTaskPriorities = async () => {
    try {
      const response = await axiosInstance.get('/tasks/priorities/');

      setTaskPriorities(
        response.data.priorities.map(p => ({
          value: p.id,
          label: p.label
        }))
      );
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchTaskStatuses = async () => {
    try {
      const response = await axiosInstance.get('/tasks/statuses/');

      setTaskStatuses(
        response.data.statuses.map(p => ({
          value: p.id,
          label: p.label
        }))
      );
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/comments/`, {
        params: {
          model: 'ticket',
          object_id: ticketId
        }
      });
      if (response.data.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      setComments([]);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const response = await axiosInstance.post(`/comments/`, {
        model: 'ticket',
        object_id: ticketId,
        content: newComment.trim()
      });

      if (response.data.success) {
        setComments([response.data.comment, ...comments]);
        setNewComment('');
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const createTask = async () => {
    if (!newTask.title.trim()) return;

    const isoDueDate = dueDate
      ? new Date(dueDate).toISOString()
      : null;

    try {
      setSubmittingTask(true);
      const taskData = {
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        assignees: newAssignees.map((agent) => agent.value),
        status: newTask?.status || 1,
        priority: newTask?.priority || 2,
        due_date: isoDueDate
      };

      const response = await axiosInstance.post(`/tickets/${ticketId}/tasks/`, taskData);

      if (response.data.success) {
        setTasks([response.data.task, ...tasks]);
        setNewTask({
          title: '',
          description: '',
          assignees: [],
          status: 1,
          priority: 2,
          due_date: null
        });
        setShowTaskForm(false);
        fetchTicket(); // Refresh to update task count
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setSubmittingTask(false);
    }
  };

  const handleAgentChange = (selectedOptions) => {
    setNewAssignees(selectedOptions || []);
  };

  const getAssigneeName = (assignee) => {
    if (assignee?.username) return assignee?.username;
    if (assignee?.name) return assignee?.name;
    if (assignee?.first_name && assignee?.last_name) {
      return `${assignee.first_name} ${assignee.last_name}`;
    }
    return assignee?.email || '--';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (statusName) => {
    switch (statusName) {
      case 'open':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'resolved':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'closed':
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priorityName) => {
    switch (priorityName) {
      case 'low':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-800/30 dark:text-yellow-400';
      case 'high':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
      case 'urgent':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const renderAssignedAgents = () => {
    if (!ticket.assignees || ticket.assignees.length === 0) return null;

    return (
      <div className="rounded-lg mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="font-medium">Assigned Agent(s)</span>
          </div>
        </div>
        <div className="space-y-2">
          {ticket.assignees.map((assignee, index) => {
            const assigneeName = getAssigneeName(assignee);
            return (
              <div key={index} className="flex items-center gap-3">
                {assignee?.image ? (
                  <Image
                    alt={assigneeName}
                    className="w-8 h-8 rounded-full"
                    src={assignee.image}
                    width={32}
                    height={32}
                  />
                ) : (
                  <UserAvatar
                    name={assigneeName}
                    width="w-8"
                    height="h-8"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{assigneeName}</p>
                  {assignee?.email && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{assignee.email}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderFollowers = () => {
    if (!ticket.followers || ticket.followers.length === 0) return null;

    return (
      <div className="rounded-lg mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="font-medium">Followers</span>
          </div>
        </div>
        <div className="space-y-2">
          {ticket.followers.map((follower, index) => {
            const followerName = getAssigneeName(follower);
            return (
              <div key={index} className="flex items-center gap-3">
                {follower?.image ? (
                  <Image
                    alt={followerName}
                    className="w-8 h-8 rounded-full"
                    src={follower.image}
                    width={32}
                    height={32}
                  />
                ) : (
                  <UserAvatar
                    name={followerName}
                    width="w-8"
                    height="h-8"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{followerName}</p>
                  {follower?.email && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{follower.email}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTicketInfo = () => {
    return (
      <div>
        <div className="flex flex-col gap-3">
          <div className='flex justify-between items-center w-full'>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Date Created</span>
            </div>
            <p className="text-sm">{formatDate(ticket.created_at)}</p>
          </div>
          <div className='flex justify-between items-center w-full'>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Date</span>
            </div>
            <p className="text-sm">{ticket.due_date ? formatDate(ticket.due_date) : 'Dec 24, 2025'}</p>
          </div>
          <div className='flex justify-between items-center w-full'>
            <div className="flex items-center gap-2 mb-2">
              <Grid className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Category</span>
            </div>
            <p className="text-sm">{ticket.category?.label || 'Billing'}</p>
          </div>
        </div>

      </div>
    );
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'details':
        return (
          <div className="space-y-4 mt-6">
            {ticket.subject && (
              <div className="mt-6">
                <h3 className="text-md font-medium mb-2">Subject</h3>
                <p className="text-sm whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                  {ticket.subject}
                </p>
              </div>
            )}

            {/* Description */}
            {ticket.description && (
              <div className="mt-6">
                <h3 className="text-md font-medium mb-2">Description</h3>
                <p className="text-sm whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                  {ticket.description}
                </p>
              </div>
            )}

            {renderAssignedAgents()}
            {renderFollowers()}
            <div className='pt-0.5'></div>
            {renderTicketInfo()}

          </div>
        );

      case 'tasks':
        return (
          <div className="mt-4 space-y-4">
            {/* Add Task Button */}
            {!showTaskForm && (
              <button
                onClick={() => setShowTaskForm(true)}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-[#3EBF0F] hover:text-[#3EBF0F] transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Add Task
              </button>
            )}

            {/* Task Form */}
            {showTaskForm && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
                <input
                  type="text"
                  placeholder="Task title"
                  className="w-full border rounded-md p-2 text-sm body-theme"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <textarea
                  placeholder="Task description (optional)"
                  className="w-full border rounded-md p-2 text-sm body-theme"
                  rows={2}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />

                <Select
                  value={selectedPriority}
                  onChange={(opt) =>
                    setNewTask(prev => ({ ...prev, priority: opt?.value ?? null }))
                  }
                  options={taskPriorities}
                  styles={selectStyles}
                />

                <Select
                  value={selectedStatus}
                  onChange={(opt) =>
                    setNewTask(prev => ({ ...prev, status: opt?.value ?? null }))
                  }
                  options={taskStatuses}
                  styles={selectStyles}
                />

                <TextInput
                  label="Due Date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                <div className="mb-7">
                  <label className="block text-sm font-medium mb-1">Select Agents</label>
                  <Select
                    isMulti
                    options={allUsers}
                    value={newAssignees}
                    onChange={handleAgentChange}
                    styles={selectStyles}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={createTask}
                    disabled={!newTask.title.trim() || submittingTask}
                    className="px-4 py-2 bg-[#3EBF0F] text-white rounded-md hover:bg-[#35a50d] disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {submittingTask ? 'Adding...' : 'Add Task'}
                  </button>
                  <button
                    onClick={() => {
                      setShowTaskForm(false);
                      setNewTask({
                        title: '',
                        description: '',
                        assignees: [],
                        status: 1,
                        priority: null,
                        due_date: null
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Tasks List */}
            {loadingTasks ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500"></div>
              </div>
            ) : tasks.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No tasks yet</p>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => {
                  return (
                    <div
                      key={task.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {task?.status?.name == 'done' && (
                          <CheckCircle className="mt-1 self-center w-4 h-4 text-green-600" />
                        )}
                        {task?.status?.name !== 'done' && (
                          <Circle className="mt-1 self-center w-4 h-4 text-grey-600" />
                        )}

                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${task.status?.name === 'done' ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            {task.assignees?.length > 0 && (
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3 text-gray-500" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {getAssigneeName(task.assignees[0])}
                                </span>
                              </div>
                            )}
                            {task.created_at && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-gray-500" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {formatDate(task.created_at)}
                                </span>
                              </div>
                            )}
                            <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(task.priority?.name)}`}>
                              {task.priority?.label || 'Low'}
                            </span>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded font-medium ${task.status?.name === 'todo' ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' : task.status?.name === 'in_progress' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                          {task.status?.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        );

      case 'comments':
        return (
          <div className="mt-4 space-y-4">
            {/* Add Comment */}
            <div className="mb-7">
              <textarea
                placeholder="Add a comment..."
                className="w-full border rounded-lg p-2 text-sm body-theme"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    addComment();
                  }
                }}
              />
              <button
                onClick={addComment}
                disabled={!newComment.trim() || submittingComment}
                className="mt-2 px-4 py-2 bg-[#3EBF0F] text-white rounded-md hover:bg-[#35a50d] disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {submittingComment ? 'Adding...' : 'Comment'}
              </button>
            </div>

            {/* Comments List */}
            {comments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No comments yet</p>
            ) : (
              comments.map((comment, index) => {
                const user = comment?.user || comment?.created_by;
                const userName = user ? getAssigneeName(user) : '--';
                return (
                  <div key={index} className="flex items-start gap-3">
                    {user?.image ? (
                      <Image
                        alt="profile pic"
                        width={32}
                        height={32}
                        className="rounded-full"
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
                          {user?.first_name?.trim() || user?.last_name?.trim()
                            ? `${user?.first_name || ''} ${user?.last_name || ''}`.trim()
                            : '--'}
                        </strong>
                        <span className="ml-2 text-gray-500">
                          {comment?.created_at ? timeAgo(comment.created_at) : '--'}
                        </span>
                      </p>
                      <p className="text-sm mt-1">{comment?.comment || comment?.content || '--'}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen || !ticket) return null;

  const handleReopenTicket = async (ticketId, e) => {
    try {
      const response = await axiosInstance.patch(`/tickets/${ticketId}/update/`, {
        status_id: 1
      });

      if (response.data.success) {
        await fetchTicket();
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleCloseTicket = async (ticketId, e) => {
    try {
      const response = await axiosInstance.patch(`/tickets/${ticketId}/update/`, {
        status_id: 4
      });

      if (response.data.success) {
        await fetchTicket();
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const footer = (
    ticket.status?.name === 'closed' ? (
      <div className="pt-4">
        <button onClick={() => handleReopenTicket(ticket.id)} className="w-full px-4 py-3 bg-[#3EBF0F] text-white rounded-lg font-medium hover:bg-[#34ab0d]">
          Reopen ticket
        </button>
      </div>
    ) : (
      <div className="pt-4">
        <button onClick={() => handleCloseTicket(ticket.id)} className="w-full px-4 py-3 bg-[#3EBF0F] text-white rounded-lg font-medium hover:bg-[#34ab0d]">
          Close ticket
        </button>
      </div>
    )
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold">#{ticket.ticket_number}</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ticket.priority?.name)}`}>
              {ticket.priority?.label || 'Low'}
            </span>
          </div>
        </div>
      }
      footer={footer}
      width="700px"
    >
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500"></div>
        </div>
      ) : (
        <div className="max-w-full">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {['details', 'tasks', 'comments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`mr-4 pb-2 capitalize ${selectedTab === tab
                    ? 'border-b-2 border-[#3EBF0F] text-[#3EBF0F] font-medium'
                    : 'text-gray-500'
                  }`}
              >
                {tab === 'tasks'
                  ? `Tasks (${tasks.length})`
                  : tab === 'comments'
                    ? `Comments (${comments.length})`
                    : tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      )}
    </Modal>
  );
};

export default TicketDetailsModal;





