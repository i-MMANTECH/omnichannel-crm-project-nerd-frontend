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
      <div className="fixed top-0 right-0 left-0 sm:left-auto h-full flex items-start justify-center sm:justify-end z-[9999] pt-16 sm:pt-20 px-2 sm:pl-0 sm:pr-8 pointer-events-none">
        <div className="relative pointer-events-auto w-full sm:w-auto max-w-md sm:max-w-none">
          <div className="transform transition-transform duration-300 ease-in-out">
            <NotificationModal />
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationModalContainer;