import React from 'react';
import UserAvatar from '../UserAvatar';
import Image from 'next/image';

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
    <div className="space-y-4 hidden">
      {dummyNotes.map(note => (
        <div key={note.id} className="flex p-3 items-start gap-3 self-stretch rounded-lg border border-[#DFE1E6] body-theme shadow-md">
          {note?.user?.image && <Image 
              alt="profile pic"
              width={8}
              height={8}
              className="customer-left-image mt-2 w-8 h-8 rounded-full" 
              src={note?.user?.image} 
              />}
          {!note?.user?.image && <UserAvatar name={note?.user?.first_name ? `${note?.user.first_name} ${note?.user.last_name}`: '--'} width="w-8" height="h-8" />}

          <div className="flex-1">
            <p className='pr-4'>{note.text}</p>
          </div>

          <div className="flex-shrink-0">
            <p >{note.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notes;
