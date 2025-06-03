import React, { useState } from 'react';
import { Clock } from 'lucide-react';


const NotificationSettings = () => {
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

    const Toggle = ({ isToggled, onToggle }) => (
    <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        isToggled ? 'bg-[#3EBF0F]' : 'bg-[#DFE1E6]'
        }`}
    >
        <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isToggled ? 'translate-x-6' : 'translate-x-1'
        }`}
        />
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
        setChannelNotifications(prev => ({
        ...prev,
        [channel]: !prev[channel]
        }));
    };

    return (
        <div className="body-theme max-w-2x mx-a p-6 m-6">
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-6 dark:text-white">
                    In-app Notifications
                </h2>
                
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="font-medium dark:text-white">Push notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive push notifications on mentions and comments via your web app
                        </p>
                    </div>
                    <Toggle 
                        isToggled={pushNotifications} 
                        onToggle={() => setPushNotifications(!pushNotifications)} 
                    />
                </div>

                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="font-medium dark:text-white">Response Time Limit</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Set response time limit
                            </p>
                        </div>
                        <Toggle 
                        isToggled={responseTimeLimit} 
                        onToggle={() => setResponseTimeLimit(!responseTimeLimit)} 
                        />
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <p className="mt-10 mb-5 font-['Encode_Sans',sans-serif] text-[18px] font-bold leading-[135%] dark:text-white">
                    Working Time
                </p>
                
                <div className="w-full flex mb-3">
                    <div className="w-full flex h-[56px] px-3 items-center self-stretch rounded-l-[10px] bg-[#F8F9FB] dark:bg-neutral-800">
                        <p className="font-semibold text-[12px] dark:text-white">
                        Working Day
                        </p>
                    </div>
                    <div className="w-full flex px-3 items-center h-[56px] self-stretch rounded-r-[10px] bg-[#F8F9FB] dark:bg-neutral-800">
                        <p className="font-semibold text-[12px] dark:text-white">
                            Time
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {Object.keys(workingDaysToggle).map((day) => (
                        <div key={day} className="flex items-center gap-4 py-3">
                        <Toggle
                            isToggled={workingDaysToggle[day].isWorking}
                            onToggle={() => toggleDay(day)}
                        />
                        <span className="capitalize font-medium dark:text-white min-w-[80px]">
                            {day}
                        </span>
                        
                        {workingDaysToggle[day].isWorking ? (
                            <div className="ml-auto relative">
                            <div className="relative flex items-center">
                                <input
                                type="text"
                                value={workingDaysToggle[day].time}
                                onChange={(e) => handleTimeChange(day, e.target.value)}
                                placeholder="8h 00m"
                                className="pl-3 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white text-sm w-32 text-center"
                                />
                                <Clock 
                                size={16} 
                                className="absolute right-3 text-gray-400 dark:text-gray-500" 
                                />
                            </div>
                            </div>
                        ) : (
                            <span className="ml-auto text-gray-500 dark:text-gray-400 text-sm">
                            Non-working day
                            </span>
                        )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-6 dark:text-white">
                    Channel Notifications
                </h2>
                
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="font-medium dark:text-white">Slack</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receive push notifications on mentions and comments via your slack channel
                        </p>
                    </div>
                    <Toggle 
                        isToggled={channelNotifications.slack} 
                        onToggle={() => handleChannelToggle('slack')} 
                    />
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="font-medium dark:text-white">Chat</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receive push notifications on mentions and comments via your chat channel
                        </p>
                    </div>
                    <Toggle 
                        isToggled={channelNotifications.chat} 
                        onToggle={() => handleChannelToggle('chat')} 
                    />
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="font-medium dark:text-white">WhatsApp</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receive push notifications on mentions and comments via your whatsapp channel
                        </p>
                    </div>
                    <Toggle 
                        isToggled={channelNotifications.whatsapp} 
                        onToggle={() => handleChannelToggle('whatsapp')} 
                    />
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;