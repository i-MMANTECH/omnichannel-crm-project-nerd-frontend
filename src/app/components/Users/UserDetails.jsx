'use client'


import React, { useState, useMemo } from "react";
import AssignedMessages from "./AssignedMessages";
import WorkSchedule from "./WorkSchedule";
import './UserDetailsStyle.css';
import UserAvatar from "../UserAvatar";
import Image from "next/image";
import { getRoleStyle } from "@/utils/getRoleStyle";


export default function UserDetails({ user }) {
  const [selected, setSelected] = useState("work-schedule");


  return (
    <div className="flex justify-center mt-5">
      <div className="flex mb-5 flex-col max-w-[788px] p-8 items-center gap-6 flex-1 rounded-lg border border-gray-300 body-theme">
        <div className="user-top-content flex justify-between border w-full rounded-lg p-6 gap-3">
          <div className="px-6 py-4 flex flex-col items-center gap-1 h-fit rounded-lg border border-gray-200 body-theme">
            {user?.image && <Image
              className="user-left-image mt-2 w-10 h-10 rounded-full"
              alt="bio"
              src={user?.image}
              width={50}
              height={50}
            />}
            {!user?.image &&
              <UserAvatar
                name={user.first_name ?
                  `${user.first_name} ${user.last_name}` :
                  user.email || '--'
                }
                width="w-8"
                height="h-8"
              />
            }


            <p className="user-left-name">
              {user.first_name ?
                `${user.first_name} ${user.last_name}` : '--'
              }
            </p>
            <p className="user-left-email">{user?.email}</p>
            <div className="flex w-full mt-4 items-center justify-center">
              <p className="py-1 pl-2 pr-2 text-right text-[#40C4AA] -ml-1 font-medium text-[12px] font-normal rounded-sm">
                {user?.roles.map((role) => (
                  <span
                    key={role.id}
                    className="px-2 py-1 rounded ml-1"
                    style={getRoleStyle(role.name)}
                  >
                    {role.name}
                  </span>
                ))}
              </p>
              {user?.last_active &&
                <p className="text-right font-medium text-sm bg-[#F8F9FB] dark:bg-gray-800 px-2 py-1 rounded">
                  Last active: {user?.last_active}
                </p>
              }
            </div>
          </div>

          <div className="flex flex-1 ms-4 justify-start flex-col body-theme">
            <p className=" font-medium text-[14px] font-normal text-left">
              General
            </p>
            <hr className="w-[318px] h-[1px] bg-[#DFE1E6] mt-2" />

            <div className="flex items-center justify-between mt-2">
              <p className="font-medium text-[14px] font-normal text-left">
                Name
              </p>
              <p className="user-left-name">
                {user.first_name ?
                  `${user.first_name} ${user.last_name}` : '--'
                }
              </p>
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="font-medium text-[14px] font-normal text-left">
                Role
              </p>
              <p className="user-left-name -ml-1">
                {user?.roles.map((role) => (
                  <span
                    key={role.id}
                    className="px-2 py-1 ml-1 rounded"
                    style={getRoleStyle(role.name)}
                  >
                    {role.name}
                  </span>
                ))}
              </p>
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="font-medium text-[14px] font-normal text-left">
                Email
              </p>
              <p className="user-left-name">{user?.email || '--'}</p>
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="font-medium text-[14px] font-normal text-left">
                Phone Number
              </p>
              <p className="user-left-name">{user?.phone_number || '--'}</p>
            </div>

            {user?.gender || user?.dob || user?.country || user?.state &&
              <div>
                <p className="mt-5 text-left">
                  Other Information
                </p>
                <hr className="w-[318px] h-[1px] bg-[#DFE1E6] mt-2" />

                <div className="flex items-center justify-between mt-2">
                  {user?.gender && (
                    <>
                      <p className="font-medium text-[14px] font-normal text-left">
                        Gender
                      </p>
                      <p className="user-left-name">{user.gender}</p>
                    </>
                  )}
                </div>

                {user?.dob && (
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-medium text-[14px] leading-[21px] tracking-[0.2px] font-normal text-left">
                      DOB
                    </p>
                    <p className="user-left-name">{user.dob}</p>
                  </div>
                )}

                {user?.country && (
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-medium text-[14px] leading-[21px] tracking-[0.2px] font-normal text-left">
                      Country
                    </p>
                    <p className="user-left-name">{user.country}</p>
                  </div>
                )}

                {user?.state && (
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-medium text-[14px] leading-[21px] tracking-[0.2px] font-normal text-left">
                      State
                    </p>
                    <p className="user-left-name">{user.state}</p>
                  </div>
                )}
              </div>
            }


          </div>
        </div>

        <div className="hidden w-full">
          <div className="flex flex-selected justify-start gap-4 w-full mt-4">
            <p
              className={`cursor-pointer ${selected === "work-schedule" ? "selected" : "not-selected"}`}
              onClick={() => setSelected("work-schedule")}
            >
              Work Schedule
            </p>
            <p
              className={`cursor-pointer pb-2 px-10 ${selected === "assigned-messages" ? "selected" : "not-selected"}`}
              onClick={() => setSelected("assigned-messages")}
            >
              Assigned Messages
            </p>
          </div>

          <div className="mt-6 w-full">
            {selected === "work-schedule" && (
              <WorkSchedule />
            )}
            {selected === "assigned-messages" && (
              // <AssignedMessages/>
              <div>
                Agent has no assigned messages
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


