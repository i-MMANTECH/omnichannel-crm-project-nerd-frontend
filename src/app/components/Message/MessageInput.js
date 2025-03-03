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
        <div className="attach-icon bg-white rounded-full" onClick={handleAttachClick}>
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M17 7.75C11.8914 7.75 7.75 11.8914 7.75 17C7.75 22.1086 11.8914 26.25 17 26.25C22.1086 26.25 26.25 22.1086 26.25 17C26.25 11.8914 22.1086 7.75 17 7.75ZM6.25 17C6.25 11.0629 11.0629 6.25 17 6.25C22.9371 6.25 27.75 11.0629 27.75 17C27.75 22.9371 22.9371 27.75 17 27.75C11.0629 27.75 6.25 22.9371 6.25 17ZM14.6514 12.628C16.5129 10.7783 19.5165 10.7758 21.3704 12.6297L21.372 12.6314C23.2217 14.4929 23.2242 17.4965 21.3704 19.3503L19.1503 21.5703C18.0774 22.6432 16.3325 22.6432 15.2596 21.5703C14.1867 20.4974 14.1867 18.7525 15.2596 17.6796L16.6697 16.2696C16.9626 15.9767 17.4375 15.9768 17.7303 16.2697C18.0232 16.5625 18.0232 17.0374 17.7303 17.3303L16.3203 18.7403C15.8332 19.2274 15.8332 20.0226 16.3203 20.5097C16.8074 20.9968 17.6026 20.9968 18.0897 20.5097L20.3097 18.2897C21.5756 17.0238 21.5783 14.9679 20.3088 13.6895C19.0428 12.4244 16.9876 12.422 15.7094 13.6912L15.7086 13.692L13.2903 16.1103C12.2432 17.1574 12.2432 18.8525 13.2903 19.8996C13.5832 20.1925 13.5832 20.6674 13.2903 20.9603C12.9974 21.2532 12.5226 21.2532 12.2297 20.9603C10.5968 19.3274 10.5968 16.6825 12.2297 15.0496L14.6514 12.628Z" fill="#0D0D12"/>
          </svg>
        </div>
        {showAttachOptions && (
          <div className="attach-options top-[-85px]">
            <div
              onClick={handleFileSelect}
              className="pointer"
              >
              <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_3555_1663)">
                <rect x="10" y="5" width="50" height="50" rx="25" fill="#0D0D12"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M37 26C37 25.4477 37.4477 25 38 25H38.01C38.5623 25 39.01 25.4477 39.01 26C39.01 26.5523 38.5623 27 38.01 27H38C37.4477 27 37 26.5523 37 26Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M30 22.75C28.7574 22.75 27.75 23.7574 27.75 25V35C27.75 36.2426 28.7574 37.25 30 37.25H40C41.2426 37.25 42.25 36.2426 42.25 35V25C42.25 23.7574 41.2426 22.75 40 22.75H30ZM26.25 25C26.25 22.9289 27.9289 21.25 30 21.25H40C42.0711 21.25 43.75 22.9289 43.75 25V35C43.75 37.0711 42.0711 38.75 40 38.75H30C27.9289 38.75 26.25 37.0711 26.25 35V25Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M31.5249 29.5358L27.5303 33.5303C27.2374 33.8232 26.7626 33.8232 26.4697 33.5303C26.1768 33.2374 26.1768 32.7626 26.4697 32.4697L30.4697 28.4697L30.48 28.4596C31.0458 27.9151 31.7415 27.5801 32.5 27.5801C33.2585 27.5801 33.9542 27.9151 34.52 28.4596L34.5303 28.4697L39.5303 33.4697C39.8232 33.7626 39.8232 34.2374 39.5303 34.5303C39.2374 34.8232 38.7626 34.8232 38.4697 34.5303L33.4751 29.5358C33.1305 29.206 32.7933 29.0801 32.5 29.0801C32.2067 29.0801 31.8695 29.206 31.5249 29.5358Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M38.5249 31.5358L37.5303 32.5303C37.2374 32.8232 36.7626 32.8232 36.4697 32.5303C36.1768 32.2374 36.1768 31.7626 36.4697 31.4697L37.4697 30.4697L37.48 30.4596C38.0458 29.9151 38.7415 29.5801 39.5 29.5801C40.2585 29.5801 40.9542 29.9151 41.52 30.4596L41.5303 30.4697L43.5303 32.4697C43.8232 32.7626 43.8232 33.2374 43.5303 33.5303C43.2374 33.8232 42.7626 33.8232 42.4697 33.5303L40.4751 31.5358C40.1305 31.206 39.7933 31.0801 39.5 31.0801C39.2067 31.0801 38.8695 31.206 38.5249 31.5358Z" fill="white"/>
                </g>
                <defs>
                <filter id="filter0_d_3555_1663" x="0" y="0" width="70" height="70" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="5"/>
                <feGaussianBlur stdDeviation="5"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3555_1663"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3555_1663" result="shape"/>
                </filter>
                </defs>
              </svg>
            </div>

          </div>
        )}
        <textarea
          placeholder="Type your message..."
          className="message-input body-theme"
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
          <FontAwesomeIcon icon={faPaperPlane} color="grey"/>
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
