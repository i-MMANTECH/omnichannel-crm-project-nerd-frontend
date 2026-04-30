'use client';

import React from 'react';
import NotificationModal from './NotificationModal';
import { useNotification } from '@/context/NotificationContext';


const NotificationModalContainer = () => {
  const { isNotificationVisible, toggleNotification } = useNotification();

  if (!isNotificationVisible) return null;

  return (
    <>
      {isNotificationVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-5 z-[9998]" onClick={toggleNotification} />
      )}
      <div className="fixed top-0 right-0 h-full flex items-start justify-end z-[9999] pt-20 pr-8">
        <div className="relative">
          <div className="transform transition-transform duration-300 ease-in-out">
            <NotificationModal />
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationModalContainer;