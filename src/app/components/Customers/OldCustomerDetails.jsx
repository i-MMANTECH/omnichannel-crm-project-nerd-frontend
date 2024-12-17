'use client'


import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import CustomerAssignedMessages from "./AssignedMessages";
import Notes from "./Notes";
import './style.css';

export default function CustomerDetails({ customer }) {
  const [selected, setSelected] = useState("notes");

  return (
    <div className="flex justify-center mt-5">
      <div className="flex mb-5 flex-col max-w-[788px] p-6 items-center gap-6 flex-1 rounded-lg border border-gray-300 bg-white">
        <div style={{ borderRadius: "16px", border: "1px solid #DFE1E6", background: "#FFF" }} className="user-top-content p-4">
          <div className="w-[330px] h-[200px] flex flex-col items-center gap-1 self-stretch rounded-lg border border-gray-200 bg-white">
            <img className="user-left-image" src="/assets/user-details-image.png" />
            <p className="user-left-name">Ogechi Arinze</p>
            <p className="user-left-email">ogechiarinn@gmail.com</p>
             <div className="flex gap-6 mt-4">
              <div className="flex flex-col items-center gap-2">
                <div className="flex w-8 h-8 p-2 justify-center items-center gap-2 rounded-md border border-gray-100 bg-white shadow-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 17 16" stroke="currentColor">
                  <path d="M8.61164 9.82798L6.91797 8.13712C6.37282 7.59287 6.37282 6.71048 6.91797 6.16623C7.40516 5.67985 7.46403 4.91134 7.05658 4.35665L5.6659 2.46343C5.25421 1.90296 4.43898 1.84072 3.94671 2.33217C3.19724 3.08039 2.69543 4.07059 2.75475 5.12706C3.04456 10.2884 7.08224 13.7386 11.6484 13.9953C12.6955 14.0542 13.6707 13.5486 14.4123 12.8082C14.9119 12.3094 14.8486 11.4834 14.2789 11.0663L12.3984 9.68959C11.8428 9.28282 11.073 9.34159 10.5858 9.82798C10.0407 10.3722 9.1568 10.3722 8.61164 9.82798Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                </div>
                <span className="text-center text-gray-500 text-xs font-normal font-['Encode_Sans'] tracking-wide leading-[150%]">
                  Call
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex w-8 h-8 p-2 justify-center items-center gap-2 rounded-md border border-gray-100 bg-white shadow-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="15.47" height="15.47" viewBox="0 0 16 16" fill="none">
                  <path d="M1.8042 3.4873L6.26022 6.01705C7.88823 6.9413 8.61184 6.9413 10.2399 6.01705L14.6959 3.4873" stroke="#15161E" strokeWidth="1.2" strokeLinejoin="round"/>
                  <path d="M7.28316 12.8339C6.98259 12.83 6.68165 12.8242 6.37999 12.8166C4.35052 12.7656 3.33578 12.7401 2.60668 12.0078C1.87757 11.2755 1.8565 10.287 1.81436 8.30982C1.80082 7.67407 1.80081 7.04212 1.81436 6.40639C1.8565 4.42925 1.87757 3.44069 2.60667 2.70838C3.33578 1.97608 4.35052 1.95057 6.37998 1.89956C7.63078 1.86811 8.86928 1.86812 10.1201 1.89956C12.1496 1.95058 13.1643 1.97609 13.8934 2.7084C14.6225 3.4407 14.6436 4.42926 14.6857 6.40639C14.6919 6.69908 14.6953 6.83701 14.6958 7.03264" stroke="#15161E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12.7621 11.2229C12.7621 11.7569 12.3292 12.1898 11.7952 12.1898C11.2612 12.1898 10.8283 11.7569 10.8283 11.2229C10.8283 10.6889 11.2612 10.256 11.7952 10.256C12.3292 10.256 12.7621 10.6889 12.7621 11.2229ZM12.7621 11.2229V11.5452C12.7621 12.0792 13.195 12.5121 13.729 12.5121C14.2629 12.5121 14.6958 12.0792 14.6958 11.5452V11.2229C14.6958 9.62091 13.3972 8.32227 11.7952 8.32227C10.1932 8.32227 8.89459 9.62091 8.89459 11.2229C8.89459 12.8249 10.1932 14.1235 11.7952 14.1235" stroke="#15161E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                </div>
                <span className="text-center text-gray-500 text-xs font-normal font-['Encode_Sans'] tracking-wide leading-[150%]">
                  Email
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex w-8 h-8 p-2 justify-center items-center gap-2 rounded-md border border-gray-100 bg-white shadow-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 17 16" fill="none">
                  <path d="M6.08333 5.33333H8.08333M6.08333 8H10.0833M4.08333 2H13.4167C14.153 2 14.75 2.59431 14.75 3.32743V9.96753C14.75 10.7007 14.153 11.295 13.4167 11.295H5.73708C5.53456 11.295 5.34302 11.3866 5.2165 11.5441L3.34362 13.8748C3.14679 14.1198 2.75 13.9812 2.75 13.6675V3.32743C2.75 2.59431 3.34695 2 4.08333 2Z" stroke="#0D0D12" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                </div>
                <span className="text-center text-gray-500 text-xs font-normal font-['Encode_Sans'] tracking-wide leading-[150%]">
                  Message
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex w-8 h-8 p-2 justify-center items-center gap-2 rounded-md border border-gray-100 bg-white shadow-sm text-gray-600">
                  <FontAwesomeIcon icon={faEllipsisH} className="text-lg" />
                </div>
                <span className="text-center text-gray-500 text-xs font-normal font-['Encode_Sans'] tracking-wide leading-[150%]">
                  More
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-1 ms-4 justify-start flex-col">
            <p className="text-[#666D80] font-medium text-[14px] leading-[21px] tracking-[0.2px] font-normal text-left">
              General
            </p>
            <hr className="w-[318px] h-[1px] bg-[#DFE1E6] mt-2" />

            <div className="flex items-center justify-between mt-2">
              <p className="text-[#666D80] font-medium text-[14px] leading-[21px] tracking-[0.2px] font-normal text-left">
                Name
              </p>
              <p className="user-left-name">Ogechi Arinze</p>
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="text-[#666D80] font-medium text-[14px] leading-[21px] tracking-[0.2px] font-normal text-left">
                Role
              </p>
              <p className="user-left-name">Manager</p>
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="text-[#666D80] font-medium text-[14px] leading-[21px] tracking-[0.2px] font-normal text-left">
                Email
              </p>
              <p className="user-left-name">ogechiarinn@gmail.com</p>
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="text-[#666D80] font-medium text-[14px] leading-[21px] tracking-[0.2px] font-normal text-left">
                Phone Number
              </p>
              <p className="user-left-name">+1234567890</p>
            </div>

            <p className="text-[#666D80] mt-3 font-medium text-[14px] leading-[21px] tracking-[0.2px] font-normal text-left">
              Other Information
            </p>
            <hr className="w-[318px] h-[1px] bg-[#DFE1E6] mt-2" />

            <div className="flex items-center justify-between mt-2">
              <p className="text-[#666D80] font-medium text-[14px] leading-[21px] tracking-[0.2px] font-normal text-left">
                Gender
              </p>
              <p className="user-left-name">Female</p>
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="text-[#666D80] font-medium text-[14px] leading-[21px] tracking-[0.2px] font-normal text-left">
                DOB
              </p>
              <p className="user-left-name">January 1, 1990</p>
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="text-[#666D80] font-medium text-[14px] leading-[21px] tracking-[0.2px] font-normal text-left">
                Country
              </p>
              <p className="user-left-name">Nigeria</p>
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="text-[#666D80] font-medium text-[14px] leading-[21px] tracking-[0.2px] font-normal text-left">
                State
              </p>
              <p className="user-left-name">Lagos</p>
            </div>
          </div>
        </div>

        <div className="flex flex-selected justify-start gap-4 w-full">
          <p
            className={`cursor-pointer ${selected === "notes" ? "selected" : "not-selected"}`}
            onClick={() => setSelected("notes")}
          >
            Notes
          </p>
          <p
            className={`cursor-pointer ${selected === "messages" ? "selected" : "not-selected"}`}
            onClick={() => setSelected("messages")}
          >
            Messages
          </p>
        </div>

        <div className="mt-6 w-full">
          {selected === "notes" && (
            <Notes/>
          
          )}
          {selected === "messages" && (
            <AssignedMessages/>
          )}
        </div>
      </div>
    </div>
  );
}


