import React, { useEffect, useState } from "react";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import Modal from "../Modal";
import './IsLiveChat.css';

export const ConnectWhatsAppModal = ({ onCancel }) => {
    const { axiosInstance, loading } = useApi();
    const { handleApiError } = useError();
    const [channel, setChannel] = useState(null);

    useEffect(() => {
      const getChannel = async() => {
        try {
          const {data} = await axiosInstance.get('/channels/all/')
          const whatsappChannel  = data.channels.find(c => c.name === "WhatsApp")
          setChannel(whatsappChannel);
        } catch(error) {
          handleApiError(error)
        }
      }
  
      getChannel()
    }, [])

  const modalFooter = (
    <div className="flex gap-3 w-7/12">
      <button
        type="button"
        onClick={onCancel}
        className="w-full px-4 py-2 bg-theme rounded-md border border-gray-30"
      >
        Close
      </button>
    </div>
  );

  return (
    <Modal isOpen={true} onClose={onCancel} title="WhatsApp Channel" footer={modalFooter}>
     {loading ? ( 
        <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gray-400"></div>
        </div>
     ) : (
         <div>
         <div className="w-full h-[105px] flex-shrink-0 flex justify-center items-center mb-2">
         <img src={channel?.image} alt={channel?.name}
             width={80}
             height={80}
         />
         </div>
 
         <p className="body-theme mb-3 text-center text-2xl font-bold">
           WhatsApp
         </p>
 
         <div className="ms-6 justify-center flex p-[16px_19px] items-center">
             {
               channel?.connected ? (
                <p className="text-lg font-medium text-center me-5">Your WhatsApp is Connected</p>
            ) : (
                <p className="text-lg font-medium text-center">
                    Your request has been received! <br />
                    We’ll review it and get back to you on WhatsApp.
                </p>
            )
             }
         </div>
       </div>
     )}
    </Modal>
  );
};
