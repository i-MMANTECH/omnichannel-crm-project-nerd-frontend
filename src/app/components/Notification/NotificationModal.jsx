'use client';

import React, { useState, useEffect } from "react";
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';
import moment from 'moment';
import UserAvatar from "../UserAvatar";
import Image from "next/image";

const NotificationModal = () => {
  const { axiosInstance, loading } = useApi();
  const { handleApiError } = useError();
  const [notifications, setNotifications] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replies, setReplies] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get('/notifications');
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

  const toggleReadStatus = async (id) => {
    try {
      const response = await axiosInstance.patch(`/notifications/${id}/`, {
        is_read: true
      });
      
      if (response.data.success) {
        setNotifications(prevNotifications =>
          prevNotifications.map(notification =>
            notification.id === id
              ? { ...notification, is_read: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      handleApiError(error);
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

  if (loading) {
    return (
      <div className="w-[350px] max-w-lg body-theme rounded-lg border border-gray-200 shadow-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[350px] max-w-lg body-theme rounded-lg border border-gray-200 shadow-lg transition-all duration-300 ease-in-out">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Notifications</h2>
        {unreadCount > 0 && (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>
      <div className="max-h-[calc(100vh-160px)] overflow-y-auto scrollable-area">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex gap-3 py-6 border-b border-gray-200 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                notification.is_read ? "body-theme" : "body-theme"
              }`}
              onClick={() => !notification.is_read && toggleReadStatus(notification.id)}
            >
              <div className="flex-shrink-0">
                {notification?.receiver?.image && <Image 
                  alt="profile pic"
                  width={40}
                  height={40}
                  className="rounded-full w-8 h-8" 
                  src={notification?.receiver?.image} 
                />}
                {!notification?.receiver?.image && <UserAvatar name={notification?.receiver?.first_name ? `${notification?.receiver.first_name} ${notification?.receiver.last_name}`: '--'} width="w-8" height="h-8" />}
              </div>
              <div className="flex flex-col">
                <p className="text-sm">
                  <span className="font-semibold">
                    {notification.receiver.first_name} {notification.receiver.last_name}
                  </span>{" "}
                </p>
                {notification.title && (
                  <p className="text-sm text-purple-600  mt-1">
                    {notification.title}
                  </p>
                )}
                <p className="text-sm">
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
    </div>
  );
};

export default NotificationModal;