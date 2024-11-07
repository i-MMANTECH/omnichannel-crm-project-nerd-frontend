import React, { useState } from 'react';

const UserDetails = ({ userInfo }) => {
  const [activeTab, setActiveTab] = useState('workSchedule');

  if (!userInfo) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No user selected</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="bg-white rounded-lg border m-6 p-6">
      <div className="bg-white rounded-lg border w-full max-w-4xl">
        <div className="flex flex-col sm:flex-row p-6">
          {/* Profile Card */}
          <div style={{width: 700, height: 200}} className="flex flex-col items-center rounded-lg border p-4">
            <img style={{width: 50, height: 50}}
              src="https://via.placeholder.com/150"
              alt={userInfo.name}
              className="w-24 h-24 rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold">{userInfo.name}</h3>
            <p className="text-gray-500">{userInfo.email}</p>
            <div className="mt-2 flex items-center">
              <span className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded-lg">{userInfo.role}</span>
              <span className="ml-4 text-gray-400 text-sm">Last seen: 23m ago</span>
            </div>
          </div>

          <div className="w-full p-4">
            <div className="mb-4">
              <h4 className="text-sm ">General</h4>
              <hr/>
              <p className="text-sm text-gray-600 mt-2 flex justify-between"><strong>Role:</strong> <span className='bg-green-100 text-green-700 text-sm px-2 py-1 rounded-lg'>{userInfo.role}</span></p>
              <p className="text-sm text-gray-600 flex justify-between"><strong>Email:</strong> {userInfo.email}</p>
              <p className="text-sm text-gray-600 flex justify-between"><strong>Phone:</strong> {userInfo.phoneNumber}</p>
            </div>
            <div>
              <h4 className="text-sm ">Other Information</h4>
              <hr/>
              <p className="text-sm text-gray-600 mt-2 flex justify-between"><strong>Gender:</strong> {userInfo.gender}</p>
              <p className="text-sm text-gray-600 flex justify-between"><strong>DOB:</strong> {userInfo.dob}</p>
              <p className="text-sm text-gray-600 flex justify-between"><strong>Country:</strong> {userInfo.country}</p>
              <p className="text-sm text-gray-600 flex justify-between"><strong>State:</strong> {userInfo.state}</p>
            </div>
          </div>

        </div>
      </div>

        <div className="mt-6">
          <div className="flex border-b border-gray-300">
            <button
              onClick={() => setActiveTab('workSchedule')}
              className={`p-3 ${activeTab === 'workSchedule' ? 'border-b-2 border-green-500' : ''}`}
            >
              Work Schedule
            </button>
            <button
              onClick={() => setActiveTab('assignedMessages')}
              className={`p-3 ${activeTab === 'assignedMessages' ? 'border-b-2 border-green-500' : ''}`}
            >
              Assigned Messages
            </button>
          </div>
          
          {activeTab === 'workSchedule' && <WorkSchedule workSchedules={userInfo.workSchedules} />}
          {activeTab === 'assignedMessages' && <AssignedMessages />}
        </div>
      </div>
    </div>
  );
};

const WorkSchedule = ({ workSchedules }) => (
  <div className="mt-4">
    <h4 className="text-lg font-semibold">Work Schedule</h4>
    {workSchedules.map((schedule, index) => (
      <div key={index} className="border p-3 mt-2 rounded-lg shadow-sm">
        <p>{schedule.title}</p>
        <p>Standard Working Hours: {schedule.standardHours}</p>
        <p>Total Working Hours: {schedule.totalHours}</p>
        {schedule.dailyHours && (
          <div>
            <p>Daily Working Hours:</p>
            <ul className="list-disc ml-5">
              {Object.entries(schedule.dailyHours).map(([day, hours]) => (
                <li key={day}>{day}: {hours}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ))}
  </div>
);

const AssignedMessages = () => (
  <div className="mt-4">
    <h4 className="text-lg font-semibold">Assigned Messages</h4>
  </div>
);

export default UserDetails;
