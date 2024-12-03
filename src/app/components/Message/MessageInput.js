import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faPaperclip,
  faPaperPlane,
  faImage,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "./messageInput.css";

const MessageInput = ({ onInputChange, onSendMessage }) => {
  const [showAttachOptions, setShowAttachOptions] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const imageInputRef = useRef(null);

  const handleAttachClick = () => {
    setShowAttachOptions((prev) => !prev);
  };

  const handleInputChangeInternal = (e) => {
    const text = e.target.value;
    setInputText(text);
    onInputChange(e);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileSelect = () => {
    imageInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      console.log("Image file selected:", file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const messagePayload = {
      text: inputText.trim(),
    };

    onSendMessage(messagePayload);

    setInputText("");
    setSelectedImage(null);
    setShowAttachOptions(false);
  };

  return (
    <div className="type absolute bottom-0">
      <div className="write-area">
        <div className="attach-icon" onClick={handleAttachClick}>
          <FontAwesomeIcon icon={faPaperclip} />
        </div>
        {showAttachOptions && (
          <div className="attach-options">
            <FontAwesomeIcon
              icon={faImage}
              className="attach-option"
              onClick={handleFileSelect}
            />
          </div>
        )}
        <textarea
          placeholder="Write message here..."
          className="message-input text-black"
          value={inputText}
          onChange={handleInputChangeInternal}
          onKeyDown={handleKeyDown}
          rows={inputText.split("\n").length}
        />
        {selectedImage && (
          <div className="image-preview">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Preview"
              className="preview-img"
            />
            <button className="remove-image" onClick={removeSelectedImage}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        )}
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
    </div>
  );
};

export default MessageInput;
