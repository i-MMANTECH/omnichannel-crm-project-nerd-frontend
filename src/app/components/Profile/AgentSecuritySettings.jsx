import React, { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";
import TwoStepVerificationModal from "./TwoStepVerificationModal";

const AgentSecuritySettings = () => {
  const [isTwoStepVerification, setIsTwoStepVerification] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);

  const handleTwoStepVerificationToggle = () => {
    setIsTwoStepVerification((prev) => !prev);
  };

  const sessions = [
    {
      browser: 'Safari on Mac OS X',
      location: 'Santa Clara, California',
      status: "Current session",
    },
    {
      browser: 'Safari on Mac OS X',
      location: 'Santa Clara, California',
      status: "1 week ago",
    },
    {
      browser: 'Safari on Mac OS X',
      location: 'Santa Clara, California',
      status: "Previous session",
    },
  ];

  return (
    <div className="flex mt-5 flex-col p-6 items-start gap-4 self-stretch rounded-lg border border-[#DFE1E6]">
      <p className="text-[#0D0D12] font-semibold text-xl leading-[25.2px] tracking-[0.2px] font-encode-sans">
        Security
      </p>

      <div className="flex h-[1px] items-center gap-2 self-stretch bg-[#DFE1E6]" />

      <p className="text-[#0D0D12] font-medium text-xl leading-[25.2px] tracking-[0.2px] font-encode-sans">
        Password
      </p>

      <div className="flex justify-between w-full">
        <p className="text-[#666D80] font-medium text-sm leading-[21px] tracking-[0.2px] font-encode-sans">
          Set a password to protect your account
        </p>
        <div onClick={() => setIsModalOpen(true)} className="cursor-pointer flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[#DFE1E6] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
          Edit
        </div>
      </div>

      <div className="flex h-[1px] items-center gap-2 self-stretch bg-[#DFE1E6]" />

      <p className="text-[#0D0D12] font-medium text-xl leading-[25.2px] tracking-[0.2px] font-encode-sans">
        Two-step verification
      </p>

      <div className="flex justify-between w-full">
        <p className="text-[#666D80] font-medium text-sm leading-[21px] tracking-[0.2px] font-encode-sans">
          We recommend requiring a verification code in addition <br /> to your password
        </p>

        <div className="flex items-center gap-4">
          <div
            className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
              isTwoStepVerification ? "bg-[#3EBF0F]" : "bg-gray-300"
            }`}
            onClick={handleTwoStepVerificationToggle}
          >
            <div
              className={`w-6 h-6 rounded-full transition-transform ${
                isTwoStepVerification ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>

          <div onClick={() => setIsModalOpen2(true)} className="cursor-pointer flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[#DFE1E6] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
            Edit
          </div>
        </div>
      </div>


      <p className="text-[#0D0D12] font-medium text-xl leading-[25.2px] tracking-[0.2px] font-encode-sans">
        Authorized devices
      </p>

      <div className="flex h-[1px] items-center gap-2 self-stretch bg-[#DFE1E6]" />
      <p className="text-[#666D80] font-medium text-xs leading-[21px] tracking-[0.2px] font-encode-sans">
          These browsers and devices are currently signed in to your account. Remove any unauthorized devices
      </p>

      <div className="flex h-[1px] items-center gap-2 self-stretch bg-[#DFE1E6]" />

      {sessions.map((session, index) => (
        <React.Fragment key={index}>
          <div className="flex justify-between items-center w-full">
            <p className="text-[#0D0D12] font-medium text-sm leading-[21px] tracking-[0.2px] font-encode-sans">
              {session.browser}
            </p>
            <p className="text-[#666D80] font-medium text-sm leading-[21px] tracking-[0.2px] font-encode-sans">
              {session.location}
            </p>
            <p className="text-[#666D80] font-medium text-sm leading-[21px] tracking-[0.2px] font-encode-sans">
              {session.status}
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.5 3.75H12.5V2.5H7.5V3.75ZM2.5 6.25H3.75V16.875C3.75 17.0408 3.81585 17.1997 3.93306 17.3169C4.05027 17.4342 4.20924 17.5 4.375 17.5H15.625C15.7908 17.5 15.9497 17.4342 16.0669 17.3169C16.1842 17.1997 16.25 17.0408 16.25 16.875V6.25H17.5V5H2.5V6.25ZM7.5 8.75V13.75H8.75V8.75H7.5ZM11.25 8.75V13.75H12.5V8.75H11.25Z"
                fill="#666D80"
              />
            </svg>
          </div>
          <div className="flex h-[1px] items-center gap-2 self-stretch bg-[#DFE1E6]" />
        </React.Fragment>
      ))}

      <ChangePasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <TwoStepVerificationModal
        isOpen={isModalOpen2}
        onClose={() => setIsModalOpen2(false)}
      />
    </div>
  );
};

export default AgentSecuritySettings;
