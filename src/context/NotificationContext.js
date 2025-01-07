'use client';

import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleNotification = () => {
    setIsNotificationVisible(prev => !prev);
  };

  return (
    <NotificationContext.Provider value={{ 
      isNotificationVisible, 
      toggleNotification,
      unreadCount,
      setUnreadCount 
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}