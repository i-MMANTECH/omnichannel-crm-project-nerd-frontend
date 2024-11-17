import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faClock, faTh, faSort, faFilter, faEnvelope, faCommentDots, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';


const roleStyles = {
  Manager: 'bg-[#E7FEF8] text-[#40C4AA]',
  Agent: 'bg-[#EDF9FF] text-[#1285FE]',
  'Team Member': 'bg-[#F4F0FF] text-[#936DFF]',
};

const usersData = [
  {
    id: 1,
    name: 'Ogechi Arinze',
    email: 'ogecharinze@gmail.com',
    phone: '+234 810 179 0957',
    role: 'Manager',
    comments: 15,
    lastActive: '2d',
    image: 'https://via.placeholder.com/40',
    mark: 1,
  },
  {
    id: 2,
    name: 'Samuel Johnson',
    email: 'samuelj@gmail.com',
    phone: '+234 810 123 4567',
    role: 'Agent',
    comments: 10,
    lastActive: '5d',
    image: 'https://via.placeholder.com/40',
    mark: 1,
  },
  {
    id: 3,
    name: 'Amara Eze',
    email: 'amaraeze@gmail.com',
    phone: '+234 813 123 7890',
    role: 'Team Member',
    comments: 7,
    lastActive: '3h',
    image: 'https://via.placeholder.com/40',
    mark: 1,
  },
  {
    id: 4,
    name: 'Chidi Okafor',
    email: 'chidiokafor@gmail.com',
    phone: '+234 818 456 7890',
    role: 'Manager',
    comments: 20,
    lastActive: '1w',
    image: 'https://via.placeholder.com/40',
    mark: 1,
  },
  {
    id: 5,
    name: 'Fatima Bello',
    email: 'fatimabello@gmail.com',
    phone: '+234 802 987 6543',
    role: 'Agent',
    comments: 12,
    lastActive: '12h',
    image: 'https://via.placeholder.com/40',
    mark: 1,
  },
  {
    id: 6,
    name: 'Tunde Balogun',
    email: 'tundebalogun@gmail.com',
    phone: '+234 809 345 6789',
    role: 'Team Member',
    comments: 5,
    lastActive: '30m',
    image: 'https://via.placeholder.com/40',
    mark: 1,
    isActive: true,
  },
];

const Grid = ({ searchQuery }) => {
  const [view, setView] = useState('grid');

  const filteredUsers = useMemo(() => {
    return usersData.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="p-6 min-h-screen border-l-2 border-gray-100 bg-white">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
            className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50"
          >
            <FontAwesomeIcon icon={faTh} className="text-blue-500 mr-2" />
            <span className="text-sm font-medium">{view === 'grid' ? 'List View' : 'Grid View'}</span>
          </button>
          <button className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
            <FontAwesomeIcon icon={faSort} className="text-gray-500 mr-2" />
            <span className="text-sm font-medium">Sort by</span>
          </button>
          <button className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
            <FontAwesomeIcon icon={faFilter} className="text-gray-500 mr-2" />
            <span className="text-sm font-medium">Filter</span>
          </button>
        </div>
        <button className="bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm">
          + New User
        </button>
      </div>

     {/* User Cards */}
      <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-3' : 'grid-cols-1'}`}>
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white border rounded-lg">
            <div className='flex justify-between items-center p-2 border-b'>
              <div className='flex items-center space-x-2'>
                 <Image  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                  width={100}
                  height={100}
                />
             
                <h3 className="text-lg font-semibold">{user.name}</h3>
              </div>

              <FontAwesomeIcon icon={faEllipsis} className="ml-auto cursor-pointer" />
            </div>
            
            <div className='p-2'>
              <p className="text-gray-500 mb-2">
                <FontAwesomeIcon className='mr-1' icon={faEnvelope} /> {user.email}
              </p>
              
              <p className="text-gray-500 flex items-center space-x-2 mb-2">
                <FontAwesomeIcon icon={faPhone} />
                <span>{user.phone}</span>
              </p>
              
              <div className='flex items-center'> 
                <Image src="/assets/active-Icon.png"
                  className='mr-1' 
                  alt="active icon" 
                  width={20}
                  height={20}
                />
                <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${roleStyles[user.role]} mb-2`}>
                  <span className={`inline-block w-2 h-2 mr-1 rounded-full ${user.isActive ? 'bg-purple-500' : 'bg-gray-300'}`}></span>
                  {user.role}
                </span>

              </div>

              <div className='flex justify-between items-center text-gray-500 mt-2 border-t pt-2'>
                <div className="flex items-center space-x-2">
                  <Image src="../../assets/mark-icon.png" alt="mark icon"
                      width={50}
                      height={50}
                  />
                  <span>{user.mark}</span>
                  <span style={{marginLeft: 10}}>
                    <FontAwesomeIcon icon={faCommentDots} /> {user.comments}
                  </span>
                </div>
                <span className="ml-auto">
                  <FontAwesomeIcon className='mr-1' icon={faClock} />{user.lastActive}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Grid;
