'use client';

import { createContext, useContext, useState } from 'react';

const CallContext = createContext();

export const CallProvider = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [callData, setCallData] = useState({ name: '', id: null });
    const [callStatus, setCallStatus] = useState("active"); // 'active' | 'ended'
    const [isCollapsed, setIsCollapsed] = useState(false);


    const startCall = ({ name, id }) => {
        setCallData({ name, id });
        setCallStatus('active');
        setIsVisible(true);
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
