import React, { useEffect, useState } from "react";
import copy from "copy-to-clipboard";
import './IsLiveChat.css';
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import { useAuth } from "@/context/AuthContext";
import Modal from "../../Modal";
import { toast } from "react-toastify";

export const ConnectEmailModal = ({ onCancel }) => {
  const [emailForwarder, setEmailForwarder] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const { axiosInstance, loading } = useApi();
  const { handleApiError } = useError();

  const fetchEmailForwarder = async () => {
    try {
      const response = await axiosInstance.get('/companies/details/')

      if (response.data.company) {
        console.log(response.data)
        setEmailForwarder(response.data.company.email_forwarding);
      } 
    } catch (error) {
      handleApiError(error)
    }
  };

  useEffect(() => {    
    fetchEmailForwarder();
  }, []);

  const handleCopy = () => {
    copy(emailForwarder);
    toast.info('email copied!');
    setTimeout(() => setCopyStatus(''), 2000);
  };

  const modalFooter = (
    <div className="flex gap-3 w-7/12">
        <button
            type="button"
            onClick={onCancel}
            className="w-6/12 px-4 py-2 bg-theme rounded-md border border-gray-30"
        >
            Cancel
        </button>
        <button
            onClick={handleCopy}
            className="w-6/12 px-4 py-2 bg-[#3EBF0F] text-white rounded-md "
        >
            Copy
        </button>
    </div>
  );

  return (
    <Modal isOpen={true} onClose={onCancel} title="Email Forwarding" footer={modalFooter}>
      <div>
        <div className="w-full h-[105px] flex-shrink-0 flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="106" height="105" viewBox="0 0 106 105" fill="none">
            <circle cx="53" cy="52.5" r="50.1562" fill="#F8F9FB" stroke="white" strokeWidth="4.6875" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" className="absolute">
            <path d="M8.334 11.6641L6.30265 13.0183C4.84647 13.9891 4.11837 14.4745 3.72378 15.2147C3.3292 15.955 3.33213 16.8251 3.33797 18.5651C3.34502 20.6599 3.36448 22.7944 3.4184 24.9542C3.5463 30.0786 3.61027 32.6407 5.49427 34.5247C7.37827 36.4089 9.97503 36.4737 15.1686 36.6036C18.3996 36.6842 21.6019 36.6842 24.8328 36.6036C30.0264 36.4737 32.6231 36.4089 34.5071 34.5247C36.3911 32.6407 36.4551 30.0786 36.5829 24.9542C36.6369 22.7944 36.6563 20.6599 36.6634 18.5651C36.6693 16.8251 36.6721 15.955 36.2776 15.2147C35.8829 14.4745 35.1549 13.9891 33.6986 13.0183L31.6673 11.6641" stroke="#0D0D12" strokeWidth="3.33333" strokeLinejoin="round"/>
            <path d="M3.33301 16.6641L14.8547 23.5771C17.3613 25.0811 18.6147 25.8331 19.9997 25.8331C21.3847 25.8331 22.638 25.0811 25.1447 23.5771L36.6663 16.6641" stroke="#0D0D12" strokeWidth="3.33333" strokeLinejoin="round"/>
            <path d="M8.33325 19.9987V9.9987C8.33325 6.856 8.33325 5.28465 9.30957 4.30835C10.2859 3.33203 11.8572 3.33203 14.9999 3.33203H25C28.1426 3.33203 29.714 3.33203 30.6903 4.30835C31.6666 5.28465 31.6666 6.856 31.6666 9.9987V19.9987" stroke="#0D0D12" strokeWidth="3.33333"/>
            <path d="M16.667 16.6647H23.3337M16.667 9.99805H23.3337" stroke="#0D0D12" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <p className="mb-3 text-center text-2xl font-bold text-black dark:text-white py-2">
          Email
        </p>

        <div className="ms-6 justify-center border flex p-[16px_19px] items-center gap-[10px] rounded-[0px_16px_16px_16px]">
          {loading ? (
           <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gray-400"></div>
          </div>
          ) : (
            <>
              <p className="font-normal ">
                Copy your forwarding email address below:
                <strong className="block font-bold ">
                  {emailForwarder}
                </strong>
              </p>
            </>
          )}
        </div>
        {copyStatus && <p className="copy-status text-center">{copyStatus}</p>}

            <p className="mb-2 mt-5 text-center text-[16px] font-semibold leading-[150%] tracking-[0.2px] font-[Encode Sans]">
                Follow the instructions below:
            </p>
            <p className="text-center text-[16px] font-normal leading-[150%] font-[Encode Sans]">
            Sign in to your mailbox of your company email.<br />
            Navigate to the Settings<br />
            Navigate to Forwarding & POP/IMAP<br />
            Add the copied forwarding email address
        </p>
      </div>
    </Modal>
  );
};
