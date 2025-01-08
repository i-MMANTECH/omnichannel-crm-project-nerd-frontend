import React, { useState } from 'react';

const Notification = () => {
  const [isDesktopNotificationEnabled, setIsDesktopNotificationEnabled] = useState(false);
  const [isEmailNotificationEnabled, setIsEmailNotificationEnabled] = useState(true);

  const handleDesktopToggle = () => {
    setIsDesktopNotificationEnabled(!isDesktopNotificationEnabled);
  };

  const handleEmailToggle = () => {
    setIsEmailNotificationEnabled(!isEmailNotificationEnabled);
  };

  return (
    <div className='flex mt-5 flex-col p-6 items-start gap-4 self-stretch rounded-lg border border-[#DFE1E6] '>
      <p className="text-xl font-semibold leading-[140%] tracking-[0.2px]">
        In-App Notifications
      </p>

      <div className="flex h-[1px] items-center gap-2 self-stretch bg-[#DFE1E6]" />

      <div className='w-full'>
        <p className="text-xl font-semibold ">
          Desktop Push Notifications
        </p>

        <div className="flex justify-between justify-between w-full mt-2">
          <p className="font-[500] text-[14px] font-normal leading-[21px] tracking-[0.2px]">
            Receive push notifications on tasks, comments, messages on your desktop app
          </p>

          <div
            className={`w-11 h-6 rounded-full transition-colors ${isDesktopNotificationEnabled ? "bg-[#3EBF0F]" : "bg-gray-300"}`}
            onClick={handleDesktopToggle}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full transition-transform ${isDesktopNotificationEnabled ? "translate-x-5" : "translate-x-0"}`}
            />
          </div>
        </div>
      </div>

      <div className='w-full mt-2'>
        <p className="text-xl font-semibold ">
          Email Notifications
        </p>

        <div className="flex justify-between justify-between w-full mt-2">
          <p className="font-[500] text-[14px] font-normal leading-[21px] tracking-[0.2px]">
            Receive email notifications about your activity
          </p>

          <div
            className={`w-11 h-6 rounded-full transition-colors ${isEmailNotificationEnabled ? "bg-[#3EBF0F]" : "bg-gray-300"}`}
            onClick={handleEmailToggle}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full transition-transform ${isEmailNotificationEnabled ? "translate-x-5" : "translate-x-0"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
