import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faPaperclip,
  faPaperPlaneTop,
} from "@fortawesome/free-solid-svg-icons";
import './messageInput.css';

const MessageInput = ({ message, onInputChange, onSendMessage }) => {
  const handleFileSelect = () => {
    alert("File selected!");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="type">
      <div className="write-area">
        <label htmlFor="file-input" className="attach-icon">
          <FontAwesomeIcon icon={faPaperclip} />
        </label>
        <input
          id="file-input"
          type="file"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
        <input
          type="text"
          placeholder="Write message here..."
          className="message-input"
          value={message}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <button className="send-button" onClick={onSendMessage}>
        <FontAwesomeIcon icon={faPaperPlaneTop} /> send
      </button>
      <button className="send-button">
        <FontAwesomeIcon icon={faMicrophone} />
      </button>
    </div>
  );
};

export default MessageInput;
