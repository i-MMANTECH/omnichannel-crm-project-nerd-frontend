import React from 'react';

const EscalationSettings = ({ 
    escalationSettings, 
    handleEscalationToggle, 
    tempThresholdMinutes, 
    handleThresholdMinutesChange,
    saveThresholdMinutes
}) => {
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

    return (
        <>
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-6 dark:text-white">
                    Set up your preferences for automated AI-driven escalation
                </h2>
                
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="font-medium dark:text-white">Escalation Enabled</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enable escalation for unresolved issues
                        </p>
                    </div>
                    <Toggle 
                        isToggled={escalationSettings.escalation_enabled} 
                        onToggle={() => handleEscalationToggle('escalation_enabled')} 
                    />
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="font-medium dark:text-white">Email Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Send escalation notifications via email
                        </p>
                    </div>
                    <Toggle 
                        isToggled={escalationSettings.escalation_email_enabled} 
                        onToggle={() => handleEscalationToggle('escalation_email_enabled')} 
                    />
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="font-medium dark:text-white">In app notification</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Send escalation notifications via app
                        </p>
                    </div>
                    <Toggle 
                        isToggled={escalationSettings.escalation_websocket_enabled} 
                        onToggle={() => handleEscalationToggle('escalation_websocket_enabled')} 
                    />
                </div>

                <div className="mb-6">
                    <div className="mb-4">
                        <p className="font-medium dark:text-white mb-2">Escalation Threshold (Minutes)</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            Time to wait before escalating
                        </p>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={tempThresholdMinutes}
                                onChange={(e) => handleThresholdMinutesChange(e.target.value)}
                                placeholder="1h 00m"
                                className="pl-3 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white text-sm w-32 text-center"
                            />
                         
                            <button
                                onClick={saveThresholdMinutes}
                                className="px-4 py-2 bg-[#3EBF0F] text-white text-sm font-medium rounded-lg hover:bg-[#2fa00d] transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EscalationSettings;