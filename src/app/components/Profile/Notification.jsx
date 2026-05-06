import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';


const Notification = () => {
  const { axiosInstance, loading } = useApi();
  const { handleApiError } = useError();
  const [preferences, setPreferences] = useState({
    email: {
      enabled: false,
      types: {
        lead: true,
        task: true,
        system: true,
        message: true,
        customer: false
      }
    },
    in_app: {
      enabled: false,
      types: {
        lead: true,
        task: true,
        system: true,
        message: true,
        customer: false
      }
    }
  });

  useEffect(() => {
    fetchNotificationPreferences();
  }, []);

  const fetchNotificationPreferences = async () => {
    try {
      const response = await axiosInstance.get('/users/notification-preferences/');
      if (response.data.success) {
        setPreferences(response.data.preferences);
      }
    } catch (error) {
      handleApiError(error);
    }
  };
  
  const updatePreferences = async (newPreferences) => {
    try {
      const payload = {
        in_app: newPreferences.in_app.enabled,
        email: newPreferences.email.enabled,
        notification_types: {
          task: newPreferences.in_app.types.task,
          message: newPreferences.in_app.types.message,
          customer: newPreferences.in_app.types.customer,
          lead: newPreferences.in_app.types.lead,
          system: newPreferences.in_app.types.system
        }
      };

      const response = await axiosInstance.put('/users/notification-preferences/', payload);
      
      if (response.data.success) {
        toast.success('Notification preferences updated successfully');
        setPreferences(newPreferences);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDesktopToggle = () => {
    const newPreferences = {
      ...preferences,
      in_app: {
        ...preferences.in_app,
        enabled: !preferences.in_app.enabled
      }
    };
    updatePreferences(newPreferences);
  };

  const handleEmailToggle = () => {
    const newPreferences = {
      ...preferences,
      email: {
        ...preferences.email,
        enabled: !preferences.email.enabled
      }
    };
    updatePreferences(newPreferences);
  };

  return (
    <div className="flex mt-5 flex-col p-4 sm:p-6 items-start gap-4 self-stretch rounded-lg border border-[#DFE1E6]">
      <p className="text-xl font-semibold leading-[140%] tracking-[0.2px]">
        In-App Notifications
      </p>

      <div className="flex h-[1px] items-center gap-2 self-stretch bg-[#DFE1E6]" />

      <div className="w-full">
        <p className="text-xl font-semibold">
          Desktop Push Notifications
        </p>

        <div className="flex justify-between items-start gap-3 w-full mt-2">
          <p className="font-[500] text-[14px] font-normal leading-[21px] tracking-[0.2px] flex-1 min-w-0">
            Receive push notifications on tasks, comments, messages on your desktop app
          </p>

          <div
            className={`w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
              preferences.in_app.enabled ? "bg-[#3EBF0F]" : "bg-gray-300"
            }`}
            onClick={handleDesktopToggle}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full transition-transform ${
                preferences.in_app.enabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </div>
      </div>

      <div className="w-full mt-2">
        <p className="text-xl font-semibold">
          Email Notifications
        </p>

        <div className="flex justify-between items-start gap-3 w-full mt-2">
          <p className="font-[500] text-[14px] font-normal leading-[21px] tracking-[0.2px] flex-1 min-w-0">
            Receive email notifications about your activity
          </p>

          <div
            className={`w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
              preferences.email.enabled ? "bg-[#3EBF0F]" : "bg-gray-300"
            }`}
            onClick={handleEmailToggle}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full transition-transform ${
                preferences.email.enabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
