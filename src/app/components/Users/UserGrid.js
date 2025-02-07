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
import { getRoleStyle } from '@/utils/getRoleStyle';
import Image from 'next/image';
import { timeAgo } from '@/utils/timeUtils';

const UserGrid = ({ users }) => {
  console.log(users)
  return (
    <div className="  body-theme overflow-auto">
    {users?.length > 0 ? (  
        <div className="grid gap-6 grid-cols-3">
          {users.map((user) => (
            <Link key={user.id} style={{color:"inherit", textDecoration:"none"}} href={`/nativecrm/users/${user.id}`}>
            <div className="body-theme border rounded-lg">
              <div className="flex justify-between items-center p-2 border-b">
                <div className="flex items-center space-x-2">
                  <UserAvatar 
                      name={user.first_name ? 
                        `${user.first_name} ${user.last_name}` : 
                        user.email || '--'
                      } 
                      width="w-8" 
                      height="h-8" 
                    />
                    <span>{user.first_name ? 
                        `${user.first_name} ${user.last_name}` : 
                        user.email || '--'
                      } </span>
                </div>
              </div>

              <div className="p-2">
                <div className="flex items-center mb-2 gap-2 items-center">
                  <Image
                      src="/assets/mail.svg"
                      alt="Roles"
                      width={22}
                      height={22}
                      />
                  {user.email}
                </div>
                <div className="flex items-center mb-2 gap-2 items-center">
                    <Image
                      src="/assets/phone.svg"
                      alt="Roles"
                      width={22}
                      height={22}
                      />
                  <span>{user.phone_number}</span>
                </div>
                <div className="flex items-center mb-2 gap-2 items-center">
                  <Image
                      src="/assets/flash.svg"
                      alt="Roles"
                      width={22}
                      height={22}
                      />
                  <span
                    className={`inline-block py-1 rounded-full text-sm font-medium ${getRoleStyle[user.role]} `}
                  >
                    {user?.roles.map((role) => (
                          <span
                            key={role.id}
                            className="px-2 py-1 ml-1 rounded"
                            style={getRoleStyle(role.name)}
                          >
                            {role.name}
                          </span>
                        ))}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4 border-t pt-2">
                  <span className="ml-auto flex flex-row gap-2 text-sm">
                    <Image
                      src="/assets/clock.svg"
                      alt="Roles"
                      width={20}
                      height={20}
                      />
                    {user?.last_active ? timeAgo(user.last_active) : '--'}
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
