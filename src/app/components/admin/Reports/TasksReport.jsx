import { useEffect, useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';
import { useAuth } from '@/context/AuthContext';
import StatCard from './StatCard';
import { MessageSquareIcon, PhoneCallIcon, UsersIcon, MoreVertical, X, Clock, CheckCircle2, User, MessageCircleDashed, MessageSquareDashed } from 'lucide-react';
import UserAvatar from '../../UserAvatar';
import Pagination from '../../Pagination/Pagination';
import Select from 'react-select';
import { selectStyles } from '../../selectStyles';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TasksReport = ({filters, selectedUser, refreshKey}) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [tasksReportData, setTasksReportData] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [tasksList, setTasksList] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskTimeline, setTaskTimeline] = useState(null);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Reassign modal state
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      let params = {};

      if (filters && filters.startDate && filters.endDate) {
        params.start_date = filters.startDate.toISOString().split("T")[0];
        params.end_date = filters.endDate.toISOString().split("T")[0];
      }

      if (selectedUser) {
        params.user_id = selectedUser;
      }

      const res = await axiosInstance.get('/analytics/tasks/', { params });
      setTasksReportData(res.data.data);
      
      // Fetch tasks list with pagination
      const tasksParams = {
        ...params,
        page: currentPage,
        page_size: pageSize
      };
      
      const tasksRes = await axiosInstance.get('/tasks/list/', { params: tasksParams });
      setTasksList(tasksRes.data.tasks || []);
      
      // Update pagination info
      if (tasksRes.data.pagination) {
        setTotalPages(tasksRes.data.pagination.total_pages || 1);
        setTotalCount(tasksRes.data.pagination.total_count || 0);
      } else if (tasksRes.data.count) {
        // Alternative response structure
        setTotalCount(tasksRes.data.count);
        setTotalPages(Math.ceil(tasksRes.data.count / pageSize));
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskTimeline = async (taskId) => {
    setTimelineLoading(true);
    try {
      const res = await axiosInstance.get(`/tasks/${taskId}/timeline/`, {
        params: { page: 1, page_size: 100 }
      });
      setTaskTimeline(res.data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setTimelineLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/users/');
      setUsers(response.data.results || []);
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    console.log("user is", user)
    fetchData();
  }, [filters, selectedUser, refreshKey, currentPage, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const statusOptions = useMemo(() => {
    if (!tasksReportData || !tasksReportData.tasks_by_period?.length) {
      return ['All Status'];
    }

    const firstPeriod = tasksReportData.tasks_by_period[0];
    const statusNames = Object.keys(firstPeriod).filter(key => 
      key !== 'period' && key !== 'period_label' && key !== 'total'
    );

    return ['All Status', ...statusNames];
  }, [tasksReportData]);

  const monthlyChartData = useMemo(() => {
    if (!tasksReportData?.tasks_by_period) return null;

    const chartData = tasksReportData.tasks_by_period.map(item => {
      if (statusFilter === 'All Status') {
        return item.total;
      } else {
        return item[statusFilter] || 0;
      }
    });

    return {
      labels: tasksReportData.tasks_by_period.map(item => item.period_label),
      datasets: [
        {
          label: statusFilter === 'All Status' ? 'Total Tasks' : `${statusFilter} Tasks`,
          data: chartData,
          backgroundColor: (ctx) => {
            const index = ctx.dataIndex;
            return index === (tasksReportData.tasks_by_period.length - 1)
              ? '#3EBF0F'
              : '#EEEFF2';
          },
          borderRadius: 8,
        }
      ]
    };
  }, [tasksReportData, statusFilter]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    fetchTaskTimeline(task.id);
  };

  const closeTaskDetails = () => {
    setSelectedTask(null);
    setTaskTimeline(null);
    setShowReassignModal(false);
    setSelectedAssignees([]);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  // Team Action Handlers
  const handleNudge = async () => {
    if (!selectedTask || !user) return;

    setActionLoading(true);
    try {
      const assigneeName = selectedTask.assignees && selectedTask.assignees.length > 0
        ? selectedTask.assignees[0].first_name
        : 'there';

      const nudgeMessage = `Hi ${assigneeName}, this is a friendly reminder to please take a look at this task. Let us know if you need any assistance or if there are any blockers. Thanks!`;

      await axiosInstance.post('/comments/', {
        model: 'task',
        object_id: selectedTask.id,
        content: nudgeMessage
      });

      // Refresh timeline to show new comment
      await fetchTaskTimeline(selectedTask.id);
      
      alert('Nudge sent successfully!');
    } catch (err) {
      handleApiError(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTakeover = async () => {
    if (!selectedTask || !user) return;

    setActionLoading(true);
    try {
      // Update task assignees to current user
      await axiosInstance.post(`/tasks/${selectedTask.id}/update/`, {
        assignees: [user.user_id]
      });

      // Add comment about takeover
      const takeoverMessage = `${user.first_name} ${user.last_name} has taken over this task.`;
      await axiosInstance.post('/comments/', {
        model: 'task',
        object_id: selectedTask.id,
        content: takeoverMessage
      });

      // Refresh data
      await fetchData();
      await fetchTaskTimeline(selectedTask.id);
      
      // Update selected task state
      setSelectedTask({
        ...selectedTask,
        assignees: [{ id: user.user_id, first_name: user.first_name, last_name: user.last_name, email: user.email }]
      });

      alert('Task successfully taken over!');
    } catch (err) {
      handleApiError(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReassignClick = () => {
    // Pre-populate with current assignees
    if (selectedTask?.assignees) {
      setSelectedAssignees(
        selectedTask.assignees.map(a => ({
          value: a.id,
          label: a.email
        }))
      );
    }
    setShowReassignModal(true);
  };

  const handleReassignSubmit = async () => {
    if (!selectedTask || selectedAssignees.length === 0) return;

    setActionLoading(true);
    try {
      const assigneeIds = selectedAssignees.map(a => a.value);
      
      // Update task assignees
      await axiosInstance.post(`/tasks/${selectedTask.id}/update/`, {
        assignees: assigneeIds
      });

      // Add comment about reassignment
      const assigneeNames = selectedAssignees.map(a => a.label).join(', ');
      const reassignMessage = `Task has been reassigned to: ${assigneeNames}`;
      await axiosInstance.post('/comments/', {
        model: 'task',
        object_id: selectedTask.id,
        content: reassignMessage
      });

      // Refresh data
      await fetchData();
      await fetchTaskTimeline(selectedTask.id);
      
      // Update selected task state
      const updatedAssignees = selectedAssignees.map(a => {
        const userObj = users.find(u => u.id === a.value);
        return {
          id: a.value,
          first_name: userObj?.first_name || '',
          last_name: userObj?.last_name || '',
          email: userObj?.email || a.label
        };
      });
      setSelectedTask({
        ...selectedTask,
        assignees: updatedAssignees
      });

      setShowReassignModal(false);
      setSelectedAssignees([]);
      alert('Task successfully reassigned!');
    } catch (err) {
      handleApiError(err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusStyling = (status) => {
    const statusMap = {
      'completed': { backgroundColor: '#E7FEF8', color: '#40C4AA' },
      'in_progress': { backgroundColor: '#E0F2FE', color: '#1285FE' },
      'todo': { backgroundColor: '#FFF6E0', color: '#FFBD4C' },
      'blocked': { backgroundColor: '#FEEFF2', color: '#DF1C41' },
    };
    return statusMap[status?.name?.toLowerCase()] || { backgroundColor: '#EEEFF2', color: '#666D80' };
  };

  const getPriorityColor = (priority) => {
    const priorityMap = {
      'high': '#DF1C41',
      'medium': '#FFBD4C',
      'low': '#40C4AA',
    };
    return priorityMap[priority?.name?.toLowerCase()] || '#666D80';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    const timeStr = date.toLocaleString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });
    
    if (isToday) {
      return `Today, ${timeStr}`;
    }
    
    return date.toLocaleString('en-US', { 
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const getOverdueTime = (dueDate) => {
    if (!dueDate) return null;
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = now - due;
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffHours < 0) return null;
    if (diffHours < 24) return `${diffHours}hrs overdue`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d overdue`;
  };

  const getPriorityText = (priority) => {
    const priorityName = priority?.name || priority;
    if (!priorityName) return 'Medium';
    return priorityName.charAt(0).toUpperCase() + priorityName.slice(1);
  };

  if (loading) return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-gray-400"></div>
    </div>
  );

  const monthlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw} tasks`,
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: tasksReportData?.tasks_by_period ? 
          Math.max(...tasksReportData.tasks_by_period.map(item =>
            statusFilter === 'All Status' ? item.total : item[statusFilter] || 0
          )) + 100 : 100,
        ticks: {
          stepSize: 100
        }
      }
    }
  };

  const statsData = [
    {
      title: 'Tasks Completed',
      value: tasksReportData?.completion_rate?.completed || 0,
      icon: <UsersIcon className="text-white" size={20} />,
      borderColor: '#DFE1E6',
      bgColor: '#1285FE',
    },
    {
      title: 'Tasks Total',
      value: tasksReportData?.completion_rate?.total || 0,
      icon: <PhoneCallIcon className="text-white" size={20} />,
      borderColor: '#DFE1E6',
      bgColor: '#3EBF0F',
    },
    {
      title: 'Completion Rate',
      value: `${tasksReportData?.completion_rate?.rate || 0}%`,
      icon: <MessageSquareIcon className="text-white" size={20} />,
      borderColor: '#DFE1E6',
      bgColor: '#FF7043',
    },
  ];

  const agentOptions = users.map((u) => ({
    value: u.id,
    label: u.email,
  }));

  return (
    <>
      <div className="mt-6">
        <div className="body-theme w-full rounded-lg border border-[#DFE1E6] shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium">Tasks</h3>
            <div className="flex gap-4">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-[#0D0D12] text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="h-[300px] w-[800px]">
              {monthlyChartData && (
                <Bar data={monthlyChartData} options={monthlyChartOptions} />
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="gap-5 mt-5 flex flex-wrap border border-[#DFE1E6] body-theme rounded-[16px] p-5">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Tasks List */}
      <div className="w-full border rounded-[16px] border-gray-300 dark:border-gray-700 p-4 mt-6 overflow-auto body-theme">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Tasks</h3>
          <span className="text-sm text-gray-500">
            Showing {tasksList.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0} - {Math.min(currentPage * pageSize, totalCount)} of {totalCount} tasks
          </span>
        </div>
        
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-300 bg-[#F8F9FB] dark:bg-gray-800 rounded-lg overflow-hidden">
              <th className="py-2 px-3 rounded-tl-lg">ID</th>  
              <th className="py-2 px-3">Task</th>
              <th className="py-2 px-3">Assignee</th>
              <th className="py-2 px-3">Priority</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3 rounded-tr-lg">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasksList.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  No tasks found
                </td>
              </tr>
            ) : (
              tasksList.map((task, index) => (
                <tr
                  key={task.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => handleTaskClick(task)}
                >
                  <td className="py-2 px-3">
                    <div className="font-medium">#{task.id}</div>
                  </td>  
                  <td className="py-2 px-3">
                    <div className="font-medium">{task.title}</div>
                    {task.description && (
                      <div className="text-xs text-gray-500 truncate max-w-[300px]">
                        {task.description}
                      </div>
                    )}
                  </td>

                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      {task.assignees && task.assignees.length > 0 ? (
                        <>
                          <UserAvatar
                            name={task.assignees[0].first_name + ' ' + task.assignees[0].last_name}
                            className="w-8 h-8 rounded-full flex-shrink-0"
                          />
                          <span className="text-sm">
                            {task.assignees[0].first_name} {task.assignees[0].last_name}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-400 text-sm">Unassigned</span>
                      )}
                    </div>
                  </td>

                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                      />
                      <span className="capitalize text-sm">{task.priority?.label || task.priority?.name}</span>
                    </div>
                  </td>

                  <td className="py-2 px-3 text-xs font-medium">
                    <span
                      className="px-2 py-1 rounded-md inline-block capitalize"
                      style={getStatusStyling(task.status)}
                    >
                      {task.status?.label || task.status?.name}
                    </span>
                  </td>

                  <td className="py-2 px-3 text-sm">
                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {tasksList.length > 0 && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSize={pageSize}
            />
          </div>
        )}
      </div>

      {/* Task Detail Modal - System Reminder Style */}
      {selectedTask && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeTaskDetails}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Blue Header Bar */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={closeTaskDetails}
                  className="hover:bg-white/10 rounded-full p-1 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <h2 className="text-lg font-semibold">System Tracker</h2>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Escalation Badges */}
              <div className="flex gap-3 mb-4">
                {selectedTask?.is_escalated && (
                  <span className="px-3 py-1.5 bg-[#FEE9EC] text-[#DC2626] text-sm font-semibold rounded-md">
                    Task Escalated
                  </span>
                )}
                {(selectedTask.priority?.name === 'high' || selectedTask.priority?.label === 'high') && (
                  <span className="px-3 py-1.5 bg-white border-2 border-gray-300 text-gray-900 text-sm font-semibold rounded-md">
                    High Priority
                  </span>
                )}
              </div>

              {/* Alert Message */}
              {(selectedTask?.is_escalated || isOverdue(selectedTask.due_date)) && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">Task requires immediate attention</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    The following task has not been actioned after multiple reminders. 
                    Team Lead intervention may be needed to ensure completion or identify blockers.
                  </p>
                </div>
              )}

              {/* Task Details Card */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{selectedTask.title}</h4>
                    {selectedTask.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTask.description}</p>
                    )}
                  </div>
                  {isOverdue(selectedTask.due_date) && (
                    <span className="px-3 py-1 bg-[#DC2626] text-white text-sm font-semibold rounded-full whitespace-nowrap ml-3">
                      {getOverdueTime(selectedTask.due_date)}
                    </span>
                  )}
                </div>

                {/* Task Info Grid */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Assigned To:</span>
                    <span className="font-medium">
                      {selectedTask.assignees && selectedTask.assignees.length > 0
                        ? `${selectedTask.assignees[0].first_name} ${selectedTask.assignees[0].last_name}`
                        : 'Unassigned'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                    <span className="font-medium text-[#DC2626] capitalize">{getPriorityText(selectedTask.priority)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Original Due:</span>
                    <span className="font-medium">
                      {selectedTask.due_date ? formatDateTime(selectedTask.due_date) : 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Assigned By:</span>
                    <span className="font-medium">
                      {selectedTask.created_by 
                        ? `${selectedTask.created_by.first_name} ${selectedTask.created_by.last_name}` 
                        : 'System'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Activity Status Timeline */}
              {timelineLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
                </div>
              ) : taskTimeline?.timeline ? (
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-4">Activity Status</h3>
                  
                  <div className="space-y-4">
                    {taskTimeline.timeline.map((item, index) => {
                      const isLastItem = index === taskTimeline.timeline.length - 1;
                      
                      // Determine icon and styling based on activity type
                      let icon, iconBg, iconColor, activityTitle;
                      const desc = item.description?.toLowerCase() || '';
                      const type = item.type?.toLowerCase() || '';
                      
                      if (type === 'comment') {
                        icon = <MessageSquareDashed className="w-5 h-5" />;
                        iconBg = 'bg-green-100 dark:bg-green-900';
                        iconColor = 'text-green-600 dark:text-green-400';
                        activityTitle = 'Comment Added';
                      } else if (desc.includes('message') || desc.includes('viewed')) {
                        icon = <MessageSquareIcon className="w-5 h-5" />;
                        iconBg = 'bg-green-100 dark:bg-green-900';
                        iconColor = 'text-green-600 dark:text-green-400';
                        activityTitle = 'Message Opened';
                      } else if (desc.includes('assigned')) {
                        icon = <CheckCircle2 className="w-5 h-5" />;
                        iconBg = 'bg-gray-100 dark:bg-gray-800';
                        iconColor = 'text-gray-600 dark:text-gray-400';
                        activityTitle = 'Task Assigned';
                      } else if (desc.includes('reminder')) {
                        icon = <Clock className="w-5 h-5" />;
                        iconBg = 'bg-gray-100 dark:bg-gray-800';
                        iconColor = 'text-gray-600 dark:text-gray-400';
                        activityTitle = 'Reminder Sent';
                      } else if (desc.includes('no action')) {
                        icon = (
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        );
                        iconBg = 'bg-red-100 dark:bg-red-900';
                        iconColor = 'text-red-600 dark:text-red-400';
                        activityTitle = 'No Action Taken';
                      } else if (type === 'creation') {
                        icon = <CheckCircle2 className="w-5 h-5" />;
                        iconBg = 'bg-gray-100 dark:bg-gray-800';
                        iconColor = 'text-gray-600 dark:text-gray-400';
                        activityTitle = 'Task Created';
                      } else {
                        icon = <Clock className="w-5 h-5" />;
                        iconBg = 'bg-blue-100 dark:bg-blue-900';
                        iconColor = 'text-blue-600 dark:text-blue-400';
                        activityTitle = item.description || 'Activity';
                      }

                      return (
                        <div key={item.id || index} className="flex gap-3">
                          {/* Timeline Icon with connecting line */}
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} ${iconColor}`}>
                              {icon}
                            </div>
                            {!isLastItem && (
                              <div className="w-0.5 flex-1 min-h-[40px] bg-gray-300 dark:bg-gray-700" />
                            )}
                          </div>

                          {/* Timeline Content */}
                          <div className="flex-1 pb-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-semibold">{activityTitle}</h4>
                              <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
                                {formatDateTime(item.timestamp || item.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {item.content || item.description || 
                                (type === 'creation' ? 'Task created' : 'Activity recorded')}
                            </p>
                            {item.user && (
                              <p className="text-xs text-gray-500 mt-1">
                                {item.user.first_name} {item.user.last_name}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No activity history available
                </div>
              )}

              {/* Team Lead Actions */}
              {!showReassignModal ? (
                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-3">Team Lead Actions</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={handleNudge}
                      disabled={actionLoading}
                      className="flex-1 px-4 py-3 bg-[#D4EDDA] text-[#155724] font-semibold rounded-lg hover:bg-[#C3E6CB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? 'Processing...' : 'Nudge'}
                    </button>
                    <button
                      onClick={handleTakeover}
                      disabled={actionLoading}
                      className="flex-1 px-4 py-3 bg-[#D1ECF1] text-[#0C5460] font-semibold rounded-lg hover:bg-[#BEE5EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? 'Processing...' : 'Take over'}
                    </button>
                    <button
                      onClick={handleReassignClick}
                      disabled={actionLoading}
                      className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Reassign
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-3">Reassign Task</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Select Assignees</label>
                    <Select
                      isMulti
                      options={agentOptions}
                      value={selectedAssignees}
                      onChange={setSelectedAssignees}
                      styles={selectStyles}
                      placeholder="Select assignees..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowReassignModal(false);
                        setSelectedAssignees([]);
                      }}
                      disabled={actionLoading}
                      className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReassignSubmit}
                      disabled={actionLoading || selectedAssignees.length === 0}
                      className="flex-1 px-4 py-3 bg-[#3EBF0F] text-white font-semibold rounded-lg hover:bg-[#36A50D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? 'Processing...' : 'Confirm Reassign'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TasksReport;