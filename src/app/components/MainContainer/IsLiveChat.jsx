import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import copy from "copy-to-clipboard";
import './IsLiveChat.css';

export const IsLiveChat = ({ onCancel }) => {
  const { user } = useAuth();
  const [codeSnippet, setCodeSnippet] = useState('Script not found.');
  const [copyStatus, setCopyStatus] = useState('');

  useEffect(() => {
    const fetchScript = async () => {
      if (user?.refresh) {
        try {
          const response = await axios.post(
            'http://staging.core.nativetalkcrm.com/api/channels/generate-livechat-script/',
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
          } else {
            console.error("No script_url in response:", response.data);
          }
        } catch (error) {
          console.error("Failed to fetch live chat script:", error);
        }
      }
    };

    fetchScript();
  }, []);

  const formatCodeSnippet = (snippet) => {
    return snippet.match(/.{1,30}/g).join("\n"); 
  };

  const handleCopy = () => {
    copy(codeSnippet);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus(''), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-live">
        <h1 className="title">Nativetalk Chat</h1>
        <p className="text">Please copy the script to embed in your website</p>
        <div className="code-snippet">
          <pre>
            {formatCodeSnippet(codeSnippet).split("\n").map((line, index) => (
              <h1 key={index}>{line}</h1>
            ))}
          </pre>
          <button onClick={handleCopy}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 15C9 12.1716 9 10.7574 9.87868 9.87868C10.7574 9 12.1716 9 15 9H16C18.8284 9 20.2426 9 21.1213 9.87868C22 10.7574 22 12.1716 22 15V16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H15C12.1716 22 10.7574 22 9.87868 21.1213C9 20.2426 9 18.8284 9 16V15Z" stroke="#C1C7CF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16.9999 9C16.9975 6.04291 16.9528 4.51121 16.092 3.46243C15.9258 3.25989 15.7401 3.07418 15.5376 2.90796C14.4312 2 12.7875 2 9.5 2C6.21252 2 4.56878 2 3.46243 2.90796C3.25989 3.07417 3.07418 3.25989 2.90796 3.46243C2 4.56878 2 6.21252 2 9.5C2 12.7875 2 14.4312 2.90796 15.5376C3.07417 15.7401 3.25989 15.9258 3.46243 16.092C4.51121 16.9528 6.04291 16.9975 9 16.9999" stroke="#C1C7CF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        {copyStatus && <p className="copy-status">{copyStatus}</p>}
        <div className="modal-btns">
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
          <button onClick={handleCopy} className="btn-copy">Copy Code</button>
        </div>
      </div>
    </div>
  );
};
