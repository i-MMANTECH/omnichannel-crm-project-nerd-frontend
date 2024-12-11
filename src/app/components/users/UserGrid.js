import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone,
  faClock,
  faTh,
  faSort,
  faFilter,
  faEnvelope,
  faCommentDots,
  faEllipsis,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link'; 
import NoDataFound from '../NoDataFound';
import empty from '/public/assets/empty.svg'
import UserAvatar from '../UserAvatar';


const roleStyles = {
    Admin: 'bg-[#E7FEF8] text-[#40C4AA]',
    Agent: 'bg-[#EDF9FF] text-[#1285FE]',
    'Team Member': 'bg-[#F4F0FF] text-[#936DFF]',
  };


const UserGrid = ({ searchQuery, users }) => {
  return (
    <div className="p-6  body-theme overflow-auto">
    {users?.length > 0 ? (  
        <div className="grid gap-6 grid-cols-3">
          {users.map((user) => (
            <Link key={user.id} style={{color:"inherit", textDecoration:"none"}} href={`/nativecrm/users/${user.id}`}>
            <div className="body-theme border rounded-lg">
              <div className="flex justify-between items-center p-2 border-b">
                <div className="flex items-center space-x-2">
                  <UserAvatar
                      name={user.name || "--"}
                    />
                  <h3 className="text-lg font-semibold">{user.name || '--'}</h3>
                </div>
                <FontAwesomeIcon
                  icon={faEllipsis}
                  className="ml-auto cursor-pointer"
                />
              </div>

              <div className="p-2">
                <p className="mb-2">
                  <FontAwesomeIcon className="mr-1" icon={faEnvelope} />{' '}
                  {user.email}
                </p>
                <p className="flex items-center space-x-2 mb-2">
                  <FontAwesomeIcon icon={faPhone} />
                  <span>{user.phone_number}</span>
                </p>
                <div className="flex items-center">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${roleStyles[user.role]} mb-2`}
                  >
                    <span
                      className={`inline-block w-2 h-2 mr-1 rounded-full ${
                        user.isActive ? 'bg-purple-500' : 'bg-gray-300'
                      }`}
                    ></span>
                    {users.roles?.map((role) => (
                      role?.name
                    ))}                    
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 border-t pt-2">
                  {/* <div className="flex items-center space-x-2">
                    <span>{user.mark}</span>
                    <span>
                      <FontAwesomeIcon icon={faCommentDots} /> {user.comments}
                    </span>
                  </div> */}
                  <span className="ml-auto">
                    <FontAwesomeIcon className="mr-1" icon={faClock} />
                    {user.lastActive || '--'}
                  </span>
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
    ): (
        <div className="min-h-96 flex items-center justify-center">
          <NoDataFound message='You do not have any users' icon={empty} />
        </div>
    )}
    </div>
  );
};

export default UserGrid;
