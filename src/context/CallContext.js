'use client';

import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";

const CallContext = createContext();

export const CallProvider = ({ children }) => {
    const { axiosInstance } = useApi();
    const { handleApiError } = useError();
    const [isVisible, setIsVisible] = useState(false);
    const [callData, setCallData] = useState({ phone: '', name: '', id: null, uniqueId: null });
    const [callStatus, setCallStatus] = useState("active"); // 'active' | 'ended'
    const [isCollapsed, setIsCollapsed] = useState(false);


    const startCall = async ({ phone, name, id }) => {
        try {
            const response = await axiosInstance.post('/call-center/make-call/', {
                phone_number: phone
            });
    
            const uniqueId = response.data.data?.unique_id;
            setCallData({ phone, name, id, uniqueId });
            // setIsVisible(true);
            // setCallStatus('active');
            toast.success('Call initiated successfully, unique id - ' + uniqueId);
        } catch (error) {
            handleApiError(error)
        }
    };    

    const endCall = () => setCallStatus('ended');
    const toggleMinimize = () => setIsCollapsed(prev => !prev);

    const closeCall = () => {
        setIsVisible(false);
        setCallData({ name: '', id: null });
        setCallStatus('active');
    };

    return (
        <CallContext.Provider value={{
        isVisible,
        callStatus,
        callData,
        startCall,
        endCall,
        toggleMinimize,
        closeCall,
        isCollapsed
        }}>
        {children}
        </CallContext.Provider>
    );
};

export const useCall = () => useContext(CallContext);
