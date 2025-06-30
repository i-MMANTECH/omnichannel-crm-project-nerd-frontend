import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import React, { useState } from 'react';
import Drawer from '../Drawer';

export default function WorkSchedulModal({ show, onClose }) {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [scheduleType, setScheduleType] = useState('duration-based');
  const [workingDaysToggle, setWorkingDaysToggle] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });
  
  const toggleDay = (day) => {
    setWorkingDaysToggle((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", workingDaysToggle);
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
        className="px-4 py-2 bg-[#3EBF0F] text-white rounded-lg hover:bg-green-600"
      >
        Create
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
                  className="text-sm font-semibold text-gray-700 mb-2 block"
                >
                  Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Remote"
                  className="w-full h-[52px] p-4 rounded-[12px] border border-[#DFE1E6] body-theme shadow-md focus:border-[#3EBF0F] outline-none mb-4"
                />

                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label
                      htmlFor="effectiveFrom"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Effective From
                    </label>
                    <input
                      id="effectiveFrom"
                      type="date"
                      className="w-full h-[52px] p-4 rounded-[12px] border border-[#DFE1E6] body-theme shadow-md focus:border-[#3EBF0F] outline-none"
                    />
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="workingHours"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Standard working hours/day
                    </label>
                    <select
                      id="workingHours"
                      className="w-full h-[52px] p-4 rounded-[12px] border border-[#DFE1E6] body-theme shadow-md focus:border-[#3EBF0F] outline-none"
                    >
                      <option value="8h 00m">8h 00m</option>
                      <option value="7h 30m">7h 30m</option>
                      <option value="9h 00m">9h 00m</option>
                    </select>
                  </div>
                </div>

                <p className="mt-5 font-['Encode Sans'] text-[18px] font-bold leading-[135%]">
                  Schedule type
                </p>

                <div className="flex mt-4 space-x-4">
                  <div className="flex flex-col items-stretch space-y-2">
                    <button
                      className={`flex justify-between items-center h-[52px] px-4 rounded-lg border ${
                        scheduleType === 'duration-based'
                          ? 'border-[#3EBF0F]'
                          : 'border-[#DFE1E6] body-theme text-gray-600'
                      }`}
                      onClick={() => setScheduleType('duration-based')}
                    >
                      <span>Duration-based</span>
                      {scheduleType === 'duration-based' ? (
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
                        scheduleType === 'clock-based'
                          ? 'border-[#3EBF0F]'
                          : 'border-[#DFE1E6] body-theme text-gray-600'
                      }`}
                      onClick={() => setScheduleType('clock-based')}
                    >
                      <span>Clock-based</span>
                      {scheduleType === 'clock-based' ? (
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

                <p className="mt-5 mb-5 font-['Encode Sans'] text-[18px] font-bold leading-[135%]">
                  Working Time
                </p>

                <div className="w-full flex">
                  <div className="w-full flex h-[56px] p-4 self-stretch rounded-l-[10px] bg-[#F8F9FB]">
                    <p className="font-semibold text-[12px] leading-[18px] tracking-[0.4px]">
                      Working Day
                    </p>
                  </div>

                  <div className="w-full flex h-[56px] p-4 self-stretch rounded-r-[10px] bg-[#F8F9FB]">
                    <p className="font-semibold text-[12px] leading-[18px] tracking-[0.4px]">
                      Time
                    </p>
                  </div>
                </div>

                <div>
                  {Object.keys(workingDaysToggle).map((day) => (
                    <div key={day} className="flex items-center gap-4"> 
                      <Toggle
                        isToggled={workingDaysToggle[day]}
                        onToggle={() => toggleDay(day)}
                      />
                      <span className="capitalize font-medium text-gray-700">{day}</span>

                      <div className="flex items-center gap-2 ml-auto">
                        <input
                          style={{width:'100%'}}
                          type="time"
                          id={`${day}-start-time`}
                          className="w-[80px] h-[34px] p-2 rounded-md border border-[#DFE1E6]"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-5">
                  <p 
                    className="text-center text-[16px] font-semibold leading-[1.5] tracking-[0.2px]">
                    Total Working Time: <span className="text-center text-[16px] font-semibold">40h 00m</span>
                  </p>
                </div>
              </div>
        </div>
      </form>
    </Drawer>
  );
}
