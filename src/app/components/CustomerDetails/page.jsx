import React, { useState } from "react";
import './style.css';

export default function Page({ user }) {
  const [selected, setSelected] = useState("notes");

  return (
    <div className="flex justify-center mt-5">
      <div className="flex mb-5 flex-col max-w-[788px] p-6 items-center gap-6 flex-1 rounded-lg border border-gray-300 bg-white">
        <div style={{ borderRadius: "16px", border: "1px solid #DFE1E6", background: "#FFF" }} className="user-top-content p-4">
          <div className="user-left flex flex-col items-center gap-1 self-stretch rounded-lg border border-gray-200 bg-white">
            <img className="user-left-image" src="/assets/user-details-image.png" />
            <p className="user-left-name">Ogechi Arinze</p>
            <p className="user-left-email">ogechiarinn@gmail.com</p>
            <div className="user-flex-role">
              <p className="pt-1 pb-1 pl-2 pr-2 text-right text-[#40C4AA] font-medium text-[12px] leading-[18px] tracking-[0.4px] font-normal bg-[#E7FEF8] rounded-sm">
                Manager
              </p>
              <p className="text-right text-[#808897] font-medium text-xs leading-6 tracking-wide">
                Last seen: 23m ago
              </p>
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

        
      </div>
    </div>
  );
}


