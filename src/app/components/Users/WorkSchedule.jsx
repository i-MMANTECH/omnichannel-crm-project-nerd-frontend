import {useState, useEffect} from 'react';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';
import WorkScheduleModal from './WorkScheduleModal';
import { useParams } from 'next/navigation';

export default function WorkSchedule() {
    const { axiosInstance, loading: apiLoading } = useApi();
    const { handleApiError } = useError();
    const { id } = useParams()
    const [isToggled1, setIsToggled1] = useState(true);
    const [isToggled2, setIsToggled2] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeSchedule, setActiveSchedule] = useState()
    const [inactiveSchedules, setInactiveSchedules] = useState([])
    const [expandedSchedules, setExpandedSchedules] = useState({});
    const [toggleStates, setToggleStates] = useState({});
    const [selectedSchedule, setSelectedSchedule] = useState('')
  
    const handleToggle1 = () => setIsToggled1(!isToggled1);


    useEffect(() => {
      fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
      try {
        const response = await axiosInstance.get(`/work-management/work-schedules/user/${id}`);
        setActiveSchedule(response.data.schedules.find(schedule => schedule.is_active))
        setInactiveSchedules(response.data.schedules.filter(schedule => !schedule.is_active))
      } catch (error) {
        handleApiError(error);
      }
    };

    const handleAddNewSchedule = () => {
      setSelectedSchedule(null);
      setIsModalVisible(true);
    };

    const handleEditWorkSchedule = (schedule) => {
      setSelectedSchedule(schedule);
      setIsModalVisible(true);
    };

    const handleToggle = async (scheduleId) => {
      try {
        setToggleStates(prev => {
          const newStates = {};
          Object.keys(prev).forEach(key => {
            newStates[key] = false;
          });
          newStates[scheduleId] = !prev[scheduleId];
          return newStates;
        });
    
        if (!toggleStates[scheduleId]) {
          await axiosInstance.post(`/work-management/work-schedules/${scheduleId}/activate/`);

          await fetchSchedules();
        }
      } catch (error) {
        setToggleStates(prev => ({
          ...prev,
          [scheduleId]: !prev[scheduleId]
        }));
        handleApiError(error);
      }
    };

    const handleExpand = (scheduleId) => {
      setExpandedSchedules(prev => ({
        ...prev,
        [scheduleId]: !prev[scheduleId]
      }));
    };

    return (
     <div>
        {(() => {
          if (activeSchedule && activeSchedule.schedule_type === "duration") {
            return (
              <div className="flex flex-col items-start gap-4 self-stretch p-6 rounded-xl border border-[#C1C7CF] body-theme">
                <div className="mb-6 flex justify-end w-full">
                  <button 
                    onClick={handleAddNewSchedule}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-[#3EBF0F]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Add New Schedule
                  </button>
                </div>
                
                <div className="flex justify-between items-center w-full">
                  <p className="text-xl font-semibold">
                    Work Schedule
                  </p>
                </div>
                <hr className="custom-hr" />
      
                <div style={{width:600, margin:'auto'}}>
                  <div className="flex justify-between items-center">
                    <div className="flex justify-between">
                      <p className="me-2 text-[18px] font-semibold">
                        {activeSchedule.name}, <span>Duration {activeSchedule?.total_weekly_hours} hours/week</span>
                      </p>
      
                      <span className="flex items-center justify-center gap-1 px-2 py-1 rounded-[4px] bg-[#E7FEF8] text-[12px] font-medium leading-[18px] tracking-[0.4px] text-right">
                        <span className="w-[4px] h-[4px] bg-[#40C4AA] rounded-full"></span>
                        <span className='text-[#40C4AA]'>Active</span>
                      </span>
                    </div>
      
                    <div className="flex justify-between gap-3">
                      <div
                        className={`me-2 toggle-container ${isToggled1 ? "toggled" : "untoggled"}`}
                        onClick={handleToggle1}
                        >
                        <div className={`toggle-circle ${isToggled1 ? "toggled-circle" : "untoggled-circle"}`} />
                      </div>

                      <svg className="cursor-pointer" onClick={() => handleEditWorkSchedule(activeSchedule)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 25" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M15.2705 3.52661C16.4373 3.37742 17.6177 3.85453 18.8171 4.98308L18.8185 4.98439C20.0219 6.12248 20.5698 7.27697 20.4876 8.45285C20.4082 9.5891 19.7495 10.5508 18.9984 11.3444M18.9984 11.3444L10.7924 20.0301C10.5611 20.282 10.2496 20.4953 9.9543 20.6532C9.65521 20.8131 9.30924 20.95 8.98445 21.0077L8.97946 21.0086L5.76061 21.5584C4.98004 21.693 4.23154 21.4979 3.69834 20.9923C3.16589 20.4873 2.9306 19.751 3.01777 18.9665L3.01802 18.9642L3.38962 15.7102C3.43278 15.3865 3.553 15.0362 3.69471 14.7323C3.83591 14.4295 4.02856 14.1085 4.25654 13.8658L4.258 13.8642L12.468 5.17425C13.2195 4.38037 14.1431 3.67079 15.2705 3.52661M13.5578 6.20491L5.34981 14.8928C5.26784 14.9803 5.15524 15.1495 5.05415 15.3663C4.95489 15.5791 4.89527 15.7761 4.8774 15.9026L4.50859 19.1321L4.50848 19.1332C4.46597 19.5181 4.5856 19.7664 4.73052 19.9039C4.87481 20.0407 5.12631 20.1456 5.50575 20.0802L5.5069 20.08L8.72401 19.5305C8.84928 19.5079 9.0423 19.4399 9.24706 19.3304C9.45464 19.2194 9.61079 19.0997 9.68896 19.014L9.69792 19.0042L17.908 10.3142C18.5767 9.6079 18.9482 8.96425 18.9913 8.34826C19.0315 7.7718 18.7945 7.02654 17.7887 6.075C16.7884 5.13401 16.034 4.94121 15.4608 5.0145C14.8484 5.09281 14.2262 5.49903 13.5578 6.20491Z" fill="#666D80"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M11.5277 6.39825C11.937 6.33448 12.3205 6.61457 12.3842 7.02385C12.7614 9.44447 14.7259 11.2971 17.1683 11.5431C17.5805 11.5846 17.8809 11.9523 17.8394 12.3645C17.7979 12.7766 17.4301 13.077 17.018 13.0355C13.9005 12.7215 11.385 10.3541 10.9021 7.25476C10.8384 6.84548 11.1184 6.46201 11.5277 6.39825Z" fill="#666D80"/>
                      </svg>
                    </div>
                  </div>
      
                  <hr className="custom-hr mt-2" />
                  <div className="p-4">
                    <div className="mb-2 flex">
                      <p className="font-medium">Standard working hours/day</p>
                      <p className="ms-10 font-bold">{activeSchedule?.standard_duration}</p>
                    </div>
      
                    <div className="mb-2 flex">
                      <p className="font-medium">Total working hours/week</p>
                      <p className="ms-14 font-bold">{activeSchedule.total_weekly_hours}</p>
                    </div>
      
                    <div>
                      <p className="font-medium">Daily working hours</p>
                      <div className="mt-2">
                        {activeSchedule.working_days.map((item, index) => (
                          <div
                            style={{ width: 440 }}
                            key={index}
                            className="flex justify-between items-center mb-1">
                            <p className="flex-1">{item.day}</p>
                            <p className="font-bold flex-1 text-right">{item.hours}</p>
                            <span className=" flex-1 text-right">{item?.custom_duration ? item.custom_duration : activeSchedule.standard_duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          } 
          else if (activeSchedule) {
            return (
              <div className="flex flex-col items-start gap-4 self-stretch p-6 rounded-xl border border-[#C1C7CF] body-theme">
                <div className="flex justify-between items-center w-full">
                  <p className="text-xl font-semibold">
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
                      <p className="me-2 text-[18px] font-semibold">
                        {activeSchedule.name}, <span>Duration {activeSchedule?.total_weekly_hours} hours/week</span>
                      </p>
      
                      <span className="flex items-center justify-center gap-1 px-2 py-1 rounded-[4px] bg-[#E7FEF8] text-[12px] font-medium leading-[18px] tracking-[0.4px] text-right">
                        <span className="w-[4px] h-[4px] bg-[#40C4AA] rounded-full"></span>
                        <span className='text-[#40C4AA]'>Active</span>
                      </span>
                    </div>
      
                    <div className="flex justify-between">
                      <div
                        className={`me-2 toggle-container ${isToggled1 ? "toggled" : "untoggled"}`}
                        onClick={handleToggle1}
                        >
      
                        <div className={`toggle-circle ${isToggled1 ? "toggled-circle" : "untoggled-circle"}`} />
                      </div>
                      <svg className="cursor-pointer" onClick={() => handleEditWorkSchedule(activeSchedule)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 25" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M15.2705 3.52661C16.4373 3.37742 17.6177 3.85453 18.8171 4.98308L18.8185 4.98439C20.0219 6.12248 20.5698 7.27697 20.4876 8.45285C20.4082 9.5891 19.7495 10.5508 18.9984 11.3444M18.9984 11.3444L10.7924 20.0301C10.5611 20.282 10.2496 20.4953 9.9543 20.6532C9.65521 20.8131 9.30924 20.95 8.98445 21.0077L8.97946 21.0086L5.76061 21.5584C4.98004 21.693 4.23154 21.4979 3.69834 20.9923C3.16589 20.4873 2.9306 19.751 3.01777 18.9665L3.01802 18.9642L3.38962 15.7102C3.43278 15.3865 3.553 15.0362 3.69471 14.7323C3.83591 14.4295 4.02856 14.1085 4.25654 13.8658L4.258 13.8642L12.468 5.17425C13.2195 4.38037 14.1431 3.67079 15.2705 3.52661M13.5578 6.20491L5.34981 14.8928C5.26784 14.9803 5.15524 15.1495 5.05415 15.3663C4.95489 15.5791 4.89527 15.7761 4.8774 15.9026L4.50859 19.1321L4.50848 19.1332C4.46597 19.5181 4.5856 19.7664 4.73052 19.9039C4.87481 20.0407 5.12631 20.1456 5.50575 20.0802L5.5069 20.08L8.72401 19.5305C8.84928 19.5079 9.0423 19.4399 9.24706 19.3304C9.45464 19.2194 9.61079 19.0997 9.68896 19.014L9.69792 19.0042L17.908 10.3142C18.5767 9.6079 18.9482 8.96425 18.9913 8.34826C19.0315 7.7718 18.7945 7.02654 17.7887 6.075C16.7884 5.13401 16.034 4.94121 15.4608 5.0145C14.8484 5.09281 14.2262 5.49903 13.5578 6.20491Z" fill="#666D80"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M11.5277 6.39825C11.937 6.33448 12.3205 6.61457 12.3842 7.02385C12.7614 9.44447 14.7259 11.2971 17.1683 11.5431C17.5805 11.5846 17.8809 11.9523 17.8394 12.3645C17.7979 12.7766 17.4301 13.077 17.018 13.0355C13.9005 12.7215 11.385 10.3541 10.9021 7.25476C10.8384 6.84548 11.1184 6.46201 11.5277 6.39825Z" fill="#666D80"/>
                      </svg>
                    </div>
                  </div>
      
                  <hr className="custom-hr mt-2" />
                  <div className="p-4">
                    <div className="mb-2 flex">
                      <p className="font-medium">Standard working hours/day</p>
                      <p className="ms-10 font-bold">{activeSchedule?.standard_start_time} - {activeSchedule?.standard_end_time}</p>
                    </div>
      
                    <div className="mb-2 flex">
                      <p className="font-medium">Total working hours/week</p>
                      <p className="ms-10 font-bold">{activeSchedule?.total_weekly_hours}</p>
                    </div>
      
                    <div>
                      <p className="font-medium">Daily working hours</p>
                      <div className="mt-2">
                        {activeSchedule.working_days.map((item, index) => (
                          <div
                            style={{ width: 440 }}
                            key={index}
                            className="flex justify-between items-center mb-1">
                            <p className="flex-1">{item.day}</p>
                            <p className="font-bold flex-1 text-right">{item.hours}</p>
                            <span className=" flex-1 text-right">{item?.custom_start_time ?  `${item.custom_start_time} - ${item.custom_end_time}` : `${activeSchedule.standard_start_time} - ${activeSchedule.standard_end_time}`}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }})()}
  
  
          {inactiveSchedules.map((schedule, index) => {
              if (schedule.schedule_type === "duration") {
                return (
                    <div key={index} className="mt-5 flex flex-col items-start gap-4 w-[740px] p-6 rounded-xl border border-[#C1C7CF] body-theme">
                      <div className="flex justify-between w-full">
                        <p className="me-2 font-['Encode Sans'] text-[18px] font-semibold leading-[25.2px] tracking-[0.2px]">
                          {schedule.name}, Duration {schedule.total_weekly_hours} hours/week
                        </p>
            
                        <div className="flex gap-3">
                          <div
                            className={`me-2 toggle-container ${toggleStates[schedule.id] ? "toggled" : "untoggled"}`}
                            onClick={() => handleToggle(schedule.id)}
                          >
                            <div className={`toggle-circle ${toggleStates[schedule.id] ? "toggled-circle" : "untoggled-circle"}`} />
                          </div>
                          <svg className="cursor-pointer" onClick={() => handleEditWorkSchedule(schedule)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 25" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M15.2705 3.52661C16.4373 3.37742 17.6177 3.85453 18.8171 4.98308L18.8185 4.98439C20.0219 6.12248 20.5698 7.27697 20.4876 8.45285C20.4082 9.5891 19.7495 10.5508 18.9984 11.3444M18.9984 11.3444L10.7924 20.0301C10.5611 20.282 10.2496 20.4953 9.9543 20.6532C9.65521 20.8131 9.30924 20.95 8.98445 21.0077L8.97946 21.0086L5.76061 21.5584C4.98004 21.693 4.23154 21.4979 3.69834 20.9923C3.16589 20.4873 2.9306 19.751 3.01777 18.9665L3.01802 18.9642L3.38962 15.7102C3.43278 15.3865 3.553 15.0362 3.69471 14.7323C3.83591 14.4295 4.02856 14.1085 4.25654 13.8658L4.258 13.8642L12.468 5.17425C13.2195 4.38037 14.1431 3.67079 15.2705 3.52661M13.5578 6.20491L5.34981 14.8928C5.26784 14.9803 5.15524 15.1495 5.05415 15.3663C4.95489 15.5791 4.89527 15.7761 4.8774 15.9026L4.50859 19.1321L4.50848 19.1332C4.46597 19.5181 4.5856 19.7664 4.73052 19.9039C4.87481 20.0407 5.12631 20.1456 5.50575 20.0802L5.5069 20.08L8.72401 19.5305C8.84928 19.5079 9.0423 19.4399 9.24706 19.3304C9.45464 19.2194 9.61079 19.0997 9.68896 19.014L9.69792 19.0042L17.908 10.3142C18.5767 9.6079 18.9482 8.96425 18.9913 8.34826C19.0315 7.7718 18.7945 7.02654 17.7887 6.075C16.7884 5.13401 16.034 4.94121 15.4608 5.0145C14.8484 5.09281 14.2262 5.49903 13.5578 6.20491Z" fill="#666D80"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M11.5277 6.39825C11.937 6.33448 12.3205 6.61457 12.3842 7.02385C12.7614 9.44447 14.7259 11.2971 17.1683 11.5431C17.5805 11.5846 17.8809 11.9523 17.8394 12.3645C17.7979 12.7766 17.4301 13.077 17.018 13.0355C13.9005 12.7215 11.385 10.3541 10.9021 7.25476C10.8384 6.84548 11.1184 6.46201 11.5277 6.39825Z" fill="#666D80"/>
                          </svg>
                          <svg 
                          className="cursor-pointer" 
                          onClick={() => handleExpand(schedule.id)}
                          xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 25" fill="none">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.29289 8.79289C5.68342 8.40237 6.31658 8.40237 6.70711 8.79289L12 14.0858L17.2929 8.79289C17.6834 8.40237 18.3166 8.40237 18.7071 8.79289C19.0976 9.18342 19.0976 9.81658 18.7071 10.2071L12.7071 16.2071C12.3166 16.5976 11.6834 16.5976 11.2929 16.2071L5.29289 10.2071C4.90237 9.81658 4.90237 9.18342 5.29289 8.79289Z"
                                fill="#666D80"
                              />
                            </svg>
                        </div>
                      </div>

                      {expandedSchedules[schedule.id] && (
                      <>
                        <hr className="custom-hr mt-2" />
                        <div className="p-4">
                          <div className="mb-2 flex">
                            <p className="font-medium">Standard working hours/day</p>
                            <p className="ms-10 font-bold">{schedule?.standard_duration}</p>
                          </div>

                          <div className="mb-2 flex">
                            <p className="font-medium">Total working hours/week</p>
                            <p className="ms-14 font-bold">{schedule.total_weekly_hours}</p>
                          </div>

                          <div>
                            <p className="font-medium">Daily working hours</p>
                            <div className="mt-2">
                              {schedule.working_days.map((item, index) => (
                                <div
                                  style={{ width: 440 }}
                                  key={index}
                                  className="flex justify-between items-center mb-1">
                                  <p className="flex-1">{item.day}</p>
                                  <p className="font-bold flex-1 text-right">{item.hours}</p>
                                  <span className="flex-1 text-right">{item?.custom_duration ? item.custom_duration : schedule.standard_duration}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    </div>
                  )
                }
                else {
                  return (
                    <div key={index} className="mt-5 flex flex-col items-start gap-4 w-[740px] p-6 rounded-xl border border-[#C1C7CF] body-theme">
                      <div className="flex justify-between w-full">
                        <p className="me-2 font-['Encode Sans'] text-[18px] font-semibold leading-[25.2px] tracking-[0.2px]">
                          {schedule.name}, Duration {schedule.total_weekly_hours} hours/week
                        </p>
            
                        <div className="flex gap-3">
                          <div
                            className={`me-2 toggle-container ${toggleStates[schedule.id] ? "toggled" : "untoggled"}`}
                            onClick={() => handleToggle(schedule.id)}
                          >
                            <div className={`toggle-circle ${toggleStates[schedule.id] ? "toggled-circle" : "untoggled-circle"}`} />
                          </div>
                          <svg className="cursor-pointer" onClick={() => handleEditWorkSchedule(schedule)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 25" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M15.2705 3.52661C16.4373 3.37742 17.6177 3.85453 18.8171 4.98308L18.8185 4.98439C20.0219 6.12248 20.5698 7.27697 20.4876 8.45285C20.4082 9.5891 19.7495 10.5508 18.9984 11.3444M18.9984 11.3444L10.7924 20.0301C10.5611 20.282 10.2496 20.4953 9.9543 20.6532C9.65521 20.8131 9.30924 20.95 8.98445 21.0077L8.97946 21.0086L5.76061 21.5584C4.98004 21.693 4.23154 21.4979 3.69834 20.9923C3.16589 20.4873 2.9306 19.751 3.01777 18.9665L3.01802 18.9642L3.38962 15.7102C3.43278 15.3865 3.553 15.0362 3.69471 14.7323C3.83591 14.4295 4.02856 14.1085 4.25654 13.8658L4.258 13.8642L12.468 5.17425C13.2195 4.38037 14.1431 3.67079 15.2705 3.52661M13.5578 6.20491L5.34981 14.8928C5.26784 14.9803 5.15524 15.1495 5.05415 15.3663C4.95489 15.5791 4.89527 15.7761 4.8774 15.9026L4.50859 19.1321L4.50848 19.1332C4.46597 19.5181 4.5856 19.7664 4.73052 19.9039C4.87481 20.0407 5.12631 20.1456 5.50575 20.0802L5.5069 20.08L8.72401 19.5305C8.84928 19.5079 9.0423 19.4399 9.24706 19.3304C9.45464 19.2194 9.61079 19.0997 9.68896 19.014L9.69792 19.0042L17.908 10.3142C18.5767 9.6079 18.9482 8.96425 18.9913 8.34826C19.0315 7.7718 18.7945 7.02654 17.7887 6.075C16.7884 5.13401 16.034 4.94121 15.4608 5.0145C14.8484 5.09281 14.2262 5.49903 13.5578 6.20491Z" fill="#666D80"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M11.5277 6.39825C11.937 6.33448 12.3205 6.61457 12.3842 7.02385C12.7614 9.44447 14.7259 11.2971 17.1683 11.5431C17.5805 11.5846 17.8809 11.9523 17.8394 12.3645C17.7979 12.7766 17.4301 13.077 17.018 13.0355C13.9005 12.7215 11.385 10.3541 10.9021 7.25476C10.8384 6.84548 11.1184 6.46201 11.5277 6.39825Z" fill="#666D80"/>
                          </svg>
                          <svg 
                          className="cursor-pointer" 
                                  onClick={() => handleExpand(schedule.id)}
                                  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 25" fill="none">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.29289 8.79289C5.68342 8.40237 6.31658 8.40237 6.70711 8.79289L12 14.0858L17.2929 8.79289C17.6834 8.40237 18.3166 8.40237 18.7071 8.79289C19.0976 9.18342 19.0976 9.81658 18.7071 10.2071L12.7071 16.2071C12.3166 16.5976 11.6834 16.5976 11.2929 16.2071L5.29289 10.2071C4.90237 9.81658 4.90237 9.18342 5.29289 8.79289Z"
                                fill="#666D80"
                              />
                            </svg>
                        </div>
                      </div>

                      {expandedSchedules[schedule.id] && (
                        <>
                        <hr className="custom-hr mt-2" />
                        <div className="p-4">
                          <div className="mb-2 flex">
                            <p className="font-medium">Standard working hours/day</p>
                            <p className="ms-10 font-bold">{schedule?.standard_start_time} - {schedule?.standard_end_time}</p>
                          </div>
            
                          <div className="mb-2 flex">
                            <p className="font-medium">Total working hours/week</p>
                            <p className="ms-14 font-bold">{schedule.total_weekly_hours}</p>
                          </div>
            
                          <div>
                            <p className="font-medium">Daily working hours</p>
                            <div className="mt-2">
                              {schedule.working_days.map((item, index) => (
                                <div
                                  style={{ width: 440 }}
                                  key={index}
                                  className="flex justify-between items-center mb-1">
                                  <p className="flex-1">{item.day}</p>
                                  <p className="font-bold flex-1 text-right">{item.hours}</p>
                                  <span className=" flex-1 text-right">{item?.custom_start_time ?  `${item.custom_start_time} - ${item.custom_end_time}` : `${schedule.standard_start_time} - ${schedule.standard_end_time}`}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        </>
                      )}
                    </div>
                  )}              
            })
          }
          

          {isModalVisible && 
            <WorkScheduleModal 
            schedule={selectedSchedule}
            show={isModalVisible} 
            onClose={() => setIsModalVisible(false)}
            />}
     </div>
    );
  }