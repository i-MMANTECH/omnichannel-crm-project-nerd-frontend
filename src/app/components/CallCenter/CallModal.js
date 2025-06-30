'use client';

import { useEffect, useRef, useState } from 'react';
import { useCall } from '@/context/CallContext';
import { MicOff, Volume2, PhoneOff } from 'lucide-react';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';

const CallModal = () => {
  const {
    isVisible,
    callStatus,
    isCollapsed,
    callData,
    endCall,
    acceptCall,
    toggleMinimize,
    closeCall,
    incoming,
    muted,
    toggleMute
  } = useCall();


  const [waitTime, setWaitTime] = useState(0);
  const [callTime, setCallTime] = useState(0);
  const [comments, setComments] = useState([]);
  const [note, setNote] = useState("");
  const { handleApiError } = useError();
  const { axiosInstance } = useApi();
 

  const intervalRef = useRef(null);


  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  
    if (callStatus === 'CONNECTED') {
      setWaitTime(0);
      setCallTime(0);
      intervalRef.current = setInterval(() => {
        setCallTime((t) => t + 1);
      }, 1000);
    } else if (callStatus === 'RINGING' || callStatus === 'INCOMING') {
      intervalRef.current = setInterval(() => {
        setWaitTime((t) => t + 1);
      }, 1000);
    }
  
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [callStatus]);
  
   const addComment = async () => {
    if (!note.trim()) return;
    
    try {
    const result =   await axiosInstance.post(`/comments/`, {
        model: "customer", 
        object_id: callData?.id, 
        content: note,
      });
     const newComment = result.data.comment;
     setComments(prev => [...prev, newComment]);
      setNote("");
    } catch (error) {
      handleApiError(error);
    }
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };
  
  if (!isVisible) return null;

  const initials =
      (callData?.name
      ? callData.name.split(' ').map(n => n[0]).join('').toUpperCase()
      : callData?.phone?.slice(0, 2)) || ''

  const timeValue = callStatus === 'CONNECTED' ? callTime : waitTime;
  const timeLabel = callStatus === 'CONNECTED' ? 'Call time' : 'Wait time';

  return (
    <div className="fixed bottom-4 right-4 w-[360px] shadow-xl rounded-xl overflow-hidden z-[9999] bg-white border">
      {/* Header */}
      <div className="bg-[#3EBF0F] text-white px-4 py-3 flex justify-between items-center">
        
        <span className="font-bold text-lg">
          {timeLabel}: {formatTime(timeValue)}
        </span>
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
          {incoming && (
            <div className="flex justify-between px-6">
              <button onClick={endCall} className="bg-red-500 text-white rounded px-3 py-2">
                Reject
              </button>
              <button onClick={acceptCall} className="bg-green-500 text-white rounded px-3 py-2">
                Accept
              </button>
            </div>
          )}
          <div className="flex items-center gap-4">
            <div className="bg-[#DFF5E1] text-[#3EBF0F] font-bold w-12 h-12 rounded-full flex items-center justify-center text-xl">
              {initials}
            </div>
            <div>
              <p className="text-lg font-semibold text-[#3EBF0F]">{callData.name}</p>
              {callStatus === 'ENDED' && (
                <p className="text-sm text-red-500 mt-1">Call ended</p>
              )}
              {callStatus === 'FAILED' && (
                <p className="text-sm text-red-500 mt-1">Call failed</p>
              )}
            </div>
          </div>

          {/* Call Controls */}
          {(callStatus == "RINGING" || callStatus == "CONNECTED") &&
            <div className="flex justify-between px-6">
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={toggleMute}
                  className={`w-12 h-12 border rounded-full flex items-center justify-center ${!muted ? 'bg-red-100' : ''}`}
                >
                  <MicOff size={18} className={!muted ? 'text-red-500' : 'text-black'} />
                </button>
                <span className="text-xs">{!muted ? 'Unmute' : 'Mute'}</span>
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
          }

          {/* Notes field (always shown when expanded, regardless of callStatus) */}
          {!isCollapsed && (
            <div >
                <label className={`${!callData?.id? 'hidden':''} block text-sm font-medium mb-1 text-gray-700`}>Comments</label>
                <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Type message..."
                rows={3}
                maxLength={200}
                className={`${!callData?.id? 'hidden':''} w-full p-3 border border-gray-300 rounded-lg text-sm`}
                />
                <div className="flex justify-between items-center mt-2 gap-2">
                  {callStatus !== "CONNECTED" && callStatus !== "RINGING" ? (
                    <button
                      onClick={closeCall}
                      className="border px-4 py-2 rounded-md text-sm"
                    >
                      Cancel
                    </button>
                  ) : (
                    <div className="w-[80px]" /> // Fixed width to match button size
                  )}

                  <button
                    onClick={addComment}
                    className={`${!callData?.id? 'hidden':''} bg-[#3EBF0F] text-white px-4 py-2 rounded-md text-sm`}
                  >
                    Save
                  </button>
                </div>
                <p className={`${!callData?.id? 'hidden':''} text-xs text-right text-gray-500 mt-1`}>
                  Word Count: {note.length}/200
                </p>
                <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                {comments.map(c => (
                  <div key={c.id} className="p-2 bg-gray-50 border rounded">
                     <p className="text-sm text-gray-800">{c.content}</p>
                     <p className="text-xs text-gray-500 mt-1">
                        {new Date(c.created_at).toLocaleString()}
                    </p>
                </div>
            ))}
</div>
            </div>
          )}
        </div>
    </div>
  );
};

export default CallModal;
