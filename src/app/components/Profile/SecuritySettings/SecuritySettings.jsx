import React, { useState } from "react";
import SendOtpModal from "./SendOtpModal";
import VerifyOtpModal from "./VerifyOtpModal";
import ChangePasswordModal from "./ChangePasswordModal";

const SecuritySettings = () => {
  const [isTwoStepVerification, setIsTwoStepVerification] = useState(false);
  const [isSendOtpModalOpen, setIsSendOtModalOpen] = useState(false);
  const [isVerifyOtpModalOpen, setIsVerifyOtpModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  const handleTwoStepVerificationToggle = () => {
    setIsTwoStepVerification((prev) => !prev);
  };

  const handleSendOtpSuccess = () => {
    setIsSendOtModalOpen(false);
    setTimeout(() => {
      setIsVerifyOtpModalOpen(true);
    }, 100);
  };

  const handleVerifyOtpSuccess = () => {
    setIsVerifyOtpModalOpen(false);
    setTimeout(() => {
      setIsChangePasswordModalOpen(true);
    }, 100);
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
    <div className="flex mt-5 flex-col p-4 sm:p-6 items-start gap-4 self-stretch rounded-lg border border-[#DFE1E6]">
      <p className="font-semibold text-xl leading-[25.2px] tracking-[0.2px] font-encode-sans">
        Security
      </p>

      <div className="flex h-[1px] items-center gap-2 self-stretch bg-[#DFE1E6]" />

      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="font-medium text-xl leading-[25.2px] tracking-[0.2px] font-encode-sans">
            Password
          </p>
          <p className="font-medium text-sm mt-2 leading-[21px] tracking-[0.2px] font-encode-sans">
            Update your password to protect your account
          </p>
        </div>

        <button
          className="px-4 py-2 border h-fit rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 self-start sm:self-auto"
          onClick={() => setIsSendOtModalOpen(true)}
        >
          Edit
        </button>
      </div>

      <div className="hidden flex h-[1px] items-center gap-2 self-stretch bg-[#DFE1E6]" />

      <div className="hidden"> {/* remove this wrapper to show the hidden component */}
        <p className="font-medium text-xl leading-[25.2px] tracking-[0.2px] font-encode-sans">
          Two-step verification
        </p>

      <div className="flex justify-between w-full">
        <p className="font-medium text-sm leading-[21px] tracking-[0.2px] font-encode-sans">
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


      <p className="font-medium text-xl leading-[25.2px] tracking-[0.2px] font-encode-sans">
        Authorized devices
      </p>

      <div className="flex h-[1px] items-center gap-2 self-stretch bg-[#DFE1E6]" />
      <p className="font-medium text-xs leading-[21px] tracking-[0.2px] font-encode-sans">
          These browsers and devices are currently signed in to your account. Remove any unauthorized devices
      </p>

      <div className="flex h-[1px] items-center gap-2 self-stretch bg-[#DFE1E6]" />

      {sessions.map((session, index) => (
        <React.Fragment key={index}>
          <div className="flex justify-between items-center w-full">
            <p className="font-medium text-sm leading-[21px] tracking-[0.2px] font-encode-sans">
              {session.browser}
            </p>
            <p className="font-medium text-sm leading-[21px] tracking-[0.2px] font-encode-sans">
              {session.location}
            </p>
            <p className="font-medium text-sm leading-[21px] tracking-[0.2px] font-encode-sans">
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
    </div>

      <SendOtpModal
        isModalOpen={isSendOtpModalOpen}
        closeModal={() => setIsSendOtModalOpen(false)}
        goToVerifyOtp={handleSendOtpSuccess}
      />
      <VerifyOtpModal
        isModalOpen={isVerifyOtpModalOpen}
        closeModal={() => setIsVerifyOtpModalOpen(false)}
        goToChangePassword={handleVerifyOtpSuccess}
      />
      <ChangePasswordModal
        isModalOpen={isChangePasswordModalOpen}
        closeModal={() => setIsChangePasswordModalOpen(false)}
      />
      {/* <TwoStepVerificationModal
        isOpen={isModalOpen2}
        onClose={() => setIsModalOpen2(false)}
      /> */}
    </div>
  );
};

export default SecuritySettings;
