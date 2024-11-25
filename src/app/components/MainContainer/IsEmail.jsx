import React, { useEffect, useState } from "react";
import copy from "copy-to-clipboard";
import './IsLiveChat.css';
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";

export const IsEmail = ({ onCancel }) => {
  const [codeSnippet, setCodeSnippet] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const { axiosInstance, loading } = useApi();
  const { handleApiError } = useError();

  useEffect(() => {
    const fetchScript = async () => {
        try {
          const response = await axiosInstance.get('/companies/details/',
            {},
            {
              headers: {
                'Content-Type': 'application/json',
              }
            }
          );

          if (response.data.company) {
            setCodeSnippet(response.data.company.username);
          } 
        } catch (error) {
          handleApiError(error)
        }
    };

    fetchScript();
  }, []);

  const handleCopy = () => {
    copy(codeSnippet);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus(''), 2000);
  };

  return (
    <div className="modal-overlay ">
      <div className="modal-live rounded-xl body-theme">
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

        <p class="mb-3 text-center text-2xl font-bold text-black dark:text-white py-2">
          Email
        </p>

        <div className="ms-6 justify-center flex w-[382px] p-[16px_19px] items-center gap-[10px] rounded-[0px_16px_16px_16px] bg-[#F8F9FB]">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p className="text-[16px] font-normal leading-[150%] font-[Encode Sans] text-[#0D0D12]">
                Copy your forwarding email address below:
                <strong className="block text-[18px] font-bold leading-[135%]">
                  {codeSnippet}@parse.nativetalkcrm.com
                </strong>
              </p>
              <button onClick={handleCopy} disabled={!codeSnippet}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 15C9 12.1716 9 10.7574 9.87868 9.87868C10.7574 9 12.1716 9 15 9H16C18.8284 9 20.2426 9 21.1213 9.87868C22 10.7574 22 12.1716 22 15V16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H15C12.1716 22 10.7574 22 9.87868 21.1213C9 20.2426 9 18.8284 9 16V15Z" stroke="#C1C7CF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16.9999 9C16.9975 6.04291 16.9528 4.51121 16.092 3.46243C15.9258 3.25989 15.7401 3.07418 15.5376 2.90796C14.4312 2 12.7875 2 9.5 2C6.21252 2 4.56878 2 3.46243 2.90796C3.25989 3.07417 3.07418 3.25989 2.90796 3.46243C2 4.56878 2 6.21252 2 9.5C2 12.7875 2 14.4312 2.90796 15.5376C3.07417 15.7401 3.25989 15.9258 3.46243 16.092C4.51121 16.9528 6.04291 16.9975 9 16.9999" stroke="#C1C7CF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
              </button>
            </>
          )}
        </div>
        {copyStatus && <p className="copy-status">{copyStatus}</p>}

            <p className="mb-5 mt-2 text-center text-[16px] font-semibold leading-[150%] tracking-[0.2px] font-[Encode Sans]">
                Follow the instructions below
            </p>
            <p className="text-center text-[16px] font-normal leading-[150%] font-[Encode Sans]">
            Sign in to your mailbox of your company email.<br />
            Navigate to the Settings<br />
            Navigate to Forwarding & POP/IMAP<br />
            Add the copied forwarding email address
        </p>

        <button onClick={onCancel} className="mt-5 text-white  flex h-[52px] px-4 py-2 justify-center items-center gap-2 w-full rounded-[12px] bg-[var(--primary-100-base,#3EBF0F)] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
            Done
        </button>
      </div>
    </div>
  );
};
