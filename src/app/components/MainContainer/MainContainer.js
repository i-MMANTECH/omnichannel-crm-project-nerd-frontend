import React, { useState } from "react";
import { socialMediaData } from "./socialMediaData";
import "./style.css";
import { Modal } from "./Modal";
import { IsLiveChat } from "./IsLiveChat";
import Image from "next/image";

export const MainContainer = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalIcon, setModalIcon] = useState(null);
  const [isLiveChat, setIsLiveChat] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  const handleConnectClick = (title, icon) => {
    if (title === 'Nativetalk Livechat'){
      setIsLiveChat(true)
    } else {
      setModalTitle(title);
      setModalIcon(icon);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setShowDisconnectModal(false);
    setIsLiveChat(false);
  };

  return (
    <div className="main-container border-l">
      <div className="frame">
        <p className="text-wrapper">Select the channels you want to connect</p>

        <div className="div">
          {socialMediaData.map((media) => (
            <div key={media.id} className="link-account">
              <div className="name">
                <div className="icon">
                  <Image src={media.icon} alt={media.title}
                    width={50}
                    height={50}
            />
                </div>
                <div className="text">
                  <div className="title">{media.title}</div>
                  <p className="p">
                    {media.description.split("\n").map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>
              <div
                className={`chip ${media.status === "Connected" ? "connected" : ""}`}
                onClick={() => handleConnectClick(media.title, media.icon)}
              >
                <div className="title-2">{media.status}</div>
              </div>
            </div>
          ))}
        </div> 

        <Modal 
          show={showModal} 
          onClose={closeModal} 
          icon={
            <Image src={modalIcon} alt={modalTitle}
            width={60}
            height={60}
            />
            
          }
        >
          <p>Details and steps to connect to {modalTitle} go here.</p>
        </Modal>

        {isLiveChat && <IsLiveChat onCancel={closeModal} />}
      </div>
    </div>
  );
};
