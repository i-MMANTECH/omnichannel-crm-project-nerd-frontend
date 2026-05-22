'use client';

import React, { useState, useEffect } from "react";
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';
import moment from 'moment';
import UserAvatar from "../UserAvatar";
import Image from "next/image";
import { useNotification } from '@/context/NotificationContext';
import { usePortalRouter } from '@/context/usePortalRouter';

const NotificationModal = () => {
  const { axiosInstance, loading } = useApi();
  const { handleApiError } = useError();
  const [notifications, setNotifications] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replies, setReplies] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const { toggleNotification } = useNotification();
  const { navigateTo } = usePortalRouter();

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get('/notifications', { showLoader: false });
      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unread_count);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleReplyChange = (id, value) => {
    setReplies((prev) => ({ ...prev, [id]: value }));
  };

  const handleReplySubmit = (id) => {
    console.log(`Reply to notification ${id}:`, replies[id]);
    setReplyingTo(null);
  };

  const markNotificationAsRead = async (id) => {
    try {
      await axiosInstance.post(`/notifications/mark-read/${id}/`);
    } catch (error) {
      console.log('Error marking notification as read:', error);
    }
  };

  const getNotificationMessage = (notification) => {
    const { notification_type, metadata, description } = notification;
    
    switch (notification_type) {
      case 'task':
        if (metadata.action === 'task_updated') {
          return `Task status changed from ${metadata.old_status} to ${metadata.new_status}`;
        }
        return description;
      default:
        return description;
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.is_read) {
        // Just call markNotificationAsRead once
        await markNotificationAsRead(notification.id);
      }

      // Close notification using context
      toggleNotification();

      // Then redirect if it's a task or follow-up
      if (notification.notification_type === 'task' && notification.metadata?.task_id) {
        const params = new URLSearchParams();
        params.set('action', 'view-task');
        params.set('taskId', notification.metadata.task_id);
        navigateTo(`tasks?${params.toString()}`);
      } else if (notification.notification_type === 'follow_up' && notification.metadata?.conversation_id) {
        const tab = notification.metadata.conversation_type || 'leads';
        navigateTo(`messages?chat=${tab}&id=${notification.metadata.conversation_id}`);
      } else if (notification.notification_type === 'escalation' && notification.metadata?.conversation_id) {
        const tab = notification.metadata.conversation_type || 'leads';
        navigateTo(`messages?chat=${tab}&id=${notification.metadata.conversation_id}`);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  if (loading) {
    return (
      <div className="w-full sm:w-[350px] max-w-lg body-theme rounded-lg border border-gray-200 shadow-lg p-4">
        <div className="animate-pulse">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-7 mt-2"></div>
            <div className="rounded-full bg-gray-200 h-6 w-6"></div>
          </div>
          <div className="space-y-5">
            {[...Array(6)].map((i) => (
              <div key={i} className="flex gap-3 py-1">
                <div className="rounded-full bg-gray-200 h-8 w-8"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-2/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full sm:w-[350px] max-w-lg body-theme rounded-lg border border-gray-200 shadow-lg transition-all duration-300 ease-in-out">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Notifications</h2>
        {unreadCount > 0 && (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>
      <div className="overflow-y-auto scrollable-area overscroll-contain" style={{ maxHeight: '480px' }}>
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications yet
          </div>
        ) : (
          notifications.slice(0, 10).map((notification) => (
            <div
              key={notification.id}
              className="pointer flex gap-3 py-6 border-b border-gray-200 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer body-theme"
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex-shrink-0">
                {notification?.receiver?.image && <Image
                  alt="profile pic"
                  width={40}
                  height={40}
                  className="rounded-full w-8 h-8"
                  src={notification?.receiver?.image}
                />}
                {!notification?.receiver?.image && (
                  <UserAvatar
                    name={notification?.receiver?.first_name ?
                      `${notification.receiver.first_name} ${notification.receiver.last_name}` :
                      notification?.receiver?.email || '--'}
                    width="w-8"
                    height="h-8"
                  />
                )}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <p className="text-sm truncate">
                  <span className="font-semibold">
                    {notification.receiver.first_name} {notification.receiver.last_name}
                  </span>{" "}
                </p>
                {notification.title && (
                  <p className="text-sm text-purple-600 mt-1 break-words">
                    {notification.title}
                  </p>
                )}
                <p className="text-sm break-words">
                  {getNotificationMessage(notification)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {moment(notification.created_at).fromNow()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      {notifications.length > 10 && (
        <div className="p-3 border-t border-gray-200 text-center">
          <button
            onClick={() => { toggleNotification(); navigateTo('notifications'); }}
            className="text-sm text-blue-500 hover:text-blue-700 font-medium"
          >
            See all {notifications.length} notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationModal;