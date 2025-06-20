'use client';

import { useEffect, useState } from 'react';
import { useCall } from '@/context/CallContext';
import { MicOff, Volume2, PhoneOff } from 'lucide-react';

const CallModal = () => {
  const {
    isVisible,
    callStatus,
    isCollapsed,
    callData,
    endCall,
    toggleMinimize,
    closeCall,
  } = useCall();

  const [callTime, setCallTime] = useState(0);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (callStatus !== 'active') return;
    const interval = setInterval(() => setCallTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!isVisible) return null;

  const initials =
    callData?.name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'NA';

  return (
    <div className="fixed bottom-4 right-4 w-[360px] shadow-xl rounded-xl overflow-hidden z-[9999] bg-white border">
      {/* Header */}
      <div className="bg-[#3EBF0F] text-white px-4 py-3 flex justify-between items-center">
        <span className="font-bold text-lg">{formatTime(callTime)}</span>
        <button
          onClick={toggleMinimize}
          className="w-6 h-6 flex items-center justify-center bg-white text-[#3EBF0F] rounded-full"
        >
          {isCollapsed ? '▼' : '▲'}
        </button>
      </div>

      {/* Body */}
        <div className="p-5 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="bg-[#DFF5E1] text-[#3EBF0F] font-bold w-12 h-12 rounded-full flex items-center justify-center text-xl">
              {initials}
            </div>
            <div>
              <p className="text-lg font-semibold text-[#3EBF0F]">{callData.name}</p>
              {callStatus === 'ended' && (
                <p className="text-sm text-red-500 mt-1">Call ended</p>
              )}
            </div>
          </div>

          {/* Call Controls */}
            <div className="flex justify-between px-6">
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 border rounded-full flex items-center justify-center">
                  <MicOff size={18} />
                </div>
                <span className="text-xs">Mute</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 border rounded-full flex items-center justify-center">
                  <Volume2 size={18} />
                </div>
                <span className="text-xs">Speaker</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={endCall}
                  className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center"
                >
                  <PhoneOff size={18} />
                </button>
                <span className="text-xs">End</span>
              </div>
            </div>
       

          {/* Notes field (always shown when expanded, regardless of callStatus) */}
          {!isCollapsed && (
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Comments</label>
                <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Type message..."
                rows={3}
                maxLength={200}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                />
                <div className="flex justify-between mt-2">
                <button
                    onClick={closeCall}
                    className="border px-4 py-2 rounded-md text-sm"
                >
                    Cancel
                </button>
                <button
                    className="bg-[#3EBF0F] text-white px-4 py-2 rounded-md text-sm"
                >
                    Save
                </button>
                </div>
                <p className="text-xs text-right text-gray-500 mt-1">
                Word Count: {note.length}/200
                </p>
            </div>
            )}
        </div>
    </div>
  );
};

export default CallModal;
