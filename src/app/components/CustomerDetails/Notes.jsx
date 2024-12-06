import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const dummyNotes = [
  {
    id: 1,
    text: "I have enjoyed working at Apple and am grateful for the opportunities to grow both personally and professionally during my time here. The support and guidance I received from you and the team have been invaluable, and I have gained a lot of experience and skills that I will carry forward in my career.",
    date: "10/10/2024, 10AM"
  },
  {
    id: 2,
    text: "I am excited to start a new chapter and am looking forward to what the future holds. Thank you for being part of this journey.",
    date: "11/11/2024, 2PM"
  },
  {
    id: 3,
    text: "I am excited to start a new chapter and am looking forward to what the future holds. Thank you for being part of this journey.",
    date: "11/11/2024, 2PM"
  }
];

const Notes = () => {
  return (
    <div className="space-y-4">
      {dummyNotes.map(note => (
        <div key={note.id} className="flex p-3 items-start gap-3 self-stretch rounded-lg border border-[#DFE1E6] bg-white shadow-md">
          <div className="flex w-[32px] h-[32px] p-[8px_16px] justify-center items-center gap-2 rounded-lg bg-[#F6F6F6]">
            <FontAwesomeIcon icon={faUserCircle} className="text-gray-500" />
          </div>

          <div className="flex-1">
            <p className="text-gray-800">{note.text}</p>
          </div>

          <div className="flex-shrink-0">
            <p className="text-gray-600">{note.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notes;
