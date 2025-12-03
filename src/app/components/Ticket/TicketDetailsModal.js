import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import UserAvatar from '../UserAvatar';
import Image from 'next/image';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';
import { timeAgo } from '@/utils/timeUtils';

const TicketDetailsModal = ({ isOpen, onClose, ticketId, onUpdate }) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [selectedTab, setSelectedTab] = useState('details');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (isOpen && ticketId) {
      fetchTicket();
    }
  }, [ticketId, isOpen]);

  useEffect(() => {
    if (isOpen && ticketId && selectedTab === 'comments') {
      fetchComments();
    }
  }, [isOpen, ticketId, selectedTab]);

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
      // Comments endpoint might not be implemented yet
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

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'details':
        return (
          <div className="space-y-4 mt-6">
            {/* Description */}
            {ticket.description && (
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
              </div>
            )}

            <div className="space-y-3 mt-6">
              {/* Status */}
              <div className="flex justify-between items-center py-1">
                <div className="flex items-center gap-2">
                  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12.0002V14.6668M5.17161 10.8286L3.286 12.7142M4 8.00016H1.33333M12 8.00016H14.6667M10.8285 10.8286L12.7141 12.7142M8 4.00016V1.3335M10.8285 5.17174L12.7141 3.28612M5.17161 5.17174L3.286 3.28612" stroke="#808897" strokeLinecap="round" />
                  </svg>
                  <span className="font-medium">Status</span>
                </div>
                <span className={`px-2 py-1 rounded text-sm font-medium ${ticket.status?.name === 'open' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                    ticket.status?.name === 'in_progress' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                      ticket.status?.name === 'resolved' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400'
                  }`}>
                  {ticket.status?.label || 'Open'}
                </span>
              </div>

              {/* Priority */}
              <div className="flex justify-between items-center py-1">
                <div className="flex items-center gap-2">
                  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.33333 2.5H3.33333C2.59695 2.5 2 3.09695 2 3.83333V5.83333C2 6.56971 2.59695 7.16667 3.33333 7.16667H5.33333C6.06971 7.16667 6.66667 6.56971 6.66667 5.83333V3.83333C6.66667 3.09695 6.06971 2.5 5.33333 2.5Z" stroke="#808897" strokeWidth="1.5" />
                    <path d="M12.6667 2.5H10.6667C9.93029 2.5 9.33333 3.09695 9.33333 3.83333V5.83333C9.33333 6.56971 9.93029 7.16667 10.6667 7.16667H12.6667C13.403 7.16667 14 6.56971 14 5.83333V3.83333C14 3.09695 13.403 2.5 12.6667 2.5Z" stroke="#808897" strokeWidth="1.5" />
                    <path d="M5.33333 9.83333H3.33333C2.59695 9.83333 2 10.4303 2 11.1667V13.1667C2 13.903 2.59695 14.5 3.33333 14.5H5.33333C6.06971 14.5 6.66667 13.903 6.66667 13.1667V11.1667C6.66667 10.4303 6.06971 9.83333 5.33333 9.83333Z" stroke="#808897" strokeWidth="1.5" />
                    <path d="M12.6667 9.83333H10.6667C9.93029 9.83333 9.33333 10.4303 9.33333 11.1667V13.1667C9.33333 13.903 9.93029 14.5 10.6667 14.5H12.6667C13.403 14.5 14 13.903 14 13.1667V11.1667C14 10.4303 13.403 9.83333 12.6667 9.83333Z" stroke="#808897" strokeWidth="1.5" />
                  </svg>
                  <span className="font-medium">Priority</span>
                </div>
                <span className={`px-2 py-1 rounded text-sm font-medium ${ticket.priority?.name === 'low' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                    ticket.priority?.name === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      ticket.priority?.name === 'high' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                        ticket.priority?.name === 'urgent' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-gray-100 text-gray-600'
                  }`}>
                  {ticket.priority?.label || 'Low'}
                </span>
              </div>

              {/* Category */}
              {ticket.category && (
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.33333 2.5H3.33333C2.59695 2.5 2 3.09695 2 3.83333V5.83333C2 6.56971 2.59695 7.16667 3.33333 7.16667H5.33333C6.06971 7.16667 6.66667 6.56971 6.66667 5.83333V3.83333C6.66667 3.09695 6.06971 2.5 5.33333 2.5Z" stroke="#808897" strokeWidth="1.5" />
                      <path d="M12.6667 2.5H10.6667C9.93029 2.5 9.33333 3.09695 9.33333 3.83333V5.83333C9.33333 6.56971 9.93029 7.16667 10.6667 7.16667H12.6667C13.403 7.16667 14 6.56971 14 5.83333V3.83333C14 3.09695 13.403 2.5 12.6667 2.5Z" stroke="#808897" strokeWidth="1.5" />
                      <path d="M5.33333 9.83333H3.33333C2.59695 9.83333 2 10.4303 2 11.1667V13.1667C2 13.903 2.59695 14.5 3.33333 14.5H5.33333C6.06971 14.5 6.66667 13.903 6.66667 13.1667V11.1667C6.66667 10.4303 6.06971 9.83333 5.33333 9.83333Z" stroke="#808897" strokeWidth="1.5" />
                      <path d="M12.6667 9.83333H10.6667C9.93029 9.83333 9.33333 10.4303 9.33333 11.1667V13.1667C9.33333 13.903 9.93029 14.5 10.6667 14.5H12.6667C13.403 14.5 14 13.903 14 13.1667V11.1667C14 10.4303 13.403 9.83333 12.6667 9.83333Z" stroke="#808897" strokeWidth="1.5" />
                    </svg>
                    <span className="font-medium">Category</span>
                  </div>
                  <span>{ticket.category.label}</span>
                </div>
              )}

              {/* Assigned Agents */}
              {ticket.assignees && ticket.assignees.length > 0 && (
                <div className="flex flex-col items-start justify-between py-1">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.33325 9.33333H6.66659C4.82564 9.33333 3.33325 10.8257 3.33325 12.6667V13.3333C3.33325 13.7015 3.63173 14 3.99992 14H11.9999C12.3681 14 12.6666 13.7015 12.6666 13.3333V12.6667C12.6666 10.8257 11.1742 9.33333 9.33325 9.33333Z" stroke="#808897" strokeWidth="1.5" />
                      <path d="M7.99992 7.33333C9.47268 7.33333 10.6666 6.13943 10.6666 4.66667C10.6666 3.19391 9.47268 2 7.99992 2C6.52716 2 5.33325 3.19391 5.33325 4.66667C5.33325 6.13943 6.52716 7.33333 7.99992 7.33333Z" stroke="#808897" strokeWidth="1.5" />
                    </svg>
                    <span className="font-medium">Assigned Agents</span>
                  </div>
                  <div className="flex -space-x-2">
                    {ticket.assignees.map((assignee, index) => {
                      const assigneeName = getAssigneeName(assignee);
                      if (assignee?.image) {
                        return (
                          <div key={index} className='flex items-center py-1'>
                            <Image
                              alt={assigneeName}
                              className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800"
                              src={assignee.image}
                              width={28}
                              height={28}
                            />
                            <span className="ml-2">{assigneeName}</span>
                          </div>
                        );
                      } else {
                        return (
                          <div key={index} className='flex items-center py-1'>
                            <UserAvatar
                              className="border-white dark:border-gray-800 border-2"
                              name={assigneeName}
                              width="w-7"
                              height="h-7"
                            />
                            <span className="ml-2">{assigneeName}</span>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              )}

              {/* Customer */}
              {ticket.customer_name && (
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.33325 9.33333H6.66659C4.82564 9.33333 3.33325 10.8257 3.33325 12.6667V13.3333C3.33325 13.7015 3.63173 14 3.99992 14H11.9999C12.3681 14 12.6666 13.7015 12.6666 13.3333V12.6667C12.6666 10.8257 11.1742 9.33333 9.33325 9.33333Z" stroke="#808897" strokeWidth="1.5" />
                      <path d="M7.99992 7.33333C9.47268 7.33333 10.6666 6.13943 10.6666 4.66667C10.6666 3.19391 9.47268 2 7.99992 2C6.52716 2 5.33325 3.19391 5.33325 4.66667C5.33325 6.13943 6.52716 7.33333 7.99992 7.33333Z" stroke="#808897" strokeWidth="1.5" />
                    </svg>
                    <span className="font-medium">Customer</span>
                  </div>
                  <span>{ticket.customer_name}</span>
                </div>
              )}

              {/* Created Date */}
              <div className="flex justify-between items-center py-1">
                <div className="flex items-center gap-2">
                  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.33333 2.50016H4C2.89543 2.50016 2 3.39559 2 4.50016V6.50016M5.33333 2.50016V1.8335M5.33333 2.50016H10.6667M5.33333 2.50016V3.16683M10.6667 2.50016H12C13.1046 2.50016 14 3.39559 14 4.50016V6.50016M10.6667 2.50016V1.8335M10.6667 2.50016V3.16683M2 6.50016V13.1668C2 14.2714 2.89543 15.1668 4 15.1668H12C13.1046 15.1668 14 14.2714 14 13.1668V6.50016M2 6.50016H14" stroke="#808897" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-medium">Created</span>
                </div>
                <span className="text-sm">{formatDate(ticket.created_at)}</span>
              </div>

              {/* Updated Date */}
              <div className="flex justify-between items-center py-1">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 13.3332C10.9455 13.3332 13.3333 10.9454 13.3333 7.99984C13.3333 5.05432 10.9455 2.6665 8 2.6665C5.05448 2.6665 2.66666 5.05432 2.66666 7.99984C2.66666 10.9454 5.05448 13.3332 8 13.3332Z" stroke="#808897" strokeWidth="1.5" />
                    <path d="M8 5.33317V7.99984L9.33333 9.33317" stroke="#808897" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-medium">Last Updated</span>
                </div>
                <span className="text-sm">{formatDate(ticket.updated_at)}</span>
              </div>
            </div>
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
        if (onUpdate) onUpdate(); // Notify parent to refresh list
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
        if (onUpdate) onUpdate(); // Notify parent to refresh list
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
      title={`Ticket ${ticket.ticket_number}`}
      footer={footer}
      width="600px"
    >
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500"></div>
        </div>
      ) : (
        <div className="max-w-full">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {['details', 'comments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`mr-4 pb-2 capitalize ${selectedTab === tab
                    ? 'border-b-2 border-[#3EBF0F] text-[#3EBF0F] font-medium'
                    : 'text-gray-500'
                  }`}
              >
                {tab === 'comments' ? `Comments (${comments.length})` : tab}
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