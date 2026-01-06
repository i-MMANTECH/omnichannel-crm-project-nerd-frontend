import React, { useEffect, useState } from "react";
import "../settingsStyles.css";
import { ConnectLiveChatModal } from "../../MainContainer/ConnectLiveChatModal";
import Image from "next/image";
import { ConnectEmailModal } from "../../MainContainer/ConnectEmailModal";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import ComingSoonModal from "@/app/components/ComingSoonModal";
import { ConnectWhatsAppModal } from "../../MainContainer/ConnectWhatsAppModal";


export const MainContainer = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [isLiveChat, setIsLiveChat] = useState(false);
  const { axiosInstance, loading } = useApi();
  const { handleApiError } = useError();
  const [isEmail, setIsEmail] = useState(false);
  const [isWhatsApp, setIsWhatsApp] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [channels, setChannels] = useState([])


  const handleConnectClick = (title, icon) => {
    const lowerCaseTitle = title.toLowerCase();
    const comingSoonChannels = ["facebook", "instagram", "sms", "telegram"];

    if (lowerCaseTitle === "whatsapp") {
      setIsWhatsApp(true);
    } else if (comingSoonChannels.includes(lowerCaseTitle)) {
      setModalTitle("Coming Soon");
      setModalContent("This feature is coming soon!");
      setShowModal(true);
    } else if (title === "Nativetalk Livechat") {
      setIsLiveChat(true);
    } else if (title === "Email") {
      setIsEmail(true);
    } else {
      setModalTitle(title);
      setModalContent("Details and steps to connect to " + title + " go here.");
      setShowModal(true);
    }
  };


  const closeModal = () => {
    setShowModal(false);
    setShowDisconnectModal(false);
    setIsLiveChat(false);
    setIsEmail(false);
    setIsWhatsApp(false);
  };

  useEffect(() => {
    const getChannels = async () => {
      try {
        const response = await axiosInstance.get('/channels/all/')

        setChannels(response.data.channels);
      } catch (error) {
        handleApiError(error)
      }
    }

    getChannels()
  }, [])


  return (
    <div className="main-container max-w-full body-theme pl-10 w-full">
      <div className="frame min-h-full">
        <h2 className="text-lg font-semibold mb-2">Channels</h2>
        <p className="text-lg">Select the channels you want to connect</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 justify-between w-full flex-wrap">
          {channels.map((channel) => (
            <div key={channel.id} className="rounded-lg p-4 flex mb-6 items-center border">
              <div className="flex items-center justify-between w-full h-full gap-3">
                <div className="rounded-full p-2 bg-[#F8F9FB]">
                  <img src={channel.image} alt={channel.name}
                    width={80}
                    height={80}
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

        <ComingSoonModal
          isOpen={showModal}
          onCancel={closeModal}
          onConfirm={closeModal}
          title={modalTitle}
          message={modalContent} />

        {isWhatsApp && <ConnectWhatsAppModal onCancel={closeModal} />}
        {isLiveChat && <ConnectLiveChatModal onCancel={closeModal} />}
        {isEmail && <ConnectEmailModal onCancel={closeModal} />}
      </div>
    </div>
  );
};
