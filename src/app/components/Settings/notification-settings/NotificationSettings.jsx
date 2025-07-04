import React, { useState, useEffect } from 'react';
import GeneralSettings from './GeneralSettings';
import EscalationSettings from './EscalationSettings';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';

const NotificationSettings = () => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [activeTab, setActiveTab] = useState('escalation');
  const [loading, setLoading] = useState(false);

  const [pushNotifications, setPushNotifications] = useState(true);
  const [responseTimeLimit, setResponseTimeLimit] = useState(true);
  const [channelNotifications, setChannelNotifications] = useState({
    slack: true,
    chat: false,
    whatsapp: true
  });

  const [workingDaysToggle, setWorkingDaysToggle] = useState({
    Monday: { isWorking: true, time: '8h 00m' },
    Tuesday: { isWorking: true, time: '8h 00m' },
    Wednesday: { isWorking: true, time: '8h 00m' },
    Thursday: { isWorking: true, time: '8h 00m' },
    Friday: { isWorking: true, time: '8h 00m' },
    Saturday: { isWorking: false, time: '8h 00m' },
    Sunday: { isWorking: false, time: '8h 00m' }
  });

  const [escalationSettings, setEscalationSettings] = useState({
    escalation_enabled: true,
    escalation_email_enabled: true,
    escalation_websocket_enabled: true,
    escalation_threshold_minutes: 5
  });

  const [tempThresholdMinutes, setTempThresholdMinutes] = useState(5);
  const [escalationLevels, setEscalationLevels] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchEscalationSettings();
    fetchEscalationLevels();
    fetchUsers();
  }, []);

  const fetchEscalationSettings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/companies/escalation-settings/`);
      const data = response.data.data;
      setEscalationSettings(data);
      setTempThresholdMinutes(data.escalation_threshold_minutes);
    } catch (err) {
        handleApiError(err)
    } finally {
      setLoading(false);
    }
  };

  const fetchEscalationLevels = async () => {
    try {
      const response = await axiosInstance.get('/companies/escalation-levels/');
      const data = response.data.data || [];
      setEscalationLevels(data);
    } catch (err) {
      handleApiError(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/users/');
      const data = response.data.results || [];
      setUsers(data);
    } catch (err) {
      handleApiError(err);
    }
  };

  const updateEscalationSettings = async (updatedSettings) => {
    try {
      setLoading(true);
      const response = await axiosInstance.patch(`/companies/escalation-settings/`, updatedSettings);
      const data = response.data.data;
      setEscalationSettings(data);
      return data;
    } catch (err) {
        handleApiError(err)
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createEscalationLevel = async (levelData) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/companies/escalation-levels/', levelData);
      const newLevel = response.data.data;
      setEscalationLevels(prev => [...prev, newLevel]);
      return newLevel;
    } catch (err) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEscalationLevel = async (levelId, levelData) => {
    try {
      setLoading(true);
      const response = await axiosInstance.patch(`/companies/escalation-levels/${levelId}/`, levelData);
      const updatedLevel = response.data.data;
      setEscalationLevels(prev => 
        prev.map(level => level.id === levelId ? updatedLevel : level)
      );
      return updatedLevel;
    } catch (err) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEscalationLevel = async (levelId) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/companies/escalation-levels/${levelId}/`);
      setEscalationLevels(prev => prev.filter(level => level.id !== levelId));
    } catch (err) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ id, children, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
        isActive
          ? 'border-[#3EBF0F] text-[#3EBF0F] dark:text-[#3EBF0F]'
          : 'border-transparent text-gray-700 dark:text-gray-300 hover:text-[#3EBF0F] hover:border-gray-300'
      }`}
    >
      {children}
    </button>
  );

  const toggleDay = (day) => {
    setWorkingDaysToggle((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isWorking: !prev[day].isWorking,
      },
    }));
  };

  const handleTimeChange = (day, value) => {
    setWorkingDaysToggle((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        time: value,
      },
    }));
  };

  const handleChannelToggle = (channel) => {
    setChannelNotifications((prev) => ({
      ...prev,
      [channel]: !prev[channel]
    }));
  };

  const handleEscalationToggle = async (setting) => {
    const updatedSettings = {
      ...escalationSettings,
      [setting]: !escalationSettings[setting]
    };

    try {
      await updateEscalationSettings(updatedSettings);
    } catch (err) {
      handleApiError(err)
    }
  };

  const handleThresholdMinutesChange = (value) => {
    setTempThresholdMinutes(value);
  };

  const saveThresholdMinutes = async () => {
    const updatedSettings = {
      ...escalationSettings,
      escalation_threshold_minutes: parseInt(tempThresholdMinutes)
    };

    try {
      await updateEscalationSettings(updatedSettings);
    } catch (err) {
        setTempThresholdMinutes(escalationSettings.escalation_threshold_minutes);
        handleApiError(err)
    }
  };


  return (
    <div className="ms-10 mt-6">
      <div className="flex gap-0 mb-8">
        {/* <TabButton
          id="general"
          isActive={activeTab === 'general'}
          onClick={setActiveTab}
        >
          General Settings
        </TabButton> */}
        <TabButton
          id="escalation"
          isActive={activeTab === 'escalation'}
          onClick={setActiveTab}
        >
          Escalation Settings
        </TabButton>
      </div>

      {/* {activeTab === 'general' && (
        <GeneralSettings
          pushNotifications={pushNotifications}
          setPushNotifications={setPushNotifications}
          responseTimeLimit={responseTimeLimit}
          setResponseTimeLimit={setResponseTimeLimit}
          workingDaysToggle={workingDaysToggle}
          toggleDay={toggleDay}
          handleTimeChange={handleTimeChange}
          channelNotifications={channelNotifications}
          handleChannelToggle={handleChannelToggle}
        />
      )} */}
      
      {activeTab === 'escalation' && (
        <EscalationSettings
          escalationSettings={escalationSettings}
          handleEscalationToggle={handleEscalationToggle}
          tempThresholdMinutes={tempThresholdMinutes}
          handleThresholdMinutesChange={handleThresholdMinutesChange}
          saveThresholdMinutes={saveThresholdMinutes}
          loading={loading}
          escalationLevels={escalationLevels}
          users={users}
          onCreateLevel={createEscalationLevel}
          onUpdateLevel={updateEscalationLevel}
          onDeleteLevel={deleteEscalationLevel}
        />
      )}
    </div>
  );
};

export default NotificationSettings;