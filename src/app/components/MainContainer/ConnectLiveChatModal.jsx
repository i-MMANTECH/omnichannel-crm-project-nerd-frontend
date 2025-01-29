import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import copy from "copy-to-clipboard";
import './IsLiveChat.css';
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import Modal from "../Modal";
import { toast } from "react-toastify";

export const ConnectLiveChatModal = ({ onCancel }) => {
  const { user } = useAuth();
  const [codeSnippet, setCodeSnippet] = useState('Script not found.');
  const [copyStatus, setCopyStatus] = useState('');
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  useEffect(() => {
    const fetchScript = async () => {
      if (user?.refresh) {
        try {
          const response = await axiosInstance.post('/channels/generate-livechat-script/',
            {},
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.access}`
              }
            }
          );

          if (response.data?.script_url) {
            setCodeSnippet(response.data.script_url);
          } 
        } catch (error) {
          handleApiError(error);
        }
      }
    };

    fetchScript();
  }, []);

  const handleCopy = () => {
    copy(codeSnippet);
    toast.info('script copied!');
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
            Copy Script
        </button>
    </div>
  );

  return (
    <Modal isOpen={true} onClose={onCancel} title="Nativetalk Chat" footer={modalFooter}>
      <div>
        <p className="mb-2">Please copy the script to embed in your website:</p>
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }} className="font-semibold">{codeSnippet}</pre>
        {copyStatus && <p>{copyStatus}</p>}
      </div>
    </Modal>
  );
};
