import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faPaperclip,
  faPaperPlane,
  faUser,
  faFile,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import './messageInput.css';

const MessageInput = ({ onInputChange, onSendMessage }) => {
  const [showAttachOptions, setShowAttachOptions] = useState(false);
  const [inputText, setInputText] = useState("");

  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const handleFileSelect = (type) => {
    if (type === "user") {
      console.log("User file selected!");
    } else if (type === "document") {
      documentInputRef.current.click();
    } else if (type === "image") {
      imageInputRef.current.click();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        e.preventDefault();
        setInputText((prevText) => prevText + "\n");
      } else {
        e.preventDefault();
        sendMessage();
      }
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    onInputChange(e);
  };

  const handleAttachClick = () => {
    setShowAttachOptions(!showAttachOptions);
  };

  const sendMessage = () => {
    if (inputText.trim()) {
      onSendMessage(inputText); 
      setInputText(""); 
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Image file selected:", file);
    }
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Document file selected:", file);
    }
  };

  return (
    <div className="type">
      <div className="write-area">
        <div className="attach-icon" onClick={handleAttachClick}>
          <FontAwesomeIcon icon={faPaperclip} />
        </div>
        {showAttachOptions && (
          <div className="attach-options">
            <FontAwesomeIcon icon={faUser} className="attach-option" onClick={() => handleFileSelect("user")} />
            <FontAwesomeIcon icon={faFile} className="attach-option" onClick={() => handleFileSelect("document")} />
            <FontAwesomeIcon icon={faImage} className="attach-option" onClick={() => handleFileSelect("image")} />
          </div>
        )}
        <textarea
          placeholder="Write message here..."
          className="message-input"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          rows={inputText.split("\n").length}
        />
      </div>
      {inputText ? (
        <button className="send-button" onClick={sendMessage}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      ) : (
        <button className="send-button">
          <FontAwesomeIcon icon={faMicrophone} />
        </button>
      )}

      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={imageInputRef}
        onChange={handleImageChange}
      />
      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        style={{ display: "none" }}
        ref={documentInputRef}
        onChange={handleDocumentChange}
      />
    </div>
  );
};

export default MessageInput;
