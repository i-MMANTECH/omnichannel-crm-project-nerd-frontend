// context/NotificationContext.js
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';
import { useAuth } from '@/context/AuthContext';

const NotificationContext = createContext();

let notificationSound;

if (typeof window !== 'undefined') {
  notificationSound = new Audio('https://core-staging.nativetalkcrm.com/static/notifications/sounds/notification.mp3');
}

export function NotificationProvider({ children }) {
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

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
    const initializeWebSocket = () => {
      if (user?.user_id) {
        const protocol = window.location.protocol === "https:" ? "wss" : "ws";
        const wsUrl = `${protocol}://ws-staging.nativetalkcrm.com/ws/notifications/?uuid=${user.user_id}`;

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('Notification WebSocket connected');
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          handleNewNotification(data);
        };

        ws.onerror = (error) => {
          console.error('Notification WebSocket error:', error);
        };

        ws.onclose = () => {
          console.log('Notification WebSocket disconnected');

          // Attempt to reconnect after a delay
          setTimeout(() => {
            if (user?.user_id) {
              initializeWebSocket();
            }
          }, 3000);
        };

        setSocket(ws);

        return () => {
          if (ws) {
            ws.close();
          }
        };
      }
    }

    initializeWebSocket()
  }, [user?.user_id]);

  const handleNewNotification = (data) => {
    // Play notification sound
    console.log('new noti ', data)
    notificationSound.play().catch(error => console.log('Error playing sound:', error));

    // Update notifications list
    setNotifications(prev => [data, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show toast notification
    toast(
      <div className="flex items-start">
        <div className="flex-1">
          <p className="font-semibold">{data.title}</p>
          <p className="text-sm">{data.description}</p>
        </div>
      </div>,
      {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'notification-toast',
        onClick: () => setIsNotificationVisible(true)
      }
    );
  };

  const toggleNotification = () => {
    setIsNotificationVisible(prev => !prev);
  };

  const markAsRead = async (notificationId) => {
    try {
      await axiosInstance.patch(`/notifications/${notificationId}/`, {
        is_read: true
      });
      
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      handleApiError(error);
    }
  };

  const value = {
    isNotificationVisible,
    toggleNotification,
    notifications,
    unreadCount,
    markAsRead,
    fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}