import React, { useEffect, useState } from "react";
import "./style.css";
import { Modal } from "./Modal";
import { ConnectLiveChatModal } from "./ConnectLiveChatModal";
import Image from "next/image";
import { ConnectEmailModal } from "./ConnectEmailModal";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";

export const MainContainer = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalIcon, setModalIcon] = useState(null);
  const [isLiveChat, setIsLiveChat] = useState(false);
  const { axiosInstance, loading } = useApi();
  const [isEmail, setIsEmail] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [channels, setChannels] = useState([])
  const { handleApiError } = useError();


  const handleConnectClick = (title, icon) => {
    if (title === 'Nativetalk Livechat'){
      setIsLiveChat(true)
    } 
    else if (title === 'Email'){
      setIsEmail(true)
    } 
    else {
      setModalTitle(title);
      setModalIcon(icon);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setShowDisconnectModal(false);
    setIsLiveChat(false);
    setIsEmail(false)
  };

  useEffect(() => {
    const getChannels = async() => {
      try {
        const response = await axiosInstance.get('/channels/all/')
        console.log(response)
          
        setChannels(response.data.channels);
      } catch(error) {
        handleApiError(error)
      }
    }

    getChannels()
  }, [])


  return (
    <div className="main-container max-w-full body-theme pl-10 w-full">
      <div className="frame min-h-full">
        <p className="text-lg">Select the channels you want to connect</p>

        <div className="grid grid-cols-3 gap-x-5 justify-between w-full flex-wrap">
          {channels.map((channel) => (
            <div key={channel.id} className="rounded-lg p-4 flex mb-6 items-center border">
              <div className="flex items-center justify-between w-full h-full gap-3">
                <div >
                  <img src={channel.image} alt={channel.name}
                    width={40}
                    height={40}
                />
                </div>

                <div>
                  <div >{channel.name}</div>
                  <p className="text-sm">
                    {channel.description.split("\n").map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </p>
                </div>

                <div
                  className={`cursor-pointer chip ${channel.connected ? "connected" : ""}`}
                  onClick={() => handleConnectClick(channel.name, channel.image)}
                >
                  <div className="title-2">{channel.connected ? "Connected" : "Connect"}</div>
                </div>

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

        {isLiveChat && <ConnectLiveChatModal onCancel={closeModal} />}
        {isEmail && <ConnectEmailModal onCancel={closeModal} />}
      </div>
    </div>
  );
};
