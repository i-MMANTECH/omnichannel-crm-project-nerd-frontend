import React from 'react';
import { PhoneOff } from 'lucide-react';

const CallCenterNotActivated = ({ message = "Call Center Not Activated" }) => {
  return (
    <div className="flex flex-col justify-center items-center h-[80vh] space-y-4 p-6 text-center">
      <PhoneOff size={35} className="text-gray-400 dark:text-gray-500" />
      <h2 className="text-lg font-semibold mt-3">{message}</h2>
      <p className="max-w-md">Subscribe to activate the call center module and manage calls directly within your CRM.</p>
      <button
        disabled
        className="mt-4 px-6 py-2 bg-green-500 text-white rounded opacity-50 cursor-not-allowed"
      >
        Subscribe to Call Center
      </button>
    </div>
  );
};

export default CallCenterNotActivated;
