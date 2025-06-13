import React from 'react';
import Drawer from '../Drawer';
import { format } from 'date-fns';
import { getRoleStyle } from '@/utils/getRoleStyle';

const PlayRecordingDrawer = ({ show, onClose, cdr }) => {
  if (!cdr) return null;

  const {
    caller_id_number,
    destination_number,
    direction,
    call_status,
    call_start_time,
    total_duration,
    lead_details,
    recording_url,
  } = cdr;

  const phoneNumber = direction === 'outbound' ? destination_number : caller_id_number;
  const contactName = lead_details?.[0]?.first_name || "--";
  const status = call_status || "Unknown";

  const isValidTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return !isNaN(date.getTime());
  };

  // Safely parse call_start_time
  const timestamp = isValidTimestamp(call_start_time) ? new Date(call_start_time) : new Date();

  
  const formatDuration = (totalSeconds) => {
    const sec = parseInt(totalSeconds, 10);
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    return hours > 0
      ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleDelete = () => {
    // TODO: Add delete logic
    console.log("Delete recording:", recording_url);
  };

  const handleDownload = () => {
    if (!recording_url) return;
    const link = document.createElement('a');
    link.href = recording_url;
    link.download = "call-recording.mp3";
    link.click();
  };

  const footerContent = (
    <div className="flex justify-between w-full px-4">
      <button
        type="button"
        onClick={handleDelete}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-red-500"
      >
        Delete Recording
      </button>
      <button
        type="button"
        onClick={handleDownload}
        className="px-4 py-2 bg-[#3EBF0F] text-white rounded-lg hover:bg-green-600"
        disabled={!recording_url}
      >
        Download
      </button>
    </div>
  );

  return (
    <Drawer
      show={show}
      onClose={onClose}
      title="Call Recording"
      width="40%"
      footer={footerContent}
    >
      <div className="space-y-6 py-4">
        {/* Call Info */}
        <div className="flex justify-between items-start border rounded-lg p-4 bg-white shadow-sm">
          <div>
            <div className="mb-1">
              <span className="text-red-500 px-2 py-1 rounded text-xs font-medium"
                style={getRoleStyle(cdr.call_status)}>
                {status}
              </span>
            </div>
            <p className="font-medium text-base text-gray-800">{phoneNumber}</p>
            <p className="text-sm text-gray-500">{contactName}</p>
          </div>
          <div className="text-right text-sm text-gray-500">
            <div className="font-semibold">
              {isValidTimestamp(call_start_time) 
                ? format(timestamp, "MMMM d, yyyy h:mmaaa") 
                : "Invalid date"}
            </div>
            <div className="text-xs mt-1">{formatDuration(total_duration)}</div>
          </div>
        </div>

        {/* Audio */}
        <div className="w-full bg-[#F9FAFB] border rounded-lg p-4 shadow-sm">
          {recording_url ? (
            <audio controls src={recording_url} className="w-full">
              Your browser does not support the audio element.
            </audio>
          ) : (
            <div className="text-sm text-gray-500">No recording available.</div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default PlayRecordingDrawer;
