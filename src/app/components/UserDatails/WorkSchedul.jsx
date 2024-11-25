import {useState} from 'react';

export default function WorkSchedul() {
    const [isToggled1, setIsToggled1] = useState(true);
    const [isToggled2, setIsToggled2] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [scheduleType, setScheduleType] = useState("duration-based");
  
    const handleToggle1 = () => setIsToggled1(!isToggled1);
    const handleToggle2 = () => setIsToggled2(!isToggled2);
  
    const workingHoursData = [
      { day: "Monday", hours: "8h 00m" },
      { day: "Tuesday", hours: "8h 00m" },
      { day: "Wednesday", hours: "8h 00m" },
      { day: "Thursday", hours: "8h 00m" },
      { day: "Friday", hours: "8h 00m" },
    ];

    const [workingDaysToggle, setWorkingDaysToggle] = useState({
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    });

    const toggleDay = (day) => {
      setWorkingDaysToggle((prev) => ({
        ...prev,
        [day]: !prev[day],
      }));
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

    const handleTimeChange = (day, value) => {
      console.log(`Changing time for ${day} to ${value}`);
    };

    const handleAddSchedule = () => {
      console.log("Submit");
    }

    return (
     <div>
         <div className="flex flex-col items-start gap-4 self-stretch p-6 rounded-xl border border-[#C1C7CF] bg-white">
            <div className="flex justify-between items-center w-full">
              <p className="text-[#0D0D12] font-['Encode Sans'] text-xl font-semibold leading-[25.2px] tracking-[0.2px]">
                Work Schedule
              </p>
              <svg className="cursor-pointer" onClick={() => setIsModalVisible(!isModalVisible)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 25" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M15.2705 3.52661C16.4373 3.37742 17.6177 3.85453 18.8171 4.98308L18.8185 4.98439C20.0219 6.12248 20.5698 7.27697 20.4876 8.45285C20.4082 9.5891 19.7495 10.5508 18.9984 11.3444M18.9984 11.3444L10.7924 20.0301C10.5611 20.282 10.2496 20.4953 9.9543 20.6532C9.65521 20.8131 9.30924 20.95 8.98445 21.0077L8.97946 21.0086L5.76061 21.5584C4.98004 21.693 4.23154 21.4979 3.69834 20.9923C3.16589 20.4873 2.9306 19.751 3.01777 18.9665L3.01802 18.9642L3.38962 15.7102C3.43278 15.3865 3.553 15.0362 3.69471 14.7323C3.83591 14.4295 4.02856 14.1085 4.25654 13.8658L4.258 13.8642L12.468 5.17425C13.2195 4.38037 14.1431 3.67079 15.2705 3.52661M13.5578 6.20491L5.34981 14.8928C5.26784 14.9803 5.15524 15.1495 5.05415 15.3663C4.95489 15.5791 4.89527 15.7761 4.8774 15.9026L4.50859 19.1321L4.50848 19.1332C4.46597 19.5181 4.5856 19.7664 4.73052 19.9039C4.87481 20.0407 5.12631 20.1456 5.50575 20.0802L5.5069 20.08L8.72401 19.5305C8.84928 19.5079 9.0423 19.4399 9.24706 19.3304C9.45464 19.2194 9.61079 19.0997 9.68896 19.014L9.69792 19.0042L17.908 10.3142C18.5767 9.6079 18.9482 8.96425 18.9913 8.34826C19.0315 7.7718 18.7945 7.02654 17.7887 6.075C16.7884 5.13401 16.034 4.94121 15.4608 5.0145C14.8484 5.09281 14.2262 5.49903 13.5578 6.20491Z" fill="#666D80"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M11.5277 6.39825C11.937 6.33448 12.3205 6.61457 12.3842 7.02385C12.7614 9.44447 14.7259 11.2971 17.1683 11.5431C17.5805 11.5846 17.8809 11.9523 17.8394 12.3645C17.7979 12.7766 17.4301 13.077 17.018 13.0355C13.9005 12.7215 11.385 10.3541 10.9021 7.25476C10.8384 6.84548 11.1184 6.46201 11.5277 6.39825Z" fill="#666D80"/>
              </svg>
            </div>
            <hr className="custom-hr" />
  
            <div style={{width:600, margin:'auto'}}>
              <div className="flex justify-between items-center">
                <div className="flex justify-between">
                  <p className="me-2 text-[#0D0D12] font-['Encode Sans'] text-[18px] font-semibold leading-[25.2px] tracking-[0.2px]">
                    Mon-Fri, Duration 40 hours/week
                  </p>
  
                  <span className="flex items-center justify-center gap-1 px-2 py-1 rounded-[4px] bg-[#EEEFF2] text-[#666D80] font-['Encode Sans'] text-[12px] font-medium leading-[18px] tracking-[0.4px] text-right">
                    <span className="w-[4px] h-[4px] bg-[#666D80] rounded-full"></span>
                    Default
                  </span>
                </div>
  
                <div className="flex justify-between">
                  <div
                    className={`me-2 toggle-container ${isToggled1 ? "toggled" : "untoggled"}`}
                    onClick={handleToggle1}
                    >
  
                    <div className={`toggle-circle ${isToggled1 ? "toggled-circle" : "untoggled-circle"}`} />
                  </div>
  
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 25"
                      fill="none"
                      className="cursor-pointer"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.29289 8.79289C5.68342 8.40237 6.31658 8.40237 6.70711 8.79289L12 14.0858L17.2929 8.79289C17.6834 8.40237 18.3166 8.40237 18.7071 8.79289C19.0976 9.18342 19.0976 9.81658 18.7071 10.2071L12.7071 16.2071C12.3166 16.5976 11.6834 16.5976 11.2929 16.2071L5.29289 10.2071C4.90237 9.81658 4.90237 9.18342 5.29289 8.79289Z"
                        fill="#666D80"
                      />
                    </svg>

                </div>
              </div>
  
              <hr className="custom-hr mt-2" />
              <div className="p-4">
                <div className="mb-2 flex">
                  <p className="text-gray-600 font-medium">Standard working hours/day</p>
                  <p className="ms-10 font-bold text-black">8h 00m</p>
                </div>
  
                <div className="mb-2 flex">
                  <p className="text-gray-600 font-medium">Total working hours/week</p>
                  <p className="ms-14 font-bold text-black">40h 00m</p>
                </div>
  
                <div>
                  <p className="text-gray-600 font-medium">Daily working hours</p>
                  <div className="mt-2">
                    {workingHoursData.map((item, index) => (
                      <div
                        style={{ width: 440 }}
                        key={index}
                        className="flex justify-between items-center mb-1">
                        <p className="text-gray-600 flex-1">{item.day}</p>
                        <p className="font-bold text-black flex-1 text-right">{item.hours}</p>
                        <span className="text-gray-600 flex-1 text-right">8h 00m</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="mt-5 flex flex-col items-start gap-4 w-[740px] p-6 rounded-xl border border-[#C1C7CF] bg-white">
            <div className="flex justify-between w-full">
              <p className="me-2 text-[#0D0D12] font-['Encode Sans'] text-[18px] font-semibold leading-[25.2px] tracking-[0.2px]">
                Mon-Fri, Duration 40 hours/week
              </p>
  
              <div className="flex">
                <div
                  className={`me-2 toggle-container ${isToggled2 ? "toggled" : "untoggled"}`}
                  onClick={handleToggle2}
                >
                  <div className={`toggle-circle ${isToggled2 ? "toggled-circle" : "untoggled-circle"}`} />
                </div>
                
                <svg className="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 25" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.29289 8.79289C5.68342 8.40237 6.31658 8.40237 6.70711 8.79289L12 14.0858L17.2929 8.79289C17.6834 8.40237 18.3166 8.40237 18.7071 8.79289C19.0976 9.18342 19.0976 9.81658 18.7071 10.2071L12.7071 16.2071C12.3166 16.5976 11.6834 16.5976 11.2929 16.2071L5.29289 10.2071C4.90237 9.81658 4.90237 9.18342 5.29289 8.79289Z"
                      fill="#666D80"
                    />
                  </svg>
              </div>
            </div>
          </div>

          {isModalVisible && (
            <div
              style={{
                height: '100vh',
                overflow: 'hidden',
              }}
              className="fixed top-0 left-0 right-0 inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            >
              <div
                className="bg-white p-6 rounded-xl w-[90%] sm:w-[600px]"
                style={{
                  maxHeight: '95vh',
                  overflowY: 'auto',
                }}
              >
                <h2 className="text-[18px] font-bold mb-4">Add New Work Schedule</h2>

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
                  className="w-full h-[52px] p-4 rounded-[12px] border border-[#DFE1E6] bg-white shadow-md focus:border-[#3EBF0F] outline-none mb-4"
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
                      className="w-full h-[52px] p-4 rounded-[12px] border border-[#DFE1E6] bg-white shadow-md focus:border-[#3EBF0F] outline-none"
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
                      className="w-full h-[52px] p-4 rounded-[12px] border border-[#DFE1E6] bg-white shadow-md focus:border-[#3EBF0F] outline-none"
                    >
                      <option value="8h 00m">8h 00m</option>
                      <option value="7h 30m">7h 30m</option>
                      <option value="9h 00m">9h 00m</option>
                    </select>
                  </div>
                </div>

                <p className="mt-5 text-[#0D0D12] font-['Encode Sans'] text-[18px] font-bold leading-[135%]">
                  Schedule type
                </p>

                <div className="flex mt-4 space-x-4">
                  <div className="flex flex-col items-stretch space-y-2">
                    <button
                      className={`flex justify-between items-center h-[52px] px-4 rounded-lg border ${
                        scheduleType === 'duration-based'
                          ? 'border-[#3EBF0F]'
                          : 'border-[#DFE1E6] bg-white text-gray-600'
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
                    <p className="text-[#353849] text-[12px] font-medium leading-[18px] tracking-[0.4px]">
                      Schedule based on a duration without a start and end time. Any time clocked will be counted as paid time.
                    </p>
                  </div>

                  <div className="flex flex-col items-stretch space-y-2">
                    <button
                      className={`flex justify-between items-center h-[52px] px-4 rounded-lg border ${
                        scheduleType === 'clock-based'
                          ? 'border-[#3EBF0F]'
                          : 'border-[#DFE1E6] bg-white text-gray-600'
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
                    <p className="text-[#353849] text-[12px] font-medium leading-[18px] tracking-[0.4px]">
                      Schedule with a fixed start and end time. Only time clocked during the schedule will be counted as paid time.
                    </p>
                  </div>
                </div>

                <p className="mt-5 mb-5 text-[#0D0D12] font-['Encode Sans'] text-[18px] font-bold leading-[135%]">
                  Working Time
                </p>

                <div className="w-full flex">
                  <div className="w-full flex h-[56px] p-4 self-stretch rounded-l-[10px] bg-[#F8F9FB]">
                    <p className="text-[#353849] font-semibold text-[12px] leading-[18px] tracking-[0.4px]">
                      Working Day
                    </p>
                  </div>

                  <div className="w-full flex h-[56px] p-4 self-stretch rounded-r-[10px] bg-[#F8F9FB]">
                    <p className="text-[#353849] font-semibold text-[12px] leading-[18px] tracking-[0.4px]">
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
                    className="text-[#0D0D12] text-center font-['Encode_Sans'] text-[16px] font-semibold leading-[1.5] tracking-[0.2px]">
                    Total Working Time: <span className="text-[#3EBF0F] text-center font-['Encode_Sans'] text-[16px] font-semibold leading-[1.5] tracking-[0.2px]">40h 00m</span>
                  </p>

                  <div className="flex gap-4">
                    <button
                      className="px-6 py-2 border border-[#DFE1E6] bg-[#FFF] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] rounded-md"
                      onClick={() => setIsModalVisible(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-2 bg-[#3EBF0F] text-white rounded-md"
                      onClick={handleAddSchedule}
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
     </div>
    );
  }
  