import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import React, { useEffect, useState } from 'react';
import Drawer from '../Drawer';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';

export default function WorkScheduleModal({ schedule, show, onClose }) {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const { id } = useParams()

  const [name, setName] = useState('');
  const [effectiveFrom, setEffectiveFrom] = useState('');
  const [scheduleType, setScheduleType] = useState('duration');
  const [duration, setDuration] = useState({ hours: '08', minutes: '00', seconds: '00' });
  const [totalWorkingTime, setTotalWorkingTime] = useState('00h 00m');

  const [workingDaysToggle, setWorkingDaysToggle] = useState({
    Monday: { isWorking: false, customDuration: { hours: '00', minutes: '00', seconds: '00' } },
    Tuesday: { isWorking: false, customDuration: { hours: '00', minutes: '00', seconds: '00' } },
    Wednesday: { isWorking: false, customDuration: { hours: '00', minutes: '00', seconds: '00' } },
    Thursday: { isWorking: false, customDuration: { hours: '00', minutes: '00', seconds: '00' } },
    Friday: { isWorking: false, customDuration: { hours: '00', minutes: '00', seconds: '00' } },
    Saturday: { isWorking: false, customDuration: { hours: '00', minutes: '00', seconds: '00' } },
    Sunday: { isWorking: false, customDuration: { hours: '00', minutes: '00', seconds: '00' } },
  });

  useEffect(() => {
    if (schedule) {
      setName(schedule.name);
      setEffectiveFrom(schedule.effective_from);
      setScheduleType(schedule.schedule_type);
      
      // Set standard duration
      if (schedule.standard_duration) {
        setDuration(parseDuration(schedule.standard_duration));
      }

      // Set working days
      const updatedWorkingDays = { ...workingDaysToggle };
      schedule.working_days.forEach(day => {
        const dayName = day.day.charAt(0).toUpperCase() + day.day.slice(1);
        updatedWorkingDays[dayName] = {
          isWorking: day.is_working,
          customDuration: day.custom_duration ? parseDuration(day.custom_duration) : parseDuration(schedule.standard_duration)
        };
      });
      setWorkingDaysToggle(updatedWorkingDays);
    }
  }, [schedule]);

  useEffect(() => {
    let totalMinutes = 0;
    const standardMinutes = convertDurationToMinutes(duration);

    Object.keys(workingDaysToggle).forEach((day) => {
      if (workingDaysToggle[day].isWorking) {
        const customMinutes = convertDurationToMinutes(workingDaysToggle[day].customDuration);
        totalMinutes += customMinutes || standardMinutes;
      }
    });

    setTotalWorkingTime(convertMinutesToTime(totalMinutes));
  }, [workingDaysToggle, duration]);

  const convertDurationToMinutes = ({ hours, minutes, seconds }) => {
    return parseInt(hours) * 60 + parseInt(minutes) + parseInt(seconds) / 60;
  };

  const convertMinutesToTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.round((totalMinutes % 1) * 60);
  
    return `${hours}h ${minutes}m ${seconds}s`;
  };
  
  const formatDuration = ({ hours, minutes, seconds }) => {
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  };
  
  const handleTimeChange = (e) => {
    setDuration((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const hoursOptions = Array.from({ length: 24 }, (_, i) => 
    `${i + 1}`.padStart(2, '0')
  );
  const minutesOptions = ['00', '15', '30', '45'];
  const secondsOptions = ['00', '15', '30', '45'];

  const parseDuration = (durationString) => {
    if (!durationString) return { hours: '00', minutes: '00', seconds: '00' };
    const [hours, minutes, seconds] = durationString.split(':');
    return {
      hours: hours.padStart(2, '0'),
      minutes: minutes.padStart(2, '0'),
      seconds: seconds.padStart(2, '0')
    };
  };

  const toggleDay = (day) => {
    setWorkingDaysToggle((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isWorking: !prev[day].isWorking,
        customDuration: !prev[day].isWorking
          ? { ...duration }
          : prev[day].customDuration,
      },
    }));
  };
  

  const handleCustomDurationChange = (day, type, value) => {
    setWorkingDaysToggle((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        customDuration: {
          ...prev[day].customDuration,
          [type]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const workingDays = Object.keys(workingDaysToggle).map((day) => ({
      day: day.toLowerCase(),
      is_working: workingDaysToggle[day].isWorking,
      custom_duration: formatDuration(workingDaysToggle[day].customDuration),
    }));
  
    if (!name || !effectiveFrom || !duration || !scheduleType || !workingDays) {
      toast.warning('All fields are required');
      return;
    }

    const payload = {
      user_id: id,
      name,
      schedule_type: scheduleType,
      effective_from: effectiveFrom,
      standard_duration: formatDuration(duration),
      working_days: workingDays
    };
  
    try {
      if (schedule) {
        await axiosInstance.put(`/work-management/work-schedules/${schedule.id}/`, payload);
        toast.success('Work schedule updated successfully');
      } else {
        await axiosInstance.post('/work-management/work-schedules/', payload);
        toast.success('New work schedule added successfully');
      }

      onClose();
    } catch (error) {
      handleApiError(error);
    }
  };  

  const Toggle = ({ isToggled, onToggle }) => {
    return (
      <div
        className={`mt-4 me-2 toggle-container ${isToggled ? "toggled" : "untoggled"}`}
        onClick={onToggle}
      >
        <div className={`toggle-circle ${isToggled ? "toggled-circle" : "untoggled-circle"}`} />
      </div>
    );
  };

  const footerContent = (
    <div className="flex justify-start gap-3">
      <button
        type="button"
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={onClose}
      >
        Cancel
      </button>
      <button
        type="submit"
        form="scheduleForm"
        onClick={handleSubmit}
        className="px-4 py-2 bg-[#3EBF0F] text-white rounded-lg hover:bg-green-600"
      >
        {schedule ? <span>Update</span> : <span>Create</span>}
      </button>
    </div>
  );

  return (
    <Drawer
      show={show}
      onClose={onClose}
      title="Add New Work Schedule"
      width="35%"
      footer={footerContent}
    >
      <form id="scheduleForm" onSubmit={handleSubmit} className="py-2">
        <div
              className="flex justify-center items-center z-50"
            >
              <div
                className="body-theme rounded-xl w-[90%] sm:w-[600px]">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold mb-2 block"
                >
                  Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Remote"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-[52px] p-4 rounded-[12px] border border-[#DFE1E6] body-theme shadow-md focus:border-[#3EBF0F] outline-none mb-4"
                />

                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label
                      htmlFor="effectiveFrom"
                      className="mb-2 block text-sm font-medium "
                    >
                      Effective From
                    </label>
                    <input
                      id="effectiveFrom"
                      type="date"
                      value={effectiveFrom}
                      onChange={(e) => setEffectiveFrom(e.target.value)}
                      className="w-full h-[52px] p-4 rounded-[12px] border border-[#DFE1E6] body-theme shadow-md focus:border-[#3EBF0F] outline-none"
                    />
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="workingHours"
                      className="mb-2 block text-sm font-medium "
                    >
                      Standard working hours/day
                    </label>
                    <div id='workingHours' className="flex items-center gap-2">
                      <select
                        name="hours"
                        value={duration.hours}
                        onChange={handleTimeChange}
                        className="p-2 rounded border border-gray-300 body-theme"
                      >
                        {hoursOptions.map(hour => (
                          <option key={hour} value={hour}>
                            {hour}h
                          </option>
                        ))}
                      </select>

                      <select
                        name="minutes"
                        value={duration.minutes}
                        onChange={handleTimeChange}
                        className="p-2 rounded border border-gray-300 body-theme"
                      >
                        {minutesOptions.map(min => (
                          <option key={min} value={min}>
                            {min}m
                          </option>
                        ))}
                      </select>

                      <select
                        name="seconds"
                        value={duration.seconds}
                        onChange={handleTimeChange}
                        className="p-2 rounded border border-gray-300 body-theme"
                      >
                        {secondsOptions.map(sec => (
                          <option key={sec} value={sec}>
                            {sec}s
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <p className="mt-10 font-['Encode Sans'] text-[18px] font-bold leading-[135%]">
                  Schedule type
                </p>

                <div className="flex mt-4 space-x-4">
                  <div className="flex flex-col items-stretch space-y-2">
                    <button
                      className={`flex justify-between items-center h-[52px] px-4 rounded-lg border ${
                        scheduleType === 'duration'
                          ? 'border-[#3EBF0F]'
                          : 'border-[#DFE1E6] body-theme '
                      }`}
                      onClick={() => setScheduleType('duration')}
                    >
                      <span>Duration-based</span>
                      {scheduleType === 'duration' ? (
                        <div className="w-[20px] h-[20px] flex items-center justify-center bg-[#3EBF0F] rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="11.667px"
                            height="11.667px"
                            viewBox="0 0 13 12"
                            fill="none"
                          >
                            <path
                              d="M3.09723 5.99989L5.52778 8.43045L10.3889 3.56934"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-[20px] h-[20px]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <circle cx="10" cy="10" r="9.5" stroke="#DFE1E6" />
                          </svg>
                        </div>
                      )}
                    </button>
                    <p className=" text-[12px] font-medium leading-[18px] tracking-[0.4px]">
                      Schedule based on a duration without a start and end time. Any time clocked will be counted as paid time.
                    </p>
                  </div>

                  <div className="flex flex-col items-stretch space-y-2">
                    <button
                      className={`flex justify-between items-center h-[52px] px-4 rounded-lg border ${
                        scheduleType === 'clock'
                          ? 'border-[#3EBF0F]'
                          : 'border-[#DFE1E6] body-theme '
                      }`}
                      onClick={() => setScheduleType('clock')}
                    >
                      <span>Clock-based</span>
                      {scheduleType === 'clock' ? (
                        <div className="w-[20px] h-[20px] flex items-center justify-center bg-[#3EBF0F] rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="11.667px"
                            height="11.667px"
                            viewBox="0 0 13 12"
                            fill="none"
                          >
                            <path
                              d="M3.09723 5.99989L5.52778 8.43045L10.3889 3.56934"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-[20px] h-[20px]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <circle cx="10" cy="10" r="9.5" stroke="#DFE1E6" />
                          </svg>
                        </div>
                      )}
                    </button>
                    <p className=" text-[12px] font-medium leading-[18px] tracking-[0.4px]">
                      Schedule with a fixed start and end time. Only time clocked during the schedule will be counted as paid time.
                    </p>
                  </div>
                </div>

                <p className="mt-10 mb-5 font-['Encode Sans'] text-[18px] font-bold leading-[135%]">
                  Working Time
                </p>

                <div className="w-full flex ">
                  <div className="w-full flex h-[56px] px-3 items-center  self-stretch rounded-l-[10px] bg-[#F8F9FB] dark:bg-neutral-800">
                    <p className="font-semibold text-[12px]">
                      Working Day
                    </p>
                  </div>

                  <div className="w-full flex px-3 items-center h-[56px] self-stretch rounded-r-[10px] bg-[#F8F9FB] dark:bg-neutral-800">
                    <p className="font-semibold text-[12px]">
                      Time
                    </p>
                  </div>
                </div>

                <div className='mt-3'>
                  {Object.keys(workingDaysToggle).map((day) => (
                    <div key={day} className="flex items-center gap-4">
                      <Toggle
                        isToggled={workingDaysToggle[day].isWorking}
                        onToggle={() => toggleDay(day)}
                      />
                      <span className="capitalize font-medium">{day}</span>

                      {workingDaysToggle[day].isWorking ? (
                        <div className="flex items-center gap-2 ml-auto">
                          <select
                            name="hours"
                            value={workingDaysToggle[day].customDuration?.hours || '00'}
                            onChange={(e) => handleCustomDurationChange(day, 'hours', e.target.value)}
                            className="p-2 rounded border border-gray-300 body-theme"
                          >
                            {hoursOptions.map(hour => (
                              <option key={hour} value={hour}>
                                {hour}h
                              </option>
                            ))}
                          </select>

                          <select
                            name="minutes"
                            value={workingDaysToggle[day].customDuration?.minutes || '00'}
                            onChange={(e) => handleCustomDurationChange(day, 'minutes', e.target.value)}
                            className="p-2 rounded border border-gray-300 body-theme"
                          >
                            {minutesOptions.map(min => (
                              <option key={min} value={min}>
                                {min}m
                              </option>
                            ))}
                          </select>

                          <select
                            name="seconds"
                            value={workingDaysToggle[day].customDuration?.seconds || '00'}
                            onChange={(e) => handleCustomDurationChange(day, 'seconds', e.target.value)}
                            className="p-2 rounded border border-gray-300 body-theme"
                          >
                            {secondsOptions.map(sec => (
                              <option key={sec} value={sec}>
                                {sec}s
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <span className="ml-auto">Non-working day</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-5">
                  <p className="text-center text-[16px] font-semibold leading-[1.5] tracking-[0.2px]">
                    Total Working Time: <span className="text-center text-[16px] font-semibold">{totalWorkingTime}</span>
                  </p>
                </div>
              </div>
        </div>
      </form>
    </Drawer>
  );
}
